import { useTranslation } from 'react-i18next';
import { Loader2, Download, Bot } from 'lucide-react';
import { Button } from '@/ui/atoms/button/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/ui/atoms/dialog/component';
import { ScrollArea } from '@/ui/atoms/scroll-area';
import { useAppDispatch } from '@/app/hooks';
import {
  showError,
  showSuccess,
} from '@/features/notifications/state/notificationSlice';
import type { HubAgent } from '../types';
import { useInstallAgentFromHubMutation } from '../state/api';
// import type { InstallAgentDialogProps } from './InstallAgentDialogProps';
// Removing the above bad import line

// Actually, I can just keep the interface here if I didn't delete the props definition
// I accidentally deleted the props definition in the previous step?
// The diff showed removing it. Let's restore it.

export interface InstallAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: HubAgent | null;
  onInstalled: () => void;
}

export function InstallAgentDialog({
  open,
  onOpenChange,
  agent,
  onInstalled,
}: InstallAgentDialogProps) {
  const { t } = useTranslation(['settings', 'common']);
  const dispatch = useAppDispatch();
  const [installAgent, { isLoading: installing }] =
    useInstallAgentFromHubMutation();
  // Removed local installing state

  const handleInstall = async () => {
    if (!agent) return;

    try {
      // setInstalling(true); // Handled by hook

      await installAgent({
        agentId: agent.id,
        name: agent.name,
        git_install: agent.git_install,
      }).unwrap();

      dispatch(
        showSuccess(
          t('agentInstalled', {
            defaultValue: 'Agent installed successfully',
          }),
          t('agentInstalledDescription', {
            defaultValue: 'The agent has been added to your collection',
          })
        )
      );

      onInstalled();
      onOpenChange(false);
    } catch (err) {
      console.error('Error installing agent:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to install agent';
      dispatch(showError(errorMessage));
    } finally {
      // setInstalling(false); // Handled by hook
    }
  };

  if (!agent) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl flex flex-col max-h-[90vh]">
        <DialogHeader className="shrink-0">
          <div className="flex items-center gap-3">
            {agent.icon ? (
              <img
                src={agent.icon}
                alt={agent.name}
                className="w-10 h-10 object-contain rounded-md bg-muted/20 p-1"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove(
                    'hidden'
                  );
                }}
              />
            ) : null}
            <div className="hidden rounded-lg bg-primary/10 p-2.5">
              <Bot className="size-5 text-primary" />
            </div>
            <div>
              <DialogTitle>
                {t('installAgent', { defaultValue: 'Install Agent' })}:{' '}
                {agent.name}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                {agent.description}
              </p>
            </div>
          </div>
        </DialogHeader>

        <DialogBody>
          <ScrollArea className="h-full [&_[data-slot='scroll-area-scrollbar']]:hidden">
            <div className="space-y-4 pr-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Category</p>
                  <p className="font-medium bg-muted px-2 py-1 rounded inline-block">
                    {agent.category}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Author</p>
                  <p className="font-medium">{agent.author}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Version</p>
                  <p className="font-mono text-xs">{agent.version}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Source</p>
                  <a
                    href={agent.git_install.repository_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline truncate block"
                  >
                    Repository
                  </a>
                </div>
              </div>

              <div className="border rounded-md p-3 bg-muted/30">
                <p className="text-xs text-muted-foreground mb-2 font-semibold">
                  Git Installation Details
                </p>
                <div className="space-y-1 font-mono text-xs">
                  <p>
                    <span className="text-muted-foreground">Repo:</span>{' '}
                    {agent.git_install.repository_url}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Rev:</span>{' '}
                    {agent.git_install.revision}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Path:</span>{' '}
                    {agent.git_install.subpath}
                  </p>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogBody>

        <DialogFooter className="shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={installing}
          >
            {t('cancel', { ns: 'common' })}
          </Button>
          <Button type="button" onClick={handleInstall} disabled={installing}>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
