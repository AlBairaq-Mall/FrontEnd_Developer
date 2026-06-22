"use client";

import { usePathname } from "next/navigation";

const routeNames: Record<string, string> = {
  "/": "لوحة القيادة",
  "/orders": "الطلبات",
  "/products": "المنتجات",
  "/customers": "العملاء",
  "/branches": "الفروع والمناطق",
  "/settings": "الإعدادات",
};

export default function Header() {
  const pathname = usePathname();
  const pageName = routeNames[pathname] || "لوحة القيادة";

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
      <div className="text-xl font-bold text-gray-800">
        {pageName}
      </div>

      <div className="flex items-center gap-4">
        <div className="text-gray-700 font-medium">المدير العام</div>
        <div className="w-10 h-10 rounded-full bg-green-100 text-brand flex items-center justify-center font-bold text-lg">
          م
        </div>
      </div>
    </header>
  );
}
