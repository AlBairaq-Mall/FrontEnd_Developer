"use client";

import { useEffect, useState, use } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Printer, ArrowRight, Truck, CheckCircle2, AlertCircle, Phone, MapPin, User, Package } from "lucide-react";
import Link from "next/link";
import { getOrder, Order, updateOrderStatus, assignDeliveryDriver, getDeliveryDrivers } from "@/lib/actions/orders";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending": return <Badge variant="warning">قيد الانتظار</Badge>;
    case "confirmed": return <Badge variant="info">مؤكد</Badge>;
    case "processing": return <Badge variant="warning">قيد التجهيز</Badge>;
    case "shipped": return <Badge variant="info">تم الشحن</Badge>;
    case "delivered": return <Badge variant="success">تم التسليم</Badge>;
    case "cancelled": return <Badge variant="danger">ملغي</Badge>;
    default: return <Badge variant="default">{status}</Badge>;
  }
};

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [assigningDriver, setAssigningDriver] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    setUpdatingStatus(true);
    const res = await updateOrderStatus(order.id, newStatus);
    if (res.success) {
      setOrder({ ...order, status: newStatus as any });
    } else {
      alert(res.error || "فشل تحديث الحالة");
    }
    setUpdatingStatus(false);
  };

  const handleAssignDriver = async (driverId: string) => {
    if (!order || !driverId) return;
    setAssigningDriver(true);
    const res = await assignDeliveryDriver(order.id, driverId);
    if (res.success) {
      const assignedDriver = drivers.find(d => d.id.toString() === driverId);
      setOrder({ ...order, delivery_driver_id: parseInt(driverId), delivery_driver: assignedDriver });
    } else {
      alert(res.error || "فشل تعيين المندوب");
    }
    setAssigningDriver(false);
  };

  useEffect(() => {
    async function loadOrder() {
      const [orderRes, driversRes] = await Promise.all([
        getOrder(orderId),
        getDeliveryDrivers()
      ]);

      if (orderRes.success && orderRes.data) {
        const data = orderRes.data.data || orderRes.data;
        setOrder(data);
      }

      if (driversRes.success) {
        setDrivers(driversRes.data);
      }

      setLoading(false);
    }
    loadOrder();
  }, [orderId]);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">جاري تحميل تفاصيل الطلب...</div>;
  }

  if (!order) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900">الطلب غير موجود</h2>
        <Link href="/dashboard/orders" className="text-brand hover:underline">العودة للطلبات</Link>
      </div>
    );
  }

  const orderItems = order.items || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/orders" className="p-2 text-gray-500 hover:text-brand hover:bg-brand/10 rounded-lg transition-colors print:hidden">
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">طلب #{order.order_number || order.id}</h1>
              {getStatusBadge(order.status)}
            </div>
            <p className="text-gray-500 mt-1">تم الإنشاء في {new Date(order.created_at).toLocaleString("ar-SA")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 print:hidden">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Printer className="w-5 h-5" />
            <span>طباعة الفاتورة</span>
          </button>
          <div className="relative">
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updatingStatus}
              className="appearance-none bg-brand text-white px-4 py-2 pl-4 pr-10 rounded-lg hover:bg-brand-dark transition-colors outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm w-40"
            >
              <option value="pending" className="text-gray-900 bg-white">قيد الانتظار</option>
              <option value="confirmed" className="text-gray-900 bg-white">مؤكد</option>
              <option value="processing" className="text-gray-900 bg-white">قيد التجهيز</option>
              <option value="shipped" className="text-gray-900 bg-white">تم الشحن</option>
              <option value="delivered" className="text-gray-900 bg-white">تم التسليم</option>
              <option value="cancelled" className="text-gray-900 bg-white">ملغي</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-white">
              {updatingStatus ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:flex print:flex-col">
        <div className="lg:col-span-2 space-y-6 print:w-full">
          <Card className="print:shadow-none print:border-none print:m-0 print:p-0">
            <CardHeader className="print:px-0">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Package className="w-5 h-5" />
                منتجات الطلب
              </h3>
            </CardHeader>
            <div className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المنتج</TableHead>
                    <TableHead>السعر</TableHead>
                    <TableHead>الكمية</TableHead>
                    <TableHead>المجموع</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-gray-500">لا توجد منتجات</TableCell>
                    </TableRow>
                  ) : (
                    orderItems.map((item, index) => (
                      <TableRow key={item.id || index}>
                        <TableCell className="font-bold text-gray-900">
                          {item.product?.name_ar || item.product?.name_en || item.product?.name || item.product?.title || `منتج #${item.product_id}`}
                          {item.unit && <span className="text-gray-500 text-xs mr-2 font-normal">({item.unit?.name_ar || item.unit?.name})</span>}
                        </TableCell>
                        <TableCell>{item.price} ر.س</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell className="font-bold">{item.total || (item.price * item.quantity)} ر.س</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <CardContent className="bg-gray-50 flex justify-end">
              <div className="w-64 space-y-3 mt-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>المجموع الفرعي:</span>
                  <span>{order.subtotal || 0} ر.س</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>رسوم التوصيل:</span>
                  <span>{order.delivery_fee || 0} ر.س</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm text-red-600">
                    <span>الخصم:</span>
                    <span>-{order.discount} ر.س</span>
                  </div>
                )}
                <div className="pt-3 border-t border-gray-200 flex justify-between font-bold text-lg text-gray-900">
                  <span>الإجمالي:</span>
                  <span>{order.total || 0} ر.س</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {order.notes && (
            <Card className="print:hidden">
              <CardHeader>
                <h3 className="text-lg font-bold text-gray-800">الملاحظات</h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{order.notes}</p>
              </CardContent>
            </Card>
          )}

          <Card className="print:hidden">
            <CardHeader>
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                حالة التوصيل
              </h3>
            </CardHeader>
            <CardContent>
              <div className="mb-6 pb-6 border-b border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">مندوب التوصيل</label>
                <div className="flex gap-2">
                  <select
                    className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent disabled:opacity-50"
                    value={order.delivery_driver_id?.toString() || (order as any).driver_id?.toString() || order.delivery_driver?.id?.toString() || (order as any).driver?.id?.toString() || ""}
                    onChange={(e) => handleAssignDriver(e.target.value)}
                    disabled={assigningDriver || drivers.length === 0}
                  >
                    <option value="">تعيين مندوب توصيل...</option>
                    {drivers.map(driver => (
                      <option key={driver.id} value={driver.id}>{driver.name || driver.first_name}</option>
                    ))}
                  </select>
                  {assigningDriver && <div className="flex items-center justify-center px-2"><div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin"></div></div>}
                </div>
                {(() => {
                  const assignedDriverObj = order.delivery_driver || (order as any).driver || drivers.find(d =>
                    d.id.toString() === order.delivery_driver_id?.toString() ||
                    d.id.toString() === (order as any).driver_id?.toString()
                  );
                  return assignedDriverObj ? (
                    <div className="mt-3 text-sm flex items-center gap-2 text-gray-600 bg-gray-50 p-3 rounded-lg">
                      <Truck className="w-4 h-4 text-brand" />
                      <span>المندوب الحالي: <strong className="text-gray-900">{assignedDriverObj.name || assignedDriverObj.first_name}</strong></span>
                      {assignedDriverObj.phone && <span dir="ltr" className="text-gray-500">({assignedDriverObj.phone})</span>}
                    </div>
                  ) : null;
                })()}
              </div>
              <div className="relative pl-8 border-r-2 border-gray-100 pr-4 space-y-8">
                <div className={`relative ${["pending"].includes(order.status) ? "opacity-100" : "opacity-50"}`}>
                  <div className="absolute -right-[23px] bg-brand text-white w-6 h-6 rounded-full flex items-center justify-center border-4 border-white">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <h4 className="font-bold text-gray-900">تم استلام الطلب</h4>
                  <p className="text-sm text-gray-500">تم تسجيل الطلب في النظام</p>
                </div>
                <div className={`relative ${["processing", "confirmed"].includes(order.status) ? "opacity-100" : "opacity-50"}`}>
                  <div className="absolute -right-[23px] bg-yellow-400 text-white w-6 h-6 rounded-full flex items-center justify-center border-4 border-white">
                    <AlertCircle className="w-3 h-3" />
                  </div>
                  <h4 className="font-bold text-gray-900">قيد التجهيز</h4>
                  <p className="text-sm text-gray-500">جاري تجهيز المنتجات</p>
                </div>
                <div className={`relative ${["shipped", "delivered"].includes(order.status) ? "opacity-100" : "opacity-50"}`}>
                  <div className="absolute -right-[23px] bg-gray-200 text-gray-400 w-6 h-6 rounded-full flex items-center justify-center border-4 border-white">
                    <Truck className="w-3 h-3" />
                  </div>
                  <h4 className="font-bold text-gray-900">في الطريق / تم التسليم</h4>
                  <p className="text-sm text-gray-500">تم تسليم الطلب أو بانتظار المندوب</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 print:hidden">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-bold text-gray-800">معلومات العميل</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{order.user?.name || order.user?.first_name || "عميل غير معروف"}</h4>
                  <p className="text-sm text-gray-500">{order.user?.email || "لا يوجد بريد"}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700" dir="ltr">{order.user?.phone || order.location?.phone || "غير متوفر"}</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <span className="text-gray-700 leading-relaxed">
                    {order.location?.address || "عنوان غير متوفر"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {(() => {
            const assignedDriverObj = order.delivery_driver || (order as any).driver || drivers.find(d => 
              d.id.toString() === order.delivery_driver_id?.toString() || 
              d.id.toString() === (order as any).driver_id?.toString()
            );
            
            if (!assignedDriverObj) return null;
            
            return (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-bold text-gray-800">معلومات المندوب</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{assignedDriverObj.name || assignedDriverObj.first_name}</h4>
                      <p className="text-sm text-gray-500">مندوب توصيل</p>
                    </div>
                  </div>
                  {(assignedDriverObj.phone || assignedDriverObj.email) && (
                    <div className="pt-4 border-t border-gray-100 space-y-3">
                      {assignedDriverObj.phone && (
                        <div className="flex items-center gap-3 text-sm">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700" dir="ltr">{assignedDriverObj.phone}</span>
                        </div>
                      )}
                      {assignedDriverObj.email && (
                        <div className="flex items-center gap-3 text-sm">
                          <span className="w-4 h-4 flex items-center justify-center text-gray-400 font-bold">@</span>
                          <span className="text-gray-700">{assignedDriverObj.email}</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })()}

          <Card>
            <CardHeader>
              <h3 className="text-lg font-bold text-gray-800">الدفع</h3>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">طريقة الدفع:</span>
                <span className="font-bold text-gray-900">{order.payment_method === "cash" ? "الدفع عند الاستلام" : "البطاقة الائتمانية"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">الحالة:</span>
                {order.payment_status === "paid" ? (
                  <Badge variant="success">مدفوع</Badge>
                ) : order.payment_status === "failed" ? (
                  <Badge variant="danger">فشل الدفع</Badge>
                ) : (
                  <Badge variant="warning">معلق</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
