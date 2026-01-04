import { UsageSummary } from '@/models/usage';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/atoms/card';
import { Activity, Coins, MessageSquare, Zap } from 'lucide-react';

interface UsageOverviewProps {
  summary: UsageSummary;
}

export function UsageOverview({ summary }: UsageOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
          <Coins className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${summary.total_cost.toFixed(4)}
          </div>
          <p className="text-xs text-muted-foreground">Estimated cost</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(
              summary.total_input_tokens + summary.total_output_tokens
            ).toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            {summary.total_input_tokens.toLocaleString()} in /{' '}
            {summary.total_output_tokens.toLocaleString()} out
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {summary.total_requests.toLocaleString()}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {summary.average_latency.toFixed(0)} ms
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
