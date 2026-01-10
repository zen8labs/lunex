import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { setImagePreviewOpen } from '@/features/ui/state/uiSlice';

interface AttachedFileItemProps {
  file: File;
  onRemove: () => void;
  disabled: boolean;
}

export const AttachedFileItem = ({
  file,
  onRemove,
  disabled,
}: AttachedFileItemProps) => {
  const dispatch = useAppDispatch();

  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    let url: string | null = null;
    if (file.type.startsWith('image/')) {
      url = URL.createObjectURL(file);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setObjectUrl(url);
    }

    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [file]);

  return (
    <div className="relative group">
      {file.type.startsWith('image/') && objectUrl ? (
        <div
          className="relative h-16 w-16 overflow-hidden rounded-md border border-border cursor-pointer hover:opacity-80 transition-opacity bg-black/5 dark:bg-white/5 flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(setImagePreviewOpen({ open: true, url: objectUrl }));
          }}
        >
          <img
            src={objectUrl}
            alt={file.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      ) : (
        <div className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs h-8">
          <span className="truncate max-w-[150px]">{file.name}</span>
        </div>
      )}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground shadow-sm opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
        disabled={disabled}
      >
        ×
      </button>
    </div>
  );
};
