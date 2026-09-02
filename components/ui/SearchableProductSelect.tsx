"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Search, X, ChevronDown, Check, Package, Loader2, AlertCircle } from "lucide-react";
import { searchProducts } from "@/lib/actions/products";

interface SearchableProductSelectProps {
  products?: any[]; // Initial product list if already loaded
  value: string; // selected product id
  onChange: (productId: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

function getProductPrice(p: any): string | number | null {
  if (!p) return null;
  if (p.price !== undefined && p.price !== null && p.price !== "") {
    return p.price;
  }
  if (p.selling_price !== undefined && p.selling_price !== null && p.selling_price !== "") {
    return p.selling_price;
  }
  if (p.units && Array.isArray(p.units) && p.units.length > 0) {
    for (const u of p.units) {
      const up = u.price ?? u.pivot?.price;
      if (up !== undefined && up !== null && up !== "") {
        return up;
      }
    }
  }
  return null;
}

export function SearchableProductSelect({
  products = [],
  value,
  onChange,
  placeholder = "ابحث واختر منتجاً...",
  disabled = false,
  required = false,
  className = "",
}: SearchableProductSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>(products);
  const [isLoading, setIsLoading] = useState(false);
  const [isServerSearched, setIsServerSearched] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cache to remember selected products across different searches
  const productsMapRef = useRef<Map<string, any>>(new Map());

  // Store initial products into cache
  useEffect(() => {
    products.forEach((p: any) => {
      if (p && p.id) {
        productsMapRef.current.set(p.id.toString(), p);
      }
    });
    // If not actively searching, keep searchResults synchronized with products prop
    if (!searchTerm.trim() && !isServerSearched) {
      setSearchResults(products);
    }
  }, [products]);

  // Find currently selected product (from cache, searchResults, or initial products)
  const selectedProduct =
    productsMapRef.current.get(value?.toString()) ||
    searchResults.find((p: any) => p.id?.toString() === value?.toString()) ||
    products.find((p: any) => p.id?.toString() === value?.toString());

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Server-side search execution
  const executeServerSearch = useCallback(async (query: string) => {
    const trimmed = query.trim();

    // Must be at least 2 characters
    if (trimmed.length < 2) {
      setSearchResults(products);
      setIsLoading(false);
      setIsServerSearched(false);
      return;
    }

    setIsLoading(true);
    setIsServerSearched(true);

    try {
      const res = await searchProducts(trimmed);
      if (res.success && Array.isArray(res.data)) {
        setSearchResults(res.data);
        // Cache fetched products
        res.data.forEach((p: any) => {
          if (p && p.id) {
            productsMapRef.current.set(p.id.toString(), p);
          }
        });
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Failed to execute server search for products:", err);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [products]);

  // Handle typing with 2-second debounce and 2-character minimum
  const handleSearchChange = (val: string) => {
    setSearchTerm(val);

    // Cancel any previous pending search timer
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    const trimmed = val.trim();

    // If empty
    if (!trimmed) {
      setSearchResults(products);
      setIsLoading(false);
      setIsServerSearched(false);
      return;
    }

    // If less than 2 characters, do NOT search on server
    if (trimmed.length < 2) {
      setIsLoading(false);
      setIsServerSearched(false);
      setSearchResults(products);
      return;
    }

    // If 2 or more characters, wait 2 seconds (2000ms) after user stops typing
    setIsLoading(true);
    searchTimeoutRef.current = setTimeout(() => {
      executeServerSearch(trimmed);
    }, 2000);
  };

  const handleSelect = (productId: string) => {
    onChange(productId);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef} dir="rtl">
      {/* Hidden input for HTML5 form validation if required */}
      {required && (
        <input
          type="text"
          value={value || ""}
          required
          tabIndex={-1}
          className="opacity-0 absolute inset-0 pointer-events-none w-full h-full -z-10"
          onChange={() => {}}
        />
      )}

      {/* Main Trigger Button - Larger, Clearer & Styled with Best Practice */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full min-h-[48px] flex items-center justify-between border rounded-xl px-4 py-2.5 text-sm text-right transition-all bg-white shadow-sm ${
          isOpen
            ? "border-brand ring-2 ring-brand/25 shadow-md bg-amber-50/10"
            : "border-gray-300 hover:border-brand/70 hover:bg-gray-50/50"
        } ${disabled ? "bg-gray-100 cursor-not-allowed opacity-60" : "cursor-pointer"}`}
      >
        <div className="flex items-center gap-3 overflow-hidden flex-1">
          <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 shrink-0">
            <Search className="w-4 h-4 text-brand" />
          </div>

          {selectedProduct ? (
            <div className="flex items-center gap-2.5 truncate flex-1">
              {selectedProduct.images && selectedProduct.images.length > 0 ? (
                <img
                  src={`https://backend-albarqy.onrender.com/storage/${selectedProduct.images[0].image}`}
                  alt=""
                  className="w-8 h-8 rounded-lg object-cover border border-gray-200 shrink-0 shadow-xs"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : null}
              <div className="truncate">
                <span className="font-bold text-gray-900 text-sm block truncate">
                  {selectedProduct.name_ar || selectedProduct.name || `منتج #${selectedProduct.id}`}
                </span>
                {selectedProduct.name_en && (
                  <span className="text-[11px] text-gray-400 block truncate -mt-0.5">
                    {selectedProduct.name_en}
                  </span>
                )}
              </div>
              {selectedProduct.barcode && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-mono shrink-0 border border-gray-200">
                  {selectedProduct.barcode}
                </span>
              )}

              {/* Selected product price badge */}
              {(() => {
                const selPrice = getProductPrice(selectedProduct);
                if (selPrice === null) return null;
                const formatted = !isNaN(Number(selPrice)) ? Number(selPrice).toLocaleString() : selPrice;
                return (
                  <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-mono font-bold shrink-0">
                    {formatted} ر.ي
                  </span>
                );
              })()}
            </div>
          ) : (
            <span className="text-gray-400 text-sm font-medium">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 mr-2">
          {selectedProduct && !disabled && (
            <span
              role="button"
              onClick={handleClear}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="إلغاء التحديد"
            >
              <X className="w-4 h-4" />
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-brand" : ""
            }`}
          />
        </div>
      </button>

      {/* Dropdown Popup - Larger, Clearer and Distinct Presentation */}
      {isOpen && (
        <div className="w-[420px] max-w-[90vw] absolute z-50 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          
          {/* Top Search Bar with Status Header */}
          <div className="p-3.5 border-b border-gray-100 bg-gray-50/90 sticky top-0 z-10 space-y-2.5">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    // If user presses enter with >= 2 chars, execute search immediately without waiting 2 seconds
                    if (searchTerm.trim().length >= 2) {
                      if (searchTimeoutRef.current) {
                        clearTimeout(searchTimeoutRef.current);
                      }
                      executeServerSearch(searchTerm.trim());
                    }
                  } else if (e.key === "Escape") {
                    setIsOpen(false);
                  }
                }}
                placeholder="اكتب اسم المنتج أو الباركود للبحث"
                className="w-full pr-11 pl-11 py-3 bg-white border border-gray-300 focus:border-brand rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand/30 shadow-sm placeholder:text-gray-400 transition-all"
              />
              
              {/* Spinner when loading from server, or Search icon */}
              {isLoading ? (
                <Loader2 className="w-4 h-4 text-brand animate-spin absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              ) : (
                <Search className="w-4 h-4 text-brand absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              )}

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => handleSearchChange("")}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Clear Status / Hint Messages */}
            <div className="flex items-center justify-between text-xs px-1">
              {searchTerm.trim().length > 0 && searchTerm.trim().length < 2 ? (
                <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>اكتب حرفين على الأقل للبحث </span>
                </span>
              ) : isLoading ? (
                <span className="inline-flex items-center gap-1.5 text-brand bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60 font-medium">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>يبدأ البحث بعد ثانيتين من التوقف عن الكتابة...</span>
                </span>
              ) : isServerSearched ? (
                <span className="text-gray-600 font-medium">
                  نتائج البحث من السيرفر:
                </span>
              ) : (
                <span className="text-gray-500 font-medium">
                  قائمة المنتجات المتوفرة:
                </span>
              )}

              <span className="text-brand font-bold bg-white px-2 py-0.5 rounded-md border border-gray-100 shadow-xs">
                {isLoading ? "جاري الاستعلام..." : `${searchResults.length} منتج`}
              </span>
            </div>
          </div>

          {/* Products List */}
          <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 p-1">
            {isLoading && searchResults.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-500 flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 text-brand animate-spin" />
                <span>جاري البحث في قاعدة البيانات عبر السيرفر...</span>
              </div>
            ) : searchResults.length > 0 ? (
              searchResults.map((p: any) => {
                const isSelected = p.id?.toString() === value?.toString();
                const productPrice = getProductPrice(p);
                const formattedPrice = productPrice !== null && !isNaN(Number(productPrice))
                  ? Number(productPrice).toLocaleString()
                  : productPrice;

                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelect(p.id.toString())}
                    className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-brand/10 text-brand font-medium"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden flex-1">
                      {p.images && p.images.length > 0 ? (
                        <img
                          src={`https://backend-albarqy.onrender.com/storage/${p.images[0].image}`}
                          alt=""
                          className="w-9 h-9 rounded-lg object-cover border border-gray-200 shrink-0 shadow-xs"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                          <Package className="w-4 h-4" />
                        </div>
                      )}
                      
                      <div className="truncate flex-1">
                        <p className={`text-xs truncate ${isSelected ? "font-bold text-brand" : "font-medium text-gray-900"}`}>
                          {p.name_ar || p.name || p.title || `منتج #${p.id}`}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 truncate mt-0.5">
                          {p.name_en && <span className="truncate">{p.name_en}</span>}
                          {p.barcode && (
                            <span className="font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px] border border-gray-200">
                              {p.barcode}
                            </span>
                          )}
                          {p.category?.name_ar && (
                            <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded text-[10px]">
                              {p.category.name_ar}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Price & Selection Indicator */}
                    <div className="flex items-center gap-2 shrink-0 mr-2">
                      {formattedPrice !== null && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200/80 text-emerald-700 font-bold text-xs font-mono shadow-xs">
                          <span>{formattedPrice}</span>
                          <span className="text-[10px] font-sans font-normal text-emerald-600">ر.ي</span>
                        </span>
                      )}

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-brand text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center text-xs text-gray-400 space-y-1">
                <Search className="w-6 h-6 mx-auto text-gray-300 stroke-1" />
                <p>لا توجد منتجات مطابقة في السيرفر لـ "{searchTerm}"</p>
                <p className="text-[10px] text-gray-400">تأكد من كتابة اسم المنتج أو الباركود بشكل دقيق</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
