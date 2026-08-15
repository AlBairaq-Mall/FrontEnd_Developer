"use server";

import { revalidatePath } from "next/cache";
import { fetchApi } from "@/lib/api";

export async function createUser(data: {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  password_confirmation?: string;
  role: string;
  is_active: boolean;
}) {
  try {
    const response = await fetchApi("/users", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { error: errorData?.message || "فشل في إنشاء المستخدم" };
    }

    revalidatePath("/dashboard/customers");
    return { success: true };
  } catch (error) {
    console.error("Create user error:", error);
    return { error: "حدث خطأ غير متوقع" };
  }
}

export async function updateUser(
  id: number,
  data: {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    password_confirmation?: string;
    role: string;
    is_active: boolean;
  }
) {
  try {
    // Only send password if it's provided and not empty
    const payload = { ...data };
    if (!payload.password) {
      delete payload.password;
      delete payload.password_confirmation;
    }

    const response = await fetchApi(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { error: errorData?.message || "فشل في تحديث المستخدم" };
    }

    revalidatePath("/dashboard/customers");
    return { success: true };
  } catch (error) {
    console.error("Update user error:", error);
    return { error: "حدث خطأ غير متوقع" };
  }
}

export async function deleteUser(id: number) {
  try {
    const response = await fetchApi(`/users/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return { error: errorData?.message || "فشل في حذف المستخدم" };
    }

    revalidatePath("/dashboard/customers");
    return { success: true };
  } catch (error) {
    console.error("Delete user error:", error);
    return { error: "حدث خطأ غير متوقع" };
  }
}
