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
  presupuestoMin?: number | null;
  presupuestoMax?: number | null;
  categoria: { nombre: string; slug: string };
  cliente: { nombre: string; apellido: string; avatarUrl?: string | null; ciudad?: string | null };
  _count: { cotizaciones: number };
}

export default function ProfesionalSolicitudesPage() {
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
      console.error("Error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Solicitudes Disponibles</h1>

      <div className="flex gap-2 mb-6">
        {["", "recibiendo_cotizaciones"].map((est) => (
          <button
            key={est}
            onClick={() => setFiltro(est)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filtro === est ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {est === "" ? "Todas" : "Abiertas"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      ) : solicitudes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No hay solicitudes disponibles</p>
        </div>
      ) : (
        <div className="space-y-4">
          {solicitudes.map((sol) => (
            <Link
              key={sol.id}
              href={`/profesional/solicitudes/${sol.id}`}
              className="block bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{sol.titulo}</h3>
                    <Badge variant={
                      sol.estado === "recibiendo_cotizaciones" ? "info" : "default"
                    }>
                      {sol.estado.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-2">{sol.descripcion}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>{sol.categoria.nombre}</span>
                    <span>{sol.ciudad}</span>
                    <span>{sol._count.cotizaciones} cotizaciones</span>
                    <span>{new Date(sol.createdAt).toLocaleDateString("es-DO")}</span>
                  </div>
                </div>
                <div className="text-right text-sm">
                  {sol.presupuestoMin && sol.presupuestoMax && (
                    <p className="text-gray-600 font-medium">
                      RD${Number(sol.presupuestoMin).toLocaleString()} - RD${Number(sol.presupuestoMax).toLocaleString()}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">{sol.cliente.nombre} {sol.cliente.apellido}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
