'use client';

import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Sidebar from '@/components/SidebarNavegacion';

/* ───────── Helpers ───────── */
const ESTATUS_OPTIONS = ['pendiente', 'pagado', 'cancelado'];

const formatDate = iso =>
  new Date(iso).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

const formatTime = iso =>
  new Date(`1970-01-01T${iso}`).toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  });

/* ───────── Component ───────── */
export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  /* Fetch inicial */
  useEffect(() => {
    axios
      .get('http://localhost:8080/api/pedidos')
      .then(res => setPedidos(res.data))
      .catch(err => console.error('Error al cargar pedidos:', err));
  }, []);

  /* Handler cambio de estatus */
  const cambiarEstatus = (id, nuevo) => {
    axios
      .patch(`http://localhost:8080/api/pedidos/${id}`, { estatus: nuevo })
      .then(res =>
        setPedidos(prev =>
          prev.map(p => (p.id === id ? { ...p, estatus: res.data.estatus } : p)),
        ),
      )
      .catch(err => console.error('Error al actualizar estatus:', err));
  };

  /* Filtrado */
  const pedidosFiltrados = useMemo(() => {
    if (!busqueda.trim()) return pedidos;
    const term = busqueda.toLowerCase();
    return pedidos.filter(
      p =>
        p.id.toString().includes(term) ||
        p.cliente?.nombre?.toLowerCase().includes(term) ||
        p.estatus.toLowerCase().includes(term),
    );
  }, [pedidos, busqueda]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <Sidebar />

      {/* margen lateral mayor (ml-24) y padding extra (px-10) */}
      <div className="flex-1 ml-24 px-10 py-6 overflow-x-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <span className="text-blue-400">🧾</span> Pedidos
          </h1>

          {/* Buscar */}
          <input
            type="text"
            placeholder="Buscar..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-sm focus:outline-none"
          />
        </div>

        {/* Nuevo Pedido (placeholder) */}
        <button className="mb-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded flex items-center gap-2">
          <FaPlus /> Nuevo Pedido
        </button>

        {/* Tabla */}
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-yellow-500 text-gray-900">
              <th className="py-2 px-3 text-left">ID</th>
              <th className="py-2 px-3 text-left">Fecha</th>
              <th className="py-2 px-3 text-left">Hora</th>
              <th className="py-2 px-3 text-left">Cliente</th>
              <th className="py-2 px-3 text-right">Total ($)</th>
              <th className="py-2 px-3 text-center">Estatus</th>
              <th className="py-2 px-3 text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            {pedidosFiltrados.map(p => (
              <tr key={p.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="py-2 px-3">{p.id}</td>
                <td className="py-2 px-3">{formatDate(p.fecha)}</td>
                <td className="py-2 px-3">{formatTime(p.hora)}</td>
                <td className="py-2 px-3">{p.cliente?.nombre ?? '—'}</td>
                <td className="py-2 px-3 text-right">{p.total?.toFixed(2) ?? '0.00'}</td>

                {/* Select Estatus */}
                <td className="py-2 px-3 text-center">
                  <select
                    value={p.estatus}
                    onChange={e => cambiarEstatus(p.id, e.target.value)}
                    className={`rounded px-2 py-1 text-xs font-semibold ${
                      p.estatus === 'pagado'
                        ? 'bg-green-600'
                        : p.estatus === 'cancelado'
                        ? 'bg-red-600'
                        : 'bg-yellow-600 text-gray-900'
                    }`}
                  >
                    {ESTATUS_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Botones acción (placeholder) */}
                <td className="py-2 px-3 text-center space-x-1">
                  <button className="bg-blue-500 hover:bg-blue-400 text-white p-1 rounded">
                    <FaEdit size={12} />
                  </button>
                  <button className="bg-red-600 hover:bg-red-500 text-white p-1 rounded">
                    <FaTrash size={12} />
                  </button>
                </td>
              </tr>
            ))}

            {/* Sin resultados */}
            {pedidosFiltrados.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-gray-400">
                  No se encontraron pedidos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
