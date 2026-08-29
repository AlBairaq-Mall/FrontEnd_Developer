"use server";

import { revalidatePath } from "next/cache";
import { fetchApi } from "@/lib/api";

export async function createAboutUs(data: {
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
}) {
  try {
    const response = await fetchApi("/about-us", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData.message || "Failed to create About Us entry" };
    }

    revalidatePath("/dashboard/content-management/about-us");
    return { success: true };
  } catch (error) {
    console.error("Error creating About Us:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function updateAboutUs(
  id: string | number,
  data: {
    title_en: string;
    title_ar: string;
    description_en: string;
    description_ar: string;
  }
) {
  try {
    const response = await fetchApi(`/about-us/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData.message || "Failed to update About Us entry" };
    }

    revalidatePath("/dashboard/content-management/about-us");
    return { success: true };
  } catch (error) {
    console.error("Error updating About Us:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function deleteAboutUs(id: string | number) {
  try {
    const response = await fetchApi(`/about-us/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return { success: false, error: "Failed to delete About Us entry" };
    }

    revalidatePath("/dashboard/content-management/about-us");
    return { success: true };
  } catch (error) {
    console.error("Error deleting About Us:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
