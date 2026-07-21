import { connectDB } from "@/lib/db";
import { authenticateAdmin } from "@/middleware/auth.middleware";
import { createProduct, getAllProducts } from "@/services/api/product.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        await authenticateAdmin(request);

        const products = await getAllProducts();

        return NextResponse.json(
            {
                message: "Products fetched successfully",
                products,
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

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        await authenticateAdmin(request);
        const body = await request.json();
        const product = await createProduct(body);
        if (!product) {
            return NextResponse.json(
                {
                    message: "Failed to create product"
                },
                {
                    status: 400,
                },
            );
        }
        return NextResponse.json(
            {
                message: "Product created successfully",
                product,
            },
            {
                status: 201,
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
