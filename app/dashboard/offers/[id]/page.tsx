"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getOffer, Offer } from "@/lib/actions/offers";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Calendar, Tag, DollarSign, Percent, Info, Package, Activity, Gift } from "lucide-react";
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
        setOffer(res.data.data || res.data);
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
          <h2 className="text-2xl font-bold text-gray-900">
            {offer.title_ar || offer.title_en || `تفاصيل العرض #${offer.id}`}
          </h2>
          <p className="text-gray-500 mt-1">{offer.description_ar || offer.description_en || 'عرض جميع البيانات المتعلقة بهذا العرض'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* معلومات الخصم والهدية */}
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-brand" />
                <h3 className="font-bold text-gray-800 text-lg">تفاصيل الخصم</h3>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">نوع العرض</p>
                    <div className="flex items-center gap-2 font-semibold text-lg text-gray-800">
                      {offer.type === "percentage" ? (
                        <><Percent className="w-5 h-5 text-blue-500" /> نسبة مئوية</>
                      ) : offer.type === "fixed" ? (
                        <><Tag className="w-5 h-5 text-purple-500" /> مبلغ ثابت</>
                      ) : (
                        <><Gift className="w-5 h-5 text-amber-500" /> هدية مجانية</>
                      )}
                    </div>
                  </div>
                  
                  {offer.type !== "gift" && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">قيمة الخصم</p>
                      <p className="font-bold text-2xl text-gray-900">
                        {offer.value} {offer.type === "percentage" ? "%" : "ر.ي"}
                      </p>
                    </div>
                  )}
                </div>

                {offer.type === "gift" && offer.gift_product && (
                  <div className="space-y-4 bg-amber-50/50 p-6 rounded-xl border border-amber-100 flex flex-col justify-center">
                    <div>
                      <p className="text-sm text-amber-800 font-bold mb-2">تفاصيل الهدية</p>
                      <p className="text-gray-700">
                        اشتري <span className="font-bold">{offer.buy_quantity}</span> واحصل على <span className="font-bold">{offer.gift_quantity}</span> مجاناً
                      </p>
                    </div>
                    <div className="pt-2 border-t border-amber-200">
                      <p className="text-xs text-gray-500 mb-1">المنتج المجاني</p>
                      <p className="font-bold text-lg text-gray-900">
                        {offer.gift_product.product.name_ar || offer.gift_product.product.name_en}
                      </p>
                      <p className="text-sm text-gray-600">
                        الوحدة: {offer.gift_product.unit.name_ar || offer.gift_product.unit.name_en}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* المنتجات المشمولة */}
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-gray-600" />
                  <h3 className="font-bold text-gray-800 text-lg">المنتجات المشمولة في العرض</h3>
                </div>
                <Badge variant="info">{(offer.product_units || offer.products)?.length || 0} منتج</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {(() => {
                  const offerProducts = offer.product_units || offer.products;
                  return offerProducts && offerProducts.length > 0 ? (
                    offerProducts.map((p, index) => (
                      <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center border text-gray-400 shrink-0">
                            <Package className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{p.product?.name_ar || p.product?.name_en}</h4>
                            <div className="flex flex-wrap items-center gap-4 mt-1">
                              <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                                <Tag className="w-3 h-3" />
                                <span>الوحدة: {p.unit?.name_ar || p.unit?.name_en}</span>
                              </div>
                              {p.old_price !== undefined && p.price !== undefined && (
                                <div className="inline-flex items-center gap-2 text-sm">
                                  <span className="text-gray-400 line-through">{p.old_price} ر.ي</span>
                                  <span className="font-bold text-green-600">{p.price} ر.ي</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <Link href={`/dashboard/products/${p.product?.id}`}>
                          <Button variant="outline" size="sm" className="shrink-0 gap-2">
                            <Info className="w-4 h-4" />
                            تفاصيل
                          </Button>
                        </Link>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-4">لا توجد منتجات مسجلة في هذا العرض.</p>
                  );
                })()}
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
                  <p className="text-gray-900 font-semibold">{offer.start_date?.split(" ")[0] || '-'}</p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">تاريخ النهاية</span>
                  </div>
                  <p className="text-gray-900 font-semibold">{offer.end_date?.split(" ")[0] || '-'}</p>
                </div>
              </div>

              <div className="pt-4 border-t text-sm text-gray-500">
                <p>تاريخ الإنشاء: {offer.created_at?.split(" ")[0] || '-'}</p>
                <p>آخر تحديث: {offer.updated_at?.split(" ")[0] || '-'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
