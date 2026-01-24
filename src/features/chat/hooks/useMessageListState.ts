import { useState, useCallback } from 'react';
import { logger } from '@/lib/logger';
import { copyMarkdownToClipboard } from '@/lib/clipboard';

export interface UseMessageListStateProps {
  externalMarkdownEnabled?: Record<string, boolean>;
  externalCopiedId?: string | null;
  externalExpandedToolCalls?: Record<string, boolean>;
  onMarkdownEnabledChange?: (markdownEnabled: Record<string, boolean>) => void;
  onCopiedIdChange?: (copiedId: string | null) => void;
  onExpandedToolCallsChange?: (
    expandedToolCalls: Record<string, boolean>
  ) => void;
}

export function useMessageListState({
  externalMarkdownEnabled,
  externalCopiedId,
  externalExpandedToolCalls,
  onMarkdownEnabledChange,
  onCopiedIdChange,
  onExpandedToolCallsChange,
}: UseMessageListStateProps) {
  // Internal state
  const [internalMarkdownEnabled, setInternalMarkdownEnabled] = useState<
    Record<string, boolean>
  >({});
  const [internalCopiedId, setInternalCopiedId] = useState<string | null>(null);
  const [internalExpandedToolCalls, setInternalExpandedToolCalls] = useState<
    Record<string, boolean>
  >({});

  // Derived state (effective state)
  const markdownEnabled = externalMarkdownEnabled ?? internalMarkdownEnabled;
  const copiedId = externalCopiedId ?? internalCopiedId;
  const expandedToolCalls =
    externalExpandedToolCalls ?? internalExpandedToolCalls;

  const handleCopy = useCallback(
    async (content: string, messageId: string) => {
      try {
        await copyMarkdownToClipboard(content);
        if (onCopiedIdChange) {
          onCopiedIdChange(messageId);
        } else {
          setInternalCopiedId(messageId);
        }
        setTimeout(() => {
          if (onCopiedIdChange) {
            onCopiedIdChange(null);
          } else {
            setInternalCopiedId(null);
          }
        }, 2000);
      } catch (error) {
        logger.error('Failed to copy content:', error);
      }
    },
    [onCopiedIdChange]
  );

  const toggleMarkdown = useCallback(
    (messageId: string) => {
      // If undefined, treat as true (markdown enabled by default)
      const currentValue = markdownEnabled[messageId] ?? true;
      const newValue = {
        ...markdownEnabled,
        [messageId]: !currentValue,
      };
      if (onMarkdownEnabledChange) {
        onMarkdownEnabledChange(newValue);
      } else {
        setInternalMarkdownEnabled(newValue);
      }
    },
    [markdownEnabled, onMarkdownEnabledChange]
  );

  const toggleToolCall = useCallback(
    (compositeKey: string, defaultValue: boolean) => {
      if (onExpandedToolCallsChange) {
        const currentValue = expandedToolCalls[compositeKey] ?? defaultValue;
        onExpandedToolCallsChange({
          ...expandedToolCalls,
          [compositeKey]: !currentValue,
        });
      } else {
        setInternalExpandedToolCalls((prev) => {
          const currentValue = prev[compositeKey] ?? defaultValue;
          return {
            ...prev,
            [compositeKey]: !currentValue,
          };
        });
      }
    },
    [expandedToolCalls, onExpandedToolCallsChange]
  );

  return {
    markdownEnabled,
    copiedId,
    expandedToolCalls,
    handleCopy,
    toggleMarkdown,
    toggleToolCall,
  };
}
