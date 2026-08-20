import { createServer } from "http";
import next from "next";
import { jwtVerify, type JWTVerifyResult } from "jose";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "servird-jwt-secret-change-in-production-2024"
);

interface TokenPayload {
  userId: string;
  email: string;
  rol: string;
}

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const { Server: SocketIOServer } = await import("socket.io");

  const { PrismaClient } = await import("./src/generated/prisma/client");
  const { PrismaPg } = await import("@prisma/adapter-pg");

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  const httpServer = createServer((req, res) => handle(req, res));

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket, nextMiddleware) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return nextMiddleware(new Error("Token no proporcionado"));
      let result: JWTVerifyResult;
      try {
        result = await jwtVerify(token, JWT_SECRET);
      } catch {
        return nextMiddleware(new Error("Token inválido"));
      }
      socket.data.user = result.payload as unknown as TokenPayload;
      nextMiddleware();
    } catch {
      nextMiddleware(new Error("Error de autenticación"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.data.user as TokenPayload;
    console.log(`[Socket] ${user.email} conectado`);

    socket.join(`user:${user.userId}`);

    socket.on("join_sala", async (solicitudId: string) => {
      const solicitud = await prisma.solicitudServicio.findUnique({
        where: { id: solicitudId },
        select: { id: true, clienteId: true, profesionalId: true },
      });

      if (!solicitud) return;

      let puedeEntrar = false;
      if (solicitud.clienteId === user.userId) puedeEntrar = true;
      if (solicitud.profesionalId) {
        const perfil = await prisma.perfilProfesional.findUnique({
          where: { id: solicitud.profesionalId },
          select: { usuarioId: true },
        });
        if (perfil?.usuarioId === user.userId) puedeEntrar = true;
      }
      if (user.rol === "admin") puedeEntrar = true;

      if (puedeEntrar) socket.join(`sala:${solicitudId}`);
    });

    socket.on("leave_sala", (solicitudId: string) => {
      socket.leave(`sala:${solicitudId}`);
    });

    socket.on("enviar_mensaje", async (data: { solicitudId: string; contenido: string }) => {
      if (!data.contenido?.trim()) return;

      const mensaje = await prisma.mensaje.create({
        data: {
          solicitudId: data.solicitudId,
          emisorId: user.userId,
          contenido: data.contenido.trim(),
        },
        include: {
          emisor: {
            select: { id: true, nombre: true, apellido: true, avatarUrl: true },
          },
        },
      });

      io.to(`sala:${data.solicitudId}`).emit("nuevo_mensaje", {
        id: mensaje.id,
        solicitudId: mensaje.solicitudId,
        emisorId: mensaje.emisorId,
        contenido: mensaje.contenido,
        leido: mensaje.leido,
        createdAt: mensaje.createdAt.toISOString(),
        emisor: mensaje.emisor,
      });
    });

    socket.on("marcar_leido", async (solicitudId: string) => {
      await prisma.mensaje.updateMany({
        where: {
          solicitudId,
          emisorId: { not: user.userId },
          leido: false,
        },
        data: { leido: true },
      });
      io.to(`sala:${solicitudId}`).emit("mensajes_leidos", {
        solicitudId,
        porUsuario: user.userId,
      });
    });

    socket.on("disconnect", () => {
      console.log(`[Socket] ${user.email} desconectado`);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> ServiRD listo en http://${hostname}:${port}`);
  });
});
