import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    console.error("MONGO_URI is not defined");
    process.exit(1);
}

const CategorySchema = new mongoose.Schema({}, { strict: false });
const ProductSchema = new mongoose.Schema({}, { strict: false });
const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema, "categories");
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema, "products");

async function check() {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB successfully");
    console.log("Categories count:", await Category.countDocuments());
    console.log("Products count:", await Product.countDocuments());
    const firstP = await Product.findOne();
    if (firstP) {
        console.log("First product details:", {
            name: firstP.get("name"),
            slug: firstP.get("slug"),
            isActive: firstP.get("isActive"),
            category: firstP.get("category")
        });
    }
    await mongoose.disconnect();
}

check().catch(console.error);
