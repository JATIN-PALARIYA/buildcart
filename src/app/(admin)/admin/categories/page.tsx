"use client";

import React, { useState } from "react";
import { useAdmin, Category } from "@/contexts/AdminContext";
import { CategoryFormModal, CategoryFormValues } from "@/components/admin/categories/CategoryFormModal";
import { CategoryTable } from "@/components/admin/categories/CategoryTable";
import { Plus } from "lucide-react";

export default function AdminCategoriesPage() {
  const { categories, addCategory, updateCategory } = useAdmin();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (values: CategoryFormValues) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, values);
    } else {
      await addCategory(values);
    }
    return true;
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Categories</h2>
          <p className="text-muted-foreground text-xs">Organize and tag items in your catalog</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:opacity-90 text-primary-foreground font-semibold rounded-lg text-sm shadow-sm cursor-pointer transition-all active:scale-[0.98] self-start sm:self-auto"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {/* Decoupled Category Table Component */}
      <CategoryTable
        categories={categories}
        onEdit={handleOpenEditModal}
      />

      {/* Add / Edit Form Modal */}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingCategory={editingCategory}
        categories={categories}
        onSave={handleSaveCategory}
      />
    </div>
  );
}
