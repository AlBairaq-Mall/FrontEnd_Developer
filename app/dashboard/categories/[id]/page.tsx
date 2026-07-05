import { fetchApi } from "@/lib/api";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";

export const metadata = {
  title: "تفاصيل القسم | لوحة التحكم",
};

export default async function CategoryDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  let category = null;

  try {
    const res = await fetchApi(`/categories/${id}`);
    if (res.ok) {
      const json = await res.json();
      category = json.data || json; 
      if (json.data) category = json.data;
    } else {
      return notFound();
    }
  } catch (error) {
    console.error("Failed to fetch category details:", error);
    return notFound();
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/dashboard/categories" className="hover:text-brand transition-colors">الأقسام</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">تفاصيل القسم</span>
      </div>

      <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-start gap-6">
          {category.image ? (
            <img 
              src={`https://backend-albarqy.onrender.com/storage/${category.image}`} 
              alt={category.name_ar} 
              className="w-32 h-32 rounded-xl object-cover border"
            />
          ) : (
            <div className="w-32 h-32 rounded-xl bg-gray-100 border flex items-center justify-center text-gray-400">
              بدون صورة
            </div>
          )}
          
          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{category.name_ar}</h1>
                <p className="text-lg text-gray-500 mt-1">{category.name_en}</p>
              </div>
              <Badge variant={category.status ? "success" : "destructive"} className="text-sm px-3 py-1">
                {category.status ? "نشط" : "غير نشط"}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase mb-1">الرابط (Slug)</h3>
                <p className="font-medium">{category.slug || "-"}</p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase mb-1">تاريخ الإنشاء</h3>
                <p className="font-medium">{category.created_at ? new Date(category.created_at).toLocaleDateString('ar-EG') : "-"}</p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase mb-1">الوصف (العربية)</h3>
                <p className="text-gray-700">{category.description_ar || "لا يوجد وصف"}</p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase mb-1">الوصف (الإنجليزية)</h3>
                <p className="text-gray-700">{category.description_en || "لا يوجد وصف"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
