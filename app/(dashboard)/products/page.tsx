"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Edit, Trash2, Plus, Eye } from "lucide-react";
import Link from "next/link";

export default function ProductsPage() {
  const products = [
    { id: "1", name: "تفاح أحمر طازج", price: "12.5 ر.س", stock: "145 قطعة", status: "نشط", statusColor: "success" as const },
    { id: "2", name: "حليب طازج 1 لتر", price: "5 ر.س", stock: "145 قطعة", status: "نشط", statusColor: "success" as const },
    { id: "3", name: "خبز أبيض شرائح", price: "4.5 ر.س", stock: "145 قطعة", status: "نشط", statusColor: "success" as const },
    { id: "4", name: "عصير برتقال طبيعي", price: "8 ر.س", stock: "145 قطعة", status: "نشط", statusColor: "success" as const },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">إدارة المنتجات</h2>
        <Link href="/products/new">
          <Button className="gap-2">
            <Plus className="w-5 h-5" />
            إضافة منتج جديد
          </Button>
        </Link>
      </div>

      <Card>
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
          <select className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand min-w-[150px]">
            <option>جميع الأقسام</option>
            <option>خضار وفواكه</option>
            <option>ألبان وأجبان</option>
            <option>مخبوزات</option>
            <option>مشروبات</option>
          </select>
          <div className="flex-1">
            <Input icon placeholder="ابحث عن منتج..." />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>المنتج</TableHead>
              <TableHead>السعر</TableHead>
              <TableHead>المخزون</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-gray-100 shrink-0 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gray-200"></div>
                    </div>
                    <span className="font-bold text-gray-900">{product.name}</span>
                  </div>
                </TableCell>
                <TableCell className="font-bold">{product.price}</TableCell>
                <TableCell className="text-gray-500">{product.stock}</TableCell>
                <TableCell>
                  <Badge variant={product.statusColor}>{product.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Link href={`/products/${product.id}`} className="text-brand hover:text-brand-dark transition-colors" title="عرض التفاصيل">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link href={`/products/${product.id}/edit`} className="text-blue-500 hover:text-blue-700 transition-colors" title="تعديل">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button className="text-red-500 hover:text-red-700 transition-colors" title="حذف">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
