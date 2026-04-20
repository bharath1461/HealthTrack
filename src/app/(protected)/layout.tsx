"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Home,
  Pill,
  HeartPulse,
  FileText,
  Settings,
  Menu,
  LogOut,
  Bell,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/medications", label: "Meds", icon: Pill },
  { href: "/health", label: "Health", icon: HeartPulse },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Side Navigation (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-stone-50 py-8 px-4 space-y-2 z-50 border-r border-stone-100">
        <div className="text-lg font-bold text-teal-700 mb-1 px-4">
          HealthTrack
        </div>
        <span className="block text-xs font-medium text-stone-400 uppercase tracking-widest mb-6 px-4">
          Clinical Serenity
        </span>

        <nav className="flex flex-col space-y-1 flex-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium tracking-wide ${
                  isActive
                    ? "text-teal-700 border-r-2 border-teal-700 font-semibold bg-teal-50/50"
                    : "text-stone-500 hover:bg-teal-50/50 hover:text-teal-700"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label === "Meds" ? "Medications" : item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleSignOut}
          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50/50 transition-all duration-200 text-sm font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </aside>

      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-stone-200/30 shadow-[0_8px_24px_rgba(15,118,110,0.06)] md:pl-64">
        <div className="flex justify-between items-center px-6 h-16 w-full max-w-screen-2xl mx-auto">
          <div className="text-xl font-semibold tracking-tighter text-teal-700 md:hidden">
            HealthTrack
          </div>
          <div className="hidden md:block" />
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-stone-100/50 transition-colors text-stone-500">
              <Bell className="w-5 h-5" />
            </button>
            <div className="h-8 w-8 rounded-full bg-teal-700 flex items-center justify-center text-white text-sm font-bold">
              U
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-24 md:pb-8 md:pl-64 min-h-screen">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-8">
          {children}
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pt-3 pb-6 bg-white/80 backdrop-blur-xl border-t border-stone-200/30 z-50 rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        {navItems.slice(0, 4).map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center px-4 py-1 rounded-xl transition-all duration-75 ${
                isActive
                  ? "bg-teal-50 text-teal-700"
                  : "text-stone-400"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium mt-0.5">
                {item.label}
              </span>
            </Link>
          );
        })}
        <Link
          href="/settings"
          className={`flex flex-col items-center justify-center px-4 py-1 rounded-xl transition-all ${
            pathname.startsWith("/settings")
              ? "bg-teal-50 text-teal-700"
              : "text-stone-400"
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">More</span>
        </Link>
      </nav>
    </div>
  );
}
