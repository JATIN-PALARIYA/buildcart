import { connectDB } from "@/lib/db";
import { getAllPublicProducts } from "@/services/api/product.service";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = request.nextUrl;
        const search = searchParams.get("search") || undefined;
        const category = searchParams.get("category") || undefined;
        const sort = searchParams.get("sort") || undefined;

        const pageParam = searchParams.get("page");
        const limitParam = searchParams.get("limit");
        const page = pageParam ? parseInt(pageParam, 10) : undefined;
        const limit = limitParam ? parseInt(limitParam, 10) : undefined;

        const products = await getAllPublicProducts({
            search,
            category,
            sort,
            page,
            limit,
        });

        return NextResponse.json(
            {
                message: "Products fetched successfully",
                products,
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