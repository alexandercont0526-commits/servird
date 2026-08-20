"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface Solicitud {
  id: string;
  titulo: string;
  estado: string;
  ciudad: string;
  createdAt: string;
  categoria: { nombre: string };
  cliente: { nombre: string; apellido: string };
}

const estadoLabels: Record<string, string> = {
  profesional_seleccionado: "Seleccionado",
  programado: "Programado",
  en_proceso: "En proceso",
  completado: "Completado",
};

const estadoVariant: Record<string, "info" | "success" | "warning" | "danger"> = {
  profesional_seleccionado: "info",
  programado: "warning",
  en_proceso: "info",
  completado: "success",
};

export default function ProfesionalMisTrabajosPage() {
  const [trabajos, setTrabajos] = useState<Solicitud[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    fetchTrabajos();
  }, [filtro]);

  async function fetchTrabajos() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ limit: "50" });
      if (filtro) params.set("estado", filtro);
      const res = await fetch(`/api/solicitudes?${params}`);
      const { data } = await res.json();
      setTrabajos(data || []);
    } catch {
      console.error("Error");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdateEstado(id: string, estado: string) {
    try {
      await fetch(`/api/solicitudes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado }),
      });
      fetchTrabajos();
    } catch {
      console.error("Error");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mis Trabajos</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["", "profesional_seleccionado", "programado", "en_proceso", "completado"].map((est) => (
          <button
            key={est}
            onClick={() => setFiltro(est)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filtro === est ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {est ? estadoLabels[est] : "Todos"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      ) : trabajos.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No tienes trabajos asignados</p>
        </div>
      ) : (
        <div className="space-y-4">
          {trabajos.map((trabajo) => (
            <div key={trabajo.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{trabajo.titulo}</h3>
                    <Badge variant={estadoVariant[trabajo.estado] || "default"}>
                      {estadoLabels[trabajo.estado] || trabajo.estado}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                    <span>{trabajo.categoria.nombre}</span>
                    <span>{trabajo.ciudad}</span>
                    <span>{trabajo.cliente.nombre} {trabajo.cliente.apellido}</span>
                  </div>

                  <div className="flex gap-2">
                    {trabajo.estado === "profesional_seleccionado" && (
                      <>
                        <Button size="sm" onClick={() => handleUpdateEstado(trabajo.id, "programado")}>
                          Programar
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleUpdateEstado(trabajo.id, "cancelado")}>
                          Rechazar
                        </Button>
                      </>
                    )}
                    {trabajo.estado === "programado" && (
                      <Button size="sm" onClick={() => handleUpdateEstado(trabajo.id, "en_proceso")}>
                        Iniciar Trabajo
                      </Button>
                    )}
                    {trabajo.estado === "en_proceso" && (
                      <Button size="sm" onClick={() => handleUpdateEstado(trabajo.id, "completado")}>
                        Marcar Completado
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
