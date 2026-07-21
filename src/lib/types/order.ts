import { Product, BackendProduct } from "./product";

export interface OrderItem {
  product: Product | null;
  productId: string;
  quantity: number;
  price: number;
}

export interface BackendOrderItem {
  productId: BackendProduct | string;
  quantity: number;
  price: number;
}

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  shippingAddress: string;
  products: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BackendOrder {
  _id: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  shippingAddress: string;
  products: BackendOrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemInput {
  productId: string;
  quantity: number;
}

export interface OrderProduct {
  productId: string | any;
  name?: string;
  quantity: number;
  price: number;
}

export interface CreateOrderInput {
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  shippingAddress: string;
  products: OrderItemInput[];
}
