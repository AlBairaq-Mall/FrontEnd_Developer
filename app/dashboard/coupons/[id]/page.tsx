import { fetchApi } from "@/lib/api";
import { notFound } from "next/navigation";
import { CouponDetailsClient } from "./components/CouponDetailsClient";

export const metadata = {
  title: "تفاصيل الكوبون | لوحة التحكم",
};

export default async function CouponDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  let coupon = null;
  try {
    const res = await fetchApi(`/coupons/${resolvedParams.id}`);
    if (res.ok) {
      const json = await res.json();
      coupon = json.data || null;
    }
  } catch (error) {
    console.error("Failed to fetch coupon details:", error);
  }

  if (!coupon) {
    notFound();
  }

  return <CouponDetailsClient coupon={coupon} />;
}
