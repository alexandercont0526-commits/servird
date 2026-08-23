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
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Panel Profesional</h1>
        <p className="text-gray-500 mt-1">Administra tus trabajos y cotizaciones</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-8">
        {[
          { label: "Solicitudes", value: stats.solicitudes, gradient: "from-blue-400 to-cyan-500", icon: "🔍" },
          { label: "Cotizaciones", value: stats.cotizaciones, gradient: "from-violet-400 to-purple-500", icon: "💰" },
          { label: "Activos", value: stats.trabajos, gradient: "from-amber-400 to-orange-500", icon: "⚡" },
          { label: "Completados", value: stats.completados, gradient: "from-accent-400 to-accent-500", icon: "✅" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5">
            <div className="text-2xl mb-3">{stat.icon}</div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { href: "/profesional/solicitudes", label: "Solicitudes Disponibles", description: "Encuentra nuevos trabajos", icon: "🔍", gradient: "from-blue-400 to-cyan-500" },
          { href: "/profesional/cotizaciones", label: "Mis Cotizaciones", description: "Revisa tus propuestas enviadas", icon: "💰", gradient: "from-violet-400 to-purple-500" },
          { href: "/profesional/mis-trabajos", label: "Mis Trabajos", description: "Gestiona trabajos activos", icon: "🔨", gradient: "from-amber-400 to-orange-500" },
          { href: "/profesional/calificaciones", label: "Calificaciones", description: "Revisa tu reputación", icon: "⭐", gradient: "from-yellow-400 to-amber-500" },
          { href: "/profesional/perfil", label: "Mi Perfil", description: "Actualiza tu información", icon: "👤", gradient: "from-primary-400 to-primary-500" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group bg-white rounded-2xl shadow-card border border-gray-100 p-5 hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex items-start gap-4">
              <div className={`w-11 h-11 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center shadow-soft shrink-0`}>
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
