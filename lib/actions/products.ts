"use server";

import { revalidatePath } from "next/cache";
import { fetchApi } from "@/lib/api";

export async function createProduct(formData: FormData) {
  try {
    // Reconstruct FormData to avoid Next.js serialization bugs with multiple files
    const cleanFormData = new FormData();
    for (const [key, value] of formData.entries()) {
      cleanFormData.append(key, value);
    }

    const response = await fetchApi("/products", {
      method: "POST",
      body: cleanFormData,
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
    // Reconstruct FormData to avoid Next.js serialization bugs with multiple files
    const cleanFormData = new FormData();
    for (const [key, value] of formData.entries()) {
      cleanFormData.append(key, value);
    }

    // Append _method=PATCH to the FormData to satisfy backend requirement for updates
    cleanFormData.append("_method", "PATCH");

    const response = await fetchApi(`/products/${id}`, {
      method: "POST",
      body: cleanFormData,
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

export async function importProducts(formData: FormData) {
  try {
    // Reconstruct FormData to avoid Next.js serialization bugs with files
    const cleanFormData = new FormData();
    for (const [key, value] of formData.entries()) {
      cleanFormData.append(key, value);
    }

    const response = await fetchApi(`/products/import`, {
      method: "POST",
      body: cleanFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend import error response:", errorText);
      try {
        const errorData = JSON.parse(errorText);
        return { 
          success: false, 
          error: errorData.error || errorData.message || `Failed to import: ${response.statusText} (Status: ${response.status})` 
        };
      } catch (e) {
        return { 
          success: false, 
          error: `Failed to import: (${response.status}) - ${errorText.substring(0, 150)}` 
        };
      }
    }

    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error) {
    console.error("Error importing products:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function searchProducts(searchQuery: string = "") {
  try {
    const params = new URLSearchParams();
    if (searchQuery && searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }
    params.set("limit", "50");
    params.set("per_page", "50");

    const response = await fetchApi(`/products?${params.toString()}`, {
      method: "GET",
    });

    if (!response.ok) {
      console.error("Failed to search products from API, status:", response.status);
      return { success: false, data: [] };
    }

    const json = await response.json();
    return {
      success: true,
      data: Array.isArray(json) ? json : (json.data || []),
    };
  } catch (error) {
    console.error("Error searching products from API:", error);
    return { success: false, data: [] };
  }
}

