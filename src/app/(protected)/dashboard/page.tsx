import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Pill,
  HeartPulse,
  TrendingUp,
  AlertTriangle,
  Plus,
  ChevronRight,
  Moon,
  Footprints,
  Activity,
  Weight,
  Clock,
} from "lucide-react";
import { DoseAction } from "@/components/dose-action";
import { DashboardCharts } from "@/components/dashboard-charts";
import { InsightsPanel, generateInsights } from "@/components/insights";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName =
    user?.user_metadata?.name || user?.email?.split("@")[0] || "there";

  // Get today's date range
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();

  // Fetch active medications
  const { data: medications } = await supabase
    .from("medications")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  // Fetch today's dose logs
  let { data: doseLogs } = await supabase
    .from("dose_logs")
    .select("*, medications(name, dosage)")
    .gte("scheduled_time", startOfDay)
    .lt("scheduled_time", endOfDay)
    .order("scheduled_time", { ascending: true });

  // Auto-create pending dose_logs for active medications that don't have one today
  if (medications && medications.length > 0 && user) {
    const medsWithLogs = new Set(doseLogs?.map((d: any) => d.medication_id) || []);
    const medsNeedingLogs = medications.filter((m) => !medsWithLogs.has(m.id));
    if (medsNeedingLogs.length > 0) {
      const newLogs = medsNeedingLogs.map((m) => ({
        user_id: user.id,
        medication_id: m.id,
        scheduled_time: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0).toISOString(),
        status: "pending",
      }));
      await supabase.from("dose_logs").insert(newLogs);
      // Re-fetch dose logs after insert
      const { data: refreshedLogs } = await supabase
        .from("dose_logs")
        .select("*, medications(name, dosage)")
        .gte("scheduled_time", startOfDay)
        .lt("scheduled_time", endOfDay)
        .order("scheduled_time", { ascending: true });
      doseLogs = refreshedLogs;
    }
  }

  // Fetch recent health logs (last 7 days)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: healthLogs } = await supabase
    .from("health_logs")
    .select("*")
    .gte("recorded_at", sevenDaysAgo)
    .order("recorded_at", { ascending: false })
    .limit(10);

  // Calculate adherence (last 7 days)
  const { data: weekDoseLogs } = await supabase
    .from("dose_logs")
    .select("status, scheduled_time")
    .gte("scheduled_time", sevenDaysAgo);

  const totalDoses = weekDoseLogs?.length || 0;
  const takenDoses = weekDoseLogs?.filter((d) => d.status === "taken").length || 0;
  const adherencePercent = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0;

  // Build daily adherence data for chart
  const adherenceByDay: { day: string; percentage: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
    const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).toISOString();
    const dayDoses = weekDoseLogs?.filter(
      (dl) => dl.scheduled_time >= dayStart && dl.scheduled_time < dayEnd
    ) || [];
    const dayTaken = dayDoses.filter((dl) => dl.status === "taken").length;
    adherenceByDay.push({
      day: d.toLocaleDateString("en-IN", { weekday: "short" }),
      percentage: dayDoses.length > 0 ? Math.round((dayTaken / dayDoses.length) * 100) : 0,
    });
  }

  // Generate insights
  const insights = generateInsights({
    medications: medications || [],
    doseLogs: doseLogs || [],
    healthLogs: healthLogs || [],
    adherencePercent,
  });

  // Low stock medications
  const lowStockMeds = medications?.filter((m) => m.stock !== null && m.stock <= 5) || [];

  // Get latest health metrics
  const getLatestMetric = (type: string) => {
    return healthLogs?.find((log) => log.type === type);
  };

  const latestSleep = getLatestMetric("sleep");
  const latestSteps = getLatestMetric("steps");
  const latestHeart = getLatestMetric("heart_rate");
  const latestWeight = getLatestMetric("weight");

  // Time-based greeting
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // Pending doses
  const pendingDoses = doseLogs?.filter((d) => d.status === "pending") || [];
  const completedDoses = doseLogs?.filter((d) => d.status === "taken") || [];
  const missedDoses = doseLogs?.filter((d) => d.status === "missed") || [];

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <header className="max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 mb-1">
          {greeting}, {displayName}.
        </h1>
        <p className="text-base text-stone-500 dark:text-stone-400 leading-relaxed">
          {pendingDoses.length > 0
            ? `You have ${pendingDoses.length} dose${pendingDoses.length > 1 ? "s" : ""} scheduled for today.`
            : "Your restorative journey is on track."}
        </p>
      </header>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Adherence */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-100 dark:border-stone-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Adherence</span>
            <div className="w-8 h-8 rounded-full bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-teal-700 dark:text-teal-400" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-stone-900 dark:text-stone-100">{adherencePercent}%</p>
          <p className="text-xs text-stone-400 mt-1">7-day average</p>
        </div>



        {/* Today's Doses */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-100 dark:border-stone-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Today</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
              <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-stone-900 dark:text-stone-100">
            {completedDoses.length}/{doseLogs?.length || 0}
          </p>
          <p className="text-xs text-stone-400 mt-1">doses taken</p>
        </div>

        {/* Health Logs */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-100 dark:border-stone-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Logged</span>
            <div className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center">
              <HeartPulse className="w-4 h-4 text-rose-500 dark:text-rose-400" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-stone-900 dark:text-stone-100">{healthLogs?.length || 0}</p>
          <p className="text-xs text-stone-400 mt-1">last 7 days</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Medications - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-stone-50 dark:border-stone-800">
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">Today&apos;s Medications</h2>
            <Link
              href="/medications"
              className="text-sm font-bold text-teal-700 dark:text-teal-400 hover:underline underline-offset-4 flex items-center gap-1"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {medications && medications.length > 0 ? (
            <div className="divide-y divide-stone-50 dark:divide-stone-800">
              {medications.map((med) => {
                // Find today's dose log for this medication (if any)
                const todayDose = doseLogs?.find((d: any) => d.medication_id === med.id);
                const status = todayDose?.status || "no-log";
                return (
                  <div
                    key={med.id}
                    className="relative flex items-center justify-between px-6 py-4 hover:bg-stone-50/50 dark:hover:bg-stone-800/50 transition-colors"
                  >
                    {todayDose ? (
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                        status === "taken"
                          ? "bg-primary"
                          : status === "missed"
                          ? "bg-red-500"
                          : status === "skipped"
                          ? "bg-tertiary-fixed"
                          : "bg-primary"
                      }`} />
                    ) : null}
                    <div className="flex items-center gap-4 pl-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          status === "taken"
                            ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                            : status === "missed"
                            ? "bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400"
                            : status === "skipped"
                            ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
                            : "bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400"
                        }`}
                      >
                        <Pill className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-stone-900 dark:text-stone-100 text-sm">
                          {med.name}
                        </p>
                        <p className="text-xs text-stone-400">
                          {med.dosage}
                          {med.schedule ? ` · ${med.schedule}` : ""}
                          {med.stock !== null ? ` · ${med.stock} left` : ""}
                        </p>
                      </div>
                    </div>
                    {todayDose ? (
                      <DoseAction doseId={todayDose.id} currentStatus={todayDose.status} />
                    ) : (
                      <span className="text-xs font-medium text-stone-400 bg-stone-50 dark:bg-stone-800 px-3 py-1.5 rounded-lg">
                        No dose today
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-stone-50 dark:bg-stone-800 flex items-center justify-center mx-auto mb-4">
                <Pill className="w-7 h-7 text-stone-300 dark:text-stone-600" />
              </div>
              <p className="text-stone-500 dark:text-stone-400 font-medium mb-1">No medications yet</p>
              <p className="text-sm text-stone-400 mb-6">
                Add medications to start tracking your doses.
              </p>
              <Link
                href="/medications/add"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 dark:bg-teal-600 text-white text-sm font-bold rounded-lg hover:bg-teal-800 dark:hover:bg-teal-700 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Medication
              </Link>
            </div>
          )}
        </div>

        {/* Health Vitals Sidebar */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-50 dark:border-stone-800">
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">Latest Vitals</h2>
              <Link
                href="/health"
                className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline underline-offset-4"
              >
                Log New
              </Link>
            </div>
            <div className="p-2">
              <VitalCard
                icon={<Moon className="w-4 h-4" />}
                label="Sleep"
                value={latestSleep ? `${latestSleep.value}` : "--"}
                unit="hrs"
                color="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
              />
              <VitalCard
                icon={<Footprints className="w-4 h-4" />}
                label="Steps"
                value={latestSteps ? `${Number(latestSteps.value).toLocaleString()}` : "--"}
                unit=""
                color="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
              />
              <VitalCard
                icon={<Activity className="w-4 h-4" />}
                label="Heart Rate"
                value={latestHeart ? `${latestHeart.value}` : "--"}
                unit="bpm"
                color="bg-rose-50 dark:bg-rose-900/20 text-rose-500 dark:text-rose-400"
              />
              <VitalCard
                icon={<Weight className="w-4 h-4" />}
                label="Weight"
                value={latestWeight ? `${latestWeight.value}` : "--"}
                unit="kg"
                color="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
              />
            </div>
          </div>

          {/* Alerts */}
          {(lowStockMeds.length > 0 || missedDoses.length > 0) && (
            <div className="bg-amber-50/50 rounded-2xl border border-amber-100 p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-amber-900">Alerts</h3>
              </div>
              <div className="space-y-3">
                {lowStockMeds.map((med) => (
                  <div key={med.id} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <p className="text-sm text-amber-800">
                      <span className="font-semibold">{med.name}</span> — only{" "}
                      {med.stock} dose{med.stock !== 1 ? "s" : ""} left
                    </p>
                  </div>
                ))}
                {missedDoses.length > 0 && (
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                    <p className="text-sm text-red-800">
                      {missedDoses.length} missed dose{missedDoses.length > 1 ? "s" : ""} today
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Adherence Chart + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCharts adherenceData={adherenceByDay} />
        <InsightsPanel insights={insights} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          href="/medications/add"
          className="group bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-100 dark:border-stone-800 hover:border-teal-200 dark:hover:border-teal-800 hover:shadow-md transition-all text-center"
        >
          <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
            <Plus className="w-5 h-5 text-teal-700 dark:text-teal-400" />
          </div>
          <p className="text-sm font-bold text-stone-700 dark:text-stone-300">Add Medication</p>
        </Link>
        <Link
          href="/health/add"
          className="group bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-100 dark:border-stone-800 hover:border-teal-200 dark:hover:border-teal-800 hover:shadow-md transition-all text-center"
        >
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
            <HeartPulse className="w-5 h-5 text-rose-500 dark:text-rose-400" />
          </div>
          <p className="text-sm font-bold text-stone-700 dark:text-stone-300">Log Health Data</p>
        </Link>
        <a
          href="https://www.1mg.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-100 dark:border-stone-800 hover:border-teal-200 dark:hover:border-teal-800 hover:shadow-md transition-all text-center"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
            <Pill className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-sm font-bold text-stone-700 dark:text-stone-300">Refill Meds</p>
        </a>
        <Link
          href="/reports"
          className="group bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-100 dark:border-stone-800 hover:border-teal-200 dark:hover:border-teal-800 hover:shadow-md transition-all text-center"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-sm font-bold text-stone-700 dark:text-stone-300">View Reports</p>
        </Link>
      </div>
    </div>
  );
}

function VitalCard({
  icon,
  label,
  value,
  unit,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-stone-50/50 dark:hover:bg-stone-800/50 transition-colors">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-stone-400 font-medium">{label}</p>
        <p className="text-sm font-bold text-stone-900 dark:text-stone-100">
          {value} <span className="text-xs font-normal text-stone-400">{unit}</span>
        </p>
      </div>
    </div>
  );
}
