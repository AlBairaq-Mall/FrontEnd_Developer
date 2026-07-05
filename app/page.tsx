import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, UserPlus } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "البيرق ماركت - نظام الإدارة المتكامل",
  description: "الحل الأمثل لإدارة متجرك الإلكتروني بكفاءة عالية. تتبع مبيعاتك، أدر مخزونك، وتواصل مع عملائك من خلال لوحة تحكم واحدة متطورة.",
  openGraph: {
    title: "البيرق ماركت - نظام الإدارة المتكامل",
    description: "الحل الأمثل لإدارة متجرك الإلكتروني بكفاءة عالية.",
    siteName: "البيرق ماركت",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "شعار البيرق ماركت",
      },
    ],
    locale: "ar_SA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "البيرق ماركت - نظام الإدارة المتكامل",
    description: "الحل الأمثل لإدارة متجرك الإلكتروني بكفاءة عالية.",
    images: ["/logo.png"],
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-cairo selection:bg-brand/20 selection:text-brand">

      {/* Navigation Bar */}
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="البيرق ماركت" width={100} height={40} className="object-contain" priority />
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-brand font-bold px-4 py-2.5 transition-colors"
              >
                إنشاء حساب
                <UserPlus className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-md shadow-brand/20 hover:shadow-lg hover:shadow-brand/30 hover:-translate-y-0.5"
              >
                تسجيل الدخول
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>
 
      {/* Footer */}
      <footer className="bg-transparent py-6 mt-auto border-t border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} نظام البيرق. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
