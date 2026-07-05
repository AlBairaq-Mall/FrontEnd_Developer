"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Plus, Search, Truck, Map, Wallet } from "lucide-react";

export default function DriversPage() {
  const drivers = [
    { id: 1, name: "عمر خالد", phone: "0501234567", branch: "فرع الملقا", activeOrders: 2, wallet: "350.00 ر.س", status: "متصل", statusVariant: "success" as const },
    { id: 2, name: "سعد عبد الرحمن", phone: "0507654321", branch: "فرع الملقا", activeOrders: 0, wallet: "0.00 ر.س", status: "غير متصل", statusVariant: "warning" as const },
    { id: 3, name: "محمد علي", phone: "0559988776", branch: "فرع العليا", activeOrders: 5, wallet: "1200.00 ر.س", status: "في الطريق", statusVariant: "success" as const },
    { id: 4, name: "فهد ناصر", phone: "0543322111", branch: "فرع النرجس", activeOrders: 0, wallet: "50.00 ر.س", status: "محظور", statusVariant: "destructive" as const },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">المندوبين</h1>
          <p className="text-gray-500 mt-1">إدارة فريق التوصيل، تتبعهم، ومتابعة محفظة الكاش لكل مندوب.</p>
        </div>
        <button className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors">
          <Plus className="w-5 h-5" />
          <span>إضافة مندوب جديد</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">المندوبين المتاحين الآن</p>
              <h3 className="text-3xl font-bold text-gray-900">12</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-500">
              <Truck className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">الطلبات قيد التوصيل</p>
              <h3 className="text-3xl font-bold text-gray-900">28</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
              <Map className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">إجمالي الكاش المعلق</p>
              <h3 className="text-3xl font-bold text-gray-900">1,600 ر.س</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
              <Wallet className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <h3 className="text-lg font-bold text-gray-800">قائمة المندوبين</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث بالاسم أو رقم الجوال..."
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
                <TableHead>اسم المندوب</TableHead>
                <TableHead>رقم الجوال</TableHead>
                <TableHead>الفرع المرتبط</TableHead>
                <TableHead>طلبات نشطة</TableHead>
                <TableHead>محفظة الكاش</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>تصفية / تتبع</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drivers.map((driver) => (
                <TableRow key={driver.id}>
                  <TableCell className="font-bold text-gray-900">{driver.name}</TableCell>
                  <TableCell dir="ltr" className="text-right text-gray-500">{driver.phone}</TableCell>
                  <TableCell>{driver.branch}</TableCell>
                  <TableCell className="font-medium">{driver.activeOrders}</TableCell>
                  <TableCell className={`font-bold ${driver.wallet === "0.00 ر.س" ? "text-gray-500" : "text-brand"}`}>
                    {driver.wallet}
                  </TableCell>
                  <TableCell>
                    <Badge variant={driver.statusVariant}>{driver.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-brand hover:bg-brand/10 rounded-md transition-colors" title="تتبع المندوب">
                        <Map className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors" title="تصفية المحفظة">
                        <Wallet className="w-4 h-4" />
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
