'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Button } from '@/components/ui/button'

export default function DashboardRestaurante() {
  const router = useRouter()
  const [reservas, setReservas] = useState([])
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
  const user = localStorage.getItem('usuario');
  if (user) {
    setUsuario(JSON.parse(user));
  }
  }, []);


  useEffect(() => {
    axios.get("http://localhost:8080/api/reservas")
      .then((res) => {
        const data = res.data.map(r => ({
          hora: r.hora?.slice(0, 5) + 'h',
          pax: r.cantidad,
          mesa: r.mesa?.id,
          zona: r.mesa?.ubicacion ?? 'Desconocida',
          nombre: r.cliente?.nombre ?? 'Sin nombre'
        }))
        setReservas(data)
      })
      .catch(err => console.error("Error al obtener reservas:", err))
  }, [])

  const mesasActivas = reservas.map((r) => r.mesa)

  return (
    <div className="flex min-h-screen bg-[#1f2a37] text-white font-sans">
      
      <aside className="w-1/3 p-5 border-r border-gray-700 overflow-y-auto">
        <header className="mb-6 relative">
  {usuario && (
    <p className="absolute left-0 top-0 text-2xl font-bold text-blue-300">
      Hola, {usuario.nombre}
    </p>
  )}

  <h1 className="text-2xl font-bold text-yellow-400 tracking-wide text-center">
    📋 RESERVAS 📋
  </h1>

  <input
    type="text"
    placeholder="Buscar cliente o mesa"
    className="w-full mt-12 bg-gray-800 rounded px-3 py-2 text-sm text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
  />
</header>





        {/* Filtros */}
        <div className="flex space-x-2 mb-4">
          <Button className="bg-yellow-500 text-black">Activos</Button>
          <Button variant="outline" className="text-yellow-400 border-yellow-400">Completados</Button>
        </div>

        <div className="flex space-x-2 mb-6">
          <Button className="bg-white text-black">Hora</Button>
          <Button className="bg-white text-black">Nombre</Button>
        </div>

        {/* Lista de reservas */}
        <div className="space-y-4">
          {reservas.map((reserva, i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-4 shadow border-l-4 border-green-500 hover:border-green-300 transition">
              <div className="flex justify-between items-center mb-1">
                <span className="text-green-300 font-semibold">{reserva.nombre}</span>
                <span className="text-xs text-gray-400 italic">{reserva.zona}</span>
              </div>
              <div className="text-sm text-gray-300">
                ⏰ {reserva.hora} — 👥 {reserva.pax}p — 🍽️ Mesa {reserva.mesa}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Panel derecho - Plano del restaurante */}
      <main className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Plano del Restaurante</h2>
          <div className="flex space-x-2">
            <Button
              onClick={() => router.push('/reservas/nueva')}
              className="bg-yellow-400 text-black font-semibold hover:bg-yellow-300"
            >
              ➕ Nueva Reserva
            </Button>
            <Button
              onClick={() => router.push('/meseros/nuevo')}
              className="bg-green-500 text-white hover:bg-green-400"
            >
              ➕ Registrar Mesero
            </Button>
          </div>
        </header>

        {/* Plano visual */}
        <div className="grid grid-cols-7 gap-3 auto-rows-[70px] justify-items-center items-center">
          {[
            'tree', 'tree', 'mesa-1', 'tree', 'mesa-2', 'tree', 'tree',
            'mesa-3', 'libre', 'mesa-4', 'bloque', 'mesa-5', 'libre', 'mesa-6',
            'mesa-7', 'bloque', 'bloque', 'mesa-8', 'bloque', 'bloque', 'mesa-9',
            'sombrilla', 'tree', 'sombrilla', 'tree', 'sombrilla', 'tree', 'mesa-10',
            'bloque', 'bloque', 'libre', 'bloque', 'libre', 'bloque', 'bloque',
          ].map((item, i) => {
            if (item.startsWith('mesa')) {
              const numeroMesa = parseInt(item.split('-')[1])
              const estaActiva = mesasActivas.includes(numeroMesa)
              const reservaMesa = reservas.find(r => r.mesa === numeroMesa)

              return (
                <div
                  key={i}
                  onClick={() => router.push(`/mesas/${numeroMesa}`)} // ⬅️ redirige a /mesas/#
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
              )
            }

            const iconos = {
              tree: "/assets/icons/tree-svgrepo-com.svg",
              bloque: "/assets/icons/chair-svgrepo-com.svg",
              sombrilla: "/assets/icons/umbrella-sea-svgrepo-com.svg"
            }

            return (
              <div key={i} className="w-full h-full flex justify-center items-center">
                {iconos[item] && (
                  <img src={iconos[item]} alt={item} className="w-8 h-8 object-contain" />
                )}
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
