"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getOrderOptions, createOrder, CreateOrderData } from "@/lib/actions/orders";
import { Plus, Trash } from "lucide-react";

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateOrderModal({ isOpen, onClose, onSuccess }: CreateOrderModalProps) {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [options, setOptions] = useState({
    users: [] as any[],
    products: [] as any[],
    locations: [] as any[],
    units: [] as any[],
  });

  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [locationId, setLocationId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");

  const [items, setItems] = useState<{ product_id: string; unit_id: string; quantity: number }[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadOptions();
      resetForm();
    }
  }, [isOpen]);

  const loadOptions = async () => {
    setLoading(true);
    const res = await getOrderOptions();
    if (res.success) {
      setOptions({
        users: res.users || [],
        products: res.products || [],
        locations: res.locations || [],
        units: res.units || [],
      });
    }
    setLoading(false);
  };

  const resetForm = () => {
    setSelectedUserId("");
    setLocationId("");
    setPaymentMethod("cash");
    setDeliveryFee(0);
    setDiscount(0);
    setNotes("");
    setItems([]);
    setError(null);
  };

  const handleAddItem = () => {
    setItems([...items, { product_id: "", unit_id: "", quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value } as any;
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!locationId) {
      setError("الرجاء اختيار العنوان (الموقع).");
      return;
    }

    if (items.length === 0) {
      setError("الرجاء إضافة منتج واحد على الأقل.");
      return;
    }

    for (let i = 0; i < items.length; i++) {
      if (!items[i].product_id || !items[i].unit_id || items[i].quantity <= 0) {
        setError("الرجاء إكمال بيانات جميع المنتجات بشكل صحيح.");
        return;
      }
    }

    setSubmitting(true);
    const payload: CreateOrderData = {
      location_id: locationId,
      payment_method: paymentMethod,
      delivery_fee: deliveryFee || 0,
      discount: discount || 0,
      notes: notes,
      items: items.map(item => ({
        product_id: item.product_id,
        unit_id: item.unit_id,
        quantity: item.quantity,
      })),
    };

    const res = await createOrder(payload);
    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setError(res.error || "حدث خطأ أثناء إنشاء الطلب.");
    }
    setSubmitting(false);
  };

  // Filter locations by selected user
  const availableLocations = selectedUserId
    ? options.locations.filter(loc => loc.user_id?.toString() === selectedUserId || loc.user?.id?.toString() === selectedUserId)
    : options.locations;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="إضافة طلب جديد">
      {loading ? (
        <div className="py-8 text-center text-gray-500">جاري تحميل البيانات...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">العميل</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                value={selectedUserId}
                onChange={(e) => {
                  setSelectedUserId(e.target.value);
                  setLocationId(""); // Reset location when user changes
                }}
              >
                <option value="">-- اختر العميل --</option>
                {options.users.map((u: any) => (
                  <option key={u.id} value={u.id}>{u.name || u.first_name || u.phone || `عميل #${u.id}`}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">العنوان (الموقع)</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                required
              >
                <option value="">-- اختر العنوان --</option>
                {availableLocations.map((loc: any) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.address || loc.title || loc.phone || `عنوان #${loc.id}`}
                  </option>
                ))}
              </select>
              {selectedUserId && availableLocations.length === 0 && (
                <p className="text-xs text-red-500 mt-1">هذا العميل لا يملك عناوين مسجلة.</p>
              )}
            </div>
          </div>

          <div className="border-t border-b py-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">المنتجات</h3>
              <Button type="button" variant="outline" size="sm" onClick={handleAddItem} className="gap-2">
                <Plus className="w-4 h-4" />
                إضافة منتج
              </Button>
            </div>

            {items.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">لم يتم إضافة أي منتجات بعد.</p>
            ) : (
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-3 items-end bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex-1 w-full">
                      <label className="block text-xs font-medium text-gray-600 mb-1">المنتج</label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                        value={item.product_id}
                        onChange={(e) => {
                          handleItemChange(index, "product_id", e.target.value);
                          handleItemChange(index, "unit_id", "");
                        }}
                        required
                      >
                        <option value="">-- اختر المنتج --</option>
                        {options.products.map((p: any) => (
                          <option key={p.id} value={p.id}>{p.name || p.title || `منتج #${p.id}`}</option>
                        ))}
                      </select>
                    </div>

                    <div className="w-full sm:w-32">
                      <label className="block text-xs font-medium text-gray-600 mb-1">الوحدة</label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                        value={item.unit_id}
                        onChange={(e) => handleItemChange(index, "unit_id", e.target.value)}
                        required
                      >
                        <option value="">-- اختر --</option>
                        {(() => {
                          const selectedProduct = options.products.find((p: any) => p.id.toString() === item.product_id);
                          const availableUnits = selectedProduct?.units || options.units;
                          
                          return availableUnits.map((u: any) => (
                            <option key={u.id} value={u.id}>{u.name_ar || u.name || `وحدة #${u.id}`}</option>
                          ));
                        })()}
                      </select>
                    </div>

                    <div className="w-full sm:w-24">
                      <label className="block text-xs font-medium text-gray-600 mb-1">الكمية</label>
                      <Input
                        type="number"
                        min="1"
                        className="py-1.5 px-2 text-sm"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value) || 1)}
                        required
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="حذف"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">طريقة الدفع</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="cash">كاش (نقد)</option>
                <option value="card">بطاقة</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رسوم التوصيل</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الخصم</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات (اختياري)</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand resize-none"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="أي ملاحظات حول الطلب..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
              إلغاء
            </Button>
            <Button type="submit" disabled={submitting || items.length === 0 || !locationId}>
              {submitting ? "جاري الحفظ..." : "إنشاء الطلب"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
