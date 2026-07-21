import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        customerName: {
            type: String,
            required: true,
        },
        customerEmail: {
            type: String,
        },
        customerPhone: {
            type: String,
            required: true,
        },
        shippingAddress: {
            type: String,
            required: true,
        },
        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
            },
        ],
        totalAmount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            default: "pending",
        },
    },
    {
        timestamps: true,
    },
);

const orderModel =
    mongoose.models.Order || mongoose.model("Order", orderSchema);

export default orderModel;
