import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-cairo selection:bg-brand/20 selection:text-brand">

      {/* Navigation Bar */}
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white shadow-lg shadow-brand/20">
                <span className="font-bold text-xl">ب</span>
              </div>
              <span className="font-bold text-2xl text-gray-900 tracking-tight">البيرق</span>
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
