import { verifyAndDecodeToken } from "@/lib/jwt";
import adminModel from "@/models/Admin";
import { NextRequest } from "next/server";

export async function authenticateAdmin(request: NextRequest) {

    const token = request.cookies.get("access_token");
    if (!token) {
        throw new Error("Access token is missing");
    }
    
    const decoded = verifyAndDecodeToken(token.value);
    if (!decoded) {
        throw new Error("Authentication failed");
    }

    if (typeof decoded === 'string') {
        throw new Error("Authentication failed")
    }
    const id = (decoded as { id: string }).id;
    const admin = await adminModel.findById(id);

    if (!admin) {
        throw new Error("Invalid id");
    }
    

    return admin;
}