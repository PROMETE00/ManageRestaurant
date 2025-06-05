'use client';

import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import SidebarNavegacionAdmin from '@/components/SideBarNavegacionAdmin'; // Sidebar Admin
import SidebarNavegacionEmpleado from '@/components/SideBarNavegacionEmpleado'; // Sidebar Empleado
import { useRouter } from 'next/navigation';

/* ───────── Helpers ───────── */
const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

const formatTime = (iso) =>
  new Date(`1970-01-01T${iso}`).toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  });

/* ───────── Component ───────── */
export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [usuario, setUsuario] = useState(null);
  const router = useRouter();

  // Validar si el usuario está logueado y si tiene el rol correcto
  useEffect(() => {
    const userJson = localStorage.getItem('usuario');
    if (userJson) {
      const user = JSON.parse(userJson);
      if (user.rol !== 'admin' && user.rol !== 'empleado') {
        // Si el rol no es admin o empleado, redirigir
        alert('❌ Acceso denegado. Solo administradores y empleados pueden acceder.');
        router.push('/login'); // Redirige a login o página de acceso denegado
      } else {
        setUsuario(user);
      }
    } else {
      // Si no hay usuario logueado, redirigir al login
      router.push('/login');
    }
  }, [router]);

  // Cargar pedidos desde la API
  useEffect(() => {
    axios
      .get('http://localhost:8080/api/pedidos')
      .then((res) => setPedidos(res.data))
      .catch((err) => console.error('Error al cargar pedidos:', err));
  }, []);

  // Filtrar pedidos
  const pedidosFiltrados = useMemo(() => {
    if (!busqueda.trim()) return pedidos;
    const term = busqueda.toLowerCase();
    return pedidos.filter(
      (p) =>
        p.id.toString().includes(term) ||
        p.cliente?.nombre?.toLowerCase().includes(term) ||
        p.estatus.toLowerCase().includes(term)
    );
  }, [pedidos, busqueda]);

  // Usar el Sidebar adecuado según el rol del usuario
  const Sidebar = usuario?.rol === 'admin' ? SidebarNavegacionAdmin : SidebarNavegacionEmpleado;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar dinámico */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="flex-1 ml-16 px-10 py-6 overflow-x-auto">
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
            onChange={(e) => setBusqueda(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-sm focus:outline-none"
          />
        </div>

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
            </tr>
          </thead>
          <tbody>
            {pedidosFiltrados.map((p) => (
              <tr key={p.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="py-2 px-3">{p.id}</td>
                <td className="py-2 px-3">{formatDate(p.fecha)}</td>
                <td className="py-2 px-3">{formatTime(p.hora)}</td>
                <td className="py-2 px-3">{p.cliente?.nombre ?? '—'}</td>
                <td className="py-2 px-3 text-right">{p.total?.toFixed(2) ?? '0.00'}</td>
                <td className="py-2 px-3 text-center">
                  {/* Aquí solo se muestra el estatus */}
                  <span
                    className={`font-semibold ${
                      p.estatus === 'pagado'
                        ? 'text-green-500'
                        : p.estatus === 'cancelado'
                        ? 'text-red-500'
                        : 'text-yellow-500'
                    }`}
                  >
                    {p.estatus}
                  </span>
                </td>
              </tr>
            ))}

            {/* Sin resultados */}
            {pedidosFiltrados.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-400">
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
