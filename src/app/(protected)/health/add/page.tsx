"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const METRIC_TYPES = [
  { value: "sleep", label: "Sleep", unit: "hours", placeholder: "e.g., 7.5" },
  { value: "steps", label: "Steps", unit: "steps", placeholder: "e.g., 8000" },
  { value: "heart_rate", label: "Heart Rate", unit: "bpm", placeholder: "e.g., 72" },
  { value: "bp_systolic", label: "BP (Systolic)", unit: "mmHg", placeholder: "e.g., 120" },
  { value: "bp_diastolic", label: "BP (Diastolic)", unit: "mmHg", placeholder: "e.g., 80" },
  { value: "weight", label: "Weight", unit: "kg", placeholder: "e.g., 70" },
  { value: "mood", label: "Mood", unit: "/10", placeholder: "1-10" },
];

export default function AddHealthLogPage() {
  const [type, setType] = useState("sleep");
  const [value, setValue] = useState("");
  const [notes, setNotes] = useState("");
  const [recordedAt, setRecordedAt] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const selectedMetric = METRIC_TYPES.find((m) => m.value === type)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("health_logs").insert({
      user_id: user.id,
      type,
      value: parseFloat(value),
      unit: selectedMetric.unit,
      notes: notes || null,
      recorded_at: new Date(recordedAt).toISOString(),
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/health");
    router.refresh();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/health"
          className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-stone-900">
            Log Health Data
          </h1>
          <p className="text-sm text-stone-500">
            Record a new health measurement.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-100">
            {error}
          </div>
        )}

        {/* Metric Type Selection */}
        <div className="bg-white rounded-2xl border border-stone-100 p-6 space-y-5">
          <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest">
            Metric Type
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {METRIC_TYPES.map((metric) => (
              <button
                key={metric.value}
                type="button"
                onClick={() => setType(metric.value)}
                className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  type === metric.value
                    ? "bg-teal-700 text-white shadow-md"
                    : "bg-stone-50 text-stone-600 hover:bg-stone-100"
                }`}
              >
                {metric.label}
              </button>
            ))}
          </div>
        </div>

        {/* Value & Time */}
        <div className="bg-white rounded-2xl border border-stone-100 p-6 space-y-5">
          <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest">
            Measurement
          </h2>

          <div className="space-y-1.5">
            <Label htmlFor="value" className="text-sm font-semibold text-stone-600">
              Value ({selectedMetric.unit})
            </Label>
            <Input
              id="value"
              type="number"
              step="0.1"
              placeholder={selectedMetric.placeholder}
              className="bg-stone-50 border-none rounded-xl h-14 text-2xl font-bold text-center"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="recordedAt" className="text-sm font-semibold text-stone-600">
              Date & Time
            </Label>
            <Input
              id="recordedAt"
              type="datetime-local"
              className="bg-stone-50 border-none rounded-xl h-12"
              value={recordedAt}
              onChange={(e) => setRecordedAt(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-sm font-semibold text-stone-600">
              Notes (Optional)
            </Label>
            <textarea
              id="notes"
              placeholder="e.g., Felt well-rested, exercised before measurement"
              className="w-full bg-stone-50 border-none rounded-xl p-4 text-sm text-stone-700 focus:ring-2 focus:ring-teal-600/20 min-h-[80px] resize-none"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 py-6 bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-700/10 hover:bg-teal-800 transition-all disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Entry"}
          </Button>
          <Link
            href="/health"
            className="px-8 py-3 bg-stone-100 text-stone-600 font-semibold rounded-xl hover:bg-stone-200 transition-colors flex items-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
