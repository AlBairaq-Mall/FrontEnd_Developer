"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Send, Bell, Users, Clock } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الإشعارات الجماعية</h1>
          <p className="text-gray-500 mt-1">إرسال إشعارات (Push Notifications) للعملاء عبر التطبيق.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-bold text-gray-800">إرسال إشعار جديد</h3>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">شريحة العملاء المستهدفة</label>
                  <select className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand">
                    <option>جميع العملاء النشطين</option>
                    <option>العملاء الجدد (آخر 30 يوم)</option>
                    <option>عملاء لم يطلبوا منذ فترة</option>
                    <option>العملاء المميزين (VIP)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">عنوان الإشعار</label>
                  <input type="text" placeholder="مثال: خصم خاص لك!" className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">نص الإشعار</label>
                  <textarea rows={4} placeholder="اكتب رسالتك هنا..." className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand resize-none"></textarea>
                  <p className="text-xs text-gray-500 mt-1 text-left">0/150 حرف</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">صورة ترويجية (اختياري)</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                    <p className="text-sm text-gray-500">انقر هنا لرفع صورة أو اسحبها وأفلتها</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-100">
                <button className="flex-1 bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" />
                  <span>إرسال الآن</span>
                </button>
                <button className="flex-1 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>جدولة الإرسال</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <h3 className="text-lg font-bold text-gray-800">سجل الإشعارات</h3>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand shrink-0">
                        <Bell className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-1">عرض نهاية الأسبوع! 🎉</h4>
                        <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                          لا تفوت خصم 20% على جميع المنتجات الطازجة، استخدم كود WEEKEND20
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> قبل يومين</span>
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 12,040 مستلم</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
