"use client";

import { useState, useRef } from "react";
import { createProduct, updateProduct } from "@/lib/actions/products";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductFormProps {
  initialData?: any;
  categories: any[];
  availableUnits: any[];
}

export function ProductForm({ initialData, categories, availableUnits }: ProductFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for dynamic units array
  // If editing, map existing units, else start with one empty unit
  const [units, setUnits] = useState<{ id: string; unit_id: string; quantity: string; price: string }[]>(
    initialData?.units?.length > 0
      ? initialData.units.map((u: any, idx: number) => ({
          id: Math.random().toString(),
          unit_id: u.id.toString(),
          quantity: u.quantity.toString(),
          price: u.pivot?.price ? u.pivot.price.toString() : (u.price ? u.price.toString() : "")
        }))
      : [{ id: Math.random().toString(), unit_id: "", quantity: "1", price: "" }]
  );

  const addUnit = () => {
    setUnits([...units, { id: Math.random().toString(), unit_id: "", quantity: "1", price: "" }]);
  };

  const removeUnit = (idToRemove: string) => {
    if (units.length > 1) {
      setUnits(units.filter(u => u.id !== idToRemove));
    }
  };

  const updateUnitField = (id: string, field: "unit_id" | "quantity" | "price", value: string) => {
    setUnits(units.map(u => (u.id === id ? { ...u, [field]: value } : u)));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    // Clean up base inputs if any custom handling needed
    formData.set("status", formData.get("status") ? "1" : "0");

    // Remove any manually added unit fields from default form submit to rebuild them correctly
    // formElement will include them naturally if they have 'name' attribute, 
    // but building them manually ensures strict compliance with API format `units[0][unit_id]`
    for (const key of Array.from(formData.keys())) {
      if (key.startsWith("units[")) {
        formData.delete(key);
      }
    }

    // Add units dynamically
    units.forEach((unit, index) => {
      if (unit.unit_id) {
        formData.append(`units[${index}][unit_id]`, unit.unit_id);
        formData.append(`units[${index}][quantity]`, unit.quantity);
        formData.append(`units[${index}][price]`, unit.price);
      }
    });

    let res;
    if (initialData?.id) {
      res = await updateProduct(initialData.id, formData);
    } else {
      res = await createProduct(formData);
    }

    setIsPending(false);

    if (res.success) {
      router.push("/dashboard/products");
      router.refresh();
    } else {
      setError(res.error || "حدث خطأ غير متوقع");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" dir="rtl">
      {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-lg font-bold border-b pb-2 mb-4">المعلومات الأساسية</h3>
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
                  rows={4}
                  defaultValue={initialData?.description_ar}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الوصف (الإنجليزية)</label>
                <textarea
                  name="description_en"
                  className="w-full rounded-lg border-gray-300 bg-gray-50 border px-4 py-2 text-gray-900 focus:border-brand focus:ring-brand sm:text-sm"
                  rows={4}
                  defaultValue={initialData?.description_en}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-2 mb-4">
              <h3 className="text-lg font-bold">وحدات القياس والكميات</h3>
              <Button type="button" variant="outline" size="sm" onClick={addUnit} className="gap-2">
                <Plus className="w-4 h-4" />
                إضافة وحدة
              </Button>
            </div>
            
            <div className="space-y-3">
              {units.map((unit, index) => (
                <div key={unit.id} className="flex items-end gap-3 bg-gray-50 p-3 rounded-lg border">
                  <div className="flex-1">
                    <label className="block text-xs font-medium mb-1 text-gray-600">الوحدة</label>
                    <select 
                      className="w-full rounded-lg border-gray-300 bg-white border px-3 py-2 text-sm focus:border-brand focus:ring-brand"
                      value={unit.unit_id}
                      onChange={(e) => updateUnitField(unit.id, "unit_id", e.target.value)}
                      required
                    >
                      <option value="">-- اختر الوحدة --</option>
                      {availableUnits.map(u => (
                        <option key={u.id} value={u.id}>{u.name_ar}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-28">
                    <label className="block text-xs font-medium mb-1 text-gray-600">الكمية المقابلة</label>
                    <Input 
                      type="number" 
                      min="1"
                      step="0.01"
                      value={unit.quantity}
                      onChange={(e) => updateUnitField(unit.id, "quantity", e.target.value)}
                      required
                    />
                  </div>
                  <div className="w-28">
                    <label className="block text-xs font-medium mb-1 text-gray-600">سعر الوحدة (ر.س)</label>
                    <Input 
                      type="number" 
                      min="0"
                      step="0.01"
                      value={unit.price}
                      onChange={(e) => updateUnitField(unit.id, "price", e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  {units.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeUnit(unit.id)}
                      className="p-2 mb-0.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-lg font-bold border-b pb-2 mb-4">التصنيف والمعرفات</h3>
            
            <div>
              <label className="block text-sm font-medium mb-1">القسم *</label>
              <select 
                name="category_id"
                className="w-full rounded-lg border-gray-300 bg-gray-50 border px-4 py-2 text-sm focus:border-brand focus:ring-brand"
                defaultValue={initialData?.category?.id || ""}
                required
              >
                <option value="">-- اختر القسم --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name_ar}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">الرقم المميز (SKU) *</label>
              <Input name="unique_number" required defaultValue={initialData?.unique_number} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">الباركود *</label>
              <Input name="barcode" required defaultValue={initialData?.barcode} />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                name="status"
                id="status"
                className="w-4 h-4 text-brand rounded focus:ring-brand border-gray-300"
                defaultChecked={initialData ? initialData.status : true}
              />
              <label htmlFor="status" className="text-sm font-medium">منتج نشط ومتاح للبيع</label>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-lg font-bold border-b pb-2 mb-4">الصور</h3>
            <div>
              <label className="block text-sm font-medium mb-1">اختر الصور</label>
              <input
                type="file"
                name="images[]" // Using images[] array notation for backend
                accept="image/*"
                multiple
                className="w-full block text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-brand/10 file:text-brand
                  hover:file:bg-brand/20
                "
              />
              <p className="text-xs text-gray-500 mt-2">يمكنك اختيار أكثر من صورة. الصور الجديدة ستضاف أو تستبدل الحالية.</p>
            </div>
            
            {initialData?.images && initialData.images.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">الصور الحالية:</p>
                <div className="flex gap-2 flex-wrap">
                  {initialData.images.map((img: any) => (
                    <img 
                      key={img.id}
                      src={`https://backend-albarqy.onrender.com/storage/${img.image}`}
                      className="w-16 h-16 rounded-lg object-cover border"
                      alt="Product"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      <div className="flex justify-end gap-3 pt-6">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          إلغاء
        </Button>
        <Button type="submit" disabled={isPending} className="px-8">
          {isPending ? "جاري الحفظ..." : (initialData ? "تحديث المنتج" : "حفظ المنتج")}
        </Button>
      </div>
    </form>
  );
}
