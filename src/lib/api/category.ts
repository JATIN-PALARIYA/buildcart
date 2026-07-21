import { Category, BackendCategory, CreateCategoryInput } from "../types/category";

const API_BASE_URL = "/api";

// Helper function to map BackendCategory to frontend Category
export function mapBackendCategory(category: BackendCategory): Category {
  return {
    id: category._id,
    slug: category.slug,
    name: category.name,
    description: category.description ?? "",
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

/**
 * Fetch all categories for public storefront.
 * // TODO: Categories API
 */
export async function getCategories(): Promise<Category[]> {
  // TODO: Fetch data from backend
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch categories");
  }
  const data = await response.json();
  const categories: BackendCategory[] = data.categories ?? [];
  return categories.map(mapBackendCategory);
}

/**
 * Fetch all categories for admin panel.
 * // TODO: Categories API
 */
export async function getAdminCategories(): Promise<Category[]> {
  // TODO: Fetch data from backend
  const response = await fetch(`${API_BASE_URL}/admin/categories`);
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch admin categories");
  }
  const data = await response.json();
  const categories: BackendCategory[] = data.categories ?? [];
  return categories.map(mapBackendCategory);
}

/**
 * Create a new category.
 * // TODO: Admin CRUD API
 */
export async function createCategory(input: CreateCategoryInput): Promise<Category> {
  // TODO: Fetch data from backend
  const response = await fetch(`${API_BASE_URL}/admin/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create category");
  }
  const data = await response.json();
  return mapBackendCategory(data.category);
}

/**
 * Update an existing category.
 * // TODO: Admin CRUD API
 */
export async function updateCategory(id: string, input: Partial<CreateCategoryInput>): Promise<Category> {
  // TODO: Fetch data from backend
  const response = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update category");
  }
  const data = await response.json();
  return mapBackendCategory(data.category);
}

/**
 * Delete a category.
 * // TODO: Admin CRUD API
 */
export async function deleteCategory(id: string): Promise<boolean> {
  // TODO: Fetch data from backend
  const response = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to delete category");
  }
  return true;
}
