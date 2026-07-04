"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Plus, Search, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

export default function CategoriesPage() {
  const categories = [
    { id: "1", name: "الفواكه والخضروات", slug: "fruits-and-vegetables", productsCount: 120, status: "نشط", statusVariant: "success" as const },
    { id: "2", name: "اللحوم والدواجن", slug: "meat-and-poultry", productsCount: 45, status: "نشط", statusVariant: "success" as const },
    { id: "3", name: "الألبان والأجبان", slug: "dairy-and-cheese", productsCount: 80, status: "غير نشط", statusVariant: "destructive" as const },
    { id: "4", name: "المخبوزات", slug: "bakery", productsCount: 30, status: "نشط", statusVariant: "success" as const },
    { id: "5", name: "المشروبات", slug: "beverages", productsCount: 150, status: "نشط", statusVariant: "success" as const },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الأقسام</h1>
          <p className="text-gray-500 mt-1">إدارة الأقسام الرئيسية والفرعية للمنتجات.</p>
        </div>
        <button className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors">
          <Plus className="w-5 h-5" />
          <span>إضافة قسم جديد</span>
        </button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <h3 className="text-lg font-bold text-gray-800">قائمة الأقسام</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن قسم..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand w-full sm:w-64"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </CardHeader>
        <div className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>الرابط (Slug)</TableHead>
                <TableHead>عدد المنتجات</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-bold text-gray-900">{category.name}</TableCell>
                  <TableCell className="text-gray-500 text-sm">{category.slug}</TableCell>
                  <TableCell className="font-medium">{category.productsCount}</TableCell>
                  <TableCell>
                    <Badge variant={category.statusVariant}>{category.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-brand hover:bg-brand/10 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
