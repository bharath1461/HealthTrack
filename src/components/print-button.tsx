"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-600 text-sm font-bold rounded-lg hover:bg-stone-200 transition-colors print:hidden"
    >
      <Printer className="w-4 h-4" /> Print / Save PDF
    </button>
  );
}
