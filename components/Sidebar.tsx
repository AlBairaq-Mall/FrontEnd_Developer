"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  MapPin, 
  Settings, 
  LogOut,
  Tags,
  Image as ImageIcon,
  Archive,
  ShoppingCart,
  Undo2,
  Truck,
  Ticket,
  Bell,
  FileBarChart,
  ShieldAlert,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  
  // A simple state for toggling groups could be added, but for simplicity we'll keep them open
  // or just use a flat stylized list if preferred. Let's use groups.

  const menuGroups = [
    {
      title: "الرئيسية",
      links: [
        { href: "/", label: "لوحة القيادة", icon: LayoutDashboard },
      ]
    },
    {
      title: "الكتالوج",
      links: [
        { href: "/categories", label: "الأقسام", icon: Tags },
        { href: "/products", label: "المنتجات", icon: Package },
        { href: "/media", label: "الوسائط", icon: ImageIcon },
      ]
    },
    {
      title: "المخزون",
      links: [
        { href: "/inventory", label: "إدارة المخزون", icon: Archive },
      ]
    },
    {
      title: "المبيعات",
      links: [
        { href: "/orders", label: "الطلبات", icon: ShoppingCart },
        { href: "/refunds", label: "المستردات", icon: Undo2 },
      ]
    },
    {
      title: "اللوجستيات",
      links: [
        { href: "/branches", label: "الفروع والمناطق", icon: MapPin },
        { href: "/drivers", label: "المندوبين", icon: Truck },
      ]
    },
    {
      title: "التسويق والعملاء",
      links: [
        { href: "/customers", label: "العملاء", icon: Users },
        { href: "/coupons", label: "الكوبونات", icon: Ticket },
        { href: "/notifications", label: "الإشعارات", icon: Bell },
      ]
    },
    {
      title: "التقارير",
      links: [
        { href: "/reports", label: "التقارير المتقدمة", icon: FileBarChart },
      ]
    },
    {
      title: "الإعدادات",
      links: [
        { href: "/settings", label: "الموظفين والأدوار", icon: Settings },
        { href: "/settings/audit", label: "سجل النظام", icon: ShieldAlert },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-sidebar text-white flex flex-col min-h-screen sticky top-0 shrink-0 overflow-y-auto custom-scrollbar">
      <div className="p-6 text-xl font-bold text-brand sticky top-0 bg-sidebar z-10 border-b border-sidebar-hover/50">
        لوحة الإدارة
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-6">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-2">
            {group.title !== "الرئيسية" && (
              <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                {group.title}
              </p>
            )}
            <div className="space-y-1">
              {group.links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                      isActive 
                        ? "bg-brand text-white shadow-md shadow-brand/20" 
                        : "text-gray-300 hover:bg-sidebar-hover hover:text-white"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    <span className="font-medium text-sm">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-sidebar-hover/50 bg-sidebar sticky bottom-0">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors font-medium text-sm">
          <LogOut className="w-5 h-5" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
