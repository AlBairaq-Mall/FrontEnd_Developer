import { fetchApi } from "@/lib/api";
import { ProductsClient } from "./components/ProductsClient";
import { Pagination } from "@/components/ui/Pagination";

export const metadata = {
  title: "المنتجات | لوحة التحكم",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = params.page || "1";

  let data = [];
  let meta = null;

  try {
    const res = await fetchApi(`/products?page=${page}`);
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
