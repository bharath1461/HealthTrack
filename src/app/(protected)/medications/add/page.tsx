"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";

const FORM_OPTIONS = ["tablet", "capsule", "syrup", "injection", "other"];
const FREQUENCY_OPTIONS = ["Once daily", "Twice daily", "Three times daily", "Weekly", "As needed"];

export default function AddMedicationPage() {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [form, setForm] = useState("tablet");
  const [frequency, setFrequency] = useState("Once daily");
  const [timings, setTimings] = useState<string[]>(["09:00"]);
  const [stock, setStock] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const addTiming = () => {
    setTimings([...timings, "12:00"]);
  };

  const removeTiming = (index: number) => {
    setTimings(timings.filter((_, i) => i !== index));
  };

  const updateTiming = (index: number, value: string) => {
    const updated = [...timings];
    updated[index] = value;
    setTimings(updated);
  };

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

    const { error: insertError } = await supabase.from("medications").insert({
      user_id: user.id,
      name,
      dosage,
      form,
      frequency,
      timings,
      stock: stock ? parseInt(stock) : 0,
      start_date: startDate,
      end_date: endDate || null,
      notes: notes || null,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/medications");
    router.refresh();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/medications"
          className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-stone-900">
            Add Medication
          </h1>
          <p className="text-sm text-stone-500">
            Enter your medication details below.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-100">
            {error}
          </div>
        )}

        {/* Identity Section */}
        <div className="bg-white rounded-2xl border border-stone-100 p-6 space-y-5">
          <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest">
            Identity
          </h2>

          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-semibold text-stone-600">
              Medication Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., Lisinopril"
              className="bg-stone-50 border-none rounded-xl h-12"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="dosage" className="text-sm font-semibold text-stone-600">
                Dosage
              </Label>
              <Input
                id="dosage"
                type="text"
                placeholder="e.g., 10mg"
                className="bg-stone-50 border-none rounded-xl h-12"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="form" className="text-sm font-semibold text-stone-600">
                Form
              </Label>
              <select
                id="form"
                value={form}
                onChange={(e) => setForm(e.target.value)}
                className="w-full bg-stone-50 border-none rounded-xl h-12 px-4 text-sm text-stone-700 focus:ring-2 focus:ring-teal-600/20"
              >
                {FORM_OPTIONS.map((f) => (
                  <option key={f} value={f}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="bg-white rounded-2xl border border-stone-100 p-6 space-y-5">
          <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest">
            Schedule
          </h2>

          <div className="space-y-1.5">
            <Label htmlFor="frequency" className="text-sm font-semibold text-stone-600">
              Frequency
            </Label>
            <select
              id="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full bg-stone-50 border-none rounded-xl h-12 px-4 text-sm text-stone-700 focus:ring-2 focus:ring-teal-600/20"
            >
              {FREQUENCY_OPTIONS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-stone-600">
              Timings
            </Label>
            {timings.map((time, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => updateTiming(i, e.target.value)}
                  className="bg-stone-50 border-none rounded-xl h-12 flex-1"
                />
                {timings.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTiming(i)}
                    className="w-10 h-10 rounded-lg bg-stone-100 text-stone-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addTiming}
              className="text-sm font-bold text-teal-700 hover:underline underline-offset-4 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add timing
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="startDate" className="text-sm font-semibold text-stone-600">
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                className="bg-stone-50 border-none rounded-xl h-12"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endDate" className="text-sm font-semibold text-stone-600">
                End Date (Optional)
              </Label>
              <Input
                id="endDate"
                type="date"
                className="bg-stone-50 border-none rounded-xl h-12"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Inventory Section */}
        <div className="bg-white rounded-2xl border border-stone-100 p-6 space-y-5">
          <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest">
            Inventory & Notes
          </h2>

          <div className="space-y-1.5">
            <Label htmlFor="stock" className="text-sm font-semibold text-stone-600">
              Current Stock (doses)
            </Label>
            <Input
              id="stock"
              type="number"
              min="0"
              placeholder="e.g., 30"
              className="bg-stone-50 border-none rounded-xl h-12"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-sm font-semibold text-stone-600">
              Notes (Optional)
            </Label>
            <textarea
              id="notes"
              placeholder="e.g., Take with food, avoid grapefruit"
              className="w-full bg-stone-50 border-none rounded-xl p-4 text-sm text-stone-700 focus:ring-2 focus:ring-teal-600/20 min-h-[100px] resize-none"
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
            {loading ? "Adding..." : "Add Medication"}
          </Button>
          <Link
            href="/medications"
            className="px-8 py-3 bg-stone-100 text-stone-600 font-semibold rounded-xl hover:bg-stone-200 transition-colors flex items-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
