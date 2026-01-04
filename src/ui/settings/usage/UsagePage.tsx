import { useState, useEffect } from 'react';
import { UsageHeader } from './UsageHeader';
import { UsageOverview } from './UsageOverview';
import { UsageChart } from './UsageChart';
import { UsageLogs } from './UsageLogs';
import {
  UsageFilter,
  UsageSummary,
  UsageChartPoint,
  UsageStat,
} from '@/models/usage';
import { invoke } from '@tauri-apps/api/core';

export function UsagePage() {
  const [filter, setFilter] = useState<UsageFilter>({});
  const [summary, setSummary] = useState<UsageSummary | null>(null);
  const [chartData, setChartData] = useState<UsageChartPoint[]>([]);
  const [logs, setLogs] = useState<UsageStat[]>([]);
  const [loading, setLoading] = useState(false);
  const [interval, setInterval] = useState('day');
  const [page, setPage] = useState(1);
  const LIMIT = 20;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const summaryData = await invoke<UsageSummary>('get_usage_summary', {
          filter,
        });
        setSummary(summaryData);

        const chartDataRes = await invoke<UsageChartPoint[]>(
          'get_usage_chart',
          {
            filter,
            interval,
          }
        );
        setChartData(chartDataRes);

        const logsRes = await invoke<UsageStat[]>('get_usage_logs', {
          filter,
          page,
          limit: LIMIT,
        });
        setLogs(logsRes);
      } catch (error) {
        console.error('Failed to fetch usage data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filter, interval, page]);

  return (
    <div className="space-y-6 relative">
      {loading && (
        <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center rounded-md">
          <div className="text-sm text-muted-foreground animate-pulse">
            Loading usage data...
          </div>
        </div>
      )}
      <div className={loading ? 'opacity-50 pointer-events-none' : ''}>
        <UsageHeader
          filter={filter}
          onFilterChange={setFilter}
          interval={interval}
          onIntervalChange={setInterval}
        />

        {summary && <UsageOverview summary={summary} />}

        <UsageChart data={chartData} />

        <UsageLogs
          logs={logs}
          page={page}
          limit={LIMIT}
          onPageChange={setPage}
          hasMore={logs.length === LIMIT}
        />
      </div>
    </div>
  );
}
