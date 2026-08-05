"use client";

import { useState, useTransition, useRef } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createAd, updateAd } from "@/lib/actions/ads";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface AdFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AdForm({ initialData, onSuccess, onCancel }: AdFormProps) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(initialData?.image || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(initialData?.image || null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    
    // For checkboxes, FormData only includes them if checked, which might send "on". We need to ensure it's a boolean or 1/0.
    // So we manually set is_active based on the checkbox state.
    const isActiveCheckbox = formRef.current.elements.namedItem("is_active") as HTMLInputElement;
    formData.set("is_active", isActiveCheckbox.checked ? "1" : "0");

    startTransition(async () => {
      let result;
      if (initialData?.id) {
        result = await updateAd(initialData.id, formData);
      } else {
        result = await createAd(formData);
      }

      if (result.success) {
        toast.success(initialData?.id ? "تم تحديث الإعلان بنجاح" : "تم إنشاء الإعلان بنجاح");
        onSuccess();
      } else {
        toast.error(result.error || "حدث خطأ أثناء حفظ الإعلان");
      }
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">العنوان (عربي)</label>
          <Input 
            name="title_ar"
            defaultValue={initialData?.title_ar || ""}
            placeholder="مثال: عروض الصيف"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">العنوان (إنجليزي)</label>
          <Input 
            name="title_en"
            defaultValue={initialData?.title_en || ""}
            placeholder="Example: Summer Sale"
            dir="ltr"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">الوصف (عربي)</label>
          <Input 
            name="description_ar"
            defaultValue={initialData?.description_ar || ""}
            placeholder="مثال: خصومات تصل إلى 50%"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">الوصف (إنجليزي)</label>
          <Input 
            name="description_en"
            defaultValue={initialData?.description_en || ""}
            placeholder="Example: Up to 50% off"
            dir="ltr"
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium">رابط الإعلان (الوجهة)</label>
          <Input 
            name="url"
            type="url"
            defaultValue={initialData?.url || ""}
            placeholder="https://example.com"
            dir="ltr"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">الترتيب</label>
          <Input 
            type="number"
            name="sort_order"
            defaultValue={initialData?.sort_order || 0}
            min="0"
          />
        </div>
        
        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-medium">الصورة {initialData ? "(اختر لتغيير الصورة الحالية)" : "*"}</label>
          <Input 
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            required={!initialData} // required only on create
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand/10 file:text-brand hover:file:bg-brand/20 cursor-pointer"
          />
          {previewImage && (
            <div className="mt-2 w-full h-32 relative rounded-lg overflow-hidden border border-gray-200">
              <Image 
                src={previewImage} 
                alt="Preview" 
                fill 
                className="object-cover"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <input 
          type="checkbox"
          id="is_active"
          name="is_active"
          defaultChecked={initialData ? initialData.is_active : true}
          className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand"
        />
        <label htmlFor="is_active" className="text-sm font-medium">الإعلان نشط</label>
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
