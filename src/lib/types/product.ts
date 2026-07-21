import { Category, BackendCategory } from "./category";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  image: string; // compatibility field pointing to images[0]
  category: Category;
  isActive: boolean;
  imageFileId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendProduct {
  _id: string;
  slug: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  images: string[];
  category: BackendCategory | string;
  isActive: boolean;
  imageFileId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
  images?: string[];
  isActive?: boolean;
  imageFileId?: string;
}

export interface UpdateProductInput {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
  images?: string[];
  isActive?: boolean;
  imageFileId?: string;
}
