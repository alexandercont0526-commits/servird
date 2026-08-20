"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";

interface Solicitud {
  id: string;
  titulo: string;
  estado: string;
  ciudad: string;
  createdAt: string;
  categoria: { nombre: string };
  cliente: { nombre: string; apellido: string };
  _count: { cotizaciones: number };
}

export default function AdminSolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    fetchSolicitudes();
  }, [filtro]);

  async function fetchSolicitudes() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ limit: "100" });
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

  async function handleCancelar(id: string) {
    if (!confirm("¿Cancelar esta solicitud?")) return;
    await fetch(`/api/solicitudes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: "cancelado" }),
    });
    fetchSolicitudes();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Gestionar Solicitudes</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["", "recibiendo_cotizaciones", "profesional_seleccionado", "en_proceso", "completado", "cancelado"].map((est) => (
          <button
            key={est}
            onClick={() => setFiltro(est)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filtro === est ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {est ? est.replace(/_/g, " ") : "Todas"}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
          </div>
        ) : solicitudes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay solicitudes</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Solicitud</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cotizaciones</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {solicitudes.map((sol) => (
                <tr key={sol.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{sol.titulo}</div>
                      <div className="text-sm text-gray-500">{sol.categoria.nombre} · {sol.ciudad}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{sol.cliente.nombre} {sol.cliente.apellido}</td>
                  <td className="px-6 py-4">
                    <Badge variant={
                      sol.estado === "completado" ? "success" :
                      sol.estado === "cancelado" ? "danger" :
                      sol.estado === "en_proceso" ? "info" : "warning"
                    }>
                      {sol.estado.replace(/_/g, " ")}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{sol._count.cotizaciones}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(sol.createdAt).toLocaleDateString("es-DO")}</td>
                  <td className="px-6 py-4 text-right">
                    {!["cancelado", "completado"].includes(sol.estado) && (
                      <button
                        onClick={() => handleCancelar(sol.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
