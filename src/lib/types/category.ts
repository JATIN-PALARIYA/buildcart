export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendCategory {
  _id: string;
  slug: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
}

export interface UpdateCategoryInput {
  id: string;
  name?: string;
  description?: string;
}
