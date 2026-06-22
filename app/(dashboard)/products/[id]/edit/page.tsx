import { ProductForm } from "@/components/ProductForm";

export default function EditProductPage() {
  // Mock data for the product being edited
  const mockData = {
    name: "تفاح أحمر طازج",
    description: "تفاح أحمر طازج عالي الجودة مستورد من مزارع مختارة بعناية.",
    price: "12.5",
    cost: "8.0",
    stock: "145",
    sku: "PRD-1001",
    status: "نشط",
  };

  return <ProductForm isEditing initialData={mockData} />;
}
