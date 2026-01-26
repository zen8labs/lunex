import { useState } from 'react';
import { Loader2, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { logger } from '@/lib/logger';
import { Button } from '@/ui/atoms/button/button';
import { Label } from '@/ui/atoms/label';
import { FormDialog } from '@/ui/molecules/FormDialog';
import { invokeCommand, TauriCommands } from '@/lib/tauri';
import { useAppDispatch } from '@/app/hooks';
import {
  showError,
  showSuccess,
} from '@/features/notifications/state/notificationSlice';
import type { HubMCPServer } from '../types';

export interface InstallMCPServerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  server: HubMCPServer | null;
  onInstalled: () => void;
}

export function InstallMCPServerDialog({
  open,
  onOpenChange,
  server,
  onInstalled,
}: InstallMCPServerDialogProps) {
  const { t } = useTranslation(['settings', 'common']);
  const dispatch = useAppDispatch();
  const [installing, setInstalling] = useState(false);

  const handleInstall = async () => {
    if (!server) return;

    try {
      setInstalling(true);

      // Variables will be filled when using the connection, not during install
      // So we pass empty variables map
      const variables: Record<string, string> = {};

      await invokeCommand(TauriCommands.INSTALL_MCP_SERVER_FROM_HUB, {
        payload: {
          serverId: server.id,
          name: server.name,
          server_type: server.type,
          config: server.config,
          variables,
        },
      });

      dispatch(
        showSuccess(
          t('mcpServerInstalled', {
            defaultValue: 'MCP server installed successfully',
          }),
          t('mcpServerInstalledDescription', {
            defaultValue: 'The MCP server has been added to your connections',
          })
        )
      );

      onInstalled();
      onOpenChange(false);
    } catch (err) {
      logger.error('Error installing MCP server:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to install MCP server';
      dispatch(showError(errorMessage));
    } finally {
      setInstalling(false);
    }
  };

  if (!server) return null;

  const formatConfigPreview = () => {
    if (server.type === 'stdio') {
      const parts: string[] = [];
      if (server.config.command) {
        parts.push(`Command: ${server.config.command}`);
      }
      if (server.config.args && server.config.args.length > 0) {
        parts.push(`Args: ${server.config.args.join(' ')}`);
      }
      if (server.config.env) {
        parts.push(`Env: ${JSON.stringify(server.config.env, null, 2)}`);
      }
      return parts.join('\n');
    } else {
      // sse
      const parts: string[] = [];
      if (server.config.url) {
        parts.push(`URL: ${server.config.url}`);
      }
      if (server.config.headers) {
        parts.push(
          `Headers: ${JSON.stringify(server.config.headers, null, 2)}`
        );
      }
      return parts.join('\n');
    }
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('installMCPServer', { defaultValue: 'Install MCP Server' })}
      description={server.description}
      maxWidth="2xl"
      footer={
        <div className="flex w-full gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={installing}
            className="flex-1 h-10"
          >
            {t('cancel', { ns: 'common' })}
          </Button>
          <Button
            type="button"
            onClick={handleInstall}
            disabled={installing}
            className="flex-1 h-10"
          >
            {installing ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                {t('installing', { defaultValue: 'Installing...' })}
              </>
            ) : (
              <>
                <Download className="mr-2 size-4" />
                {t('install', { defaultValue: 'Install' })}
              </>
            )}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-2">
          {server.icon && (
            <img
              src={server.icon}
              alt={server.name}
              className="size-12 rounded-xl object-cover bg-muted/20 p-1"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <div>
            <h3 className="text-lg font-semibold leading-none tracking-tight">
              {server.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{server.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 p-3 rounded-xl border bg-muted/30">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
              {t('serverType', { defaultValue: 'Server Type' })}
            </Label>
            <p className="text-sm font-mono font-bold text-foreground">
              {server.type.toUpperCase()}
            </p>
          </div>
          <div className="space-y-1.5 p-3 rounded-xl border bg-muted/30">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
              {t('serverId', { defaultValue: 'Server ID' })}
            </Label>
            <p className="text-sm font-mono truncate text-foreground">
              {server.id}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t('serverConfig', { defaultValue: 'Server Configuration' })}
          </Label>
          <div className="relative group">
            <pre className="text-xs font-mono bg-zinc-950 text-zinc-300 p-4 rounded-xl overflow-auto max-h-[250px] border border-border/10 shadow-inner">
              {formatConfigPreview()}
            </pre>
            <div className="absolute top-3 right-3 opacity-100">
              <span className="text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded-full backdrop-blur-md border border-white/10 uppercase tracking-tighter">
                {server.type} config
              </span>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <p className="text-xs text-primary/80 leading-relaxed font-medium">
            {t('installNote', {
              defaultValue:
                'Note: After installation, you can configure additional environment variables and headers in the connection settings.',
            })}
          </p>
        </div>
      </div>
    </FormDialog>
  );
}
