'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import axios from 'axios'

export default function NuevaReserva() {
  const router = useRouter()

  const [form, setForm] = useState({
    nombre: '',
    hora: '',
    pax: 1,
    mesa: '',
    zona: 'Comedor',
  })

  const [mesas, setMesas] = useState([])

  // 🔄 Cargar mesas al iniciar
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
      // 1️⃣ Crear cliente (temporal)
      const clienteRes = await axios.post('http://localhost:8080/api/clientes', {
        nombre: form.nombre,
        telefono: '000-000-0000'
      })
      const clienteId = clienteRes.data.id

      // 2️⃣ Crear reserva
      await axios.post('http://localhost:8080/api/reservas', {
        fecha: new Date().toISOString().split('T')[0], // hoy
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
              className="w-full rounded-md bg-gray-800 px-3 py-2"
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
              className="w-full rounded-md bg-gray-800 px-3 py-2"
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
              className="w-full rounded-md bg-gray-800 px-3 py-2"
            />
          </div>

          {/* Mesa */}
          <div>
            <label className="block mb-1 text-sm font-medium">Mesa</label>
            <select
              name="mesa"
              value={form.mesa}
              onChange={handleChange}
              required
              className="w-full rounded-md bg-gray-800 px-3 py-2"
            >
              <option value="">Selecciona una mesa</option>
              {mesas.map(m => (
                <option key={m.id} value={m.id}>
                  Mesa {m.id} - {m.ubicacion} ({m.capacidad} pax)
                </option>
              ))}
            </select>
          </div>

          {/* Zona (solo visual) */}
          <div>
            <label className="block mb-1 text-sm font-medium">Zona (solo decorativo)</label>
            <select
              name="zona"
              value={form.zona}
              onChange={handleChange}
              className="w-full rounded-md bg-gray-800 px-3 py-2"
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
