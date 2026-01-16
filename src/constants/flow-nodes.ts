import { type FlowNodeType } from '@/ui/molecules/FlowEditor';

export const FLOW_NODES: FlowNodeType[] = [
  {
    type: 'simple',
    label: 'Simple node',
    description: 'Simple node with custom background and text colors',
    initialData: {
      label: 'Node',
      backgroundColor: 'var(--primary)',
      textColor: 'var(--primary-foreground)',
    },
  },
  {
    type: 'rich',
    label: 'Database Node',
    description: 'Database operation node with full features',
    initialData: {
      label: 'Database Query',
      description: 'Execute SQL query',
      icon: '🗄️',
      variant: 'default',
      tags: ['Database'],
      handles: {
        target: true,
        source: true,
        targetLabel: 'Query',
        sourceLabel: 'Result',
      },
    },
  },
  {
    type: 'start',
    label: 'Start',
    description: 'Algorithm start point',
    initialData: {
      label: 'Start',
      nodeType: 'start',
    },
  },
  {
    type: 'end',
    label: 'End',
    description: 'Algorithm end point',
    initialData: {
      label: 'End',
      nodeType: 'end',
    },
  },
  {
    type: 'process',
    label: 'Process',
    description: 'Processing step or action',
    initialData: {
      label: 'Process',
    },
  },
  {
    type: 'input-output',
    label: 'Input/Output',
    description: 'Data input or output operation',
    initialData: {
      label: 'Input/Output',
    },
  },
  {
    type: 'decision',
    label: 'Decision',
    description: 'Branching point (if/else)',
    initialData: {
      label: 'Decision?',
    },
  },
];
