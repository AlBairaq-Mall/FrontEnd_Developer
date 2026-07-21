"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getCartOptions, addToCart, AddToCartData } from "@/lib/actions/cart";

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddToCartModal({ isOpen, onClose, onSuccess }: AddToCartModalProps) {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [options, setOptions] = useState({
    products: [] as any[],
    units: [] as any[],
  });

  const [productId, setProductId] = useState<string>("");
  const [unitId, setUnitId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (isOpen) {
      loadOptions();
      resetForm();
    }
  }, [isOpen]);

  const loadOptions = async () => {
    setLoading(true);
    const res = await getCartOptions();
    if (res.success) {
      setOptions({
        products: res.products || [],
        units: res.units || [],
      });
    }
    setLoading(false);
  };

  const resetForm = () => {
    setProductId("");
    setUnitId("");
    setQuantity(1);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!productId || !unitId || quantity <= 0) {
      setError("الرجاء إكمال البيانات بشكل صحيح.");
      return;
    }

    setSubmitting(true);
    const payload: AddToCartData = {
      product_id: productId,
      unit_id: unitId,
      quantity: quantity,
    };

    const res = await addToCart(payload);
    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setError(res.error || "حدث خطأ أثناء الإضافة للسلة.");
    }
    setSubmitting(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="إضافة منتج للسلة">
      {loading ? (
        <div className="py-8 text-center text-gray-500">جاري تحميل البيانات...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">المنتج</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                value={productId}
                onChange={(e) => {
                  setProductId(e.target.value);
                  setUnitId("");
                }}
                required
              >
                <option value="">-- اختر المنتج --</option>
                {options.products.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.name_ar || p.name || p.title || `منتج #${p.id}`}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الوحدة</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                value={unitId}
                onChange={(e) => setUnitId(e.target.value)}
                required
              >
                <option value="">-- اختر الوحدة --</option>
                {(() => {
                  const selectedProduct = options.products.find((p: any) => p.id.toString() === productId);
                  const availableUnits = selectedProduct?.units || options.units;
                  
                  return availableUnits.map((u: any) => (
                    <option key={u.id} value={u.id}>{u.name_ar || u.name || `وحدة #${u.id}`}</option>
                  ));
                })()}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الكمية</label>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
              إلغاء
            </Button>
            <Button type="submit" disabled={submitting || !productId || !unitId}>
              {submitting ? "جاري الإضافة..." : "إضافة للسلة"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
