import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const categories = [
  {
    nombre: "Electricidad",
    slug: "electricidad",
    descripcion: "Servicios de instalación, reparación y mantenimiento eléctrico",
    orden: 1,
  },
  {
    nombre: "Plomería",
    slug: "plomeria",
    descripcion: "Servicios de instalación y reparación de tuberías y grifería",
    orden: 2,
  },
  {
    nombre: "Pintura",
    slug: "pintura",
    descripcion: "Servicios de pintura interior y exterior de edificios y casas",
    orden: 3,
  },
  {
    nombre: "Carpintería",
    slug: "carpinteria",
    descripcion: "Fabricación y reparación de muebles y estructuras de madera",
    orden: 4,
  },
  {
    nombre: "Albañilería",
    slug: "albanileria",
    descripcion: "Construcción, remodelación y reparación de estructuras",
    orden: 5,
  },
  {
    nombre: "Cerrajería",
    slug: "cerrajeria",
    descripcion: "Instalación y reparación de cerraduras y sistemas de seguridad",
    orden: 6,
  },
  {
    nombre: "Limpieza",
    slug: "limpieza",
    descripcion: "Servicios de limpieza profesional para hogar y oficinas",
    orden: 7,
  },
  {
    nombre: "Mudanzas",
    slug: "mudanzas",
    descripcion: "Servicios de mudanza y transporte de muebles",
    orden: 8,
  },
  {
    nombre: "Aire Acondicionado",
    slug: "aire-acondicionado",
    descripcion: "Instalación, reparación y mantenimiento de sistemas de aire acondicionado",
    orden: 9,
  },
  {
    nombre: "Reparación de Computadoras",
    slug: "reparacion-computadoras",
    descripcion: "Servicios de reparación y mantenimiento de computadoras",
    orden: 10,
  },
  {
    nombre: "Instalación de Cámaras",
    slug: "instalacion-camaras",
    descripcion: "Instalación de sistemas de seguridad y cámaras de vigilancia",
    orden: 11,
  },
  {
    nombre: "Redes",
    slug: "redes",
    descripcion: "Instalación y configuración de redes e internet",
    orden: 12,
  },
  {
    nombre: "Mantenimiento General",
    slug: "mantenimiento-general",
    descripcion: "Servicios de mantenimiento y reparación general",
    orden: 13,
  },
  {
    nombre: "Transporte",
    slug: "transporte",
    descripcion: "Servicios de transporte de personas y carga",
    orden: 14,
  },
];

async function main() {
  console.log("🌱 Sembrando categorías...");

  for (const category of categories) {
    await prisma.categoria.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
    console.log(`  ✅ ${category.nombre}`);
  }

  console.log("✨ ¡Categorías sembradas exitosamente!");
}

main()
  .catch((e) => {
    console.error("Error al sembrar categorías:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
