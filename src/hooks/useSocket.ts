"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket(token: string | null) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token || socketRef.current?.connected) return;

    const s = io(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000", {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socketRef.current = s;

    s.on("connect", () => setIsConnected(true));
    s.on("disconnect", () => setIsConnected(false));

    if (s.connected) setIsConnected(true);

    return () => {
      s.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [token]);

  const joinSala = useCallback((solicitudId: string) => {
    socketRef.current?.emit("join_sala", solicitudId);
  }, []);

  const leaveSala = useCallback((solicitudId: string) => {
    socketRef.current?.emit("leave_sala", solicitudId);
  }, []);

  const enviarMensaje = useCallback((solicitudId: string, contenido: string) => {
    socketRef.current?.emit("enviar_mensaje", { solicitudId, contenido });
  }, []);

  const marcarLeido = useCallback((solicitudId: string) => {
    socketRef.current?.emit("marcar_leido", solicitudId);
  }, []);

  const onNuevoMensaje = useCallback((callback: (msg: { id: string; solicitudId: string; emisorId: string; contenido: string; leido: boolean; createdAt: string; emisor: { id: string; nombre: string; apellido: string; avatarUrl?: string | null } }) => void) => {
    socketRef.current?.on("nuevo_mensaje", callback);
    return () => { socketRef.current?.off("nuevo_mensaje", callback); };
  }, []);

  return { socket: socketRef.current, isConnected, joinSala, leaveSala, enviarMensaje, marcarLeido, onNuevoMensaje };
}
