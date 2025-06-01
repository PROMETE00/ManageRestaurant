'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Users, UtensilsCrossed, ShoppingCart, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'Dashboard', icon: <Home size={20} />, path: '/dashboard' },
  { label: 'Clientes', icon: <Users size={20} />, path: '/clientes' },
  { label: 'Platillos', icon: <UtensilsCrossed size={20} />, path: '/platillos' },
  { label: 'Pedidos', icon: <ShoppingCart size={20} />, path: '/pedidos' },
];

export default function DashboardLayout() {
  const [usuario, setUsuario] = useState(null);
  const [reservas, setReservas] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('usuario');
    if (user) setUsuario(JSON.parse(user));
  }, []);

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/reservas')
      .then(res => {
        const data = res.data.map(r => ({
          hora: r.hora?.slice(0, 5) + 'h',
          pax: r.cantidad,
          mesa: r.mesa?.id,
          zona: r.mesa?.ubicacion ?? 'Desconocida',
          nombre: r.cliente?.nombre ?? 'Sin nombre',
        }));
        setReservas(data);
      })
      .catch(err => console.error('Error al obtener reservas:', err));
  }, []);

  const mesasActivas = reservas.map(r => r.mesa);

  return (
    <div className="min-h-screen bg-[#1f1f2e] text-white flex flex-col">
      {/* NAVBAR SUPERIOR */}
      <nav className="w-full bg-gradient-to-r from-purple-900 to-blue-900 py-3 px-6 flex justify-between items-center shadow-md relative">
        <div className="flex items-center gap-3 absolute left-4 cursor-pointer hover:opacity-80 transition-opacity duration-300">
          <UserCircle size={28} className="text-white" />
          {usuario && <span className="text-white text-base font-semibold">{usuario.nombre}</span>}
        </div>

        <h1 className="text-xl font-bold text-yellow-300 text-center mx-auto">
          🍽️ Golden Plate Bistro
        </h1>

        <div className="flex space-x-2">
          <Button
            onClick={() => router.push('/reservas/nueva')}
            className="bg-yellow-400 text-black font-semibold hover:bg-yellow-300"
          >
            ➕ Nueva Reserva
          </Button>
        </div>
      </nav>

      <div className="flex-1 relative">
        {/* SIDEBAR */}
        <div className="group absolute left-0 top-1/2 -translate-y-1/2 z-20">
          <motion.aside
            initial={{ width: 56 }}
            whileHover={{ width: 160 }}
            className="bg-[#151521] rounded-r-xl shadow-lg py-4 px-2 h-auto transition-all duration-300 overflow-hidden"
          >
            <div className="flex flex-col items-start space-y-3">
              {navItems.map((item, index) => (
                <div
                  key={index}
                  onClick={() => router.push(item.path)}
                  className="flex items-center w-full px-2 py-2 rounded-md cursor-pointer hover:bg-purple-600 transition"
                >
                  <div className="text-white">{item.icon}</div>
                  <span className="ml-3 text-sm text-white font-medium hidden group-hover:inline-block transition-all duration-300">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.aside>
        </div>

        {/* CONTENIDO - Plano de restaurante */}
        <main className="ml-16 p-6">
          <header className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Plano del Restaurante</h2>
          </header>

          <div className="grid grid-cols-7 gap-3 auto-rows-[70px] justify-items-center items-center">
            {[
              'tree',
              'tree',
              'mesa-1',
              'tree',
              'mesa-2',
              'tree',
              'tree',
              'mesa-3',
              'libre',
              'mesa-4',
              'bloque',
              'mesa-5',
              'libre',
              'mesa-6',
              'mesa-7',
              'bloque',
              'bloque',
              'mesa-8',
              'bloque',
              'bloque',
              'mesa-9',
              'sombrilla',
              'tree',
              'sombrilla',
              'tree',
              'sombrilla',
              'tree',
              'mesa-10',
              'bloque',
              'bloque',
              'libre',
              'bloque',
              'libre',
              'bloque',
              'bloque',
            ].map((item, i) => {
              if (item.startsWith('mesa')) {
                const numeroMesa = parseInt(item.split('-')[1]);
                const estaActiva = mesasActivas.includes(numeroMesa);
                const reservaMesa = reservas.find(r => r.mesa === numeroMesa);

                return (
                  <div
                    key={i}
                    onClick={() => router.push(`/mesas/${numeroMesa}`)}
                    className={`cursor-pointer w-full h-full rounded flex flex-col items-center justify-center font-bold text-xs text-black text-center p-1 transition-colors duration-300 ${
                      estaActiva ? 'bg-red-500 hover:bg-red-600' : 'bg-green-400 hover:bg-green-500'
                    }`}
                  >
                    <span>Mesa {numeroMesa}</span>
                    {reservaMesa && (
                      <>
                        <span className="text-[10px]">{reservaMesa.hora}</span>
                        <span className="text-[10px]">{reservaMesa.pax}p</span>
                      </>
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
