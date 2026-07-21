"use client";

import React, { useState } from "react";
import { useAdmin, Product } from "@/contexts/AdminContext";
import { ProductFormModal } from "@/components/admin/products/ProductFormModal";
import { ConfirmDeleteModal } from "@/components/ui/Modal";
import { ProductTable } from "@/components/admin/products/ProductTable";
import { Plus } from "lucide-react";

import { CreateProductInput } from "@/lib/types/product";

export default function AdminProductsPage() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useAdmin();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (payload: CreateProductInput) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, payload);
    } else {
      await addProduct(payload);
    }
    return true;
  };

  const handleConfirmDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteProduct(deletingId);
      setIsDeleteOpen(false);
      setDeletingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Products</h2>
          <p className="text-muted-foreground text-xs">Manage items in your inventory catalog</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:opacity-90 text-primary-foreground font-semibold rounded-lg text-sm shadow-sm cursor-pointer transition-all active:scale-[0.98] self-start sm:self-auto"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Decoupled Product Table Component */}
      <ProductTable
        products={products}
        categories={categories}
        onEdit={handleOpenEditModal}
        onDelete={handleConfirmDelete}
      />

      {/* Add / Edit Form Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingProduct={editingProduct}
        categories={categories}
        products={products}
        onSave={handleSaveProduct}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Product?"
        description="Are you sure you want to delete this product? This action is permanent. Catalog items and sales details will be removed."
      />
    </div>
  );
}
