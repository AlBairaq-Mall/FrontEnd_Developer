"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { createCoupon, updateCoupon } from "@/lib/actions/coupons";

interface CouponFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CouponForm({ initialData, onSuccess, onCancel }: CouponFormProps) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    code: initialData?.code || "",
    type: initialData?.type || "percentage",
    value: initialData?.value || 0,
    minimum_order_amount: initialData?.minimum_order_amount || 0,
    usage_limit: initialData?.usage_limit || 100,
    start_date: initialData?.start_date || new Date().toISOString().split("T")[0],
    end_date: initialData?.end_date || "",
    is_active: initialData ? initialData.is_active : true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;

    if (type === "number") {
      finalValue = parseFloat(value) || 0;
    } else if (type === "checkbox") {
      finalValue = (e.target as HTMLInputElement).checked;
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      let result;
      if (initialData?.id) {
        result = await updateCoupon(initialData.id, formData);
      } else {
        result = await createCoupon(formData);
      }

      if (result.success) {
        alert(initialData?.id ? "تم التحديث بنجاح" : "تم الإنشاء بنجاح");
        onSuccess();
      } else {
        alert(result.error || "حدث خطأ أثناء حفظ الكوبون");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">كود الخصم</label>
          <Input
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
            placeholder="مثال: WELCOME10"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">نوع الخصم</label>
          <Select
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="percentage">نسبة مئوية (%)</option>
            <option value="fixed">مبلغ ثابت</option>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">قيمة الخصم</label>
          <Input
            type="number"
            name="value"
            value={formData.value}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">الحد الأدنى للطلب</label>
          <Input
            type="number"
            name="minimum_order_amount"
            value={formData.minimum_order_amount}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">حد الاستخدام</label>
          <Input
            type="number"
            name="usage_limit"
            value={formData.usage_limit}
            onChange={handleChange}
            required
            min="1"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">تاريخ البدء</label>
          <Input
            type="date"
            name="start_date"
            value={formData.start_date.split("T")[0]}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">تاريخ الانتهاء</label>
          <Input
            type="date"
            name="end_date"
            value={formData.end_date ? formData.end_date.split("T")[0] : ""}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          id="is_active"
          name="is_active"
          checked={formData.is_active}
          onChange={handleChange}
          className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand"
        />
        <label htmlFor="is_active" className="text-sm font-medium">نشط</label>
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
