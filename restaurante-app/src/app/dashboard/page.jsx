'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Home,
  CalendarDays,
  Users,
  UtensilsCrossed,
  ShoppingCart,
  UserCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Button } from '@/components/ui/button';

/* ————— items de menú lateral ————— */
const navItems = [
  { label: 'Dashboard', icon: <Home size={20} />,           path: '/dashboard' },
  { label: 'Reservas',  icon: <CalendarDays size={20} />,   path: '/pagina'    },
  { label: 'Clientes',  icon: <Users size={20} />,          path: '/clientes'  },
  { label: 'Platillos', icon: <UtensilsCrossed size={20} />,path: '/platillos' },
  { label: 'Pedidos',   icon: <ShoppingCart size={20} />,   path: '/pedidos'   },
];

/**
 * Devuelve la clase de fondo + hover en Tailwind según el estado de la mesa.
 */
function clasePorEstado(estado) {
  switch (estado) {
    case 'libre':
      return 'bg-green-400 hover:bg-green-500';
    case 'reservada':
      return 'bg-yellow-400 hover:bg-yellow-500';
    case 'ocupada':
      return 'bg-red-400 hover:bg-red-500';
    case 'atendida':
      return 'bg-blue-400 hover:bg-blue-500';
    default:
      return 'bg-gray-400 hover:bg-gray-500';
  }
}

