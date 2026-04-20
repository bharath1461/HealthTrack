"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Check, X, SkipForward } from "lucide-react";

interface DoseActionProps {
  doseId: string;
  currentStatus: string;
}

export function DoseAction({ doseId, currentStatus }: DoseActionProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const updateDose = async (status: "taken" | "missed" | "skipped") => {
    setLoading(true);
    await supabase
      .from("dose_logs")
      .update({
        status,
        actual_time: status === "taken" ? new Date().toISOString() : null,
      })
      .eq("id", doseId);

    router.refresh();
    setLoading(false);
  };

  if (currentStatus !== "pending") {
    return (
      <span
        className={`text-xs font-bold px-3 py-1.5 rounded-lg ${
          currentStatus === "taken"
            ? "bg-emerald-50 text-emerald-700"
            : currentStatus === "missed"
            ? "bg-red-50 text-red-600"
            : "bg-amber-50 text-amber-700"
        }`}
      >
        {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => updateDose("taken")}
        disabled={loading}
        className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors disabled:opacity-50"
        title="Mark as taken"
      >
        <Check className="w-4 h-4" />
      </button>
      <button
        onClick={() => updateDose("skipped")}
        disabled={loading}
        className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 flex items-center justify-center transition-colors disabled:opacity-50"
        title="Skip"
      >
        <SkipForward className="w-4 h-4" />
      </button>
      <button
        onClick={() => updateDose("missed")}
        disabled={loading}
        className="w-9 h-9 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors disabled:opacity-50"
        title="Mark as missed"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
