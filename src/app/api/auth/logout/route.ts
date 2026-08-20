import { NextRequest } from "next/server";
import { logout } from "@/services/auth.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function POST(_request: NextRequest) {
  try {
    const response = await logout();

    return successResponse(response);
  } catch (error) {
    return errorResponse(error);
  }
}
