"use client";

import { AdherenceChart } from "@/components/charts";

interface DashboardChartsProps {
  adherenceData: { day: string; percentage: number }[];
}

export function DashboardCharts({ adherenceData }: DashboardChartsProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-stone-50">
        <h2 className="text-lg font-bold text-stone-900">7-Day Adherence</h2>
        <p className="text-xs text-stone-400 mt-1">Medication compliance trend</p>
      </div>
      <div className="p-6">
        <AdherenceChart data={adherenceData} />
      </div>
    </div>
  );
}
