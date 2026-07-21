"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { updateCartItem } from "@/lib/actions/cart";

interface UpdateQuantityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  itemId: string | number;
  currentQuantity: number;
}

export function UpdateQuantityModal({ isOpen, onClose, onSuccess, itemId, currentQuantity }: UpdateQuantityModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(currentQuantity);

  useEffect(() => {
    if (isOpen) {
      setQuantity(currentQuantity);
      setError(null);
    }
  }, [isOpen, currentQuantity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (quantity <= 0) {
      setError("الكمية يجب أن تكون أكبر من صفر.");
      return;
    }

    setLoading(true);
    const res = await updateCartItem(itemId, { quantity });
    
    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setError(res.error || "حدث خطأ أثناء تحديث الكمية.");
    }
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="تحديث الكمية">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الكمية الجديدة</label>
          <Input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            إلغاء
          </Button>
          <Button type="submit" disabled={loading || quantity === currentQuantity}>
            {loading ? "جاري التحديث..." : "حفظ التغييرات"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
