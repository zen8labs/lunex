import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/app/hooks';
import { showError } from '@/features/notifications/state/notificationSlice';
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from '@/lib/constants';
import { formatFileSize } from '@/lib/utils';

export interface UseChatDragDropProps {
  attachedFiles: File[];
  handleFileUpload: (files: File[]) => void;
  supportsVision: boolean;
}

export function useChatDragDrop({
  attachedFiles,
  handleFileUpload,
  supportsVision,
}: UseChatDragDropProps) {
  const { t } = useTranslation('chat');
  const dispatch = useAppDispatch();
  const [isDragging, setIsDragging] = useState(false);

  const validateAndAddFiles = useCallback(
    (files: File[]) => {
      const validFiles: File[] = [];

      for (const file of files) {
        // Validate size
        if (file.size > MAX_FILE_SIZE) {
          dispatch(
            showError(
              t('fileTooLarge', {
                size: formatFileSize(file.size),
                max: formatFileSize(MAX_FILE_SIZE),
                ns: 'chat',
              })
            )
          );
          continue;
        }

        // Validate type (if dragging from system, type might be empty or specific)
        // For drag and drop, we primarily focus on images if supportsVision is true
        if (
          !file.type.startsWith('image/') &&
          !ALLOWED_FILE_TYPES.includes(file.type)
        ) {
          // Optional: stricter validation or allow generic files
          // For now, let's stick to ALLOWED_FILE_TYPES logic
        }

        validFiles.push(file);
      }

      if (validFiles.length > 0) {
        const newFiles = [...attachedFiles, ...validFiles];
        handleFileUpload(newFiles);
      }
    },
    [attachedFiles, dispatch, handleFileUpload, t]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!supportsVision) return;
      setIsDragging(true);
    },
    [supportsVision]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (!supportsVision) return;

      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith('image/')
      );

      if (files.length > 0) {
        validateAndAddFiles(files);
      }
    },
    [supportsVision, validateAndAddFiles]
  );

  const handleDisplayPaste = useCallback(
    (e: React.ClipboardEvent) => {
      if (!supportsVision) return;

      const items = e.clipboardData?.items;
      if (!items) return;

      const files: File[] = [];
      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            files.push(file);
          }
        }
      }

      if (files.length > 0) {
        validateAndAddFiles(files);
      }
    },
    [supportsVision, validateAndAddFiles]
  );

  return {
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDisplayPaste,
  };
}
