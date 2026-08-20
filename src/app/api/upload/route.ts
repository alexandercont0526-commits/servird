import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth";
import { UnauthorizedError, BadRequestError } from "@/lib/errors";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new UnauthorizedError();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "servird";

    if (!file) throw new BadRequestError("No se proporcionó archivo");

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestError("El archivo excede 10MB");
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      throw new BadRequestError("Tipo de archivo no permitido (solo imágenes)");
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      const timestamp = Date.now();
      const ext = file.name.split(".").pop() || "jpg";
      const filename = `${folder}/${timestamp}.${ext}`;
      const dataUrl = await fileToDataUrl(file);

      return successResponse({
        url: dataUrl,
        filename,
        provider: "local",
      });
    }

    const timestamp = Math.round(Date.now() / 1000);
    const signature = await generateCloudinarySignature(timestamp, folder, apiSecret);

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("folder", folder);
    uploadFormData.append("timestamp", timestamp.toString());
    uploadFormData.append("api_key", apiKey);
    uploadFormData.append("signature", signature);

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const res = await fetch(cloudinaryUrl, { method: "POST", body: uploadFormData });
    const data = await res.json();

    if (data.error) {
      throw new BadRequestError(data.error.message || "Error al subir a Cloudinary");
    }

    return successResponse({
      url: data.secure_url,
      filename: data.public_id,
      provider: "cloudinary",
    });
  } catch (error) {
    return errorResponse(error);
  }
}

async function fileToDataUrl(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const mime = file.type;
  return `data:${mime};base64,${base64}`;
}

async function generateCloudinarySignature(
  timestamp: number,
  folder: string,
  apiSecret: string
): Promise<string> {
  const crypto = await import("crypto");
  const str = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  return crypto.createHash("sha256").update(str).digest("hex");
}
