import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/** /admin → login or dashboard. */
export default async function AdminIndexPage() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  redirect("/admin/dashboard");
}
