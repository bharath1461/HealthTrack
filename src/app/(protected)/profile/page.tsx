"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Save, User, Mail, Activity, Calendar } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setDisplayName(user.user_metadata?.name || user.email?.split("@")[0] || "");
        setEmail(user.email || "");
        setCreatedAt(new Date(user.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" }));
      }
      setLoading(false);
    }
    fetchUser();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await supabase.auth.updateUser({ data: { name: displayName } });
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").upsert({ id: user.id, display_name: displayName, updated_at: new Date().toISOString() });
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-pulse text-stone-400">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-0">
      <Link href="/settings" className="inline-flex items-center text-teal-700 hover:text-teal-800 font-semibold mb-6 transition-colors">
        <ChevronLeft className="w-5 h-5 mr-1" /> Settings
      </Link>
      
      <div className="flex items-center gap-4 mb-8">
         <div className="w-20 h-20 rounded-[2rem] bg-teal-700 flex items-center justify-center text-white text-3xl font-extrabold shadow-xl shadow-teal-700/30">
            {displayName ? displayName.charAt(0).toUpperCase() : <User className="w-8 h-8" />}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100">{displayName || "Your Profile"}</h1>
            <p className="text-stone-500 dark:text-stone-400 font-medium">Manage your personal details</p>
          </div>
      </div>

      <div className="space-y-6">
        
        {/* Basic Info */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-100 dark:border-stone-800 p-6 md:p-8 shadow-sm">
          <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <User className="w-4 h-4" /> Personal Information
          </h2>
          
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-sm font-semibold text-stone-700 dark:text-stone-300">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="bg-stone-50 dark:bg-stone-800/50 border-none rounded-xl h-14 px-4 text-base shadow-inner focus-visible:ring-teal-600"
                placeholder="How should we call you?"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-stone-700 dark:text-stone-300">Email Address</Label>
              <div className="relative">
                <Input
                  id="email"
                  value={email}
                  disabled
                  className="bg-stone-50 dark:bg-stone-800/50 border-none rounded-xl h-14 pl-12 text-stone-500 cursor-not-allowed"
                />
                <Mail className="absolute left-4 top-4 w-5 h-5 text-stone-400" />
              </div>
              <p className="text-xs text-stone-400 mt-1">To change your email, please contact support.</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-stone-50 dark:border-stone-800 flex justify-end">
             <Button onClick={handleSave} disabled={saving} className="bg-teal-700 hover:bg-teal-800 text-white font-bold h-12 px-8 rounded-xl transition-all shadow-md shadow-teal-700/20 active:scale-95">
              {saving ? "Saving..." : saved ? "Saved Successfully!" : <><Save className="w-4 h-4 mr-2" /> Update Profile</>}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-100 dark:border-stone-800 p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Member Since</p>
                <p className="font-bold text-stone-800 dark:text-stone-200">{createdAt || "Recently"}</p>
              </div>
           </div>
           <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-100 dark:border-stone-800 p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Account Plan</p>
                <p className="font-bold text-stone-800 dark:text-stone-200">Free Tier</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
