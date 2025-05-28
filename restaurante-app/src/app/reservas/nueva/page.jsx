'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { format } from 'date-fns'

export default function NuevaReserva() {
  const router = useRouter()

  const [form, setForm] = useState({
    nombre: '',
    fecha: format(new Date(), 'yyyy-MM-dd'),
    hora: '',
    pax: 1,
    mesa: '',
    zona: 'Comedor',
  })

  const [mesas, setMesas] = useState([])

  useEffect(() => {
    axios.get('http://localhost:8080/api/mesas')
      .then(res => setMesas(res.data))
      .catch(err => console.error('Error al cargar mesas:', err))
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const clienteRes = await axios.post('http://localhost:8080/api/clientes', {
        nombre: form.nombre,
        telefono: '000-000-0000'
      })

      const clienteId = clienteRes.data.id

      await axios.post('http://localhost:8080/api/reservas', {
        fecha: form.fecha,
        hora: form.hora,
        cantidad: parseInt(form.pax),
        cliente: { id: clienteId },
        mesa: { id: parseInt(form.mesa) }
      })

      alert('✅ Reserva creada correctamente')
      router.push('/pagina')
    } catch (err) {
      console.error('❌ Error al crear reserva:', err)
      alert('Error al crear reserva')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#1f2a37] to-[#111827] p-4">
      <div className="w-full max-w-xl bg-[#2b3748] rounded-2xl shadow-2xl p-10 text-white space-y-6">
        <h1 className="text-3xl font-bold text-center">Nueva Reserva</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-semibold mb-1">Nombre del Cliente</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-sm font-semibold mb-1">Fecha de Reserva</label>
            <input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 px-4 py-2 rounded-md text-white"
            />
          </div>

          {/* Hora */}
          <div>
            <label className="block text-sm font-semibold mb-1">Hora</label>
            <input
              type="time"
              name="hora"
              value={form.hora}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 px-4 py-2 rounded-md text-white"
            />
          </div>

          {/* Número de Personas */}
          <div>
            <label className="block text-sm font-semibold mb-1">Número de Personas</label>
            <input
              type="number"
              name="pax"
              min="1"
              value={form.pax}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 px-4 py-2 rounded-md text-white"
            />
          </div>

          {/* Mesa */}
          <div>
            <label className="block text-sm font-semibold mb-1">Mesa</label>
            <select
              name="mesa"
              value={form.mesa}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 px-4 py-2 rounded-md text-white"
            >
              <option value="">Selecciona una mesa</option>
              {mesas.map((m) => (
                <option key={m.id} value={m.id}>
                  Mesa {m.id} - {m.ubicacion} ({m.capacidad} pax)
                </option>
              ))}
            </select>
          </div>

          {/* Zona decorativa */}
          <div>
            <label className="block text-sm font-semibold mb-1">Zona (Decorativo)</label>
            <select
              name="zona"
              value={form.zona}
              onChange={handleChange}
              className="w-full bg-gray-800 px-4 py-2 rounded-md text-white"
            >
              <option>Comedor</option>
              <option>Terraza</option>
              <option>Barra</option>
            </select>
          </div>

          {/* Botones */}
          <div className="flex justify-between mt-6">
            <Button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
            >
              Guardar Reserva
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
