import { connectDB } from "@/lib/db";
import { authenticateAdmin } from "@/middleware/auth.middleware";
import { createCategory, getAllCategories } from "@/services/api/category.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        await authenticateAdmin(request);
        const categories = await getAllCategories();
        return NextResponse.json(
            {
                message: "Categories fetched successfully",
                categories,
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
        const category = await createCategory(body);
        return NextResponse.json(
            {
                message: "Category created successfully",
                category,
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
