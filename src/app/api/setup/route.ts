import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

const SETUP_SECRET = process.env.SETUP_SECRET || "servird-setup-2024";

export async function POST(request: NextRequest) {
  const { secret } = await request.json().catch(() => ({ secret: "" }));

  if (secret !== SETUP_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: string[] = [];

  try {
    // 1. Add profesion column if missing
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "perfiles_profesionales"
      ADD COLUMN IF NOT EXISTS "profesion" VARCHAR(150)
    `);
    results.push("profesion column OK");

    // 2. Add "Otros" category if missing
    const otrosExists = await prisma.$queryRawUnsafe<{ exists: boolean }[]>(
      `SELECT EXISTS(SELECT 1 FROM "categorias" WHERE slug = 'otros') as exists`
    );

    if (!otrosExists[0]?.exists) {
      await prisma.$executeRawUnsafe(`
        INSERT INTO "categorias" ("id", "nombre", "slug", "descripcion", "orden", "created_at", "updated_at")
        VALUES (
          gen_random_uuid()::text,
          'Otros',
          'otros',
          'Servicios que no encajan en otras categorías',
          99,
          NOW(),
          NOW()
        )
      `);
      results.push("Otros category CREATED");
    } else {
      results.push("Otros category already exists");
    }

    // 3. Verify categories count
    const catCount = await prisma.$queryRawUnsafe<{ count: bigint }[]>(
      `SELECT COUNT(*) as count FROM "categorias"`
    );
    results.push(`Total categories: ${catCount[0]?.count}`);

    return Response.json({
      success: true,
      message: "Database synced successfully",
      results,
    });
  } catch (error) {
    console.error("Setup error:", error);
    return Response.json(
      { success: false, error: String(error), results },
      { status: 500 }
    );
  }
}
