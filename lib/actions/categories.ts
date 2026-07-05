"use server";

import { revalidatePath } from "next/cache";
import { fetchApi } from "@/lib/api";

export async function createCategory(formData: FormData) {
  try {
    const response = await fetchApi("/categories", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData.message || "Failed to create category" };
    }

    revalidatePath("/dashboard/categories");
    return { success: true };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function updateCategory(id: string | number, formData: FormData) {
  try {
    // Append _method=PATCH to the FormData to satisfy backend requirement for updates
    formData.append("_method", "PATCH");
    
    const response = await fetchApi(`/categories/${id}/`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData.message || "Failed to update category" };
    }

    revalidatePath("/dashboard/categories");
    return { success: true };
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function deleteCategory(id: string | number) {
  try {
    const response = await fetchApi(`/categories/${id}/`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return { success: false, error: "Failed to delete category" };
    }

    revalidatePath("/dashboard/categories");
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
