import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoriaId = searchParams.get("categoria_id") || undefined;
    const search = searchParams.get("q") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      disponible: true,
      usuario: { isActive: true },
    };

    if (categoriaId) {
      where.categorias = { some: { categoriaId } };
    }

    if (search) {
      where.OR = [
        { profesion: { contains: search, mode: "insensitive" } },
        { nombreNegocio: { contains: search, mode: "insensitive" } },
        {
          usuario: {
            nombre: { contains: search, mode: "insensitive" },
          },
        },
      ];
    }

    const [profesionales, total] = await Promise.all([
      prisma.perfilProfesional.findMany({
        where,
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
              avatarUrl: true,
              ciudad: true,
            },
          },
          categorias: {
            include: {
              categoria: {
                select: { id: true, nombre: true, slug: true },
              },
            },
          },
        },
        orderBy: [
          { verificado: "desc" },
          { calificacionPromedio: "desc" },
          { trabajosCompletados: "desc" },
        ],
        skip,
        take: limit,
      }),
      prisma.perfilProfesional.count({ where }),
    ]);

    return successResponse({
      data: profesionales,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
