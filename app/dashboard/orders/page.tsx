"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Eye, Plus, Filter, Users, CreditCard, Truck } from "lucide-react";
import Link from "next/link";
import { getOrders, Order, getUsersList } from "@/lib/actions/orders";
import { CreateOrderModal } from "./components/CreateOrderModal";
import { Select } from "@/components/ui/Select";
import { Pagination } from "@/components/ui/Pagination";

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

function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentStatus = searchParams.get("status") || "";
  const currentPaymentStatus = searchParams.get("payment_status") || "";
  const currentUserId = searchParams.get("user_id") || "";
  const searchQuery = searchParams.get("search") || "";

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  async function loadOrders() {
    setLoading(true);
    const paramsObj = { per_page: "20", ...Object.fromEntries(searchParams.entries()) };
    const res = await getOrders(paramsObj);
    if (res.success && res.data) {
      // API might return array directly or wrapped in { data: ... }
      const dataArray = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setOrders(dataArray);
      setMeta(res.data.meta || null);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, [searchParams.toString()]);

  useEffect(() => {
    async function loadUsers() {
      const res = await getUsersList();
      if (res.success && res.data) {
        setUsers(res.data);
      }
    }
    loadUsers();
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
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row flex-wrap gap-4">
          <Select 
            icon={<Filter className="w-4 h-4" />}
            value={currentStatus}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            wrapperClassName="w-full sm:w-auto"
          >
            <option value="">حالة الطلب: الكل</option>
            <option value="pending">قيد الانتظار</option>
            <option value="confirmed">مؤكد</option>
            <option value="processing">قيد التجهيز</option>
            <option value="shipped">تم الشحن</option>
            <option value="delivered">تم التسليم</option>
            <option value="cancelled">ملغي</option>
          </Select>
          
          <Select 
            icon={<CreditCard className="w-4 h-4" />}
            value={currentPaymentStatus}
            onChange={(e) => handleFilterChange("payment_status", e.target.value)}
            wrapperClassName="w-full sm:w-auto"
          >
            <option value="">حالة الدفع: الكل</option>
            <option value="pending">معلق</option>
            <option value="paid">مدفوع</option>
            <option value="failed">فشل</option>
          </Select>

          <Select 
            icon={<Users className="w-4 h-4" />}
            value={currentUserId}
            onChange={(e) => handleFilterChange("user_id", e.target.value)}
            wrapperClassName="w-full sm:w-40"
          >
            <option value="">جميع العملاء</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name || u.first_name}</option>
            ))}
          </Select>

          <div className="flex-1 w-full sm:w-auto">
            <Input 
              icon 
              placeholder="ابحث برقم الطلب، العميل..." 
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange("search", e.target.value)}
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>رقم الطلب</TableHead>
              <TableHead>العميل</TableHead>
              <TableHead>التاريخ</TableHead>
              <TableHead>الإجمالي</TableHead>
              <TableHead>المندوب</TableHead>
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
                  <TableCell className="font-bold">{order.total} ر.ي</TableCell>
                  <TableCell>
                    {(() => {
                      const driverObj = order.delivery_driver || (order as any).driver;
                      return driverObj ? (
                        <div className="flex items-center gap-1 text-sm text-gray-700 font-medium">
                          <Truck className="w-4 h-4 text-brand" />
                          {driverObj.name || driverObj.first_name}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs bg-gray-50 px-2 py-1 rounded">لم يعين</span>
                      );
                    })()}
                  </TableCell>
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

      {meta && meta.last_page > 1 && <Pagination meta={meta} />}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">جاري تحميل الطلبات...</div>}>
      <OrdersContent />
    </Suspense>
  );
}
