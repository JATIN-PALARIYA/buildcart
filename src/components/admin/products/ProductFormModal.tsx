"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal";
import { AlertCircle, Sparkles } from "lucide-react";
import { Category } from "@/lib/types/category";
import { Product, CreateProductInput } from "@/lib/types/product";
import { generateSlug } from "@/utils/slug";
import { productSchema, ProductFormValues } from "@/lib/validators/product";
import { ProductImageUpload } from "./ProductImageUpload";
import { uploadImage as apiUploadImage } from "@/lib/api/upload";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct: Product | null;
  products: Product[];
  categories: Category[];
  onSave: (payload: CreateProductInput) => Promise<boolean>;
}

export function ProductFormModal({
  isOpen,
  onClose,
  editingProduct,
  products,
  categories,
  onSave,
}: ProductFormModalProps) {
  
  const [formError, setFormError] = useState<string | null>(null);
  const [imagesList, setImagesList] = useState<string[]>([]);
  const [imageFileId, setImageFileId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
      isActive: true,
      imageFileId: "",
    },
  });

  // Sync state values on open/change
  useEffect(() => {
    if (isOpen) {
      setFormError(null);
      setSelectedFiles([]);
      setIsUploading(false);
      if (editingProduct) {
        setImagesList(editingProduct.images || []);
        setImageFileId(editingProduct.imageFileId || null);
        const catId = typeof editingProduct.category === "object" && editingProduct.category?.id
          ? editingProduct.category.id
          : (typeof editingProduct.category === "string" ? editingProduct.category : (categories[0]?.id ?? ""));
        try {
          reset({
            name: editingProduct.name || "",
            description: editingProduct.description || "",
            price: editingProduct.price ?? 0,
            stock: editingProduct.stock ?? 0,
            category: catId,
            isActive: editingProduct.isActive ?? true,
            imageFileId: editingProduct.imageFileId || "",
          });
        } catch (err) {
          console.error('Reset error:', err);
        }
      } else {
        setImagesList([]);
        setImageFileId(null);
        reset({
          name: "",
          description: "",
          price: 0,
          stock: 0,
          category: categories[0]?.id || "",
          isActive: true,
          imageFileId: "",
        });
      }
    }
  }, [isOpen, editingProduct, categories, reset]);
  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Append new files, respecting max limit of 5 total
      setSelectedFiles((prev) => {
        const combined = [...prev, ...Array.from(files)];
        const maxAdd = 5 - imagesList.length;
        return combined.slice(0, maxAdd);
      });
      setFormError(null);
    }
  };

  // No separate upload; files will be uploaded on form submit.
  const handleRemovePendingFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveImageAtIndex = (index: number) => {
    setImagesList((prev) => prev.filter((_, i) => i !== index));
    if (index === 0) {
      setImageFileId(null);
      setValue("imageFileId", "");
    }
  };

  // No separate cancel; removal is handled via handleRemovePendingFile.

  const onSubmit = async (values: ProductFormValues) => {
    setFormError(null);
    const silentSlug = generateSlug(values.name);

    // Duplicate check for new products
    if (!editingProduct) {
      const duplicate = products.find((p) => p.slug === silentSlug);
      if (duplicate) {
        setFormError("A product with this name already exists.");
        return;
      }
    }

    // Upload any pending selected files before saving
    let uploadedUrls: string[] = [];
    let uploadedFileIds: string[] = [];
    if (selectedFiles.length > 0) {
      setIsUploading(true);
      try {
        for (const file of selectedFiles) {
          const result = await apiUploadImage(file);
          uploadedUrls.push(result.url);
          uploadedFileIds.push(result.fileId);
        }
        // Merge with existing imagesList
        setImagesList((prev) => [...prev, ...uploadedUrls]);
        // Set primary imageFileId if not set
        if (!imageFileId && uploadedFileIds.length > 0) {
          setImageFileId(uploadedFileIds[0]);
          setValue("imageFileId", uploadedFileIds[0]);
        }
        // Clear pending files
        setSelectedFiles([]);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Image upload failed.";
        setFormError(msg);
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    try {
      const payload: CreateProductInput = {
        name: values.name.trim(),

        description: values.description?.trim() || "",
        price: values.price,
        stock: values.stock,
        images: [...imagesList, ...uploadedUrls],
        imageFileId: imageFileId || undefined,
        category: values.category,
        isActive: values.isActive,
      };

      const success = await onSave(payload);
      if (success !== false) {
        onClose();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save product.";
      setFormError(msg);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingProduct ? "Edit Product" : "Add New Product"}
      icon={<Sparkles className="h-5 w-5" />}
      maxWidth="lg"
    >
      {formError && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-2 text-destructive text-xs">
          <AlertCircle className="shrink-0 h-4 w-4 mt-0.5" />
          <span>{formError}</span>
        </div>
      )}

              <form onSubmit={handleSubmit(onSubmit, (err) => { setFormError('Please correct the highlighted fields before submitting.'); })} className="space-y-3">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-muted-foreground">
            Product Name *
          </label>
          <input
            type="text"
            placeholder="e.g. MacBook Pro M3"
            {...register("name")}
            className={`w-full px-3 py-2 bg-background border rounded-lg text-sm outline-none transition-all ${errors.name ? "border-destructive focus:ring-1 focus:ring-destructive" : "border-border focus:ring-1 focus:ring-primary"
              }`}
          />
          {errors.name && (
            <p className="text-[11px] text-destructive font-medium">{errors.name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-muted-foreground">
              Price ($ USD) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="e.g. 1299.99"
              {...register("price")}
              className={`w-full px-3 py-2 bg-background border rounded-lg text-sm outline-none transition-all ${errors.price ? "border-destructive focus:ring-1 focus:ring-destructive" : "border-border focus:ring-1 focus:ring-primary"
                }`}
            />
            {errors.price && (
              <p className="text-[11px] text-destructive font-medium">{errors.price.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-muted-foreground">
              Stock Quantity *
            </label>
            <input
              type="number"
              min={0}
              placeholder="e.g. 25"
              {...register("stock")}
              className={`w-full px-3 py-2 bg-background border rounded-lg text-sm outline-none transition-all ${errors.stock ? "border-destructive focus:ring-1 focus:ring-destructive" : "border-border focus:ring-1 focus:ring-primary"
                }`}
            />
            {errors.stock && (
              <p className="text-[11px] text-destructive font-medium">{errors.stock.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-muted-foreground">
              Category *
            </label>
            <select
              {...register("category")}
              className={`w-full px-3 py-2 bg-background border rounded-lg text-sm outline-none transition-all cursor-pointer ${errors.category ? "border-destructive" : "border-border focus:ring-1 focus:ring-primary"
                }`}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-[11px] text-destructive font-medium">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-muted-foreground">
              Product Status
            </label>
            <div className="flex items-center h-9">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register("isActive")}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-muted rounded-full peer peer-focus:ring-1 peer-focus:ring-primary peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-muted-foreground/60 after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary peer-checked:after:bg-primary-foreground peer-checked:after:border-primary-foreground" />
                <span className="ml-2.5 text-xs font-medium text-foreground">
                  {watch("isActive") ? "Active (Listed)" : "Draft (Hidden)"}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Image Upload Subcomponent */}
        <ProductImageUpload
          imagesList={imagesList}
          selectedFiles={selectedFiles}
          isUploading={isUploading}
          onFileSelect={handleFileSelect}
          onRemoveImageAtIndex={handleRemoveImageAtIndex}
          onRemovePendingFile={handleRemovePendingFile}
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-muted-foreground">
            Description
          </label>
          <textarea
            placeholder="Full description and specifications..."
            rows={2}
            {...register("description")}
            className={`w-full px-3 py-2 bg-background border rounded-lg text-sm outline-none transition-all resize-none ${errors.description ? "border-destructive focus:ring-1 focus:ring-destructive" : "border-border focus:ring-1 focus:ring-primary"
              }`}
          />
          {errors.description && (
            <p className="text-[11px] text-destructive font-medium">{errors.description.message}</p>
          )}
        </div>

        <div className="flex gap-3 pt-3 border-t border-border mt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 bg-secondary text-secondary-foreground font-semibold rounded-lg text-xs border border-border hover:bg-secondary/80 transition-all cursor-pointer text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="flex-1 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-xs shadow-sm hover:opacity-95 transition-all cursor-pointer text-center disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
export default ProductFormModal;
