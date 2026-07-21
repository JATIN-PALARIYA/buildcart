import { imagekit } from "@/lib/imagekit";

/**
 * Validate and upload an image file to ImageKit.
 * @param file The file object retrieved from the client.
 */
export async function uploadImage(file: unknown): Promise<{ url: string; fileId: string }> {
  // 1. Validation checks
  if (!file) {
    throw new Error("No file was provided for upload.");
  }

  // Ensure file is a File-like instance
  const isFile =
    file &&
    typeof file === "object" &&
    "name" in file &&
    "size" in file &&
    "type" in file &&
    "arrayBuffer" in file &&
    typeof (file as any).arrayBuffer === "function";

  if (!isFile) {
    throw new Error("Invalid file object provided.");
  }

  const fileObj = file as File;

  // Allowed mime types validation
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedMimeTypes.includes(fileObj.type)) {
    throw new Error(`File type ${fileObj.type} is not allowed. Only JPEG, PNG, WEBP, and GIF are supported.`);
  }

  // Size limit validation (5MB max)
  const maxSizeBytes = 5 * 1024 * 1024;
  if (fileObj.size > maxSizeBytes) {
    throw new Error("File size exceeds the maximum limit of 5MB.");
  }

  // 2. Upload to ImageKit
  const uploadResult = await imagekit.files.upload({
    file: fileObj,
    fileName: fileObj.name,
    folder: "buildcart/products/",
  });

  if (!uploadResult.url || !uploadResult.fileId) {
    throw new Error("ImageKit upload response is missing the file URL or file ID.");
  }

  return {
    url: uploadResult.url,
    fileId: uploadResult.fileId,
  };
}

/**
 * Deletes an image from ImageKit using its fileId.
 * Reserved for future compatibility (e.g. product updates/deletions).
 * @param fileId The ImageKit file ID.
 */
export async function deleteImage(fileId: string): Promise<void> {
  if (!fileId) return;
  await imagekit.files.delete(fileId);
}
