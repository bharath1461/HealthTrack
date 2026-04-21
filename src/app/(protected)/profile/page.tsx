"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, Save, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const supabase = createClient();
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setDisplayName(user.user_metadata?.name || user.email?.split("@")[0] || "");
        setEmail(user.email || "");
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-pulse text-stone-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-4">
      <Link href="/settings" className="text-teal-700 hover:underline">← Back to Settings</Link>
      <h1 className="text-3xl font-extrabold tracking-tight text-stone-900">Profile</h1>
      <div className="bg-white rounded-2xl border border-stone-100 p-6 space-y-5">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-16 h-16 rounded-2xl bg-teal-700 flex items-center justify-center text-white text-2xl font-bold">
            {displayName ? displayName.charAt(0).toUpperCase() : <User className="w-7 h-7" />}
          </div>
          <div>
            <p className="text-sm text-stone-500">{email}</p>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="displayName" className="text-sm font-semibold text-stone-600">Display Name</Label>
          <Input
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="bg-stone-50 border-none rounded-xl h-12"
            placeholder="Your name"
          />
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-teal-700 text-white font-bold rounded-xl hover:bg-teal-800 transition-all">
          {saving ? "Saving..." : saved ? "Saved!" : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
        </Button>
        <Button onClick={handleLogout} variant="destructive" className="mt-4">
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </Button>
      </div>
    </div>
  );
}
