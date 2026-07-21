import { connectDB } from "@/lib/db";
import { getPublicProductBySlug } from "@/services/api/product.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> },
) {
    try {
        await connectDB();

        const { slug } = await params;

        const product = await getPublicProductBySlug(slug);

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
                message: "Product fetched successfully",
                product,
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
