import orderModel from "@/models/Order";
import productModel from "@/models/Product";
import { CreateOrderInput, OrderProduct } from "@/types/order.types";

export async function createOrder(orderData: CreateOrderInput) {
    const {
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        products,
    } = orderData;

    const orderProducts: OrderProduct[] = [];
    let totalAmount: number = 0;

    if (products.length === 0) {
        return null;
    }

    for (const item of products) {
        if (item.quantity <= 0) {
            return null;
        }
        const product = await productModel.findById(item.productId);
        if (!product || !product.isActive) {
            return null;
        }
        if (product.stock < item.quantity) {
            return null;
        }
        const lineTotal = product.price * item.quantity;
        totalAmount += lineTotal;
        const orderItem = {
            productId: product._id,
            name: product.name,
            quantity: item.quantity,
            price: product.price,
        };
        product.stock -= item.quantity;
        orderProducts.push(orderItem);
        await product.save();
    }

    const order = await orderModel.create({
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        products: orderProducts,
        totalAmount,
    });
    return order;
}

export async function getAllOrders() {
    return await orderModel.find().populate("products.productId").sort({ createdAt: -1 });
}

export async function getOrderById(id: string) {
    return await orderModel.findById(id).populate("products.productId");
}

export async function updateOrder(id: string, status: string) {
    const order = await orderModel.findById(id);
    if (!order) {
        return null;
    }
    order.status = status;
    await order.save();
    return await orderModel.findById(id).populate("products.productId");
}

export async function deleteOrderById(id: string) {
    return await orderModel.findByIdAndDelete(id);
}
