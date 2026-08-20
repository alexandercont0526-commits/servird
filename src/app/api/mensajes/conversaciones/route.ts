import { NextRequest } from "next/server";
import { getConversaciones } from "@/services/mensaje.service";
import { successResponse, errorResponse } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth";
import { UnauthorizedError } from "@/lib/errors";

export async function GET(_request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new UnauthorizedError();

    const conversaciones = await getConversaciones(user.userId);
    return successResponse(conversaciones);
  } catch (error) {
    return errorResponse(error);
  }
}
