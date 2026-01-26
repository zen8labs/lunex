import { Server, Download, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/ui/atoms/button/button';
import { EntityCard } from '@/ui/molecules/EntityCard';
import type { HubMCPServer } from '../types';

interface MCPServerCardProps {
  server: HubMCPServer;
  isInstalled: boolean;
  onInstall: (server: HubMCPServer) => void;
}

export function MCPServerCard({
  server,
  isInstalled,
  onInstall,
}: MCPServerCardProps) {
  const { t } = useTranslation('settings');

  const icon = server.icon ? (
    <img
      src={server.icon}
      alt={server.name}
      className="size-10 rounded-lg object-cover bg-muted/20 p-1"
      onError={(e) => {
        e.currentTarget.style.display = 'none';
      }}
    />
  ) : (
    <Server className="size-5 text-primary" />
  );

  return (
    <EntityCard
      icon={icon}
      title={server.name}
      subtitle={server.id}
      badge={server.type}
      description={server.description}
      footer={
        <Button
          onClick={() => onInstall(server)}
          disabled={isInstalled}
          className="w-full h-9"
          size="sm"
          variant={isInstalled ? 'secondary' : 'default'}
        >
          {isInstalled ? (
            <>
              <Check className="mr-2 size-4" />
              {t('installed', { defaultValue: 'Installed' })}
            </>
          ) : (
            <>
              <Download className="mr-2 size-4" />
              {t('install', { defaultValue: 'Install' })}
            </>
          )}
        </Button>
      }
    />
  );
}
