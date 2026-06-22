"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImagePlus, Save, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProductFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
  const router = useRouter();

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditing ? "تعديل المنتج" : "إضافة منتج جديد"}
        </h2>
        <div className="flex gap-3">
          <Link href="/products" passHref legacyBehavior>
            <Button variant="outline" className="gap-2">
              <X className="w-4 h-4" />
              إلغاء
            </Button>
          </Link>
          <Button className="gap-2">
            <Save className="w-4 h-4" />
            {isEditing ? "حفظ التعديلات" : "إضافة المنتج"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-bold text-gray-800">البيانات الأساسية</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج</label>
                <Input defaultValue={initialData?.name} placeholder="أدخل اسم المنتج" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">وصف المنتج</label>
                <textarea 
                  className="w-full rounded-lg border-gray-300 bg-gray-50 border px-4 py-2 text-gray-900 focus:border-brand focus:ring-brand sm:text-sm min-h-[120px]"
                  placeholder="أدخل وصفاً تفصيلياً للمنتج..."
                  defaultValue={initialData?.description}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-bold text-gray-800">التسعير والمخزون</h3>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">السعر (ر.س)</label>
                <Input type="number" defaultValue={initialData?.price} placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">سعر التكلفة (ر.س)</label>
                <Input type="number" defaultValue={initialData?.cost} placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الكمية في المخزون</label>
                <Input type="number" defaultValue={initialData?.stock} placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رمز المنتج (SKU)</label>
                <Input defaultValue={initialData?.sku} placeholder="PRD-000" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-bold text-gray-800">صورة المنتج</h3>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer min-h-[200px]">
                <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-700">اضغط لرفع صورة</p>
                <p className="text-xs text-gray-500 mt-1">أو قم بسحب وإفلات الصورة هنا</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-bold text-gray-800">التصنيف والحالة</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">القسم</label>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand">
                  <option>خضار وفواكه</option>
                  <option>ألبان وأجبان</option>
                  <option>مخبوزات</option>
                  <option>مشروبات</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">حالة المنتج</label>
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" id="status" className="w-4 h-4 text-brand rounded border-gray-300 focus:ring-brand" defaultChecked={initialData?.status !== "غير نشط"} />
                  <label htmlFor="status" className="text-sm text-gray-700">منتج نشط ومتاح للبيع</label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
