import { Position, type NodeProps } from '@xyflow/react';
import {
  BaseNode,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
  BaseNodeContent,
} from '@/ui/atoms/xyflow/base-node';
import { BaseHandle } from '@/ui/atoms/xyflow/base-handle';
import {
  DatabaseSchemaNode,
  DatabaseSchemaNodeHeader,
  DatabaseSchemaNodeBody,
  DatabaseSchemaTableRow,
  DatabaseSchemaTableCell,
} from '@/ui/atoms/xyflow/database-schema-node';
import { GroupNode } from '@/ui/atoms/xyflow/labeled-group-node';
import { cn } from '@/lib/utils';

interface SchemaRow {
  name: string;
  type: string;
}

export function AtomicBaseNode({ data, selected }: NodeProps) {
  const label = (data.label as string) || 'Node';
  const description = data.description as string | undefined;

  return (
    <BaseNode
      className={cn('min-w-[150px]', selected && 'ring-2 ring-primary')}
    >
      <BaseHandle type="target" position={Position.Top} />
      <BaseNodeHeader>
        <BaseNodeHeaderTitle>{label}</BaseNodeHeaderTitle>
      </BaseNodeHeader>
      <BaseNodeContent>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </BaseNodeContent>
      <BaseHandle type="source" position={Position.Bottom} />
    </BaseNode>
  );
}

export function AtomicDatabaseNode({ data, selected }: NodeProps) {
  const schema = (data.schema as SchemaRow[]) || [];
  const label = (data.label as string) || 'Table';

  return (
    <DatabaseSchemaNode
      className={cn('min-w-[200px]', selected && 'ring-2 ring-primary')}
    >
      <DatabaseSchemaNodeHeader>{label}</DatabaseSchemaNodeHeader>
      <DatabaseSchemaNodeBody>
        {schema.length > 0 ? (
          schema.map((row, i) => (
            <DatabaseSchemaTableRow key={i}>
              <DatabaseSchemaTableCell className="font-medium">
                {row.name}
              </DatabaseSchemaTableCell>
              <DatabaseSchemaTableCell className="text-right text-muted-foreground">
                {row.type}
              </DatabaseSchemaTableCell>
            </DatabaseSchemaTableRow>
          ))
        ) : (
          <DatabaseSchemaTableRow>
            <DatabaseSchemaTableCell
              colSpan={2}
              className="text-center text-muted-foreground italic"
            >
              No columns
            </DatabaseSchemaTableCell>
          </DatabaseSchemaTableRow>
        )}
      </DatabaseSchemaNodeBody>
      <BaseHandle type="target" position={Position.Left} />
      <BaseHandle type="source" position={Position.Right} />
    </DatabaseSchemaNode>
  );
}

export const AtomicGroupNode = GroupNode;
