import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/ui/atoms/button/button';
import { Input } from '@/ui/atoms/input';
import { Label } from '@/ui/atoms/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/atoms/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/ui/atoms/dialog';
import { ScrollArea } from '@/ui/atoms/scroll-area';
import { Skeleton } from '@/ui/atoms/skeleton';
import { HeadersEditor } from '@/features/settings';
import type {
  MCPServerConnection,
  PythonRuntimeStatus,
  NodeRuntimeStatus,
} from '../types';

// Skeleton component for runtime selector loading state
function RuntimeSelectorSkeleton() {
  return (
    <div className="space-y-2 w-full">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

interface MCPServerConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  connection: MCPServerConnection | null;
  onSave: (connection: Omit<MCPServerConnection, 'id'>) => void;
  onDelete?: () => void;
  pythonRuntimes: PythonRuntimeStatus[];
  nodeRuntimes: NodeRuntimeStatus[];
  runtimesLoading: boolean;
}

export function MCPServerConnectionDialog({
  open,
  onOpenChange,
  connection,
  onSave,
  onDelete,
  pythonRuntimes,
  nodeRuntimes,
  runtimesLoading,
}: MCPServerConnectionDialogProps) {
  const { t } = useTranslation('settings');
  const { t: tCommon } = useTranslation('common');
  const [name, setName] = useState(connection?.name || '');
  const [url, setUrl] = useState(connection?.url || '');
  const [type, setType] = useState<'sse' | 'stdio' | 'http-streamable'>(
    connection?.type || 'sse'
  );
  const [headers, setHeaders] = useState(connection?.headers || '');
  const [envVars, setEnvVars] = useState(connection?.env_vars || '');
  const [selectedRuntime, setSelectedRuntime] = useState<string>('default');

  useEffect(() => {
    if (connection) {
      if (name !== connection.name) setName(connection.name);

      const rtPath = connection.runtime_path || 'default';
      if (selectedRuntime !== rtPath) setSelectedRuntime(rtPath);

      const isPy = pythonRuntimes.some((r) => r.path === rtPath);
      const isNode = nodeRuntimes.some((r) => r.path === rtPath);
      let displayUrl = connection.url;

      if (isPy && displayUrl.startsWith('uv ')) {
        displayUrl = displayUrl.substring(3);
      } else if (isNode && displayUrl.startsWith('npx ')) {
        displayUrl = displayUrl.substring(4);
      }

      if (url !== displayUrl) setUrl(displayUrl);
      if (type !== connection.type) setType(connection.type);

      const newHeaders = connection.headers || '';
      if (headers !== newHeaders) setHeaders(newHeaders);

      const newEnvVars = connection.env_vars || '';
      if (envVars !== newEnvVars) setEnvVars(newEnvVars);
    } else {
      if (name !== '') setName('');
      if (url !== '') setUrl('');
      if (type !== 'sse') setType('sse');
      if (headers !== '') setHeaders('');
      if (envVars !== '') setEnvVars('');
      if (selectedRuntime !== 'default') setSelectedRuntime('default');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection, open, pythonRuntimes, nodeRuntimes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && url.trim()) {
      let finalUrl = url.trim();
      const isPy = pythonRuntimes.some((r) => r.path === selectedRuntime);
      const isNode = nodeRuntimes.some((r) => r.path === selectedRuntime);

      if (isPy && !finalUrl.startsWith('uv ')) {
        finalUrl = `uv ${finalUrl}`;
      } else if (isNode && !finalUrl.startsWith('npx ')) {
        finalUrl = `npx ${finalUrl}`;
      }

      onSave({
        name: name.trim(),
        url: finalUrl,
        type,
        headers: headers?.trim() || '',
        env_vars: envVars?.trim() || '',
        runtime_path: selectedRuntime !== 'default' ? selectedRuntime : '',
      });
      onOpenChange(false);
    }
  };

  const handleHeadersChange = (value: string | undefined) => {
    setHeaders(value || '');
  };

  const handleEnvVarsChange = (value: string | undefined) => {
    setEnvVars(value || '');
  };

  const handleRuntimeChange = (value: string) => {
    const isNewPy = pythonRuntimes.some((r) => r.path === value);
    const isNewNode = nodeRuntimes.some((r) => r.path === value);

    let newUrl = url;
    if (isNewPy && newUrl.startsWith('uv ')) {
      newUrl = newUrl.substring(3);
    } else if (isNewNode && newUrl.startsWith('npx ')) {
      newUrl = newUrl.substring(4);
    }

    setUrl(newUrl);
    setSelectedRuntime(value);
  };

  // Helper content for prefixes
  const isPython = pythonRuntimes.some((r) => r.path === selectedRuntime);
  const isNode = nodeRuntimes.some((r) => r.path === selectedRuntime);
  const runtimePrefix = isPython ? 'uv' : isNode ? 'npx' : undefined;

  const showHeaders = type === 'sse' || type === 'http-streamable';
  const showEnvVars = type === 'stdio';
  const showRuntimeSelector = type === 'stdio';

  // Helper to check if runtime is ready
  const hasInstalledRuntimes =
    pythonRuntimes.some((r) => r.installed) ||
    nodeRuntimes.some((r) => r.installed);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl flex flex-col max-h-[90vh]">
        <DialogHeader className="shrink-0 scale-95 origin-top p-0">
          <DialogTitle className="p-0 m-0">
            {connection ? t('editConnection') : t('addNewConnection')}
          </DialogTitle>
          <DialogDescription>{t('configureMCPConnection')}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden w-full">
          <div className="flex-1 overflow-y-auto min-h-0 w-full">
            <div className="space-y-6 py-2 pb-6 w-full">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="mcp-name" className="text-sm font-medium">
                    {t('connectionName')}
                  </Label>
                  <Input
                    id="mcp-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('mcpConnectionNamePlaceholder')}
                    className="w-full h-9"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mcp-type" className="text-sm font-medium">
                    {t('type')}
                  </Label>
                  <Select
                    value={type}
                    onValueChange={(
                      value: 'sse' | 'stdio' | 'http-streamable'
                    ) => setType(value)}
                  >
                    <SelectTrigger id="mcp-type" className="w-full h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sse">{t('sseType')}</SelectItem>
                      <SelectItem value="stdio">{t('stdioType')}</SelectItem>
                      <SelectItem value="http-streamable">
                        {t('httpStreamableType')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Runtime and Command Support */}
              <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
                {showRuntimeSelector &&
                  (runtimesLoading ? (
                    <RuntimeSelectorSkeleton />
                  ) : hasInstalledRuntimes ? (
                    <div className="space-y-2 w-full">
                      <Label className="text-sm font-medium">
                        {t('runtimeEnvironment')}
                      </Label>
                      <Select
                        value={selectedRuntime}
                        onValueChange={handleRuntimeChange}
                      >
                        <SelectTrigger className="w-full h-9 bg-background">
                          <SelectValue placeholder={t('systemDefault')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">
                            {t('systemDefault')}
                          </SelectItem>
                          {pythonRuntimes
                            .filter((r) => r.installed && r.path)
                            .map((r) => (
                              <SelectItem key={r.version} value={r.path || ''}>
                                Python {r.version} (Bundled)
                              </SelectItem>
                            ))}
                          {nodeRuntimes
                            .filter((r) => r.installed && r.path)
                            .map((r) => (
                              <SelectItem key={r.version} value={r.path || ''}>
                                Node.js {r.version} (Bundled)
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : null)}

                <div className="space-y-2 w-full">
                  <Label htmlFor="mcp-url" className="text-sm font-medium">
                    {type === 'stdio'
                      ? runtimePrefix
                        ? t('mcpArguments')
                        : t('mcpCommand')
                      : t('url')}
                  </Label>
                  <div className="flex gap-2 items-center">
                    {type === 'stdio' && runtimePrefix && (
                      <span className="bg-muted px-2.5 py-1.5 rounded-md text-xs font-mono border whitespace-nowrap">
                        {runtimePrefix}
                      </span>
                    )}
                    <Input
                      id="mcp-url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder={
                        type === 'stdio'
                          ? runtimePrefix
                            ? t('mcpArgumentsPlaceholder')
                            : t('stdioUrlPlaceholder')
                          : t('sseUrlPlaceholder')
                      }
                      className="w-full h-9 bg-background"
                      required
                    />
                  </div>
                </div>

                {showEnvVars && (
                  <div
                    className={`w-full ${envVars ? 'border-t pt-4 mt-2' : 'mt-2'}`}
                  >
                    <HeadersEditor
                      value={envVars}
                      onChange={handleEnvVarsChange}
                      label={t('envVarsOptional', {
                        defaultValue: 'Environment Variables (Optional)',
                      })}
                      placeholderKey="VAR_NAME"
                      placeholderValue="value"
                      helperText={t('envVarsInfo', {
                        defaultValue:
                          'Passed as environment variables to the stdio process.',
                      })}
                    />
                  </div>
                )}

                {showHeaders && (
                  <div
                    className={`w-full ${headers ? 'border-t pt-4 mt-2' : 'mt-2'}`}
                  >
                    <HeadersEditor
                      value={headers}
                      onChange={handleHeadersChange}
                    />
                  </div>
                )}
              </div>

              {/* Tools List */}
              <ScrollArea className="space-y-4 border-t pt-4 h-full">
                {connection?.tools && connection.tools.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      {t('toolsList', { count: connection.tools.length })}
                    </Label>
                    <div className="rounded-md border bg-muted/20 overflow-hidden">
                      <div className="max-h-[200px] overflow-y-auto divide-y divide-border">
                        {connection.tools.map((tool, index) => (
                          <div
                            key={index}
                            className="px-3 py-2 text-sm hover:bg-muted/30 transition-colors"
                          >
                            <div className="font-medium text-foreground">
                              {tool.name}
                            </div>
                            {tool.description && (
                              <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                {tool.description}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
          <DialogFooter className="shrink-0 flex flex-row gap-2 border-t pt-4">
            <Button type="button" onClick={handleSubmit} className="flex-1">
              {tCommon('save')}
            </Button>
            {onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={onDelete}
                className="flex-1"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {tCommon('delete')}
              </Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
