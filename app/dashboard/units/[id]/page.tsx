import { fetchApi } from "@/lib/api";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";

export const metadata = {
  title: "تفاصيل الوحدة | لوحة التحكم",
};

export default async function UnitDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  let unit = null;

  try {
    const res = await fetchApi(`/units/${id}`);
    if (res.ok) {
      const json = await res.json();
      unit = json.data || json; 
      if (json.data) unit = json.data;
    } else {
      return notFound();
    }
  } catch (error) {
    console.error("Failed to fetch unit details:", error);
    return notFound();
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/dashboard/units" className="hover:text-brand transition-colors">الوحدات</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">تفاصيل الوحدة</span>
      </div>

      <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex-1 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{unit.name_ar}</h1>
              <p className="text-lg text-gray-500 mt-1">{unit.name_en}</p>
            </div>
            <Badge variant={unit.status ? "success" : "destructive"} className="text-sm px-3 py-1">
              {unit.status ? "نشط" : "غير نشط"}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase mb-1">الرمز (Symbol)</h3>
              <p className="font-medium text-lg">{unit.symbol || "-"}</p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase mb-1">تاريخ الإنشاء</h3>
              <p className="font-medium">{unit.created_at ? new Date(unit.created_at).toLocaleDateString('ar-EG') : "-"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
