"use server";

import { revalidatePath } from "next/cache";
import { fetchApi } from "@/lib/api";

// --- Types ---

export interface OrderItem {
  id: number | string;
  product_id?: number | string;
  unit_id?: number | string;
  product?: any; // Can be typed further based on Product type
  unit?: any;    // Can be typed further based on Unit type
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: number | string;
  order_number: string;
  user: any;     // Can be typed further based on User type
  location: any; // Can be typed further based on Location type
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  discount: number;
  total: number;
  payment_method: "cash" | "card" | string;
  payment_status: "pending" | "paid" | "failed" | string;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | string;
  delivery_driver_id?: number | string | null;
  delivery_driver?: any;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateOrderData {
  location_id?: number | string;
  payment_method?: "cash" | "card";
  payment_status?: "pending" | "paid" | "failed";
  status?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  delivery_fee?: number;
  discount?: number;
  notes?: string;
}

// --- Actions ---

export async function getOrders(params?: Record<string, string>) {
  try {
    let endpoint = "/orders";
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
      throw new Error("Failed to fetch orders");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function getOrder(id: string | number) {
  try {
    const response = await fetchApi(`/orders/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch order ${id}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export interface CreateOrderData {
  user_id: number | string;
  location_id: number | string;
  payment_method: "cash" | "card" | string;
  delivery_fee?: number;
  discount?: number;
  notes?: string;
  items: {
    product_id: number | string;
    unit_id: number | string;
    quantity: number;
  }[];
}

export async function getUsersList() {
  try {
    const response = await fetchApi("/users?limit=1000", { method: "GET" });
    const data = await response.json();
    return { success: true, data: data.data || [] };
  } catch (error) {
    console.error("Error fetching users list:", error);
    return { success: false, data: [] };
  }
}

export async function getOrderOptions() {
  try {
    const [usersRes, productsRes, locationsRes, unitsRes] = await Promise.all([
      fetchApi("/users?limit=100", { method: "GET" }),
      fetchApi("/products?limit=100", { method: "GET" }),
      fetchApi("/locations-admin?limit=100", { method: "GET" }),
      fetchApi("/units", { method: "GET" })
    ]);

    const usersData = usersRes.ok ? await usersRes.json() : { data: [] };
    const productsData = productsRes.ok ? await productsRes.json() : { data: [] };
    const locationsData = locationsRes.ok ? await locationsRes.json() : { data: [] };
    const unitsData = unitsRes.ok ? await unitsRes.json() : { data: [] };

    return {
      success: true,
      users: usersData.data || [],
      products: productsData.data || [],
      locations: locationsData.data || [],
      units: unitsData.data || []
    };
  } catch (error) {
    console.error("Error fetching order options:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function createOrder(data: CreateOrderData) {
  try {
    const response = await fetchApi("/orders/admin-store", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || "Failed to create order",
        validationErrors: errorData.errors
      };
    }

    revalidatePath("/dashboard/orders");
    return { success: true };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function updateOrder(id: string | number, data: UpdateOrderData) {
  try {
    const response = await fetchApi(`/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || "Failed to update order",
        validationErrors: errorData.errors
      };
    }

    revalidatePath("/dashboard/orders");
    revalidatePath(`/dashboard/orders/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating order:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function updateOrderStatus(id: string | number, status: string) {
  try {
    const response = await fetchApi(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || "Failed to update order status",
        validationErrors: errorData.errors
      };
    }

    revalidatePath("/dashboard/orders");
    revalidatePath(`/dashboard/orders/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function deleteOrder(id: string | number) {
  try {
    const response = await fetchApi(`/orders/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return { success: false, error: "Failed to delete order" };
    }

    revalidatePath("/dashboard/orders");
    return { success: true };
  } catch (error) {
    console.error("Error deleting order:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function assignDeliveryDriver(id: string | number, delivery_driver_id: string | number) {
  console.log(delivery_driver_id, "responseresponse")
  try {
    const response = await fetchApi(`/orders/${id}/delivery-driver`, {
      method: "PATCH",
      body: JSON.stringify({ delivery_driver_id }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || "Failed to assign delivery driver",
        validationErrors: errorData.errors
      };
    }

    revalidatePath("/dashboard/orders");
    revalidatePath(`/dashboard/orders/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error assigning delivery driver:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function getDeliveryDrivers() {
  try {
    const response = await fetchApi("/users?role=delivery&limit=100", { method: "GET" });
    const data = await response.json();
    return { success: true, data: data.data || [] };
  } catch (error) {
    console.error("Error fetching delivery drivers:", error);
    return { success: false, data: [] };
  }
}
