"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Trash2 } from "lucide-react";

export function DeleteMedButton({ medId, medName }: { medId: string; medName: string }) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    setLoading(true);
    await supabase.from("medications").delete().eq("id", medId);
    router.refresh();
    setLoading(false);
    setConfirming(false);
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-stone-500">Delete {medName}?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs font-bold text-red-600 hover:underline"
        >
          {loading ? "..." : "Yes"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs font-bold text-stone-500 hover:underline"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="w-8 h-8 rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
      title="Delete"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  );
}
