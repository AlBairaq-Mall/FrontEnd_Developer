"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Input } from "@/components/ui/Input";
import { Edit, Trash2, Ban, CheckCircle } from "lucide-react";

export default function CustomersPage() {
  const customers = [
    {
      name: "أحمد محمد",
      id: "CUST-1001",
      email: "ahmed@example.com",
      phone: "+966 50 123 4567",
      orders: "15 طلب",
      spent: "2500 ر.س",
      joinDate: "2023/8/14",
      status: "نشط",
      statusColor: "success" as const,
      avatarBg: "bg-green-100 text-green-700",
      initial: "أ",
    },
    {
      name: "سارة خالد",
      id: "CUST-1002",
      email: "sara@example.com",
      phone: "+966 55 987 6543",
      orders: "8 طلب",
      spent: "1200 ر.س",
      joinDate: "2023/3/21",
      status: "نشط",
      statusColor: "success" as const,
      avatarBg: "bg-green-100 text-green-700",
      initial: "س",
    },
    {
      name: "فهد عبدالله",
      id: "CUST-1003",
      email: "fahad@example.com",
      phone: "+966 54 321 0987",
      orders: "2 طلب",
      spent: "350 ر.س",
      joinDate: "2023/6/9",
      status: "نشط",
      statusColor: "success" as const,
      avatarBg: "bg-green-100 text-green-700",
      initial: "ف",
    },
    {
      name: "نورة علي",
      id: "CUST-1004",
      email: "noura@example.com",
      phone: "+966 56 456 7890",
      orders: "24 طلب",
      spent: "4800 ر.س",
      joinDate: "2022/11/4",
      status: "نشط",
      statusColor: "success" as const,
      avatarBg: "bg-green-100 text-green-700",
      initial: "ن",
    },
    {
      name: "عمر سعيد",
      id: "CUST-1005",
      email: "omar@example.com",
      phone: "+966 50 234 5678",
      orders: "0 طلب",
      spent: "0 ر.س",
      joinDate: "2024/1/1",
      status: "محظور",
      statusColor: "destructive" as const,
      avatarBg: "bg-red-100 text-red-700",
      initial: "ع",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">العملاء</h2>
        <p className="text-gray-500 mt-1">سجل العملاء وإدارة الحسابات (حظر/تفعيل).</p>
      </div>

      <Card>
        <div className="p-4 border-b border-gray-100">
          <div className="max-w-md">
            <Input icon placeholder="ابحث عن عميل بالاسم أو الجوال..." />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>العميل</TableHead>
              <TableHead>معلومات الاتصال</TableHead>
              <TableHead>الطلبات / الإنفاق</TableHead>
              <TableHead>تاريخ الانضمام</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${customer.avatarBg}`}>
                      {customer.initial}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="text-gray-500">{customer.email}</div>
                    <div className="text-gray-500 mt-1" dir="ltr">{customer.phone}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-600">
                    <div>{customer.orders}</div>
                    <div className="font-bold text-brand mt-1">{customer.spent}</div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-500 text-sm">
                  {customer.joinDate}
                </TableCell>
                <TableCell>
                  <Badge variant={customer.statusColor}>{customer.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {customer.status === "نشط" ? (
                      <button className="text-gray-400 hover:text-red-500 transition-colors" title="حظر العميل">
                        <Ban className="w-4 h-4" />
                      </button>
                    ) : (
                      <button className="text-gray-400 hover:text-green-500 transition-colors" title="تفعيل العميل">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button className="text-gray-400 hover:text-blue-500 transition-colors" title="تعديل">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-red-500 transition-colors" title="حذف">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