export default function DashboardLayout() {
  const [usuario, setUsuario] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [mesasEstado, setMesasEstado] = useState({}); // { numeroMesa: estadoString }
  const [horaActual, setHoraActual] = useState(new Date());
  const router = useRouter();

  /* ——— Cargar usuario desde localStorage ——— */
  useEffect(() => {
    const userJson = localStorage.getItem('usuario');
    if (userJson) {
      setUsuario(JSON.parse(userJson));
    }
  }, []);

  /* ——— Cargar reservas (para hora + pax) ——— */
  useEffect(() => {
    axios
      .get('http://localhost:8080/api/reservas')
      .then((res) => {
        const data = res.data.map((r) => ({
          hora: r.hora?.slice(0, 5) + 'h',
          pax: r.cantidad,
          mesa: r.mesa?.numero,          // Asegúrate de que tu JSON tenga “numero”
          zona: r.mesa?.ubicacion ?? 'Desconocida',
          nombre: r.cliente?.nombre ?? 'Sin nombre',
        }));
        setReservas(data);
      })
      .catch((err) => console.error('Error al obtener reservas:', err));
  }, []);

  /* ——— Cargar estado de mesas ——— */
  useEffect(() => {
    axios
      .get('http://localhost:8080/api/mesas')
      .then((res) => {
        const nuevoMapa = {};
        res.data.forEach((m) => {
          // Cada objeto “m” debe tener “numero” y “estado”
          nuevoMapa[m.numero] = m.estado ?? 'libre';
        });
        setMesasEstado(nuevoMapa);
      })
      .catch((err) => console.error('Error cargando estados de mesas:', err));
  }, []);

  /* ——— Reloj en vivo y turno dinámico ——— */
  useEffect(() => {
    const timerId = setInterval(() => {
      setHoraActual(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const formatoHora = horaActual.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const horaNum = horaActual.getHours();
  let turno = '';
  if (horaNum < 6) turno = 'Madrugada';
  else if (horaNum < 12) turno = 'Mañana';
  else if (horaNum < 18) turno = 'Tarde';
  else turno = 'Noche';

  return (
    <div className="min-h-screen bg-[#1f1f2e] text-white flex flex-col">
      {/* NAVBAR SUPERIOR */}
      <nav className="w-full bg-gradient-to-r from-purple-900 to-blue-900 py-3 px-6 flex justify-between items-center shadow-md relative">
        {/* Avatar + Nombre a la izquierda */}
        <div className="flex items-center gap-3 absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer hover:opacity-80 transition-opacity duration-300">
          <UserCircle size={28} className="text-white" />
          {usuario && (
            <span className="text-white text-base font-semibold">
              {usuario.nombre}
            </span>
          )}
        </div>

        {/* Título centrado */}
        <h1 className="text-xl font-bold text-yellow-300 text-center mx-auto">
          🍽️ Golden Plate Bistro
        </h1>

        {/* Botón “Nueva Reserva” + Reloj/Turno a la derecha */}
        <div className="flex items-center space-x-4 absolute right-4 top-1/2 -translate-y-1/2">
          <Button
            onClick={() => router.push('/reservas/nueva')}
            className="bg-yellow-400 text-black font-semibold hover:bg-yellow-300"
          >
            ➕ Nueva Reserva
          </Button>
          <div className="flex flex-col items-end text-sm">
            <span className="text-white font-semibold">{formatoHora}</span>
            <span className="text-gray-300 italic text-xs">{turno}</span>
          </div>
        </div>
      </nav>

      <div className="flex-1 relative">
        {/* SIDEBAR LATERAL */}
        <div className="group absolute left-0 top-1/2 -translate-y-1/2 z-20">
          <motion.aside
            initial={{ width: 56 }}
            whileHover={{ width: 160 }}
            className="bg-[#151521] rounded-r-xl shadow-lg py-4 px-2 h-auto transition-all duration-300 overflow-hidden"
          >
            <div className="flex flex-col items-start space-y-3">
              {navItems.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => router.push(item.path)}
                  className="flex items-center w-full px-2 py-2 rounded-md cursor-pointer hover:bg-purple-600 transition"
                >
                  <div className="text-white">{item.icon}</div>
                  <span className="ml-3 text-sm text-white font-medium hidden group-hover:inline-block transition-opacity duration-300">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.aside>
        </div>

        {/* CONTENIDO – Plano del restaurante */}
        <main className="ml-16 p-6">
          <header className="flex justify-between items-center mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-white">
              Plano del Restaurante
            </h2>
          </header>

          <div className="grid grid-cols-7 gap-3 auto-rows-[75px] justify-items-center items-center">
            {/*
              Solo “mesa-X” o íconos: “tree”, “bloque”, “sombrilla”.
              Eliminamos literales “libre” de este array.
            */}
            {[
              'tree', 'tree', 'mesa-1', 'tree', 'mesa-2', 'tree', 'tree',
              'mesa-3', 'mesa-4', 'bloque', 'mesa-5', 'mesa-6', 'mesa-7',
              'bloque', 'bloque', 'mesa-8', 'bloque', 'bloque', 'mesa-9',
              'sombrilla', 'tree', 'sombrilla', 'tree', 'sombrilla', 'tree',
              'mesa-10', 'bloque', 'bloque', 'bloque', 'bloque',
            ].map((item, i) => {
              if (item.startsWith('mesa')) {
                const numeroMesa = parseInt(item.split('-')[1], 10);
                const estado = mesasEstado[numeroMesa] ?? 'libre';
                const reservaMesa = reservas.find((r) => r.mesa === numeroMesa);

                return (
                  <div
                    key={i}
                    onClick={() => router.push(`/mesas/${numeroMesa}`)}
                    className={`
                      cursor-pointer w-full h-full rounded-lg flex flex-col items-center justify-center font-bold text-xs text-black text-center p-1 transition-colors duration-300
                      ${clasePorEstado(estado)}
                    `}
                  >
                    <span className="leading-tight">Mesa {numeroMesa}</span>
                    {reservaMesa && (
                      <div className="mt-1 space-y-1">
                        <span className="text-[10px]">{reservaMesa.hora}</span>
                        <span className="text-[10px]">{reservaMesa.pax} p</span>
                      </div>
                    )}
                  </div>
                );
              }

              const iconos = {
                tree: '/assets/icons/tree-svgrepo-com.svg',
                bloque: '/assets/icons/chair-svgrepo-com.svg',
                sombrilla: '/assets/icons/umbrella-sea-svgrepo-com.svg',
              };

              return (
                <div key={i} className="w-full h-full flex justify-center items-center">
                  {iconos[item] && (
                    <img
                      src={iconos[item]}
                      alt={item}
                      className="w-8 h-8 object-contain opacity-70"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
