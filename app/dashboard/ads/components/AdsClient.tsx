"use client";

import { useState, useTransition, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Plus, Search, Trash2, Edit, Eye, Image as ImageIcon, Loader2 } from "lucide-react";
import { AdForm } from "./AdForm";
import { deleteAd } from "@/lib/actions/ads";
import { Select } from "@/components/ui/Select";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { useDebounce } from "@/hooks/useDebounce";

export function AdsClient({ adsData }: { adsData: any[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(searchTerm, 2000);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<any>(null);
  const [isPending, startTransition] = useTransition();
  const [isNavigating, startNavigation] = useTransition();

  const currentStatus = searchParams.get("is_active") || "";

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
    setEditingAd(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ad: any) => {
    setEditingAd(ad);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string | number) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الإعلان؟")) return;

    startTransition(async () => {
      const result = await deleteAd(id);
      if (result.success) {
        toast.success("تم حذف الإعلان بنجاح");
      } else {
        toast.error(result.error || "فشل في حذف الإعلان");
      }
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const activeCount = adsData.filter(a => a.is_active).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الإعلانات</h1>
          <p className="text-gray-500 mt-1">إنشاء وتعديل البنرات الإعلانية للعرض في واجهة المتجر.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة إعلان جديد</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">الإعلانات النشطة</p>
              <h3 className="text-3xl font-bold text-gray-900">{activeCount}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
              <ImageIcon className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <h3 className="text-lg font-bold text-gray-800">قائمة الإعلانات</h3>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Select
                value={currentStatus}
                onChange={(e) => handleFilterChange("is_active", e.target.value)}
                className="w-full sm:w-40"
              >
                <option value="">كل الحالات</option>
                <option value="true">نشط</option>
                <option value="false">غير نشط</option>
              </Select>

              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="ابحث بعنوان الإعلان..."
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
                <TableHead>الصورة</TableHead>
                <TableHead>العنوان</TableHead>
                <TableHead>الرابط</TableHead>
                <TableHead>الترتيب</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adsData.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell>
                    <div className="w-24 h-12 relative rounded overflow-hidden border border-gray-200">
                      {ad.image ? (
                        <Image src={ad.image} alt={ad.title_ar || "إعلان"} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-gray-900">{ad.title_ar || ad.title_en || "بدون عنوان"}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[200px]">{ad.description_ar || ad.description_en}</div>
                  </TableCell>
                  <TableCell>
                    {ad.url ? (
                      <a href={ad.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm truncate block max-w-[150px]" dir="ltr">
                        {ad.url}
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="info" className="font-mono">{ad.sort_order}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={ad.is_active ? "success" : "destructive"}>
                      {ad.is_active ? "نشط" : "غير نشط"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/ads/${ad.id}`}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all hover:scale-110 active:scale-95"
                        title="عرض التفاصيل"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleOpenEdit(ad)}
                        className="p-1.5 text-gray-400 hover:text-brand hover:bg-brand/10 rounded-md transition-all hover:scale-110 active:scale-95"
                        title="تعديل"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(ad.id)}
                        disabled={isPending}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {adsData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    لا يوجد إعلانات.
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
        title={editingAd ? "تعديل إعلان" : "إضافة إعلان جديد"}
      >
        <AdForm
          initialData={editingAd}
          onSuccess={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
