import { fetchApi } from "@/lib/api";
import { ProductForm } from "../../components/ProductForm";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";

export const metadata = {
  title: "تعديل منتج | لوحة التحكم",
};

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  let product = null;
  let categories = [];
  let units = [];

  try {
    const [productRes, categoriesRes, unitsRes] = await Promise.all([
      fetchApi(`/products/${id}`),
      fetchApi("/categories?per_page=100"),
      fetchApi("/units?per_page=100")
    ]);

    if (productRes.ok) {
      const json = await productRes.json();
      product = json.data || json; // adjust according to actual API wrapper structure (sometimes data.data)
      if (json.data) product = json.data;
    } else {
      return notFound();
    }

    if (categoriesRes.ok) {
      const json = await categoriesRes.json();
      categories = json.data || [];
    }

    if (unitsRes.ok) {
      const json = await unitsRes.json();
      units = json.data || [];
    }
  } catch (error) {
    console.error("Failed to fetch product for editing:", error);
    return notFound();
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/dashboard/products" className="hover:text-brand transition-colors">المنتجات</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">تعديل المنتج</span>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900">تعديل المنتج: {product?.name_ar}</h2>
        <p className="text-gray-500 mt-1">تحديث بيانات وصور المنتج ووحداته.</p>
      </div>

      <ProductForm initialData={product} categories={categories} availableUnits={units} />
    </div>
  );
}
