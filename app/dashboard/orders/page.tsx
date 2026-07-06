"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Input } from "@/components/ui/Input";
import { Eye } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  const orders = [
                    { id: "00000                ", customer: "محمد أحمد", date: "2026-06-14", total: "450 ر.س", status: "جديد", statusColor: "bg-blue-100 text-blue-700" },
                    // { id: "ORD-1002#", customer: "سارة خالد", date: "2026-06-14", total: "120 ر.س", status: "قيد التجهيز", statusColor: "bg-yellow-100 text-yellow-700" },
                    // { id: "ORD-1003#", customer: "عبدالله فهد", date: "2026-06-13", total: "890 ر.س", status: "خرج للتوصيل", statusColor: "bg-orange-100 text-orange-700" },
                    // { id: "ORD-1004#", customer: "نورة سعد", date: "2026-06-13", total: "55 ر.س", status: "تم التسليم", statusColor: "bg-green-100 text-green-700" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">إدارة الطلبات</h2>
      </div>

      <Card>
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
          <select className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand">
            <option>جميع الحالات</option>
            <option>جديد</option>
            <option>قيد التجهيز</option>
            <option>خرج للتوصيل</option>
            <option>تم التسليم</option>
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
            {orders.map((order, i) => (
              <TableRow key={i}>
                <TableCell className="font-bold text-gray-900">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell className="text-gray-500">{order.date}</TableCell>
                <TableCell className="font-bold">{order.total}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold ${order.statusColor}`}>
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Link href={`/orders/${order.id}`} className="text-brand hover:text-brand-dark flex items-center gap-1 font-medium">
                    <Eye className="w-4 h-4" />
                    عرض
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
