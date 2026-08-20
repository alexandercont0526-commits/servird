"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface Solicitud {
  id: string;
  titulo: string;
  descripcion: string;
  estado: string;
  ciudad: string;
  createdAt: string;
  categoria: { nombre: string; slug: string };
  _count: { cotizaciones: number };
  profesional?: { nombreNegocio?: string | null; usuario: { nombre: string; apellido: string } } | null;
}

const estadoLabels: Record<string, string> = {
  solicitado: "Solicitado",
  recibiendo_cotizaciones: "Recibiendo cotizaciones",
  profesional_seleccionado: "Profesional seleccionado",
  programado: "Programado",
  en_proceso: "En proceso",
  completado: "Completado",
  cancelado: "Cancelado",
};

const estadoVariant: Record<string, string> = {
  recibiendo_cotizaciones: "info",
  profesional_seleccionado: "success",
  programado: "warning",
  en_proceso: "info",
  completado: "success",
  cancelado: "danger",
};

export default function ClienteSolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    fetchSolicitudes();
  }, [filtro]);

  async function fetchSolicitudes() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ limit: "50" });
      if (filtro) params.set("estado", filtro);
      const res = await fetch(`/api/solicitudes?${params}`);
      const { data } = await res.json();
      setSolicitudes(data || []);
    } catch {
      console.error("Error al cargar solicitudes");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mis Solicitudes</h1>
        <Link href="/cliente/solicitudes/nueva">
          <Button>Nueva Solicitud</Button>
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        {["", "recibiendo_cotizaciones", "profesional_seleccionado", "en_proceso", "completado", "cancelado"].map((est) => (
          <button
            key={est}
            onClick={() => setFiltro(est)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filtro === est ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {est ? estadoLabels[est] : "Todas"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      ) : solicitudes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">No tienes solicitudes aún</p>
          <Link href="/cliente/solicitudes/nueva">
            <Button>Crear mi primera solicitud</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {solicitudes.map((sol) => (
            <Link
              key={sol.id}
              href={`/cliente/solicitudes/${sol.id}`}
              className="block bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{sol.titulo}</h3>
                    <Badge variant={(estadoVariant[sol.estado] as "info" | "success" | "warning" | "danger") || "default"}>
                      {estadoLabels[sol.estado]}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-1 mb-2">{sol.descripcion}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>{sol.categoria.nombre}</span>
                    <span>{sol.ciudad}</span>
                    <span>{new Date(sol.createdAt).toLocaleDateString("es-DO")}</span>
                    <span>{sol._count.cotizaciones} cotizaciones</span>
                  </div>
                </div>
                {sol.profesional && (
                  <div className="text-right text-sm text-gray-600">
                    <p className="font-medium">{sol.profesional.usuario.nombre} {sol.profesional.usuario.apellido}</p>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
