import { Order, BackendOrder, CreateOrderInput, OrderStatus } from "../types/order";
import { mapBackendProduct } from "./product";
import { BackendProduct } from "../types/product";

const API_BASE_URL = "/api";

// Helper function to map BackendOrder to frontend Order
export function mapBackendOrder(order: BackendOrder): Order {
  return {
    id: order._id,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    shippingAddress: order.shippingAddress,
    products: (order.products ?? []).map((item) => {
      const isPopulatedProduct = item.productId && typeof item.productId !== "string";
      return {
        product: isPopulatedProduct ? mapBackendProduct(item.productId as BackendProduct) : null,
        productId: isPopulatedProduct ? (item.productId as BackendProduct)._id : (item.productId as string),
        quantity: item.quantity,
        price: item.price,
      };
    }),
    totalAmount: order.totalAmount,
    status: order.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

/**
 * Submit checkout order to the backend.
 * // TODO: Checkout API
 * // TODO: Payment Integration
 * // TODO: Shipping calculation
 * // TODO: Tax calculation
 */
export async function createOrder(input: CreateOrderInput): Promise<Order> {
  // TODO: Fetch data from backend
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to place order");
  }
  const data = await response.json();
  return mapBackendOrder(data.order);
}

/**
 * Fetch all orders for the admin view.
 * // TODO: Orders API
 */
export async function getAdminOrders(): Promise<Order[]> {
  // TODO: Fetch data from backend
  const response = await fetch(`${API_BASE_URL}/admin/orders`);
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch admin orders");
  }
  const data = await response.json();
  const orders: BackendOrder[] = data.orders ?? [];
  return orders.map(mapBackendOrder);
}

/**
 * Update the status of an order.
 * // TODO: Orders API
 */
export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  // TODO: Fetch data from backend
  const response = await fetch(`${API_BASE_URL}/admin/orders/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update order status");
  }
  const data = await response.json();
  return mapBackendOrder(data.order);
}
