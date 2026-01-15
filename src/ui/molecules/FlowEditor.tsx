import { useCallback, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  type Node,
  type Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Plus } from 'lucide-react';
import { Button } from '@/ui/atoms/button/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/atoms/dropdown-menu';
import {
  StartNode,
  EndNode,
  ProcessNode,
  InputNode,
  OutputNode,
  DecisionNode,
  MergeNode,
  LoopBackNode,
} from './flow-nodes/AlgorithmNodes';

import type { FlowData } from '@/features/chat/types';

export interface FlowNodeType {
  type: string;
  label: string;
  description?: string;
  initialData?: Record<string, unknown>;
  className?: string;
  style?: React.CSSProperties;
}

interface FlowEditorProps {
  initialFlow?: FlowData;
  availableNodes?: FlowNodeType[];
  onChange?: (flow: FlowData) => void;
  readOnly?: boolean;
  className?: string;
}

const nodeTypes = {
  start: StartNode,
  end: EndNode,
  process: ProcessNode,
  input: InputNode,
  output: OutputNode,
  decision: DecisionNode,
  merge: MergeNode,
  loopback: LoopBackNode,
};

// Internal component that uses ReactFlow hooks
function FlowEditorInner({
  initialFlow,
  availableNodes = [],
  onChange,
  readOnly = false,
  className,
}: FlowEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialFlow?.nodes || []
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    initialFlow?.edges || []
  );
  const { setViewport, toObject, screenToFlowPosition } = useReactFlow();

  const handleLabelChange = useCallback(
    (id: string, label: string) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                label,
              },
            };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  // Inject label change handler and readOnly state into each node
  const nodesWithHandlers = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onLabelChange: handleLabelChange,
          readOnly,
        },
      })),
    [nodes, handleLabelChange, readOnly]
  );

  const defaultNodeTypes: FlowNodeType[] = useMemo(
    () => [
      {
        type: 'process',
        label: 'Process',
        initialData: { label: 'New Step' },
      },
    ],
    []
  );

  const nodeLibrary =
    availableNodes.length > 0 ? availableNodes : defaultNodeTypes;

  // Restore viewport if provided
  useEffect(() => {
    if (initialFlow?.viewport) {
      const { x, y, zoom } = initialFlow.viewport;
      setViewport({ x, y, zoom }, { duration: 300 });
    }
  }, [initialFlow?.viewport, setViewport]);

  // Notify parent of changes
  useEffect(() => {
    if (onChange && !readOnly) {
      const flowData = toObject();
      onChange(flowData);
    }
  }, [nodes, edges, onChange, readOnly, toObject]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Add a new node at center of viewport
  const handleAddNode = useCallback(
    (template: FlowNodeType) => {
      const id = `node-${Date.now()}`;
      // Get center of the current viewport
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const position = screenToFlowPosition({
        x: centerX,
        y: centerY,
      });

      const newNode: Node = {
        id,
        type: template.type,
        position,
        data: {
          ...template.initialData,
          label: template.initialData?.label || template.label,
          className: template.className,
          style: template.style,
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [screenToFlowPosition, setNodes]
  );

  return (
    <div className={cn('relative w-full h-full', className)}>
      <ReactFlow
        nodes={nodesWithHandlers}
        edges={edges}
        onNodesChange={readOnly ? undefined : onNodesChange}
        onEdgesChange={readOnly ? undefined : onEdgesChange}
        onConnect={readOnly ? undefined : onConnect}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        elementsSelectable={!readOnly}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>

      {/* Toolbar for adding nodes */}
      {!readOnly && (
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" size="sm" className="shadow-lg">
                <Plus className="size-4 mr-2" />
                Add Node
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {nodeLibrary.map((node) => (
                <DropdownMenuItem
                  key={node.type + node.label}
                  onClick={() => handleAddNode(node)}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{node.label}</span>
                    {node.description && (
                      <span className="text-xs text-muted-foreground">
                        {node.description}
                      </span>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}

// Main component that wraps with ReactFlowProvider
export function FlowEditor(props: FlowEditorProps) {
  return (
    <ReactFlowProvider>
      <FlowEditorInner {...props} />
    </ReactFlowProvider>
  );
}
