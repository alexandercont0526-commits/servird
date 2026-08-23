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
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mi Panel</h1>
        <p className="text-gray-500 mt-1">Gestiona tus solicitudes de servicio</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[
          { label: "Total Solicitudes", value: stats.solicitudes, gradient: "from-primary-500 to-primary-600", icon: "📋" },
          { label: "Activas", value: stats.activas, gradient: "from-amber-400 to-orange-500", icon: "⚡" },
          { label: "Completadas", value: stats.completadas, gradient: "from-accent-400 to-accent-500", icon: "✅" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center shadow-soft`}>
                <span className="text-lg">{stat.icon}</span>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/cliente/solicitudes/nueva" className="group bg-white rounded-2xl shadow-card border border-gray-100 p-6 hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-soft group-hover:shadow-glow transition-all duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-gray-900 block">Nueva Solicitud</span>
              <span className="text-sm text-gray-400">Publica un servicio que necesitas</span>
            </div>
          </div>
        </Link>
        <Link href="/cliente/solicitudes" className="group bg-white rounded-2xl shadow-card border border-gray-100 p-6 hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-soft">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-gray-900 block">Mis Solicitudes</span>
              <span className="text-sm text-gray-400">Revisa el estado de tus solicitudes</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
