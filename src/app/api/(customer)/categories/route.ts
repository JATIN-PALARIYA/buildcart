import { connectDB } from "@/lib/db";
import { getAllPublicCategories } from "@/services/api/category.service";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        await connectDB();
        const categories = await getAllPublicCategories();
        return NextResponse.json(
            {
                message: "Categories fetched successfully",
                categories,
            },
            {
                status: 200,
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