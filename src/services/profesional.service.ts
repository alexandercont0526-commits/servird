import prisma from "@/lib/prisma";
import { NotFoundError, ForbiddenError } from "@/lib/errors";

export async function getProfesionalesCercanos({
  lat,
  lng,
  radioKm = 25,
  categoriaId,
  minCalificacion,
  page = 1,
  limit = 20,
}: {
  lat: number;
  lng: number;
  radioKm?: number;
  categoriaId?: string;
  minCalificacion?: number;
  page?: number;
  limit?: number;
}) {
  const skip = (page - 1) * limit;

  // Construir filtros
  const where: Record<string, unknown> = {
    disponible: true,
    usuario: {
      isActive: true,
    },
  };

  if (minCalificacion) {
    where.calificacionPromedio = { gte: minCalificacion };
  }

  if (categoriaId) {
    where.categorias = {
      some: { categoriaId },
    };
  }

  // Buscar profesionales (usando ciudad como filtro básico, luego se puede agregar PostGIS)
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
            latitud: true,
            longitud: true,
          },
        },
        categorias: {
          include: {
            categoria: {
              select: {
                id: true,
                nombre: true,
                slug: true,
              },
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

  // Calcular distancia aproximada (Haversine)
  const profesionalesConDistancia = profesionales.map((p) => {
    const lat2 = p.usuario.latitud ? Number(p.usuario.latitud) : null;
    const lon2 = p.usuario.longitud ? Number(p.usuario.longitud) : null;

    let distancia = null;
    if (lat2 && lon2) {
      distancia = haversineDistance(lat, lng, lat2, lon2);
    }

    return {
      ...p,
      distancia,
    };
  });

  // Ordenar por distancia si está disponible
  profesionalesConDistancia.sort((a, b) => {
    if (a.distancia === null) return 1;
    if (b.distancia === null) return -1;
    return a.distancia - b.distancia;
  });

  return {
    data: profesionalesConDistancia,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getPerfilProfesionalById(id: string) {
  const perfil = await prisma.perfilProfesional.findUnique({
    where: { id },
    include: {
      usuario: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          avatarUrl: true,
          ciudad: true,
          createdAt: true,
        },
      },
      categorias: {
        include: {
          categoria: {
            select: {
              id: true,
              nombre: true,
              slug: true,
              iconoUrl: true,
            },
          },
        },
      },
      portfolio: {
        orderBy: { orden: "asc" },
      },
      resenasRecibidas: {
        include: {
          autor: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
              avatarUrl: true,
            },
          },
          solicitud: {
            select: {
              titulo: true,
              categoria: {
                select: { nombre: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!perfil) {
    throw new NotFoundError("Perfil profesional no encontrado");
  }

  return perfil;
}

export async function getMiPerfilProfesional(usuarioId: string) {
  const perfil = await prisma.perfilProfesional.findUnique({
    where: { usuarioId },
    include: {
      categorias: {
        include: {
          categoria: {
            select: {
              id: true,
              nombre: true,
              slug: true,
            },
          },
        },
      },
      portfolio: {
        orderBy: { orden: "asc" },
      },
      _count: {
        select: {
          cotizaciones: true,
          resenasRecibidas: true,
        },
      },
    },
  });

  if (!perfil) {
    throw new NotFoundError("No tienes un perfil profesional. Crea uno primero.");
  }

  return perfil;
}

export async function createOrUpdatePerfilProfesional(
  usuarioId: string,
  data: {
    profesion?: string;
    nombreNegocio?: string;
    descripcion?: string;
    experienciaAnios?: number;
    categorias?: string[];
    categoriaPersonalizada?: string;
  }
) {
  // Verificar que el usuario sea profesional
  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId },
    select: { rol: true },
  });

  if (!usuario || usuario.rol !== "professional") {
    throw new ForbiddenError("Solo los profesionales pueden crear este perfil");
  }

  const existing = await prisma.perfilProfesional.findUnique({
    where: { usuarioId },
  });

  if (existing) {
    // Actualizar perfil existente
    const updateData: Record<string, unknown> = {};
    if (data.profesion !== undefined) updateData.profesion = data.profesion;
    if (data.nombreNegocio !== undefined) updateData.nombreNegocio = data.nombreNegocio;
    if (data.descripcion !== undefined) updateData.descripcion = data.descripcion;
    if (data.experienciaAnios !== undefined) updateData.experienciaAnios = data.experienciaAnios;

    const perfil = await prisma.perfilProfesional.update({
      where: { usuarioId },
      data: updateData,
    });

    // Actualizar categorías si se proporcionaron
    if (data.categorias) {
      // Eliminar categorías existentes
      await prisma.categoriaProfesional.deleteMany({
        where: { perfilId: perfil.id },
      });

      let categoriasToAssign = [...data.categorias];

      // Si seleccionó "Otros" con un nombre personalizado, crear la categoría
      const otrosCat = await prisma.categoria.findUnique({ where: { slug: "otros" } });
      if (otrosCat && categoriasToAssign.includes(otrosCat.id) && data.categoriaPersonalizada) {
        const slug = data.categoriaPersonalizada
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        const newCat = await prisma.categoria.create({
          data: {
            nombre: data.categoriaPersonalizada,
            slug,
            isActive: true,
            orden: 98,
          },
        });

        categoriasToAssign = categoriasToAssign.filter((id) => id !== otrosCat.id);
        categoriasToAssign.push(newCat.id);
      }

      // Agregar nuevas categorías
      if (categoriasToAssign.length > 0) {
        await prisma.categoriaProfesional.createMany({
          data: categoriasToAssign.map((categoriaId) => ({
            perfilId: perfil.id,
            categoriaId,
          })),
        });
      }
    }

    return getMiPerfilProfesional(usuarioId);
  }

  // Crear nuevo perfil
  const perfil = await prisma.perfilProfesional.create({
    data: {
      usuarioId,
      profesion: data.profesion,
      nombreNegocio: data.nombreNegocio,
      descripcion: data.descripcion,
      experienciaAnios: data.experienciaAnios,
    },
  });

  // Agregar categorías
  if (data.categorias && data.categorias.length > 0) {
    let categoriasToAssign = [...data.categorias];

    // Si seleccionó "Otros" con un nombre personalizado, crear la categoría
    const otrosCat = await prisma.categoria.findUnique({ where: { slug: "otros" } });
    if (otrosCat && categoriasToAssign.includes(otrosCat.id) && data.categoriaPersonalizada) {
      const slug = data.categoriaPersonalizada
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const newCat = await prisma.categoria.create({
        data: {
          nombre: data.categoriaPersonalizada,
          slug,
          isActive: true,
          orden: 98,
        },
      });

      categoriasToAssign = categoriasToAssign.filter((id) => id !== otrosCat.id);
      categoriasToAssign.push(newCat.id);
    }

    await prisma.categoriaProfesional.createMany({
      data: categoriasToAssign.map((categoriaId) => ({
        perfilId: perfil.id,
        categoriaId,
      })),
    });
  }

  return getMiPerfilProfesional(usuarioId);
}

export async function toggleDisponibilidad(usuarioId: string) {
  const perfil = await prisma.perfilProfesional.findUnique({
    where: { usuarioId },
  });

  if (!perfil) {
    throw new NotFoundError("Perfil profesional no encontrado");
  }

  return prisma.perfilProfesional.update({
    where: { usuarioId },
    data: { disponible: !perfil.disponible },
  });
}

// Función auxiliar Haversine
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
