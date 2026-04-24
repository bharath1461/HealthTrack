import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Pill, ChevronRight, Package } from "lucide-react";
import { DeleteMedButton } from "@/components/delete-med-button";

export default async function MedicationsPage() {
  const supabase = await createClient();

  const { data: medications } = await supabase
    .from("medications")
    .select("*")
    .order("is_active", { ascending: false })
    .order("name", { ascending: true });

  // Calculate adherence per medication (last 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: doseLogs } = await supabase
    .from("dose_logs")
    .select("medication_id, status")
    .gte("scheduled_time", sevenDaysAgo);

  const getAdherence = (medId: string) => {
    const logs = doseLogs?.filter((d) => d.medication_id === medId) || [];
    if (logs.length === 0) return null;
    const taken = logs.filter((d) => d.status === "taken").length;
    return Math.round((taken / logs.length) * 100);
  };

  const activeMeds = medications?.filter((m) => m.is_active) || [];
  const inactiveMeds = medications?.filter((m) => !m.is_active) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-900">
            Medications
          </h1>
          <p className="text-stone-500 mt-1">
            {activeMeds.length} active medication{activeMeds.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/medications/add"
          className="inline-flex items-center gap-2 px-5 py-3 bg-teal-700 text-white text-sm font-bold rounded-xl hover:bg-teal-800 transition-all active:scale-95 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add New
        </Link>
      </div>

      {/* Medications List */}
      {activeMeds.length > 0 ? (
        <div className="space-y-3">
          {activeMeds.map((med) => {
            const adherence = getAdherence(med.id);
            const isLowStock = med.stock !== null && med.stock <= 5;
            return (
              <div
                key={med.id}
                className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-5 hover:border-teal-200 dark:hover:border-teal-800 hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 shrink-0">
                    <Pill className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-stone-900 text-base">
                          {med.name}
                        </h3>
                        <p className="text-sm text-stone-500 mt-0.5">
                          {med.dosage} &middot; {med.form || "tablet"} &middot;{" "}
                          {med.frequency}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/medications/${med.id}/edit`}
                          className="text-xs font-bold text-teal-700 hover:underline underline-offset-4 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Edit
                        </Link>
                        <DeleteMedButton medId={med.id} medName={med.name} />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-4">
                      {/* Schedule */}
                      <span className="text-xs font-medium text-stone-400 bg-stone-50 px-3 py-1.5 rounded-lg">
                        {med.timings?.join(", ") || "No schedule"}
                      </span>

                      {/* Stock */}
                      {med.stock !== null && (
                        <span
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                            isLowStock
                              ? "bg-amber-50 text-amber-700"
                              : "bg-stone-50 text-stone-600"
                          }`}
                        >
                          <Package className="w-3 h-3" />
                          {med.stock} left
                        </span>
                      )}

                      {/* Adherence */}
                      {adherence !== null && (
                        <span
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg ${
                            adherence >= 80
                              ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                              : adherence >= 50
                              ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                              : "bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400"
                          }`}
                        >
                          {adherence}% adherence
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-stone-50 dark:bg-stone-800 flex items-center justify-center mx-auto mb-5">
            <Pill className="w-8 h-8 text-stone-300 dark:text-stone-600" />
          </div>
          <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-lg mb-1 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
            No medications yet
          </h3>
          <p className="text-stone-500 dark:text-stone-400 text-sm mb-8 max-w-sm mx-auto">
            Add your first medication to start tracking doses, managing stock,
            and building your health routine.
          </p>
          <Link
            href="/medications/add"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 text-white text-sm font-bold rounded-xl hover:bg-teal-800 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Medication
          </Link>
        </div>
      )}

      {/* Inactive Medications */}
      {inactiveMeds.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest">
            Inactive
          </h2>
          {inactiveMeds.map((med) => (
            <div
              key={med.id}
              className="bg-stone-50 rounded-2xl p-5 opacity-60"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-400">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-600">{med.name}</h3>
                  <p className="text-xs text-stone-400">
                    {med.dosage} &middot; Ended{" "}
                    {med.end_date
                      ? new Date(med.end_date).toLocaleDateString("en-IN")
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pharmacy redirect card */}
      <a
        href="https://www.1mg.com"
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-gradient-to-r from-teal-700 to-teal-600 rounded-2xl p-6 text-white hover:shadow-lg transition-all group"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white/70">
              Need more meds?
            </p>
            <p className="text-lg font-bold mt-1">
              Order refills from 1mg
            </p>
          </div>
          <ChevronRight className="w-6 h-6 text-white/60 group-hover:translate-x-1 transition-transform" />
        </div>
      </a>
    </div>
  );
}
