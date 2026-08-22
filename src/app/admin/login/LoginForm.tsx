"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { loginAction, type LoginState } from "@/lib/auth/actions";

/**
 * Premium login form.
 * - Animated focus borders + soft glow on inputs
 * - Show/hide password with icon cross-fade
 * - Remember me (30-day session) + forgot-password mailto
 * - Magnetic CTA (fine pointers only) with glow intensify on hover
 * - Submitting: label swaps to an animated progress ring
 * - Error: card-level shake, message announced via role=alert
 * All motion disabled under prefers-reduced-motion.
 */
export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, {} as LoginState);
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Error shake — only when a new validation failure arrives.
  useEffect(() => {
    if (!state.error) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setShake(true);
    const timer = setTimeout(() => setShake(false), 500);
    return () => clearTimeout(timer);
  }, [state]);

  // Magnetic CTA (desktop pointers, reduced-motion off).
  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const strength = 10;
    const onMove = (e: PointerEvent) => {
      const rect = button.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      const dist = Math.hypot(dx, dy);
      const range = 110;
      if (dist < range) {
        const pull = (1 - dist / range) * strength;
        button.style.transform = `translate(${(dx / dist) * pull || 0}px, ${(dy / dist) * pull || 0}px)`;
      } else {
        button.style.transform = "";
      }
    };
    const reset = () => (button.style.transform = "");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", reset);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", reset);
    };
  }, []);

  return (
    <form
      action={formAction}
      noValidate
      className={`mt-7 flex flex-col gap-5 ${shake ? "login-shake" : ""}`}
    >
      {state.error ? (
        <p
          role="alert"
          className="rounded-lg border border-[#5c2622] bg-[#2a1513] px-3.5 py-2.5 text-[0.82rem] text-[#f2b8b5]"
        >
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-col gap-2">
        <label htmlFor="login-email" className="font-mono text-[0.66rem] tracking-[0.16em] text-[#A7A9A6]">
          EMAIL
        </label>
        <div className="login-field relative rounded-xl">
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="username"
            required
            placeholder="you@company.com"
            className="peer h-12.5 w-full rounded-xl border border-[#2A2E30] bg-[#0B0D0E]/80 px-4 text-[16px] text-[#F1F0EC] placeholder:text-[#4a4f4e] outline-none transition-all duration-300 focus:border-[#B89A62]/70 focus:shadow-[0_0_0_3px_rgba(184,154,98,0.12),0_0_24px_rgba(184,154,98,0.10)]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="login-password" className="font-mono text-[0.66rem] tracking-[0.16em] text-[#A7A9A6]">
          PASSWORD
        </label>
        <div className="login-field relative rounded-xl">
          <input
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="••••••••••••"
            className="peer h-12.5 w-full rounded-xl border border-[#2A2E30] bg-[#0B0D0E]/80 px-4 pr-12 text-[16px] text-[#F1F0EC] placeholder:text-[#4a4f4e] outline-none transition-all duration-300 focus:border-[#B89A62]/70 focus:shadow-[0_0_0_3px_rgba(184,154,98,0.12),0_0_24px_rgba(184,154,98,0.10)]"
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute top-1/2 right-1.5 flex size-10 -translate-y-1/2 items-center justify-center rounded-lg text-[#686D6C] transition-colors duration-200 hover:text-[#F1F0EC] focus-visible:outline-2 focus-visible:outline-[#B89A62]"
          >
            <span className="relative block size-4.5">
              <Eye
                size={18}
                strokeWidth={1.5}
                aria-hidden
                className={`absolute inset-0 transition-all duration-300 ${showPassword ? "scale-75 opacity-0" : "scale-100 opacity-100"}`}
              />
              <EyeOff
                size={18}
                strokeWidth={1.5}
                aria-hidden
                className={`absolute inset-0 transition-all duration-300 ${showPassword ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}
              />
            </span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2.5 text-[0.82rem] text-[#A7A9A6]">
          <input
            type="checkbox"
            name="remember"
            className="size-4 cursor-pointer appearance-none rounded border border-[#2A2E30] bg-[#0B0D0E] transition-all duration-200 checked:border-[#B89A62] checked:bg-[#B89A62] checked:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20d%3D%22M4%208.5%206.5%2011%2012%205%22%20stroke%3D%22%230B0D0E%22%20stroke-width%3D%222%22%20fill%3D%22none%22/%3E%3C/svg%3E')] bg-center bg-no-repeat focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B89A62]"
          />
          Remember me
        </label>
        <a
          href="mailto:info@sriyaanmetals.co?subject=Admin%20password%20reset%20request"
          className="text-[0.82rem] text-[#A7A9A6] underline-offset-4 transition-colors duration-200 hover:text-[#B89A62] hover:underline"
        >
          Forgot password?
        </a>
      </div>

      <button
        ref={buttonRef}
        type="submit"
        disabled={pending}
        className="login-cta group relative mt-1 h-13 overflow-hidden rounded-xl bg-[#B89A62] text-[0.8rem] font-semibold tracking-[0.14em] text-[#0B0D0E] uppercase transition-[box-shadow,background-color,transform] duration-300 hover:bg-[#c9ac72] hover:shadow-[0_0_36px_rgba(184,154,98,0.35)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#B89A62] disabled:cursor-not-allowed disabled:opacity-70 motion-reduce:transition-none"
      >
        {pending ? (
          <span className="flex items-center justify-center gap-2.5">
            <svg className="login-ring size-4.5" viewBox="0 0 20 20" fill="none" aria-hidden>
              <circle cx="10" cy="10" r="8" stroke="rgba(11,13,14,0.25)" strokeWidth="2.5" />
              <circle cx="10" cy="10" r="8" stroke="#0B0D0E" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="38" strokeDashoffset="28" />
            </svg>
            Authenticating…
          </span>
        ) : (
          <span>Sign in</span>
        )}
      </button>
    </form>
  );
}
