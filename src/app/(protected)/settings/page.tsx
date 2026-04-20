import { createClient } from "@/lib/supabase/server";
import { Settings as SettingsIcon } from "lucide-react";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const displayName = user?.user_metadata?.name || user?.email?.split("@")[0] || "User";
  const email = user?.email || "";

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-stone-900">Settings</h1>
        <p className="text-stone-500 mt-1">Manage your account and preferences.</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-stone-100 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-teal-700 flex items-center justify-center text-white text-2xl font-bold">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900">{displayName}</h2>
            <p className="text-sm text-stone-500">{email}</p>
          </div>
        </div>
      </div>

      {/* Placeholder sections */}
      <div className="bg-white rounded-2xl border border-stone-100 p-6">
        <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">Preferences</h2>
        <div className="space-y-4 text-sm text-stone-500">
          <div className="flex items-center justify-between py-3 border-b border-stone-50">
            <span className="font-medium text-stone-700">Notifications</span>
            <span className="text-xs bg-stone-100 text-stone-500 px-3 py-1 rounded-lg">Coming soon</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-stone-50">
            <span className="font-medium text-stone-700">Dark Mode</span>
            <span className="text-xs bg-stone-100 text-stone-500 px-3 py-1 rounded-lg">Coming soon</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="font-medium text-stone-700">Export Data</span>
            <span className="text-xs bg-stone-100 text-stone-500 px-3 py-1 rounded-lg">Coming soon</span>
          </div>
        </div>
      </div>

      {/* Consult redirect */}
      <a
        href="https://www.practo.com"
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 text-white hover:shadow-lg transition-all"
      >
        <p className="text-sm font-semibold text-white/70">Need medical advice?</p>
        <p className="text-lg font-bold mt-1">Consult a doctor on Practo</p>
      </a>

      <p className="text-xs text-stone-400 text-center">
        HealthTrack is not a medical device. Consult qualified healthcare professionals for medical decisions.
      </p>
    </div>
  );
}
