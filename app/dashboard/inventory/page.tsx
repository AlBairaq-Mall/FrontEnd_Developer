"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Search, History, ArrowDownToLine, ArrowUpFromLine, AlertTriangle } from "lucide-react";

export default function InventoryPage() {
  const inventoryItems = [
    { id: "1", name: "تفاح أحمر طازج", sku: "FRU-001", stock: 150, safetyLimit: 50, status: "متوفر", statusVariant: "success" as const },
    { id: "2", name: "عصير برتقال طبيعي", sku: "BEV-042", stock: 5, safetyLimit: 20, status: "منخفض", statusVariant: "destructive" as const },
    { id: "3", name: "لحم عجل مفروم", sku: "MEA-015", stock: 45, safetyLimit: 30, status: "متوفر", statusVariant: "success" as const },
    { id: "4", name: "خبز أسمر للدايت", sku: "BAK-008", stock: 12, safetyLimit: 15, status: "منخفض", statusVariant: "warning" as const },
    { id: "5", name: "حليب طازج 1 لتر", sku: "DAI-001", stock: 0, safetyLimit: 20, status: "نفذ", statusVariant: "destructive" as const },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">المخزون</h1>
          <p className="text-gray-500 mt-1">تتبع كميات المنتجات، حدود الأمان، وسجل الحركات.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <History className="w-5 h-5" />
            <span>سجل الحركات</span>
          </button>
          <button className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors">
            <ArrowUpFromLine className="w-5 h-5" />
            <span>تحديث الكميات</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-brand/5 border-brand/10">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-brand mb-1">إجمالي المنتجات</p>
                <h3 className="text-3xl font-bold text-gray-900">1,240</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-100">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-red-600 mb-1">عناصر منخفضة المخزون</p>
                <h3 className="text-3xl font-bold text-gray-900">15</h3>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 border-orange-100">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-orange-600 mb-1">عناصر نفذت (Out of Stock)</p>
                <h3 className="text-3xl font-bold text-gray-900">3</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <h3 className="text-lg font-bold text-gray-800">مراقبة المخزون</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث برقم SKU أو اسم المنتج..."
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
                <TableHead>رمز المنتج (SKU)</TableHead>
                <TableHead>المنتج</TableHead>
                <TableHead>الكمية الحالية</TableHead>
                <TableHead>حد الأمان</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>تعديل سريع</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs text-gray-500">{item.sku}</TableCell>
                  <TableCell className="font-bold text-gray-900">{item.name}</TableCell>
                  <TableCell>
                    <span className={`font-bold ${item.stock <= item.safetyLimit ? 'text-red-600' : 'text-gray-900'}`}>
                      {item.stock}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-500">{item.safetyLimit}</TableCell>
                  <TableCell>
                    <Badge variant={item.statusVariant}>{item.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="سحب">
                        <ArrowDownToLine className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-brand hover:bg-brand/10 rounded-md transition-colors" title="إضافة">
                        <ArrowUpFromLine className="w-4 h-4" />
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
