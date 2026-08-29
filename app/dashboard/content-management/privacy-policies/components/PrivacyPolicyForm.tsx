"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createPrivacyPolicy, updatePrivacyPolicy } from "@/lib/actions/privacy-policies";
import { toast } from "react-hot-toast";

interface PrivacyPolicyFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PrivacyPolicyForm({ initialData, onSuccess, onCancel }: PrivacyPolicyFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const title_ar = formData.get("title_ar") as string;
    const title_en = formData.get("title_en") as string;
    const content_ar = formData.get("content_ar") as string;
    const content_en = formData.get("content_en") as string;
    const sort_order = parseInt(formData.get("sort_order") as string, 10) || 0;
    const is_active = formData.get("is_active") === "on";

    if (!title_ar || !title_en || !content_ar || !content_en) {
      setError("يرجى ملء جميع الحقول المطلوبة.");
      return;
    }

    const payload = {
      title_ar,
      title_en,
      content_ar,
      content_en,
      sort_order,
      is_active,
    };

    startTransition(async () => {
      let result;
      if (initialData?.id) {
        result = await updatePrivacyPolicy(initialData.id, payload);
      } else {
        result = await createPrivacyPolicy(payload);
      }

      if (result.success) {
        toast.success(initialData?.id ? "تم تحديث بند سياسة الخصوصية بنجاح" : "تم إضافة بند سياسة الخصوصية بنجاح");
        onSuccess();
      } else {
        toast.error(result.error || "حدث خطأ أثناء حفظ البند");
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
            placeholder="مثال: جمع البيانات الشخصية"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">العنوان (إنجليزي) *</label>
          <Input
            name="title_en"
            defaultValue={initialData?.title_en || ""}
            placeholder="Example: Personal Data Collection"
            dir="ltr"
            required
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">المحتوى (عربي) *</label>
          <textarea
            name="content_ar"
            defaultValue={initialData?.content_ar || ""}
            placeholder="اكتب تفاصيل البند باللغة العربية هنا..."
            rows={4}
            required
            className="block w-full rounded-lg border-gray-300 bg-gray-50 border px-4 py-2 text-gray-900 focus:border-brand focus:ring-brand sm:text-sm transition-colors"
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">المحتوى (إنجليزي) *</label>
          <textarea
            name="content_en"
            defaultValue={initialData?.content_en || ""}
            placeholder="Write the details of the section in English here..."
            rows={4}
            dir="ltr"
            required
            className="block w-full rounded-lg border-gray-300 bg-gray-50 border px-4 py-2 text-gray-900 focus:border-brand focus:ring-brand sm:text-sm transition-colors"
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">الترتيب</label>
          <Input
            type="number"
            name="sort_order"
            defaultValue={initialData?.sort_order ?? 1}
            min="0"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <input
          type="checkbox"
          id="is_active"
          name="is_active"
          defaultChecked={initialData ? initialData.is_active : true}
          className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand"
        />
        <label htmlFor="is_active" className="text-sm font-medium text-gray-700 select-none">
          البند نشط (يظهر للعملاء)
        </label>
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
