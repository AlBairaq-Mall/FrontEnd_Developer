"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Plus, Trash, Edit, Eye, Gift } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { getOffers, deleteOffer, Offer } from "@/lib/actions/offers";
import { OfferFormModal } from "./components/OfferFormModal";
import Link from "next/link";
import { Select } from "@/components/ui/Select";
import { Filter, Tag } from "lucide-react";

function OffersContent() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<Offer | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentStatus = searchParams.get("status") || "";
  const currentType = searchParams.get("type") || "";

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  async function loadOffers() {
    setLoading(true);
    const paramsObj = Object.fromEntries(searchParams.entries());
    const res = await getOffers(paramsObj);
    if (res.success && res.data) {
      // Handle array or pagination wrapper
      const dataArray = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setOffers(dataArray);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadOffers();
  }, [searchParams.toString()]);

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
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
          <Select
            icon={<Filter className="w-4 h-4" />}
            value={currentStatus}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            wrapperClassName="w-full sm:w-auto min-w-[200px]"
          >
            <option value="">جميع الحالات</option>
            <option value="1">نشط</option>
            <option value="0">غير نشط</option>
          </Select>
          <Select
            icon={<Tag className="w-4 h-4" />}
            value={currentType}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            wrapperClassName="w-full sm:w-auto min-w-[200px]"
          >
            <option value="">جميع أنواع الخصم</option>
            <option value="percentage">نسبة مئوية</option>
            <option value="fixed">مبلغ ثابت</option>
            <option value="gift">هدية</option>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>عنوان العرض / المنتجات</TableHead>
              <TableHead>النوع</TableHead>
              <TableHead>المنتجات والأسعار</TableHead>
              <TableHead>تاريخ الصلاحية</TableHead>
              <TableHead className="text-center">الحالة</TableHead>
              <TableHead className="text-center">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">جاري تحميل العروض...</TableCell>
              </TableRow>
            ) : offers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-gray-500 flex-col items-center gap-4">
                  <div className="text-lg font-medium">لا توجد عروض حالياً</div>
                  <p className="text-sm text-gray-400">يمكنك إضافة عرض جديد من خلال الزر في الأعلى.</p>
                </TableCell>
              </TableRow>
            ) : (
              offers.map((offer, i) => {
                const title = offer.title_ar || offer.title_en;
                const offerProducts = offer.product_units || offer.products;
                const firstProduct = offerProducts && offerProducts[0]?.product;
                const productsCount = offerProducts ? offerProducts.length : 0;
                
                return (
                  <TableRow key={offer.id || i}>
                    <TableCell>
                      <div className="font-bold text-gray-900">
                        {title ? title : (firstProduct ? (firstProduct.name_ar || firstProduct.name_en) : 'عرض بدون منتجات')}
                      </div>
                      {!title && productsCount > 1 && (
                        <div className="text-xs text-brand mt-1 bg-brand/10 inline-block px-2 py-0.5 rounded-full">
                          + {productsCount - 1} منتجات أخرى
                        </div>
                      )}
                      {title && firstProduct && (
                        <div className="text-xs text-gray-500 mt-1">
                          يشمل: {firstProduct.name_ar} {productsCount > 1 ? `و ${productsCount - 1} آخرين` : ''}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {offer.type === "percentage" ? (
                        <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded">
                          <PercentIcon className="w-3 h-3 mr-1" /> خصم {offer.value}%
                        </span>
                      ) : offer.type === "fixed" ? (
                        <span className="inline-flex items-center px-2 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded">
                          <DollarIcon className="w-3 h-3 mr-1" /> خصم ثابت {offer.value}
                        </span>
                      ) : offer.type === "gift" ? (
                        <span className="inline-flex items-center px-2 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded">
                          <Gift className="w-3 h-3 mr-1" /> هدية مجانية
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500">{offer.type}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1.5 min-w-[160px]">
                        {offerProducts?.slice(0, 2).map((p, pIndex) => (
                          <div key={pIndex} className="text-xs flex items-center justify-between gap-3 border-b border-gray-100 last:border-0 pb-1.5 last:pb-0">
                            <span className="text-gray-700 truncate max-w-[120px]" title={p.product?.name_ar || p.product?.name_en}>{p.product?.name_ar || p.product?.name_en}</span>
                            {p.old_price !== undefined && p.price !== undefined ? (
                              <div className="flex flex-col items-end shrink-0">
                                <span className="text-gray-400 line-through text-[10px] leading-none mb-0.5">{p.old_price}</span>
                                <span className="font-bold text-green-600 leading-none">{p.price} ر.س</span>
                              </div>
                            ) : null}
                          </div>
                        ))}
                        {productsCount > 2 && (
                          <div className="text-xs text-brand text-center mt-1 pt-1 border-t border-gray-100 bg-brand/5 rounded pb-1">
                            + {productsCount - 2} منتجات أخرى
                          </div>
                        )}
                        {productsCount === 0 && <span className="text-gray-400 text-xs">-</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-gray-600">
                        <div>من: <span className="font-medium text-gray-900">{offer.start_date?.split(" ")[0] || '-'}</span></div>
                        <div>إلى: <span className="font-medium text-gray-900">{offer.end_date?.split(" ")[0] || '-'}</span></div>
                      </div>
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
                          className={`p-2 rounded-lg transition-colors ${deletingId === offer.id
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
                );
              })
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
          <p className="mb-6">
            هل أنت متأكد من رغبتك في حذف العرض <strong>{offerToDelete?.title_ar || (offerToDelete?.product_units || offerToDelete?.products)?.[0]?.product?.name_ar || 'المحدد'}</strong>؟ لا يمكن التراجع عن هذا الإجراء.
          </p>
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

// Simple icons for the table
function PercentIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="19" y1="5" x2="5" y2="19"></line>
      <circle cx="6.5" cy="6.5" r="2.5"></circle>
      <circle cx="17.5" cy="17.5" r="2.5"></circle>
    </svg>
  );
}

function DollarIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  );
}

export default function OffersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">جاري تحميل العروض...</div>}>
      <OffersContent />
    </Suspense>
  );
}
