"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Users, Package, MapPin } from "lucide-react";

interface GeneralStatsViewProps {
  statsData: {
    customers: number;
    products: number;
    locations: number;
  } | null;
}

export function GeneralStatsView({ statsData }: GeneralStatsViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">إجمالي عدد العملاء</p>
              <h3 className="text-3xl font-extrabold text-gray-900 mt-1">
                {statsData?.customers.toLocaleString("ar-SA") || 0}
              </h3>
              <p className="text-xs text-gray-400 mt-1">المسجلين بالدور customer في النظام</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Package className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">إجمالي عدد المنتجات</p>
              <h3 className="text-3xl font-extrabold text-gray-900 mt-1">
                {statsData?.products.toLocaleString("ar-SA") || 0}
              </h3>
              <p className="text-xs text-gray-400 mt-1">المتاحة في الكتالوج والمخزن</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <MapPin className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">إجمالي مواقع التوصيل</p>
              <h3 className="text-3xl font-extrabold text-gray-900 mt-1">
                {statsData?.locations.toLocaleString("ar-SA") || 0}
              </h3>
              <p className="text-xs text-gray-400 mt-1">المواقع والوجهات المخزنة</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
