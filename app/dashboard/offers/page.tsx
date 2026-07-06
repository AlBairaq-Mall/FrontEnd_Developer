"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Plus, Search, Percent, Edit, Trash2, Power } from "lucide-react";
import Image from "next/image";

export default function OffersPage() {
  const offers = [
    { id: 1, product: "قهوة", image: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=100&q=80", discount: "20%", startDate: "1  2026", endDate: "30  2026", status: "نشط", statusVariant: "success" as const },
    ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">عروض المنتجات</h1>
          <p className="text-gray-500 mt-1">إدارة العروض الخاصة وتخفيضات المنتجات وتحديد فترات سريانها.</p>
        </div>
        <button className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors">
          <Plus className="w-5 h-5" />
          <span>إضافة عرض جديد</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">العروض النشطة</p>
              <h3 className="text-3xl font-bold text-gray-900">2</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
              <Percent className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <h3 className="text-lg font-bold text-gray-800">قائمة العروض</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن منتج..."
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
                <TableHead>المنتج</TableHead>
                <TableHead>نسبة الخصم</TableHead>
                <TableHead>تاريخ البداية</TableHead>
                <TableHead>تاريخ النهاية</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offers.map((offer) => (
                <TableRow key={offer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden relative shrink-0">
                        <Image src={offer.image} alt={offer.product} fill className="object-cover" />
                      </div>
                      <span className="font-medium text-gray-900">{offer.product}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-brand bg-brand/10 px-2 py-1 rounded-md">{offer.discount}</span>
                  </TableCell>
                  <TableCell className="text-gray-500">{offer.startDate}</TableCell>
                  <TableCell className="text-gray-500">{offer.endDate}</TableCell>
                  <TableCell>
                    <Badge variant={offer.statusVariant}>{offer.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="تعديل">
                        <Edit className="w-4 h-4" />
                      </button>
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
