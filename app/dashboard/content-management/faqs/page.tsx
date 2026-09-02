import { fetchApi } from "@/lib/api";
import { FaqsClient } from "./components/FaqsClient";
import { Pagination } from "@/components/ui/Pagination";

export const metadata = {
  title: "الأسئلة الشائعة | لوحة التحكم",
};

export default async function FaqsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string; per_page?: string }>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams();

  if (params.page) query.set("page", params.page);
  else query.set("page", "1");

  if (params.search) query.set("search", params.search);
  if (params.status !== undefined && params.status !== "") query.set("status", params.status);
  query.set("per_page", params.per_page || "20");
  query.set("paginate", "true");

  let data = [];
  let meta = null;

  try {
    const res = await fetchApi(`/faqs?${query.toString()}`);
    if (res.ok) {
      const json = await res.json();
      data = json.data || [];
      meta = json.meta || null;
    }
  } catch (error) {
    console.error("Failed to fetch FAQs entries:", error);
  }

  return (
    <div className="space-y-6" dir="rtl">
      <FaqsClient faqs={data} />
      {meta && meta.last_page > 1 && <Pagination meta={meta} />}
    </div>
  );
}
