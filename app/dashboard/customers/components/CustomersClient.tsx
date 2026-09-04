"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Edit, Trash2, Ban, CheckCircle, Plus, Loader2, MapPin, Filter, Search } from "lucide-react";
import { createUser, updateUser, deleteUser } from "../actions";
import { Select } from "@/components/ui/Select";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "react-hot-toast";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  email_verified_at: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface CustomersClientProps {
  users: User[];
}

export function CustomersClient({ users }: CustomersClientProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(searchQuery, 2000);
  const [isNavigating, startNavigation] = useTransition();

  useEffect(() => {
    if (debouncedSearch.length >= 3 || debouncedSearch.length === 0) {
      if (debouncedSearch !== (searchParams.get("search") || "")) {
        handleFilterChange("search", debouncedSearch);
      }
    }
  }, [debouncedSearch]);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    role: "customer",
    is_active: true,
  });
  const [formError, setFormError] = useState("");

  // Delete State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    startNavigation(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const getStatusColor = (isActive: boolean): "success" | "danger" => isActive ? "success" : "danger";
  const getInitial = (name: string) => name ? name.charAt(0).toUpperCase() : "?";
  const getAvatarBg = (isActive: boolean) => isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";

  const openAddForm = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", phone: "", password: "", password_confirmation: "", role: "customer", is_active: true });
    setFormError("");
    setIsFormOpen(true);
  };

  const openEditForm = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      password: "", // Empty password so it only updates if provided
      password_confirmation: "",
      role: user.role,
      is_active: user.is_active,
    });
    setFormError("");
    setIsFormOpen(true);
  };

  const openDeleteConfirm = (user: User) => {
    setUserToDelete(user);
    setDeleteError("");
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (formData.password && formData.password !== formData.password_confirmation) {
      const msg = "كلمة المرور وتأكيدها غير متطابقين";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    startTransition(async () => {
      let result;
      if (editingUser) {
        result = await updateUser(editingUser.id, formData);
      } else {
        result = await createUser(formData);
      }

      if (result?.error) {
        setFormError(result.error);
        toast.error(result.error);
      } else {
        toast.success(editingUser ? "تم تحديث بيانات العميل بنجاح" : "تم إضافة العميل بنجاح");
        setIsFormOpen(false);
      }
    });
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    setDeleteError("");

    startTransition(async () => {
      const result = await deleteUser(userToDelete.id);
      if (result?.error) {
        setDeleteError(result.error);
        toast.error(result.error);
      } else {
        toast.success("تم حذف حساب العميل بنجاح");
        setIsDeleteOpen(false);
        setUserToDelete(null);
      }
    });
  };

  const toggleUserStatus = async (user: User) => {
    startTransition(async () => {
      const res = await updateUser(user.id, {
        name: user.name,
        email: user.email,
        phone: user.phone || undefined,
        role: user.role,
        is_active: !user.is_active,
      });
      if (res?.error) {
        toast.error(res.error || "فشل تغيير حالة العميل");
      } else {
        toast.success(user.is_active ? "تم تعطيل حساب العميل بنجاح" : "تم تفعيل حساب العميل بنجاح");
      }
    });
  };

  return (
    <>
      <Card>
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1">
            <Select
              icon={<Filter className="w-4 h-4" />}
              value={searchParams.get("role") || ""}
              onChange={(e) => handleFilterChange("role", e.target.value)}
              wrapperClassName="w-full sm:w-auto"
            >
              <option value="">جميع الأدوار</option>
              <option value="admin">مدير النظام</option>
              <option value="customer_service">خدمة العملاء</option>
              <option value="delivery">موصل</option>
              <option value="customer">مستخدم</option>
            </Select>

            <Select
              icon={<Filter className="w-4 h-4" />}
              value={searchParams.get("status") || ""}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              wrapperClassName="w-full sm:w-auto"
            >
              <option value="">جميع الحالات</option>
              <option value="1">نشط</option>
              <option value="0">محظور</option>
            </Select>

            <div className="w-full max-w-md relative">
              <input
                type="text"
                placeholder="ابحث عن مستخدم بالاسم أو البريد..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand w-full"
              />
              {isNavigating ? (
                <Loader2 className="w-4 h-4 text-brand absolute left-3 top-1/2 -translate-y-1/2 animate-spin" />
              ) : (
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              )}
            </div>
          </div>
          <Button onClick={openAddForm} className="shrink-0 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            إضافة مستخدم
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المستخدم</TableHead>
                <TableHead>البريد الإلكتروني</TableHead>
                <TableHead>رقم الهاتف</TableHead>
                <TableHead>الدور</TableHead>
                <TableHead>تاريخ الانضمام</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    لا يوجد مستخدمين لعرضهم
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${getAvatarBg(user.is_active)}`}>
                          {getInitial(user.name)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">#{user.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </TableCell>
                    <TableCell>
                      <div dir="ltr" className="text-sm text-gray-500 text-right">{user.phone || "—"}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium text-gray-600 capitalize">
                        {user.role === 'admin' ? 'مدير' : user.role === 'customer_service' || user.role === 'customer-service' ? 'خدمة عملاء' : user.role === 'delivery' ? 'موصل' : 'مستخدم'}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {new Date(user.created_at).toLocaleDateString('ar-EG', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(user.is_active)}>
                        {user.is_active ? "نشط" : "محظور"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {user.is_active ? (
                          <button
                            onClick={() => toggleUserStatus(user)}
                            disabled={isPending}
                            className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                            title="حظر المستخدم"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => toggleUserStatus(user)}
                            disabled={isPending}
                            className="text-gray-400 hover:text-green-500 transition-colors disabled:opacity-50"
                            title="تفعيل المستخدم"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => router.push(`/dashboard/customers/${user.id}/locations`)}
                          disabled={isPending}
                          className="text-gray-400 hover:text-purple-500 transition-colors disabled:opacity-50"
                          title="عناوين العميل"
                        >
                          <MapPin className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditForm(user)}
                          disabled={isPending}
                          className="text-gray-400 hover:text-blue-500 transition-colors disabled:opacity-50"
                          title="تعديل"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteConfirm(user)}
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
        title={editingUser ? "تعديل مستخدم" : "إضافة مستخدم جديد"}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
            <input
              required
              className="block w-full rounded-lg border-gray-300 bg-gray-50 border px-4 py-2 text-gray-900 focus:border-brand focus:ring-brand sm:text-sm"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isPending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              required
              className="block w-full rounded-lg border-gray-300 bg-gray-50 border px-4 py-2 text-gray-900 focus:border-brand focus:ring-brand sm:text-sm"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={isPending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
            <input
              type="text"
              dir="ltr"
              placeholder="مثال: 7XXXXXXXX"
              className="block w-full rounded-lg border-gray-300 bg-gray-50 border px-4 py-2 text-gray-900 focus:border-brand focus:ring-brand sm:text-sm text-right"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={isPending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              كلمة المرور {editingUser && <span className="text-gray-400 font-normal">(اتركه فارغاً إذا لم ترد تغييره)</span>}
            </label>
            <input
              type="password"
              required={!editingUser}
              className="block w-full rounded-lg border-gray-300 bg-gray-50 border px-4 py-2 text-gray-900 focus:border-brand focus:ring-brand sm:text-sm"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              disabled={isPending}
            />
          </div>

          {(!editingUser || formData.password) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تأكيد كلمة المرور
              </label>
              <input
                type="password"
                required={!editingUser || formData.password.length > 0}
                className="block w-full rounded-lg border-gray-300 bg-gray-50 border px-4 py-2 text-gray-900 focus:border-brand focus:ring-brand sm:text-sm"
                value={formData.password_confirmation}
                onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                disabled={isPending}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الدور</label>
            <select
              className="block w-full rounded-lg border-gray-300 bg-gray-50 border px-4 py-2 text-gray-900 focus:border-brand focus:ring-brand sm:text-sm"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              disabled={isPending}
            >
              <option value="customer">مستخدم / عميل</option>
              <option value="customer_service">خدمة عملاء</option>
              <option value="admin">مدير النظام</option>
              <option value="delivery">موصل</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              disabled={isPending}
              className="rounded border-gray-300 text-brand focus:ring-brand"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">مستخدم نشط</label>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)} disabled={isPending}>
              إلغاء
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
              {editingUser ? "حفظ التعديلات" : "إضافة المستخدم"}
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
            هل أنت متأكد من رغبتك في حذف المستخدم <span className="font-bold">{userToDelete?.name}</span>؟
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
