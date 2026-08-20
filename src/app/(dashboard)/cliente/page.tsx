"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ClienteDashboard() {
  const [stats, setStats] = useState({ solicitudes: 0, completadas: 0, activas: 0 });

  useEffect(() => {
    fetch("/api/solicitudes?limit=100")
      .then((r) => r.json())
      .then(({ data }) => {
        const solicitudes = data || [];
        setStats({
          solicitudes: solicitudes.length,
          completadas: solicitudes.filter((s: { estado: string }) => s.estado === "completado").length,
          activas: solicitudes.filter((s: { estado: string }) => !["completado", "cancelado"].includes(s.estado)).length,
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mi Panel</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Total Solicitudes", value: stats.solicitudes, color: "bg-blue-500" },
          { label: "Activas", value: stats.activas, color: "bg-yellow-500" },
          { label: "Completadas", value: stats.completadas, color: "bg-green-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <span className="text-white text-xl font-bold">{stat.value}</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/cliente/solicitudes/nueva" className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📝</span>
            <span className="font-medium text-gray-900">Nueva Solicitud</span>
          </div>
        </Link>
        <Link href="/cliente/solicitudes" className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <span className="font-medium text-gray-900">Mis Solicitudes</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
