"use server";

import { revalidatePath } from "next/cache";
import { fetchApi } from "@/lib/api";

export async function createPrivacyPolicy(data: {
  title_en: string;
  title_ar: string;
  content_en: string;
  content_ar: string;
  sort_order: number;
  is_active: boolean;
}) {
  try {
    const response = await fetchApi("/privacy-policies", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData.message || "Failed to create Privacy Policy section" };
    }

    revalidatePath("/dashboard/content-management/privacy-policies");
    return { success: true };
  } catch (error) {
    console.error("Error creating Privacy Policy:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function updatePrivacyPolicy(
  id: string | number,
  data: {
    title_en: string;
    title_ar: string;
    content_en: string;
    content_ar: string;
    sort_order: number;
    is_active: boolean;
  }
) {
  try {
    const response = await fetchApi(`/privacy-policies/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData.message || "Failed to update Privacy Policy section" };
    }

    revalidatePath("/dashboard/content-management/privacy-policies");
    return { success: true };
  } catch (error) {
    console.error("Error updating Privacy Policy:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function deletePrivacyPolicy(id: string | number) {
  try {
    const response = await fetchApi(`/privacy-policies/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return { success: false, error: "Failed to delete Privacy Policy section" };
    }

    revalidatePath("/dashboard/content-management/privacy-policies");
    return { success: true };
  } catch (error) {
    console.error("Error deleting Privacy Policy:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
