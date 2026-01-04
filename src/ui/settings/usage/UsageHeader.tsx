import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/atoms/select';
import { UsageFilter } from '@/models/usage';

interface UsageHeaderProps {
  filter: UsageFilter;
  onFilterChange: (filter: UsageFilter) => void;
  interval: string;
  onIntervalChange: (interval: string) => void;
}

export function UsageHeader({
  filter,
  onFilterChange,
  interval,
  onIntervalChange,
}: UsageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
      <h2 className="text-2xl font-bold tracking-tight">Usage Statistics</h2>
      <div className="flex flex-wrap gap-2 items-center">
        <Select value={interval} onValueChange={onIntervalChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Interval" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hour">Hourly</SelectItem>
            <SelectItem value="day">Daily</SelectItem>
            <SelectItem value="month">Monthly</SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(val) => {
            const now = Math.floor(Date.now() / 1000);
            let from: number | undefined;
            switch (val) {
              case '24h':
                from = now - 86400;
                break;
              case '7d':
                from = now - 7 * 86400;
                break;
              case '30d':
                from = now - 30 * 86400;
                break;
              case 'all':
                from = undefined;
                break;
            }
            onFilterChange({
              ...filter,
              date_from: from,
              date_to: undefined, // valid until now
            });
          }}
          defaultValue="all"
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 Hours</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
