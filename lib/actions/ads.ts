"use server";

import { revalidatePath } from "next/cache";
import { fetchApi } from "@/lib/api";

export async function createAd(formData: FormData) {
  try {
    const response = await fetchApi("/ads", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData.message || "فشل في إنشاء الإعلان" };
    }

    revalidatePath("/dashboard/ads");
    return { success: true };
  } catch (error) {
    console.error("Error creating ad:", error);
    return { success: false, error: "حدث خطأ غير متوقع." };
  }
}

export async function updateAd(id: string | number, formData: FormData) {
  try {
    // Backend requires _method=PUT for multipart/form-data updates in Laravel
    formData.append("_method", "PUT");
    
    const response = await fetchApi(`/ads/${id}`, {
      method: "POST", // Must be POST when sending FormData with files, Laravel handles the _method=PUT
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData.message || "فشل في تحديث الإعلان" };
    }

    revalidatePath("/dashboard/ads");
    return { success: true };
  } catch (error) {
    console.error("Error updating ad:", error);
    return { success: false, error: "حدث خطأ غير متوقع." };
  }
}

export async function deleteAd(id: string | number) {
  try {
    const response = await fetchApi(`/ads/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return { success: false, error: "فشل في حذف الإعلان" };
    }

    revalidatePath("/dashboard/ads");
    return { success: true };
  } catch (error) {
    console.error("Error deleting ad:", error);
    return { success: false, error: "حدث خطأ غير متوقع." };
  }
}
