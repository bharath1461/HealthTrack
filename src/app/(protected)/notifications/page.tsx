"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
  const supabase = createClient();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase
        .from("notifications")
        .select("id, title, message, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (!error) setNotifications(data);
      setLoading(false);
    }
    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-pulse text-stone-400">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      <h1 className="text-3xl font-extrabold tracking-tight text-stone-900">Notifications</h1>
      {notifications.length === 0 ? (
        <p className="text-stone-500">You have no notifications.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((n) => (
            <li key={n.id} className="bg-white rounded-xl border border-stone-100 p-4 shadow-sm">
              <div className="flex items-center space-x-2 mb-2">
                <Bell className="w-5 h-5 text-teal-600" />
                <h2 className="text-lg font-semibold text-stone-900">{n.title}</h2>
              </div>
              <p className="text-sm text-stone-600 mb-1">{n.message}</p>
              <p className="text-xs text-stone-400">{new Date(n.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
