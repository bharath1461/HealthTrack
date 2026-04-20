import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName = user?.user_metadata?.name || user?.email?.split("@")[0] || "there";

  return (
    <div>
      {/* Hero Header */}
      <header className="mb-12 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-stone-900 mb-2">
          Good morning, {displayName}.
        </h1>
        <p className="text-lg text-stone-500 leading-relaxed">
          Your restorative journey is on track. Welcome to your health dashboard.
        </p>
      </header>

      {/* Placeholder Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-8 text-center border border-stone-100">
          <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-4">
            <span className="text-teal-700 text-xl">💊</span>
          </div>
          <h3 className="font-bold text-stone-900 mb-1">Medications</h3>
          <p className="text-sm text-stone-500">Coming in Phase 2</p>
        </div>
        <div className="bg-white rounded-xl p-8 text-center border border-stone-100">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-xl">❤️</span>
          </div>
          <h3 className="font-bold text-stone-900 mb-1">Health Logs</h3>
          <p className="text-sm text-stone-500">Coming in Phase 2</p>
        </div>
        <div className="bg-white rounded-xl p-8 text-center border border-stone-100">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
            <span className="text-amber-600 text-xl">📊</span>
          </div>
          <h3 className="font-bold text-stone-900 mb-1">Reports</h3>
          <p className="text-sm text-stone-500">Coming in Phase 4</p>
        </div>
      </div>
    </div>
  );
}
