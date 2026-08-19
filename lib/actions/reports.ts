"use server";

import { fetchApi } from "@/lib/api";

export interface SalesReportData {
  total_sales: number;
  total_orders: number;
}

export interface CustomersReportData {
  total_customers: number;
}

export interface ProductsReportData {
  total_products: number;
}

export interface OrdersReportData {
  total_orders: number;
  pending: number;
  confirmed: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  total_amount: number;
}

export interface DriverReportItem {
  id: number;
  name: string;
  email: string;
  total_orders: number;
  pending_orders: number;
  processing_orders: number;
  shipped_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  total_sales: number;
}

export interface DriverDetailReportData {
  driver: {
    id: number;
    name: string;
    email: string;
  };
  orders: {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  total_sales: number;
}

export interface LocationsReportData {
  total_locations: number;
}

/**
 * Get Sales Report
 */
export async function getSalesReport(from?: string, to?: string) {
  try {
    let url = "/reports/sales";
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const res = await fetchApi(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return { success: true, data: json.data as SalesReportData };
  } catch (error: any) {
    console.error("getSalesReport error:", error);
    return { success: false, error: error.message || "فشل تحميل تقرير المبيعات" };
  }
}

/**
 * Get Customers Report
 */
export async function getCustomersReport() {
  try {
    const res = await fetchApi("/reports/customers");
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return { success: true, data: json.data as CustomersReportData };
  } catch (error: any) {
    console.error("getCustomersReport error:", error);
    return { success: false, error: error.message || "فشل تحميل تقرير العملاء" };
  }
}

/**
 * Get Products Report
 */
export async function getProductsReport() {
  try {
    const res = await fetchApi("/reports/products");
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return { success: true, data: json.data as ProductsReportData };
  } catch (error: any) {
    console.error("getProductsReport error:", error);
    return { success: false, error: error.message || "فشل تحميل تقرير المنتجات" };
  }
}

/**
 * Get Orders Report
 */
export async function getOrdersReport(from?: string, to?: string) {
  try {
    let url = "/reports/orders";
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const res = await fetchApi(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return { success: true, data: json.data as OrdersReportData };
  } catch (error: any) {
    console.error("getOrdersReport error:", error);
    return { success: false, error: error.message || "فشل تحميل تقرير الطلبات" };
  }
}

/**
 * Get Delivery Drivers Report
 */
export async function getDeliveryDriversReport(from?: string, to?: string) {
  try {
    let url = "/reports/delivery-drivers";
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const res = await fetchApi(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return { success: true, data: json.data as DriverReportItem[] };
  } catch (error: any) {
    console.error("getDeliveryDriversReport error:", error);
    return { success: false, error: error.message || "فشل تحميل تقرير مناديب التوصيل" };
  }
}

/**
 * Get Specific Delivery Driver Detail Report
 */
export async function getDeliveryDriverDetailReport(id: number | string, from?: string, to?: string) {
  try {
    let url = `/reports/delivery-drivers/${id}`;
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const res = await fetchApi(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return { success: true, data: json.data as DriverDetailReportData };
  } catch (error: any) {
    console.error(`getDeliveryDriverDetailReport for driver ${id} error:`, error);
    return { success: false, error: error.message || "فشل تحميل تفاصيل تقرير المندوب" };
  }
}

/**
 * Get Locations Report
 */
export async function getLocationsReport() {
  try {
    const res = await fetchApi("/reports/locations");
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return { success: true, data: json.data as LocationsReportData };
  } catch (error: any) {
    console.error("getLocationsReport error:", error);
    return { success: false, error: error.message || "فشل تحميل تقرير المواقع" };
  }
}
