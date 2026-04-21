"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, Save, User } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setDisplayName(user.user_metadata?.name || user.email?.split("@")[0] || "");
        setEmail(user.email || "");
      }
      setLoading(false);
    }
    fetchUser();
  }, [supabase]);

  const handleSave = async () => {
    setSaving(true);
    await supabase.auth.updateUser({
      data: { name: displayName },
    });
    // Also update profiles table
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("profiles")
        .upsert({ id: user.id, display_name: displayName, updated_at: new Date().toISOString() });
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-pulse text-stone-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-stone-900">Settings</h1>
        <p className="text-stone-500 mt-1">Manage your account and preferences.</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-stone-100 p-6 space-y-5">
        <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest">Profile</h2>

        <div className="flex items-center gap-4 mb-2">
          <div className="w-16 h-16 rounded-2xl bg-teal-700 flex items-center justify-center text-white text-2xl font-bold">
            {displayName ? displayName.charAt(0).toUpperCase() : <User className="w-7 h-7" />}
          </div>
          <div>
            <p className="text-sm text-stone-500">{email}</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="displayName" className="text-sm font-semibold text-stone-600">
            Display Name
          </Label>
          <Input
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="bg-stone-50 border-none rounded-xl h-12"
            placeholder="Your name"
          />
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-teal-700 text-white font-bold rounded-xl hover:bg-teal-800 transition-all"
        >
          {saving ? "Saving..." : saved ? "Saved!" : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
        </Button>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-2xl border border-stone-100 p-6">
        <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">Preferences</h2>
        <div className="space-y-1">
          <div className="flex items-center justify-between py-3 border-b border-stone-50">
            <Link href="/notifications" className="text-xs bg-teal-100 text-teal-600 px-3 py-1 rounded-lg hover:bg-teal-200">View Notifications</Link>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-stone-50">
            <span className="font-medium text-stone-700 text-sm">Dark Mode</span>
            <span className="text-xs bg-stone-100 text-stone-500 px-3 py-1 rounded-lg">Coming soon</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="font-medium text-stone-700 text-sm">Export Data</span>
            <span className="text-xs bg-stone-100 text-stone-500 px-3 py-1 rounded-lg">Coming soon</span>
          </div>
        </div>
      </div>

      {/* External Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          href="https://www.1mg.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-teal-700 to-teal-600 rounded-2xl p-6 text-white hover:shadow-lg transition-all"
        >
          <p className="text-sm font-semibold text-white/70">Need more meds?</p>
          <p className="text-base font-bold mt-1">Order from 1mg</p>
        </a>
        <a
          href="https://www.practo.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 text-white hover:shadow-lg transition-all"
        >
          <p className="text-sm font-semibold text-white/70">Need advice?</p>
          <p className="text-base font-bold mt-1">Consult on Practo</p>
        </a>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl border border-stone-100 p-6">
        <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">Account</h2>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      <p className="text-xs text-stone-400 text-center">
        HealthTrack is not a medical device. Consult qualified healthcare professionals for medical decisions.
      </p>
    </div>
  );
}
