"use server";

import { revalidatePath } from "next/cache";
import { fetchApi } from "@/lib/api";

// --- Types ---

export interface CartItem {
  id: number | string;
  product?: any; // Can be typed further based on Product type
  unit?: any;    // Can be typed further based on Unit type
  quantity: number;
  price: number;
  total: number;
  created_at?: string;
  updated_at?: string;
}

export interface AddToCartData {
  product_id: number | string;
  unit_id: number | string;
  quantity: number;
}

export interface UpdateCartItemData {
  quantity: number;
}

export async function getCartOptions() {
  try {
    const [productsRes, unitsRes] = await Promise.all([
      fetchApi("/products?limit=100", { method: "GET" }),
      fetchApi("/units", { method: "GET" })
    ]);

    const productsData = productsRes.ok ? await productsRes.json() : { data: [] };
    const unitsData = unitsRes.ok ? await unitsRes.json() : { data: [] };

    return {
      success: true,
      products: productsData.data || [],
      units: unitsData.data || []
    };
  } catch (error) {
    console.error("Error fetching cart options:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

// --- Actions ---

export async function getCart() {
  try {
    const response = await fetchApi("/cart", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch cart");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching cart:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function getCartItem(id: string | number) {
  try {
    const response = await fetchApi(`/cart/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch cart item ${id}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error(`Error fetching cart item ${id}:`, error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function addToCart(data: AddToCartData) {
  try {
    const response = await fetchApi("/cart", {
      method: "POST",
      body: JSON.stringify(data),
    });
 
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || "Failed to add to cart",
        validationErrors: errorData.errors
      };
    }

    const resData = await response.json().catch(() => ({}));

    revalidatePath("/cart");
    revalidatePath("/");
    
    return { success: true, data: resData };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function updateCartItem(id: string | number, data: UpdateCartItemData) {
  try {
    const response = await fetchApi(`/cart/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || "Failed to update cart item",
        validationErrors: errorData.errors
      };
    }

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error updating cart item:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function deleteCartItem(id: string | number) {
  try {
    const response = await fetchApi(`/cart/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return { success: false, error: "Failed to delete cart item" };
    }

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function clearCart() {
  try {
    const response = await fetchApi("/cart", {
      method: "DELETE",
    });

    if (!response.ok) {
      return { success: false, error: "Failed to clear cart" };
    }

    revalidatePath("/cart");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error clearing cart:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
