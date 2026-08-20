"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";

interface Cotizacion {
  id: string;
  precio: number;
  duracionEstimada?: string | null;
  estado: string;
  createdAt: string;
  solicitud: {
    id: string;
    titulo: string;
    estado: string;
    ciudad: string;
    categoria: { nombre: string };
    cliente: { nombre: string; apellido: string; avatarUrl?: string | null };
  };
}

const estadoLabels: Record<string, string> = {
  pending: "Pendiente",
  accepted: "Aceptada",
  rejected: "Rechazada",
  withdrawn: "Retirada",
};

const estadoVariant: Record<string, "info" | "success" | "danger" | "warning"> = {
  pending: "info",
  accepted: "success",
  rejected: "danger",
  withdrawn: "warning",
};

export default function ProfesionalCotizacionesPage() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cotizaciones?limit=50")
      .then((r) => r.json())
      .then(({ data }) => setCotizaciones(data || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mis Cotizaciones</h1>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      ) : cotizaciones.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500">Aún no has enviado cotizaciones</p>
          <Link href="/profesional/solicitudes" className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block">
            Ver solicitudes disponibles
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {cotizaciones.map((cot) => (
            <Link
              key={cot.id}
              href={`/profesional/solicitudes/${cot.solicitud.id}`}
              className="block bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{cot.solicitud.titulo}</h3>
                    <Badge variant={estadoVariant[cot.estado] || "default"}>
                      {estadoLabels[cot.estado]}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>{cot.solicitud.categoria.nombre}</span>
                    <span>{cot.solicitud.ciudad}</span>
                    <span>{new Date(cot.createdAt).toLocaleDateString("es-DO")}</span>
                  </div>
                </div>
                <p className="text-lg font-bold text-blue-600">RD${Number(cot.precio).toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
