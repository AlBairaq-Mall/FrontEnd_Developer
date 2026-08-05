"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, Image as ImageIcon, Link as LinkIcon, Calendar, Type } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function AdDetailsClient({ ad }: { ad: any }) {
  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/ads"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">تفاصيل الإعلان</h1>
          <p className="text-gray-500 mt-1">عرض معلومات الإعلان والصورة المرفقة</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Type className="w-5 h-5 text-brand" />
                المعلومات الأساسية
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-xs text-gray-500 block mb-1">العنوان (عربي)</span>
                  <span className="font-bold text-gray-900">{ad.title_ar || "-"}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg" dir="ltr">
                  <span className="text-xs text-gray-500 block mb-1 text-right">العنوان (إنجليزي)</span>
                  <span className="font-bold text-gray-900 text-right block">{ad.title_en || "-"}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-xs text-gray-500 block mb-1">الوصف (عربي)</span>
                  <span className="text-gray-800">{ad.description_ar || "-"}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg" dir="ltr">
                  <span className="text-xs text-gray-500 block mb-1 text-right">الوصف (إنجليزي)</span>
                  <span className="text-gray-800 text-right block">{ad.description_en || "-"}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">رابط الإعلان:</span>
                </div>
                {ad.url ? (
                  <a href={ad.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-mono text-sm" dir="ltr">
                    {ad.url}
                  </a>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-500" />
                صورة الإعلان
              </h3>
            </CardHeader>
            <CardContent>
              {ad.image ? (
                <div className="w-full h-48 relative rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  <Image src={ad.image} alt={ad.title_ar || "إعلان"} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-100 flex flex-col items-center justify-center rounded-lg border border-gray-200 border-dashed text-gray-400">
                  <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                  <span>لا توجد صورة</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                تفاصيل إضافية
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-500">الحالة</span>
                <Badge variant={ad.is_active ? "success" : "destructive"}>
                  {ad.is_active ? "نشط" : "غير نشط"}
                </Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-500">الترتيب (Sort Order)</span>
                <span className="font-mono font-bold bg-gray-100 px-2 py-1 rounded text-gray-900">{ad.sort_order || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-500">تاريخ الإنشاء</span>
                <span className="font-mono text-sm text-gray-700">{ad.created_at ? new Date(ad.created_at).toLocaleDateString('ar-SA') : "-"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
