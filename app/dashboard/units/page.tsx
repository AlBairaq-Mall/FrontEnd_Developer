import { fetchApi } from "@/lib/api";
import { UnitsClient } from "./components/UnitsClient";
import { Pagination } from "@/components/ui/Pagination";

export const metadata = {
  title: "الوحدات | لوحة التحكم",
};

export default async function UnitsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string; per_page?: string; paginate?: string }>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams();
  
  if (params.page) query.set("page", params.page);
  else query.set("page", "1");
  
  if (params.search) query.set("search", params.search);
  
  if (params.status !== undefined && params.status !== "") query.set("status", params.status);
  query.set("per_page", params.per_page || "20");
  if (params.paginate !== undefined) query.set("paginate", params.paginate);

  let data = [];
  let meta = null;

  try {
    const res = await fetchApi(`/units?${query.toString()}`);
    if (res.ok) {
      const json = await res.json();
      data = json.data || [];
      meta = json.meta || null;
    }
  } catch (error) {
    console.error("Failed to fetch units:", error);
  }

  return (
    <div className="space-y-6" dir="rtl">
      <UnitsClient units={data} />
      {meta && meta.last_page > 1 && <Pagination meta={meta} />}
    </div>
  );
}
