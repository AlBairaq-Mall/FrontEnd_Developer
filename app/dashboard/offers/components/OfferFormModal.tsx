"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getOfferOptions, createOffer, updateOffer, OfferData, Offer } from "@/lib/actions/offers";

interface OfferFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  offerToEdit?: Offer | null;
}

export function OfferFormModal({ isOpen, onClose, onSuccess, offerToEdit }: OfferFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [options, setOptions] = useState({
    products: [] as any[],
    units: [] as any[],
  });

  const [productId, setProductId] = useState<string>("");
  const [unitId, setUnitId] = useState<string>("");
  const [type, setType] = useState<"percentage" | "fixed">("percentage");
  const [value, setValue] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      loadOptions();
      if (offerToEdit) {
        setProductId(offerToEdit.product.id.toString());
        setUnitId(offerToEdit.unit.id.toString());
        setType(offerToEdit.type);
        setValue(offerToEdit.value);
        setStartDate(offerToEdit.start_date.split(" ")[0] || offerToEdit.start_date);
        setEndDate(offerToEdit.end_date.split(" ")[0] || offerToEdit.end_date);
        setIsActive(offerToEdit.is_active);
      } else {
        resetForm();
      }
    }
  }, [isOpen, offerToEdit]);

  const loadOptions = async () => {
    setLoading(true);
    const res = await getOfferOptions();
  
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
    setType("percentage");
    setValue(0);
    setStartDate("");
    setEndDate("");
    setIsActive(true);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!productId || !unitId || value <= 0 || !startDate || !endDate) {
      setError("الرجاء إكمال جميع الحقول بشكل صحيح.");
      return;
    }

    setSubmitting(true);
    const payload: OfferData = {
      product_id: productId,
      unit_id: unitId,
      type: type,
      value: value,
      start_date: startDate,
      end_date: endDate,
      is_active: isActive,
    };

    let res;
    if (offerToEdit) {
      res = await updateOffer(offerToEdit.id, payload);
    } else {
      res = await createOffer(payload);
    }

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setError(res.error || (offerToEdit ? "حدث خطأ أثناء تحديث العرض." : "حدث خطأ أثناء إضافة العرض."));
    }
    setSubmitting(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={offerToEdit ? "تعديل العرض" : "إضافة عرض جديد"}>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">نوع الخصم</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                value={type}
                onChange={(e) => setType(e.target.value as "percentage" | "fixed")}
                required
              >
                <option value="percentage">نسبة مئوية (%)</option>
                <option value="fixed">مبلغ ثابت</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">القيمة</label>
              <Input
                type="number"
                min="0.01"
                step="0.01"
                value={value}
                onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ البداية</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ النهاية</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="is_active"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-brand rounded focus:ring-brand"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700 cursor-pointer">
                العرض نشط (فعال)
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
              إلغاء
            </Button>
            <Button type="submit" disabled={submitting || !productId || !unitId}>
              {submitting ? "جاري الحفظ..." : "حفظ العرض"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
