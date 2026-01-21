import { memo } from 'react';
import { MessageImage } from '../MessageImage';
import { MessageFile } from '../MessageFile';
import { useAppDispatch } from '@/app/hooks';
import { setImagePreviewOpen } from '@/features/ui/state/uiSlice';

interface MessageAttachmentsProps {
  files?: Array<string | { path: string; mimeType: string }>;
  images?: Array<string | { path: string; mimeType: string }>;
}

export const MessageAttachments = memo(function MessageAttachments({
  files,
  images,
}: MessageAttachmentsProps) {
  const dispatch = useAppDispatch();

  // Consolidate file list (support both new 'files' and old 'images' format)
  const fileList =
    files && files.length > 0
      ? files
      : images && images.length > 0
        ? images
        : [];

  if (fileList.length === 0) {
    return null;
  }

  return (
    <div className="mb-3 flex flex-col gap-2">
      {fileList.map((fileData, index) => {
        // Parse file data
        let filePath: string;
        let mimeType: string | undefined;

        if (typeof fileData === 'string') {
          filePath = fileData;
          // Try to guess mime type from data URL or extension
          if (fileData.startsWith('data:')) {
            const match = fileData.match(/data:(.*?);/);
            mimeType = match ? match[1] : undefined;
          }
        } else if (typeof fileData === 'object' && fileData.path) {
          filePath = fileData.path;
          mimeType = fileData.mimeType;
        } else {
          return null;
        }

        // Determine if it's an image
        const isImage =
          mimeType?.startsWith('image/') ||
          (!mimeType &&
            (filePath.match(/\.(jpg|jpeg|png|gif|webp)$/i) ||
              (filePath.startsWith('data:') && filePath.includes('image/'))));

        if (isImage) {
          // Render image with preview
          return (
            <div
              key={index}
              className="relative w-fit max-w-[400px] overflow-hidden rounded-lg border border-border/50 bg-background/50 cursor-pointer hover:opacity-90 transition-opacity"
            >
              <MessageImage
                src={filePath}
                alt={`Attached image ${index + 1}`}
                className="max-h-[300px] w-auto h-auto object-contain"
                onClick={(url) =>
                  dispatch(
                    setImagePreviewOpen({
                      open: true,
                      url,
                    })
                  )
                }
              />
            </div>
          );
        } else {
          // Render file card
          return (
            <MessageFile
              key={index}
              src={filePath}
              mimeType={mimeType}
              className="max-w-[400px]"
            />
          );
        }
      })}
    </div>
  );
});
