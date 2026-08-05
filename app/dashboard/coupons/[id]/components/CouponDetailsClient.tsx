"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, Calendar, Tag, CreditCard, ShoppingBag, Hash, Activity } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function CouponDetailsClient({ coupon }: { coupon: any }) {
  const router = useRouter();

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/coupons"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">تفاصيل الكوبون: {coupon.code}</h1>
          <p className="text-gray-500 mt-1">عرض جميع إحصائيات ومعلومات الكوبون</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Tag className="w-5 h-5 text-brand" />
              المعلومات الأساسية
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-500">كود الخصم</span>
              <span className="font-mono font-bold bg-gray-100 px-2 py-1 rounded text-gray-900">{coupon.code}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-500">الحالة</span>
              <Badge variant={coupon.is_active ? "success" : "destructive"}>
                {coupon.is_active ? "نشط" : "غير نشط"}
              </Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-500">نوع الخصم</span>
              <span className="font-medium text-gray-900">
                {coupon.type === 'percentage' ? 'نسبة مئوية' : 'مبلغ ثابت'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500">قيمة الخصم</span>
              <span className="font-bold text-brand text-lg">
                {coupon.type === 'percentage' ? `%${coupon.value}` : `${coupon.value} ر.س`}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              إحصائيات الاستخدام
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-500 flex items-center gap-2">
                <Hash className="w-4 h-4" /> مرات الاستخدام
              </span>
              <span className="font-bold text-gray-900">{coupon.used_count || 0} من {coupon.usage_limit}</span>
            </div>
            
            <div className="py-2 border-b">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>معدل الاستهلاك</span>
                <span>{Math.min((((coupon.used_count || 0) / coupon.usage_limit) * 100), 100).toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${((coupon.used_count || 0) >= coupon.usage_limit) ? 'bg-red-500' : 'bg-brand'}`}
                  style={{ width: `${Math.min((((coupon.used_count || 0) / coupon.usage_limit) * 100), 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" /> الحد الأدنى للطلب
              </span>
              <span className="font-bold text-gray-900">{coupon.minimum_order_amount} ر.س</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-500" />
            فترة الصلاحية
          </h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col justify-center items-center">
              <span className="text-sm text-gray-500 mb-1">تاريخ البدء</span>
              <span className="font-bold text-gray-900 text-lg">
                {new Date(coupon.start_date).toLocaleDateString('ar-SA')}
              </span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col justify-center items-center">
              <span className="text-sm text-gray-500 mb-1">تاريخ الانتهاء</span>
              <span className="font-bold text-gray-900 text-lg">
                {coupon.end_date ? new Date(coupon.end_date).toLocaleDateString('ar-SA') : 'مفتوح (لا يوجد)'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
