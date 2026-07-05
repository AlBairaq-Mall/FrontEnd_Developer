"use client";

import { useActionState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { Lock, Mail, AlertCircle, Loader2, User } from "lucide-react";
import { register } from "@/lib/actions/auth";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(register, null);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4 font-cairo">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-6">
            <Image src="/logo.png" alt="البيرق ماركت" width={120} height={120} className="object-contain" priority />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">إنشاء حساب جديد</h1>
          <p className="text-gray-500 mt-2">انضم إلى لوحة إدارة البيرق الآن</p>
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
                  الاسم الكامل
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                    <User className="h-5 w-5" />
                  </div>
                  <Input 
                    type="text" 
                    name="name"
                    required
                    placeholder="أحمد محمد" 
                    className="pr-10 bg-white" 
                  />
                </div>
              </div>

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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  كلمة المرور
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input 
                    type="password" 
                    name="password"
                    required
                    placeholder="••••••••" 
                    className="pr-10 bg-white" 
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input 
                    type="password" 
                    name="password_confirmation"
                    required
                    placeholder="••••••••" 
                    className="pr-10 bg-white" 
                    dir="ltr"
                  />
                </div>
              </div>

              <Button type="submit" disabled={isPending} className="w-full h-12 text-lg mt-4">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    جاري إنشاء الحساب...
                  </>
                ) : (
                  "إنشاء حساب"
                )}
              </Button>
              
              <div className="text-center mt-6 text-sm text-gray-600">
                لديك حساب بالفعل؟{' '}
                <Link href="/login" className="text-brand font-bold hover:underline">
                  تسجيل الدخول
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
