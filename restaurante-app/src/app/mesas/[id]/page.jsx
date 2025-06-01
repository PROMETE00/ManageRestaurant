'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';

export default function GestionMesa() {
  const { id } = useParams();
  const router = useRouter();

  const [mesa, setMesa] = useState(null);
  const [meseros, setMeseros] = useState([]);
  const [meseroId, setMeseroId] = useState('');

  // Obtener info de la mesa
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/mesas/${id}`)
      .then(res => setMesa(res.data))
      .catch(err => console.error('❌ Error al cargar mesa:', err));
  }, [id]);

  // Obtener lista de meseros
  useEffect(() => {
    axios
      .get('http://localhost:8080/api/meseros')
      .then(res => setMeseros(res.data))
      .catch(err => console.error('❌ Error al cargar meseros:', err));
  }, []);

  const handleAsignarMesero = async () => {
    try {
      await axios.put(`http://localhost:8080/api/mesas/${id}/atender`, {
        meseroId: parseInt(meseroId),
      });

      alert('✅ Mesero asignado correctamente');
      router.push('/pagina');
    } catch (err) {
      console.error('❌ Error al asignar mesero:', err);
      alert('Error al asignar mesero');
    }
  };

  if (!mesa) return <p className="text-white p-4">Cargando mesa...</p>;

  return (
    <div className="min-h-screen bg-[#1f2a37] text-white p-8">
      <div className="max-w-xl mx-auto bg-[#2b3748] p-8 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold mb-6">Mesa #{mesa.numero}</h1>

        <div className="space-y-3 mb-8">
          <p>
            <strong>Capacidad:</strong> {mesa.capacidad} personas
          </p>
          <p>
            <strong>Ubicación:</strong> {mesa.ubicacion}
          </p>
          <p>
            <strong>Estado:</strong> {mesa.estado ?? 'libre'}
          </p>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium">Asignar mesero</label>
          <select
            value={meseroId}
            onChange={e => setMeseroId(e.target.value)}
            className="w-full rounded bg-gray-800 px-3 py-2 text-white"
          >
            <option value="">Selecciona un mesero</option>
            {meseros.map(m => (
              <option key={m.id} value={m.id}>
                {m.nombre} — Turno: {m.turno}
              </option>
            ))}
          </select>

          <Button
            onClick={handleAsignarMesero}
            className="bg-yellow-400 text-black font-semibold mt-4 hover:bg-yellow-300"
            disabled={!meseroId}
          >
            Asignar
          </Button>
        </div>
      </div>
    </div>
  );
}
