"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Download,
  AlertTriangle,
  Loader2,
  Printer
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// Actions & Types
import {
  getSalesReport,
  getCustomersReport,
  getProductsReport,
  getOrdersReport,
  getDeliveryDriversReport,
  getDeliveryDriverDetailReport,
  getLocationsReport,
  SalesReportData,
  OrdersReportData,
  DriverReportItem,
  DriverDetailReportData
} from "@/lib/actions/reports";

// Subcomponents
import { ReportsFilter } from "./components/ReportsFilter";
import { SalesReportView } from "./components/SalesReportView";
import { DriversReportView } from "./components/DriversReportView";
import { DriverDetailModal } from "./components/DriverDetailModal";
import { GeneralStatsView } from "./components/GeneralStatsView";

function ReportsContent() {
  // Helper dates
  const getStartOfMonth = () => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split("T")[0];
  };

  const getToday = () => {
    return new Date().toISOString().split("T")[0];
  };

  // Navigation Hooks
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Read state from URL query parameters (Best practice for deep-linking and bookmarking)
  const reportType = (searchParams.get("type") || "sales_orders") as "sales_orders" | "drivers" | "stats";
  const fromDate = searchParams.get("from") || getStartOfMonth();
  const toDate = searchParams.get("to") || getToday();

  // Local inputs state (to prevent immediate refetching on date keystrokes, applies when clicking "تطبيق الفلتر")
  const [fromDateInput, setFromDateInput] = useState<string>(fromDate);
  const [toDateInput, setToDateInput] = useState<string>(toDate);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data States
  const [salesData, setSalesData] = useState<SalesReportData | null>(null);
  const [ordersData, setOrdersData] = useState<OrdersReportData | null>(null);
  const [driversData, setDriversData] = useState<DriverReportItem[]>([]);
  const [statsData, setStatsData] = useState<{
    customers: number;
    products: number;
    locations: number;
  } | null>(null);

  // Search Filter for Drivers
  const [driverSearch, setDriverSearch] = useState("");

  // Selected Driver Details
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [loadingDriverDetail, setLoadingDriverDetail] = useState(false);
  const [driverDetail, setDriverDetail] = useState<DriverDetailReportData | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<{ name: string; email: string } | null>(null);

  // Sync local inputs when URL parameters change (e.g. back button, initial load, deep links)
  useEffect(() => {
    setFromDateInput(fromDate);
    setToDateInput(toDate);
  }, [fromDate, toDate]);

  // Helper to update query parameters in URL
  const updateQueryParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Fetch Report Data
  const loadReportData = async (type: typeof reportType, from: string, to: string) => {
    setLoading(true);
    setError(null);
    try {
      if (type === "sales_orders") {
        const [salesRes, ordersRes] = await Promise.all([
          getSalesReport(from, to),
          getOrdersReport(from, to),
        ]);

        if (salesRes.success && salesRes.data) {
          setSalesData(salesRes.data);
        } else {
          throw new Error(salesRes.error || "فشل تحميل تقرير المبيعات");
        }

        if (ordersRes.success && ordersRes.data) {
          setOrdersData(ordersRes.data);
        } else {
          throw new Error(ordersRes.error || "فشل تحميل تقرير الطلبات");
        }
      } else if (type === "drivers") {
        const res = await getDeliveryDriversReport(from, to);
        if (res.success && res.data) {
          setDriversData(res.data);
        } else {
          throw new Error(res.error || "فشل تحميل تقرير مناديب التوصيل");
        }
      } else if (type === "stats") {
        const [customersRes, productsRes, locationsRes] = await Promise.all([
          getCustomersReport(),
          getProductsReport(),
          getLocationsReport(),
        ]);

        let customers = 0;
        let products = 0;
        let locations = 0;

        if (customersRes.success && customersRes.data) {
          customers = customersRes.data.total_customers;
        }
        if (productsRes.success && productsRes.data) {
          products = productsRes.data.total_products;
        }
        if (locationsRes.success && locationsRes.data) {
          locations = locationsRes.data.total_locations;
        }

        setStatsData({ customers, products, locations });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "حدث خطأ أثناء تحميل بيانات التقرير.");
      toast.error(err.message || "حدث خطأ أثناء تحميل بيانات التقرير.");
    } finally {
      setLoading(false);
    }
  };

  // Load report on query parameters changes
  useEffect(() => {
    loadReportData(reportType, fromDate, toDate);
  }, [reportType, fromDate, toDate]);

  // Handler for report type change
  const handleReportTypeChange = (newType: typeof reportType) => {
    updateQueryParams({
      type: newType,
      from: newType === "stats" ? null : fromDate,
      to: newType === "stats" ? null : toDate,
    });
  };

  // Handler for applying date filter
  const handleApplyFilter = () => {
    updateQueryParams({
      from: fromDateInput,
      to: toDateInput,
    });
  };

  // View specific driver detail
  const handleViewDriverDetail = async (driverId: number, name: string, email: string) => {
    setSelectedDriver({ name, email });
    setLoadingDriverDetail(true);
    setIsDetailModalOpen(true);
    setDriverDetail(null);
    try {
      const res = await getDeliveryDriverDetailReport(driverId, fromDate, toDate);
      if (res.success && res.data) {
        setDriverDetail(res.data);
      } else {
        toast.error(res.error || "فشل تحميل تفاصيل المندوب");
        setIsDetailModalOpen(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ غير متوقع أثناء تحميل تفاصيل المندوب.");
      setIsDetailModalOpen(false);
    } finally {
      setLoadingDriverDetail(false);
    }
  };

  // CSV Exporter Helper
  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((fieldName) => {
            const val = row[fieldName];
            if (typeof val === "object" && val !== null) {
              return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
            }
            const stringVal = String(val ?? "");
            return `"${stringVal.replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ];

    const csvContent = "\uFEFF" + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCSV = () => {
    try {
      if (reportType === "sales_orders") {
        if (!salesData || !ordersData) {
          toast.error("بيانات التقرير غير متوفرة للتصدير");
          return;
        }
        const dataToExport = [
          { "المؤشر": "إجمالي المبيعات", "القيمة": `${salesData.total_sales} ر.س` },
          { "المؤشر": "إجمالي الطلبات", "القيمة": `${salesData.total_orders} طلب` },
          { "المؤشر": "إجمالي مبالغ الطلبات (باستثناء الملغاة)", "القيمة": `${ordersData.total_amount} ر.س` },
          { "المؤشر": "الطلبات قيد الانتظار", "القيمة": ordersData.pending },
          { "المؤشر": "الطلبات المؤكدة", "القيمة": ordersData.confirmed },
          { "المؤشر": "الطلبات قيد التجهيز", "القيمة": ordersData.processing },
          { "المؤشر": "الطلبات المشحونة", "القيمة": ordersData.shipped },
          { "المؤشر": "الطلبات المسلمة", "القيمة": ordersData.delivered },
          { "المؤشر": "الطلبات الملغاة", "القيمة": ordersData.cancelled },
        ];
        exportToCSV(dataToExport, `تقرير_المبيعات_والطلبات_${fromDate}_إلى_${toDate}.csv`);
        toast.success("تم تصدير تقرير المبيعات كـ Excel بنجاح");
      } else if (reportType === "drivers") {
        if (driversData.length === 0) {
          toast.error("لا توجد بيانات لتصديرها");
          return;
        }
        const dataToExport = driversData.map((d) => ({
          "معرف المندوب": d.id,
          "الاسم": d.name,
          "البريد الإلكتروني": d.email,
          "إجمالي الطلبات": d.total_orders,
          "قيد الانتظار": d.pending_orders,
          "قيد التجهيز": d.processing_orders,
          "تم الشحن": d.shipped_orders,
          "تم التسليم": d.delivered_orders,
          "ملغي": d.cancelled_orders,
          "إجمالي المبيعات (ر.س)": d.total_sales,
        }));
        exportToCSV(dataToExport, `تقرير_أداء_المناديب_${fromDate}_إلى_${toDate}.csv`);
        toast.success("تم تصدير تقرير المناديب بنجاح");
      } else if (reportType === "stats") {
        if (!statsData) {
          toast.error("لا توجد بيانات لتصديرها");
          return;
        }
        const dataToExport = [
          { "البيان": "إجمالي عدد العملاء", "العدد الإجمالي": statsData.customers },
          { "البيان": "إجمالي عدد المنتجات", "العدد الإجمالي": statsData.products },
          { "البيان": "إجمالي عدد مواقع التوصيل", "العدد الإجمالي": statsData.locations },
        ];
        exportToCSV(dataToExport, "تقرير_إحصائيات_المتجر_العامة.csv");
        toast.success("تم تصدير إحصائيات المتجر العامة بنجاح");
      }
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء تصدير الملف كـ Excel");
    }
  };

  return (
    <div className="space-y-6 relative min-h-screen">
      <Toaster position="top-center" />

      {/* Print Only Header */}
      <div className="hidden print:block border-b-2 border-gray-200 pb-4 mb-6 text-right">
        <h1 className="text-3xl font-bold text-gray-900">مجمع البيرق - تقرير إدارة المتجر</h1>
        <p className="text-gray-600 mt-2">
          نوع التقرير:{" "}
          {reportType === "sales_orders"
            ? "المبيعات والطلبات"
            : reportType === "drivers"
            ? "أداء مناديب التوصيل"
            : "إحصائيات المتجر العامة"}
        </p>
        <p className="text-gray-500 text-sm mt-1">
          الفترة: من {fromDate || "الكل"} إلى {toDate || "الكل"}
        </p>
        <p className="text-gray-400 text-xs mt-1">
          تاريخ الاستخراج: {new Date().toLocaleString("ar-SA")}
        </p>
      </div>

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">التقارير المتقدمة</h1>
          <p className="text-gray-500 mt-1">تصدير تقارير مفصلة عن المبيعات، الأرباح، وأداء المتجر.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleExportCSV}
            disabled={loading}
            className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700 border-none"
          >
            <Download className="w-4 h-4" />
            <span>تصدير كـ Excel</span>
          </Button>
          <Button
            onClick={() => window.print()}
            disabled={loading}
            className="flex items-center gap-2 bg-slate-600 text-white hover:bg-slate-700 border-none"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة / PDF</span>
          </Button>
        </div>
      </div>

      {/* Filters Component */}
      <ReportsFilter
        reportType={reportType}
        fromDateInput={fromDateInput}
        toDateInput={toDateInput}
        setFromDateInput={setFromDateInput}
        setToDateInput={setToDateInput}
        loading={loading}
        onReportTypeChange={handleReportTypeChange}
        onApplyFilter={handleApplyFilter}
      />

      {/* Loading and Error States */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="w-12 h-12 text-brand animate-spin" />
          <p className="text-gray-500 font-medium">جاري تحميل بيانات التقرير...</p>
        </div>
      )}

      {!loading && error && (
        <Card className="border-red-100 bg-red-50/50">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
            <AlertTriangle className="w-12 h-12 text-red-500" />
            <h3 className="text-lg font-bold text-red-900">فشل في تحميل التقرير</h3>
            <p className="text-sm text-red-700 max-w-md">{error}</p>
            <Button onClick={handleApplyFilter} className="bg-red-600 text-white hover:bg-red-700 border-none">
              إعادة المحاولة
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Report Content */}
      {!loading && !error && (
        <div className="space-y-6">
          {reportType === "sales_orders" && (
            <SalesReportView
              salesData={salesData}
              ordersData={ordersData}
              fromDate={fromDate}
              toDate={toDate}
            />
          )}

          {reportType === "drivers" && (
            <DriversReportView
              driversData={driversData}
              driverSearch={driverSearch}
              setDriverSearch={setDriverSearch}
              onViewDriverDetail={handleViewDriverDetail}
            />
          )}

          {reportType === "stats" && (
            <GeneralStatsView statsData={statsData} />
          )}
        </div>
      )}

      {/* Driver Detail Modal Component */}
      <DriverDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        loading={loadingDriverDetail}
        driverDetail={driverDetail}
        selectedDriver={selectedDriver}
      />
    </div>
  );
}

export default function ReportsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="w-12 h-12 text-brand animate-spin" />
        <p className="text-gray-500 font-medium">جاري تحميل التقارير...</p>
      </div>
    }>
      <ReportsContent />
    </Suspense>
  );
}
