import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/app/hooks';
import { showError } from '@/features/notifications/state/notificationSlice';
import { logger } from '@/lib/logger';
import { FlowData } from '@/features/chat/types';

interface ProcessingResult {
  input: string;
  images: string[];
  metadata?: string;
}

interface UseChatSubmitProps {
  onSend: (content?: string, images?: string[], metadata?: string) => void;
  attachedFiles: File[];
  attachedFlow: FlowData | null;
  selectedAgentIds: string[];
  setInsertedPrompt: (prompt: { name: string; content: string } | null) => void;
  setSelectedAgentIds: (ids: string[]) => void;
  setFlow: (flow: FlowData | null) => void;
  handleFileUpload: (files: File[]) => void;
  input: string;
  insertedPrompt: { name: string; content: string } | null;
}

export function useChatSubmit({
  onSend,
  attachedFiles,
  attachedFlow,
  selectedAgentIds,
  setInsertedPrompt,
  setSelectedAgentIds,
  setFlow,
  handleFileUpload,
  input,
  insertedPrompt,
}: UseChatSubmitProps) {
  const { t } = useTranslation('chat');
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const processAttachments =
    useCallback(async (): Promise<ProcessingResult | null> => {
      // Construct the prefix for agents
      const agentPrefix =
        selectedAgentIds.length > 0
          ? selectedAgentIds.map((id) => `@${id}`).join(' ') + ' '
          : '';

      // Construct prompt content
      const promptContent = insertedPrompt ? insertedPrompt.content : '';

      let combinedInput = '';

      // 1. Add agents
      if (agentPrefix) {
        combinedInput += agentPrefix;
      }

      // 2. Add prompt
      if (promptContent) {
        combinedInput += promptContent;
      }

      // 3. Add user input
      if (input) {
        if (combinedInput && !combinedInput.endsWith('\n')) {
          combinedInput += '\n\n';
        }
        combinedInput += input;
      }

      // Only proceed if we have something to send, attached files, or flow
      if (
        !combinedInput.trim() &&
        attachedFiles.length === 0 &&
        !attachedFlow
      ) {
        return null;
      }

      // Process attached files
      let images: string[] = [];
      if (attachedFiles.length > 0) {
        try {
          images = await Promise.all(
            attachedFiles.map((file) => {
              return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
              });
            })
          );
        } catch (error) {
          logger.error('Failed to process images', error);
          dispatch(showError(t('failedToProcessImages', { ns: 'chat' })));
          return null;
        }
      }

      // If we have a flow attachment, we need to add it to metadata
      let metadata: string | undefined;
      if (attachedFlow) {
        metadata = JSON.stringify({
          type: 'flow_attachment',
          flow: attachedFlow,
          timestamp: Date.now(),
        });
      }

      return {
        input: combinedInput,
        images,
        metadata,
      };
    }, [
      attachedFiles,
      attachedFlow,
      input,
      insertedPrompt,
      selectedAgentIds,
      dispatch,
      t,
    ]);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const result = await processAttachments();
      if (result) {
        // Clear states
        setInsertedPrompt(null);
        setSelectedAgentIds([]);
        setFlow(null);
        handleFileUpload([]);

        // Send
        onSend(result.input, result.images, result.metadata);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    processAttachments,
    setInsertedPrompt,
    setSelectedAgentIds,
    setFlow,
    handleFileUpload,
    onSend,
  ]);

  return {
    handleSubmit,
    isSubmitting,
  };
}
