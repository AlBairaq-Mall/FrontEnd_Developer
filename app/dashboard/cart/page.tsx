"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Plus, Trash, Edit, AlertTriangle, Eye } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { getCart, deleteCartItem, clearCart, CartItem } from "@/lib/actions/cart";
import { AddToCartModal } from "./components/AddToCartModal";
import { UpdateQuantityModal } from "./components/UpdateQuantityModal";
import Link from "next/link";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ id: string | number, quantity: number } | null>(null);

  const [clearing, setClearing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<CartItem | null>(null);
  
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  async function loadCart() {
    setLoading(true);
    const res = await getCart();
    if (res.success && res.data) {
      // Handle pagination wrapper if present
      const dataArray = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setItems(dataArray);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadCart();
  }, []);

  const handleOpenClearModal = () => {
    setIsClearModalOpen(true);
  };

  const confirmClearCart = async () => {
    setClearing(true);
    const res = await clearCart();
    if (res.success) {
      setItems([]);
      setIsClearModalOpen(false);
    } else {
      alert(res.error || "حدث خطأ أثناء تفريغ السلة");
    }
    setClearing(false);
  };

  const handleOpenDeleteModal = (item: CartItem) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteItem = async () => {
    if (!itemToDelete) return;

    setDeletingId(itemToDelete.id);
    const res = await deleteCartItem(itemToDelete.id);
    if (res.success) {
      loadCart();
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } else {
      alert(res.error || "حدث خطأ أثناء حذف المنتج");
    }
    setDeletingId(null);
  };

  const openUpdateModal = (item: CartItem) => {
    setSelectedItem({ id: item.id, quantity: item.quantity });
    setIsUpdateModalOpen(true);
  };

  // Calculate cart total from items
  const cartTotal = items.reduce((sum, item) => sum + (item.total || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">سلة المشتريات</h2>
        <div className="flex gap-3">
          {items.length > 0 && (
            <Button 
              onClick={handleOpenClearModal} 
              variant="outline" 
              className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
              disabled={clearing}
            >
              <AlertTriangle className="w-5 h-5" />
              {clearing ? "جاري التفريغ..." : "تفريغ السلة"}
            </Button>
          )}
          <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
            <Plus className="w-5 h-5" />
            إضافة للسلة
          </Button>
        </div>
      </div>

      <AddToCartModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={() => loadCart()}
      />

      {selectedItem && (
        <UpdateQuantityModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          onSuccess={() => loadCart()}
          itemId={selectedItem.id}
          currentQuantity={selectedItem.quantity}
        />
      )}

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>المنتج</TableHead>
              <TableHead>الوحدة</TableHead>
              <TableHead className="text-center">الكمية</TableHead>
              <TableHead>السعر الإفرادي</TableHead>
              <TableHead>الإجمالي</TableHead>
              <TableHead className="text-center">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">جاري تحميل السلة...</TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-gray-500 flex-col items-center gap-4">
                  <div className="text-lg font-medium">السلة فارغة حالياً</div>
                  <p className="text-sm text-gray-400">يمكنك إضافة منتجات جديدة للسلة من خلال الزر في الأعلى.</p>
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, i) => (
                <TableRow key={item.id || i}>
                  <TableCell className="font-bold text-gray-900">
                    {item.product?.name_ar || item.product?.name || item.product?.title || `منتج غير معروف`}
                  </TableCell>
                  <TableCell>
                    {item.unit?.name_ar || item.unit?.name || `وحدة غير معروفة`}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-block px-3 py-1 bg-gray-100 rounded-md font-medium">
                      {item.quantity}
                    </span>
                  </TableCell>
                  <TableCell>{item.price} ر.س</TableCell>
                  <TableCell className="font-bold text-brand">{item.total} ر.س</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Link 
                        href={`/dashboard/products/${item.product.id}`}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="تفاصيل المنتج"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => openUpdateModal(item)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="تعديل الكمية"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleOpenDeleteModal(item)}
                        disabled={deletingId === item.id}
                        className={`p-2 rounded-lg transition-colors ${
                          deletingId === item.id 
                            ? "text-gray-400 cursor-not-allowed" 
                            : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                        }`}
                        title="حذف من السلة"
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
        {items.length > 0 && !loading && (
          <div className="p-4 border-t bg-gray-50 flex justify-end">
            <div className="text-lg font-bold text-gray-900 flex gap-4 items-center">
              <span>إجمالي السلة:</span>
              <span className="text-2xl text-brand">{cartTotal.toFixed(2)} ر.س</span>
            </div>
          </div>
        )}
      </Card>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="تأكيد الحذف"
      >
        <div className="p-4" dir="rtl">
          <p className="mb-6">هل أنت متأكد من رغبتك في حذف المنتج <strong>{itemToDelete?.product?.name_ar || itemToDelete?.product?.name_en}</strong> من السلة؟ لا يمكن التراجع عن هذا الإجراء.</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={confirmDeleteItem}
              disabled={deletingId !== null}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {deletingId !== null ? "جاري الحذف..." : "حذف المنتج"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="تفريغ السلة بالكامل"
      >
        <div className="p-4" dir="rtl">
          <p className="mb-6">هل أنت متأكد من تفريغ السلة بالكامل؟ لا يمكن استرجاع المنتجات بعد إزالتها.</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsClearModalOpen(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={confirmClearCart}
              disabled={clearing}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {clearing ? "جاري التفريغ..." : "تفريغ السلة"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
