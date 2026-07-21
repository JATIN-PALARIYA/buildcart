import { connectDB } from "@/lib/db";
import { loginAdmin } from "@/services/api/admin.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                {
                    message: "Email and password are required",
                },
                {
                    status: 400,
                },
            );
        }

        const result = await loginAdmin(email, password);
        const response = NextResponse.json({
            success: true,
            admin: result.admin,
        });

        response.cookies.set("access_token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
        });
        return response;
    } catch (error: unknown) {
        console.error(error);
        const message = error instanceof Error ? error.message : "Internal Server Error";
        const isAuthError = message === "Invalid email" || message === "Invalid email password";
        return NextResponse.json(
            {
                message,
            },
            {
                status: isAuthError ? 401 : 500,
            },
        );
    }
}
