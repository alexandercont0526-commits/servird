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
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="text-gray-500 mt-1">Vista general del sistema</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 mb-8">
        {[
          { label: "Usuarios Totales", value: stats?.totalUsuarios || 0, gradient: "from-blue-400 to-cyan-500", icon: "👥" },
          { label: "Profesionales", value: stats?.totalProfesionales || 0, gradient: "from-accent-400 to-accent-500", icon: "🔧" },
          { label: "Solicitudes", value: stats?.totalSolicitudes || 0, gradient: "from-amber-400 to-orange-500", icon: "📋" },
          { label: "Completadas", value: stats?.solicitudesCompletadas || 0, gradient: "from-emerald-400 to-teal-500", icon: "✅" },
          { label: "Cotizaciones", value: stats?.totalCotizaciones || 0, gradient: "from-violet-400 to-purple-500", icon: "💰" },
          { label: "Reseñas", value: stats?.totalResenas || 0, gradient: "from-pink-400 to-rose-500", icon: "⭐" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center shadow-soft`}>
                <span className="text-lg">{stat.icon}</span>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value > 99 ? "99+" : stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { href: "/admin/usuarios", label: "Gestionar Usuarios", description: "Administra todos los usuarios", icon: "👥", gradient: "from-blue-400 to-cyan-500" },
          { href: "/admin/profesionales", label: "Profesionales", description: "Gestiona profesionales verificados", icon: "🔧", gradient: "from-accent-400 to-accent-500" },
          { href: "/admin/solicitudes", label: "Solicitudes", description: "Monitorea todas las solicitudes", icon: "📋", gradient: "from-amber-400 to-orange-500" },
          { href: "/admin/categorias", label: "Categorías", description: "Administra categorías de servicios", icon: "🏷️", gradient: "from-violet-400 to-purple-500" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group bg-white rounded-2xl shadow-card border border-gray-100 p-6 hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center shadow-soft shrink-0`}>
                <span className="text-lg">{item.icon}</span>
              </div>
              <div>
                <span className="font-bold text-gray-900 block">{item.label}</span>
                <span className="text-sm text-gray-400">{item.description}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
