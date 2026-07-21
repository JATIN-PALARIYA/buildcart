import { connectDB } from "@/lib/db";
import { authenticateAdmin } from "@/middleware/auth.middleware";
import { deleteProductById, updateProduct } from "@/services/api/product.service";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        await connectDB();
        await authenticateAdmin(request);

        const { id } = await params;
        const body = await request.json();
        const data = {
            id: id,
            ...body,
        };
        const product = await updateProduct(data);

        if (!product) {
            return NextResponse.json(
                {
                    message: "Product not found",
                },
                {
                    status: 404,
                },
            );
        }
        return NextResponse.json(
            {
                message: "Product updated successfully",
                product,
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
        const deletedProduct = await deleteProductById(id);

        if (!deletedProduct) {
            return NextResponse.json(
                {
                    message: "Product not found",
                },
                {
                    status: 404,
                },
            );
        }
        return NextResponse.json(
            {
                message: "Product deleted successfully",
                deletedProduct,
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
