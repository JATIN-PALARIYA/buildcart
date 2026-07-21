import { connectDB } from "@/lib/db";
import { authenticateAdmin } from "@/middleware/auth.middleware";
import { uploadImage } from "@/services/api/upload.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // 1. Establish database connection
    await connectDB();

    // 2. Validate administrator authorization session
    await authenticateAdmin(request);

    // 3. Extract uploaded file payload from form body
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { message: "No file was found in form submission." },
        { status: 400 }
      );
    }

    // 4. Delegate binary upload to service layer
    const result = await uploadImage(file);

    return NextResponse.json(
      {
        message: "Image uploaded successfully",
        url: result.url,
        fileId: result.fileId,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Admin upload API route error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    
    // Map authentication/session failures to HTTP 401 Unauthorized
    const isAuthFailure = 
      message.includes("Access token") || 
      message.includes("Authentication failed") || 
      message.includes("Invalid id") || 
      message.includes("not active");

    return NextResponse.json(
      { message },
      { status: isAuthFailure ? 401 : 500 }
    );
  }
}
export const dynamic = "force-dynamic";
