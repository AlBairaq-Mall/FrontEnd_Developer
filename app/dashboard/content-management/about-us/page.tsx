import { fetchApi } from "@/lib/api";
import { AboutUsClient } from "./components/AboutUsClient";
import { Pagination } from "@/components/ui/Pagination";

export const metadata = {
  title: "من نحن | لوحة التحكم",
};

export default async function AboutUsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; per_page?: string }>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams();

  if (params.page) query.set("page", params.page);
  else query.set("page", "1");

  if (params.search) query.set("search", params.search);
  if (params.per_page) query.set("per_page", params.per_page);
  query.set("paginate", "true");

  let data = [];
  let meta = null;

  try {
    const res = await fetchApi(`/about-us?${query.toString()}`);
    if (res.ok) {
      const json = await res.json();
      data = json.data || [];
      meta = json.meta || null;
    }
  } catch (error) {
    console.error("Failed to fetch About Us entries:", error);
  }

  return (
    <div className="space-y-6" dir="rtl">
      <AboutUsClient aboutUsEntries={data} />
      {meta && meta.last_page > 1 && <Pagination meta={meta} />}
    </div>
  );
}
