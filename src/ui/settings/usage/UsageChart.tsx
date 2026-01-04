import { UsageChartPoint } from '@/models/usage';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/atoms/card';

interface UsageChartProps {
  data: UsageChartPoint[];
}

export function UsageChart({ data }: UsageChartProps) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Usage Trend</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px] w-full">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-muted"
                  vertical={false}
                />
                <XAxis
                  dataKey="timestamp"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                  yAxisId="left"
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                  orientation="right"
                  yAxisId="right"
                />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                />
                <Bar
                  dataKey="tokens"
                  fill="currentColor"
                  radius={[4, 4, 0, 0]}
                  className="fill-primary"
                  yAxisId="left"
                  name="Tokens"
                />
                <Bar
                  dataKey="cost"
                  fill="currentColor"
                  radius={[4, 4, 0, 0]}
                  className="fill-destructive"
                  yAxisId="right"
                  name="Cost ($)"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No data available for this period.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
