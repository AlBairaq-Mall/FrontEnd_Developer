"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { DollarSign, Package, TrendingUp, CheckCircle } from "lucide-react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie
} from "recharts";
import { SalesReportData, OrdersReportData } from "@/lib/actions/reports";

// Status helpers
const getStatusColor = (status: string) => {
  switch (status) {
    case "pending": return "bg-yellow-50 text-yellow-700 border border-yellow-200";
    case "confirmed": return "bg-blue-50 text-blue-700 border border-blue-200";
    case "processing": return "bg-purple-50 text-purple-700 border border-purple-200";
    case "shipped": return "bg-orange-50 text-orange-700 border border-orange-200";
    case "delivered": return "bg-green-50 text-green-700 border border-green-200";
    case "cancelled": return "bg-red-50 text-red-700 border border-red-200";
    default: return "bg-gray-50 text-gray-700 border border-gray-200";
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

const STATUS_COLORS: Record<string, string> = {
  pending: "#eab308",    // Yellow
  confirmed: "#3b82f6",  // Blue
  processing: "#a855f7", // Purple
  shipped: "#f97316",    // Orange
  delivered: "#10b981",  // Emerald
  cancelled: "#ef4444",  // Red
};

interface SalesReportViewProps {
  salesData: SalesReportData | null;
  ordersData: OrdersReportData | null;
  fromDate: string;
  toDate: string;
}

export function SalesReportView({
  salesData,
  ordersData,
  fromDate,
  toDate,
}: SalesReportViewProps) {
  // Recharts Sales/Status breakdown data formatter
  const getChartData = () => {
    if (!ordersData) return [];
    return [
      { name: "قيد الانتظار", count: ordersData.pending, status: "pending" },
      { name: "مؤكد", count: ordersData.confirmed, status: "confirmed" },
      { name: "قيد التجهيز", count: ordersData.processing, status: "processing" },
      { name: "تم الشحن", count: ordersData.shipped, status: "shipped" },
      { name: "تم التسليم", count: ordersData.delivered, status: "delivered" },
      { name: "ملغي", count: ordersData.cancelled, status: "cancelled" },
    ];
  };

  const getPieData = () => {
    const data = getChartData();
    return data.filter((item) => item.count > 0).map((item) => ({
      name: item.name,
      value: item.count,
      status: item.status,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">إجمالي المبيعات</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {salesData?.total_sales.toLocaleString("ar-SA") || 0} ر.ي
              </h3>
              <p className="text-xs text-gray-400 mt-1">يستثني الطلبات الملغاة</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-emerald-600 bg-emerald-50 shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">إجمالي عدد الطلبات</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {salesData?.total_orders.toLocaleString("ar-SA") || 0} طلب
              </h3>
              <p className="text-xs text-gray-400 mt-1">خلال الفترة المحددة</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 bg-blue-50 shrink-0">
              <Package className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">صافي قيمة الطلبات</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {ordersData?.total_amount.toLocaleString("ar-SA") || 0} ر.ي
              </h3>
              <p className="text-xs text-gray-400 mt-1">القيمة الإجمالية للطلبات  </p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-purple-600 bg-purple-50 shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">معدل تسليم الطلبات</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {ordersData && ordersData.total_orders > 0
                  ? `${Math.round((ordersData.delivered / ordersData.total_orders) * 100)}%`
                  : "0%"}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {ordersData?.delivered || 0} طلب من إجمالي {ordersData?.total_orders || 0}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-indigo-600 bg-indigo-50 shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="p-4 border-b">
            <h3 className="text-base font-bold text-gray-800">توزيع حالات الطلبات (بالعدد)</h3>
          </CardHeader>
          <CardContent className="p-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getChartData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6b7280" }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    textAlign: "right",
                  }}
                  labelStyle={{ fontWeight: "bold", color: "#374151" }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} name="عدد الطلبات">
                  {getChartData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || "#6b7280"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader className="p-4 border-b">
            <h3 className="text-base font-bold text-gray-800">نسبة الحالات من الإجمالي</h3>
          </CardHeader>
          <CardContent className="p-4 h-80 flex flex-col justify-center items-center">
            {getPieData().length > 0 ? (
              <div className="w-full h-full relative">
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie
                      data={getPieData()}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {getPieData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || "#6b7280"} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        textAlign: "right",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Summary indicator */}
                <div className="absolute top-[41%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className="text-xs text-gray-400 block">إجمالي الحالات</span>
                  <span className="text-lg font-bold text-gray-800">{ordersData?.total_orders || 0}</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 space-y-2 py-10">
                <Package className="w-10 h-10 mx-auto text-gray-300" />
                <p className="text-sm">لا توجد حالات طلبات لعرضها</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown Table */}
      <Card>
        <CardHeader className="p-4 border-b flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-800">جدول تفصيلي لحالات الطلبات</h3>
          <span className="text-xs text-gray-400">الفترة: من {fromDate || "الكل"} إلى {toDate || "الكل"}</span>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الحالة</TableHead>
                <TableHead>الاسم بالعربية</TableHead>
                <TableHead className="text-center">عدد الطلبات</TableHead>
                <TableHead className="text-center">نسبة المساهمة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getChartData().map((row, i) => {
                const total = ordersData?.total_orders || 0;
                const percentage = total > 0 ? Math.round((row.count / total) * 100) : 0;
                return (
                  <TableRow key={i}>
                    <TableCell className="font-semibold text-gray-900 uppercase">{row.status}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
                        {row.name}
                      </span>
                    </TableCell>
                    <TableCell className="text-center font-semibold text-gray-900">{row.count}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 bg-gray-100 h-2 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: STATUS_COLORS[row.status],
                            }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-gray-700">{percentage}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
