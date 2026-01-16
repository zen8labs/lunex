import { memo } from 'react';
import { NodeProps, NodeResizer } from '@xyflow/react';

export interface GroupNodeData {
  label?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  opacity?: number;
}

export const GroupNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as GroupNodeData;
  const { label = 'Group', textColor = 'var(--foreground)' } = nodeData;

  return (
    <div>
      <NodeResizer
        color="var(--primary)"
        isVisible={selected}
        minWidth={100}
        minHeight={100}
        handleStyle={{ width: 8, height: 8, borderRadius: '50%' }}
      />

      <div
        className="absolute -top-5 left-1 px-1.5 text-[10px] uppercase tracking-wider font-bold opacity-70"
        style={{ color: textColor, zIndex: -1 }}
      >
        {label}
      </div>
    </div>
  );
});

GroupNode.displayName = 'GroupNode';
