"use client";

import { Card, CardHeader } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Search, RefreshCcw, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default function RefundsPage() {
  const refunds = [
    { id: "REF-001", orderId: "ORD-105", customer: "أحمد محمد", amount: "150.00 ر.س", reason: "منتج تالف", status: "مكتمل", statusVariant: "success" as const, date: "22 يونيو 2026" },
    { id: "REF-002", orderId: "ORD-204", customer: "سارة عبد الله", amount: "45.00 ر.س", reason: "تأخير في التوصيل", status: "قيد المراجعة", statusVariant: "warning" as const, date: "23 يونيو 2026" },
    { id: "REF-003", orderId: "ORD-312", customer: "خالد فهد", amount: "20.00 ر.س", reason: "استبدال منتج", status: "مرفوض", statusVariant: "destructive" as const, date: "21 يونيو 2026" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">المدفوعات المستردة</h1>
          <p className="text-gray-500 mt-1">إدارة طلبات استرجاع الأموال والتعويضات للعملاء.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <h3 className="text-lg font-bold text-gray-800">سجل الاسترجاع</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث برقم الطلب أو العميل..."
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
                <TableHead>رقم المرجع</TableHead>
                <TableHead>رقم الطلب</TableHead>
                <TableHead>العميل</TableHead>
                <TableHead>المبلغ</TableHead>
                <TableHead>السبب</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {refunds.map((refund) => (
                <TableRow key={refund.id}>
                  <TableCell className="font-mono text-xs text-gray-500">{refund.id}</TableCell>
                  <TableCell>
                    <Link href={`/orders/${refund.orderId.replace('ORD-', '')}`} className="text-brand font-medium hover:underline">
                      {refund.orderId}
                    </Link>
                  </TableCell>
                  <TableCell className="font-bold text-gray-900">{refund.customer}</TableCell>
                  <TableCell className="font-bold text-red-600">{refund.amount}</TableCell>
                  <TableCell>{refund.reason}</TableCell>
                  <TableCell className="text-gray-500 text-sm">{refund.date}</TableCell>
                  <TableCell>
                    <Badge variant={refund.statusVariant}>{refund.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {refund.status === "قيد المراجعة" ? (
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors" title="قبول الاسترجاع">
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="رفض">
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">تمت المعالجة</span>
                    )}
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
