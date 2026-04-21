import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Plus,
  Moon,
  Footprints,
  Activity,
  Weight,
  HeartPulse,
  Brain,
  Droplets,
} from "lucide-react";
import { HealthChartsSection } from "@/components/health-charts-section";

const METRIC_ICONS: Record<string, React.ReactNode> = {
  sleep: <Moon className="w-5 h-5" />,
  steps: <Footprints className="w-5 h-5" />,
  heart_rate: <Activity className="w-5 h-5" />,
  bp_systolic: <HeartPulse className="w-5 h-5" />,
  bp_diastolic: <Droplets className="w-5 h-5" />,
  weight: <Weight className="w-5 h-5" />,
  mood: <Brain className="w-5 h-5" />,
};

const METRIC_COLORS: Record<string, string> = {
  sleep: "bg-indigo-50 text-indigo-600",
  steps: "bg-emerald-50 text-emerald-600",
  heart_rate: "bg-rose-50 text-rose-500",
  bp_systolic: "bg-red-50 text-red-500",
  bp_diastolic: "bg-orange-50 text-orange-500",
  weight: "bg-amber-50 text-amber-600",
  mood: "bg-purple-50 text-purple-600",
};

const METRIC_UNITS: Record<string, string> = {
  sleep: "hrs",
  steps: "steps",
  heart_rate: "bpm",
  bp_systolic: "mmHg",
  bp_diastolic: "mmHg",
  weight: "kg",
  mood: "/10",
};

const METRIC_LABELS: Record<string, string> = {
  sleep: "Sleep",
  steps: "Steps",
  heart_rate: "Heart Rate",
  bp_systolic: "BP (Systolic)",
  bp_diastolic: "BP (Diastolic)",
  weight: "Weight",
  mood: "Mood",
};

const CHART_COLORS: Record<string, string> = {
  sleep: "#6366f1",
  steps: "#10b981",
  heart_rate: "#f43f5e",
  bp_systolic: "#ef4444",
  bp_diastolic: "#f97316",
  weight: "#d97706",
  mood: "#8b5cf6",
};

export default async function HealthLogsPage() {
  const supabase = await createClient();

  // Fetch last 30 days of logs for charts
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data: allLogs } = await supabase
    .from("health_logs")
    .select("*")
    .gte("recorded_at", thirtyDaysAgo)
    .order("recorded_at", { ascending: true });

  const { data: recentLogs } = await supabase
    .from("health_logs")
    .select("*")
    .order("recorded_at", { ascending: false })
    .limit(50);

  // Group logs by type for charts
  const logsByType: Record<string, { date: string; value: number; label: string }[]> = {};
  allLogs?.forEach((log) => {
    if (!logsByType[log.type]) logsByType[log.type] = [];
    logsByType[log.type].push({
      date: log.recorded_at,
      value: Number(log.value),
      label: new Date(log.recorded_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
    });
  });

  // Group recent by date for list
  const grouped: Record<string, typeof recentLogs> = {};
  recentLogs?.forEach((log) => {
    const date = new Date(log.recorded_at).toLocaleDateString("en-IN", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
    if (!grouped[date]) grouped[date] = [];
    grouped[date]!.push(log);
  });

  // Latest metrics summary
  const latestByType: Record<string, NonNullable<typeof recentLogs>[0]> = {};
  recentLogs?.forEach((log) => {
    if (!latestByType[log.type]) {
      latestByType[log.type] = log;
    }
  });

  // Prepare chart data for client component
  const chartData = Object.entries(logsByType).map(([type, data]) => ({
    type,
    label: METRIC_LABELS[type] || type,
    unit: METRIC_UNITS[type] || "",
    color: CHART_COLORS[type] || "#0F766E",
    data,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-900">
            Health Logs
          </h1>
          <p className="text-stone-500 mt-1">
            {recentLogs?.length || 0} entries recorded
          </p>
        </div>
        <Link
          href="/health/add"
          className="inline-flex items-center gap-2 px-5 py-3 bg-teal-700 text-white text-sm font-bold rounded-xl hover:bg-teal-800 transition-all active:scale-95 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Log Entry
        </Link>
      </div>

      {/* Latest Metrics Grid */}
      {Object.keys(latestByType).length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(latestByType).map(([type, log]) => (
            <div key={type} className="bg-white rounded-2xl border border-stone-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${METRIC_COLORS[type] || "bg-stone-50 text-stone-500"}`}>
                  {METRIC_ICONS[type] || <Activity className="w-4 h-4" />}
                </div>
                <span className="text-xs font-bold text-stone-400">{METRIC_LABELS[type] || type}</span>
              </div>
              <p className="text-2xl font-extrabold text-stone-900">
                {Number(log.value).toLocaleString()}
                <span className="text-sm font-normal text-stone-400 ml-1">{METRIC_UNITS[type] || ""}</span>
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Trend Charts */}
      {chartData.length > 0 && <HealthChartsSection charts={chartData} />}

      {/* Log Entries by Date */}
      {Object.keys(grouped).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, entries]) => (
            <div key={date}>
              <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-3">{date}</h2>
              <div className="space-y-2">
                {entries?.map((log) => (
                  <div key={log.id} className="bg-white rounded-xl border border-stone-100 p-4 flex items-center gap-4 hover:shadow-sm transition-all">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${METRIC_COLORS[log.type] || "bg-stone-50 text-stone-500"}`}>
                      {METRIC_ICONS[log.type] || <Activity className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-stone-900 text-sm">{METRIC_LABELS[log.type] || log.type}</p>
                      {log.notes && <p className="text-xs text-stone-400 truncate">{log.notes}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-stone-900">
                        {Number(log.value).toLocaleString()}{" "}
                        <span className="text-xs font-normal text-stone-400">{METRIC_UNITS[log.type] || ""}</span>
                      </p>
                      <p className="text-[10px] text-stone-400">
                        {new Date(log.recorded_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-100 p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-stone-50 flex items-center justify-center mx-auto mb-5">
            <HeartPulse className="w-8 h-8 text-stone-300" />
          </div>
          <h3 className="font-bold text-stone-900 text-lg mb-2">No health entries yet</h3>
          <p className="text-stone-500 text-sm mb-8 max-w-sm mx-auto">
            Start logging your vitals to track trends and generate meaningful health reports.
          </p>
          <Link href="/health/add" className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 text-white text-sm font-bold rounded-xl hover:bg-teal-800 transition-colors">
            <Plus className="w-4 h-4" /> Log Health Data
          </Link>
        </div>
      )}
    </div>
  );
}
