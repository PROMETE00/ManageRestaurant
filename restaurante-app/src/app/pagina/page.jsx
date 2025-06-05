'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FaSortAlphaDown, FaSortAlphaUp, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import SidebarNavegacionAdmin from '@/components/SideBarNavegacionAdmin';
import SidebarNavegacionEmpleado from '@/components/SideBarNavegacionEmpleado';

export default function DashboardRestaurante() {
  const [reservas, setReservas] = useState([]);
  const [filtro, setFiltro] = useState('');      // texto para buscar
  const [sortField, setSortField] = useState('hora'); // 'hora' o 'nombre'
  const [sortAsc, setSortAsc] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const router = useRouter();

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const user = localStorage.getItem('usuario');
    if (!user) {
      // Si no hay usuario logueado, redirigir al login
      router.push('/login');
      return;
    }
    setUsuario(JSON.parse(user));
  }, [router]);

  // Si el rol no es admin o empleado, redirige a una página restringida
  if (usuario && usuario.rol !== 'admin' && usuario.rol !== 'empleado') {
    return (
      <div className="min-h-screen bg-[#1f2a37] text-white flex items-center justify-center">
        <h1 className="text-2xl font-bold text-yellow-400">Acceso restringido. Solo administradores y empleados pueden ver esta página.</h1>
      </div>
    );
  }

  // ──── Carga inicial de datos ────
  useEffect(() => {
    axios
      .get('http://localhost:8080/api/reservas')
      .then(res => {
        const data = res.data.map(r => ({
          id: r.id,
          hora: r.hora?.slice(0, 5) + 'h',            // ej. "14:30h"
          pax: r.cantidad,
          mesa: r.mesa?.numero ?? '—',
          zona: r.mesa?.ubicacion ?? 'Desconocida',
          nombre: r.cliente?.nombre ?? 'Sin nombre',
          fecha: r.fecha ? new Date(r.fecha).toLocaleDateString('es-MX') : '—',
        }));
        setReservas(data);
      })
      .catch(err => console.error('Error al obtener reservas:', err));
  }, []);

  // ──── Filtrado por texto ────
  const reservasFiltradas = useMemo(() => {
    if (!filtro.trim()) return reservas;
    const term = filtro.toLowerCase();
    return reservas.filter(r =>
      r.nombre.toLowerCase().includes(term) ||
      r.mesa.toString().includes(term)
    );
  }, [reservas, filtro]);

  // ──── Ordenamiento ────
  const reservasOrdenadas = useMemo(() => {
    return [...reservasFiltradas].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // Si ordenamos por hora (convertir "HH:MMh" → número HHMM)
      if (sortField === 'hora') {
        const parseHora = h => {
          if (!h) return 0;
          const [hh, mm] = h.replace('h', '').split(':').map(x => parseInt(x, 10));
          return hh * 100 + mm;
        };
        valA = parseHora(valA);
        valB = parseHora(valB);
      }

      // Si ordenamos por nombre (cadena)
      if (sortField === 'nombre') {
        return sortAsc
          ? valA.localeCompare(valB, 'es')
          : valB.localeCompare(valA, 'es');
      }

      // Si ordenamos por mesa o pax (numérico)
      if (sortField === 'mesa' || sortField === 'pax') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      }

      // Comparación numérica genérica
      return sortAsc ? valA - valB : valB - valA;
    });
  }, [reservasFiltradas, sortField, sortAsc]);

  // ──── Cambiar dirección de orden (ascendente/descendente) ────
  const toggleSortDirection = () => setSortAsc(prev => !prev);

  return (
    <div className="flex min-h-screen bg-[#1f2a37] text-white">
      {/* ─── Sidebar ─── */}
      {usuario && usuario.rol === 'admin' ? (
        <SidebarNavegacionAdmin />
      ) : (
        <SidebarNavegacionEmpleado />
      )}

      {/* ─── Contenido principal ─── */}
      <div className="flex-1 ml-16 p-6">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
          📋 Listado de Reservas
        </h1>

        {/* ─── Barra de filtros + botones de orden ─── */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 space-y-4 md:space-y-0 md:space-x-4">
          {/* Input de búsqueda */}
          <input
            type="text"
            placeholder="Buscar por cliente o mesa…"
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
            className="w-full md:w-1/3 bg-gray-800 text-white px-4 py-2 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
          />

          {/* Botones de orden */}
          <div className="flex items-center space-x-2">
            {/* Ordenar por hora */}
            <button
              onClick={() => {
                if (sortField === 'hora') {
                  toggleSortDirection();
                } else {
                  setSortField('hora');
                  setSortAsc(true);
                }
              }}
              className={`flex items-center gap-1 px-3 py-2 rounded-md transition 
                ${
                  sortField === 'hora'
                    ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
            >
              Hora
              {sortField === 'hora' &&
                (sortAsc ? (
                  <FaSortAmountDown size={14} />
                ) : (
                  <FaSortAmountUp size={14} />
                ))}
            </button>

            {/* Ordenar por nombre */}
            <button
              onClick={() => {
                if (sortField === 'nombre') {
                  toggleSortDirection();
                } else {
                  setSortField('nombre');
                  setSortAsc(true);
                }
              }}
              className={`flex items-center gap-1 px-3 py-2 rounded-md transition 
                ${
                  sortField === 'nombre'
                    ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
            >
              Cliente
              {sortField === 'nombre' &&
                (sortAsc ? (
                  <FaSortAlphaDown size={14} />
                ) : (
                  <FaSortAlphaUp size={14} />
                ))}
            </button>
          </div>
        </div>

        {/* ─── Tabla de reservas ─── */}
        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
          <table className="min-w-full divide-y divide-gray-700 text-sm">
            <thead>
              <tr className="bg-gray-900">
                <th className="px-4 py-3 text-left text-gray-300">Hora</th>
                <th className="px-4 py-3 text-left text-gray-300">Cliente</th>
                <th className="px-4 py-3 text-left text-gray-300">Mesa</th>
                <th className="px-4 py-3 text-left text-gray-300">Zona</th>
                <th className="px-4 py-3 text-left text-gray-300">Pax</th>
                <th className="px-4 py-3 text-left text-gray-300">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {reservasOrdenadas.map((r, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                >
                  <td className="px-4 py-3">{r.hora}</td>
                  <td className="px-4 py-3">{r.nombre}</td>
                  <td className="px-4 py-3">{r.mesa}</td>
                  <td className="px-4 py-3">{r.zona}</td>
                  <td className="px-4 py-3">{r.pax}p</td>
                  <td className="px-4 py-3">{r.fecha}</td>
                </tr>
              ))}

              {reservasOrdenadas.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                    No hay reservas que mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
