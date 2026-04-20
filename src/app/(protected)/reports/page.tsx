import Link from "next/link";
import { FileText, Plus } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-900">Reports</h1>
          <p className="text-stone-500 mt-1">Generate and share health reports.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 p-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-stone-50 flex items-center justify-center mx-auto mb-5">
          <FileText className="w-8 h-8 text-stone-300" />
        </div>
        <h3 className="font-bold text-stone-900 text-lg mb-2">Reports coming soon</h3>
        <p className="text-stone-500 text-sm max-w-sm mx-auto">
          Generate shareable health summaries with medication adherence and vital trends.
          This feature will be available in Phase 4.
        </p>
      </div>
    </div>
  );
}
