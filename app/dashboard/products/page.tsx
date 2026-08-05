import { fetchApi } from "@/lib/api";
import { ProductsClient } from "./components/ProductsClient";
import { Pagination } from "@/components/ui/Pagination";

export const metadata = {
  title: "المنتجات | لوحة التحكم",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string; category_id?: string; }>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams();
  
  if (params.page) query.set("page", params.page);
  else query.set("page", "1");
  
  if (params.search) query.set("search", params.search);
  if (params.status !== undefined && params.status !== "") query.set("status", params.status);
  if (params.category_id !== undefined && params.category_id !== "") query.set("category_id", params.category_id);

  let data = [];
  let meta = null;

  try {
    const res = await fetchApi(`/products?${query.toString()}`);
    if (res.ok) {
      const json = await res.json();
      data = json.data || [];
      meta = json.meta || null;
    }
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }

  return (
    <div className="space-y-6" dir="rtl">
      <ProductsClient products={data} />
      {meta && <Pagination meta={meta} />}
    </div>
  );
}
