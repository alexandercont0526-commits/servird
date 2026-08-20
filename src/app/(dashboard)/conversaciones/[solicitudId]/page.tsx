"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import ChatWindow from "@/components/chat/ChatWindow";

interface SolicitudInfo {
  id: string;
  titulo: string;
  estado: string;
}

export default function ChatPage({ params }: { params: Promise<{ solicitudId: string }> }) {
  const { solicitudId } = use(params);
  const [solicitud, setSolicitud] = useState<SolicitudInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/solicitudes/${solicitudId}`).then((r) => r.json()),
      fetch("/api/usuarios/me").then((r) => r.json()),
    ]).then(([solRes, userRes]) => {
      setSolicitud(solRes.data);
      setCurrentUserId(userRes.data?.id || "");
    }).catch(() => {})
      .finally(() => setIsLoading(false));

    const cookieVal = document.cookie.split("; ").find((c) => c.startsWith("access_token="));
    if (cookieVal) {
      setToken(cookieVal.split("=")[1]);
    }
  }, [solicitudId]);

  if (isLoading) {
    return <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>;
  }

  if (!token || !currentUserId) {
    return <div className="text-center py-12"><p className="text-gray-500">Cargando...</p></div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-4">
        <Link href="/conversaciones" className="text-sm text-blue-600 hover:text-blue-700">&larr; Conversaciones</Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {solicitud && (
          <div className="border-b border-gray-200 px-6 py-3">
            <h2 className="font-semibold text-gray-900">{solicitud.titulo}</h2>
            <p className="text-xs text-gray-400">{solicitud.estado.replace(/_/g, " ")}</p>
          </div>
        )}
        <ChatWindow solicitudId={solicitudId} currentUserId={currentUserId} token={token} />
      </div>
    </div>
  );
}
