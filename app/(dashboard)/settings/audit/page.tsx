"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Search, ArrowRight, ShieldAlert, Activity, UserCog } from "lucide-react";
import Link from "next/link";

export default function AuditLogsPage() {
  const logs = [
    { id: 1, action: "تعديل صلاحيات", details: "تم تعديل صلاحيات (نورة الدعم) إلى (مدير مبيعات)", user: "حسان الإداري", ip: "192.168.1.15", date: "23 يونيو 2026, 14:30", type: "security" },
    { id: 2, action: "حذف منتج", details: "تم حذف المنتج (برتقال مصري - SKU: FRU-005)", user: "علي المستودع", ip: "10.0.0.45", date: "23 يونيو 2026, 11:15", type: "action" },
    { id: 3, action: "تسجيل دخول", details: "تم تسجيل الدخول بنجاح", user: "سالم المبيعات", ip: "172.16.0.5", date: "23 يونيو 2026, 08:00", type: "login" },
    { id: 4, action: "استرداد مبلغ", details: "تمت الموافقة على استرداد مبلغ 150 ر.س للطلب (ORD-105)", user: "حسان الإداري", ip: "192.168.1.15", date: "22 يونيو 2026, 16:45", type: "action" },
    { id: 5, action: "محاولة دخول فاشلة", details: "محاولة تسجيل دخول بكلمة مرور خاطئة (3 مرات)", user: "مجهول (admin@test.com)", ip: "45.33.22.11", date: "22 يونيو 2026, 03:20", type: "security" },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "security": return <ShieldAlert className="w-4 h-4 text-red-500" />;
      case "action": return <Activity className="w-4 h-4 text-blue-500" />;
      case "login": return <UserCog className="w-4 h-4 text-green-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/settings" className="p-2 text-gray-500 hover:text-brand hover:bg-brand/10 rounded-lg transition-colors">
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">سجل النظام (Audit Logs)</h1>
            <p className="text-gray-500 mt-1">تتبع كافة الإجراءات والأحداث الأمنية التي تتم داخل لوحة التحكم.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          <span>تصدير السجل</span>
        </button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <h3 className="text-lg font-bold text-gray-800">أحدث الإجراءات</h3>
            <div className="flex items-center gap-2">
              <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand">
                <option>كل الأحداث</option>
                <option>تنبيهات أمنية</option>
                <option>إجراءات الموظفين</option>
                <option>تسجيل الدخول</option>
              </select>
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث في السجل..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand w-full sm:w-64"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
        </CardHeader>
        <div className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الحدث</TableHead>
                <TableHead>التفاصيل</TableHead>
                <TableHead>المستخدم</TableHead>
                <TableHead>عنوان IP</TableHead>
                <TableHead>التاريخ والوقت</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getIcon(log.type)}
                      <span className={`font-bold ${log.type === 'security' ? 'text-red-600' : 'text-gray-900'}`}>{log.action}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 max-w-xs truncate" title={log.details}>
                    {log.details}
                  </TableCell>
                  <TableCell className="font-medium">{log.user}</TableCell>
                  <TableCell className="font-mono text-xs text-gray-500" dir="ltr">{log.ip}</TableCell>
                  <TableCell className="text-gray-500 text-sm">{log.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
