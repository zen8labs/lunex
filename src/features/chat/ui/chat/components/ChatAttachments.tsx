import { memo } from 'react';
import { FlowAttachment } from '../FlowAttachment';
import { AttachedFileItem } from '../AttachedFileItem';
import { PromptPanel } from '../PromptPanel';
import { AgentMentionChips } from '../AgentBadgeOverlay';
import { InstalledAgent } from '@/app/types';
import { FlowData } from '@/features/chat/types';

interface ChatAttachmentsProps {
  attachedFiles: File[];
  attachedFlow: FlowData | null;
  insertedPrompt: { name: string; content: string } | null;
  selectedAgentIds: string[];
  installedAgents: InstalledAgent[];
  onRemoveFile: (index: number) => void;
  onRemoveFlow: () => void;
  onOpenFlowDialog: () => void;
  onRemovePrompt: () => void;
  onRemoveAgent: (agentId: string) => void;
  disabled?: boolean;
}

export const ChatAttachments = memo(function ChatAttachments({
  attachedFiles,
  attachedFlow,
  insertedPrompt,
  selectedAgentIds,
  installedAgents,
  onRemoveFile,
  onRemoveFlow,
  onOpenFlowDialog,
  onRemovePrompt,
  onRemoveAgent,
  disabled,
}: ChatAttachmentsProps) {
  return (
    <>
      {/* Attached Files */}
      {attachedFiles.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {attachedFiles.map((file, index) => (
            <AttachedFileItem
              key={`${file.name}-${file.lastModified}-${file.size}`}
              file={file}
              index={index}
              onRemove={onRemoveFile}
              disabled={disabled ?? false}
            />
          ))}
        </div>
      )}

      {/* Attached Flow */}
      {attachedFlow && (
        <div className="flex gap-2 p-2 pt-0">
          <FlowAttachment
            flow={attachedFlow}
            onClick={onOpenFlowDialog}
            onRemove={onRemoveFlow}
            mode="chatinput"
          />
        </div>
      )}

      {/* Inserted Prompt Panel */}
      {insertedPrompt && (
        <PromptPanel
          promptName={insertedPrompt.name}
          promptContent={insertedPrompt.content}
          onRemove={onRemovePrompt}
        />
      )}

      {/* Agent Mention Chips */}
      <AgentMentionChips
        agentIds={selectedAgentIds}
        agents={installedAgents}
        onRemoveAgent={onRemoveAgent}
      />
    </>
  );
});
