"use client";

import { useState, useActionState } from "react";
import { loginAdmin, type LoginActionState } from "./actions";
import { TurnstileWidget } from "@/components/TurnstileWidget";

export function LoginForm() {
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [state, formAction, isPending] = useActionState<LoginActionState | null, FormData>(
    loginAdmin,
    null
  );

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium text-center">
          {state.error}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-[#0F2A4A] mb-1.5"
        >
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="admin@example.com"
          className="w-full min-h-[48px] rounded-[10px] border-2 border-[#5F7FAE] bg-white px-3 py-2 text-base text-[#0F2A4A] transition-colors focus:border-[#2F6FD0] focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-semibold text-[#0F2A4A] mb-1.5"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className="w-full min-h-[48px] rounded-[10px] border-2 border-[#5F7FAE] bg-white px-3 py-2 text-base text-[#0F2A4A] transition-colors focus:border-[#2F6FD0] focus:outline-none"
        />
      </div>

      <input
        type="hidden"
        name="turnstileToken"
        value={turnstileToken || ""}
      />

      <TurnstileWidget onTokenChange={setTurnstileToken} />

      <button
        type="submit"
        disabled={isPending || !turnstileToken}
        className="w-full min-h-[48px] mt-2 inline-flex items-center justify-center rounded-full font-semibold text-base border-2 border-[#2F6FD0] bg-[#2F6FD0] text-white hover:bg-[#255bb0] hover:border-[#255bb0] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

