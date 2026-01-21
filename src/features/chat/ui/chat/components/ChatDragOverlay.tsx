import { memo } from 'react';
import { Paperclip } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ChatDragOverlay = memo(function ChatDragOverlay() {
  const { t } = useTranslation('chat');

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-2 text-primary">
        <Paperclip className="h-8 w-8 animate-bounce" />
        <span className="font-medium">
          {t('dropFiles', {
            defaultValue: 'Drop images here',
          })}
        </span>
      </div>
    </div>
  );
});
