import { type FlowNodeType } from '@/ui/molecules/FlowEditor';

export const FLOW_NODES: FlowNodeType[] = [
  {
    type: 'base',
    label: 'Generic Node',
    description: 'A basic node with title and text',
    initialData: { label: 'Node', description: 'Enter description...' },
  },
  {
    type: 'database',
    label: 'Database Table',
    description: 'A node representing a database table schema',
    initialData: {
      label: 'Users',
      schema: [
        { name: 'id', type: 'uuid' },
        { name: 'name', type: 'string' },
        { name: 'email', type: 'string' },
      ],
    },
  },
  {
    type: 'group',
    label: 'Group',
    description: 'A container to group multiple nodes',
    initialData: { label: 'My Group' },
  },
];
