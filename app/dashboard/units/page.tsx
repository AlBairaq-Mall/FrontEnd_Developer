import { fetchApi } from "@/lib/api";
import { UnitsClient } from "./components/UnitsClient";
import { Pagination } from "@/components/ui/Pagination";

export const metadata = {
  title: "الوحدات | لوحة التحكم",
};

export default async function UnitsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = params.page || "1";

  let data = [];
  let meta = null;

  try {
    const res = await fetchApi(`/units?page=${page}`);
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
      {meta && <Pagination meta={meta} />}
    </div>
  );
}
