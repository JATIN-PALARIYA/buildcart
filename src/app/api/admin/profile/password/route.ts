import { connectDB } from "@/lib/db";
import { authenticateAdmin } from "@/middleware/auth.middleware";
import { updateAdminPassword } from "@/services/api/admin.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const admin = await authenticateAdmin(request);

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: "Current password and new password are required" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ message: "New password must be at least 6 characters long" }, { status: 400 });
    }

    await updateAdminPassword(admin.id, currentPassword, newPassword);

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error: any) {
    console.error("POST admin password error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    const isAuthError = message === "Access token is missing" || 
                        message === "Authentication failed" || 
                        message === "Invalid id" || 
                        message === "Admin is not active";
    return NextResponse.json({ message }, { status: isAuthError ? 401 : 400 });
  }
}
