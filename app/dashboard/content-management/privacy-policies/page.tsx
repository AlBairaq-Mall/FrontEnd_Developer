import { fetchApi } from "@/lib/api";
import { PrivacyPoliciesClient } from "./components/PrivacyPoliciesClient";
import { Pagination } from "@/components/ui/Pagination";

export const metadata = {
  title: "سياسة الخصوصية | لوحة التحكم",
};

export default async function PrivacyPoliciesPage({
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
  if (params.per_page) query.set("per_page", params.per_page);
  query.set("paginate", "true");

  let data = [];
  let meta = null;

  try {
    const res = await fetchApi(`/privacy-policies?${query.toString()}`);
    if (res.ok) {
      const json = await res.json();
      data = json.data || [];
      meta = json.meta || null;
    }
  } catch (error) {
    console.error("Failed to fetch Privacy Policies entries:", error);
  }

  return (
    <div className="space-y-6" dir="rtl">
      <PrivacyPoliciesClient privacyPolicies={data} />
      {meta && meta.last_page > 1 && <Pagination meta={meta} />}
    </div>
  );
}
