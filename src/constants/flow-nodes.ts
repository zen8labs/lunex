import { type FlowNodeType } from '@/ui/molecules/FlowEditor';

export const FLOW_NODES: FlowNodeType[] = [
  {
    type: 'simple',
    label: 'Simple Node',
    description: 'A basic node with title and text',
    initialData: { label: 'Node' },
  },
];
