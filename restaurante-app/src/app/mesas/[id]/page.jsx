'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Sidebar from '@/components/SidebarNavegacion';
import { Button } from '@/components/ui/button';
import { FaTrash } from 'react-icons/fa';

/* ---------- helpers ---------- */
const ESTADOS = ['libre', 'reservada', 'ocupada', 'atendida'];
const nice = t => t.charAt(0).toUpperCase() + t.slice(1);

/* ---------- axios instance ---------- */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

export default function GestionMesa() {
  const { id } = useParams();          // mesaId (string)
  const router = useRouter();

  const [mesa, setMesa]                       = useState(null);
  const [meseros, setMeseros]                 = useState([]);
  const [meserosAsignados, setMeserosAsignados] = useState([]);
  const [mesaItems, setMesaItems]             = useState([]);

  const [meseroId, setMeseroId]   = useState('');
  const [nuevoEstado, setNuevoEstado] = useState('');

  /* ---------- fetch helpers ---------- */
  const cargarMesa = () =>
    api.get(`/mesas/${id}`)
       .then(r => {
         setMesa(r.data);
         setNuevoEstado(r.data.estado?.descripcion ?? 'libre');
       })
       .catch(() => alert('Mesa no encontrada'));

  const cargarMeserosAsignados = () =>
    api.get(`/mesas/${id}/meseros`).then(r => setMeserosAsignados(r.data));

  const cargarProductosMesa = () =>
    api.get(`/mesas/${id}/productos`).then(r => setMesaItems(r.data));

  /* ---------- initial load ---------- */
  useEffect(() => {
    cargarMesa();
    api.get('/meseros').then(r => setMeseros(r.data));
    cargarMeserosAsignados();
    cargarProductosMesa();
  }, [id]);

  /* ---------- cambiar estado ---------- */
  const cambiarEstado = async e => {
    const estado = e.target.value;
    setNuevoEstado(estado);

    try {
      await api.patch(`/mesas/${id}`, { estado });
      cargarMesa();
    } catch {
      alert('Error cambiando estado');
    }
  };

  /* ---------- asignar / quitar mesero ---------- */
  const asignarMesero = async () => {
    try {
      await api.post(`/mesas/${id}/meseros`, { meseroId: Number(meseroId) });
      setMeseroId('');
      cargarMeserosAsignados();
    } catch {
      alert('Error asignando mesero');
    }
  };

  const quitarMesero = async mmId => {
    try {
      await api.delete(`/mesas/${id}/meseros/${mmId}`);
      setMeserosAsignados(prev => prev.filter(x => x.id !== mmId));
    } catch {
      alert('Error quitando mesero');
    }
  };

  /* ---------- quitar producto ---------- */
  const quitarProducto = async ticketId => {
    try {
      await api.delete(`/mesas/${id}/productos/${ticketId}`);
      setMesaItems(prev => prev.filter(x => x.id !== ticketId));
    } catch {
      alert('Error quitando producto');
    }
  };

  const total = useMemo(
    () => mesaItems.reduce((s, it) => s + (it.precio ?? 0), 0).toFixed(2),
    [mesaItems],
  );

  if (!mesa) return <p className="text-white p-6">Cargando…</p>;

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-[#1f2a37] text-white flex">
      <Sidebar />

      {/* margen lateral para la sidebar global */}
      <div className="flex-1 ml-24 flex gap-8 p-8">
        {/* ===== Columna izquierda ===== */}
        <section className="w-full max-w-md bg-[#2b3748] p-8 rounded-xl shadow-xl space-y-6">
          <h1 className="text-3xl font-bold">Mesa #{mesa.numero}</h1>

          <div className="space-y-1">
            <p><strong>Capacidad:</strong> {mesa.capacidad} personas</p>
            <p><strong>Ubicación:</strong> {nice(mesa.ubicacion)}</p>
            <p>
              <strong>Estado:</strong>{' '}
              <span className={
                nuevoEstado === 'ocupada'   ? 'text-red-400'     :
                nuevoEstado === 'reservada' ? 'text-yellow-400'  :
                nuevoEstado === 'atendida'  ? 'text-blue-400'    :
                                              'text-green-400'
              }>{nice(nuevoEstado)}</span>
            </p>
          </div>

          {/* Cambiar estado */}
          <div>
            <label className="block text-sm font-medium mb-1">Cambiar estado</label>
            <select
              value={nuevoEstado}
              onChange={cambiarEstado}
              className="w-full rounded bg-gray-800 px-3 py-2 text-white"
            >
              {ESTADOS.map(e => (
                <option key={e} value={e}>{nice(e)}</option>
              ))}
            </select>
          </div>

          {/* Asignar mesero */}
          <div>
            <label className="block text-sm font-medium mb-1">Asignar mesero</label>
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
          </div>

          <div className="flex gap-2">
            <Button
              onClick={asignarMesero}
              disabled={!meseroId}
              className="bg-yellow-400 text-black hover:bg-yellow-300"
            >
              Asignar
            </Button>

            <Button
              variant="outline"
              onClick={() => router.back()}
              className="border-gray-400 text-gray-300 hover:bg-gray-700"
            >
              Cancelar
            </Button>

            <Button
              onClick={() => router.push(`/mesas/${id}/productos`)}
              className="ml-auto bg-blue-600 hover:bg-blue-500"
            >
              Agregar productos
            </Button>
          </div>

          {/* Meseros asignados */}
          {meserosAsignados.length > 0 && (
            <div className="pt-2 border-t border-gray-700">
              <h2 className="font-semibold mb-2">Meseros asignados</h2>
              <ul className="space-y-1">
                {meserosAsignados.map(a => (
                  <li
                    key={a.id}
                    className="flex justify-between bg-gray-800 px-3 py-2 rounded items-center"
                  >
                    <span>{a.mesero.nombre}</span>
                    <button
                      onClick={() => quitarMesero(a.id)}
                      className="text-red-400 hover:text-red-300 text-xs"
                    >
                      Quitar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* ===== Columna derecha (ticket) ===== */}
        <section className="flex-1 bg-[#2b3748] p-8 rounded-xl shadow-xl overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">Ticket</h2>

          {mesaItems.length === 0 ? (
            <p className="text-gray-400">Sin productos aún</p>
          ) : (
            <ul className="space-y-2">
              {mesaItems.map(it => (
                <li
                  key={it.id}
                  className="flex justify-between bg-gray-800 px-4 py-2 rounded items-center"
                >
                  <span className="truncate max-w-[220px]">{it.nombre}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-green-400">${it.precio}</span>
                    <button
                      onClick={() => quitarProducto(it.id)}
                      className="text-red-400 hover:text-red-300"
                      title="Quitar"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="pt-6 border-t border-gray-700 mt-6 flex justify-between items-center">
            <span className="font-semibold text-lg">
              Total: <span className="text-green-400">${total}</span>
            </span>
            <Button
  className="bg-purple-600 hover:bg-purple-500"
  onClick={() => {
    const url = `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api'}/mesas/${id}/ticket`;
    window.open(url, '_blank');     // abre el PDF en nueva pestaña
  }}
>
  Imprimir ticket
</Button>

          </div>
        </section>
      </div>
    </div>
  );
}
