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
    <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-stone-50">
        <h2 className="text-lg font-bold text-stone-900 mb-4">Trends</h2>
        <div className="flex flex-wrap gap-2">
          {charts.map((chart) => (
            <button
              key={chart.type}
              onClick={() => setActiveChart(chart.type)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeChart === chart.type
                  ? "bg-teal-700 text-white shadow-sm"
                  : "bg-stone-50 text-stone-500 hover:bg-stone-100"
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
