import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/components/ui/Modal";
import { AlertCircle, FolderPlus } from "lucide-react";
import { Category, CreateCategoryInput } from "@/lib/types/category";
import { generateSlug } from "@/utils/slug";

// Form validation schema
const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(50, "Name is too long"),
  description: z.string().max(200, "Description is too long").optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCategory: Category | null;
  categories: Category[];
  onSave: (payload: CreateCategoryInput & { slug: string }) => Promise<boolean>;
}

export function CategoryFormModal({
  isOpen,
  onClose,
  editingCategory,
  categories,
  onSave,
}: CategoryFormModalProps) {
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });



  // Sync edit values or reset
  useEffect(() => {
    if (isOpen) {
      setFormError(null);
      if (editingCategory) {
        reset({
          name: editingCategory.name,
          description: editingCategory.description || "",
        });
      } else {
        reset({
          name: "",
          description: "",
        });
      }
    }
  }, [isOpen, editingCategory, reset]);

  const onSubmit = async (values: CategoryFormValues) => {
    setFormError(null);

    const silentSlug = generateSlug(values.name);

    // Check duplicates locally if adding a new category
    if (!editingCategory) {
      const duplicate = categories.find(
        (c) => c.slug === silentSlug || c.name.toLowerCase() === values.name.toLowerCase()
      );
      if (duplicate) {
        setFormError("A category with this name already exists.");
        return;
      }
    }

    try {
      const payload = {
        name: values.name,
        description: values.description,
        slug: silentSlug,
      };
      const success = await onSave(payload);
      if (success !== false) {
        onClose();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save category.";
      setFormError(msg);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingCategory ? "Edit Category" : "Add New Category"}
      icon={<FolderPlus className="h-5 w-5" />}
    >
      {formError && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-2 text-destructive text-xs">
          <AlertCircle className="shrink-0 h-4 w-4 mt-0.5" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-muted-foreground">
            Category Name *
          </label>
          <input
            type="text"
            placeholder="e.g. Laptops & Computers"
            {...register("name")}
            className={`w-full px-3 py-2 bg-background border rounded-lg text-sm outline-none transition-all ${errors.name ? "border-destructive focus:ring-1 focus:ring-destructive" : "border-border focus:ring-1 focus:ring-primary"
              }`}
          />
          {errors.name && (
            <p className="text-[11px] text-destructive font-medium">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-muted-foreground">
            Description
          </label>
          <textarea
            placeholder="Provide a short description..."
            rows={3}
            {...register("description")}
            className={`w-full px-3 py-2 bg-background border rounded-lg text-sm outline-none transition-all resize-none ${errors.description ? "border-destructive focus:ring-1 focus:ring-destructive" : "border-border focus:ring-1 focus:ring-primary"
              }`}
          />
          {errors.description && (
            <p className="text-[11px] text-destructive font-medium">{errors.description.message}</p>
          )}
        </div>

        <div className="flex gap-3 pt-3 border-t border-border mt-5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 bg-secondary text-secondary-foreground font-semibold rounded-lg text-xs border border-border hover:bg-secondary/80 transition-all cursor-pointer text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-xs shadow-sm hover:opacity-90 transition-all cursor-pointer text-center"
          >
            {isSubmitting ? "Saving..." : "Save Category"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
export default CategoryFormModal;
