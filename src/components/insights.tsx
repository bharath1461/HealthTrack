import {
  AlertTriangle,
  TrendingDown,
  Pill,
  Moon,
  HeartPulse,
} from "lucide-react";

export interface Insight {
  id: string;
  type: "warning" | "alert" | "info";
  icon: "pill" | "sleep" | "heart" | "trend";
  title: string;
  description: string;
}

const ICONS = {
  pill: <Pill className="w-4 h-4" />,
  sleep: <Moon className="w-4 h-4" />,
  heart: <HeartPulse className="w-4 h-4" />,
  trend: <TrendingDown className="w-4 h-4" />,
};

const TYPE_STYLES = {
  warning: "bg-amber-50 border-amber-100 text-amber-800",
  alert: "bg-red-50 border-red-100 text-red-800",
  info: "bg-blue-50 border-blue-100 text-blue-800",
};

const ICON_STYLES = {
  warning: "bg-amber-100 text-amber-700",
  alert: "bg-red-100 text-red-600",
  info: "bg-blue-100 text-blue-700",
};

export function InsightsPanel({ insights }: { insights: Insight[] }) {
  if (insights.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-stone-50 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600" />
        <h2 className="text-lg font-bold text-stone-900">Insights & Alerts</h2>
      </div>
      <div className="p-4 space-y-3">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`flex items-start gap-3 p-4 rounded-xl border ${TYPE_STYLES[insight.type]}`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${ICON_STYLES[insight.type]}`}
            >
              {ICONS[insight.icon]}
            </div>
            <div>
              <p className="font-bold text-sm">{insight.title}</p>
              <p className="text-xs mt-0.5 opacity-80">{insight.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Server-side function to generate insights
export function generateInsights({
  medications,
  doseLogs,
  healthLogs,
  adherencePercent,
}: {
  medications: any[];
  doseLogs: any[];
  healthLogs: any[];
  adherencePercent: number;
}): Insight[] {
  const insights: Insight[] = [];

  // Low adherence alert
  if (adherencePercent < 50 && adherencePercent > 0) {
    insights.push({
      id: "low-adherence",
      type: "alert",
      icon: "pill",
      title: "Low medication adherence",
      description: `Your 7-day adherence is ${adherencePercent}%. Try setting reminders to stay on track.`,
    });
  } else if (adherencePercent < 80 && adherencePercent > 0) {
    insights.push({
      id: "moderate-adherence",
      type: "warning",
      icon: "pill",
      title: "Adherence could improve",
      description: `Your 7-day adherence is ${adherencePercent}%. Aim for 80%+ for best results.`,
    });
  }

  // Low stock medications
  const lowStock = medications.filter((m) => m.stock !== null && m.stock <= 5 && m.is_active);
  lowStock.forEach((med) => {
    insights.push({
      id: `low-stock-${med.id}`,
      type: "warning",
      icon: "pill",
      title: `${med.name} running low`,
      description: `Only ${med.stock} dose${med.stock !== 1 ? "s" : ""} remaining. Consider ordering a refill.`,
    });
  });

  // Missed doses today
  const missedToday = doseLogs.filter((d) => d.status === "missed");
  if (missedToday.length > 0) {
    insights.push({
      id: "missed-today",
      type: "alert",
      icon: "pill",
      title: `${missedToday.length} missed dose${missedToday.length > 1 ? "s" : ""} today`,
      description: "Check your medication schedule and mark doses accordingly.",
    });
  }

  // Low sleep detection
  const recentSleep = healthLogs
    .filter((l) => l.type === "sleep")
    .slice(0, 3);
  const avgSleep = recentSleep.length > 0
    ? recentSleep.reduce((sum, l) => sum + Number(l.value), 0) / recentSleep.length
    : null;

  if (avgSleep !== null && avgSleep < 6) {
    insights.push({
      id: "low-sleep",
      type: "warning",
      icon: "sleep",
      title: "Sleep quality is low",
      description: `Average ${avgSleep.toFixed(1)} hours over recent entries. Adults need 7-9 hours.`,
    });
  }

  // High heart rate
  const recentHR = healthLogs
    .filter((l) => l.type === "heart_rate")
    .slice(0, 3);
  const avgHR = recentHR.length > 0
    ? recentHR.reduce((sum, l) => sum + Number(l.value), 0) / recentHR.length
    : null;

  if (avgHR !== null && avgHR > 100) {
    insights.push({
      id: "high-hr",
      type: "alert",
      icon: "heart",
      title: "Elevated heart rate",
      description: `Average ${Math.round(avgHR)} bpm in recent readings. Consider consulting a doctor if persistent.`,
    });
  }

  // No recent logs
  if (healthLogs.length === 0) {
    insights.push({
      id: "no-logs",
      type: "info",
      icon: "trend",
      title: "Start logging health data",
      description: "Log sleep, steps, heart rate, and more to unlock personalized insights.",
    });
  }

  return insights;
}
