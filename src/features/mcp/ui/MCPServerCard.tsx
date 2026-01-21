import { Server, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/ui/atoms/button/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/ui/atoms/card';
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

  return (
    <Card className="flex flex-col h-full hover:bg-accent/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          {server.icon ? (
            <img
              src={server.icon}
              alt={server.name}
              className="size-10 rounded-md object-cover bg-muted/20 p-1"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="rounded-lg bg-primary/10 p-2.5">
              <Server className="size-5 text-primary" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base truncate">{server.name}</CardTitle>
            <CardDescription className="text-xs mt-1 truncate">
              {server.id}
            </CardDescription>
          </div>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary shrink-0 uppercase">
            {server.type}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {server.description}
        </p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          onClick={() => onInstall(server)}
          disabled={isInstalled}
          className="w-full"
          size="sm"
          variant={isInstalled ? 'outline' : 'default'}
        >
          {isInstalled ? (
            <>
              <Server className="mr-2 size-4" />
              {t('installed', { defaultValue: 'Installed' })}
            </>
          ) : (
            <>
              <Download className="mr-2 size-4" />
              {t('install', { defaultValue: 'Install' })}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
