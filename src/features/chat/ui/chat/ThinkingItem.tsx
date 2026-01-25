import { useState, memo, useEffect, useRef } from 'react';
import { Brain, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ExpandableMessageItem } from './ExpandableMessageItem';

export interface ThinkingItemProps {
  content: string;
  isStreaming?: boolean;
}

export const ThinkingItem = memo(function ThinkingItem({
  content,
  isStreaming = false,
}: ThinkingItemProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [duration, setDuration] = useState(0);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    if (isStreaming) {
      if (startTime.current === null) {
        startTime.current = Date.now();
      }
      const interval = setInterval(() => {
        setDuration(
          Math.floor((Date.now() - (startTime.current || Date.now())) / 1000)
        );
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isStreaming]);

  if (!content && !isStreaming) return null;

  return (
    <ExpandableMessageItem
      isExpanded={isExpanded}
      onToggle={() => setIsExpanded(!isExpanded)}
      className="mb-4"
      headerClassName="mb-2"
      contentClassName="p-0 m-0"
      header={
        <>
          {isStreaming ? (
            <Loader2 className="h-3 w-3 animate-spin text-primary/60" />
          ) : (
            <Brain className="h-3 w-3" />
          )}
          <span>
            {isStreaming
              ? t('thinking', 'Thinking...')
              : t('thought', 'Thought')}
            {duration > 0 && ` for ${duration}s`}
          </span>
        </>
      }
    >
      <div className="text-sm text-muted-foreground/80 whitespace-pre-wrap leading-relaxed">
        {content || '...'}
      </div>
    </ExpandableMessageItem>
  );
});
