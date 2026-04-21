"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  FileText,
  Plus,
  Share2,
  Clock,
  Eye,
  Copy,
  Check,
  ExternalLink,
  Trash2,
} from "lucide-react";

interface Report {
  id: string;
  share_token: string;
  expires_at: string;
  view_count: number;
  created_at: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const supabase = createClient();

  const fetchReports = async () => {
    const { data } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });
    setReports(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const generateReport = async () => {
    setGenerating(true);
    const res = await fetch("/api/reports/generate", { method: "POST" });
    if (res.ok) {
      await fetchReports();
    }
    setGenerating(false);
  };

  const deleteReport = async (id: string) => {
    await supabase.from("reports").delete().eq("id", id);
    await fetchReports();
  };

  const copyLink = (token: string) => {
    const url = `${window.location.origin}/report/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(token);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date();

  const activeReports = reports.filter((r) => !isExpired(r.expires_at));
  const expiredReports = reports.filter((r) => isExpired(r.expires_at));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-pulse text-stone-400">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-900">
            Reports
          </h1>
          <p className="text-stone-500 mt-1">
            Generate and share health reports with your doctor.
          </p>
        </div>
        <button
          onClick={generateReport}
          disabled={generating}
          className="inline-flex items-center gap-2 px-5 py-3 bg-teal-700 text-white text-sm font-bold rounded-xl hover:bg-teal-800 transition-all active:scale-95 shadow-sm disabled:opacity-50"
        >
          {generating ? (
            "Generating..."
          ) : (
            <>
              <Plus className="w-4 h-4" /> Generate Report
            </>
          )}
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-teal-50 rounded-2xl p-6 border border-teal-100">
        <div className="flex items-start gap-3">
          <Share2 className="w-5 h-5 text-teal-700 mt-0.5 shrink-0" />
          <div>
            <p className="font-bold text-teal-900 text-sm">How it works</p>
            <p className="text-sm text-teal-700 mt-1 leading-relaxed">
              Generate a report to create a secure, shareable link. The link
              includes your medication list, adherence stats, and recent health
              data. Links expire after 24 hours for privacy.
            </p>
          </div>
        </div>
      </div>

      {/* Active Reports */}
      {activeReports.length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest">
            Active Reports
          </h2>
          {activeReports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-2xl border border-stone-100 p-5 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-stone-900">Health Report</p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Created{" "}
                      {new Date(report.created_at).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs font-medium text-stone-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Expires{" "}
                        {new Date(report.expires_at).toLocaleDateString(
                          "en-IN",
                          { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
                        )}
                      </span>
                      <span className="text-xs font-medium text-stone-400 flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {report.view_count} view{report.view_count !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyLink(report.share_token)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-50 text-teal-700 text-xs font-bold rounded-lg hover:bg-teal-100 transition-colors"
                  >
                    {copiedId === report.share_token ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Link
                      </>
                    )}
                  </button>
                  <Link
                    href={`/report/${report.share_token}`}
                    target="_blank"
                    className="w-9 h-9 rounded-lg bg-stone-50 text-stone-500 hover:bg-stone-100 flex items-center justify-center transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => deleteReport(report.id)}
                    className="w-9 h-9 rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-100 p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-stone-50 flex items-center justify-center mx-auto mb-5">
            <FileText className="w-8 h-8 text-stone-300" />
          </div>
          <h3 className="font-bold text-stone-900 text-lg mb-2">
            No active reports
          </h3>
          <p className="text-stone-500 text-sm mb-8 max-w-sm mx-auto">
            Generate a report to create a secure, shareable link for your
            healthcare provider.
          </p>
          <button
            onClick={generateReport}
            disabled={generating}
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700 text-white text-sm font-bold rounded-xl hover:bg-teal-800 transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />{" "}
            {generating ? "Generating..." : "Generate Report"}
          </button>
        </div>
      )}

      {/* Expired Reports */}
      {expiredReports.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest">
            Expired
          </h2>
          {expiredReports.map((report) => (
            <div
              key={report.id}
              className="bg-stone-50 rounded-xl p-4 opacity-60 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-stone-400" />
                <div>
                  <p className="text-sm font-medium text-stone-600">
                    Report — expired
                  </p>
                  <p className="text-xs text-stone-400">
                    {new Date(report.created_at).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => deleteReport(report.id)}
                className="text-xs text-stone-400 hover:text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
