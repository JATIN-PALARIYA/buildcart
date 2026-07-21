import slugify from "slugify";


function generateSlug(name: string) {
    const slug = slugify(name, {
        replacement: "-",
        lower: true,
        strict: true,
        trim: true,
    });
    

    return slug;
}


export { generateSlug }