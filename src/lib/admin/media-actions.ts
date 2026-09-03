"use server";

import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/auth/guard";
import { isUploadFile, saveUploadedFile } from "@/lib/admin/upload-file";
import type { ActionState } from "./actions";

export async function uploadMediaAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdminAction("EDITOR");

  const file = formData.get("file");
  if (!isUploadFile(file)) {
    return { error: "Choose a file to upload." };
  }

  const altText = String(formData.get("altText") ?? "");

  try {
    const saved = await saveUploadedFile(file, altText);
    revalidatePath("/admin/media");
    return { success: true, mediaId: saved.id, publicUrl: saved.publicUrl ?? undefined };
  } catch (error) {
    console.error("[media] upload failed:", error instanceof Error ? error.message : error);
    return {
      error: error instanceof Error ? error.message : "Upload failed. Try another file.",
    };
  }
}
