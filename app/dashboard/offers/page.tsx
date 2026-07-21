"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Plus, Trash, Edit, Eye } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { getOffers, deleteOffer, Offer } from "@/lib/actions/offers";
import { OfferFormModal } from "./components/OfferFormModal";
import Link from "next/link";

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<Offer | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  async function loadOffers() {
    setLoading(true);
    const res = await getOffers();
    if (res.success && res.data) {
      // Handle array or pagination wrapper
      const dataArray = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setOffers(dataArray);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadOffers();
  }, []);

  const handleOpenDeleteModal = (offer: Offer) => {
    setOfferToDelete(offer);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteOffer = async () => {
    if (!offerToDelete) return;
    setDeletingId(offerToDelete.id);
    const res = await deleteOffer(offerToDelete.id);
    if (res.success) {
      loadOffers();
      setIsDeleteModalOpen(false);
      setOfferToDelete(null);
    } else {
      alert(res.error || "حدث خطأ أثناء حذف العرض");
    }
    setDeletingId(null);
  };

  const openAddModal = () => {
    setSelectedOffer(null);
    setIsModalOpen(true);
  };

  const openEditModal = (offer: Offer) => {
    setSelectedOffer(offer);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">إدارة العروض</h2>
        <Button onClick={openAddModal} className="gap-2">
          <Plus className="w-5 h-5" />
          إضافة عرض
        </Button>
      </div>

      <OfferFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => loadOffers()}
        offerToEdit={selectedOffer}
      />

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>المنتج / الوحدة</TableHead>
              <TableHead>نوع الخصم</TableHead>
              <TableHead>السعر الأصلي</TableHead>
              <TableHead>السعر بعد العرض</TableHead>
              <TableHead>تاريخ الصلاحية</TableHead>
              <TableHead className="text-center">الحالة</TableHead>
              <TableHead className="text-center">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">جاري تحميل العروض...</TableCell>
              </TableRow>
            ) : offers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-gray-500 flex-col items-center gap-4">
                  <div className="text-lg font-medium">لا توجد عروض حالياً</div>
                  <p className="text-sm text-gray-400">يمكنك إضافة عرض جديد من خلال الزر في الأعلى.</p>
                </TableCell>
              </TableRow>
            ) : (
              offers.map((offer, i) => (
                <TableRow key={offer.id || i}>
                  <TableCell>
                    <div className="font-bold text-gray-900">
                      {offer.product?.name_ar || offer.product?.name_en || `منتج غير معروف`}
                    </div>
                    <div className="text-sm text-gray-500">
                      الوحدة: {offer.unit?.name_ar || offer.unit?.name_en || `وحدة غير معروفة`}
                    </div>
                  </TableCell>
                  <TableCell>
                    {offer.type === "percentage" ? (
                      <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded">خصم {offer.value}%</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded">خصم ثابت {offer.value}</span>
                    )}
                  </TableCell>
                  <TableCell className="line-through text-gray-400">{offer.original_price} ر.س</TableCell>
                  <TableCell className="font-bold text-brand">{offer.final_price} ر.س</TableCell>
                  <TableCell>
                    <div className="text-sm">من: <span className="font-medium">{offer.start_date.split(" ")[0]}</span></div>
                    <div className="text-sm">إلى: <span className="font-medium">{offer.end_date.split(" ")[0]}</span></div>
                  </TableCell>
                  <TableCell className="text-center">
                    {offer.is_active ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        نشط
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        غير نشط
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Link 
                        href={`/dashboard/offers/${offer.id}`}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="تفاصيل العرض"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => openEditModal(offer)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="تعديل العرض"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleOpenDeleteModal(offer)}
                        disabled={deletingId === offer.id}
                        className={`p-2 rounded-lg transition-colors ${
                          deletingId === offer.id 
                            ? "text-gray-400 cursor-not-allowed" 
                            : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                        }`}
                        title="حذف العرض"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="تأكيد الحذف"
      >
        <div className="p-4" dir="rtl">
          <p className="mb-6">هل أنت متأكد من رغبتك في حذف العرض للمنتج <strong>{offerToDelete?.product?.name_ar || offerToDelete?.product?.name_en}</strong>؟ لا يمكن التراجع عن هذا الإجراء.</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={confirmDeleteOffer}
              disabled={deletingId !== null}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {deletingId !== null ? "جاري الحذف..." : "حذف العرض"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
