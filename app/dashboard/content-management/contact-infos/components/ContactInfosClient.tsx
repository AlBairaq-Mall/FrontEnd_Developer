"use client";

import { useState, useTransition, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { Plus, Search, Edit, Trash2, Filter, Loader2, ArrowRight } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { ContactInfoForm } from "./ContactInfoForm";
import { deleteContactInfo } from "@/lib/actions/contact-infos";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "react-hot-toast";
import Link from "next/link";

const CONTACT_TYPES_MAP: Record<string, { label: string; variant: "success" | "warning" | "danger" | "destructive" | "info" | "default" }> = {
  phone: { label: "هاتف محمول", variant: "default" },
  telephone: { label: "هاتف ثابت", variant: "default" },
  whatsapp: { label: "واتساب", variant: "success" },
  email: { label: "بريد إلكتروني", variant: "info" },
  website: { label: "موقع إلكتروني", variant: "info" },
  location: { label: "موقع جغرافي", variant: "warning" },
  other: { label: "أخرى", variant: "default" },
};

export function ContactInfosClient({ contactInfos }: { contactInfos: any[] }) {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(searchQuery, 1000);
  const [isNavigating, startNavigation] = useTransition();

  const currentStatus = searchParams.get("status") || "";
  const currentType = searchParams.get("type") || "";

  useEffect(() => {
    if (debouncedSearch !== (searchParams.get("search") || "")) {
      handleFilterChange("search", debouncedSearch);
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
    setSelectedInfo(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (info: any) => {
    setSelectedInfo(info);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (info: any) => {
    setSelectedInfo(info);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedInfo) return;
    setIsDeleting(true);
    const res = await deleteContactInfo(selectedInfo.id);
    setIsDeleting(false);

    if (res.success) {
      toast.success("تم حذف وسيلة التواصل بنجاح");
      setIsDeleteModalOpen(false);
      setSelectedInfo(null);
    } else {
      toast.error(res.error || "حدث خطأ أثناء الحذف");
    }
  };

  const handleFormSuccess = () => {
    setIsFormModalOpen(false);
    setSelectedInfo(null);
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
            <h1 className="text-2xl font-bold text-gray-900">معلومات التواصل</h1>
            <p className="text-gray-500 mt-1">إدارة معلومات ووسائل التواصل وعرضها للعملاء.</p>
          </div>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة وسيلة تواصل</span>
        </button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full" dir="rtl">
            <h3 className="text-lg font-bold text-gray-800">قائمة وسائل التواصل</h3>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Select
                icon={<Filter className="w-4 h-4" />}
                value={currentType}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                wrapperClassName="w-full sm:w-auto"
              >
                <option value="">جميع الأنواع</option>
                {Object.entries(CONTACT_TYPES_MAP).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
              </Select>

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
                  placeholder="ابحث عن قيمة أو عنوان..."
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
          </div>
        </CardHeader>
        <div className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>العنوان (العربية)</TableHead>
                <TableHead>العنوان (الإنجليزية)</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>القيمة (العربية)</TableHead>
                <TableHead>القيمة (الإنجليزية)</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contactInfos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                    لا توجد وسائل تواصل متاحة
                  </TableCell>
                </TableRow>
              ) : (
                contactInfos.map((info) => {
                  const typeDetails = CONTACT_TYPES_MAP[info.type] || { label: info.type, variant: "default" };
                  return (
                    <TableRow key={info.id}>
                      <TableCell className="font-bold text-gray-900">{info.title_ar}</TableCell>
                      <TableCell className="text-gray-700" dir="ltr">{info.title_en}</TableCell>
                      <TableCell>
                        <Badge variant={typeDetails.variant}>{typeDetails.label}</Badge>
                      </TableCell>
                      <TableCell className="text-gray-600 max-w-[200px] truncate">{info.value_ar}</TableCell>
                      <TableCell className="text-gray-600 max-w-[200px] truncate" dir="ltr">{info.value_en}</TableCell>
                      <TableCell>
                        <Badge variant={info.is_active ? "success" : "destructive"}>
                          {info.is_active ? "نشط" : "غير نشط"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditModal(info)}
                            className="p-2 text-gray-400 hover:text-brand hover:bg-brand/10 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(info)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedInfo ? "تعديل وسيلة التواصل" : "إضافة وسيلة تواصل جديدة"}
      >
        <ContactInfoForm
          initialData={selectedInfo}
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
            هل أنت متأكد من رغبتك في حذف وسيلة التواصل <strong>{selectedInfo?.title_ar}</strong>؟ لا يمكن التراجع عن هذا الإجراء.
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
