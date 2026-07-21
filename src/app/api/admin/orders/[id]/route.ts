import { connectDB } from "@/lib/db";
import { authenticateAdmin } from "@/middleware/auth.middleware";
import { deleteOrderById, getOrderById, updateOrder } from "@/services/api/order.service";
import { NextRequest, NextResponse } from "next/server";


export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {

    try {
        await connectDB();
        await authenticateAdmin(request);

        const { id } = await params;

        const order = await getOrderById(id);

        if (!order) {
            return NextResponse.json(
                {
                    message: "Order not found",
                },
                {
                    status: 404,
                },
            );
        }
        return NextResponse.json(
            {
                message: "Order fetched successfully",
                order
            },
            {
                status: 200,
            },
        );
    }
    catch (error: any) {
        console.error(error);
        const isAuthError = error.message === "Access token is missing" || 
                            error.message === "Authentication failed" || 
                            error.message === "Invalid id" || 
                            error.message === "Admin is not active";
        return NextResponse.json(
            {
                message: error.message || "Internal server error",
            },
            {
                status: isAuthError ? 401 : 500,
            },
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        await connectDB();
        await authenticateAdmin(request);

        const { id } = await params;
        const body = await request.json();
        const { status } = body;
        if (!status) {
            return NextResponse.json(
                {
                    message: "Status is required",
                },
                {
                    status: 400,
                },
            );
        }

        const order = await updateOrder(id, status);

        if (!order) {
            return NextResponse.json(
                {
                    message: "Order not found",
                },
                {
                    status: 404,
                },
            );
        }
        return NextResponse.json(
            {
                message: "Order updated successfully",
                order,
            },
            {
                status: 200,
            },
        );
    } catch (error: any) {
        console.error(error);
        const isAuthError = error.message === "Access token is missing" || 
                            error.message === "Authentication failed" || 
                            error.message === "Invalid id" || 
                            error.message === "Admin is not active";
        return NextResponse.json(
            {
                message: error.message || "Internal server error",
            },
            {
                status: isAuthError ? 401 : 500,
            },
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        await connectDB();
        await authenticateAdmin(request);

        const { id } = await params;
        const deletedOrder = await deleteOrderById(id);

        if (!deletedOrder) {
            return NextResponse.json(
                {
                    message: "Order not found",
                },
                {
                    status: 404,
                },
            );
        }
        return NextResponse.json(
            {
                message: "Order deleted successfully",
                deletedOrder,
            },
            {
                status: 200,
            },
        );
    } catch (error: any) {
        console.error(error);
        const isAuthError = error.message === "Access token is missing" || 
                            error.message === "Authentication failed" || 
                            error.message === "Invalid id" || 
                            error.message === "Admin is not active";
        return NextResponse.json(
            {
                message: error.message || "Internal server error",
            },
            {
                status: isAuthError ? 401 : 500,
            },
        );
    }
}