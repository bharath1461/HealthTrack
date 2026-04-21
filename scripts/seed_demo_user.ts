/**
 * Demo User Seed Script
 * 
 * This is a STANDALONE script — do NOT run it as part of the Next.js app.
 * 
 * To use: sign up manually on the app with these credentials:
 *   Email:    demo_user@example.com
 *   Password: DemoPass123!
 *
 * Then add sample data via the app UI, or run this script with:
 *   npx tsx scripts/seed_demo_user.ts
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://rczzocdvttybkqutvezc.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const DEMO_EMAIL = "demo_user@example.com";
const DEMO_PASSWORD = "DemoPass123!";

async function seedDemoUser() {
  if (!SUPABASE_ANON_KEY) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Set it in .env.local or as an env var.");
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Sign up the demo user
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  });

  let userId: string | undefined;
  if (signUpError && signUpError.message.includes("already registered")) {
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    });
    if (signInError) {
      console.error("Sign in failed:", signInError.message);
      return;
    }
    userId = signInData.user?.id;
  } else if (signUpError) {
    console.error("Sign up failed:", signUpError.message);
    return;
  } else {
    userId = signUpData.user?.id;
  }

  if (!userId) {
    console.error("Could not determine user ID.");
    return;
  }

  console.log("Demo user ID:", userId);

  // Profile
  await supabase.from("profiles").upsert({ id: userId, display_name: "Demo User", updated_at: new Date().toISOString() });

  // Medications
  const meds = [
    { user_id: userId, name: "Aspirin", dosage: "100 mg", schedule: "Morning", stock: 30, is_active: true },
    { user_id: userId, name: "Metformin", dosage: "500 mg", schedule: "After lunch", stock: 15, is_active: true },
    { user_id: userId, name: "Vitamin D", dosage: "1000 IU", schedule: "Morning", stock: 60, is_active: true },
  ];
  const { data: medData, error: medErr } = await supabase.from("medications").insert(meds).select();
  if (medErr) console.error("Meds error:", medErr.message);
  else console.log("Inserted", medData.length, "medications");

  // Dose logs for today
  if (medData) {
    const now = new Date();
    const doses = medData.map((m: any) => ({
      user_id: userId,
      medication_id: m.id,
      scheduled_time: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0).toISOString(),
      status: "pending",
    }));
    const { error: doseErr } = await supabase.from("dose_logs").insert(doses);
    if (doseErr) console.error("Dose logs error:", doseErr.message);
    else console.log("Inserted", doses.length, "dose logs");
  }

  // Health logs
  const now = new Date();
  const healthLogs = [
    { user_id: userId, type: "sleep", value: 7, recorded_at: now.toISOString() },
    { user_id: userId, type: "steps", value: 8500, recorded_at: now.toISOString() },
    { user_id: userId, type: "heart_rate", value: 72, recorded_at: now.toISOString() },
    { user_id: userId, type: "weight", value: 70, recorded_at: now.toISOString() },
  ];
  const { error: hlErr } = await supabase.from("health_logs").insert(healthLogs);
  if (hlErr) console.error("Health logs error:", hlErr.message);
  else console.log("Inserted", healthLogs.length, "health logs");

  console.log("\n✅ Demo user seeded!");
  console.log(`   Email:    ${DEMO_EMAIL}`);
  console.log(`   Password: ${DEMO_PASSWORD}`);
}

seedDemoUser();
