"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getOffer, Offer } from "@/lib/actions/offers";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Calendar, Tag, DollarSign, Percent, Info, Package, Activity } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

export default function OfferDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOffer() {
      setLoading(true);
      const res = await getOffer(id);
      if (res.success && res.data) {
        setOffer(res.data.data || res.data); // Adjust based on how API wraps single resource
      } else {
        setError(res.error || "تعذر تحميل بيانات العرض.");
      }
      setLoading(false);
    }
    if (id) loadOffer();
  }, [id]);

  if (loading) {
    return <div className="py-20 text-center text-gray-500 text-lg">جاري تحميل بيانات العرض...</div>;
  }

  if (error || !offer) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-red-500 text-lg font-medium">{error || "العرض غير موجود"}</p>
        <Button onClick={() => router.push("/dashboard/offers")} variant="outline">
          العودة لقائمة العروض
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/offers" className="p-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors">
          <ArrowRight className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">تفاصيل العرض #{offer.id}</h2>
          <p className="text-gray-500 mt-1">عرض جميع البيانات المتعلقة بهذا العرض</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* معلومات الخصم والسعر */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-brand" />
                <h3 className="font-bold text-gray-800 text-lg">التسعير والخصم</h3>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">نوع الخصم</p>
                    <div className="flex items-center gap-2 font-semibold text-lg text-gray-800">
                      {offer.type === "percentage" ? (
                        <><Percent className="w-5 h-5 text-blue-500" /> نسبة مئوية</>
                      ) : (
                        <><Tag className="w-5 h-5 text-purple-500" /> مبلغ ثابت</>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">قيمة الخصم</p>
                    <p className="font-bold text-2xl text-gray-900">
                      {offer.value} {offer.type === "percentage" ? "%" : "ر.س"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">مقدار التوفير (مبلغ الخصم)</p>
                    <p className="font-semibold text-lg text-green-600">{offer.discount_amount} ر.س</p>
                  </div>
                </div>
                
                <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col justify-center">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">السعر الأصلي</p>
                    <p className="font-medium text-xl text-gray-500 line-through">{offer.original_price} ر.س</p>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-sm text-brand font-bold mb-1">السعر النهائي بعد العرض</p>
                    <p className="font-black text-3xl text-brand">{offer.final_price} ر.س</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* المنتج والوحدة */}
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-600" />
                <h3 className="font-bold text-gray-800 text-lg">المنتج المستهدف</h3>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center border text-gray-400">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{offer.product?.name_ar || offer.product?.name_en}</h4>
                    <p className="text-gray-500 text-sm">{offer.product?.name_en}</p>
                  </div>
                </div>
                <Link href={`/dashboard/products/${offer.product?.id}`} passHref legacyBehavior>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Info className="w-4 h-4" />
                    عرض تفاصيل المنتج
                  </Button>
                </Link>
              </div>

              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-2">الوحدة المطبقة عليها العرض</p>
                <div className="inline-flex items-center gap-3 bg-blue-50 text-blue-800 px-4 py-2 rounded-lg font-medium border border-blue-100">
                  <Tag className="w-4 h-4" />
                  <span>{offer.unit?.name_ar || offer.unit?.name_en}</span>
                  {offer.unit?.quantity && (
                    <span className="text-sm opacity-75">({offer.unit.quantity} قطع)</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* معلومات الحالة والتاريخ */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-gray-600" />
                <h3 className="font-bold text-gray-800 text-lg">حالة العرض</h3>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">الحالة الحالية:</span>
                {offer.is_active ? (
                  <Badge variant="success" className="px-3 py-1 text-sm">نشط وفعال</Badge>
                ) : (
                  <Badge variant="destructive" className="px-3 py-1 text-sm bg-gray-100 text-gray-800">غير نشط</Badge>
                )}
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">تاريخ البداية</span>
                  </div>
                  <p className="text-gray-900 font-semibold">{offer.start_date.split(" ")[0]}</p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">تاريخ النهاية</span>
                  </div>
                  <p className="text-gray-900 font-semibold">{offer.end_date.split(" ")[0]}</p>
                </div>
              </div>

              <div className="pt-4 border-t text-sm text-gray-500">
                <p>تاريخ الإنشاء: {offer.created_at.split(" ")[0]}</p>
                <p>آخر تحديث: {offer.updated_at.split(" ")[0]}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
