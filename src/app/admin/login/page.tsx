import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { LoginExperience } from "./LoginExperience";

export const metadata = { title: "Log in" };

/**
 * Admin login — premium split-screen experience.
 * Left: animated industrial brand panel (desktop). Right: glass
 * login card. All motion is CSS/rAF, reduced-motion aware.
 */
export default async function AdminLoginPage() {
  const user = await getSessionUser();
  if (user) redirect("/admin/dashboard");

  return <LoginExperience />;
}
