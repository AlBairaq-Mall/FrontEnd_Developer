"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { DollarSign, ShoppingBag, Users, Activity } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Dashboard() {
  const stats = [
    {
      title: "إجمالي المبيعات",
      value: "45,231 ر.س",
      icon: DollarSign,
      color: "bg-blue-500",
    },
    {
      title: "الطلبات الجديدة",
      value: "124",
      icon: ShoppingBag,
      color: "bg-brand",
    },
    {
      title: "العملاء",
      value: "1,204",
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: "زيارات اليوم",
      value: "8,320",
      icon: Activity,
      color: "bg-orange-500",
    },
  ];

  const recentOrders = [
    { id: "ORD-001#", customer: "أحمد محمد", date: "منذ ساعتين", amount: "240.50 ر.س", status: "قيد التجهيز", statusVariant: "warning" as const },
    { id: "ORD-002#", customer: "أحمد محمد", date: "منذ ساعتين", amount: "240.50 ر.س", status: "قيد التجهيز", statusVariant: "warning" as const },
    { id: "ORD-003#", customer: "أحمد محمد", date: "منذ ساعتين", amount: "240.50 ر.س", status: "قيد التجهيز", statusVariant: "warning" as const },
    { id: "ORD-004#", customer: "أحمد محمد", date: "منذ ساعتين", amount: "240.50 ر.س", status: "قيد التجهيز", statusVariant: "warning" as const },
  ];

  const topProducts = [
    { name: "تفاح أحمر طازج", price: "12.5 ر.س", sold: 432 },
    { name: "تفاح أحمر طازج", price: "12.5 ر.س", sold: 432 },
    { name: "تفاح أحمر طازج", price: "12.5 ر.س", sold: 432 },
    { name: "تفاح أحمر طازج", price: "12.5 ر.س", sold: 432 },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <h3 className="text-lg font-bold text-gray-800">أحدث الطلبات</h3>
              <Link href="/orders" className="text-sm font-medium text-brand hover:text-brand-dark">
                عرض الكل
              </Link>
            </div>
          </CardHeader>
          <div className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الطلب</TableHead>
                  <TableHead>العميل</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>المبلغ</TableHead>
                  <TableHead>الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium text-gray-900">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell className="text-gray-500">{order.date}</TableCell>
                    <TableCell className="font-bold">{order.amount}</TableCell>
                    <TableCell>
                      <Badge variant={order.statusVariant}>{order.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Top Selling Products */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-bold text-gray-800">المنتجات الأكثر مبيعاً</h3>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {topProducts.map((product, i) => (
                <div key={i} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden relative">
                    {/* Placeholder for image */}
                    <div className="absolute inset-0 bg-gray-200"></div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">تم بيع {product.sold} مرة</p>
                  </div>
                  <div className="text-brand font-bold">
                    {product.price}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
