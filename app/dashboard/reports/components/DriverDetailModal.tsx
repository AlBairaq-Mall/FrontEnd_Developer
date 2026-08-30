"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Truck, Info, Loader2 } from "lucide-react";
import { DriverDetailReportData } from "@/lib/actions/reports";

interface DriverDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  driverDetail: DriverDetailReportData | null;
  selectedDriver: { name: string; email: string } | null;
}

export function DriverDetailModal({
  isOpen,
  onClose,
  loading,
  driverDetail,
  selectedDriver,
}: DriverDetailModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`تقرير أداء المندوب: ${selectedDriver?.name || ""}`}
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-3">
          <Loader2 className="w-8 h-8 text-brand animate-spin" />
          <p className="text-gray-500 text-sm">جاري تحميل تفاصيل أداء المندوب...</p>
        </div>
      ) : driverDetail ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Driver Profile */}
          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3 border border-gray-100">
            <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <h4 className="font-bold text-gray-900 text-sm truncate">{selectedDriver?.name}</h4>
              <p className="text-xs text-gray-500 truncate">{selectedDriver?.email}</p>
            </div>
          </div>

          {/* Performance Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
              <span className="text-xs text-gray-400 block">الطلبات المسندة</span>
              <span className="text-xl font-bold text-slate-800">{driverDetail.orders.total} طلب</span>
            </div>
            <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
              <span className="text-xs text-green-600 block">مبيعات المندوب</span>
              <span className="text-xl font-bold text-green-800">
                {driverDetail.total_sales.toLocaleString("ar-SA")} ر.ي
              </span>
            </div>
            <div className="bg-green-50 rounded-lg p-3 border border-green-100">
              <span className="text-xs text-emerald-600 block">الطلبات المسلمة</span>
              <span className="text-xl font-bold text-green-800">{driverDetail.orders.delivered} طلب</span>
            </div>
            <div className="bg-red-50 rounded-lg p-3 border border-red-100">
              <span className="text-xs text-red-600 block">الطلبات الملغاة</span>
              <span className="text-xl font-bold text-red-800">{driverDetail.orders.cancelled} طلب</span>
            </div>
          </div>

          {/* Delivery Rate Alert */}
          <div className="bg-sky-50 rounded-xl p-4 flex items-start gap-3 border border-sky-100 text-sky-800">
            <Info className="w-5 h-5 shrink-0 text-sky-600 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold block">معدل نجاح التوصيل للمندوب:</span>
              <span>
                أكمل المندوب بنجاح توصيل{" "}
                <strong className="font-bold">
                  {driverDetail.orders.total > 0
                    ? Math.round((driverDetail.orders.delivered / driverDetail.orders.total) * 100)
                    : 0}
                  %
                </strong>{" "}
                من إجمالي الطلبات التي أُسندت إليه خلال الفترة المحددة.
              </span>
            </div>
          </div>

          {/* Modal Driver Breakdown details */}
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b font-bold text-xs text-gray-700">
              حالات الطلبات التفصيلية للمندوب
            </div>
            <div className="divide-y divide-gray-50 text-sm">
              <div className="px-4 py-2.5 flex justify-between">
                <span className="text-gray-500">قيد الانتظار</span>
                <span className="font-semibold text-gray-900">{driverDetail.orders.pending}</span>
              </div>
              <div className="px-4 py-2.5 flex justify-between">
                <span className="text-gray-500">قيد التجهيز</span>
                <span className="font-semibold text-gray-900">{driverDetail.orders.processing}</span>
              </div>
              <div className="px-4 py-2.5 flex justify-between">
                <span className="text-gray-500">تم الشحن</span>
                <span className="font-semibold text-gray-900">{driverDetail.orders.shipped}</span>
              </div>
              <div className="px-4 py-2.5 flex justify-between">
                <span className="text-gray-500">تم التسليم</span>
                <span className="font-semibold text-green-700 font-bold">{driverDetail.orders.delivered}</span>
              </div>
              <div className="px-4 py-2.5 flex justify-between">
                <span className="text-gray-500">ملغي</span>
                <span className="font-semibold text-red-600 font-bold">{driverDetail.orders.cancelled}</span>
              </div>
            </div>
          </div>

          {/* Footer close */}
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button
              onClick={onClose}
              className="bg-slate-600 text-white hover:bg-slate-700 border-none px-6"
            >
              إغلاق
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500 text-sm">فشل تحميل بيانات تفاصيل المندوب</div>
      )}
    </Modal>
  );
}
