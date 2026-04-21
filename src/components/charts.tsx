"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface ChartDataPoint {
  date: string;
  value: number;
  label: string;
}

interface HealthChartProps {
  data: ChartDataPoint[];
  color: string;
  unit: string;
  title: string;
}

export function HealthTrendChart({ data, color, unit, title }: HealthChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-stone-400">
        No data to display
      </div>
    );
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.15} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#a8a29e" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#a8a29e" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e7e5e4",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              fontSize: "13px",
              padding: "8px 12px",
            }}
            formatter={(value) => [`${value} ${unit}`, title]}
            labelStyle={{ color: "#78716c", fontSize: "11px", marginBottom: "4px" }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            fill={`url(#gradient-${title})`}
            dot={{ fill: color, strokeWidth: 2, r: 3, stroke: "white" }}
            activeDot={{ r: 5, stroke: color, strokeWidth: 2, fill: "white" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

interface AdherenceChartProps {
  data: { day: string; percentage: number }[];
}

export function AdherenceChart({ data }: AdherenceChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-stone-400">
        No adherence data
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <defs>
          <linearGradient id="adherence-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0F766E" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#0F766E" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />
        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: "#a8a29e" }}
        />
        <YAxis
          domain={[0, 100]}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: "#a8a29e" }}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e7e5e4",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            fontSize: "13px",
            padding: "8px 12px",
          }}
          formatter={((value: unknown) => [`${value}%`, "Adherence"]) as never}
          labelStyle={{ color: "#78716c", fontSize: "11px" }}
        />
        <Area
          type="monotone"
          dataKey="percentage"
          stroke="#0F766E"
          strokeWidth={2.5}
          fill="url(#adherence-gradient)"
          dot={{ fill: "#0F766E", strokeWidth: 2, r: 3, stroke: "white" }}
          activeDot={{ r: 5, stroke: "#0F766E", strokeWidth: 2, fill: "white" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
