"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminAction } from "@/lib/auth/guard";
import { db } from "@/lib/db";
import { enquiryStatusSchema } from "@/lib/validation";
import type { ActionState } from "./actions";

/**
 * Lead status mutations (enquiries / contact messages / vendor
 * requests). Read-only otherwise — leads are never edited or
 * exposed publicly.
 */

const idSchema = z.string().cuid();
const leadKindSchema = z.enum(["enquiry", "contact", "vendor"]);

const LEAD_PATHS: Record<z.infer<typeof leadKindSchema>, string> = {
  enquiry: "/admin/enquiries",
  contact: "/admin/enquiries",
  vendor: "/admin/vendor-requests",
};

export async function updateLeadStatusAction(
  kind: string,
  id: string,
  status: string,
): Promise<ActionState> {
  await requireAdminAction("EDITOR");

  const parsedKind = leadKindSchema.safeParse(kind);
  const parsedId = idSchema.safeParse(id);
  const parsedStatus = enquiryStatusSchema.safeParse(status);
  if (!parsedKind.success || !parsedId.success || !parsedStatus.success) {
    return { error: "Invalid request." };
  }

  try {
    if (parsedKind.data === "enquiry") {
      await db.productEnquiry.update({
        where: { id: parsedId.data },
        data: { status: parsedStatus.data },
      });
    } else if (parsedKind.data === "contact") {
      await db.contactMessage.update({
        where: { id: parsedId.data },
        data: { status: parsedStatus.data },
      });
    } else {
      await db.vendorRequest.update({
        where: { id: parsedId.data },
        data: { status: parsedStatus.data },
      });
    }
  } catch {
    return { error: "Could not update status." };
  }

  revalidatePath(LEAD_PATHS[parsedKind.data]);
  return { success: true };
}
