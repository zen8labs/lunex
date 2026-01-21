import React, { useRef, useState } from 'react';
import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/ui/atoms/input';
import { Label } from '@/ui/atoms/label';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/ui/atoms/tooltip';
import { cn } from '@/lib/utils';
import { SlashCommandDropdown } from '@/ui/molecules/SlashCommandDropdown';
import { useSlashCommand } from '@/hooks/useSlashCommand';
import { VariableInputDialog } from '@/ui/molecules/VariableInputDialog';
import {
  parsePromptVariables,
  renderPrompt,
} from '@/features/settings/lib/prompt-utils';
import type { Prompt } from '@/app/types';

interface BasicSettingsProps {
  name: string;
  onNameChange: (name: string) => void;
  systemMessage: string;
  onSystemMessageChange: (value: string) => void;
}

export function BasicSettings({
  name,
  onNameChange,
  systemMessage,
  onSystemMessageChange,
}: BasicSettingsProps) {
  const { t } = useTranslation(['settings', 'common']);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // State for slash commands
  const [variableDialogOpen, setVariableDialogOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [promptVariables, setPromptVariables] = useState<
    Record<string, string>
  >({});

  // Insert prompt content into system message area
  const insertPromptContent = (content: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Only replace if systemMessage starts with "/"
    if (!systemMessage.startsWith('/')) return;

    // Get text after the slash command (if any)
    const afterSlash = systemMessage.substring(1);
    const spaceIndex = afterSlash.indexOf(' ');
    const additionalText =
      spaceIndex === -1 ? '' : afterSlash.substring(spaceIndex + 1);

    // Replace slash command with prompt content
    const newInput = content + (additionalText ? ' ' + additionalText : '');
    onSystemMessageChange(newInput);

    // Set cursor position to end
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(newInput.length, newInput.length);
      }
    }, 0);
  };

  // Handle prompt selection
  const handleSelectPrompt = (prompt: Prompt) => {
    const variableNames = parsePromptVariables(prompt.content);

    if (variableNames.length > 0) {
      const initialVariables: Record<string, string> = {};
      variableNames.forEach((name) => {
        initialVariables[name] = '';
      });
      setPromptVariables(initialVariables);
      slashCommand.close();
      setSelectedPrompt(prompt);
      setVariableDialogOpen(true);
    } else {
      slashCommand.close();
      // Use setTimeout to ensure close() state is set before input changes
      setTimeout(() => {
        insertPromptContent(prompt.content);
      }, 0);
    }
  };

  const slashCommand = useSlashCommand({
    input: systemMessage,
    onSelectPrompt: handleSelectPrompt,
  });

  const handleVariableDialogSubmit = () => {
    if (!selectedPrompt) return;
    const renderedContent = renderPrompt(
      selectedPrompt.content,
      promptVariables
    );
    insertPromptContent(renderedContent);
    setVariableDialogOpen(false);
    setSelectedPrompt(null);
    setPromptVariables({});
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (slashCommand.isActive) {
      const handled = slashCommand.handleKeyDown(e);
      if (handled) {
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        slashCommand.close();
        return;
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2 w-full">
        <Label htmlFor="workspace-name">{t('workspaceName')}</Label>
        <Input
          id="workspace-name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder={t('enterWorkspaceName')}
          className="w-full"
          required
        />
      </div>
      <div className="space-y-2 w-full">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="system-message">{t('systemMessage')}</Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="size-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>{t('systemMessageDescription')}</TooltipContent>
          </Tooltip>
        </div>
        <div className="relative">
          <textarea
            ref={textareaRef}
            data-slot="textarea"
            id="system-message"
            value={systemMessage}
            onChange={(e) => onSystemMessageChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('enterSystemMessage')}
            className={cn(
              'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
              'w-full min-h-32'
            )}
            rows={12}
          />
          {/* Slash Command Dropdown */}
          {slashCommand.isActive && slashCommand.filteredPrompts.length > 0 && (
            <SlashCommandDropdown
              prompts={slashCommand.filteredPrompts}
              selectedIndex={slashCommand.selectedIndex}
              onSelect={slashCommand.handleSelect}
              direction="down"
            />
          )}
        </div>
      </div>

      {/* Variable Input Dialog */}
      <VariableInputDialog
        open={variableDialogOpen}
        title={selectedPrompt?.name || ''}
        variableNames={
          selectedPrompt ? parsePromptVariables(selectedPrompt.content) : []
        }
        variables={promptVariables}
        renderedPreview={
          selectedPrompt
            ? renderPrompt(selectedPrompt.content, promptVariables)
            : undefined
        }
        onClose={() => {
          setVariableDialogOpen(false);
          setSelectedPrompt(null);
          setPromptVariables({});
        }}
        onSubmit={handleVariableDialogSubmit}
        onVariableChange={(name, value) =>
          setPromptVariables((prev) => ({ ...prev, [name]: value }))
        }
      />
    </div>
  );
}
