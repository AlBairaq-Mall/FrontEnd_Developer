"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Box, 
  Package, 
  Users, 
  MapPin, 
  Settings, 
  LogOut 
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "لوحة القيادة", icon: LayoutDashboard },
    { href: "/orders", label: "الطلبات", icon: Box },
    { href: "/products", label: "المنتجات", icon: Package },
    { href: "/customers", label: "العملاء", icon: Users },
    { href: "/branches", label: "الفروع والمناطق", icon: MapPin },
    { href: "/settings", label: "الإعدادات", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-sidebar text-white flex flex-col min-h-screen sticky top-0 shrink-0">
      <div className="p-6 text-xl font-bold text-brand">
        لوحة الإدارة
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? "bg-brand text-white" 
                  : "text-gray-300 hover:bg-sidebar-hover hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mb-4 mt-auto">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-sidebar-hover hover:text-red-300 rounded-lg transition-colors">
          <LogOut className="w-5 h-5" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
