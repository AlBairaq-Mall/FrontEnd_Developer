"use client";

import { useState, useTransition, useEffect } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Plus, Search, Edit, Trash2, Eye, Upload, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { deleteProduct, importProducts } from "@/lib/actions/products";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { toast, Toaster } from "react-hot-toast";

export function ProductsClient({ products }: { products: any[] }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(searchQuery, 2000);
  const [isImporting, setIsImporting] = useState(false);
  const [isNavigating, startNavigation] = useTransition();

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

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(fileExtension || '')) {
      toast.error("يرجى اختيار ملف إكسل (.xlsx, .xls) أو ملف CSV فقط");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsImporting(true);
    const loadingToast = toast.loading("جاري رفع واستيراد المنتجات...");

    try {
      const res = await importProducts(formData);
      if (res.success) {
        toast.success("تم استيراد المنتجات بنجاح", { id: loadingToast });
        // Reset the file input
        e.target.value = '';
        router.refresh();
      } else {
        toast.error(res.error || "حدث خطأ أثناء استيراد المنتجات", { id: loadingToast });
      }
    } catch (error) {
      toast.error("حدث خطأ غير متوقع أثناء استيراد المنتجات", { id: loadingToast });
    } finally {
      setIsImporting(false);
    }
  };

  const handleOpenDeleteModal = (product: any) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    setIsDeleting(true);
    const res = await deleteProduct(selectedProduct.id);
    setIsDeleting(false);
    if (res.success) {
      toast.success("تم حذف المنتج بنجاح");
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
      router.refresh();
    } else {
      toast.error(res.error || "حدث خطأ أثناء الحذف");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">إدارة المنتجات</h2>
          <p className="text-gray-500 mt-1">إضافة وتعديل وحذف المنتجات والتحكم بالمخزون.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <label className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer text-sm font-medium ${isImporting ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}>
            {isImporting ? (
              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
            <span>{isImporting ? "جاري الاستيراد..." : "استيراد من إكسل"}</span>
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              className="hidden"
              onChange={handleImportExcel}
              disabled={isImporting}
            />
          </label>
          <Link
            href="/dashboard/products/new"
            className="flex items-center justify-center gap-2 bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors text-sm font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>إضافة منتج جديد</span>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <h3 className="text-lg font-bold text-gray-800">قائمة المنتجات</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث بالاسم أو الباركود..."
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
        </CardHeader>
        <div className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المنتج</TableHead>
                <TableHead>الرقم المميز / الباركود</TableHead>
                <TableHead>القسم</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                    لا توجد منتجات
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={`https://backend-albarqy.onrender.com/storage/${product.images[0].image}`}
                            alt={product.name_ar}
                            className="w-10 h-10 rounded-md object-cover border"
                            onError={(e) => { 
                              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='40' height='40'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 9.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm6.5 7H9l2.25-3 1.75 2.26 2.5-3.26L19 16.5H15z' fill='%239ca3af'/%3E%3C/svg%3E"; 
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-md bg-gray-100 border flex items-center justify-center text-gray-400 text-xs">
                            لا صورة
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-gray-900">{product.name_ar}</p>
                          <p className="text-xs text-gray-500">{product.name_en}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p><strong>الرقم:</strong> {product.unique_number}</p>
                        {product.units && product.units.length > 0 ? (
                          <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                            {product.units.map((u: any) => (
                              <p key={u.id}>
                                <strong>{u.name_ar}:</strong> {u.barcode || u.pivot?.barcode || "-"}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500"><strong>الباركود:</strong> {product.barcode || "-"}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.category ? product.category.name_ar : <span className="text-gray-400">-</span>}
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.status ? "success" : "destructive"}>
                        {product.status ? "نشط" : "غير نشط"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/products/${product.id}`} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link href={`/dashboard/products/${product.id}/edit`} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleOpenDeleteModal(product)}
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
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="تأكيد الحذف"
      >
        <div className="p-4" dir="rtl">
          <p className="mb-6">هل أنت متأكد من رغبتك في حذف المنتج <strong>{selectedProduct?.name_ar}</strong>؟ لا يمكن التراجع عن هذا الإجراء.</p>
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
