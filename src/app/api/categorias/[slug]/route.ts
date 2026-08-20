import { NextRequest } from "next/server";
import { getCategoriaBySlug } from "@/services/categoria.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const categoria = await getCategoriaBySlug(slug);
    return successResponse(categoria);
  } catch (error) {
    return errorResponse(error);
  }
}
