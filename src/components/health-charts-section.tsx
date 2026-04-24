"use client";

import { useState } from "react";
import { HealthTrendChart } from "@/components/charts";

interface ChartInfo {
  type: string;
  label: string;
  unit: string;
  color: string;
  data: { date: string; value: number; label: string }[];
}

export function HealthChartsSection({ charts }: { charts: ChartInfo[] }) {
  const [activeChart, setActiveChart] = useState(charts[0]?.type || "");

  const selected = charts.find((c) => c.type === activeChart);

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-stone-50 dark:border-stone-800">
        <div>
          <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">Health Trends</h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">Your vitals over the last 30 days</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {charts.map((chart) => (
            <button
              key={chart.type}
              onClick={() => setActiveChart(chart.type)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeChart === chart.type
                  ? "bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 font-semibold"
                  : "text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800"
              }`}
            >
              {chart.label}
            </button>
          ))}
        </div>
      </div>
      <div className="p-6">
        {selected ? (
          <HealthTrendChart
            data={selected.data}
            color={selected.color}
            unit={selected.unit}
            title={selected.label}
          />
        ) : (
          <div className="text-center py-8 text-sm text-stone-400">
            Select a metric to view its trend
          </div>
        )}
      </div>
    </div>
  );
}
