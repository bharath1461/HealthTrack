"use client";

import { AdherenceChart } from "@/components/charts";

interface DashboardChartsProps {
  adherenceData: { day: string; percentage: number }[];
}

export function DashboardCharts({ adherenceData }: DashboardChartsProps) {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 overflow-hidden">
      <div className="px-6 py-5 border-b border-stone-50 dark:border-stone-800">
        <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">Adherence Trend</h2>
        <p className="text-sm text-stone-500 dark:text-stone-400">Last 7 days of scheduled doses</p>
      </div>
      <div className="p-6">
        <AdherenceChart data={adherenceData} />
      </div>
    </div>
  );
}
