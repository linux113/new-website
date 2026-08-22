import Image from "next/image";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Log in" };

export default async function AdminLoginPage() {
  // Already authenticated → straight to the dashboard.
  const user = await getSessionUser();
  if (user) redirect("/admin/dashboard");

  return (
    <main
      data-surface="dark"
      className="flex min-h-dvh items-center justify-center bg-ink px-4"
    >
      <div className="w-full max-w-95">
        <div className="flex items-center gap-3">
          <Image src="/brand/logo-mark.png" alt="" width={36} height={36} className="size-9" />
          <p className="text-heading-sm font-display font-semibold tracking-tight text-paper">
            SRIYAAN <span className="text-mist">/ ADMIN</span>
          </p>
        </div>
        <div className="mt-6 border border-line-dark bg-ink-soft p-6 sm:p-8">
          <h1 className="text-display-md text-paper">Log in</h1>
          <p className="mt-2 text-body-sm text-mist">
            Administrator access only. All activity is logged.
          </p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
