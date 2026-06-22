"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Edit, Package, DollarSign, Activity } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params.id;

  // Mock product data
  const product = {
    id: productId,
    name: "تفاح أحمر طازج",
    description: "تفاح أحمر طازج عالي الجودة مستورد من مزارع مختارة بعناية. يتميز بطعمه المقرمش ونكهته الحلوة، مناسب للاستهلاك اليومي ولتحضير العصائر والحلويات.",
    price: "12.5 ر.س",
    cost: "8.0 ر.س",
    stock: "145",
    sku: "PRD-1001",
    category: "خضار وفواكه",
    status: "نشط",
    statusColor: "success" as const,
    sold: 432,
    dateAdded: "2024-05-10",
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/products" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors text-gray-600">
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
              <span>{product.sku}</span>
              <span>•</span>
              <span>{product.category}</span>
            </div>
          </div>
        </div>
        
        <Link href={`/products/${productId}/edit`}>
          <Button className="gap-2">
            <Edit className="w-4 h-4" />
            تعديل المنتج
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-bold text-gray-800">تفاصيل المنتج</h3>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <div>
                <span className="block text-sm font-medium text-gray-500 mb-1">الوصف</span>
                <p className="leading-relaxed">{product.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <span className="block text-sm font-medium text-gray-500 mb-1">تاريخ الإضافة</span>
                  <p>{product.dateAdded}</p>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500 mb-1">مرات البيع</span>
                  <p>{product.sold} مرة</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-0">
              {/* Image Placeholder */}
              <div className="h-64 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gray-200"></div>
                <span className="relative text-gray-400 font-medium z-10 bg-white/80 px-4 py-2 rounded-full shadow-sm">صورة المنتج غير متوفرة</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">حالة المنتج</span>
                <Badge variant={product.statusColor} className="text-sm px-3 py-1">
                  {product.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader className="pb-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-gray-400" />
                التسعير
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-500">سعر البيع</span>
                <span className="font-bold text-brand text-lg">{product.price}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-500">سعر التكلفة</span>
                <span className="font-bold text-gray-900">{product.cost}</span>
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card>
            <CardHeader className="pb-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-400" />
                المخزون
              </h3>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
                <span className="text-3xl font-bold text-gray-900">{product.stock}</span>
                <span className="text-sm text-gray-500 mt-1">قطعة متوفرة</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
