"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProfesionalDashboard() {
  const [stats, setStats] = useState({ solicitudes: 0, cotizaciones: 0, trabajos: 0, completados: 0 });

  useEffect(() => {
    Promise.all([
      fetch("/api/solicitudes?limit=100").then((r) => r.json()),
      fetch("/api/cotizaciones?limit=100").then((r) => r.json()),
    ]).then(([solsRes, cotsRes]) => {
      const solicitudes = solsRes.data || [];
      const cotizaciones = cotsRes.data || [];
      setStats({
        solicitudes: solicitudes.length,
        cotizaciones: cotizaciones.length,
        trabajos: solicitudes.filter((s: { estado: string }) => !["completado", "cancelado"].includes(s.estado)).length,
        completados: solicitudes.filter((s: { estado: string }) => s.estado === "completado").length,
      });
    }).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Panel Profesional</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Solicitudes", value: stats.solicitudes, color: "bg-blue-500" },
          { label: "Mis Cotizaciones", value: stats.cotizaciones, color: "bg-purple-500" },
          { label: "Trabajos Activos", value: stats.trabajos, color: "bg-yellow-500" },
          { label: "Completados", value: stats.completados, color: "bg-green-500" },
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { href: "/profesional/solicitudes", label: "Solicitudes Disponibles", icon: "🔍" },
          { href: "/profesional/cotizaciones", label: "Mis Cotizaciones", icon: "💰" },
          { href: "/profesional/mis-trabajos", label: "Mis Trabajos", icon: "🔨" },
          { href: "/profesional/calificaciones", label: "Mis Calificaciones", icon: "⭐" },
          { href: "/profesional/perfil", label: "Mi Perfil", icon: "👤" },
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
