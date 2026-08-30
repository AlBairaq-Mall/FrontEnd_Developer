"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Truck, Eye } from "lucide-react";
import { DriverReportItem } from "@/lib/actions/reports";

interface DriversReportViewProps {
  driversData: DriverReportItem[];
  driverSearch: string;
  setDriverSearch: (val: string) => void;
  onViewDriverDetail: (id: number, name: string, email: string) => void;
}

export function DriversReportView({
  driversData,
  driverSearch,
  setDriverSearch,
  onViewDriverDetail,
}: DriversReportViewProps) {
  // Filter drivers locally by search query
  const filteredDrivers = driversData.filter(
    (d) =>
      d.name?.toLowerCase().includes(driverSearch.toLowerCase()) ||
      d.email?.toLowerCase().includes(driverSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Drivers Header Controls - Commented out by User Choice */}
      {/* 
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="ابحث باسم المندوب أو بريده..."
            value={driverSearch}
            onChange={(e) => setDriverSearch(e.target.value)}
            className="block w-full rounded-lg border-gray-300 bg-gray-50 border px-4 py-2 text-gray-900 focus:border-brand focus:ring-brand sm:text-sm transition-colors"
          />
        </div>
        <div className="text-sm text-gray-500 font-medium">
          عدد المناديب المتوفرين: <span className="text-brand font-bold">{filteredDrivers.length}</span>
        </div>
      </div> 
      */}

      {/* Drivers Table Card */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>معرف المندوب</TableHead>
                <TableHead>المندوب</TableHead>
                <TableHead className="text-center">الطلبات المسندة</TableHead>
                <TableHead className="text-center text-yellow-600">قيد الانتظار</TableHead>
                <TableHead className="text-center text-purple-600">قيد التجهيز</TableHead>
                <TableHead className="text-center text-orange-600">تم الشحن</TableHead>
                <TableHead className="text-center text-green-700">تم التسليم</TableHead>
                <TableHead className="text-center text-red-600">الملغاة</TableHead>
                <TableHead className="text-center font-bold">المبيعات المحققة</TableHead>
                <TableHead className="print:hidden">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDrivers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                    لا يوجد مناديب تطابق معايير البحث
                  </TableCell>
                </TableRow>
              ) : (
                filteredDrivers.map((driver, index) => (
                  <TableRow key={driver.id || index}>
                    <TableCell className="font-mono text-gray-500">#{driver.id}</TableCell>
                    <TableCell className="font-semibold text-gray-900">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-brand shrink-0" />
                        <div>
                          <div className="font-bold text-gray-900">{driver.name}</div>
                          <div className="text-xs text-gray-400 font-normal">{driver.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium text-gray-900">{driver.total_orders}</TableCell>
                    <TableCell className="text-center text-yellow-600 font-semibold">{driver.pending_orders}</TableCell>
                    <TableCell className="text-center text-purple-600 font-semibold">{driver.processing_orders}</TableCell>
                    <TableCell className="text-center text-orange-600 font-semibold">{driver.shipped_orders}</TableCell>
                    <TableCell className="text-center text-green-700 font-bold">{driver.delivered_orders}</TableCell>
                    <TableCell className="text-center text-red-600 font-bold">{driver.cancelled_orders}</TableCell>
                    <TableCell className="text-center font-bold text-gray-900">
                      {driver.total_sales.toLocaleString("ar-SA")} ر.ي
                    </TableCell>
                    <TableCell className="print:hidden">
                      <Button
                        onClick={() => onViewDriverDetail(driver.id, driver.name, driver.email)}
                        className="flex items-center gap-1 text-xs px-3 py-1 bg-brand/10 text-brand hover:bg-brand/20 border-none rounded-lg"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>عرض تفصيلي</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
