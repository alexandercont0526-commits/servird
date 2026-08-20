-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('client', 'professional', 'admin');

-- CreateEnum
CREATE TYPE "EstadoSolicitud" AS ENUM ('solicitado', 'recibiendo_cotizaciones', 'profesional_seleccionado', 'programado', 'en_proceso', 'completado', 'cancelado');

-- CreateEnum
CREATE TYPE "EstadoCotizacion" AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');

-- CreateEnum
CREATE TYPE "TipoArchivo" AS ENUM ('image', 'video');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "telefono" VARCHAR(20),
    "rol" "Rol" NOT NULL DEFAULT 'client',
    "avatar_url" TEXT,
    "latitud" DECIMAL(10,8),
    "longitud" DECIMAL(11,8),
    "ciudad" VARCHAR(100),
    "direccion" VARCHAR(300),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfiles_profesionales" (
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "nombre_negocio" VARCHAR(150),
    "descripcion" TEXT,
    "experiencia_anios" INTEGER,
    "calificacion_promedio" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "total_resenas" INTEGER NOT NULL DEFAULT 0,
    "trabajos_completados" INTEGER NOT NULL DEFAULT 0,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "verificado" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "perfiles_profesionales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "icono_url" TEXT,
    "descripcion" TEXT,
    "categoria_padre_id" UUID,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias_profesionales" (
    "perfil_id" UUID NOT NULL,
    "categoria_id" UUID NOT NULL,

    CONSTRAINT "categorias_profesionales_pkey" PRIMARY KEY ("perfil_id","categoria_id")
);

