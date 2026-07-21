import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        description: String,
        price: {
            type: Number,
            required: true,
            min: [0.01, "Price must be greater than zero."],
        },
        stock: {
            type: Number,
            required: true,
            min: [0, "Stock cannot be negative."],
        },
        images: {
            type: [String],
            validate: {
                validator: function (v: string[]) {
                    return v.length <= 5;
                },
                message: "A product can have a maximum of 5 images."
            }
        },
        imageFileId: {
            type: String,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    },
);

const productModel =
    mongoose.models.Product || mongoose.model("Product", productSchema);

export default productModel;
