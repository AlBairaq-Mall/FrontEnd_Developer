"use client";

import { useActionState, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Lock, Mail, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { login } from "@/lib/actions/auth";

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, null);
    const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand/10 text-brand mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">مرحباً بك مجدداً</h1>
          <p className="text-gray-500 mt-2">تسجيل الدخول إلى لوحة إدارة البيرق</p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-8">
            <form action={formAction} className="space-y-6">
              {state?.error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{state.error}</span>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <Input 
                    type="email" 
                    name="email"
                    required
                    placeholder="admin@example.com" 
                    className="pr-10 bg-white" 
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    كلمة المرور
                  </label>
                  {/* <a href="#" className="text-sm font-medium text-brand hover:text-brand-dark">
                    نسيت كلمة المرور؟
                  </a> */}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    required
                    placeholder="••••••••" 
                    className="pr-10 pl-10 bg-white" 
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={isPending} className="w-full h-12 text-lg">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  "تسجيل الدخول"
                )}
              </Button>

              <div className="text-center mt-6 text-sm text-gray-600">
                ليس لديك حساب؟{' '}
                <Link href="/register" className="text-brand font-bold hover:underline">
                  إنشاء حساب جديد
                </Link>
              </div>
            </form>
          </CardContent>

        </Card>
        
        <p className="text-center text-sm text-gray-500 mt-6">
          © {new Date().getFullYear()} البيرق. جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  );
}
