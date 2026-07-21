import { connectDB } from "@/lib/db";
import { authenticateAdmin } from "@/middleware/auth.middleware";
import { deleteCategoryById, updateCategory } from "@/services/api/category.service";
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
        const category = await updateCategory(data);

        if (!category) {
            return NextResponse.json(
                {
                    message: "Category not updated",
                },
                {
                    status: 404,
                },
            );
        }
        return NextResponse.json(
            {
                message: "Category updated successfully",
                category,
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

export async function DELETE() {
    return NextResponse.json(
        { message: "Category deletion is disabled for system protection." },
        { status: 403 }
    );
}
