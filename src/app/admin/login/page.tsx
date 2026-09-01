import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { LoginExperience } from "./LoginExperience";

export const metadata = { title: "Log in" };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const user = await getSessionUser();
  if (user) {
    redirect("/admin/dashboard");
  }

  return <LoginExperience />;
}
