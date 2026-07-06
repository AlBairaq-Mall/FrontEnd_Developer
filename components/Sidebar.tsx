"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/actions/auth";
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
  ChevronUp,
  Percent
} from "lucide-react";
import { useState, useTransition } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isLoggingOut, startLogout] = useTransition();

  // A simple state for toggling groups could be added, but for simplicity we'll keep them open
  // or just use a flat stylized list if preferred. Let's use groups.

  const menuGroups = [
    {
      title: "الرئيسية",
      links: [
        { href: "/dashboard", label: "لوحة القيادة", icon: LayoutDashboard },
      ]
    },
    {
      title: "الكتالوج",
      links: [
        { href: "/dashboard/categories", label: "الأقسام", icon: Tags },
        { href: "/dashboard/units", label: "الوحدات", icon: Archive },
        { href: "/dashboard/products", label: "المنتجات", icon: Package },
       ]
    },
    // {
    //   title: "المخزون",
    //   links: [
    //     { href: "/dashboard/inventory", label: "إدارة المخزون", icon: Archive },
    //   ]
    // },
    {
      title: "المبيعات",
      links: [
        { href: "/dashboard/orders", label: "الطلبات", icon: ShoppingCart },
      ]
    },
    {
      title: "اللوجستيات",
      links: [
         { href: "/dashboard/drivers", label: "المندوبين", icon: Truck },
      ]
    },
    {
      title: "التسويق والعملاء",
      links: [
        { href: "/dashboard/offers", label: "العروض", icon: Percent },
        { href: "/dashboard/customers", label: "العملاء", icon: Users },
        // { href: "/dashboard/coupons", label: "الكوبونات", icon: Ticket },
        { href: "/dashboard/notifications", label: "الإشعارات", icon: Bell },
      ]
    },
    {
      title: "التقارير",
      links: [
        { href: "/dashboard/reports", label: "التقارير المتقدمة", icon: FileBarChart },
      ]
    },
    // {
    //   title: "الإعدادات",
    //   links: [
    //     { href: "/dashboard/settings", label: "الموظفين والأدوار", icon: Settings },
    //     { href: "/dashboard/settings/audit", label: "سجل النظام", icon: ShieldAlert },
    //   ]
    // }
  ];

  return (
    <aside className="w-64 bg-sidebar text-white flex flex-col min-h-screen sticky top-0 shrink-0 overflow-y-auto custom-scrollbar">
      <div className="p-4 sticky top-0 bg-sidebar z-10 border-b border-sidebar-hover/50 flex justify-center items-center">
        <div className="bg-white p-2 rounded-xl">
          <Image src="/logo.png" alt="البيرق ماركت" width={100} height={100} className="object-contain" priority />
        </div>
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
                const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${isActive
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
        <button
          disabled={isLoggingOut}
          onClick={() => startLogout(() => logout())}
          className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg transition-colors font-medium text-sm ${isLoggingOut
              ? "text-red-300 bg-red-500/10 cursor-not-allowed opacity-70"
              : "text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
            }`}
        >
          {isLoggingOut ? (
            <div className="w-5 h-5 border-2 border-red-300 border-t-transparent rounded-full animate-spin" />
          ) : (
            <LogOut className="w-5 h-5" />
          )}
          <span>{isLoggingOut ? "جاري الخروج..." : "تسجيل الخروج"}</span>
        </button>
      </div>
    </aside>
  );
}
