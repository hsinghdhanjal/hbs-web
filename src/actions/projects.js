"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import {
  createProject,
  deleteProject,
  moveProject,
  updateProject,
  uploadProjectImage,
} from "@/lib/projects";

function revalidateAll() {
  revalidatePath("/", "layout");
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
}

export async function createProjectAction(input) {
  try {
    await requireAuth();
    if (!input.name?.trim()) {
      return { ok: false, error: "Project name is required." };
    }
    const data = await createProject(input);
    revalidateAll();
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to create project." };
  }
}

export async function updateProjectAction(id, patch) {
  try {
    await requireAuth();
    if (patch.name !== undefined && !patch.name.trim()) {
      return { ok: false, error: "Project name is required." };
    }
    const data = await updateProject(id, patch);
    revalidateAll();
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to update project." };
  }
}

export async function deleteProjectAction(id) {
  try {
    await requireAuth();
    await deleteProject(id);
    revalidateAll();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to delete project." };
  }
}

export async function moveProjectAction(id, direction) {
  try {
    await requireAuth();
    await moveProject(id, direction);
    revalidateAll();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to reorder project." };
  }
}

export async function uploadProjectImageAction(formData) {
  try {
    await requireAuth();
    const id = String(formData.get("project_id") || "").trim();
    const file = formData.get("file");
    if (!id) return { ok: false, error: "Missing project id." };
    if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Please select a file." };
    if (file.size > 10 * 1024 * 1024) return { ok: false, error: "File too large — 10 MB max." };
    if (!file.type.startsWith("image/")) return { ok: false, error: "Only image files are allowed." };

    const data = await uploadProjectImage({ id, file });
    revalidateAll();
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Upload failed." };
  }
}
