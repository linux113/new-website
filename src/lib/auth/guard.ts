import "server-only";
import { redirect } from "next/navigation";
import type { AdminRole } from "@/generated/prisma/enums";
import { getSessionUser, type SessionUser } from "./session";

/**
 * Server-side authorization guards.
 * Every admin page and every mutation calls one of these — there is
 * no client-side-only protection anywhere.
 */

const ROLE_RANK: Record<AdminRole, number> = {
  EDITOR: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3,
};

/** Page guard: redirects to /admin/login when unauthenticated. */
export async function requireAdminPage(minRole: AdminRole = "EDITOR"): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  if (ROLE_RANK[user.role] < ROLE_RANK[minRole]) redirect("/admin/dashboard");
  return user;
}

/** Mutation guard: throws (never redirects) — for server actions. */
export async function requireAdminAction(minRole: AdminRole = "EDITOR"): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  if (ROLE_RANK[user.role] < ROLE_RANK[minRole]) throw new Error("FORBIDDEN");
  return user;
}
