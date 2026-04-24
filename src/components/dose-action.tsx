"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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

  if (currentStatus === "taken") {
    return (
      <span className="px-3 py-2 bg-primary text-white text-xs font-bold rounded-lg">
        Taken
      </span>
    );
  }

  if (currentStatus === "skipped") {
    return (
      <span className="px-3 py-2 bg-surface-container text-stone-700 text-xs font-bold rounded-lg">
        Skipped
      </span>
    );
  }

  if (currentStatus === "missed") {
    return (
      <span className="px-3 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-lg">
        Missed
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => updateDose("taken")}
        disabled={loading}
        className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        Mark Taken
      </button>
      <button
        onClick={() => updateDose("skipped")}
        disabled={loading}
        className="px-4 py-2 bg-surface-container-high text-stone-700 text-sm font-semibold rounded-lg hover:bg-stone-200 transition-colors disabled:opacity-50"
      >
        Skip
      </button>
    </div>
  );
}
