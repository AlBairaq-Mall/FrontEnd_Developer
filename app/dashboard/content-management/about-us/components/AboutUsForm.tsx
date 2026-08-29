"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createAboutUs, updateAboutUs } from "@/lib/actions/about-us";
import { toast } from "react-hot-toast";

interface AboutUsFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AboutUsForm({ initialData, onSuccess, onCancel }: AboutUsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const title_ar = formData.get("title_ar") as string;
    const title_en = formData.get("title_en") as string;
    const description_ar = formData.get("description_ar") as string;
    const description_en = formData.get("description_en") as string;

    if (!title_ar || !title_en || !description_ar || !description_en) {
      setError("يرجى ملء جميع الحقول المطلوبة.");
      return;
    }

    const payload = {
      title_ar,
      title_en,
      description_ar,
      description_en,
    };

    startTransition(async () => {
      let result;
      if (initialData?.id) {
        result = await updateAboutUs(initialData.id, payload);
      } else {
        result = await createAboutUs(payload);
      }

      if (result.success) {
        toast.success(initialData?.id ? "تم تحديث البيانات بنجاح" : "تم إضافة البيانات بنجاح");
        onSuccess();
      } else {
        toast.error(result.error || "حدث خطأ أثناء حفظ البيانات");
        setError(result.error || "فشل في حفظ البيانات");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">العنوان (عربي) *</label>
          <Input
            name="title_ar"
            defaultValue={initialData?.title_ar || ""}
            placeholder="مثال: من نحن"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">العنوان (إنجليزي) *</label>
          <Input
            name="title_en"
            defaultValue={initialData?.title_en || ""}
            placeholder="Example: About Us"
            dir="ltr"
            required
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">الوصف (عربي) *</label>
          <textarea
            name="description_ar"
            defaultValue={initialData?.description_ar || ""}
            placeholder="اكتب وصفاً تعريفياً بالشركة..."
            rows={4}
            required
            className="block w-full rounded-lg border-gray-300 bg-gray-50 border px-4 py-2 text-gray-900 focus:border-brand focus:ring-brand sm:text-sm transition-colors"
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">الوصف (إنجليزي) *</label>
          <textarea
            name="description_en"
            defaultValue={initialData?.description_en || ""}
            placeholder="Write an about description..."
            rows={4}
            dir="ltr"
            required
            className="block w-full rounded-lg border-gray-300 bg-gray-50 border px-4 py-2 text-gray-900 focus:border-brand focus:ring-brand sm:text-sm transition-colors"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>إلغاء</Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "جاري الحفظ..." : "حفظ"}
        </Button>
      </div>
    </form>
  );
}
