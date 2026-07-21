import { connectDB } from "@/lib/db";
import { createOrder } from "@/services/api/order.service";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();
        if (!body.products) {
            return NextResponse.json(
                {
                    message: "Failed to create order"
                },
                {
                    status: 400,
                },
            );
        }
        const order = await createOrder(body);
        if (!order) {
            return NextResponse.json(
                {
                    message: "Failed to create order"
                },
                {
                    status: 400,
                },
            );
        }
        return NextResponse.json(
            {
                message: "Order created successfully",
                order,
            },
            {
                status: 201,
            },
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                message: "Internal server error",
            },
            {
                status: 500,
            },
        );
    }
}