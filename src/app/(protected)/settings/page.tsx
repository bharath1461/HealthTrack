"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, Save, User, Bell, Moon, Sun, Laptop } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const { theme, setTheme } = useTheme();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Push Notifications State
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushSupported, setPushSupported] = useState(false);

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

    if ("Notification" in window && "serviceWorker" in navigator) {
      setPushSupported(true);
      if (Notification.permission === "granted") setPushEnabled(true);
    }
  }, [supabase]);

  const handleSave = async () => {
    setSaving(true);
    await supabase.auth.updateUser({
      data: { name: displayName },
    });
    
    const { data: { user } } = await supabase.auth.getUser();
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

  const togglePushNotifications = async (checked: boolean) => {
    if (!pushSupported) return;
    if (checked) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") setPushEnabled(true);
    } else {
      // Browsers don't allow "revoking" easily, so we just toggle the UI preference.
      setPushEnabled(false);
      alert("Please revoke permission directly in your browser settings if you wish to block notifications completely.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="animate-pulse text-stone-400">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-4">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100">Settings</h1>
        <p className="text-stone-500 dark:text-stone-400 mt-1">Manage your account and preferences.</p>
      </div>

      {/* Account / Profile Quick View */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-6 space-y-5">
        <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest flex items-center justify-between">
          <span>Account</span>
          <Link href="/profile" className="text-teal-600 hover:text-teal-700 font-semibold tracking-normal normal-case text-sm">
            Edit Full Profile
          </Link>
        </h2>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-teal-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-teal-700/20">
            {displayName ? displayName.charAt(0).toUpperCase() : <User className="w-7 h-7" />}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-stone-900 dark:text-stone-100">{displayName || "User"}</h3>
            <p className="text-sm text-stone-500 dark:text-stone-400">{email}</p>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-6 space-y-5">
        <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest">Appearance</h2>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setTheme("light")}
            className={`flex flex-col items-center justify-center py-4 rounded-xl border-2 transition-all ${
              theme === "light" ? "border-teal-600 bg-teal-50 dark:bg-teal-900/10 text-teal-700" : "border-stone-100 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300"
            }`}
          >
            <Sun className="w-6 h-6 mb-2" />
            <span className="text-sm font-semibold">Light</span>
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`flex flex-col items-center justify-center py-4 rounded-xl border-2 transition-all ${
              theme === "dark" ? "border-teal-600 bg-teal-50 dark:bg-teal-900/10 text-teal-700" : "border-stone-100 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300"
            }`}
          >
            <Moon className="w-6 h-6 mb-2" />
            <span className="text-sm font-semibold">Dark</span>
          </button>
          <button
            onClick={() => setTheme("system")}
            className={`flex flex-col items-center justify-center py-4 rounded-xl border-2 transition-all ${
              theme === "system" ? "border-teal-600 bg-teal-50 dark:bg-teal-900/10 text-teal-700" : "border-stone-100 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300"
            }`}
          >
            <Laptop className="w-6 h-6 mb-2" />
            <span className="text-sm font-semibold">System</span>
          </button>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-6">
        <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Preferences</h2>
        <div className="space-y-4">
          
          <div className="flex items-center justify-between pb-4 border-b border-stone-50 dark:border-stone-800">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center">
                 <Bell className="w-5 h-5 text-teal-600" />
               </div>
               <div>
                 <span className="font-semibold text-stone-900 dark:text-stone-100 text-sm block">Push Notifications</span>
                 <span className="text-xs text-stone-500">Meds tracking reminders</span>
               </div>
            </div>
            {pushSupported ? (
                <div 
                  className={`w-12 h-6 rounded-full cursor-pointer relative transition-colors ${pushEnabled ? 'bg-teal-600' : 'bg-stone-200 dark:bg-stone-700'}`}
                  onClick={() => togglePushNotifications(!pushEnabled)}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${pushEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
                </div>
            ) : (
                <span className="text-xs bg-stone-100 dark:bg-stone-800 text-stone-500 px-3 py-1 rounded-lg">Not Supported</span>
            )}
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
               <div>
                 <span className="font-semibold text-stone-900 dark:text-stone-100 text-sm block">In-app Notifications</span>
                 <span className="text-xs text-stone-500">View your activity inbox</span>
               </div>
            </div>
            <Link href="/notifications" className="text-xs font-semibold bg-teal-50 dark:bg-teal-900/20 text-teal-700 px-4 py-2 rounded-xl hover:bg-teal-100 dark:hover:bg-teal-900/40 transition-colors">
              Inbox
            </Link>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-6">
        <h2 className="text-xs font-bold text-red-500/80 uppercase tracking-widest mb-4">Danger Zone</h2>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full gap-2 px-5 py-4 bg-red-50 dark:bg-red-950/30 text-red-600 text-sm font-bold rounded-xl hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
        >
          <LogOut className="w-5 h-5" /> Sign Out from Account
        </button>
      </div>

      <p className="text-xs text-stone-400 text-center pb-8">
        HealthTrack is not a medical device. Consult qualified healthcare professionals.
      </p>
    </div>
  );
}
