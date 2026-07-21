import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(60, "Name is too long"),
  description: z.string().max(400, "Description is too long").optional(),
  price: z.coerce.number().min(0.01, "Price must be greater than zero"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  category: z.string().min(1, "Please select a category"),
  isActive: z.boolean(),
  imageFileId: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
