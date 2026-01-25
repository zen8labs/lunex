import { useMemo, useCallback, memo, type MouseEvent } from 'react';
import {
  Wrench,
  AlertCircle,
  Loader2,
  Check,
  X,
  StopCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/ui/atoms/button/button';
import { logger } from '@/lib/logger';
import type { Message } from '../../types';
import { ExpandableMessageItem } from './ExpandableMessageItem';

export interface ToolCallData {
  id: string;
  name: string;
  arguments: unknown;
  status: string;
  result?: unknown;
  error?: string;
}

export interface ToolCallItemProps {
  message?: Message;
  data?: ToolCallData;
  isExpanded: boolean;
  onToggle: () => void;
  t: (key: string, defaultValue?: string) => string;
  onRespond?: (allow: boolean) => void;
  onCancel?: () => void;
  timeLeft?: number; // Countdown in seconds for pending permission
}

export const ToolCallItem = memo(
  function ToolCallItem({
    message,
    data,
    isExpanded,
    onToggle,
    t,
    onRespond,
    onCancel,
    timeLeft,
  }: ToolCallItemProps) {
    const { toolCallData, parseError } = useMemo(() => {
      if (data) return { toolCallData: data, parseError: null };
      if (message) {
        try {
          const parsed = JSON.parse(message.content);
          return { toolCallData: parsed, parseError: null };
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          logger.error('Failed to parse tool call data:', {
            error,
            content: message.content,
          });
          return { toolCallData: null, parseError: errorMessage };
        }
      }
      return { toolCallData: null, parseError: null };
    }, [message, data]);

    const handleToggle = useCallback(() => {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) return;

      onToggle();
    }, [onToggle]);

    const handleRespond = useCallback(
      (e: MouseEvent<HTMLButtonElement>, allow: boolean) => {
        e.stopPropagation();
        onRespond?.(allow);
      },
      [onRespond]
    );

    const handleCancel = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (onCancel) {
          onCancel();
        }
      },
      [onCancel]
    );

    if (!toolCallData) {
      if (parseError) {
        return (
          <div className="flex min-w-0 w-full justify-start">
            <div className="rounded-lg border border-destructive bg-destructive/10 p-3 w-full select-text">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium text-sm">Tool Call Error</span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground break-all">
                Failed to parse tool call data: {parseError}
              </div>
              {/* Developer mode: show raw content */}
              {message?.content && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs font-medium hover:underline">
                    Raw content
                  </summary>
                  <pre className="mt-1 text-xs bg-muted p-2 rounded overflow-x-auto whitespace-pre-wrap break-all">
                    {message.content}
                  </pre>
                </details>
              )}
            </div>
          </div>
        );
      }
      return null;
    }

    // Check for both "executing" (from Rust backend) and "calling" (legacy)
    const isExecuting =
      toolCallData.status === 'executing' || toolCallData.status === 'calling';
    const isError = toolCallData.status === 'error';
    const isCompleted = toolCallData.status === 'completed';
    const isPending = toolCallData.status === 'pending_permission';

    return (
      <ExpandableMessageItem
        isExpanded={isExpanded}
        onToggle={handleToggle}
        headerClassName="mb-2"
        contentClassName="p-0 m-0"
        header={
          <>
            {isExecuting ? (
              <Loader2 className="h-3 w-3 animate-spin text-primary/60" />
            ) : (
              <Wrench className="h-3 w-3" />
            )}
            <span className="truncate max-w-[200px]">{toolCallData.name}</span>

            {isPending && (
              <div className="flex items-center gap-1.5 ml-1">
                <span className="text-[10px] bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  {t('permissionRequired', 'Required')}
                </span>
                {timeLeft !== undefined && timeLeft > 0 && (
                  <span
                    className={cn(
                      'text-[10px] font-mono',
                      timeLeft <= 10
                        ? 'text-destructive font-bold'
                        : 'text-muted-foreground'
                    )}
                  >
                    ({timeLeft}s)
                  </span>
                )}
              </div>
            )}
            {isError && (
              <AlertCircle className="h-3 w-3 shrink-0 text-destructive" />
            )}
            {isCompleted && !isError && (
              <Check className="h-3 w-3 text-emerald-500" />
            )}
          </>
        }
        actionsClassName={isPending ? 'opacity-100' : undefined}
        actions={
          <>
            {isPending && onRespond && (
              <div className="flex items-center gap-0.5">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-5 w-5 text-emerald-600 hover:bg-emerald-500/10"
                  onClick={(e: MouseEvent<HTMLButtonElement>) =>
                    handleRespond(e, true)
                  }
                  title="Allow"
                >
                  <Check className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-5 w-5 text-destructive hover:bg-destructive/10"
                  onClick={(e: MouseEvent<HTMLButtonElement>) =>
                    handleRespond(e, false)
                  }
                  title="Deny"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}

            {isExecuting && !isPending && onCancel && (
              <Button
                size="icon"
                variant="ghost"
                className="h-5 w-5 text-destructive hover:bg-destructive/10"
                onClick={handleCancel}
                title={t('cancelToolExecution') || 'Cancel'}
              >
                <StopCircle className="h-3.5 w-3.5" />
              </Button>
            )}
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 mb-1.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500/20" />
              {t('toolCallInput')}
            </div>
            <pre className="text-xs font-mono leading-relaxed bg-muted/30 p-2.5 rounded-md overflow-x-auto border border-muted/20">
              {formatJSONSafety(toolCallData.arguments)}
            </pre>
          </div>

          {isExecuting && !isPending ? (
            <div className="flex items-center gap-2 text-muted-foreground/60 text-xs italic pl-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>{t('toolCallExecuting')}</span>
            </div>
          ) : isPending ? (
            <div className="text-xs text-amber-600/80 bg-amber-500/5 p-2 rounded border border-amber-500/10 italic">
              {t('waitingForApproval', 'Waiting for approval...')}
            </div>
          ) : isError ? (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-destructive/40 mb-1.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive/20" />
                {t('toolCallError')}
              </div>
              <div className="text-xs text-destructive/80 bg-destructive/5 p-2.5 rounded border border-destructive/10 font-mono">
                {toolCallData.error}
              </div>
            </div>
          ) : toolCallData.result !== undefined ? (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 mb-1.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />
                {t('toolCallOutput')}
              </div>
              <pre className="text-xs font-mono leading-relaxed bg-muted/30 p-2.5 rounded-md overflow-x-auto border border-muted/20">
                {formatJSONSafety(toolCallData.result)}
              </pre>
            </div>
          ) : null}
        </div>
      </ExpandableMessageItem>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison for memo
    const prevId = prevProps.message?.id || prevProps.data?.id;
    const nextId = nextProps.message?.id || nextProps.data?.id;

    // Deep compare data if message is missing
    const prevDataStr = prevProps.data
      ? JSON.stringify(prevProps.data)
      : prevProps.message?.content;
    const nextDataStr = nextProps.data
      ? JSON.stringify(nextProps.data)
      : nextProps.message?.content;

    return (
      prevId === nextId &&
      prevDataStr === nextDataStr &&
      prevProps.isExpanded === nextProps.isExpanded &&
      prevProps.timeLeft === nextProps.timeLeft // ← Added for countdown
    );
  }
);

function formatJSONSafety(str: unknown): string {
  if (str === undefined || str === null) return '';

  if (typeof str === 'object') {
    return JSON.stringify(str, null, 2);
  }

  if (typeof str === 'string') {
    try {
      return JSON.stringify(JSON.parse(str), null, 2);
    } catch (_) {
      return str;
    }
  }

  return String(str);
}
