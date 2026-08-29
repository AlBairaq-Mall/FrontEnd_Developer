"use server";

import { revalidatePath } from "next/cache";
import { fetchApi } from "@/lib/api";

export async function createFAQ(data: {
  question_en: string;
  question_ar: string;
  answer_en: string;
  answer_ar: string;
  is_active: boolean;
}) {
  try {
    const response = await fetchApi("/faqs", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData.message || "Failed to create FAQ" };
    }

    revalidatePath("/dashboard/content-management/faqs");
    return { success: true };
  } catch (error) {
    console.error("Error creating FAQ:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function updateFAQ(
  id: string | number,
  data: {
    question_en: string;
    question_ar: string;
    answer_en: string;
    answer_ar: string;
    is_active: boolean;
  }
) {
  try {
    const response = await fetchApi(`/faqs/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData.message || "Failed to update FAQ" };
    }

    revalidatePath("/dashboard/content-management/faqs");
    return { success: true };
  } catch (error) {
    console.error("Error updating FAQ:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function deleteFAQ(id: string | number) {
  try {
    const response = await fetchApi(`/faqs/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return { success: false, error: "Failed to delete FAQ" };
    }

    revalidatePath("/dashboard/content-management/faqs");
    return { success: true };
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
