import { fetchApi } from "@/lib/api";
import { CustomersClient } from "./components/CustomersClient";
import { Pagination } from "@/components/ui/Pagination";

export const metadata = {
  title: "المستخدمين | لوحة التحكم",
};

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = params.page || "1";
  const search = params.search || "";

  let data = [];
  let meta = null;

  try {
    // Construct query params
    const query = new URLSearchParams();
    query.set("page", page);
    if (search) {
      query.set("search", search);
    }

    const res = await fetchApi(`/users?${query.toString()}`);
    if (res.ok) {
      const json = await res.json();
      data = json.data || [];
      meta = json.meta || null;
    } else {
      console.error("Failed to fetch users, status:", res.status);
    }
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">العملاء / المستخدمين</h2>
        <p className="text-gray-500 mt-1">سجل المستخدمين وإدارة الحسابات (حظر/تفعيل).</p>
      </div>

      <CustomersClient users={data} />
      
      {meta && meta.last_page > 1 && (
        <Pagination meta={meta} />
      )}
    </div>
  );
}
