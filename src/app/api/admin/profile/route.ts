import { connectDB } from "@/lib/db";
import { authenticateAdmin } from "@/middleware/auth.middleware";
import { updateAdminProfile } from "@/services/api/admin.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const admin = await authenticateAdmin(request);

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("GET admin profile error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message }, { status: 401 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const admin = await authenticateAdmin(request);

    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json({ message: "Name and email are required" }, { status: 400 });
    }

    const updatedAdmin = await updateAdminProfile(admin.id, { name, email });

    return NextResponse.json({
      success: true,
      admin: updatedAdmin,
    });
  } catch (error: any) {
    console.error("PUT admin profile error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    const isAuthError = message === "Access token is missing" || 
                        message === "Authentication failed" || 
                        message === "Invalid id";
    return NextResponse.json({ message }, { status: isAuthError ? 401 : 500 });
  }
}
