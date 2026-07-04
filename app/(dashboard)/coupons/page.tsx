"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Plus, Search, Tag, Copy, Trash2, Power } from "lucide-react";

export default function CouponsPage() {
  const coupons = [
    { id: 1, code: "SUMMER20", discount: "20%", limit: 100, used: 45, expiry: "30 يونيو 2026", status: "نشط", statusVariant: "success" as const },
    { id: 2, code: "FREESHIP", discount: "توصيل مجاني", limit: 500, used: 480, expiry: "15 يوليو 2026", status: "نشط", statusVariant: "success" as const },
    { id: 3, code: "WELCOME10", discount: "10%", limit: 1000, used: 1000, expiry: "دائم", status: "مكتمل", statusVariant: "warning" as const },
    { id: 4, code: "EID50", discount: "50 ر.س", limit: 200, used: 50, expiry: "10 أبريل 2026", status: "منتهي", statusVariant: "destructive" as const },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الكوبونات والخصومات</h1>
          <p className="text-gray-500 mt-1">إنشاء وإدارة أكواد الخصم لزيادة المبيعات وتحفيز العملاء.</p>
        </div>
        <button className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors">
          <Plus className="w-5 h-5" />
          <span>إنشاء كوبون جديد</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">الكوبونات النشطة</p>
              <h3 className="text-3xl font-bold text-gray-900">2</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
              <Tag className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <h3 className="text-lg font-bold text-gray-800">قائمة الكوبونات</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث بكود الخصم..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand w-full sm:w-80"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </CardHeader>
        <div className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>كود الخصم</TableHead>
                <TableHead>قيمة الخصم</TableHead>
                <TableHead>الاستخدام</TableHead>
                <TableHead>تاريخ الانتهاء</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded border border-gray-200">{coupon.code}</span>
                      <button className="text-gray-400 hover:text-brand transition-colors" title="نسخ الكود">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-brand">{coupon.discount}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{coupon.used}</span>
                        <span>{coupon.limit}</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${coupon.used >= coupon.limit ? 'bg-red-500' : 'bg-brand'}`}
                          style={{ width: `${(coupon.used / coupon.limit) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500">{coupon.expiry}</TableCell>
                  <TableCell>
                    <Badge variant={coupon.statusVariant}>{coupon.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-md transition-colors" title="إيقاف">
                        <Power className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="حذف">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
