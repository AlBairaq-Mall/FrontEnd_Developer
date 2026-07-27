"use server";

import { revalidatePath } from "next/cache";
import { fetchApi } from "@/lib/api";

export interface Offer {
  id: number | string;
  product: {
    id: number | string;
    name_en: string;
    name_ar: string;
  };
  unit: {
    id: number | string;
    name_en: string;
    name_ar: string;
    quantity: number;
  };
  original_price: number;
  type: "percentage" | "fixed";
  value: number;
  discount_amount: number;
  final_price: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OfferData {
  product_id: number | string;
  unit_id: number | string;
  type: "percentage" | "fixed";
  value: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export async function getOffers(params?: Record<string, string>) {
  try {
    let endpoint = "/offers";
    if (params) {
      const query = new URLSearchParams(params).toString();
      if (query) {
        endpoint += `?${query}`;
      }
    }
    const response = await fetchApi(endpoint, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch offers");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching offers:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function getOffer(id: string | number) {
  try {
    const response = await fetchApi(`/offers/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch offer ${id}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error(`Error fetching offer ${id}:`, error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function createOffer(data: OfferData) {
  try {
    const response = await fetchApi("/offers", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || "Failed to create offer",
        validationErrors: errorData.errors
      };
    }

    revalidatePath("/dashboard/offers");
    return { success: true };
  } catch (error) {
    console.error("Error creating offer:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function updateOffer(id: string | number, data: OfferData) {
  try {
    const response = await fetchApi(`/offers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || "Failed to update offer",
        validationErrors: errorData.errors
      };
    }

    revalidatePath("/dashboard/offers");
    return { success: true };
  } catch (error) {
    console.error("Error updating offer:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function deleteOffer(id: string | number) {
  try {
    const response = await fetchApi(`/offers/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return { success: false, error: "Failed to delete offer" };
    }

    revalidatePath("/dashboard/offers");
    return { success: true };
  } catch (error) {
    console.error("Error deleting offer:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function getOfferOptions() {
  try {
    const [productsRes, unitsRes] = await Promise.all([
      fetchApi("/products", { method: "GET" }),
      fetchApi("/units", { method: "GET" })
    ]);

    const productsData = productsRes.ok ? await productsRes.json() : [];
    const unitsData = unitsRes.ok ? await unitsRes.json() : [];

    return {
      success: true,
      products: Array.isArray(productsData) ? productsData : (productsData.data || []),
      units: Array.isArray(unitsData) ? unitsData : (unitsData.data || [])
    };
  } catch (error) {
    console.error("Error fetching offer options:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
