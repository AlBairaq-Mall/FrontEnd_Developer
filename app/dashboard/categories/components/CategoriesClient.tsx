"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Plus, Search, Edit, Trash2, Eye, Filter } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { CategoryForm } from "./CategoryForm";
import { deleteCategory } from "@/lib/actions/categories";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function CategoriesClient({ categories }: { categories: any[] }) {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") || "";

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleOpenAddModal = () => {
    setSelectedCategory(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (category: any) => {
    setSelectedCategory(category);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (category: any) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    setIsDeleting(true);
    const res = await deleteCategory(selectedCategory.id);
    setIsDeleting(false);
    if (res.success) {
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
    } else {
      alert(res.error || "حدث خطأ أثناء الحذف");
    }
  };

  const handleFormSuccess = () => {
    setIsFormModalOpen(false);
    setSelectedCategory(null);
  };

  const filteredCategories = categories.filter(c => 
    c.name_ar?.includes(searchQuery) || 
    c.name_en?.includes(searchQuery) ||
    c.slug?.includes(searchQuery)
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">التصنيفات</h1>
          <p className="text-gray-500 mt-1">إدارة التصنيفات الرئيسية والفرعية للمنتجات.</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة تصنيف جديد</span>
        </button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <h3 className="text-lg font-bold text-gray-800">قائمة التصنيفات</h3>
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
                  placeholder="ابحث عن تصنيف..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand w-full sm:w-64"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
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
                <TableHead>الرابط (Slug)</TableHead>
                <TableHead>الصورة</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    لا توجد تصنيفات
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-bold text-gray-900">{category.name_ar}</TableCell>
                    <TableCell className="text-gray-700">{category.name_en}</TableCell>
                    <TableCell className="text-gray-500 text-sm">{category.slug}</TableCell>
                    <TableCell>
                      {category.image ? (
                        <img 
                          src={`https://backend-albarqy.onrender.com/storage/${category.image}`} 
                          alt={category.name_ar} 
                          className="w-10 h-10 rounded-md object-cover border"
                          onError={(e) => { e.currentTarget.src = "/placeholder.png" }}
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">بدون صورة</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={category.status ? "success" : "destructive"}>
                        {category.status ? "نشط" : "غير نشط"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link 
                          href={`/dashboard/categories/${category.id}`}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleOpenEditModal(category)}
                          className="p-2 text-gray-400 hover:text-brand hover:bg-brand/10 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleOpenDeleteModal(category)}
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
        title={selectedCategory ? "تعديل تصنيف" : "إضافة تصنيف جديد"}
      >
        <CategoryForm 
          initialData={selectedCategory} 
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
          <p className="mb-6">هل أنت متأكد من رغبتك في حذف التصنيف <strong>{selectedCategory?.name_ar}</strong>؟ لا يمكن التراجع عن هذا الإجراء.</p>
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
