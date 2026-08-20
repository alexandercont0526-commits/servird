"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Stats {
  totalUsuarios: number;
  totalProfesionales: number;
  totalSolicitudes: number;
  solicitudesCompletadas: number;
  totalCotizaciones: number;
  totalResenas: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/estadisticas")
      .then((r) => r.json())
      .then(({ data }) => setStats(data))
      .catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Panel de Administración</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Usuarios Totales", value: stats?.totalUsuarios || 0, color: "bg-blue-500" },
          { label: "Profesionales", value: stats?.totalProfesionales || 0, color: "bg-green-500" },
          { label: "Solicitudes", value: stats?.totalSolicitudes || 0, color: "bg-yellow-500" },
          { label: "Completadas", value: stats?.solicitudesCompletadas || 0, color: "bg-emerald-500" },
          { label: "Cotizaciones", value: stats?.totalCotizaciones || 0, color: "bg-purple-500" },
          { label: "Reseñas", value: stats?.totalResenas || 0, color: "bg-pink-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <span className="text-white text-xl font-bold">{stat.value > 99 ? "99+" : stat.value}</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { href: "/admin/usuarios", label: "Gestionar Usuarios", icon: "👥" },
          { href: "/admin/profesionales", label: "Profesionales", icon: "🔧" },
          { href: "/admin/solicitudes", label: "Solicitudes", icon: "📋" },
          { href: "/admin/categorias", label: "Categorías", icon: "🏷️" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{item.icon}</span>
              <span className="font-medium text-gray-900">{item.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
