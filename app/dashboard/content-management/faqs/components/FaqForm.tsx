"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createFAQ, updateFAQ } from "@/lib/actions/faqs";
import { toast } from "react-hot-toast";

interface FaqFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function FaqForm({ initialData, onSuccess, onCancel }: FaqFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const question_ar = formData.get("question_ar") as string;
    const question_en = formData.get("question_en") as string;
    const answer_ar = formData.get("answer_ar") as string;
    const answer_en = formData.get("answer_en") as string;
    const is_active = formData.get("is_active") === "on";

    if (!question_ar || !question_en || !answer_ar || !answer_en) {
      setError("يرجى ملء جميع الحقول المطلوبة.");
      return;
    }

    const payload = {
      question_ar,
      question_en,
      answer_ar,
      answer_en,
      is_active,
    };

    startTransition(async () => {
      let result;
      if (initialData?.id) {
        result = await updateFAQ(initialData.id, payload);
      } else {
        result = await createFAQ(payload);
      }

      if (result.success) {
        toast.success(initialData?.id ? "تم تحديث السؤال الشائع بنجاح" : "تم إضافة السؤال الشائع بنجاح");
        onSuccess();
      } else {
        toast.error(result.error || "حدث خطأ أثناء حفظ السؤال الشائع");
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

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">السؤال (عربي) *</label>
          <Input
            name="question_ar"
            defaultValue={initialData?.question_ar || ""}
            placeholder="مثال: كيف يمكنني تتبع طلبي؟"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">السؤال (إنجليزي) *</label>
          <Input
            name="question_en"
            defaultValue={initialData?.question_en || ""}
            placeholder="Example: How can I track my order?"
            dir="ltr"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">الإجابة (عربي) *</label>
          <textarea
            name="answer_ar"
            defaultValue={initialData?.answer_ar || ""}
            placeholder="اكتب الإجابة باللغة العربية هنا..."
            rows={3}
            required
            className="block w-full rounded-lg border-gray-300 bg-gray-50 border px-4 py-2 text-gray-900 focus:border-brand focus:ring-brand sm:text-sm transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">الإجابة (إنجليزي) *</label>
          <textarea
            name="answer_en"
            defaultValue={initialData?.answer_en || ""}
            placeholder="Write the answer in English here..."
            rows={3}
            dir="ltr"
            required
            className="block w-full rounded-lg border-gray-300 bg-gray-50 border px-4 py-2 text-gray-900 focus:border-brand focus:ring-brand sm:text-sm transition-colors"
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
          السؤال نشط (يظهر للعملاء)
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
