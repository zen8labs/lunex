import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

import { BaseNode, BaseNodeContent } from '@/ui/atoms/base-node';

export const SimpleNode = memo(({ data }: NodeProps) => {
  const label = (data.label as string) || 'Simple Node';

  return (
    <BaseNode>
      <BaseNodeContent>{label}</BaseNodeContent>
      <Handle
        type="target"
        position={Position.Left}
        className="-left-2 w-3 h-3 bg-blue-500 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="-right-2 w-3 h-3 bg-emerald-500 border-2 border-white rounded-none"
      />
    </BaseNode>
  );
});

SimpleNode.displayName = 'SimpleBaseNode';
