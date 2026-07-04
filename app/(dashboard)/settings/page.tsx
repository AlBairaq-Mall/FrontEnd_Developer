"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Plus, Search, Edit, Trash2, Shield, UserPlus } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const staff = [
    { id: 1, name: "حسان الإداري", email: "hassan@admin.com", role: "مدير عام", lastLogin: "منذ ساعتين", status: "نشط", statusVariant: "success" as const },
    { id: 2, name: "سالم المبيعات", email: "salem@sales.com", role: "موظف مبيعات", lastLogin: "منذ 5 ساعات", status: "نشط", statusVariant: "success" as const },
    { id: 3, name: "علي المستودع", email: "ali@inventory.com", role: "مدير مخزون", lastLogin: "أمس", status: "نشط", statusVariant: "success" as const },
    { id: 4, name: "نورة الدعم", email: "noura@support.com", role: "دعم فني", lastLogin: "منذ أسبوع", status: "غير نشط", statusVariant: "destructive" as const },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الإعدادات والأمان</h1>
          <p className="text-gray-500 mt-1">إدارة الموظفين، الأدوار والصلاحيات، وإعدادات النظام.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/settings/audit" className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Shield className="w-5 h-5" />
            <span>سجل النظام (Audit)</span>
          </Link>
          <button className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors">
            <UserPlus className="w-5 h-5" />
            <span>إضافة موظف</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-2">
          <button className="w-full text-right px-4 py-3 bg-brand/10 text-brand font-bold rounded-lg transition-colors">
            الموظفين والأدوار
          </button>
          <button className="w-full text-right px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
            إعدادات المتجر العامة
          </button>
          <button className="w-full text-right px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
            بوابات الدفع
          </button>
          <button className="w-full text-right px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
            طرق الشحن
          </button>
          <button className="w-full text-right px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
            الضرائب
          </button>
        </div>

        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                <h3 className="text-lg font-bold text-gray-800">قائمة الموظفين</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="ابحث عن موظف..."
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand w-full sm:w-64"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </CardHeader>
            <div className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم الموظف</TableHead>
                    <TableHead>البريد الإلكتروني</TableHead>
                    <TableHead>الدور (الصلاحيات)</TableHead>
                    <TableHead>آخر تسجيل دخول</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staff.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-bold text-gray-900">{user.name}</TableCell>
                      <TableCell className="text-gray-500">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="warning">{user.role}</Badge>
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm">{user.lastLogin}</TableCell>
                      <TableCell>
                        <Badge variant={user.statusVariant}>{user.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 text-gray-400 hover:text-brand hover:bg-brand/10 rounded-md transition-colors" title="تعديل">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="حذف">
                            <Trash2 className="w-4 h-4" />
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
      </div>
    </div>
  );
}
