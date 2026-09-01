import { redirect } from "next/navigation";
import { requireAdminPage } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

/** /admin → login or dashboard. */
export default async function AdminIndexPage() {
  await requireAdminPage("EDITOR");
  redirect("/admin/dashboard");
}
