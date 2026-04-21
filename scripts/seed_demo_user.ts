"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Demo user credentials
 */
const DEMO_EMAIL = "demo_user@example.com";
const DEMO_PASSWORD = "DemoPass123!";

/**
 * Run this script with `node scripts/seed_demo_user.js` (or ts-node) after setting up your Supabase env vars.
 * It will:
 *   1. Sign up the demo user (or retrieve if exists).
 *   2. Insert a profile record.
 *   3. Insert sample medications, dose logs, health logs, and notifications.
 */
async function seedDemoUser() {
  const supabase = createClient();

  // Sign up / sign in the demo user
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
    options: { emailRedirectTo: "http://localhost:3000" },
  });

  let userId: string | undefined;
  if (signUpError && signUpError.message.includes("User already registered")) {
    // User exists, sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    });
    if (signInError) {
      console.error("Failed to sign in demo user:", signInError.message);
      return;
    }
    userId = signInData.user?.id;
  } else if (signUpError) {
    console.error("Failed to sign up demo user:", signUpError.message);
    return;
  } else {
    userId = signUpData.user?.id;
  }

  if (!userId) {
    console.error("Could not determine demo user ID.");
    return;
  }

  // Upsert profile
  await supabase.from("profiles").upsert({
    id: userId,
    display_name: "Demo User",
    updated_at: new Date().toISOString(),
  });

  // Sample medications
  const meds = [
    { name: "Aspirin", dosage: "100 mg", stock: 30, is_active: true },
    { name: "Metformin", dosage: "500 mg", stock: 15, is_active: true },
  ];
  const { data: medData, error: medError } = await supabase.from("medications").upsert(
    meds.map((m) => ({ ...m, user_id: userId })),
    { onConflict: "id" }
  );
  if (medError) console.error("Med insert error:", medError.message);

  // Sample dose logs for next 3 days
  const now = new Date();
  const doseLogs = [];
  for (let i = 0; i < 3; i++) {
    const day = new Date(now);
    day.setDate(now.getDate() + i);
    const scheduled = new Date(day);
    scheduled.setHours(9, 0, 0, 0);
    doseLogs.push({
      medication_id: medData?.[0]?.id,
      scheduled_time: scheduled.toISOString(),
      status: "pending",
      user_id: userId,
    });
  }
  const { error: doseError } = await supabase.from("dose_logs").upsert(doseLogs);
  if (doseError) console.error("Dose log error:", doseError.message);

  // Sample health logs
  const healthLogs = [
    { type: "sleep", value: "7", recorded_at: now.toISOString(), user_id: userId },
    { type: "steps", value: "8000", recorded_at: now.toISOString(), user_id: userId },
    { type: "heart_rate", value: "72", recorded_at: now.toISOString(), user_id: userId },
  ];
  const { error: healthError } = await supabase.from("health_logs").upsert(healthLogs);
  if (healthError) console.error("Health log error:", healthError.message);

  // Sample notifications
  const notifications = [
    { title: "Welcome!", message: "Your demo account is ready.", user_id: userId },
    { title: "Reminder", message: "Take your Aspirin at 9 AM.", user_id: userId },
  ];
  const { error: notifError } = await supabase.from("notifications").upsert(notifications);
  if (notifError) console.error("Notification error:", notifError.message);

  console.log("Demo user seeded successfully!");
  console.log(`Email: ${DEMO_EMAIL}`);
  console.log(`Password: ${DEMO_PASSWORD}`);
}

seedDemoUser();
