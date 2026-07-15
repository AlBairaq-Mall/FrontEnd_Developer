"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Grid, Layers, ArrowLeft, SlidersHorizontal } from "lucide-react";

interface ProductsCatalogProps {
  initialProducts: any[];
  categories: any[];
  units: any[];
}

export function ProductsCatalog({ initialProducts, categories, units }: ProductsCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedUnit, setSelectedUnit] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  // Filtering Logic
  const filteredProducts = initialProducts.filter((product) => {
    const matchesSearch = 
      product.name_ar?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.name_en?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode?.includes(searchQuery) ||
      product.unique_number?.includes(searchQuery);

    const matchesCategory = 
      selectedCategory === "all" || 
      product.category?.id?.toString() === selectedCategory;

    const matchesUnit = 
      selectedUnit === "all" || 
      product.unit?.id?.toString() === selectedUnit;

    return matchesSearch && matchesCategory && matchesUnit;
  });

  // Sorting Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "name-ar") {
      return a.name_ar?.localeCompare(b.name_ar);
    }
    if (sortBy === "newest") {
      return b.id - a.id;
    }
    return 0;
  });

  return (
    <div className="space-y-8" dir="rtl">
      {/* Search and Filters panel */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        
        {/* Row 1: Search & Sort */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <input
              type="text"
              placeholder="ابحث عن منتج بالاسم، الباركود، أو الرقم المميز..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-12 py-3.5 border border-gray-200 focus:border-brand rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-brand/5 transition-all"
            />
            <Search className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
          </div>
          
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3.5 border border-gray-200 focus:border-brand rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-brand/5 appearance-none bg-no-repeat bg-[left_1rem_center] transition-all cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")` }}
            >
              <option value="newest">ترتيب: الأحدث أولاً</option>
              <option value="name-ar">ترتيب: أبجدياً (العربية)</option>
            </select>
          </div>
        </div>

        {/* Row 2: Category Tabs */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 block">التصفية حسب القسم</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === "all"
                  ? "bg-brand text-white shadow-md shadow-brand/15"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              كل الأقسام
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id.toString())}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat.id.toString()
                    ? "bg-brand text-white shadow-md shadow-brand/15"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {cat.name_ar}
              </button>
            ))}
          </div>
        </div>

        {/* Row 3: Unit Filters */}
        {units.length > 0 && (
          <div className="space-y-3 pt-2 border-t border-gray-50">
            <label className="text-xs font-bold text-gray-400 block">التصفية حسب وحدة القياس</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedUnit("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedUnit === "all"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
              >
                الكل
              </button>
              {units.map((unit) => (
                <button
                  key={unit.id}
                  onClick={() => setSelectedUnit(unit.id.toString())}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedUnit === unit.id.toString()
                      ? "bg-gray-900 text-white"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {unit.name_ar} ({unit.symbol})
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Products Grid */}
      {sortedProducts.length === 0 ? (
        <div className="bg-white border border-gray-150 rounded-3xl p-16 text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-400 mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">لا توجد منتجات مطابقة</h3>
          <p className="text-gray-500 text-sm mt-2">
            لم نجد أي منتجات تطابق خيارات التصفية أو البحث التي قمت بتحديدها حالياً.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedUnit("all");
            }}
            className="mt-6 inline-flex items-center justify-center bg-gray-100 hover:bg-gray-250 text-gray-700 px-5 py-2.5 rounded-full font-bold text-xs transition-colors"
          >
            إعادة تعيين خيارات البحث
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedProducts.map((product) => (
            <div 
              key={product.id}
              className="group bg-white rounded-3xl border border-gray-100 hover:border-brand/30 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Product Image */}
              <div className="relative aspect-video w-full bg-gray-50 overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={`https://backend-albarqy.onrender.com/storage/${product.images[0].image}`} 
                    alt={product.name_ar} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80" }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-gold/5 flex flex-col items-center justify-center text-brand/60 gap-2">
                    <ShoppingBag className="w-10 h-10" />
                    <span className="text-xs font-semibold">البيرق ماركت</span>
                  </div>
                )}
                
                {/* Category Badge */}
                {product.category && (
                  <span className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                    {product.category.name_ar}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-gray-400">باركود: {product.barcode || '-'}</span>
                  <h3 className="font-bold text-gray-900 text-lg leading-snug line-clamp-1">{product.name_ar}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{product.name_en || '-'}</p>
                </div>
                
                <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 font-medium">الرقم المميز</p>
                    <p className="font-extrabold text-gray-900 text-sm">{product.unique_number || '-'}</p>
                  </div>
                  <Link
                    href={`/products/${product.id}`}
                    className="inline-flex items-center gap-1 text-sm font-bold text-brand group-hover:text-brand-dark group-hover:-translate-x-1 transition-all"
                  >
                    <span>تفاصيل أكثر</span>
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
