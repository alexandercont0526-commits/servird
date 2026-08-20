"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Avatar from "@/components/ui/Avatar";
import { useSocket } from "@/hooks/useSocket";

interface Mensaje {
  id: string;
  solicitudId: string;
  emisorId: string;
  contenido: string;
  leido: boolean;
  createdAt: string;
  emisor: { id: string; nombre: string; apellido: string; avatarUrl?: string | null };
}

interface ChatWindowProps {
  solicitudId: string;
  currentUserId: string;
  token: string;
}

export default function ChatWindow({ solicitudId, currentUserId, token }: ChatWindowProps) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isConnected, joinSala, leaveSala, enviarMensaje, marcarLeido, onNuevoMensaje } = useSocket(token);

  useEffect(() => {
    fetch(`/api/mensajes?solicitudId=${solicitudId}&limit=100`)
      .then((r) => r.json())
      .then(({ data }) => setMensajes(data || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [solicitudId]);

  useEffect(() => {
    if (!isConnected) return;
    joinSala(solicitudId);
    marcarLeido(solicitudId);

    return () => { leaveSala(solicitudId); };
  }, [isConnected, solicitudId, joinSala, leaveSala, marcarLeido]);

  useEffect(() => {
    const cleanup = onNuevoMensaje((msg: Mensaje) => {
      if (msg.solicitudId === solicitudId && msg.emisorId !== currentUserId) {
        setMensajes((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        marcarLeido(solicitudId);
      }
    });
    return cleanup;
  }, [solicitudId, currentUserId, onNuevoMensaje, marcarLeido]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const handleSend = useCallback(() => {
    if (!nuevoMensaje.trim()) return;
    const contenido = nuevoMensaje.trim();
    enviarMensaje(solicitudId, contenido);
    setMensajes((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        solicitudId,
        emisorId: currentUserId,
        contenido,
        leido: false,
        createdAt: new Date().toISOString(),
        emisor: { id: currentUserId, nombre: "", apellido: "", avatarUrl: null },
      },
    ]);
    setNuevoMensaje("");
  }, [nuevoMensaje, enviarMensaje, solicitudId, currentUserId]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-96">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mensajes.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">
            Inicia la conversación...
          </p>
        )}
        {mensajes.map((msg) => {
          const esMio = msg.emisorId === currentUserId;
          return (
            <div key={msg.id} className={`flex ${esMio ? "justify-end" : "justify-start"}`}>
              <div className={`flex items-end gap-2 max-w-[75%] ${esMio ? "flex-row-reverse" : ""}`}>
                {!esMio && (
                  <Avatar nombre={msg.emisor.nombre} apellido={msg.emisor.apellido} size="sm" />
                )}
                <div>
                  <div className={`px-4 py-2 rounded-2xl text-sm ${
                    esMio
                      ? "bg-blue-600 text-white rounded-br-md"
                      : "bg-gray-100 text-gray-900 rounded-bl-md"
                  }`}>
                    {msg.contenido}
                  </div>
                  <p className={`text-[10px] text-gray-400 mt-1 ${esMio ? "text-right" : ""}`}>
                    {new Date(msg.createdAt).toLocaleTimeString("es-DO", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
          <input
            type="text"
            value={nuevoMensaje}
            onChange={(e) => setNuevoMensaje(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isConnected ? "Escribe un mensaje..." : "Conectando..."}
            disabled={!isConnected}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!nuevoMensaje.trim() || !isConnected}
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
