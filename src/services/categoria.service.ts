import prisma from "@/lib/prisma";
import { NotFoundError, ConflictError } from "@/lib/errors";
import { CreateCategoriaInput } from "@/lib/validations";

export async function getCategorias() {
  return prisma.categoria.findMany({
    where: { isActive: true },
    orderBy: { orden: "asc" },
    include: {
      _count: {
        select: { solicitudes: true, profCategorias: true },
      },
    },
  });
}

export async function getCategoriaBySlug(slug: string) {
  const categoria = await prisma.categoria.findUnique({
    where: { slug },
    include: {
      subcategorias: {
        where: { isActive: true },
        orderBy: { orden: "asc" },
      },
      _count: {
        select: { solicitudes: true, profCategorias: true },
      },
    },
  });

  if (!categoria) {
    throw new NotFoundError("Categoría no encontrada");
  }

  return categoria;
}

export async function getCategoriaById(id: string) {
  const categoria = await prisma.categoria.findUnique({
    where: { id },
    include: {
      subcategorias: {
        where: { isActive: true },
        orderBy: { orden: "asc" },
      },
    },
  });

  if (!categoria) {
    throw new NotFoundError("Categoría no encontrada");
  }

  return categoria;
}

export async function createCategoria(data: CreateCategoriaInput) {
  // Verificar que el slug sea único
  const existing = await prisma.categoria.findUnique({
    where: { slug: data.slug },
  });

  if (existing) {
    throw new ConflictError("Ya existe una categoría con ese slug");
  }

  // Si tiene padre, verificar que exista
  if (data.categoriaPadreId) {
    const padre = await prisma.categoria.findUnique({
      where: { id: data.categoriaPadreId },
    });

    if (!padre) {
      throw new NotFoundError("Categoría padre no encontrada");
    }
  }

  return prisma.categoria.create({
    data,
  });
}

export async function updateCategoria(
  id: string,
  data: Partial<CreateCategoriaInput>
) {
  const existing = await prisma.categoria.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new NotFoundError("Categoría no encontrada");
  }

  // Si se actualiza el slug, verificar que sea único
  if (data.slug && data.slug !== existing.slug) {
    const slugExists = await prisma.categoria.findUnique({
      where: { slug: data.slug },
    });

    if (slugExists) {
      throw new ConflictError("Ya existe una categoría con ese slug");
    }
  }

  return prisma.categoria.update({
    where: { id },
    data,
  });
}

export async function deleteCategoria(id: string) {
  const existing = await prisma.categoria.findUnique({
    where: { id },
    include: {
      _count: {
        select: { solicitudes: true, profCategorias: true, subcategorias: true },
      },
    },
  });

  if (!existing) {
    throw new NotFoundError("Categoría no encontrada");
  }

  // Soft delete
  return prisma.categoria.update({
    where: { id },
    data: { isActive: false },
  });
}

export async function getAllCategoriasAdmin() {
  return prisma.categoria.findMany({
    orderBy: { orden: "asc" },
    include: {
      _count: {
        select: { solicitudes: true, profCategorias: true, subcategorias: true },
      },
    },
  });
}
