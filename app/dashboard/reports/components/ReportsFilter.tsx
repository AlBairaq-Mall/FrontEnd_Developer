"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Filter, Loader2 } from "lucide-react";

interface ReportsFilterProps {
  reportType: "sales_orders" | "drivers" | "stats";
  fromDateInput: string;
  toDateInput: string;
  setFromDateInput: (val: string) => void;
  setToDateInput: (val: string) => void;
  loading: boolean;
  onReportTypeChange: (type: "sales_orders" | "drivers" | "stats") => void;
  onApplyFilter: () => void;
}

export function ReportsFilter({
  reportType,
  fromDateInput,
  toDateInput,
  setFromDateInput,
  setToDateInput,
  loading,
  onReportTypeChange,
  onApplyFilter,
}: ReportsFilterProps) {
  return (
    <Card className="print:hidden">
      <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full space-y-1">
          <label className="text-sm font-medium text-gray-700">نوع التقرير</label>
          <Select
            value={reportType}
            onChange={(e) => onReportTypeChange(e.target.value as any)}
            className="w-full"
          >
            <option value="sales_orders">تقرير المبيعات والطلبات</option>
            <option value="drivers">تقرير أداء مناديب التوصيل</option>
            <option value="stats">إحصائيات المتجر العامة</option>
          </Select>
        </div>

        {reportType !== "stats" && (
          <>
            <div className="flex-1 w-full space-y-1">
              <label className="text-sm font-medium text-gray-700">الفترة من</label>
              <input
                type="date"
                value={fromDateInput}
                onChange={(e) => setFromDateInput(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand bg-white animate-in fade-in duration-200"
              />
            </div>
            <div className="flex-1 w-full space-y-1">
              <label className="text-sm font-medium text-gray-700">إلى</label>
              <input
                type="date"
                value={toDateInput}
                onChange={(e) => setToDateInput(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand bg-white animate-in fade-in duration-200"
              />
            </div>
            <Button
              onClick={onApplyFilter}
              disabled={loading}
              className="bg-brand text-white hover:bg-brand/90   border-none font-medium flex items-center gap-2 h-[38px] px-6"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Filter className="w-4 h-4" />}
              <span> عرض النتائج    </span>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
