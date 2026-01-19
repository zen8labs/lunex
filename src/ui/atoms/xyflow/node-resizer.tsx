import {
  NodeResizer as ReactFlowResizer,
  type NodeResizerProps,
} from '@xyflow/react';
import { cn } from '@/lib/utils';

export interface NodeResizerAtomProps extends NodeResizerProps {
  className?: string;
  handleClassName?: string;
  lineClassName?: string;
}

export function NodeResizer({
  isVisible = true,
  minWidth = 100,
  minHeight = 50,
  handleClassName,
  lineClassName,
  ...props
}: NodeResizerAtomProps) {
  return (
    <ReactFlowResizer
      isVisible={isVisible}
      minWidth={minWidth}
      minHeight={minHeight}
      handleClassName={cn(
        'w-2 h-2 bg-background border border-primary rounded-sm transition-colors hover:bg-primary',
        handleClassName
      )}
      lineClassName={cn('border-primary/50', lineClassName)}
      {...props}
    />
  );
}
