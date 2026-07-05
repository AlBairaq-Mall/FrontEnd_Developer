"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Upload, Search, Image as ImageIcon, Folder, MoreVertical, FileText, Video } from "lucide-react";

export default function MediaLibraryPage() {
  const mediaItems = [
    { id: 1, name: "product-1-front.jpg", type: "image", size: "2.4 MB", date: "23 يونيو 2026", url: "#" },
    { id: 2, name: "product-1-back.jpg", type: "image", size: "1.8 MB", date: "23 يونيو 2026", url: "#" },
    { id: 3, name: "promo-banner.png", type: "image", size: "4.1 MB", date: "22 يونيو 2026", url: "#" },
    { id: 4, name: "summer-campaign", type: "folder", size: "--", date: "21 يونيو 2026", url: "#" },
    { id: 5, name: "user-guide.pdf", type: "document", size: "8.5 MB", date: "20 يونيو 2026", url: "#" },
    { id: 6, name: "promo-video.mp4", type: "video", size: "45.2 MB", date: "19 يونيو 2026", url: "#" },
    { id: 7, name: "logo-white.svg", type: "image", size: "0.5 MB", date: "18 يونيو 2026", url: "#" },
    { id: 8, name: "category-icons", type: "folder", size: "--", date: "15 يونيو 2026", url: "#" },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "image": return <ImageIcon className="w-8 h-8 text-blue-500" />;
      case "folder": return <Folder className="w-8 h-8 text-yellow-500 fill-yellow-500/20" />;
      case "document": return <FileText className="w-8 h-8 text-red-500" />;
      case "video": return <Video className="w-8 h-8 text-purple-500" />;
      default: return <ImageIcon className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">مكتبة الوسائط</h1>
          <p className="text-gray-500 mt-1">إدارة الصور، مقاطع الفيديو والمستندات الخاصة بالمتجر.</p>
        </div>
        <button className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors">
          <Upload className="w-5 h-5" />
          <span>رفع ملفات</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="ابحث في الملفات..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand w-full"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-bold text-gray-900">التخزين المستخدم:</span>
          <span>450 MB من 2 GB</span>
          <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden mr-2">
            <div className="h-full bg-brand" style={{ width: '22%' }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {mediaItems.map((item) => (
          <Card key={item.id} className="group hover:border-brand/50 transition-colors cursor-pointer relative overflow-hidden">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center h-40">
              <div className="mb-3 p-3 rounded-xl bg-gray-50 group-hover:bg-brand/5 transition-colors">
                {getIcon(item.type)}
              </div>
              <h4 className="font-medium text-sm text-gray-900 truncate w-full" title={item.name}>
                {item.name}
              </h4>
              <p className="text-xs text-gray-500 mt-1">{item.type === "folder" ? "مجلد" : item.size}</p>
              
              <button className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-4 h-4" />
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
