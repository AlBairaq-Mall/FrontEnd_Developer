"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Edit, Trash2, Plus, Loader2, MapPin } from "lucide-react";
import { createLocation, updateLocation, deleteLocation } from "../actions";

interface Location {
  id: number;
  user_id: number;
  title: string;
  address: string;
  latitude?: number | string;
  longitude?: number | string;
  is_default?: boolean;
}

interface LocationsClientProps {
  locations: Location[];
  userId: number;
}

export function LocationsClient({ locations, userId }: LocationsClientProps) {
  const [isPending, startTransition] = useTransition();

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    latitude: "",
    longitude: "",
    is_default: false,
  });
  const [formError, setFormError] = useState("");

  // Delete State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<Location | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const openAddForm = () => {
    setEditingLocation(null);
    setFormData({
      title: "",
      address: "",
      latitude: "",
      longitude: "",
      is_default: false,
    });
    setFormError("");
    setIsFormOpen(true);
  };

  const openEditForm = (loc: Location) => {
    setEditingLocation(loc);
    setFormData({
      title: loc.title,
      address: loc.address,
      latitude: loc.latitude ? loc.latitude.toString() : "",
      longitude: loc.longitude ? loc.longitude.toString() : "",
      is_default: loc.is_default || false,
    });
    setFormError("");
    setIsFormOpen(true);
  };

  const openDeleteConfirm = (loc: Location) => {
    setLocationToDelete(loc);
    setDeleteError("");
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    
    // Validate required fields
    if (!formData.title || !formData.address) {
      setFormError("الرجاء إدخال اسم العنوان والتفاصيل");
      return;
    }

    const payload = {
      user_id: userId,
      title: formData.title,
      address: formData.address,
      latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
      longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
      is_default: formData.is_default,
    };
    
    startTransition(async () => {
      let result;
      if (editingLocation) {
        result = await updateLocation(editingLocation.id, userId, payload);
      } else {
        result = await createLocation(payload);
      }

      if (result?.error) {
        setFormError(result.error);
      } else {
        setIsFormOpen(false);
      }
    });
  };

  const handleDelete = async () => {
    if (!locationToDelete) return;
    setDeleteError("");
    
    startTransition(async () => {
      const result = await deleteLocation(locationToDelete.id, userId);
      if (result?.error) {
        setDeleteError(result.error);
      } else {
        setIsDeleteOpen(false);
        setLocationToDelete(null);
      }
    });
  };

  return (
    <>
      <Card>
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-500" />
            قائمة العناوين
          </h3>
          <Button onClick={openAddForm} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            إضافة عنوان
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>التفاصيل</TableHead>
                <TableHead>الإحداثيات</TableHead>
                <TableHead>الافتراضي</TableHead>
                <TableHead>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    لا يوجد عناوين مسجلة لهذا العميل
                  </TableCell>
                </TableRow>
              ) : (
                locations.map((loc) => (
                  <TableRow key={loc.id}>
                    <TableCell>
                      <div className="font-bold text-gray-900">{loc.title}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600 max-w-xs truncate" title={loc.address}>
                        {loc.address}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-500 font-mono">
                        {loc.latitude && loc.longitude ? (
                          <span dir="ltr">{Number(loc.latitude).toFixed(4)}, {Number(loc.longitude).toFixed(4)}</span>
                        ) : (
                          <span>-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {loc.is_default ? (
                        <Badge variant="success">افتراضي</Badge>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => openEditForm(loc)}
                          disabled={isPending}
                          className="text-gray-400 hover:text-blue-500 transition-colors disabled:opacity-50" 
                          title="تعديل"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openDeleteConfirm(loc)}
                          disabled={isPending}
                          className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50" 
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Add/Edit Form Modal */}
      <Modal 
        isOpen={isFormOpen} 
        onClose={() => !isPending && setIsFormOpen(false)} 
        title={editingLocation ? "تعديل عنوان" : "إضافة عنوان جديد"}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
              {formError}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">اسم العنوان (مثال: المنزل، العمل)</label>
            <input 
              required
              className="block w-full rounded-lg border-gray-300 bg-gray-50 border px-4 py-2 text-gray-900 focus:border-brand focus:ring-brand sm:text-sm"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              disabled={isPending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">تفاصيل العنوان (الشارع، الحي، المبنى)</label>
            <textarea 
              required
              rows={3}
              className="block w-full rounded-lg border-gray-300 bg-gray-50 border px-4 py-2 text-gray-900 focus:border-brand focus:ring-brand sm:text-sm"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              disabled={isPending}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">خط العرض (Latitude) - اختياري</label>
              <input 
                type="number"
                step="any"
                className="block w-full rounded-lg border-gray-300 bg-gray-50 border px-4 py-2 text-gray-900 focus:border-brand focus:ring-brand sm:text-sm"
                value={formData.latitude}
                onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                disabled={isPending}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">خط الطول (Longitude) - اختياري</label>
              <input 
                type="number"
                step="any"
                className="block w-full rounded-lg border-gray-300 bg-gray-50 border px-4 py-2 text-gray-900 focus:border-brand focus:ring-brand sm:text-sm"
                value={formData.longitude}
                onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                disabled={isPending}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="is_default" 
              checked={formData.is_default}
              onChange={(e) => setFormData({...formData, is_default: e.target.checked})}
              disabled={isPending}
              className="rounded border-gray-300 text-brand focus:ring-brand"
            />
            <label htmlFor="is_default" className="text-sm font-medium text-gray-700">تعيين كعنوان افتراضي</label>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)} disabled={isPending}>
              إلغاء
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
              {editingLocation ? "حفظ التعديلات" : "إضافة العنوان"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => !isPending && setIsDeleteOpen(false)}
        title="تأكيد الحذف"
      >
        <div className="space-y-4">
          {deleteError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
              {deleteError}
            </div>
          )}
          <p className="text-gray-600">
            هل أنت متأكد من رغبتك في حذف العنوان <span className="font-bold">{locationToDelete?.title}</span>؟
            لا يمكن التراجع عن هذا الإجراء.
          </p>
          <div className="pt-4 flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsDeleteOpen(false)} disabled={isPending}>
              إلغاء
            </Button>
            <Button type="button" variant="danger" onClick={handleDelete} disabled={isPending}>
              {isPending && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
              حذف
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
