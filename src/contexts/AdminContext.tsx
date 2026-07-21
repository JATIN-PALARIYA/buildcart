"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Category } from "@/lib/types/category";
import { Product } from "@/lib/types/product";
import { Order, OrderStatus } from "@/lib/types/order";
import { AdminUser } from "@/lib/types/auth";

export type { Category, Product, Order, OrderStatus, AdminUser };


import * as categoryApi from "@/lib/api/category";
import * as productApi from "@/lib/api/product";
import * as orderApi from "@/lib/api/order";
import * as authApi from "@/lib/api/auth";

interface AdminContextType {
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
  categories: Category[];
  products: Product[];
  orders: Order[];
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  // Category operations
  addCategory: (category: { name: string; description?: string }) => Promise<Category>;
  updateCategory: (id: string, category: { name?: string; description?: string }) => Promise<Category>;
  deleteCategory: (id: string) => Promise<boolean>;
  // Product operations
  addProduct: (product: {
    name: string;
    description?: string;
    price: number;
    stock: number;
    category: string;
    images?: string[];
    isActive?: boolean;
  }) => Promise<Product>;
  updateProduct: (id: string, product: {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    category?: string;
    images?: string[];
    isActive?: boolean;
  }) => Promise<Product>;
  deleteProduct: (id: string) => Promise<boolean>;
  // Order operations
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<Order>;
  // Profile operations
  updateProfile: (name: string, email: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Helper to fetch all admin data from backend APIs
  const refreshData = async () => {
    try {
      // TODO: Fetch data from backend
      // TODO: Products API
      // TODO: Categories API
      // TODO: Orders API
      const [fetchedCats, fetchedProds, fetchedOrders] = await Promise.all([
        categoryApi.getAdminCategories(),
        productApi.getAdminProducts(),
        orderApi.getAdminOrders(),
      ]);
      setCategories(fetchedCats);
      setProducts(fetchedProds);
      setOrders(fetchedOrders);
    } catch (error: any) {
      console.error("Failed to fetch admin data:", error);
      const message = error?.message || "";
      if (
        message.includes("Access token is missing") ||
        message.includes("Authentication failed") ||
        message.includes("Invalid id") ||
        message.includes("Admin is not active")
      ) {
        logout();
      }
    }
  };

  // Initialize authentication state on mount
  useEffect(() => {
    const initAuth = async () => {
      if (typeof window !== "undefined") {
        const storedAuth = localStorage.getItem("buildcart_admin_auth");
        if (storedAuth) {
          try {
            const parsedAuth = JSON.parse(storedAuth);
            setIsAuthenticated(true);
            setAdminUser(parsedAuth);
          } catch (e) {
            console.error("Failed to parse stored auth", e);
          }
        }
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  // Fetch store data once authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    } else {
      setCategories([]);
      setProducts([]);
      setOrders([]);
    }
  }, [isAuthenticated]);

  /**
   * Admin Authentication login request
   * // TODO: Authentication handled by backend
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi.login(email, password);
      if (response.success && response.admin) {
        setIsAuthenticated(true);
        setAdminUser(response.admin);
        if (typeof window !== "undefined") {
          localStorage.setItem("buildcart_admin_auth", JSON.stringify(response.admin));
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  /**
   * Admin logout request
   * // TODO: Authentication handled by backend
   */
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      setIsAuthenticated(false);
      setAdminUser(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("buildcart_admin_auth");
      }
    }
  };

  /**
   * Create Category
   * // TODO: Categories API
   * // TODO: Admin CRUD API
   */
  const addCategory = async (catData: { name: string; description?: string }): Promise<Category> => {
    const newCat = await categoryApi.createCategory(catData);
    await refreshData();
    return newCat;
  };

  /**
   * Update Category
   * // TODO: Categories API
   * // TODO: Admin CRUD API
   */
  const updateCategory = async (id: string, updatedFields: { name?: string; description?: string }): Promise<Category> => {
    const updated = await categoryApi.updateCategory(id, updatedFields);
    await refreshData();
    return updated;
  };

  /**
   * Delete Category
   * // TODO: Categories API
   * // TODO: Admin CRUD API
   */
  const deleteCategory = async (id: string): Promise<boolean> => {
    const success = await categoryApi.deleteCategory(id);
    await refreshData();
    return success;
  };

  /**
   * Create Product
   * // TODO: Products API
   * // TODO: Admin CRUD API
   */
  const addProduct = async (prodData: {
    name: string;
    description?: string;
    price: number;
    stock: number;
    category: string;
    images?: string[];
    isActive?: boolean;
  }): Promise<Product> => {
    const newProd = await productApi.createProduct(prodData);
    await refreshData();
    return newProd;
  };

  /**
   * Update Product
   * // TODO: Products API
   * // TODO: Admin CRUD API
   */
  const updateProduct = async (id: string, updatedFields: {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    category?: string;
    images?: string[];
    isActive?: boolean;
  }): Promise<Product> => {
    const updated = await productApi.updateProduct(id, updatedFields);
    await refreshData();
    return updated;
  };

  /**
   * Delete Product
   * // TODO: Products API
   * // TODO: Admin CRUD API
   */
  const deleteProduct = async (id: string): Promise<boolean> => {
    const success = await productApi.deleteProduct(id);
    await refreshData();
    return success;
  };

  /**
   * Update Order Status
   * // TODO: Orders API
   */
  const updateOrderStatus = async (id: string, status: OrderStatus): Promise<Order> => {
    const updated = await orderApi.updateOrderStatus(id, status);
    await refreshData();
    return updated;
  };

  /**
   * Update admin user profile
   */
  const updateProfile = async (name: string, email: string) => {
    const updatedUser = await authApi.updateProfile(name, email);
    setAdminUser(updatedUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("buildcart_admin_auth", JSON.stringify(updatedUser));
    }
  };

  /**
   * Update admin user password
   */
  const updatePassword = async (currentPass: string, newPass: string) => {
    await authApi.updatePassword(currentPass, newPass);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <p className="text-sm font-medium tracking-wide">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        adminUser,
        categories,
        products,
        orders,
        loading,
        login,
        logout,
        addCategory,
        updateCategory,
        deleteCategory,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        updateProfile,
        updatePassword,
        refreshData,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
