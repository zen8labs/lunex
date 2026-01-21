import { useMemo, useState } from 'react';
import { Loader2, RefreshCw, Search, Server } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { logger } from '@/lib/logger';
import { Button } from '@/ui/atoms/button/button';
import { Input } from '@/ui/atoms/input';
import { EmptyState } from '@/ui/atoms/empty-state';
import { ScrollArea } from '@/ui/atoms/scroll-area';
import { useAppDispatch } from '@/app/hooks';
import {
  showError,
  showSuccess,
} from '@/features/notifications/state/notificationSlice';
import {
  useGetHubMCPServersQuery,
  useRefreshHubIndexMutation,
} from '../state/api';
import type { HubMCPServer } from '../types';
import { MCPServerCard } from './MCPServerCard';

interface CommunityMCPServersSectionProps {
  installedServerIds: string[];
  onInstall: (server: HubMCPServer) => void;
}

export function CommunityMCPServersSection({
  installedServerIds,
  onInstall,
}: CommunityMCPServersSectionProps) {
  const { t } = useTranslation('settings');
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: servers = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetHubMCPServersQuery();

  const [refreshHub, { isLoading: isRefreshing }] =
    useRefreshHubIndexMutation();

  const handleRefresh = async () => {
    try {
      await refreshHub().unwrap();
      // Tag invalidation handles the refetch, but we can verify
      await refetch();
      dispatch(
        showSuccess(
          t('hubIndexRefreshed', {
            defaultValue: 'Hub index refreshed successfully',
          })
        )
      );
    } catch (err) {
      logger.error('Error refreshing hub index:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to refresh hub index';
      dispatch(showError(errorMessage));
    }
  };

  const filteredServers = useMemo(
    () =>
      servers.filter(
        (server) =>
          server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          server.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [servers, searchQuery]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="mr-2 size-4 animate-spin" />
        <p className="text-sm text-muted-foreground">
          {t('loadingHubMCPServers', {
            defaultValue: 'Loading MCP servers...',
          })}
        </p>
      </div>
    );
  }

  if (error) {
    const errorMessage =
      typeof error === 'object' && error !== null && 'message' in error
        ? (error as { message: string }).message
        : 'Failed to load MCP servers';
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/10">
        <p className="text-sm text-destructive mb-4">{errorMessage}</p>
        <Button onClick={() => refetch()} size="sm" variant="outline">
          {t('retry', { ns: 'common', defaultValue: 'Retry' })}
        </Button>
      </div>
    );
  }

  if (servers.length === 0) {
    return (
      <EmptyState
        icon={Server}
        title={t('noHubMCPServers', {
          defaultValue: 'No MCP servers available',
        })}
        description={t('noHubMCPServersDescription', {
          defaultValue: 'No MCP servers found in the hub.',
        })}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('searchMCPServers', {
              defaultValue: 'Search MCP servers...',
            })}
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing || isLoading || isFetching}
          size="sm"
          variant="outline"
        >
          <RefreshCw
            className={`mr-2 size-4 ${isRefreshing || isFetching ? 'animate-spin' : ''}`}
          />
          {t('refresh', { defaultValue: 'Refresh' })}
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-280px)]">
        {filteredServers.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-muted/10">
            <p className="text-muted-foreground">
              {t('noMCPServersFound', {
                defaultValue: 'No MCP servers found.',
              })}
            </p>
          </div>
        ) : (
          <div
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6"
            style={{ contentVisibility: 'auto' }}
          >
            {filteredServers.map((server) => (
              <MCPServerCard
                key={server.id}
                server={server}
                isInstalled={installedServerIds.includes(server.id)}
                onInstall={onInstall}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

export type { CommunityMCPServersSectionProps };
