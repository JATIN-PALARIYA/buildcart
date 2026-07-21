import dotenv from "dotenv";

import mongoose from "mongoose";

if (process.env.NODE_ENV !== "production") {
    dotenv.config({ path: ".env.local" });
}

async function connectDB() {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        throw new Error("MONGO_URI is not defined");
    }

    if (mongoose.connection.readyState === 1) {
        return;
    }

    await mongoose.connect(mongoUri);
    console.log("Database connected successfully");
}

export { connectDB };
