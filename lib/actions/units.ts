"use server";

import { revalidatePath } from "next/cache";
import { fetchApi } from "@/lib/api";

export async function createUnit(formData: FormData) {
  try {
    const response = await fetchApi("/units", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData.message || "Failed to create unit" };
    }

    revalidatePath("/dashboard/units");
    return { success: true };
  } catch (error) {
    console.error("Error creating unit:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function updateUnit(id: string | number, formData: FormData) {
  try {
    // Append _method=PATCH to the FormData to satisfy backend requirement for updates
    formData.append("_method", "PATCH");
    
    const response = await fetchApi(`/units/${id}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData.message || "Failed to update unit" };
    }

    revalidatePath("/dashboard/units");
    return { success: true };
  } catch (error) {
    console.error("Error updating unit:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function deleteUnit(id: string | number) {
  try {
    const response = await fetchApi(`/units/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return { success: false, error: "Failed to delete unit" };
    }

    revalidatePath("/dashboard/units");
    return { success: true };
  } catch (error) {
    console.error("Error deleting unit:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
