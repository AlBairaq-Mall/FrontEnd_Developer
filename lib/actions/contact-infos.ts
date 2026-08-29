"use server";

import { revalidatePath } from "next/cache";
import { fetchApi } from "@/lib/api";

export async function createContactInfo(data: {
  type: string;
  title_en: string;
  title_ar: string;
  value_en: string;
  value_ar: string;
  is_active: boolean;
}) {
  try {
    const response = await fetchApi("/contact-infos", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData.message || "Failed to create Contact Info entry" };
    }

    revalidatePath("/dashboard/content-management/contact-infos");
    return { success: true };
  } catch (error) {
    console.error("Error creating Contact Info:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function updateContactInfo(
  id: string | number,
  data: {
    type: string;
    title_en: string;
    title_ar: string;
    value_en: string;
    value_ar: string;
    is_active: boolean;
  }
) {
  try {
    const response = await fetchApi(`/contact-infos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData.message || "Failed to update Contact Info entry" };
    }

    revalidatePath("/dashboard/content-management/contact-infos");
    return { success: true };
  } catch (error) {
    console.error("Error updating Contact Info:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function deleteContactInfo(id: string | number) {
  try {
    const response = await fetchApi(`/contact-infos/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return { success: false, error: "Failed to delete Contact Info entry" };
    }

    revalidatePath("/dashboard/content-management/contact-infos");
    return { success: true };
  } catch (error) {
    console.error("Error deleting Contact Info:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
