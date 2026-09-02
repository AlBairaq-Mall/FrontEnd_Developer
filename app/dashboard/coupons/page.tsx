import { fetchApi } from "@/lib/api";
import { CouponsClient } from "./components/CouponsClient";
import { Pagination } from "@/components/ui/Pagination";

export const metadata = {
  title: "الكوبونات | لوحة التحكم",
};

export default async function CouponsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string; type?: string; per_page?: string; paginate?: string }>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams();
  
  if (params.page) query.set("page", params.page);
  else query.set("page", "1");
  
  if (params.search) query.set("search", params.search);
  
  if (params.status !== undefined && params.status !== "") query.set("status", params.status);
  if (params.type !== undefined && params.type !== "") query.set("type", params.type);
  query.set("per_page", params.per_page || "20");
  
  // Default to false for paginate, or true based on typical requirements, 
  // but looking at cupones.txt it seems it accepts paginate=false
  query.set("paginate", params.paginate ?? "false");

  let data = [];
  let meta = null;

  try {
    const res = await fetchApi(`/coupons?${query.toString()}`);
    if (res.ok) {
      const json = await res.json();
      data = json.data || [];
      meta = json.meta || null;
    }
  } catch (error) {
    console.error("Failed to fetch coupons:", error);
  }

  return (
    <div className="space-y-6" dir="rtl">
      <CouponsClient couponsData={data} />
      {meta && meta.last_page > 1 && <Pagination meta={meta} />}
    </div>
  );
}
