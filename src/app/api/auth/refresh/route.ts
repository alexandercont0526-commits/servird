import { NextRequest } from "next/server";
import { refresh } from "@/services/auth.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refresh_token")?.value;

    const response = await refresh(refreshToken || "");

    return successResponse(response, "Token renovado exitosamente");
  } catch (error) {
    return errorResponse(error);
  }
}
