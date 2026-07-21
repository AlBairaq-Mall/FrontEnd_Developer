"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Eye, Plus } from "lucide-react";
import Link from "next/link";
import { getOrders, Order } from "@/lib/actions/orders";
import { CreateOrderModal } from "./components/CreateOrderModal";

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending": return "bg-yellow-100 text-yellow-700";
    case "confirmed": return "bg-blue-100 text-blue-700";
    case "processing": return "bg-purple-100 text-purple-700";
    case "shipped": return "bg-orange-100 text-orange-700";
    case "delivered": return "bg-green-100 text-green-700";
    case "cancelled": return "bg-red-100 text-red-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

const getStatusName = (status: string) => {
  switch (status) {
    case "pending": return "قيد الانتظار";
    case "confirmed": return "مؤكد";
    case "processing": return "قيد التجهيز";
    case "shipped": return "تم الشحن";
    case "delivered": return "تم التسليم";
    case "cancelled": return "ملغي";
    default: return status || "غير معروف";
  }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  async function loadOrders() {
    setLoading(true);
    const res = await getOrders();
    if (res.success && res.data) {
      // API might return array directly or wrapped in { data: ... }
      const dataArray = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setOrders(dataArray);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">إدارة الطلبات</h2>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="w-5 h-5" />
          إضافة طلب
        </Button>
      </div>

      <CreateOrderModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={() => {
          loadOrders();
        }}
      />

      <Card>
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
          <select className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand">
            <option>جميع الحالات</option>
            <option>قيد الانتظار</option>
            <option>مؤكد</option>
            <option>قيد التجهيز</option>
            <option>تم الشحن</option>
            <option>تم التسليم</option>
            <option>ملغي</option>
          </select>
          <div className="flex-1">
            <Input icon placeholder="ابحث برقم الطلب، العميل..." />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>رقم الطلب</TableHead>
              <TableHead>العميل</TableHead>
              <TableHead>التاريخ</TableHead>
              <TableHead>الإجمالي</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">جاري تحميل الطلبات...</TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">لا توجد طلبات لعرضها</TableCell>
              </TableRow>
            ) : (
              orders.map((order, i) => (
                <TableRow key={order.id || i}>
                  <TableCell className="font-bold text-gray-900">{order.order_number || `#${order.id}`}</TableCell>
                  <TableCell>{order.user?.name || order.user?.first_name || "عميل غير معروف"}</TableCell>
                  <TableCell className="text-gray-500">{new Date(order.created_at).toLocaleDateString("ar-SA")}</TableCell>
                  <TableCell className="font-bold">{order.total} ر.س</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold ${getStatusColor(order.status)}`}>
                      {getStatusName(order.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link href={`/dashboard/orders/${order.id}`} className="text-brand hover:text-brand-dark flex items-center gap-1 font-medium">
                      <Eye className="w-4 h-4" />
                      عرض
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
