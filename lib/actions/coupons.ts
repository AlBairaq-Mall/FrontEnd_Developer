"use server";

import { revalidatePath } from "next/cache";
import { fetchApi } from "@/lib/api";

export async function createCoupon(data: any) {
  try {
    const response = await fetchApi("/coupons", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData.message || "فشل في إنشاء الكوبون" };
    }

    revalidatePath("/dashboard/coupons");
    return { success: true };
  } catch (error) {
    console.error("Error creating coupon:", error);
    return { success: false, error: "حدث خطأ غير متوقع." };
  }
}

export async function updateCoupon(id: string | number, data: any) {
  try { 
    const response = await fetchApi(`/coupons/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data), 
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData.message || "فشل في تحديث الكوبون" };
    }

    revalidatePath("/dashboard/coupons");
    return { success: true };
  } catch (error) {
    console.error("Error updating coupon:", error);
    return { success: false, error: "حدث خطأ غير متوقع." };
  }
}

export async function deleteCoupon(id: string | number) {
  try {
    const response = await fetchApi(`/coupons/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return { success: false, error: "فشل في حذف الكوبون" };
    }

    revalidatePath("/dashboard/coupons");
    return { success: true };
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return { success: false, error: "حدث خطأ غير متوقع." };
  }
}
