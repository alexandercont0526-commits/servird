"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";

interface Conversacion {
  solicitudId: string;
  titulo: string;
  estado: string;
  otroUsuario: { id: string; nombre: string; apellido: string; avatarUrl?: string | null } | null;
  ultimoMensaje: string | null;
  totalMensajes: number;
}

export default function ConversacionesPage() {
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/mensajes/conversaciones")
      .then((r) => r.json())
      .then(({ data }) => setConversaciones(data || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mis Conversaciones</h1>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      ) : conversaciones.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No tienes conversaciones aún</p>
        </div>
      ) : (
        <div className="space-y-3">
          {conversaciones.map((conv) => (
            <Link
              key={conv.solicitudId}
              href={`/conversaciones/${conv.solicitudId}`}
              className="block bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                {conv.otroUsuario && (
                  <Avatar
                    nombre={conv.otroUsuario.nombre}
                    apellido={conv.otroUsuario.apellido}
                    src={conv.otroUsuario.avatarUrl}
                    size="md"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900 truncate">
                      {conv.otroUsuario ? `${conv.otroUsuario.nombre} ${conv.otroUsuario.apellido}` : "Conversación"}
                    </h3>
                    <Badge variant={
                      conv.estado === "completado" ? "success" :
                      conv.estado === "cancelado" ? "danger" : "info"
                    }>
                      {conv.estado.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{conv.titulo}</p>
                  {conv.ultimoMensaje && (
                    <p className="text-xs text-gray-400 mt-1 truncate">{conv.ultimoMensaje}</p>
                  )}
                </div>
                <div className="text-right text-xs text-gray-400">
                  <p>{conv.totalMensajes} mensajes</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
