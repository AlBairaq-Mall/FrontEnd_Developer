"use client";

import { useState, useRef } from "react";
import { createProduct, updateProduct } from "@/lib/actions/products";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Trash2, Plus, Upload, X } from "lucide-react";
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

  // States for new multiple image selection
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States for deleting current images
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedImages((prev) => [...prev, ...filesArray]);
    }
  };

  const removeSelectedImage = (indexToRemove: number) => {
    setSelectedImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files).filter(
        (file) => file.type.startsWith("image/")
      );
      setSelectedImages((prev) => [...prev, ...filesArray]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteCurrentImage = (id: number) => {
    setDeletedImageIds((prev) => [...prev, id]);
  };

  const handleUndoDeleteCurrentImage = (id: number) => {
    setDeletedImageIds((prev) => prev.filter((itemId) => itemId !== id));
  };

  // State for dynamic units array
  // If editing, map existing units, else start with one empty unit
  const [units, setUnits] = useState<{ id: string; unit_id: string; quantity: string; price: string; barcode: string }[]>(
    initialData?.units?.length > 0
      ? initialData.units.map((u: any, idx: number) => ({
        id: Math.random().toString(),
        unit_id: u.id.toString(),
        quantity: u.quantity.toString(),
        price: u.pivot?.price ? u.pivot.price.toString() : (u.price ? u.price.toString() : ""),
        barcode: u.barcode ? u.barcode.toString() : (u.pivot?.barcode ? u.pivot.barcode.toString() : "")
      }))
      : [{ id: Math.random().toString(), unit_id: "", quantity: "1", price: "", barcode: "" }]
  );

  const addUnit = () => {
    setUnits([...units, { id: Math.random().toString(), unit_id: "", quantity: "1", price: "", barcode: "" }]);
  };

  const removeUnit = (idToRemove: string) => {
    if (units.length > 1) {
      setUnits(units.filter(u => u.id !== idToRemove));
    }
  };

  const updateUnitField = (id: string, field: "unit_id" | "quantity" | "price" | "barcode", value: string) => {
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
        formData.append(`units[${index}][barcode]`, unit.barcode);
      }
    });

    // Remove any auto-captured images from FormData to handle them cleanly via our state
    formData.delete("images[]");
    formData.delete("images");

    // Append our state selected images correctly as images[]
    selectedImages.forEach((file) => {
      formData.append("images[]", file);
    });

    // Append deleted image IDs (under multiple standard keys to guarantee backend compatibility)
    deletedImageIds.forEach((id) => {
      formData.append("deleted_images[]", id.toString());
      formData.append("delete_images[]", id.toString());
      formData.append("deleted_image_ids[]", id.toString());
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
                  <div className="w-24">
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
                  <div className="w-36">
                    <label className="block text-xs font-medium mb-1 text-gray-600">الباركود *</label>
                    <Input
                      type="text"
                      value={unit.barcode || ""}
                      onChange={(e) => updateUnitField(unit.id, "barcode", e.target.value)}
                      placeholder="الباركود الخاص بالوحدة"
                      required
                    />
                  </div>
                  <div className="w-28">
                    <label className="block text-xs font-medium mb-1 text-gray-600">سعر الوحدة (ر.ي)</label>
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

            {/* Main barcode input removed as it is now per-unit */}

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
            
            {/* Drag & Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerFileInput}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center group ${
                isDragActive
                  ? "border-brand bg-brand/5 scale-[0.98]"
                  : "border-gray-300 hover:border-brand hover:bg-brand/5 bg-gray-50"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                multiple
                className="hidden"
              />
              <Upload className="w-10 h-10 text-gray-400 group-hover:text-brand transition-colors mb-3 animate-pulse" />
              <p className="text-sm font-semibold text-gray-700">اسحب الصور وأفلتها هنا، أو اضغط للاختيار</p>
              <p className="text-xs text-gray-400 mt-1">يمكنك اختيار صورة واحدة أو عدة صور (PNG, JPG, JPEG, WEBP)</p>
            </div>

            {/* Selected Images Preview (New ones) */}
            {selectedImages.length > 0 && (
              <div className="space-y-2 mt-4">
                <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <span>الصور الجديدة المحددة</span>
                  <span className="bg-brand/10 text-brand text-xs px-2 py-0.5 rounded-full font-medium">
                    {selectedImages.length}
                  </span>
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {selectedImages.map((file, idx) => {
                    const objectUrl = URL.createObjectURL(file);
                    return (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group shadow-sm">
                        <img
                          src={objectUrl}
                          alt={`New Preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSelectedImage(idx);
                          }}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-md opacity-90 hover:opacity-100 flex items-center justify-center cursor-pointer"
                          title="إزالة الصورة"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] p-1 truncate text-center opacity-0 group-hover:opacity-100 transition-opacity">
                          {file.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Current Images (For editing) */}
            {initialData?.images && initialData.images.length > 0 && (
              <div className="space-y-4 mt-4 border-t pt-4">
                {/* Active Current Images */}
                {initialData.images.filter((img: any) => !deletedImageIds.includes(img.id)).length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <span>الصور الحالية للمنتج</span>
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium">
                        {initialData.images.filter((img: any) => !deletedImageIds.includes(img.id)).length}
                      </span>
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {initialData.images
                        .filter((img: any) => !deletedImageIds.includes(img.id))
                        .map((img: any) => (
                          <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group">
                            <img
                              src={`https://backend-albarqy.onrender.com/storage/${img.image}`}
                              alt="Product Image"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCurrentImage(img.id);
                              }}
                              className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-md opacity-90 hover:opacity-100 flex items-center justify-center cursor-pointer"
                              title="حذف الصورة"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] p-1 truncate text-center opacity-0 group-hover:opacity-100 transition-opacity">
                              صورة حالية
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* To Be Deleted Images */}
                {deletedImageIds.length > 0 && (
                  <div className="space-y-2 bg-red-50/50 p-3 rounded-xl border border-red-100">
                    <p className="text-xs font-bold text-red-700 flex items-center gap-2">
                      <span>صور سيتم حذفها عند حفظ التعديلات:</span>
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full font-medium">
                        {deletedImageIds.length}
                      </span>
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {initialData.images
                        .filter((img: any) => deletedImageIds.includes(img.id))
                        .map((img: any) => (
                          <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border border-red-200 bg-gray-100 opacity-60 group">
                            <img
                              src={`https://backend-albarqy.onrender.com/storage/${img.image}`}
                              alt="Product Image"
                              className="w-full h-full object-cover grayscale"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUndoDeleteCurrentImage(img.id);
                              }}
                              className="absolute inset-0 bg-black/40 hover:bg-black/20 flex flex-col items-center justify-center text-white transition-colors cursor-pointer"
                              title="تراجع عن الحذف"
                            >
                              <span className="text-[10px] font-semibold bg-white/20 px-2 py-1 rounded-md hover:bg-white/35 transition-colors">تراجع</span>
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
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
