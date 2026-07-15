import { fetchApi } from "@/lib/api";
import { LocationsClient } from "./components/LocationsClient";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "عناوين العميل | لوحة التحكم",
};

export default async function CustomerLocationsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const resolvedParams = await params;
  const userId = resolvedParams.id;
  
  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams.page || "1";
  
  // 1. Fetch User details (optional but good for UI)
  let userName = `العميل #${userId}`;
  try {
    const userRes = await fetchApi(`/users/${userId}`);
    if (userRes.ok) {
      const userJson = await userRes.json();
      if (userJson.data && userJson.data.name) {
        userName = userJson.data.name;
      }
    }
  } catch (e) {}

  // 2. Fetch Locations for this user
  let data = [];
  let meta = null;

  try {
    const query = new URLSearchParams();
    query.set("page", page);
    // Assuming backend filters by user_id
    query.set("user_id", userId);

    const res = await fetchApi(`/locations-admin?${query.toString()}`);
    if (res.ok) {
      const json = await res.json();
      data = json.data || [];
      meta = json.meta || null;
    } else {
      console.error("Failed to fetch locations, status:", res.status);
    }
  } catch (error) {
    console.error("Failed to fetch locations:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <Link href="/dashboard/customers" className="hover:text-brand transition-colors">
          العملاء
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">عناوين العميل</span>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          عناوين: <span className="text-brand">{userName}</span>
        </h2>
        <p className="text-gray-500 mt-1">إدارة العناوين المحفوظة لهذا العميل.</p>
      </div>

      <LocationsClient locations={data} userId={parseInt(userId)} />
    </div>
  );
}
