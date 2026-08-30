import { fetchApi } from "@/lib/api";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";

export const metadata = {
  title: "تفاصيل المنتج | لوحة التحكم",
};

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  let product = null;

  try {
    const res = await fetchApi(`/products/${id}`);
    if (res.ok) {
      const json = await res.json();
      product = json.data || json; 
      if (json.data) product = json.data;
    } else {
      return notFound();
    }
  } catch (error) {
    console.error("Failed to fetch product details:", error);
    return notFound();
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/dashboard/products" className="hover:text-brand transition-colors">المنتجات</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">تفاصيل المنتج</span>
      </div>

      <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-8">
        
        {/* Header Info */}
        <div className="flex flex-col md:flex-row gap-8">
          <div className="shrink-0 w-full md:w-64">
            {product.images && product.images.length > 0 ? (
              <div className="space-y-4">
                <img 
                  src={`https://backend-albarqy.onrender.com/storage/${product.images[0].image}`} 
                  alt={product.name_ar} 
                  className="w-full aspect-square rounded-xl object-cover border shadow-sm"
                />
                {product.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    {product.images.slice(1).map((img: any) => (
                      <img 
                        key={img.id}
                        src={`https://backend-albarqy.onrender.com/storage/${img.image}`} 
                        alt={product.name_ar} 
                        className="w-16 h-16 rounded-lg object-cover border shrink-0"
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full aspect-square rounded-xl bg-gray-100 border flex items-center justify-center text-gray-400">
                بدون صورة
              </div>
            )}
          </div>
          
          <div className="flex-1 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{product.name_ar}</h1>
                <p className="text-lg text-gray-500 mt-1">{product.name_en}</p>
              </div>
              <Badge variant={product.status ? "success" : "destructive"} className="text-sm px-3 py-1">
                {product.status ? "نشط" : "غير نشط"}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-gray-50 p-4 rounded-xl border">
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase mb-1">الرقم المميز (SKU)</h3>
                <p className="font-medium text-lg">{product.unique_number}</p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase mb-1">عدد الوحدات</h3>
                <p className="font-medium text-lg">{product.units?.length || 0}</p>
              </div>
              <div className="col-span-2">
                <h3 className="text-sm font-bold text-gray-400 uppercase mb-1">القسم</h3>
                {product.category ? (
                  <Link href={`/dashboard/categories/${product.category.id}`} className="font-medium text-brand hover:underline">
                    {product.category.name_ar}
                  </Link>
                ) : (
                  <span className="text-gray-500">-</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase mb-1">الوصف (العربية)</h3>
                <p className="text-gray-700 leading-relaxed">{product.description_ar || "لا يوجد وصف"}</p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase mb-1">الوصف (الإنجليزية)</h3>
                <p className="text-gray-700 leading-relaxed">{product.description_en || "لا يوجد وصف"}</p>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Units Info */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">وحدات القياس المتوفرة</h2>
          {product.units && product.units.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.units.map((unit: any) => (
                <div key={unit.id} className="bg-white border rounded-lg p-4 shadow-sm flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-gray-900">{unit.name_ar} ({unit.name_en})</h4>
                    <p className="text-xs text-gray-500 mt-1">الباركود: {unit.barcode || unit.pivot?.barcode || '-'}</p>
                  </div>
                  <div className="text-left flex gap-4">
                    <div>
                      <span className="block text-[10px] text-gray-400 uppercase">الكمية</span>
                      <span className="font-bold text-base text-gray-700">{unit.quantity}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-400 uppercase">السعر</span>
                      <span className="font-bold text-base text-brand">{unit.price || unit.pivot?.price || '-'} ر.ي</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 bg-gray-50 p-4 rounded-lg text-center border">
              لا توجد وحدات مضافة لهذا المنتج
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
