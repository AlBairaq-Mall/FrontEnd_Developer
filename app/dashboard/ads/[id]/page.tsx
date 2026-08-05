import { fetchApi } from "@/lib/api";
import { notFound } from "next/navigation";
import { AdDetailsClient } from "./components/AdDetailsClient";

export const metadata = {
  title: "تفاصيل الإعلان | لوحة التحكم",
};

export default async function AdDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  let ad = null;
  try {
    const res = await fetchApi(`/ads/${resolvedParams.id}`);
    if (res.ok) {
      const json = await res.json();
      ad = json.data || null;
    }
  } catch (error) {
    console.error("Failed to fetch ad details:", error);
  }

  if (!ad) {
    notFound();
  }

  return <AdDetailsClient ad={ad} />;
}
