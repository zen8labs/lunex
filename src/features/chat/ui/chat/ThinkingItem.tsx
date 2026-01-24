import { useState, memo, useEffect, useRef } from 'react';
import { ChevronDown, Brain, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

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
    <div className="mb-4 last:mb-0">
      <button
        type="button"
        className="flex items-center gap-2 text-muted-foreground/50 hover:text-muted-foreground/80 transition-colors text-xs font-medium py-1 group outline-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 transition-transform duration-200',
            !isExpanded && '-rotate-90'
          )}
        />
        <div className="flex items-center gap-1.5">
          {isStreaming && (
            <Loader2 className="h-3 w-3 animate-spin text-primary/60" />
          )}
          {!isStreaming && <Brain className="h-3 w-3" />}
          <span>
            {isStreaming
              ? t('thinking', 'Thinking...')
              : t('thought', 'Thought')}
            {duration > 0 && ` for ${duration}s`}
          </span>
        </div>
      </button>

      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-300 ease-in-out',
          isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden">
          <div
            className={cn(
              'mt-1 ml-1.5 pl-4 border-l-2 border-muted/30 transition-all duration-300 select-text',
              isExpanded ? 'opacity-100 py-1' : 'opacity-0'
            )}
          >
            <div className="text-sm text-muted-foreground/80 whitespace-pre-wrap leading-relaxed">
              {content || '...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
