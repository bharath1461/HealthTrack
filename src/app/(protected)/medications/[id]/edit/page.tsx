"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";

const FORM_OPTIONS = ["tablet", "capsule", "syrup", "injection", "other"];
const FREQUENCY_OPTIONS = ["Once daily", "Twice daily", "Three times daily", "Weekly", "As needed"];

export default function EditMedicationPage() {
  const params = useParams();
  const medId = params.id as string;
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [form, setForm] = useState("tablet");
  const [frequency, setFrequency] = useState("Once daily");
  const [timings, setTimings] = useState<string[]>(["09:00"]);
  const [stock, setStock] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function fetchMed() {
      const { data } = await supabase
        .from("medications")
        .select("*")
        .eq("id", medId)
        .single();

      if (data) {
        setName(data.name);
        setDosage(data.dosage);
        setForm(data.form || "tablet");
        setFrequency(data.frequency);
        setTimings(data.timings || ["09:00"]);
        setStock(data.stock?.toString() || "");
        setStartDate(data.start_date || "");
        setEndDate(data.end_date || "");
        setNotes(data.notes || "");
        setIsActive(data.is_active);
      }
      setFetching(false);
    }
    fetchMed();
  }, [medId, supabase]);

  const addTiming = () => setTimings([...timings, "12:00"]);
  const removeTiming = (index: number) => setTimings(timings.filter((_, i) => i !== index));
  const updateTiming = (index: number, value: string) => {
    const updated = [...timings];
    updated[index] = value;
    setTimings(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: updateError } = await supabase
      .from("medications")
      .update({
        name,
        dosage,
        form,
        frequency,
        timings,
        stock: stock ? parseInt(stock) : 0,
        start_date: startDate,
        end_date: endDate || null,
        notes: notes || null,
        is_active: isActive,
      })
      .eq("id", medId);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    router.push("/medications");
    router.refresh();
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-pulse text-stone-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/medications"
          className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-stone-900">
            Edit Medication
          </h1>
          <p className="text-sm text-stone-500">Update {name} details.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-100">
            {error}
          </div>
        )}

        {/* Identity */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-6 space-y-5">
          <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest">
            Identity
          </h2>
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-semibold text-stone-600">Name</Label>
            <Input id="name" className="bg-stone-50 border-none rounded-xl h-12" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="dosage" className="text-sm font-semibold text-stone-600">Dosage</Label>
              <Input id="dosage" className="bg-stone-50 border-none rounded-xl h-12" value={dosage} onChange={(e) => setDosage(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="form" className="text-sm font-semibold text-stone-600">Form</Label>
              <select id="form" value={form} onChange={(e) => setForm(e.target.value)} className="w-full bg-stone-50 border-none rounded-xl h-12 px-4 text-sm text-stone-700 focus:ring-2 focus:ring-teal-600/20">
                {FORM_OPTIONS.map((f) => (<option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>))}
              </select>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-6 space-y-5">
          <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest">Schedule</h2>
          <div className="space-y-1.5">
            <Label htmlFor="frequency" className="text-sm font-semibold text-stone-600">Frequency</Label>
            <select id="frequency" value={frequency} onChange={(e) => setFrequency(e.target.value)} className="w-full bg-stone-50 border-none rounded-xl h-12 px-4 text-sm text-stone-700 focus:ring-2 focus:ring-teal-600/20">
              {FREQUENCY_OPTIONS.map((f) => (<option key={f} value={f}>{f}</option>))}
            </select>
          </div>
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-stone-600">Timings</Label>
            {timings.map((time, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input type="time" value={time} onChange={(e) => updateTiming(i, e.target.value)} className="bg-stone-50 border-none rounded-xl h-12 flex-1" />
                {timings.length > 1 && (
                  <button type="button" onClick={() => removeTiming(i)} className="w-10 h-10 rounded-lg bg-stone-100 text-stone-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addTiming} className="text-sm font-bold text-teal-700 hover:underline underline-offset-4 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Add timing
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="startDate" className="text-sm font-semibold text-stone-600">Start Date</Label>
              <Input id="startDate" type="date" className="bg-stone-50 border-none rounded-xl h-12" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endDate" className="text-sm font-semibold text-stone-600">End Date</Label>
              <Input id="endDate" type="date" className="bg-stone-50 border-none rounded-xl h-12" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Inventory & Status */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-6 space-y-5">
          <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest">Inventory & Status</h2>
          <div className="space-y-1.5">
            <Label htmlFor="stock" className="text-sm font-semibold text-stone-600">Stock</Label>
            <Input id="stock" type="number" min="0" className="bg-stone-50 border-none rounded-xl h-12" value={stock} onChange={(e) => setStock(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-sm font-semibold text-stone-600">Notes</Label>
            <textarea id="notes" className="w-full bg-stone-50 border-none rounded-xl p-4 text-sm text-stone-700 focus:ring-2 focus:ring-teal-600/20 min-h-[100px] resize-none" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="isActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-4 h-4 rounded accent-teal-700" />
            <Label htmlFor="isActive" className="text-sm font-semibold text-stone-600">Active medication</Label>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading} className="flex-1 py-6 bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-700/10 hover:bg-teal-800 transition-all disabled:opacity-50">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
          <Link href="/medications" className="px-8 py-3 bg-stone-100 text-stone-600 font-semibold rounded-xl hover:bg-stone-200 transition-colors flex items-center">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
