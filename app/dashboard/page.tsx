"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { ShoppingBag, Users, Package, AlertTriangle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDashboardStats, DashboardStats } from "@/lib/actions/dashboard";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      setError(null);
      const res = await getDashboardStats();
      if (res.success && res.data) {
        setStats(res.data);
      } else {
        setError(res.error || "Failed to load stats");
      }
      setLoading(false);
    }
    loadStats();
  }, []);

  const cards = [
    {
      title: "إجمالي الطلبات",
      value: stats?.ordersCount,
      icon: ShoppingBag,
      color: "bg-blue-500",
    },
    {
      title: "إجمالي العملاء",
      value: stats?.customersCount,
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: "إجمالي المنتجات",
      value: stats?.productsCount,
      icon: Package,
      color: "bg-brand",
    },
  ];

  const salesData = [
    { name: 'السبت', sales: 4000 },
    { name: 'الأحد', sales: 3000 },
    { name: 'الإثنين', sales: 2000 },
    { name: 'الثلاثاء', sales: 2780 },
    { name: 'الأربعاء', sales: 1890 },
    { name: 'الخميس', sales: 2390 },
    { name: 'الجمعة', sales: 3490 },
  ];

  

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <Card key={i}>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
                {loading ? (
                  <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mt-1" />
                ) : error ? (
                  <span className="text-sm text-red-500 font-medium">فشل التحميل</span>
                ) : (
                  <h3 className="text-2xl font-bold text-gray-900">{card.value?.toLocaleString() ?? 0}</h3>
                )}
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="text-lg font-bold text-gray-800">اتجاهات المبيعات اليومية والأسبوعية والشهرية</h3>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#374151' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" name="المبيعات" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        {/* <Card>
          <CardHeader className="bg-red-50/50">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-lg font-bold">تنبيهات المخزون</h3>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {lowStockAlerts.map((item, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <span className="font-medium text-gray-900">{item.name}</span>
                  <Badge variant={item.statusVariant}>متبقي {item.stock}</Badge>
                </div>
              ))}
              <div className="p-4 text-center">
                <Link href="/inventory" className="text-sm font-medium text-brand hover:text-brand-dark">
                  إدارة المخزون &rarr;
                </Link>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Recent Orders */}
        {/* <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <h3 className="text-lg font-bold text-gray-800">أحدث الطلبات النشطة</h3>
              <Link href="/orders" className="text-sm font-medium text-brand hover:text-brand-dark">
                عرض كل الطلبات
              </Link>
            </div>
          </CardHeader>
          <div className="p-0 overflow-x-auto">
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
        </Card> */}
      </div>
    </div>
  );
}
