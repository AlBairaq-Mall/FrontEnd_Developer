"use client";

import { useState, useTransition, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Plus, Search, Edit, Trash2, Eye, Filter, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { UnitForm } from "./UnitForm";
import { deleteUnit } from "@/lib/actions/units";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";

export function UnitsClient({ units }: { units: any[] }) {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(searchQuery, 2000);
  const [isNavigating, startNavigation] = useTransition();

  const currentStatus = searchParams.get("status") || "";

  useEffect(() => {
    if (debouncedSearch.length >= 3 || debouncedSearch.length === 0) {
      if (debouncedSearch !== (searchParams.get("search") || "")) {
        handleFilterChange("search", debouncedSearch);
      }
    }
  }, [debouncedSearch]);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
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

  const handleOpenAddModal = () => {
    setSelectedUnit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (unit: any) => {
    setSelectedUnit(unit);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (unit: any) => {
    setSelectedUnit(unit);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedUnit) return;
    setIsDeleting(true);
    const res = await deleteUnit(selectedUnit.id);
    setIsDeleting(false);
    if (res.success) {
      setIsDeleteModalOpen(false);
      setSelectedUnit(null);
    } else {
      alert(res.error || "حدث خطأ أثناء الحذف");
    }
  };

  const handleFormSuccess = () => {
    setIsFormModalOpen(false);
    setSelectedUnit(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الوحدات</h1>
          <p className="text-gray-500 mt-1">إدارة وحدات القياس للمنتجات.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة وحدة جديدة</span>
        </button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <h3 className="text-lg font-bold text-gray-800">قائمة الوحدات</h3>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Select
                icon={<Filter className="w-4 h-4" />}
                value={currentStatus}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                wrapperClassName="w-full sm:w-auto"
              >
                <option value="">جميع الحالات</option>
                <option value="1">نشط</option>
                <option value="0">غير نشط</option>
              </Select>
              <div className="relative w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="ابحث عن وحدة..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand w-full sm:w-64"
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
                <TableHead>الاسم (العربية)</TableHead>
                <TableHead>الاسم (الإنجليزية)</TableHead>
                <TableHead>الرمز (Symbol)</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {units.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                    لا توجد وحدات
                  </TableCell>
                </TableRow>
              ) : (
                units.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell className="font-bold text-gray-900">{unit.name_ar}</TableCell>
                    <TableCell className="text-gray-700">{unit.name_en}</TableCell>
                    <TableCell className="text-gray-500">{unit.symbol || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={unit.status ? "success" : "destructive"}>
                        {unit.status ? "نشط" : "غير نشط"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/units/${unit.id}`}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleOpenEditModal(unit)}
                          className="p-2 text-gray-400 hover:text-brand hover:bg-brand/10 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(unit)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedUnit ? "تعديل وحدة" : "إضافة وحدة جديدة"}
      >
        <UnitForm
          initialData={selectedUnit}
          onSuccess={handleFormSuccess}
          onCancel={() => setIsFormModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="تأكيد الحذف"
      >
        <div className="p-4" dir="rtl">
          <p className="mb-6">هل أنت متأكد من رغبتك في حذف الوحدة <strong>{selectedUnit?.name_ar}</strong>؟ لا يمكن التراجع عن هذا الإجراء.</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isDeleting ? "جاري الحذف..." : "حذف"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
