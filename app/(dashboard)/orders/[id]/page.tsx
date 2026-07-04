"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Printer, ArrowRight, Truck, CheckCircle2, AlertCircle, Phone, MapPin, User, Package } from "lucide-react";
import Link from "next/link";
import { use } from "react";

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const orderItems = [
    { id: 1, name: "تفاح أحمر طازج", quantity: 2, price: 12.5, total: 25.0 },
    { id: 2, name: "عصير برتقال طبيعي", quantity: 1, price: 15.0, total: 15.0 },
    { id: 3, name: "خبز أسمر للدايت", quantity: 3, price: 4.0, total: 12.0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/orders" className="p-2 text-gray-500 hover:text-brand hover:bg-brand/10 rounded-lg transition-colors">
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">طلب #{orderId}</h1>
              <Badge variant="warning">قيد التجهيز</Badge>
            </div>
            <p className="text-gray-500 mt-1">تم الإنشاء في 23 يونيو 2026، 10:30 صباحاً</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Printer className="w-5 h-5" />
            <span>طباعة الفاتورة</span>
          </button>
          <button className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors">
            <CheckCircle2 className="w-5 h-5" />
            <span>تحديث الحالة</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Package className="w-5 h-5" />
                منتجات الطلب
              </h3>
            </CardHeader>
            <div className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المنتج</TableHead>
                    <TableHead>السعر</TableHead>
                    <TableHead>الكمية</TableHead>
                    <TableHead>المجموع</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-bold text-gray-900">{item.name}</TableCell>
                      <TableCell>{item.price} ر.س</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="font-bold">{item.total} ر.س</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <CardContent className="bg-gray-50 flex justify-end">
              <div className="w-64 space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>المجموع الفرعي:</span>
                  <span>52.0 ر.س</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>رسوم التوصيل:</span>
                  <span>15.0 ر.س</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>الضريبة (15%):</span>
                  <span>10.05 ر.س</span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between font-bold text-lg text-gray-900">
                  <span>الإجمالي:</span>
                  <span>77.05 ر.س</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                حالة التوصيل
              </h3>
            </CardHeader>
            <CardContent>
              <div className="relative pl-8 border-r-2 border-gray-100 pr-4 space-y-8">
                <div className="relative">
                  <div className="absolute -right-[23px] bg-brand text-white w-6 h-6 rounded-full flex items-center justify-center border-4 border-white">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <h4 className="font-bold text-gray-900">تم استلام الطلب</h4>
                  <p className="text-sm text-gray-500">23 يونيو، 10:30 صباحاً</p>
                </div>
                <div className="relative">
                  <div className="absolute -right-[23px] bg-yellow-400 text-white w-6 h-6 rounded-full flex items-center justify-center border-4 border-white">
                    <AlertCircle className="w-3 h-3" />
                  </div>
                  <h4 className="font-bold text-gray-900">قيد التجهيز</h4>
                  <p className="text-sm text-gray-500">جاري التجهيز في فرع الشمال</p>
                </div>
                <div className="relative opacity-50">
                  <div className="absolute -right-[23px] bg-gray-200 text-gray-400 w-6 h-6 rounded-full flex items-center justify-center border-4 border-white">
                    <Truck className="w-3 h-3" />
                  </div>
                  <h4 className="font-bold text-gray-900">في الطريق</h4>
                  <p className="text-sm text-gray-500">بانتظار المندوب</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-bold text-gray-800">معلومات العميل</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">أحمد محمد</h4>
                  <p className="text-sm text-gray-500">عميل مميز</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700" dir="ltr">+966 50 123 4567</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <span className="text-gray-700 leading-relaxed">
                    الرياض، حي الملقا<br />
                    شارع أنس بن مالك، مبنى 12<br />
                    شقة 4
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-bold text-gray-800">الدفع</h3>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">طريقة الدفع:</span>
                <span className="font-bold text-gray-900">بطاقة ائتمانية</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">الحالة:</span>
                <Badge variant="success">مدفوع</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
