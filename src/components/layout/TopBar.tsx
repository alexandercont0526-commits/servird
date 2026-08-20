"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Avatar from "@/components/ui/Avatar";

interface TopBarProps {
  user: {
    nombre: string;
    apellido: string;
    avatarUrl?: string | null;
    rol: string;
  };
  onMenuClick: () => void;
}

export default function TopBar({ user, onMenuClick }: TopBarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [noLeidas, setNoLeidas] = useState(0);
  const [notificaciones, setNotificaciones] = useState<Array<{ id: string; titulo: string; mensaje?: string | null; leido: boolean; createdAt: string }>>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/notificaciones?soloNoLeidas=true")
      .then((r) => r.json())
      .then(({ data }) => {
        if (data) {
          setNoLeidas(data.noLeidas || 0);
          setNotificaciones(data.data || []);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  async function toggleNotifications() {
    setShowNotifications(!showNotifications);
    if (!showNotifications && noLeidas > 0) {
      await fetch("/api/notificaciones", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marcarTodas: true }),
      });
      setNoLeidas(0);
      setNotificaciones((prev) => prev.map((n) => ({ ...n, leido: true })));
    }
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Title */}
      <h1 className="text-lg font-semibold text-gray-900 lg:hidden">
        ServiRD
      </h1>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={toggleNotifications}
            className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {noLeidas > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {noLeidas > 9 ? "9+" : noLeidas}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                <div className="p-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">Notificaciones</p>
                </div>
                {notificaciones.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">Sin notificaciones</div>
                ) : (
                  notificaciones.slice(0, 10).map((n) => (
                    <div key={n.id} className={`p-3 border-b border-gray-100 ${!n.leido ? "bg-blue-50" : ""}`}>
                      <p className="text-sm font-medium text-gray-900">{n.titulo}</p>
                      {n.mensaje && <p className="text-xs text-gray-500 mt-0.5">{n.mensaje}</p>}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100"
          >
            <Avatar
              src={user.avatarUrl}
              nombre={user.nombre}
              apellido={user.apellido}
              size="sm"
            />
            <span className="hidden md:block text-sm font-medium text-gray-700">
              {user.nombre}
            </span>
            <svg
              className="w-4 h-4 text-gray-500 hidden md:block"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">
                    {user.nombre} {user.apellido}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{user.rol}</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      router.push(`/${user.rol === "professional" ? "profesional" : user.rol === "admin" ? "admin" : "cliente"}/perfil`);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    Mi Perfil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
