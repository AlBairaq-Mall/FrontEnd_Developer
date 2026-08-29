"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { createContactInfo, updateContactInfo } from "@/lib/actions/contact-infos";
import { toast } from "react-hot-toast";

interface ContactInfoFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const CONTACT_TYPES = [
  { value: "phone", label: "هاتف محمول (Phone)" },
  { value: "telephone", label: "هاتف ثابت (Telephone)" },
  { value: "whatsapp", label: "واتساب (WhatsApp)" },
  { value: "email", label: "البريد الإلكتروني (Email)" },
  { value: "website", label: "الموقع الإلكتروني (Website)" },
  { value: "location", label: "الموقع الجغرافي (Location)" },
  { value: "other", label: "أخرى (Other)" },
];

export function ContactInfoForm({ initialData, onSuccess, onCancel }: ContactInfoFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const type = formData.get("type") as string;
    const title_ar = formData.get("title_ar") as string;
    const title_en = formData.get("title_en") as string;
    const value_ar = formData.get("value_ar") as string;
    const value_en = formData.get("value_en") as string;
    const is_active = formData.get("is_active") === "on";

    if (!type || !title_ar || !title_en || !value_ar || !value_en) {
      setError("يرجى ملء جميع الحقول المطلوبة.");
      return;
    }

    const payload = {
      type,
      title_ar,
      title_en,
      value_ar,
      value_en,
      is_active,
    };

    startTransition(async () => {
      let result;
      if (initialData?.id) {
        result = await updateContactInfo(initialData.id, payload);
      } else {
        result = await createContactInfo(payload);
      }

      if (result.success) {
        toast.success(initialData?.id ? "تم تحديث وسيلة الاتصال بنجاح" : "تم إضافة وسيلة الاتصال بنجاح");
        onSuccess();
      } else {
        toast.error(result.error || "حدث خطأ أثناء حفظ وسيلة الاتصال");
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
        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">نوع وسيلة التواصل *</label>
          <Select
            name="type"
            defaultValue={initialData?.type || "phone"}
            required
          >
            {CONTACT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">العنوان (عربي) *</label>
          <Input
            name="title_ar"
            defaultValue={initialData?.title_ar || ""}
            placeholder="مثال: رقم الواتساب"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">العنوان (إنجليزي) *</label>
          <Input
            name="title_en"
            defaultValue={initialData?.title_en || ""}
            placeholder="Example: WhatsApp Number"
            dir="ltr"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">القيمة (عربي) *</label>
          <Input
            name="value_ar"
            defaultValue={initialData?.value_ar || ""}
            placeholder="مثال: +967777777777"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">القيمة (إنجليزي) *</label>
          <Input
            name="value_en"
            defaultValue={initialData?.value_en || ""}
            placeholder="Example: +967777777777"
            dir="ltr"
            required
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
          وسيلة تواصل نشطة (تظهر للعملاء)
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
