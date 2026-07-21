import productModel from "@/models/Product";
import categoryModel from "@/models/Category";
import { CreateProductInput, UpdateProductInput } from "@/types/product.types";
import { generateSlug } from "@/utils/slug";

async function getUniqueSlug(baseSlug: string) {
    let counter = 0;
    let slug = "";

    while (true) {
        if (counter === 0) {
            slug = baseSlug;
        } else {
            slug = `${baseSlug}-${counter}`;
        }

        const isSlugExists = await productModel.findOne({ slug });

        if (!isSlugExists) {
            return slug;
        }
        counter++;
    }
}

export async function createProduct(data: CreateProductInput) {
    const { name, description, price, stock, category, images, imageFileId, isActive } = data;

    if (price !== undefined && price <= 0) {
        throw new Error("Price must be greater than zero.");
    }
    if (stock !== undefined && stock < 0) {
        throw new Error("Stock cannot be negative.");
    }
    if (images && images.length > 5) {
        throw new Error("A product can have a maximum of 5 images.");
    }

    const baseSlug = generateSlug(name);

    const slug = await getUniqueSlug(baseSlug);

    return await productModel.create({
        name,
        slug,
        description,
        price,
        stock,
        category,
        images,
        imageFileId,
        isActive: isActive !== undefined ? isActive : true,
    });
}

export async function getAllProducts(params?: { search?: string; category?: string; sort?: string; page?: number; limit?: number }) {
    const query: any = {};

    if (params?.search) {
        query.$or = [
            { name: { $regex: params.search, $options: "i" } },
            { description: { $regex: params.search, $options: "i" } },
        ];
    }

    if (params?.category && params.category !== "all") {
        const categoryDoc = await categoryModel.findOne({ slug: params.category });
        if (categoryDoc) {
            query.category = categoryDoc._id;
        } else {
            // Fallback to check if it's a valid category ID (e.g. for admin panels)
            query.category = params.category;
        }
    }

    let sortOption: any = { createdAt: -1 };
    if (params?.sort === "price-asc") {
        sortOption = { price: 1 };
    } else if (params?.sort === "price-desc") {
        sortOption = { price: -1 };
    } else if (params?.sort === "newest") {
        sortOption = { createdAt: -1 };
    }

    let mongoQuery = productModel.find(query).populate("category", "name slug").sort(sortOption);

    if (params?.page !== undefined && params?.limit !== undefined) {
        const skip = (params.page - 1) * params.limit;
        mongoQuery = mongoQuery.skip(skip).limit(params.limit);
    }

    return await mongoQuery;
}

export async function getProductBySlug(slug: string) {
    return await productModel.findOne({ slug }).populate("category", "name slug");
}

export async function getProductById(id: string) {
    return await productModel.findById(id).populate("category", "name slug");
}

export async function updateProduct(data: UpdateProductInput) {
    const { name, id, description, price, stock, category, images, imageFileId, isActive } = data;

    if (price !== undefined && price <= 0) {
        throw new Error("Price must be greater than zero.");
    }
    if (stock !== undefined && stock < 0) {
        throw new Error("Stock cannot be negative.");
    }
    if (images !== undefined && images.length > 5) {
        throw new Error("A product can have a maximum of 5 images.");
    }

    const product = await getProductById(id);

    if (!product) {
        return null;
    }

    if (name !== undefined && name !== product.name) {
        const baseSlug = generateSlug(name);
        const uniqueSlug = await getUniqueSlug(baseSlug);
        product.slug = uniqueSlug;
        product.name = name;
    }

    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;
    if (category !== undefined) product.category = category;
    if (images !== undefined) product.images = images;
    if (imageFileId !== undefined) product.imageFileId = imageFileId;
    if (isActive !== undefined) product.isActive = isActive;

    await product.save();

    return product;
}

export async function deleteProductById(id: string) {
    return await productModel.findByIdAndDelete(id);
}

export async function getAllPublicProducts(params?: { search?: string; category?: string; sort?: string; page?: number; limit?: number }) {
    const query: any = { isActive: true };

    if (params?.search) {
        query.$or = [
            { name: { $regex: params.search, $options: "i" } },
            { description: { $regex: params.search, $options: "i" } },
        ];
    }

    if (params?.category && params.category !== "all") {
        const categoryDoc = await categoryModel.findOne({ slug: params.category });
        if (categoryDoc) {
            query.category = categoryDoc._id;
        } else {
            // Category slug doesn't exist, return empty results immediately
            return [];
        }
    }

    let sortOption: any = { createdAt: -1 };
    if (params?.sort === "price-asc") {
        sortOption = { price: 1 };
    } else if (params?.sort === "price-desc") {
        sortOption = { price: -1 };
    } else if (params?.sort === "newest") {
        sortOption = { createdAt: -1 };
    }

    let mongoQuery = productModel
        .find(query)
        .populate("category", "name slug")
        .sort(sortOption);

    if (params?.page !== undefined && params?.limit !== undefined) {
        const skip = (params.page - 1) * params.limit;
        mongoQuery = mongoQuery.skip(skip).limit(params.limit);
    }

    return await mongoQuery;
}

export async function getPublicProductBySlug(slug: string) {
    return await productModel.findOne({
        slug,
        isActive: true,
    }).populate("category", "name slug");
}
