"use server";

import { revalidatePath } from "next/cache";
import { fetchApi } from "@/lib/api";

export async function createLocation(data: {
  user_id: number;
  title: string;
  address: string;
  latitude?: number;
  longitude?: number; 
  is_default?: boolean;
}) {
  try {
    const response = await fetchApi("/locations-admin", {
      method: "POST",
      body: JSON.stringify(data),
    });
console.log(response)
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { error: errorData?.message || "فشل في إنشاء العنوان" };
    }

    revalidatePath(`/dashboard/customers/${data.user_id}/locations`);
    return { success: true };
  } catch (error) {
    console.error("Create location error:", error);
    return { error: "حدث خطأ غير متوقع" };
  }
}

export async function updateLocation(
  id: number,
  userId: number,
  data: {
    user_id: number;
    title: string; 
    address: string;
    latitude?: number;
    longitude?: number;
    is_default?: boolean;
  }
) {
  try {
    const response = await fetchApi(`/locations-admin/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { error: errorData?.message || "فشل في تحديث العنوان" };
    }

    revalidatePath(`/dashboard/customers/${userId}/locations`);
    return { success: true };
  } catch (error) {
    console.error("Update location error:", error);
    return { error: "حدث خطأ غير متوقع" };
  }
}

export async function deleteLocation(id: number, userId: number) {
  try {
    const response = await fetchApi(`/locations-admin/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { error: errorData?.message || "فشل في حذف العنوان" };
    }

    revalidatePath(`/dashboard/customers/${userId}/locations`);
    return { success: true };
  } catch (error) {
    console.error("Delete location error:", error);
    return { error: "حدث خطأ غير متوقع" };
  }
}
