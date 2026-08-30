"use client";

import { useState, useTransition, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Plus, Search, Tag, Copy, Trash2, Edit, Eye, Loader2 } from "lucide-react";
import { CouponForm } from "./CouponForm";
import { deleteCoupon } from "@/lib/actions/coupons";
import { Select } from "@/components/ui/Select";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce";
import { toast, Toaster } from "react-hot-toast";

export function CouponsClient({ couponsData }: { couponsData: any[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(searchTerm, 2000);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  const [isPending, startTransition] = useTransition();
  const [isNavigating, startNavigation] = useTransition();

  const currentStatus = searchParams.get("status") || "";
  const currentType = searchParams.get("type") || "";

  useEffect(() => {
    if (debouncedSearch.length >= 3 || debouncedSearch.length === 0) {
      if (debouncedSearch !== (searchParams.get("search") || "")) {
        handleFilterChange("search", debouncedSearch);
      }
    }
  }, [debouncedSearch]);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    startNavigation(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleOpenCreate = () => {
    setEditingCoupon(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (coupon: any) => {
    setEditingCoupon(coupon);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string | number) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الكوبون؟")) return;

    startTransition(async () => {
      const result = await deleteCoupon(id);
      if (result.success) {
        toast.success("تم حذف الكوبون بنجاح");
      } else {
        toast.error(result.error || "فشل في حذف الكوبون");
      }
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const activeCount = couponsData.filter(c => c.is_active).length;

  return (
    <div className="space-y-6">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الكوبونات والخصومات</h1>
          <p className="text-gray-500 mt-1">إنشاء وإدارة أكواد الخصم لزيادة المبيعات وتحفيز العملاء.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>إنشاء كوبون جديد</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">الكوبونات النشطة</p>
              <h3 className="text-3xl font-bold text-gray-900">{activeCount}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
              <Tag className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <h3 className="text-lg font-bold text-gray-800">قائمة الكوبونات</h3>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Select
                value={currentStatus}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full sm:w-40"
              >
                <option value="">كل الحالات</option>
                <option value="1">نشط</option>
                <option value="0">غير نشط</option>
              </Select>

              <Select
                value={currentType}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                className="w-full sm:w-40"
              >
                <option value="">كل الأنواع</option>
                <option value="percentage">نسبة مئوية</option>
                <option value="fixed">مبلغ ثابت</option>
              </Select>

              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="ابحث بكود الخصم..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand w-full"
                />
                {isNavigating ? (
                  <Loader2 className="w-4 h-4 text-brand absolute left-3 top-1/2 -translate-y-1/2 animate-spin" />
                ) : (
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <div className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>كود الخصم</TableHead>
                <TableHead>قيمة الخصم</TableHead>
                <TableHead>الاستخدام</TableHead>
                <TableHead>تاريخ الانتهاء</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {couponsData.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded border border-gray-200">{coupon.code}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(coupon.code);
                          toast.success("تم نسخ الكود بنجاح");
                        }}
                        className="text-gray-400 hover:text-brand transition-colors"
                        title="نسخ الكود"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-brand">
                    {coupon.type === 'percentage' ? `%${coupon.value}` : `${coupon.value} ر.ي`}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 w-32">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{coupon.used_count || 0}</span>
                        <span>{coupon.usage_limit}</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${((coupon.used_count || 0) >= coupon.usage_limit) ? 'bg-red-500' : 'bg-brand'}`}
                          style={{ width: `${Math.min(((coupon.used_count || 0) / coupon.usage_limit) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {coupon.end_date ? new Date(coupon.end_date).toLocaleDateString('ar-SA') : 'دائم'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={coupon.is_active ? "success" : "destructive"}>
                      {coupon.is_active ? "نشط" : "غير نشط"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/coupons/${coupon.id}`}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="عرض التفاصيل"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleOpenEdit(coupon)}
                        className="p-1.5 text-gray-400 hover:text-brand hover:bg-brand/10 rounded-md transition-colors"
                        title="تعديل"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        disabled={isPending}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {couponsData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    لا يوجد كوبونات.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCoupon ? "تعديل كوبون" : "إنشاء كوبون جديد"}
      >
        <CouponForm
          initialData={editingCoupon}
          onSuccess={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
