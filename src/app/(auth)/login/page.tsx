"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, MonitorHeart } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FAFAF9] relative">
      {/* Background Blurs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-teal-200/20 blur-[120px] rounded-full" />
        <div className="absolute top-[60%] -right-[5%] w-[30%] h-[50%] bg-amber-200/20 blur-[120px] rounded-full" />
      </div>

      <main className="w-full max-w-[440px]">
        {/* Brand */}
        <div className="mb-10 text-center md:text-left md:pl-2">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-teal-700 rounded-xl flex items-center justify-center shadow-lg shadow-teal-700/20">
              <MonitorHeart className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tighter text-teal-700">
              HealthTrack
            </h1>
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
            Welcome back
          </h2>
          <p className="text-stone-500 mt-2 leading-relaxed">
            Enter your credentials to access your health dashboard.
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl p-8 shadow-[0_8px_40px_rgba(15,118,110,0.04)] border border-stone-100">
          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-stone-50 hover:bg-stone-100 transition-colors rounded-xl font-medium text-stone-700 border border-stone-200 mb-6"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative flex items-center mb-6">
            <div className="flex-grow border-t border-stone-200" />
            <span className="flex-shrink mx-4 text-xs font-semibold text-stone-400 tracking-widest">
              OR EMAIL
            </span>
            <div className="flex-grow border-t border-stone-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-semibold text-stone-600 ml-1">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-11 py-3 bg-stone-50 border-none rounded-xl focus:ring-2 focus:ring-teal-600/20 focus:bg-white h-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <Label htmlFor="password" className="text-sm font-semibold text-stone-600">
                  Password
                </Label>
                <Link
                  href="#"
                  className="text-xs font-bold text-teal-700 hover:underline underline-offset-4"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-11 pr-12 py-3 bg-stone-50 border-none rounded-xl focus:ring-2 focus:ring-teal-600/20 focus:bg-white h-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-700/10 hover:bg-teal-800 hover:shadow-teal-700/20 transition-all disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-stone-500">
            New to HealthTrack?{" "}
            <Link
              href="/register"
              className="font-bold text-teal-700 hover:underline underline-offset-4 ml-1"
            >
              Create account
            </Link>
          </p>
          <div className="mt-8 flex justify-center gap-6 text-xs font-medium text-stone-400">
            <Link href="#" className="hover:text-teal-700 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-teal-700 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
