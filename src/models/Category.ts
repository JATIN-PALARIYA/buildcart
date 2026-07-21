import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        description: String,
    },
    {
        timestamps: true,
    },
);

const categoryModel = mongoose.models.Category || mongoose.model("Category", categorySchema);

export default categoryModel;
