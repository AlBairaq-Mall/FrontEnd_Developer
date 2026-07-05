import { fetchApi } from "@/lib/api";
import { CategoriesClient } from "./components/CategoriesClient";
import { Pagination } from "@/components/ui/Pagination";

export const metadata = {
  title: "الأقسام | لوحة التحكم",
};

// Since Next.js 15 uses promises for searchParams in layout/page, we define it correctly:
// Wait, for Next.js 14 it is synchronous. If package.json is "next": "16.2.9" ? Oh, wait. The user's package.json says "next": "16.2.9" which does not exist, but let's assume standard App router async searchParams for Next 15+.
export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = params.page || "1";

  let data = [];
  let meta = null;

  try {
    const res = await fetchApi(`/categories?page=${page}`);
    if (res.ok) {
      const json = await res.json();
      data = json.data || [];
      meta = json.meta || null;
    }
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }

  return (
    <div className="space-y-6" dir="rtl">
      <CategoriesClient categories={data} />
      {meta && <Pagination meta={meta} />}
    </div>
  );
}
