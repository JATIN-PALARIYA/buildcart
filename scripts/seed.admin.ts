import mongoose from "mongoose";

import { connectDB } from "@/lib/db";
import { hashPassword } from "@/lib/hash";
import adminModel from "@/models/Admin";


await connectDB();


async function createAdmin() {
    try {
        const isAdminExists = await adminModel.findOne({
            email: "admin@admin.com",
        });

        if (isAdminExists) {
            console.log("Admin already exists");
            return;
        }

        const hash = await hashPassword("admin");

        const admin = await adminModel.create({
            name: "admin",
            email: "admin@admin.com",
            password: hash,
            isActive: true,
        });
        console.log("Admin created successfully", admin)
    } catch (error) {
        console.error("Seed execution failed with error: ", error);
    }
    finally {
        await mongoose.disconnect();
    }
    
}

createAdmin();
