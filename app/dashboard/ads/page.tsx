import { fetchApi } from "@/lib/api";
 import { Pagination } from "@/components/ui/Pagination";
import { AdsClient } from "./components/AdsClient";

export const metadata = {
  title: "الإعلانات | لوحة التحكم",
};

export default async function AdsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; is_active?: string; paginate?: string }>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams();
  
  if (params.page) query.set("page", params.page);
  else query.set("page", "1");
  
  if (params.search) query.set("search", params.search);
  
  if (params.is_active !== undefined && params.is_active !== "") query.set("is_active", params.is_active);
  
  query.set("paginate", params.paginate ?? "true");
  query.set("per_page", "20");

  let data = [];
  let meta = null;

  try {
    const res = await fetchApi(`/ads?${query.toString()}`);
    if (res.ok) {
      const json = await res.json();
      data = json.data || [];
      meta = json.meta || null;
    }
  } catch (error) {
    console.error("Failed to fetch ads:", error);
  }

  return (
    <div className="space-y-6" dir="rtl">
      <AdsClient adsData={data} />
      {meta && meta.last_page > 1 && <Pagination meta={meta} />}
    </div>
  );
}
