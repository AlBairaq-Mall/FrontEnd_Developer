"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getOfferOptions, createOffer, updateOffer, OfferData, Offer } from "@/lib/actions/offers";
import { Plus, Trash } from "lucide-react";
import { SearchableProductSelect } from "@/components/ui/SearchableProductSelect";

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

  const [titleAr, setTitleAr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");

  const [productsList, setProductsList] = useState<{ product_id: string; unit_id: string }[]>([
    { product_id: "", unit_id: "" }
  ]);

  const [type, setType] = useState<"percentage" | "fixed" | "gift">("percentage");
  const [value, setValue] = useState<number>(0);

  const [buyQuantity, setBuyQuantity] = useState<number>(1);
  const [giftProductId, setGiftProductId] = useState<string>("");
  const [giftUnitId, setGiftUnitId] = useState<string>("");
  const [giftQuantity, setGiftQuantity] = useState<number>(1);

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      loadOptions();
      if (offerToEdit) {
        setTitleAr(offerToEdit.title_ar || "");
        setTitleEn(offerToEdit.title_en || "");
        setDescriptionAr(offerToEdit.description_ar || "");
        setDescriptionEn(offerToEdit.description_en || "");

        const offerProducts = offerToEdit.product_units || offerToEdit.products;
        if (offerProducts && offerProducts.length > 0) {
          setProductsList(
            offerProducts.map(p => ({
              product_id: p.product.id.toString(),
              unit_id: p.unit.id.toString()
            }))
          );
        } else {
          setProductsList([{ product_id: "", unit_id: "" }]);
        }

        setType(offerToEdit.type || "percentage");
        setValue(offerToEdit.value || 0);

        if (offerToEdit.type === "gift") {
          setBuyQuantity(offerToEdit.buy_quantity || 1);
          setGiftProductId(offerToEdit.gift_product?.product.id.toString() || "");
          setGiftUnitId(offerToEdit.gift_product?.unit.id.toString() || "");
          setGiftQuantity(offerToEdit.gift_quantity || 1);
        }

        setStartDate(offerToEdit.start_date ? offerToEdit.start_date.split(" ")[0] : "");
        setEndDate(offerToEdit.end_date ? offerToEdit.end_date.split(" ")[0] : "");
        setIsActive(offerToEdit.is_active ?? true);
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
    setTitleAr("");
    setTitleEn("");
    setDescriptionAr("");
    setDescriptionEn("");
    setProductsList([{ product_id: "", unit_id: "" }]);
    setType("percentage");
    setValue(0);
    setBuyQuantity(1);
    setGiftProductId("");
    setGiftUnitId("");
    setGiftQuantity(1);
    setStartDate("");
    setEndDate("");
    setIsActive(true);
    setError(null);
  };

  const handleProductChange = (index: number, field: "product_id" | "unit_id", val: string) => {
    const updated = [...productsList];
    updated[index][field] = val;
    if (field === "product_id") {
      updated[index].unit_id = ""; // reset unit when product changes
    }
    setProductsList(updated);
  };

  const addProductRow = () => {
    setProductsList([...productsList, { product_id: "", unit_id: "" }]);
  };

  const removeProductRow = (index: number) => {
    if (productsList.length > 1) {
      const updated = [...productsList];
      updated.splice(index, 1);
      setProductsList(updated);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate products
    const validProducts = productsList
      .filter(p => p.product_id && p.unit_id)
      .map(p => ({
        product_id: parseInt(p.product_id),
        unit_id: parseInt(p.unit_id)
      }));

    if (validProducts.length === 0) {
      setError("الرجاء اختيار منتج ووحدة واحدة على الأقل.");
      return;
    }

    if (!startDate || !endDate) {
      setError("الرجاء إكمال التواريخ بشكل صحيح.");
      return;
    }

    if (type !== "gift" && value <= 0) {
      setError("الرجاء إدخال قيمة خصم صحيحة.");
      return;
    }

    if (type === "gift") {
      if (!giftProductId || !giftUnitId || buyQuantity <= 0 || giftQuantity <= 0) {
        setError("الرجاء إكمال بيانات الهدية بشكل صحيح.");
        return;
      }
    }

    setSubmitting(true);
    const payload: OfferData = {
      title_ar: titleAr,
      title_en: titleEn,
      description_ar: descriptionAr,
      description_en: descriptionEn,
      products: validProducts,
      type: type,
      start_date: startDate,
      end_date: endDate,
      is_active: isActive,
    };

    if (type === "gift") {
      payload.buy_quantity = buyQuantity;
      payload.gift_product_id = parseInt(giftProductId);
      payload.gift_unit_id = parseInt(giftUnitId);
      payload.gift_quantity = giftQuantity;
    } else {
      payload.value = value;
    }

    console.log("Sending Offer Payload to API:", JSON.stringify(payload, null, 2));

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
      let errorMessage = res.error || (offerToEdit ? "حدث خطأ أثناء تحديث العرض." : "حدث خطأ أثناء إضافة العرض.");
      if (res.validationErrors) {
        const errors = Object.values(res.validationErrors).flat().join(" - ");
        errorMessage += ` (${errors})`;
      }
      setError(errorMessage);
    }
    setSubmitting(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={offerToEdit ? "تعديل العرض" : "إضافة عرض جديد"} maxWidth="max-w-3xl lg:max-w-4xl">
      {loading ? (
        <div className="py-8 text-center text-gray-500">جاري تحميل البيانات...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto px-1">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}

          {/* Titles & Descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">عنوان العرض (عربي)</label>
              <Input type="text" value={titleAr} onChange={(e) => setTitleAr(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">عنوان العرض (إنجليزي)</label>
              <Input type="text" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الوصف (عربي)</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                value={descriptionAr}
                onChange={(e) => setDescriptionAr(e.target.value)}
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الوصف (إنجليزي)</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                rows={2}
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <label className="block text-sm font-bold text-gray-900">المنتجات المشمولة في العرض</label>
                <p className="text-xs text-gray-500 mt-0.5">ابحث عن المنتجات وأضفها للعرض وحدد الوحدة المناسبة لكل منتج</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addProductRow} className="gap-2">
                <Plus className="w-4 h-4" /> إضافة منتج آخر
              </Button>
            </div>

            <div className="space-y-3">
              {productsList.map((prod, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-gray-50 p-3.5 rounded-xl border border-gray-200 shadow-sm transition-all hover:border-gray-300">
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">المنتج</label>
                    <SearchableProductSelect
                      products={options.products}
                      value={prod.product_id}
                      onChange={(val) => handleProductChange(index, "product_id", val)}
                      placeholder="ابحث بالاسم أو الباركود..."
                      required
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">الوحدة</label>
                    <select
                      className="w-full min-h-[48px] border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand text-sm bg-white shadow-sm transition-all hover:border-brand/70"
                      value={prod.unit_id}
                      onChange={(e) => handleProductChange(index, "unit_id", e.target.value)}
                      required
                    >
                      <option value="">-- اختر الوحدة --</option>
                      {(() => {
                        const selectedProduct = options.products.find((p: any) => p.id.toString() === prod.product_id);
                        const availableUnits = selectedProduct?.units || options.units;
                        return availableUnits.map((u: any) => (
                          <option key={u.id} value={u.id}>{u.name_ar || u.name || `وحدة #${u.id}`}</option>
                        ));
                      })()}
                    </select>
                  </div>
                  {productsList.length > 1 && (
                    <div className="md:mt-6">
                      <button
                        type="button"
                        onClick={() => removeProductRow(index)}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-200 transition-colors"
                        title="حذف المنتج من القائمة"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <label className="block text-sm font-bold text-gray-900 mb-3">تفاصيل الخصم</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نوع الخصم</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                  value={type}
                  onChange={(e) => setType(e.target.value as "percentage" | "fixed" | "gift")}
                  required
                >
                  <option value="percentage">نسبة مئوية (%)</option>
                  <option value="fixed">مبلغ ثابت</option>
                  <option value="gift">هدية (Gift)</option>
                </select>
              </div>

              {type !== "gift" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">قيمة الخصم</label>
                  <Input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={value}
                    onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
              ) : (
                <div className="md:col-span-2 bg-blue-50/50 p-4 rounded-lg border border-blue-100 space-y-4 mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">الكمية المطلوبة للشراء</label>
                      <Input
                        type="number"
                        min="1"
                        step="1"
                        value={buyQuantity}
                        onChange={(e) => setBuyQuantity(parseInt(e.target.value) || 1)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">المنتج المهدي (المجاني)</label>
                      <SearchableProductSelect
                        products={options.products}
                        value={giftProductId}
                        onChange={(val) => {
                          setGiftProductId(val);
                          setGiftUnitId("");
                        }}
                        placeholder="ابحث واختر منتج الهدية..."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">وحدة منتج الهدية</label>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
                        value={giftUnitId}
                        onChange={(e) => setGiftUnitId(e.target.value)}
                        required
                      >
                        <option value="">-- اختر وحدة الهدية --</option>
                        {(() => {
                          const selectedGiftProduct = options.products.find((p: any) => p.id.toString() === giftProductId);
                          const availableUnits = selectedGiftProduct?.units || options.units;
                          return availableUnits.map((u: any) => (
                            <option key={u.id} value={u.id}>{u.name_ar || u.name || `وحدة #${u.id}`}</option>
                          ));
                        })()}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">كمية الهدية</label>
                      <Input
                        type="number"
                        min="1"
                        step="1"
                        value={giftQuantity}
                        onChange={(e) => setGiftQuantity(parseInt(e.target.value) || 1)}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white pb-2 mt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
              إلغاء
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "جاري الحفظ..." : "حفظ العرض"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
