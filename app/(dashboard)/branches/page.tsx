"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Plus, MapPin, Search, Edit, Power } from "lucide-react";

export default function BranchesPage() {
  const branches = [
    { id: 1, name: "فرع الملقا (الرئيسي)", city: "الرياض", zones: 5, status: "نشط", statusVariant: "success" as const },
    { id: 2, name: "فرع العليا", city: "الرياض", zones: 3, status: "نشط", statusVariant: "success" as const },
    { id: 3, name: "فرع النرجس", city: "الرياض", zones: 4, status: "نشط", statusVariant: "success" as const },
    { id: 4, name: "فرع الشاطئ", city: "جدة", zones: 2, status: "غير نشط", statusVariant: "destructive" as const },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الفروع ومناطق التوصيل</h1>
          <p className="text-gray-500 mt-1">إدارة فروع المتجر وتحديد مناطق ورسوم التوصيل لكل فرع.</p>
        </div>
        <button className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors">
          <Plus className="w-5 h-5" />
          <span>إضافة فرع جديد</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-brand/5 border-brand/10">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-brand mb-1">إجمالي الفروع النشطة</p>
              <h3 className="text-3xl font-bold text-gray-900">3</h3>
            </div>
            <MapPin className="w-10 h-10 text-brand opacity-20" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <h3 className="text-lg font-bold text-gray-800">قائمة الفروع</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن فرع..."
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
                <TableHead>اسم الفرع</TableHead>
                <TableHead>المدينة</TableHead>
                <TableHead>مناطق التوصيل (المغطاة)</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell className="font-bold text-gray-900">{branch.name}</TableCell>
                  <TableCell>{branch.city}</TableCell>
                  <TableCell className="font-medium text-brand">{branch.zones} مناطق</TableCell>
                  <TableCell>
                    <Badge variant={branch.statusVariant}>{branch.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-brand hover:bg-brand/10 rounded-md transition-colors" title="تعديل">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className={`p-1.5 rounded-md transition-colors ${branch.status === 'نشط' ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`} title="تغيير الحالة">
                        <Power className="w-4 h-4" />
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
