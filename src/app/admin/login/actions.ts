"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type LoginActionState = {
  success: boolean;
  error?: string;
};

export async function loginAdmin(
  _prevState: LoginActionState | null,
  formData: FormData
): Promise<LoginActionState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const turnstileToken = String(formData.get("turnstileToken") || "");

  const genericError = "Invalid email or password";

  // 1. Verify Turnstile token
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (!turnstileToken || !turnstileSecret) {
    console.error("turnstile failed");
    return { success: false, error: genericError };
  }

  try {
    const verifyFormData = new URLSearchParams();
    verifyFormData.append("secret", turnstileSecret);
    verifyFormData.append("response", turnstileToken);

    const turnstileRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: verifyFormData.toString(),
        signal: AbortSignal.timeout(6000),
      }
    );

    if (!turnstileRes.ok) {
      console.error("turnstile failed");
      return { success: false, error: genericError };
    }

    const turnstileData = (await turnstileRes.json()) as { success?: boolean };
    if (!turnstileData.success) {
      console.error("turnstile failed");
      return { success: false, error: genericError };
    }
  } catch {
    console.error("turnstile failed");
    return { success: false, error: genericError };
  }

  if (!email || !password) {
    return { success: false, error: genericError };
  }

  // 2. Sign in with Supabase
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return { success: false, error: genericError };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { success: false, error: genericError };
  }

  // 3. Guard: Verify ADMIN_USER_ID env
  const adminUserId = process.env.ADMIN_USER_ID;
  if (!adminUserId || data.user.id !== adminUserId) {
    // If not the authorized admin, sign out immediately
    await supabase.auth.signOut();
    return { success: false, error: genericError };
  }

  redirect("/admin");
}

