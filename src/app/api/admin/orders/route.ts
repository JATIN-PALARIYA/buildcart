import { connectDB } from "@/lib/db";
import { authenticateAdmin } from "@/middleware/auth.middleware";
import { createOrder, getAllOrders } from "@/services/api/order.service";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
    try {
        await connectDB();

        await authenticateAdmin(request);

        const orders = await getAllOrders();

        return NextResponse.json(
            {
                message: "Orders fetched successfully",
                orders,
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

// export async function POST(request: NextRequest) {
//     try {
//         await connectDB();
//         await authenticateAdmin(request);
//         const body = await request.json();
//         const order = await createOrder(body);
//         if (!order) {
//             return NextResponse.json(
//                 {
//                     message: "Failed to create order"
//                 },
//                 {
//                     status: 400,
//                 },
//             );
//         }
//         return NextResponse.json(
//             {
//                 message: "Order created successfully",
//                 order,
//             },
//             {
//                 status: 201,
//             },
//         );
//     } catch (error) {
//         console.error(error);
//         return NextResponse.json(
//             {
//                 message: "Internal server error",
//             },
//             {
//                 status: 500,
//             },
//         );
//     }
// }