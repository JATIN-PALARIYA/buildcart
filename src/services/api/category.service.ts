import categoryModel from "@/models/Category";
import { generateSlug } from "@/utils/slug";
import { CreateCategoryInput, UpdateCategoryInput } from "@/types/category.types";

async function getUniqueSlug(baseSlug: string) {
    let counter = 0;
    let slug = "";

    while (true) {
        if (counter === 0) {
            slug = baseSlug;
        } else {
            slug = `${baseSlug}-${counter}`;
        }

        const isSlugExists = await categoryModel.findOne({ slug });

        if (!isSlugExists) {
            return slug;
        }

        counter++;
    }
}

export async function createCategory(data: CreateCategoryInput) {
    const { name, description } = data;

    const baseSlug = generateSlug(name);

    const slug = await getUniqueSlug(baseSlug);

    const category = await categoryModel.create({
        name,
        slug,
        description,
    });

    return category;
}

export async function getAllCategories() {
    const categories = await categoryModel.find();
    return categories;
}

export async function getCategoryById(id: string) {
    const category = await categoryModel.findById(id);
    if (!category) {
        return null;
    }

    return category;
}

export async function updateCategory(data: UpdateCategoryInput) {
    const { name, id, description } = data;

    const category = await getCategoryById(id);

    if (!category) {
        return null;
    }

    if (name !== undefined && name !== category.name) {
        const baseSlug = generateSlug(name);
        const uniqueSlug = await getUniqueSlug(baseSlug);
        category.slug = uniqueSlug;
        category.name = name;
    }

    if(description !== undefined) category.description = description;
        
    await category.save();

    return category;
}

export async function deleteCategoryById(id: string) {
    return await categoryModel.findByIdAndDelete(id);
}

export async function getAllPublicCategories() {
    return await categoryModel.find();
}