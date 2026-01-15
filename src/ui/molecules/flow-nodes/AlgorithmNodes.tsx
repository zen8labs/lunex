import { useCallback } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import { cn } from '@/lib/utils';

export interface AlgorithmNodeData extends Record<string, unknown> {
  label: string;
  onLabelChange?: (id: string, label: string) => void;
  readOnly?: boolean;
}

const NodeTextarea = ({
  id,
  data,
}: {
  id: string;
  data: AlgorithmNodeData;
}) => {
  const onChange = useCallback(
    (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
      data.onLabelChange?.(id, evt.target.value);
    },
    [data, id]
  );

  return (
    <textarea
      value={data.label}
      onChange={onChange}
      className={cn(
        'nodrag nowheel w-full bg-transparent border-none outline-none resize-none overflow-hidden text-center text-sm font-medium',
        'placeholder:text-muted-foreground/50'
      )}
      rows={1}
      onInput={(e) => {
        const target = e.target as HTMLTextAreaElement;
        target.style.height = 'auto';
        target.style.height = `${target.scrollHeight}px`;
      }}
      readOnly={data.readOnly}
    />
  );
};

// 1. START NODE (Oval)
export function StartNode({
  id,
  data,
  selected,
}: NodeProps<Node<AlgorithmNodeData>>) {
  return (
    <div
      className={cn(
        'relative min-w-[120px] px-6 py-3 rounded-full border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 font-bold flex items-center justify-center transition-all',
        selected ? 'ring-2 ring-primary ring-offset-2' : ''
      )}
    >
      <NodeTextarea id={id} data={data} />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-emerald-500 w-3 h-3"
      />
    </div>
  );
}

// 2. END NODE (Oval)
export function EndNode({
  id,
  data,
  selected,
}: NodeProps<Node<AlgorithmNodeData>>) {
  return (
    <div
      className={cn(
        'relative min-w-[120px] px-6 py-3 rounded-full border-2 border-rose-500 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 font-bold flex items-center justify-center transition-all',
        selected ? 'ring-2 ring-primary ring-offset-2' : ''
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-rose-500 w-3 h-3"
      />
      <NodeTextarea id={id} data={data} />
    </div>
  );
}

// 3. PROCESS NODE (Rectangle)
export function ProcessNode({
  id,
  data,
  selected,
}: NodeProps<Node<AlgorithmNodeData>>) {
  return (
    <div
      className={cn(
        'relative min-w-[150px] px-4 py-4 rounded-md border-2 border-blue-500 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 flex items-center justify-center transition-all',
        selected ? 'ring-2 ring-primary ring-offset-2' : ''
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-blue-500 w-2 h-2"
      />
      <NodeTextarea id={id} data={data} />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-blue-500 w-2 h-2"
      />
    </div>
  );
}

// 4. INPUT NODE (Parallelogram)
export function InputNode({
  id,
  data,
  selected,
}: NodeProps<Node<AlgorithmNodeData>>) {
  return (
    <div
      className={cn(
        'relative min-w-[150px] px-8 py-4 border-2 border-purple-500 bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400 flex items-center justify-center transition-all',
        selected ? 'ring-2 ring-primary ring-offset-2' : ''
      )}
      style={{ clipPath: 'polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)' }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-purple-500 w-2 h-2 !left-[55%]"
      />
      <NodeTextarea id={id} data={data} />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-purple-500 w-2 h-2 !left-[45%]"
      />
    </div>
  );
}

// 5. OUTPUT NODE (Parallelogram)
export function OutputNode({
  id,
  data,
  selected,
}: NodeProps<Node<AlgorithmNodeData>>) {
  return (
    <div
      className={cn(
        'relative min-w-[150px] px-8 py-4 border-2 border-amber-500 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 flex items-center justify-center transition-all',
        selected ? 'ring-2 ring-primary ring-offset-2' : ''
      )}
      style={{ clipPath: 'polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)' }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-amber-500 w-2 h-2 !left-[55%]"
      />
      <NodeTextarea id={id} data={data} />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-amber-500 w-2 h-2 !left-[45%]"
      />
    </div>
  );
}

// 6. DECISION NODE (Diamond)
export function DecisionNode({
  id,
  data,
  selected,
}: NodeProps<Node<AlgorithmNodeData>>) {
  return (
    <div
      className={cn(
        'relative min-w-[140px] min-h-[140px] p-6 border-2 border-orange-500 bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 flex items-center justify-center transition-all',
        selected ? 'ring-2 ring-primary ring-offset-2' : ''
      )}
      style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-orange-500 w-2 h-2"
      />

      <div className="w-full h-full flex items-center justify-center">
        <NodeTextarea id={id} data={data} />
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="true"
        className="!bg-orange-500 w-2 h-2"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="false"
        className="!bg-orange-500 w-2 h-2"
      />

      {/* Label for handles */}
      <div className="absolute top-1/2 -right-6 -translate-y-1/2 text-[10px] font-bold text-orange-600">
        YES
      </div>
      <div className="absolute top-1/2 -left-6 -translate-y-1/2 text-[10px] font-bold text-orange-600">
        NO
      </div>
    </div>
  );
}

// 7. MERGE NODE (Small rounded rectangle or circle)
export function MergeNode({
  id: _id,
  data: _data,
  selected,
}: NodeProps<Node<AlgorithmNodeData>>) {
  return (
    <div
      className={cn(
        'relative min-w-[40px] min-h-[40px] rounded-full border-2 border-slate-400 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all',
        selected ? 'ring-2 ring-primary ring-offset-2' : ''
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="!bg-slate-400 w-2 h-2"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!bg-slate-400 w-2 h-2"
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right"
        className="!bg-slate-400 w-2 h-2"
      />

      <div className="text-[10px] font-bold">M</div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-slate-400 w-2 h-2"
      />
    </div>
  );
}

// 8. LOOP BACK CONNECTOR
export function LoopBackNode({
  id: _id,
  data: _data,
  selected,
}: NodeProps<Node<AlgorithmNodeData>>) {
  return (
    <div
      className={cn(
        'relative min-w-[30px] min-h-[30px] rounded-full border-2 border-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center transition-all',
        selected ? 'ring-2 ring-primary ring-offset-2' : ''
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-indigo-400 w-2 h-2"
      />
      <div className="text-[10px] font-bold">⟲</div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-indigo-400 w-2 h-2"
      />
    </div>
  );
}
