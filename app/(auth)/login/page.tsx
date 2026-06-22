"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Lock, Mail } from "lucide-react";

export default function LoginPage() {
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
            <form className="space-y-6">
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
                    placeholder="admin@example.com" 
                    className="pr-10 bg-white" 
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    كلمة المرور
                  </label>
                  <a href="#" className="text-sm font-medium text-brand hover:text-brand-dark">
                    نسيت كلمة المرور؟
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="pr-10 bg-white" 
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-brand focus:ring-brand border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="mr-2 block text-sm text-gray-900">
                  تذكرني
                </label>
              </div>

              <Link href="/" passHref legacyBehavior>
                <Button className="w-full h-12 text-lg">
                  تسجيل الدخول
                </Button>
              </Link>
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
