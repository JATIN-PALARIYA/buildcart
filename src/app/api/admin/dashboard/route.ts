import { connectDB } from "@/lib/db";
import { authenticateAdmin } from "@/middleware/auth.middleware";
import orderModel from "@/models/Order";
import productModel from "@/models/Product";
import categoryModel from "@/models/Category";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        await authenticateAdmin(request);

        // 1. Fetch counts & totals from database
        const totalProductsCount = await productModel.countDocuments();
        const activeProductsCount = await productModel.countDocuments({ isActive: true });
        const categoriesCount = await categoryModel.countDocuments();
        const pendingOrdersCount = await orderModel.countDocuments({ status: "pending" });
        const processingOrdersCount = await orderModel.countDocuments({ status: "processing" });

        // Calculate total revenue from all orders
        const orders = await orderModel.find();
        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        // 2. Calculate Weekly Sales (Mon to Sun) in order of current day progression
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const weeklySalesMap = new Map<string, number>();
        const last7DaysLabels: string[] = [];
        
        const now = new Date();
        
        // Initialize last 7 days with 0 in cronological order
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(now.getDate() - i);
            const dayLabel = days[d.getDay()];
            last7DaysLabels.push(dayLabel);
            weeklySalesMap.set(dayLabel, 0);
        }

        // Fetch orders from the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const recentOrders = await orderModel.find({
            createdAt: { $gte: sevenDaysAgo }
        });

        recentOrders.forEach(order => {
            const dayLabel = days[new Date(order.createdAt).getDay()];
            if (weeklySalesMap.has(dayLabel)) {
                weeklySalesMap.set(dayLabel, (weeklySalesMap.get(dayLabel) || 0) + (order.totalAmount || 0));
            }
        });

        const weeklySales = last7DaysLabels.map(label => ({
            label,
            value: Math.round((weeklySalesMap.get(label) || 0) * 100) / 100
        }));

        // 3. Calculate Monthly Sales (Last 6 Months)
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlySalesMap = new Map<string, number>();
        const last6MonthsLabels: string[] = [];

        // Initialize last 6 months with 0 in chronological order
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(now.getMonth() - i);
            const monthLabel = months[d.getMonth()];
            last6MonthsLabels.push(monthLabel);
            monthlySalesMap.set(monthLabel, 0);
        }

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(now.getMonth() - 6);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const historicalOrders = await orderModel.find({
            createdAt: { $gte: sixMonthsAgo }
        });

        historicalOrders.forEach(order => {
            const monthLabel = months[new Date(order.createdAt).getMonth()];
            if (monthlySalesMap.has(monthLabel)) {
                monthlySalesMap.set(monthLabel, (monthlySalesMap.get(monthLabel) || 0) + (order.totalAmount || 0));
            }
        });

        const monthlySales = last6MonthsLabels.map(label => ({
            label,
            value: Math.round((monthlySalesMap.get(label) || 0) * 100) / 100
        }));

        return NextResponse.json({
            kpis: {
                totalRevenue: Math.round(totalRevenue * 100) / 100,
                activeProductsCount,
                categoriesCount,
                pendingOrdersCount,
                processingOrdersCount,
                totalProductsCount
            },
            weeklySales,
            monthlySales
        }, { status: 200 });

    } catch (error: any) {
        console.error("Dashboard API Error:", error);
        const isAuthError = error.message === "Access token is missing" || 
                            error.message === "Authentication failed" || 
                            error.message === "Invalid id" || 
                            error.message === "Admin is not active";
        return NextResponse.json(
            { message: error.message || "Internal server error" },
            { status: isAuthError ? 401 : 500 }
        );
    }
}
