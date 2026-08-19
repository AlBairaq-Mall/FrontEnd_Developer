"use server";

import { fetchApi } from "@/lib/api";

export interface DashboardStats {
  ordersCount: number;
  customersCount: number;
  productsCount: number;
}

export async function getDashboardStats() {
  try {
    const [productsRes, customersRes, ordersRes] = await Promise.all([
      fetchApi("/products?limit=1"),
      fetchApi("/users?role=customer&limit=1"),
      fetchApi("/orders?limit=1"),
    ]);

    let productsCount = 0;
    if (productsRes.ok) {
      const json = await productsRes.json();
      productsCount = json.meta?.total ?? (Array.isArray(json.data) ? json.data.length : (Array.isArray(json) ? json.length : 0));
    } else {
      console.error("Failed to fetch products count:", productsRes.status);
    }

    let customersCount = 0;
    if (customersRes.ok) {
      const json = await customersRes.json();
      customersCount = json.meta?.total ?? (Array.isArray(json.data) ? json.data.length : (Array.isArray(json) ? json.length : 0));
    } else {
      console.error("Failed to fetch customers count:", customersRes.status);
    }

    let ordersCount = 0;
    if (ordersRes.ok) {
      const json = await ordersRes.json();
      ordersCount = json.meta?.total ?? (Array.isArray(json.data) ? json.data.length : (Array.isArray(json) ? json.length : 0));
    } else {
      console.error("Failed to fetch orders count:", ordersRes.status);
    }

    return {
      success: true,
      data: {
        ordersCount,
        customersCount,
        productsCount,
      } as DashboardStats,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      success: false,
      error: "حدث خطأ أثناء تحميل إحصائيات لوحة التحكم.",
    };
  }
}
