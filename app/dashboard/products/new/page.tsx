import { fetchApi } from "@/lib/api";
import { ProductForm } from "../components/ProductForm";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "إضافة منتج | لوحة التحكم",
};

export default async function NewProductPage() {
  let categories = [];
  let units = [];

  try {
    // Fetch categories and units for the dropdowns (assuming 100 per page to get all)
    const [categoriesRes, unitsRes] = await Promise.all([
      fetchApi("/categories?per_page=100"),
      fetchApi("/units?per_page=100")
    ]);

    if (categoriesRes.ok) {
      const json = await categoriesRes.json();
      categories = json.data || [];
    }

    if (unitsRes.ok) {
      const json = await unitsRes.json();
      units = json.data || [];
    }
  } catch (error) {
    console.error("Failed to fetch product dependencies:", error);
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/dashboard/products" className="hover:text-brand transition-colors">المنتجات</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">إضافة منتج جديد</span>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900">إضافة منتج جديد</h2>
        <p className="text-gray-500 mt-1">أدخل تفاصيل المنتج الجديد، يمكنك إضافة عدة وحدات وصور.</p>
      </div>

      <ProductForm categories={categories} availableUnits={units} />
    </div>
  );
}
