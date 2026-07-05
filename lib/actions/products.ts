"use server";

import { revalidatePath } from "next/cache";
import { fetchApi } from "@/lib/api";

export async function createProduct(formData: FormData) {
  try {
    const response = await fetchApi("/products", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData.message || "Failed to create product", validationErrors: errorData.errors };
    }

    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function updateProduct(id: string | number, formData: FormData) {
  try {
    // Append _method=PATCH to the FormData to satisfy backend requirement for updates
    formData.append("_method", "PATCH");
    
    const response = await fetchApi(`/products/${id}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData.message || "Failed to update product", validationErrors: errorData.errors };
    }

    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function deleteProduct(id: string | number) {
  try {
    const response = await fetchApi(`/products/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return { success: false, error: "Failed to delete product" };
    }

    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
