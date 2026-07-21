import { Product, BackendProduct, CreateProductInput } from "../types/product";
import { BackendCategory } from "../types/category";

const API_BASE_URL = "/api";

// Helper function to map a BackendProduct to a frontend Product
export function mapBackendProduct(product: BackendProduct): Product {
  const isPopulatedCategory = product.category && typeof product.category !== "string";
  
  return {
    id: product._id,
    slug: product.slug,
    name: product.name,
    description: product.description ?? "",
    price: product.price,
    stock: product.stock,
    images: product.images ?? [],
    image: product.images?.[0] ?? "/placeholder.png",
    category: {
      id: isPopulatedCategory ? (product.category as BackendCategory)._id : (product.category as string || ""),
      name: isPopulatedCategory ? (product.category as BackendCategory).name : "",
      slug: isPopulatedCategory ? (product.category as BackendCategory).slug : "",
    },
    isActive: product.isActive,
    imageFileId: product.imageFileId,
  };
}

/**
 * Fetch all active public products from backend.
 * // TODO: Search handled by backend
 * // TODO: Filtering handled by backend
 * // TODO: Sorting handled by backend
 */
export async function getProducts(params?: { category?: string; search?: string; sort?: string }): Promise<Product[]> {
  const queryParams = new URLSearchParams();
  if (params?.category && params.category !== "all") {
    queryParams.set("category", params.category);
  }
  if (params?.search) {
    queryParams.set("search", params.search);
  }
  if (params?.sort) {
    queryParams.set("sort", params.sort);
  }

  // TODO: Fetch data from backend
  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/products${queryString ? `?${queryString}` : ""}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch products");
  }
  const data = await response.json();
  const products: BackendProduct[] = data.products ?? [];
  return products.map(mapBackendProduct);
}

/**
 * Fetch a single public product by slug.
 * // TODO: Product Details API
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  // TODO: Fetch data from backend
  const response = await fetch(`${API_BASE_URL}/products/${slug}`);
  if (!response.ok) {
    if (response.status === 404) return null;
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch product details");
  }
  const data = await response.json();
  return mapBackendProduct(data.product);
}

/**
 * Fetch all products for admin view (including inactive ones).
 * // TODO: Admin CRUD API
 */
export async function getAdminProducts(): Promise<Product[]> {
  // TODO: Fetch data from backend
  const response = await fetch(`${API_BASE_URL}/admin/products`);
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch admin products");
  }
  const data = await response.json();
  const products: BackendProduct[] = data.products ?? [];
  return products.map(mapBackendProduct);
}

/**
 * Create a new product.
 * // TODO: Admin CRUD API
 */
export async function createProduct(input: CreateProductInput): Promise<Product> {
  // TODO: Fetch data from backend
  const response = await fetch(`${API_BASE_URL}/admin/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create product");
  }
  const data = await response.json();
  return mapBackendProduct(data.product);
}

/**
 * Update an existing product.
 * // TODO: Admin CRUD API
 */
export async function updateProduct(id: string, input: Partial<CreateProductInput>): Promise<Product> {
  // TODO: Fetch data from backend
  const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update product");
  }
  const data = await response.json();
  return mapBackendProduct(data.product);
}

/**
 * Delete a product.
 * // TODO: Admin CRUD API
 */
export async function deleteProduct(id: string): Promise<boolean> {
  // TODO: Fetch data from backend
  const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to delete product");
  }
  return true;
}
