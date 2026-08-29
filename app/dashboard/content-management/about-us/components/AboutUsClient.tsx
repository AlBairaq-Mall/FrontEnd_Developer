"use client";

import { useState, useTransition, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Plus, Search, Edit, Trash2, Loader2, ArrowRight } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { AboutUsForm } from "./AboutUsForm";
import { deleteAboutUs } from "@/lib/actions/about-us";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "react-hot-toast";
import Link from "next/link";

export function AboutUsClient({ aboutUsEntries }: { aboutUsEntries: any[] }) {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(searchQuery, 1000);
  const [isNavigating, startNavigation] = useTransition();

  useEffect(() => {
    if (debouncedSearch !== (searchParams.get("search") || "")) {
      const params = new URLSearchParams(searchParams.toString());
      if (debouncedSearch) {
        params.set("search", debouncedSearch);
      } else {
        params.delete("search");
      }
      params.set("page", "1");
      startNavigation(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    }
  }, [debouncedSearch]);

  const handleOpenAddModal = () => {
    setSelectedEntry(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (entry: any) => {
    setSelectedEntry(entry);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (entry: any) => {
    setSelectedEntry(entry);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedEntry) return;
    setIsDeleting(true);
    const res = await deleteAboutUs(selectedEntry.id);
    setIsDeleting(false);
    
    if (res.success) {
      toast.success("تم حذف البند بنجاح");
      setIsDeleteModalOpen(false);
      setSelectedEntry(null);
    } else {
      toast.error(res.error || "حدث خطأ أثناء الحذف");
    }
  };

  const handleFormSuccess = () => {
    setIsFormModalOpen(false);
    setSelectedEntry(null);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" dir="rtl">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/content-management"
            className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-brand hover:border-brand/50 transition-colors shadow-sm"
            title="العودة إلى إدارة المحتوى"
          >
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">من نحن</h1>
            <p className="text-gray-500 mt-1">إدارة الفقرات والتعريف بالشركة وعروضها.</p>
          </div>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة فقرة جديدة</span>
        </button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full" dir="rtl">
            <h3 className="text-lg font-bold text-gray-800">قائمة الفقرات</h3>
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="ابحث في العناوين أو المحتوى..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand w-full sm:w-64"
              />
              {isNavigating ? (
                <Loader2 className="w-4 h-4 text-brand absolute left-3 top-1/2 -translate-y-1/2 animate-spin" />
              ) : (
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              )}
            </div>
          </div>
        </CardHeader>
        <div className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>العنوان (العربية)</TableHead>
                <TableHead>العنوان (الإنجليزية)</TableHead>
                <TableHead>الوصف (العربية)</TableHead>
                <TableHead>الوصف (الإنجليزية)</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aboutUsEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                    لا توجد بيانات متاحة
                  </TableCell>
                </TableRow>
              ) : (
                aboutUsEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-bold text-gray-900 max-w-[150px] truncate">{entry.title_ar}</TableCell>
                    <TableCell className="text-gray-700 max-w-[150px] truncate" dir="ltr">{entry.title_en}</TableCell>
                    <TableCell className="text-gray-500 max-w-[300px] truncate">{entry.description_ar}</TableCell>
                    <TableCell className="text-gray-500 max-w-[300px] truncate" dir="ltr">{entry.description_en}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(entry)}
                          className="p-2 text-gray-400 hover:text-brand hover:bg-brand/10 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(entry)}
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
        title={selectedEntry ? "تعديل الفقرة" : "إضافة فقرة جديدة"}
      >
        <AboutUsForm
          initialData={selectedEntry}
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
          <p className="mb-6">
            هل أنت متأكد من رغبتك في حذف فقرة <strong>{selectedEntry?.title_ar}</strong>؟ لا يمكن التراجع عن هذا الإجراء.
          </p>
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
