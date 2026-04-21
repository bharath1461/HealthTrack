import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import {
  Pill,
  HeartPulse,
  TrendingUp,
  Moon,
  Footprints,
  Activity,
  Weight,
  Brain,
  Calendar,
  Shield,
} from "lucide-react";
import { PrintButton } from "@/components/print-button";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const METRIC_LABELS: Record<string, string> = {
  sleep: "Sleep", steps: "Steps", heart_rate: "Heart Rate",
  bp_systolic: "BP (Systolic)", bp_diastolic: "BP (Diastolic)",
  weight: "Weight", mood: "Mood",
};
const METRIC_UNITS: Record<string, string> = {
  sleep: "hrs", steps: "", heart_rate: "bpm",
  bp_systolic: "mmHg", bp_diastolic: "mmHg", weight: "kg", mood: "/10",
};
const METRIC_ICONS: Record<string, React.ReactNode> = {
  sleep: <Moon className="w-4 h-4" />, steps: <Footprints className="w-4 h-4" />,
  heart_rate: <Activity className="w-4 h-4" />, bp_systolic: <HeartPulse className="w-4 h-4" />,
  weight: <Weight className="w-4 h-4" />, mood: <Brain className="w-4 h-4" />,
};
const METRIC_COLORS: Record<string, string> = {
  sleep: "bg-indigo-50 text-indigo-600", steps: "bg-emerald-50 text-emerald-600",
  heart_rate: "bg-rose-50 text-rose-500", bp_systolic: "bg-red-50 text-red-500",
  bp_diastolic: "bg-orange-50 text-orange-500", weight: "bg-amber-50 text-amber-600",
  mood: "bg-purple-50 text-purple-600",
};

export default async function PublicReportPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  // Use service-level client (no auth needed for public share)
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Fetch report
  const { data: report } = await supabase
    .from("reports")
    .select("*")
    .eq("share_token", token)
    .single();

  if (!report) return notFound();

  // Check expiry
  if (new Date(report.expires_at) < new Date()) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center max-w-md">
          <Shield className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-stone-900 mb-2">Report Expired</h1>
          <p className="text-stone-500 text-sm">
            This health report link has expired. Please ask the patient to generate a new one.
          </p>
        </div>
      </div>
    );
  }

  // Increment view count
  await supabase
    .from("reports")
    .update({ view_count: (report.view_count || 0) + 1 })
    .eq("id", report.id);

  const userId = report.user_id;

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  // Fetch medications
  const { data: medications } = await supabase
    .from("medications")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("name");

  // 7-day adherence
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: doseLogs } = await supabase
    .from("dose_logs")
    .select("status")
    .eq("user_id", userId)
    .gte("scheduled_time", sevenDaysAgo);

  const totalDoses = doseLogs?.length || 0;
  const takenDoses = doseLogs?.filter((d) => d.status === "taken").length || 0;
  const adherence = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0;

  // Recent health logs
  const { data: healthLogs } = await supabase
    .from("health_logs")
    .select("*")
    .eq("user_id", userId)
    .gte("recorded_at", sevenDaysAgo)
    .order("recorded_at", { ascending: false });

  // Latest by type
  const latestByType: Record<string, (typeof healthLogs extends (infer T)[] | null ? T : never)> = {};
  healthLogs?.forEach((log) => {
    if (!latestByType[log.type]) latestByType[log.type] = log;
  });

  const now = new Date();

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header Bar */}
      <header className="bg-white border-b border-stone-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-700 rounded-lg flex items-center justify-center">
              <HeartPulse className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-teal-700 tracking-tighter">HealthTrack Report</span>
          </div>
          <PrintButton />
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-8 print:p-2 print:space-y-4">
        {/* Report Header */}
        <div className="bg-white rounded-2xl border border-stone-100 p-8 print:p-4 print:border-none">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-stone-900">Health Summary</h1>
              <p className="text-sm text-stone-500 mt-1">
                Patient: {profile?.display_name || "Not specified"}
              </p>
              <p className="text-xs text-stone-400 mt-0.5 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Generated {now.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                {" "}— 7-day window
              </p>
            </div>
            <div className="text-right">
              <div
                className={`text-3xl font-extrabold ${
                  adherence >= 80 ? "text-emerald-600" : adherence >= 50 ? "text-amber-600" : "text-red-600"
                }`}
              >
                {adherence}%
              </div>
              <p className="text-xs text-stone-400">Adherence</p>
            </div>
          </div>
        </div>

        {/* Vitals Grid */}
        {Object.keys(latestByType).length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-3">Latest Vitals</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(latestByType).map(([type, log]) => (
                <div key={type} className="bg-white rounded-xl border border-stone-100 p-4 print:border print:border-stone-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${METRIC_COLORS[type] || "bg-stone-50"}`}>
                      {METRIC_ICONS[type] || <Activity className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-xs font-bold text-stone-400">{METRIC_LABELS[type] || type}</span>
                  </div>
                  <p className="text-xl font-extrabold text-stone-900">
                    {Number(log.value).toLocaleString()}
                    <span className="text-xs font-normal text-stone-400 ml-1">{METRIC_UNITS[type]}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Medications Table */}
        <div>
          <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-3">Active Medications</h2>
          {medications && medications.length > 0 ? (
            <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden print:border print:border-stone-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-50 text-left">
                    <th className="px-5 py-3 font-bold text-stone-500 text-xs uppercase tracking-widest">Medication</th>
                    <th className="px-5 py-3 font-bold text-stone-500 text-xs uppercase tracking-widest">Dosage</th>
                    <th className="px-5 py-3 font-bold text-stone-500 text-xs uppercase tracking-widest">Frequency</th>
                    <th className="px-5 py-3 font-bold text-stone-500 text-xs uppercase tracking-widest">Schedule</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {medications.map((med) => (
                    <tr key={med.id} className="hover:bg-stone-50/50">
                      <td className="px-5 py-3 font-semibold text-stone-900">{med.name}</td>
                      <td className="px-5 py-3 text-stone-600">{med.dosage}</td>
                      <td className="px-5 py-3 text-stone-600">{med.frequency}</td>
                      <td className="px-5 py-3 text-stone-500">{med.timings?.join(", ") || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-stone-400">No active medications.</p>
          )}
        </div>

        {/* Dose Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-stone-100 p-5 text-center print:border print:border-stone-200">
            <p className="text-2xl font-extrabold text-emerald-600">{takenDoses}</p>
            <p className="text-xs text-stone-400 mt-1">Taken</p>
          </div>
          <div className="bg-white rounded-xl border border-stone-100 p-5 text-center print:border print:border-stone-200">
            <p className="text-2xl font-extrabold text-red-500">
              {doseLogs?.filter((d) => d.status === "missed").length || 0}
            </p>
            <p className="text-xs text-stone-400 mt-1">Missed</p>
          </div>
          <div className="bg-white rounded-xl border border-stone-100 p-5 text-center print:border print:border-stone-200">
            <p className="text-2xl font-extrabold text-amber-600">
              {doseLogs?.filter((d) => d.status === "skipped").length || 0}
            </p>
            <p className="text-xs text-stone-400 mt-1">Skipped</p>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-stone-400 pt-4 border-t border-stone-100">
          <p>This report was generated automatically by HealthTrack.</p>
          <p className="mt-1">
            HealthTrack is not a medical device. Please consult a qualified healthcare professional.
          </p>
        </footer>
      </main>
    </div>
  );
}
