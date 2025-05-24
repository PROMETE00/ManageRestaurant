'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function NuevaReserva() {
  const router = useRouter()

  // Estado del formulario
  const [form, setForm] = useState({
    nombre: '',
    hora: '',
    pax: 1,
    mesa: '',
    zona: 'Comedor',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // 🔜 Aquí conectarás con tu backend Spring:
    // await fetch('http://localhost:8080/api/reservas', { ... })
    console.log('Reserva lista para enviar:', form)
    // Vuelve al dashboard cuando se guarde
    router.push('/pagina')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1f2a37] p-4">
      <div className="w-full max-w-md bg-[#2b3748] rounded-xl shadow-xl p-8 text-white">
        <h1 className="text-2xl font-bold text-center mb-6">Nueva reserva</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre */}
          <div>
            <label className="block mb-1 text-sm font-medium">Nombre cliente</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full rounded-md bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Hora */}
          <div>
            <label className="block mb-1 text-sm font-medium">Hora</label>
            <input
              type="time"
              name="hora"
              value={form.hora}
              onChange={handleChange}
              required
              className="w-full rounded-md bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Personas */}
          <div>
            <label className="block mb-1 text-sm font-medium">Número de personas</label>
            <input
              type="number"
              name="pax"
              min="1"
              value={form.pax}
              onChange={handleChange}
              required
              className="w-full rounded-md bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Mesa */}
          <div>
            <label className="block mb-1 text-sm font-medium">Mesa</label>
            <input
              type="number"
              name="mesa"
              min="1"
              value={form.mesa}
              onChange={handleChange}
              required
              className="w-full rounded-md bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Zona */}
          <div>
            <label className="block mb-1 text-sm font-medium">Zona</label>
            <select
              name="zona"
              value={form.zona}
              onChange={handleChange}
              className="w-full rounded-md bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option>Comedor</option>
              <option>Terraza</option>
              <option>Barra</option>
            </select>
          </div>

          {/* Botones */}
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-500 hover:bg-gray-600"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600"
            >
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
