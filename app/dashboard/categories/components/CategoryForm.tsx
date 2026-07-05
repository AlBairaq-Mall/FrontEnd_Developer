"use client";

import { useState, useRef } from "react";
import { createCategory, updateCategory } from "@/lib/actions/categories";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface CategoryFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CategoryForm({ initialData, onSuccess, onCancel }: CategoryFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    // Handle checkbox value (1 for true, 0 for false)
    formData.set("status", formData.get("status") ? "1" : "0");

    let res;
    if (initialData?.id) {
      res = await updateCategory(initialData.id, formData);
    } else {
      res = await createCategory(formData);
    }

    setIsPending(false);

    if (res.success) {
      onSuccess();
    } else {
      setError(res.error || "حدث خطأ غير متوقع");
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" dir="rtl">
      {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">الاسم (العربية) *</label>
          <Input name="name_ar" required defaultValue={initialData?.name_ar} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">الاسم (الإنجليزية) *</label>
          <Input name="name_en" required defaultValue={initialData?.name_en} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">الوصف (العربية)</label>
          <textarea
            name="description_ar"
            className="w-full rounded-lg border-gray-300 bg-gray-50 border px-4 py-2 text-gray-900 focus:border-brand focus:ring-brand sm:text-sm"
            rows={3}
            defaultValue={initialData?.description_ar}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">الوصف (الإنجليزية)</label>
          <textarea
            name="description_en"
            className="w-full rounded-lg border-gray-300 bg-gray-50 border px-4 py-2 text-gray-900 focus:border-brand focus:ring-brand sm:text-sm"
            rows={3}
            defaultValue={initialData?.description_en}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">الصورة</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          className="w-full block text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-brand/10 file:text-brand
            hover:file:bg-brand/20
          "
        />
        {initialData?.image && (
          <p className="text-xs text-gray-500 mt-1">يوجد صورة حالية، ارفع صورة جديدة لاستبدالها.</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="status"
          id="status"
          className="w-4 h-4 text-brand rounded focus:ring-brand border-gray-300"
          defaultChecked={initialData ? initialData.status : true}
        />
        <label htmlFor="status" className="text-sm font-medium">نشط</label>
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          إلغاء
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "جاري الحفظ..." : "حفظ التصنيف"}
        </Button>
      </div>
    </form>
  );
}
