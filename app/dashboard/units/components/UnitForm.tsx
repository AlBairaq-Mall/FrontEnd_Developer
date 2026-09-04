"use client";

import { useState, useRef } from "react";
import { createUnit, updateUnit } from "@/lib/actions/units";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "react-hot-toast";

interface UnitFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function UnitForm({ initialData, onSuccess, onCancel }: UnitFormProps) {
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
      res = await updateUnit(initialData.id, formData);
    } else {
      res = await createUnit(formData);
    }

    setIsPending(false);

    if (res.success) {
      toast.success(initialData?.id ? "تم تحديث الوحدة بنجاح" : "تم إضافة الوحدة بنجاح");
      onSuccess();
    } else {
      const errMsg = res.error || "حدث خطأ غير متوقع";
      setError(errMsg);
      toast.error(errMsg);
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

      <div>
        <label className="block text-sm font-medium mb-1">الرمز (Symbol)</label>
        <Input name="symbol" defaultValue={initialData?.symbol} />
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
          {isPending ? "جاري الحفظ..." : "حفظ الوحدة"}
        </Button>
      </div>
    </form>
  );
}
