import ImageKit from "@imagekit/nodejs";

const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

if (!privateKey) {
  throw new Error("Missing ImageKit environment configuration variable: IMAGEKIT_PRIVATE_KEY.");
}

export const imagekit = new ImageKit({
  privateKey,
});

export default imagekit;

