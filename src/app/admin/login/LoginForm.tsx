"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { loginAction, type LoginState } from "@/lib/auth/actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, {} as LoginState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} noValidate className="mt-6 flex flex-col gap-4">
      {state.error ? (
        <p
          role="alert"
          className="border border-error/40 bg-error/10 px-3 py-2 text-body-sm text-[#f2b8b5]"
        >
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="login-email" className="text-mono-meta text-mist">
          Email
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="h-12 w-full rounded-xs border border-line-dark bg-ink px-3 text-[16px] text-paper focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-paper"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="login-password" className="text-mono-meta text-mist">
          Password
        </label>
        <div className="relative">
          <input
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className="h-12 w-full rounded-xs border border-line-dark bg-ink px-3 pr-12 text-[16px] text-paper focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-paper"
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute top-1/2 right-1 flex size-10 -translate-y-1/2 items-center justify-center text-mist hover:text-paper"
          >
            {showPassword ? (
              <EyeOff size={18} strokeWidth={1.5} aria-hidden />
            ) : (
              <Eye size={18} strokeWidth={1.5} aria-hidden />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 h-12 rounded-xs bg-accent text-label text-paper-raised transition-colors duration-(--duration-fast) hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
