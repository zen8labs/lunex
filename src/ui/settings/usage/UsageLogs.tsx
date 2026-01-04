import { UsageStat } from '@/models/usage';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/atoms/table';
import { Button } from '@/ui/atoms/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

interface UsageLogsProps {
  logs: UsageStat[];
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  hasMore: boolean;
}

export function UsageLogs({
  logs,
  page,
  limit,
  onPageChange,
  hasMore,
}: UsageLogsProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Tokens (In/Out/Total)</TableHead>
              <TableHead>Latency</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">
                    {format(new Date(log.timestamp * 1000), 'MMM d, HH:mm:ss')}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{log.model}</span>
                      <span className="text-xs text-muted-foreground">
                        {log.provider}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {log.input_tokens} / {log.output_tokens} /{' '}
                    {log.total_tokens}
                  </TableCell>
                  <TableCell>{log.latency_ms} ms</TableCell>
                  <TableCell>${log.cost.toFixed(5)}</TableCell>
                  <TableCell>
                    <span
                      className={
                        log.status === 'success'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }
                    >
                      {log.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">Page {page}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasMore && logs.length < limit}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
