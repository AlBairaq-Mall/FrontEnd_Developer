"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Download, Filter, TrendingUp, DollarSign, Package } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">التقارير المتقدمة</h1>
          <p className="text-gray-500 mt-1">تصدير تقارير مفصلة عن المبيعات، الأرباح، وأداء المتجر.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm shadow-green-600/20">
            <Download className="w-5 h-5" />
            <span>تصدير كـ Excel</span>
          </button>
          <button className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-sm shadow-red-600/20">
            <Download className="w-5 h-5" />
            <span>تصدير كـ PDF</span>
          </button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full space-y-1">
            <label className="text-sm font-medium text-gray-700">نوع التقرير</label>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand">
              <option>تقرير المبيعات والأرباح</option>
              <option>المنتجات الأكثر مبيعاً</option>
              <option>أداء المندوبين</option>
              <option>حركة المخزون</option>
            </select>
          </div>
          <div className="flex-1 w-full space-y-1">
            <label className="text-sm font-medium text-gray-700">الفترة من</label>
            <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand" />
          </div>
          <div className="flex-1 w-full space-y-1">
            <label className="text-sm font-medium text-gray-700">إلى</label>
            <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand" />
          </div>
          <button className="bg-brand/10 text-brand px-6 py-2 rounded-lg hover:bg-brand/20 transition-colors font-medium flex items-center gap-2 h-[42px]">
            <Filter className="w-5 h-5" />
            <span>تطبيق الفلتر</span>
          </button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">إجمالي المبيعات (خلال الفترة)</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">124,500 ر.س</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-50 text-green-500 flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">صافي الأرباح</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">32,150 ر.س</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">الطلبات المكتملة</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">845 طلب</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-bold text-gray-800">معاينة التقرير</h3>
        </CardHeader>
        <CardContent>
          <div className="h-64 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 bg-gray-50">
            <TrendingUp className="w-12 h-12 mb-3 text-gray-300" />
            <p>قم بتحديد الفلاتر والنقر على "تطبيق الفلتر" لعرض البيانات هنا</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
