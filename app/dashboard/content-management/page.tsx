import { fetchApi } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/Card";
import Link from "next/link";
import { Info, PhoneCall, HelpCircle, FileText, ChevronLeft } from "lucide-react";

export const metadata = {
  title: "إدارة المحتوى | لوحة التحكم",
};

interface ContentSection {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgLight: string;
  statLabel: string;
  endpoint: string;
}

export default async function ContentManagementPage() {
  const sections: ContentSection[] = [
    {
      title: "من نحن",
      description: "إدارة الفقرات التعريفية بالشركة، وتاريخ التأسيس والرسالة والأهداف.",
      href: "/dashboard/content-management/about-us",
      icon: Info,
      color: "text-blue-600",
      bgLight: "bg-blue-50 border-blue-100",
      statLabel: "فقرة تعريفية",
      endpoint: "/about-us"
    },
    {
      title: "بيانات التواصل",
      description: "إدارة أرقام الهواتف، حسابات الواتساب، البريد الإلكتروني، والروابط والموقع الجغرافي.",
      href: "/dashboard/content-management/contact-infos",
      icon: PhoneCall,
      color: "text-green-600",
      bgLight: "bg-green-50 border-green-100",
      statLabel: "وسيلة اتصال",
      endpoint: "/contact-infos"
    },
    {
      title: "الأسئلة الشائعة",
      description: "إدارة الأسئلة المتكررة من العملاء وإجاباتها وتصنيفاتها لتسهيل الدعم الذاتي.",
      href: "/dashboard/content-management/faqs",
      icon: HelpCircle,
      color: "text-purple-600",
      bgLight: "bg-purple-50 border-purple-100",
      statLabel: "سؤال شائع",
      endpoint: "/faqs"
    },
    {
      title: "سياسة الخصوصية",
      description: "صياغة بنود سياسة الخصوصية، شروط الاستخدام، وحماية البيانات وترتيب ظهورها.",
      href: "/dashboard/content-management/privacy-policies",
      icon: FileText,
      color: "text-orange-600",
      bgLight: "bg-orange-50 border-orange-100",
      statLabel: "بند خصوصية",
      endpoint: "/privacy-policies"
    }
  ];

  // Fetch counts in parallel
  const counts = await Promise.all(
    sections.map(async (sec) => {
      try {
        const res = await fetchApi(`${sec.endpoint}?paginate=true&per_page=1`);
        if (res.ok) {
          const json = await res.json();
          return json.meta?.total ?? 0;
        }
      } catch (err) {
        console.error(`Failed to fetch count for ${sec.endpoint}:`, err);
      }
      return 0;
    })
  );

  return (
    <div className="space-y-8" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">إدارة المحتوى</h1>
        <p className="text-gray-500 mt-1">
          إدارة وتحديث الصفحات التعريفية والمعلومات العامة الموجهة للعملاء على التطبيق والمتجر.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, index) => {
          const IconComponent = section.icon;
          const count = counts[index];
          
          return (
            <Link key={section.href} href={section.href} className="group block">
              <Card className="h-full hover:shadow-md hover:-translate-y-1 transition-all duration-300 border border-gray-100 relative overflow-hidden bg-white">
                <CardContent className="p-6 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl border ${section.bgLight} ${section.color}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                        {count} {section.statLabel}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-brand transition-colors mb-2">
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-6">
                      {section.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-sm font-semibold text-brand group-hover:gap-2 transition-all mt-auto">
                    <span>إدارة القسم</span>
                    <ChevronLeft className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
