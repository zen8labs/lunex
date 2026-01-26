import React, { useState } from 'react';
import { Plus, Server } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/ui/atoms/button/button';
import { EmptyState } from '@/ui/atoms/empty-state';
import { ConfirmDialog } from '@/ui/molecules/ConfirmDialog';
import { ScrollArea } from '@/ui/atoms/scroll-area';
import { useAppDispatch } from '@/app/hooks';
import { SectionHeader } from '@/ui/molecules/SectionHeader';
import { MCPServerConnectionCard } from './MCPServerConnectionCard';
import { MCPServerConnectionDialog } from './MCPServerConnectionDialog';
import {
  useGetMCPConnectionsQuery,
  useCreateMCPConnectionMutation,
  useConnectMCPConnectionMutation,
  useDisconnectMCPConnectionMutation,
  useUpdateMCPConnectionMutation,
  useRemoveMCPConnectionMutation,
} from '../hooks/useMCPConnections';
import {
  showError,
  showSuccess,
} from '@/features/notifications/state/notificationSlice';

import type {
  MCPServerConnection,
  PythonRuntimeStatus,
  NodeRuntimeStatus,
} from '../types';

import { invokeCommand, TauriCommands } from '@/lib/tauri';
import { logger } from '@/lib/logger';

export function MCPServerConnections() {
  const { t } = useTranslation('settings');
  const dispatch = useAppDispatch();

  // RTK Query Hooks
  const { data: mcpConnections = [], refetch: refetchConnections } =
    useGetMCPConnectionsQuery();
  const [createConnection] = useCreateMCPConnectionMutation();
  const [connectConnection] = useConnectMCPConnectionMutation();
  const [disconnectConnection] = useDisconnectMCPConnectionMutation();
  const [updateConnection] = useUpdateMCPConnectionMutation();
  const [removeConnection] = useRemoveMCPConnectionMutation();

  const [editingConnection, setEditingConnection] =
    useState<MCPServerConnection | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [connectionToDelete, setConnectionToDelete] = useState<string | null>(
    null
  );
  const [pythonRuntimes, setPythonRuntimes] = useState<PythonRuntimeStatus[]>(
    []
  );
  const [nodeRuntimes, setNodeRuntimes] = useState<NodeRuntimeStatus[]>([]);
  const [runtimesLoading, setRuntimesLoading] = useState(false);

  React.useEffect(() => {
    const loadRuntimes = async () => {
      setRuntimesLoading(true);
      try {
        const [pyStatus, nodeStatus] = await Promise.all([
          invokeCommand<PythonRuntimeStatus[]>(
            TauriCommands.GET_PYTHON_RUNTIMES_STATUS
          ),
          invokeCommand<NodeRuntimeStatus[]>(
            TauriCommands.GET_NODE_RUNTIMES_STATUS
          ),
        ]);
        setPythonRuntimes(pyStatus);
        setNodeRuntimes(nodeStatus);
      } catch (error) {
        logger.error('Failed to load runtimes:', error);
      } finally {
        setRuntimesLoading(false);
      }
    };
    if (dialogOpen) {
      loadRuntimes();
    } else {
      // Reset loading state when dialog closes
      setRuntimesLoading(false);
    }
  }, [dialogOpen]);

  const handleAdd = () => {
    setEditingConnection(null);
    setDialogOpen(true);
  };

  const handleEdit = (connection: MCPServerConnection) => {
    setEditingConnection(connection);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!connectionToDelete) return;

    try {
      await removeConnection(connectionToDelete).unwrap();
      setDeleteDialogOpen(false);
      setConnectionToDelete(null);
      dispatch(
        showSuccess(t('connectionDeleted'), t('connectionDeletedDescription'))
      );
    } catch (error) {
      logger.error('Error deleting MCP connection:', error);
      dispatch(showError(t('cannotDeleteConnection')));
    }
  };

  const handleReload = async (connection: MCPServerConnection) => {
    try {
      // Update status to "connecting" immediately before starting connection
      await invokeCommand(TauriCommands.UPDATE_MCP_SERVER_STATUS, {
        id: connection.id,
        status: 'connecting',
        toolsJson: null,
        errorMessage: null,
      });

      // Invalidate cache to update UI immediately
      refetchConnections();

      // Start connection in background (don't await to avoid blocking UI)
      connectConnection({
        id: connection.id,
        url: connection.url,
        type: connection.type,
        headers: connection.headers,
        env_vars: connection.env_vars,
        runtime_path: connection.runtime_path,
      }).catch((error) => {
        logger.error('Error reloading MCP connection:', error);
        dispatch(showError(t('cannotReloadConnection')));
      });
    } catch (error) {
      logger.error('Error updating MCP status:', error);
      dispatch(showError(t('cannotReloadConnection')));
    }
  };

  const handleDisconnect = async (connection: MCPServerConnection) => {
    try {
      await disconnectConnection(connection.id).unwrap();

      dispatch(
        showSuccess(
          t('connectionDisconnected', { name: connection.name }),
          t('connectionDisconnectedDescription')
        )
      );
    } catch (error) {
      logger.error('Error disconnecting MCP connection:', error);
      dispatch(showError(t('cannotDisconnectConnection')));
    }
  };

  const handleSave = async (connection: Omit<MCPServerConnection, 'id'>) => {
    try {
      if (editingConnection) {
        // Update existing connection
        const result = await updateConnection({
          id: editingConnection.id,
          connection: {
            name: connection.name,
            url: connection.url,
            type: connection.type,
            headers: connection.headers,
            env_vars: connection.env_vars,
            runtime_path: connection.runtime_path,
            tools: connection.tools,
          },
        }).unwrap();

        // Close dialog immediately
        setDialogOpen(false);
        setEditingConnection(null);

        // Show success notification
        dispatch(showSuccess(t('connectionSaved'), t('mcpConnectionUpdated')));

        // If connection needs reconnect
        if (result.needsReconnect) {
          connectConnection({
            id: editingConnection.id,
            url: connection.url,
            type: connection.type,
            headers: connection.headers,
            env_vars: connection.env_vars,
            runtime_path: connection.runtime_path,
          }).catch((error) => {
            logger.error('Error reconnecting MCP server:', error);
          });
        }

        return; // Exit early for updates
      } else {
        // Create new connection
        const result = await createConnection(connection).unwrap();

        // Close dialog immediately
        setDialogOpen(false);
        setEditingConnection(null);

        // Show success notification
        dispatch(
          showSuccess(t('connectionSaved'), t('newMCPConnectionCreated'))
        );

        // Start async connection immediately in background
        connectConnection({
          id: result.id,
          url: connection.url,
          type: connection.type,
          headers: connection.headers,
          env_vars: connection.env_vars,
          runtime_path: connection.runtime_path,
        }).catch((error) => {
          logger.error('Error connecting MCP server:', error);
        });

        return; // Exit early for new connections
      }
    } catch (error) {
      logger.error('Error saving MCP connection:', error);
      dispatch(showError(t('cannotSaveConnection')));
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <SectionHeader>
        <Button onClick={handleAdd} size="sm">
          <Plus className="mr-2 size-4" />
          {t('addConnection')}
        </Button>
      </SectionHeader>

      {mcpConnections.length === 0 ? (
        <EmptyState icon={Server} title={t('noConnections')} />
      ) : (
        <ScrollArea className="flex-1 min-h-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {mcpConnections.map((connection) => (
              <MCPServerConnectionCard
                key={connection.id}
                connection={connection}
                onEdit={handleEdit}
                handleDisconnect={handleDisconnect}
                handleReload={handleReload}
              />
            ))}
          </div>
        </ScrollArea>
      )}

      <MCPServerConnectionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        connection={editingConnection}
        onSave={handleSave}
        onDelete={
          editingConnection
            ? () => {
                setConnectionToDelete(editingConnection.id);
                setDialogOpen(false);
                setDeleteDialogOpen(true);
              }
            : undefined
        }
        pythonRuntimes={pythonRuntimes}
        nodeRuntimes={nodeRuntimes}
        runtimesLoading={runtimesLoading}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        connectionName={
          mcpConnections.find((c) => c.id === connectionToDelete)?.name
        }
      />
    </div>
  );
}

function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  connectionName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  connectionName?: string;
}) {
  const { t } = useTranslation(['settings', 'common']);

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('deleteConnection')}
      description={t('deleteConnectionConfirm', { name: connectionName })}
      onConfirm={onConfirm}
      confirmLabel={t('delete', { ns: 'common' })}
      cancelLabel={t('cancel', { ns: 'common' })}
      variant="destructive"
    />
  );
}
