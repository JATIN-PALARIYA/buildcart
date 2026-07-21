import ImageKit from "@imagekit/nodejs";

const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

if (!privateKey) {
  throw new Error("Missing ImageKit environment configuration variable: IMAGEKIT_PRIVATE_KEY.");
}

export const imagekit = new ImageKit({
  publicKey: publicKey || "",
  privateKey,
  urlEndpoint: urlEndpoint || "",
});

export default imagekit;