-- CreateTable
CREATE TABLE "solicitudes_servicio" (
    "id" UUID NOT NULL,
    "cliente_id" UUID NOT NULL,
    "categoria_id" UUID NOT NULL,
    "titulo" VARCHAR(200) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "latitud" DECIMAL(10,8) NOT NULL,
    "longitud" DECIMAL(11,8) NOT NULL,
    "direccion" VARCHAR(300),
    "ciudad" VARCHAR(100) NOT NULL,
    "fecha_preferida" DATE,
    "hora_inicio" TIME,
    "hora_fin" TIME,
    "presupuesto_min" DECIMAL(10,2),
    "presupuesto_max" DECIMAL(10,2),
    "estado" "EstadoSolicitud" NOT NULL DEFAULT 'solicitado',
    "profesional_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "solicitudes_servicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitud_archivos" (
    "id" UUID NOT NULL,
    "solicitud_id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "tipo" "TipoArchivo" NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "solicitud_archivos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cotizaciones" (
    "id" UUID NOT NULL,
    "solicitud_id" UUID NOT NULL,
    "profesional_id" UUID NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,
    "duracion_estimada" VARCHAR(50),
    "fecha_inicio_estimada" DATE,
    "comentarios" TEXT,
    "estado" "EstadoCotizacion" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "cotizaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historial_estados" (
    "id" UUID NOT NULL,
    "solicitud_id" UUID NOT NULL,
    "estado_anterior" "EstadoSolicitud",
    "estado_nuevo" "EstadoSolicitud" NOT NULL,
    "cambiado_por" UUID,
    "nota" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historial_estados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resenas" (
    "id" UUID NOT NULL,
    "solicitud_id" UUID NOT NULL,
    "autor_id" UUID NOT NULL,
    "profesional_id" UUID NOT NULL,
    "calificacion" SMALLINT NOT NULL,
    "comentario" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resenas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mensajes" (
    "id" UUID NOT NULL,
    "solicitud_id" UUID NOT NULL,
    "emisor_id" UUID NOT NULL,
    "contenido" TEXT NOT NULL,
    "leido" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mensajes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificaciones" (
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "tipo" VARCHAR(50) NOT NULL,
    "titulo" VARCHAR(200) NOT NULL,
    "mensaje" TEXT,
    "datos" JSONB,
    "leido" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_profesional" (
    "id" UUID NOT NULL,
    "perfil_id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "caption" VARCHAR(200),
    "orden" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "portfolio_profesional_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_rol_idx" ON "usuarios"("rol");

-- CreateIndex
CREATE INDEX "usuarios_ciudad_idx" ON "usuarios"("ciudad");

-- CreateIndex
CREATE UNIQUE INDEX "perfiles_profesionales_usuario_id_key" ON "perfiles_profesionales"("usuario_id");

-- CreateIndex
CREATE INDEX "perfiles_profesionales_usuario_id_idx" ON "perfiles_profesionales"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_nombre_key" ON "categorias"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_slug_key" ON "categorias"("slug");

-- CreateIndex
CREATE INDEX "categorias_slug_idx" ON "categorias"("slug");

-- CreateIndex
CREATE INDEX "categorias_is_active_idx" ON "categorias"("is_active");

-- CreateIndex
CREATE INDEX "solicitudes_servicio_cliente_id_idx" ON "solicitudes_servicio"("cliente_id");

-- CreateIndex
CREATE INDEX "solicitudes_servicio_categoria_id_idx" ON "solicitudes_servicio"("categoria_id");

-- CreateIndex
CREATE INDEX "solicitudes_servicio_estado_idx" ON "solicitudes_servicio"("estado");

-- CreateIndex
CREATE INDEX "solicitudes_servicio_ciudad_idx" ON "solicitudes_servicio"("ciudad");

-- CreateIndex
CREATE INDEX "solicitudes_servicio_created_at_idx" ON "solicitudes_servicio"("created_at");

-- CreateIndex
CREATE INDEX "solicitud_archivos_solicitud_id_idx" ON "solicitud_archivos"("solicitud_id");

-- CreateIndex
CREATE INDEX "cotizaciones_solicitud_id_idx" ON "cotizaciones"("solicitud_id");

-- CreateIndex
CREATE INDEX "cotizaciones_profesional_id_idx" ON "cotizaciones"("profesional_id");

-- CreateIndex
CREATE INDEX "cotizaciones_estado_idx" ON "cotizaciones"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "cotizaciones_solicitud_id_profesional_id_key" ON "cotizaciones"("solicitud_id", "profesional_id");

-- CreateIndex
CREATE INDEX "historial_estados_solicitud_id_idx" ON "historial_estados"("solicitud_id");

-- CreateIndex
CREATE INDEX "historial_estados_created_at_idx" ON "historial_estados"("created_at");

-- CreateIndex
CREATE INDEX "resenas_profesional_id_idx" ON "resenas"("profesional_id");

-- CreateIndex
CREATE INDEX "resenas_solicitud_id_idx" ON "resenas"("solicitud_id");

-- CreateIndex
CREATE UNIQUE INDEX "resenas_solicitud_id_autor_id_key" ON "resenas"("solicitud_id", "autor_id");

-- CreateIndex
CREATE INDEX "mensajes_solicitud_id_created_at_idx" ON "mensajes"("solicitud_id", "created_at");

-- CreateIndex
CREATE INDEX "mensajes_emisor_id_idx" ON "mensajes"("emisor_id");

-- CreateIndex
CREATE INDEX "notificaciones_usuario_id_leido_created_at_idx" ON "notificaciones"("usuario_id", "leido", "created_at");

-- CreateIndex
CREATE INDEX "portfolio_profesional_perfil_id_idx" ON "portfolio_profesional"("perfil_id");

-- AddForeignKey
ALTER TABLE "perfiles_profesionales" ADD CONSTRAINT "perfiles_profesionales_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categorias" ADD CONSTRAINT "categorias_categoria_padre_id_fkey" FOREIGN KEY ("categoria_padre_id") REFERENCES "categorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categorias_profesionales" ADD CONSTRAINT "categorias_profesionales_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "perfiles_profesionales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categorias_profesionales" ADD CONSTRAINT "categorias_profesionales_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes_servicio" ADD CONSTRAINT "solicitudes_servicio_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes_servicio" ADD CONSTRAINT "solicitudes_servicio_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes_servicio" ADD CONSTRAINT "solicitudes_servicio_profesional_id_fkey" FOREIGN KEY ("profesional_id") REFERENCES "perfiles_profesionales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitud_archivos" ADD CONSTRAINT "solicitud_archivos_solicitud_id_fkey" FOREIGN KEY ("solicitud_id") REFERENCES "solicitudes_servicio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizaciones" ADD CONSTRAINT "cotizaciones_solicitud_id_fkey" FOREIGN KEY ("solicitud_id") REFERENCES "solicitudes_servicio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizaciones" ADD CONSTRAINT "cotizaciones_profesional_id_fkey" FOREIGN KEY ("profesional_id") REFERENCES "perfiles_profesionales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_estados" ADD CONSTRAINT "historial_estados_solicitud_id_fkey" FOREIGN KEY ("solicitud_id") REFERENCES "solicitudes_servicio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_estados" ADD CONSTRAINT "historial_estados_cambiado_por_fkey" FOREIGN KEY ("cambiado_por") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resenas" ADD CONSTRAINT "resenas_solicitud_id_fkey" FOREIGN KEY ("solicitud_id") REFERENCES "solicitudes_servicio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resenas" ADD CONSTRAINT "resenas_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resenas" ADD CONSTRAINT "resenas_profesional_id_fkey" FOREIGN KEY ("profesional_id") REFERENCES "perfiles_profesionales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensajes" ADD CONSTRAINT "mensajes_solicitud_id_fkey" FOREIGN KEY ("solicitud_id") REFERENCES "solicitudes_servicio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensajes" ADD CONSTRAINT "mensajes_emisor_id_fkey" FOREIGN KEY ("emisor_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_profesional" ADD CONSTRAINT "portfolio_profesional_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "perfiles_profesionales"("id") ON DELETE CASCADE ON UPDATE CASCADE;
