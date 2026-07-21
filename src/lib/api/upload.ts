import { UploadResponse } from "../types/upload";

/**
 * Sends a selected browser File object to the admin upload endpoint.
 * @param file The file picked by the user.
 */
export async function uploadImage(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || "Failed to upload image to the server.");
  }

  const data = await response.json();
  return {
    url: data.url,
    fileId: data.fileId,
  };
}
