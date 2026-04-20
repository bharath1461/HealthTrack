import Link from "next/link";
import {
  Pill,
  HeartPulse,
  FileText,
  ArrowRight,
  Shield,
  Bell,
  TrendingUp,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF9]">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-stone-200/30 shadow-[0_8px_24px_rgba(15,118,110,0.06)]">
        <div className="flex justify-between items-center px-6 h-16 w-full max-w-screen-2xl mx-auto">
          <div className="text-xl font-semibold tracking-tighter text-teal-700">
            HealthTrack
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-stone-500 hover:text-teal-700 transition-colors text-sm font-medium"
            >
              Features
            </Link>
            <Link
              href="#about"
              className="text-stone-500 hover:text-teal-700 transition-colors text-sm font-medium"
            >
              About
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <Link
              href="/login"
              className="text-sm font-medium text-stone-600 hover:text-teal-700 transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold bg-teal-700 text-white px-5 py-2.5 rounded-lg hover:bg-teal-800 transition-all active:scale-95 shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-16">
          <div className="max-w-screen-2xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center">
            <div className="z-10 py-12 md:py-24">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-teal-50 text-teal-700 font-medium text-xs tracking-wider mb-6 border border-teal-100">
                YOUR HEALTH COMPANION
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tighter text-stone-900 leading-[0.95] mb-8">
                Track less.
                <br />
                <span className="text-teal-700 italic">Act more.</span>
              </h1>
              <p className="text-lg md:text-xl text-stone-500 max-w-lg leading-relaxed mb-10">
                Manage medications and monitor your health with ease. Get smart
                reminders, actionable insights, and shareable reports — all in
                one place.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-teal-700 text-white font-semibold rounded-lg shadow-lg shadow-teal-700/20 hover:shadow-teal-700/30 hover:bg-teal-800 transition-all transform hover:-translate-y-0.5 active:scale-95"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="#features"
                  className="inline-flex items-center px-8 py-4 bg-stone-100 text-stone-700 font-semibold rounded-lg hover:bg-stone-200 transition-all active:scale-95"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative hidden lg:block h-[500px]">
              <div className="absolute inset-0 bg-stone-100 rounded-[40px] transform rotate-3 scale-95 overflow-hidden" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm">
                {/* Floating Data Card */}
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-stone-100 transform -rotate-3">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-700">
                        <Pill className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-stone-900">
                          Lisinopril
                        </p>
                        <p className="text-xs text-stone-500">10mg • Daily</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-teal-700">
                      9:00 AM
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-600 w-3/4 rounded-full" />
                  </div>
                  <p className="text-[10px] text-stone-400 mt-2 text-right">
                    75% adherence this week
                  </p>
                </div>

                {/* Second Floating Card */}
                <div className="bg-white p-4 rounded-xl shadow-lg border border-stone-100 transform rotate-2 mt-4 ml-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                      <HeartPulse className="w-4 h-4 text-red-500" />
                    </div>
                    <div>
                      <p className="text-xs text-stone-500">Heart Rate</p>
                      <p className="text-sm font-bold text-stone-900">
                        68 BPM
                      </p>
                    </div>
                    <span className="ml-auto text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      Stable
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Background Gradient */}
          <div className="absolute top-0 right-0 -z-10 w-1/3 h-full bg-gradient-to-l from-teal-50/50 to-transparent" />
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-stone-50/80">
          <div className="max-w-screen-2xl mx-auto px-6">
            <div className="max-w-xl mb-16">
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-stone-900 mb-6">
                Designed for clarity.
              </h2>
              <p className="text-stone-500 leading-relaxed text-lg">
                We&apos;ve removed the clutter to focus on what matters most:
                your recovery and long-term vitality.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Medication Tracking */}
              <div className="md:col-span-2 group relative overflow-hidden bg-white p-10 rounded-2xl hover:shadow-xl transition-all duration-500">
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-700 mb-8 group-hover:scale-110 transition-transform">
                    <Pill className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-stone-900 mb-4">
                    Medication Tracking
                  </h3>
                  <p className="text-stone-500 max-w-sm mb-8 leading-relaxed">
                    Never miss a dose again. Smart reminders adapt to your
                    schedule, track stock levels, and alert you when it&apos;s
                    time to refill.
                  </p>
                </div>
              </div>

              {/* Health Logs */}
              <div className="group bg-white p-10 rounded-2xl hover:shadow-xl transition-all duration-500">
                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 mb-8 group-hover:scale-110 transition-transform">
                  <HeartPulse className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-stone-900 mb-4">
                  Health Logs
                </h3>
                <p className="text-stone-500 leading-relaxed mb-6">
                  Record vitals with a single tap. Monitor blood pressure,
                  heart rate, sleep, and step trends.
                </p>
                <div className="pt-4 border-t border-stone-100">
                  <div className="flex items-center justify-between text-sm text-teal-700 font-bold">
                    <span>Weekly Insights</span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Available
                    </span>
                  </div>
                </div>
              </div>

              {/* Actionable Insights — Wide Card */}
              <div className="md:col-span-3 group relative overflow-hidden bg-teal-700 text-white p-12 rounded-2xl transition-all duration-500">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-8">
                      <FileText className="w-7 h-7" />
                    </div>
                    <h3 className="text-3xl font-bold mb-6 tracking-tight">
                      Shareable Reports
                    </h3>
                    <p className="text-white/80 text-lg leading-relaxed mb-8">
                      Generate clinical-grade health summaries. Share secure
                      reports with your doctor instantly via link or PDF.
                    </p>
                    <Link
                      href="/register"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-700 font-bold rounded-lg transition-transform active:scale-95"
                    >
                      Start tracking now
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="relative h-64 md:h-full flex items-center justify-center">
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 w-full max-w-sm border border-white/10 transform rotate-2">
                      <div className="space-y-4">
                        <div className="h-2 bg-white/20 rounded w-3/4" />
                        <div className="h-2 bg-white/20 rounded w-1/2" />
                        <div className="h-2 bg-white/20 rounded w-5/6" />
                        <div className="h-2 bg-white/20 rounded w-2/3" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Security Section */}
        <section id="about" className="py-24 px-6">
          <div className="max-w-screen-xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-24">
              <div className="text-center p-8">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-700 mx-auto mb-6">
                  <Shield className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-stone-900 mb-2 text-lg">
                  Secure & Private
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed">
                  Your health data is encrypted and stored securely. Only you
                  control who sees your information.
                </p>
              </div>
              <div className="text-center p-8">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-700 mx-auto mb-6">
                  <Bell className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-stone-900 mb-2 text-lg">
                  Smart Reminders
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed">
                  Timely browser notifications so you never miss a dose. Set
                  custom schedules for each medication.
                </p>
              </div>
              <div className="text-center p-8">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-700 mx-auto mb-6">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-stone-900 mb-2 text-lg">
                  Actionable Insights
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed">
                  Get alerts about missed doses, low stock, and health trends.
                  Know when to refill or consult.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-stone-100 p-12 md:p-24 rounded-[48px] text-center">
              <h2 className="text-4xl md:text-6xl font-semibold tracking-tighter mb-8 text-stone-900">
                Ready to feel better?
              </h2>
              <p className="text-stone-500 text-lg mb-12 max-w-xl mx-auto">
                Join patients who have regained control over their daily health
                routines. Start your journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-8 py-4 bg-stone-900 text-white font-bold rounded-xl hover:opacity-90 transition-all active:scale-95"
                >
                  Start for Free
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#FAFAF9] py-12 px-6 border-t border-stone-200/50">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="text-xl font-bold tracking-tighter text-teal-700">
              HealthTrack
            </div>
            <p className="text-sm text-stone-400">
              © 2024 HealthTrack. Your health, your data.
            </p>
          </div>
          <nav className="flex gap-8 text-sm font-medium text-stone-400">
            <Link
              href="#"
              className="hover:text-teal-700 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="hover:text-teal-700 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="hover:text-teal-700 transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
