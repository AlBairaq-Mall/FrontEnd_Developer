"use client";

import { useState, useRef, useEffect } from "react";
import { createCategory, updateCategory } from "@/lib/actions/categories";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Upload, Image as ImageIcon, X, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";

interface CategoryFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CategoryForm({ initialData, onSuccess, onCancel }: CategoryFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const existingImageUrl = initialData?.image
    ? `https://backend-albarqy.onrender.com/storage/${initialData.image}`
    : null;

  // Handle object URL creation and cleanup
  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        setError(null);
      } else {
        toast.error("يرجى اختيار ملف صورة صالح");
      }
    }
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        setError(null);
      } else {
        toast.error("يرجى اختيار ملف صورة صالح");
      }
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    // Validation: Image is required in both add and edit
    const hasExistingImage = Boolean(initialData?.image);
    if (!selectedFile && !hasExistingImage) {
      const msg = "حقل الصورة مطلوب، يرجى اختيار صورة للقسم.";
      setError(msg);
      toast.error(msg);
      return;
    }

    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    // Handle checkbox value (1 for true, 0 for false)
    formData.set("status", formData.get("status") ? "1" : "0");

    // Manage image in FormData:
    if (selectedFile) {
      formData.set("image", selectedFile);
    } else {
      // If editing and no new file selected, remove empty 0-byte file so backend preserves old image
      formData.delete("image");
    }

    let res;
    if (initialData?.id) {
      res = await updateCategory(initialData.id, formData);
    } else {
      res = await createCategory(formData);
    }

    setIsPending(false);

    if (res.success) {
      toast.success(initialData?.id ? "تم تحديث القسم بنجاح" : "تم إضافة القسم بنجاح");
      onSuccess();
    } else {
      const errMsg = res.error || "حدث خطأ غير متوقع";
      setError(errMsg);
      toast.error(errMsg);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" dir="rtl">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">الاسم (العربية) *</label>
          <Input name="name_ar" required defaultValue={initialData?.name_ar} placeholder="اسم القسم بالعربية" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">الاسم (الإنجليزية) *</label>
          <Input name="name_en" required defaultValue={initialData?.name_en} placeholder="Category name in English" dir="ltr" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">الوصف (العربية)</label>
          <textarea
            name="description_ar"
            className="w-full rounded-lg border-gray-300 bg-gray-50 border px-4 py-2 text-gray-900 focus:border-brand focus:ring-brand sm:text-sm"
            rows={3}
            defaultValue={initialData?.description_ar}
            placeholder="وصف مختصر للقسم..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">الوصف (الإنجليزية)</label>
          <textarea
            name="description_en"
            className="w-full rounded-lg border-gray-300 bg-gray-50 border px-4 py-2 text-gray-900 focus:border-brand focus:ring-brand sm:text-sm"
            rows={3}
            defaultValue={initialData?.description_en}
            placeholder="Category brief description..."
            dir="ltr"
          />
        </div>
      </div>

      {/* Image Upload & Preview Section */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 flex items-center justify-between">
          <span>
            صورة القسم <span className="text-red-500 font-bold">*</span>
          </span>
          <span className="text-xs text-gray-400 font-normal">
            (مطلوب - يفضل مقاس مربع 1:1)
          </span>
        </label>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {/* Case 1: Newly Selected File Preview (For both Add and Edit) */}
        {previewUrl && (
          <div className="p-3 bg-brand/5 border border-brand/20 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>معاينة الصورة الجديدة المحددة</span>
              </span>
              <button
                type="button"
                onClick={removeSelectedFile}
                className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-red-100 shadow-xs"
              >
                <X className="w-3.5 h-3.5" />
                <span>إلغاء التحديد</span>
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-brand/30 shadow-xs bg-white shrink-0">
                <img
                  src={previewUrl}
                  alt="New Category Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 text-xs text-gray-600">
                <p className="font-medium text-gray-900 truncate">{selectedFile?.name}</p>
                <p className="text-gray-400 mt-0.5">
                  {selectedFile ? (selectedFile.size / 1024).toFixed(1) + " KB" : ""}
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 text-brand hover:underline font-semibold flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>تغيير واختيار صورة أخرى</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Case 2: Existing Image in Edit Mode (when no new file is chosen yet) */}
        {!previewUrl && existingImageUrl && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-gray-500" />
                <span>الصورة الحالية المحفوظة</span>
              </span>
              <span className="text-[11px] bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">
                موجودة حالياً
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-300 shadow-xs bg-white shrink-0">
                <img
                  src={existingImageUrl}
                  alt={initialData?.name_ar || "Category"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='40' height='40'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 9.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm6.5 7H9l2.25-3 1.75 2.26 2.5-3.26L19 16.5H15z' fill='%239ca3af'/%3E%3C/svg%3E";
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-2">
                  تظهر هذه الصورة حالياً في التطبيق. يمكنك استبدالها برفع صورة جديدة.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-1.5 text-xs h-8"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>تغيير / استبدال الصورة</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Case 3: Empty state (In Add Mode or if Category has no image) */}
        {!previewUrl && !existingImageUrl && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center group ${
              isDragActive
                ? "border-brand bg-brand/5 scale-[0.99]"
                : "border-gray-300 hover:border-brand hover:bg-brand/5 bg-gray-50/50"
            }`}
          >
            <Upload className="w-8 h-8 text-gray-400 group-hover:text-brand transition-colors mb-2" />
            <p className="text-sm font-semibold text-gray-700">اضغط لاختيار صورة أو اسحبها هنا</p>
            <p className="text-xs text-gray-400 mt-1">حقل إلزامي * (PNG, JPG, JPEG, WEBP)</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 pt-1">
        <input
          type="checkbox"
          name="status"
          id="status"
          className="w-4 h-4 text-brand rounded focus:ring-brand border-gray-300"
          defaultChecked={initialData ? initialData.status : true}
        />
        <label htmlFor="status" className="text-sm font-medium text-gray-700 select-none">
          تصنيف نشط ومتاح في المتجر
        </label>
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          إلغاء
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "جاري الحفظ..." : initialData?.id ? "حفظ التعديلات" : "إضافة التصنيف"}
        </Button>
      </div>
    </form>
  );
}
