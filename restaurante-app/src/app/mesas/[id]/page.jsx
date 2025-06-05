'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import SidebarNavegacionAdmin from '@/components/SideBarNavegacionAdmin';
import SidebarNavegacionEmpleado from '@/components/SideBarNavegacionEmpleado';
import { FaTrash, FaRegEdit } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

/* ───────── Helpers ───────── */
const ESTADOS = ['libre', 'reservada', 'ocupada', 'atendida'];
const colorEstado = (e) =>
  e === 'ocupada'
    ? 'text-red-400'
    : e === 'reservada'
    ? 'text-yellow-400'
    : e === 'atendida'
    ? 'text-blue-400'
    : 'text-green-400';

const nice = (t) => (t ? t.charAt(0).toUpperCase() + t.slice(1) : '');

/* ───────── Axios instance ───────── */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

export default function MesaPage() {
  const { id } = useParams();
  const router = useRouter();

  const [mesa, setMesa] = useState(null);
  const [meseros, setMeseros] = useState([]);
  const [productos, setProductos] = useState([]);
  const [usuario, setUsuario] = useState(null);

  /* ───────── Edición in-place ───────── */
  const [editEstado, setEditEstado] = useState(false);
  const [editMesero, setEditMesero] = useState(false);
  const [estadoSel, setEstadoSel] = useState('');
  const [meseroSel, setMeseroSel] = useState('');

  /* ───────── Fetch inicial ───────── */
  const loadMesa = () =>
    api.get(`/mesas/${id}`).then((r) => {
      setMesa(r.data);
      setEstadoSel(r.data.estado ?? 'libre');
    });

  useEffect(() => {
    loadMesa();
    api.get('/meseros').then((r) => setMeseros(r.data));
    api.get(`/mesas/${id}/productos`).then((r) => setProductos(r.data));

    // Cargar usuario desde localStorage
    const userJson = localStorage.getItem('usuario');
    if (userJson) {
      const user = JSON.parse(userJson);
      if (user.rol !== 'admin' && user.rol !== 'empleado') {
        alert('❌ Acceso denegado. Solo administradores y empleados pueden acceder.');
        router.push('/login');
      } else {
        setUsuario(user);
      }
    } else {
      router.push('/login');
    }
  }, [id, router]);

  /* ───────── Totales ───────── */
  const total = productos.reduce((s, p) => s + (p.precio ?? 0), 0).toFixed(2);

  /* ───────── Acciones ───────── */
  const guardarEstado = async () => {
    try {
      await api.patch(`/mesas/${id}`, { estado: estadoSel });
      setMesa((prev) => ({ ...prev, estado: estadoSel }));
      setEditEstado(false);
    } catch {
      alert('Error cambiando estado');
    }
  };

  const guardarMesero = async () => {
    if (!meseroSel) return;
    try {
      await api.post(`/mesas/${id}/meseros`, { meseroId: Number(meseroSel) });
      const mesero = meseros.find((x) => x.id === Number(meseroSel));
      setMesa((prev) => ({ ...prev, mesero }));
      setEditMesero(false);
    } catch {
      alert('Error asignando mesero');
    }
  };

  const quitarProducto = async (pid) => {
    try {
      await api.delete(`/mesas/${id}/productos/${pid}`);
      setProductos((prev) => prev.filter((p) => p.id !== pid));
    } catch {
      alert('Error quitando producto');
    }
  };

  if (!mesa)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1f2a37]">
        <p className="text-white text-lg">Cargando…</p>
      </div>
    );

  /* ───────── Sidebar dinámico según rol ───────── */
  const Sidebar = usuario?.rol === 'admin' ? SidebarNavegacionAdmin : SidebarNavegacionEmpleado;

  return (
    <div className="min-h-screen bg-[#1f2a37] text-white flex">
      {/* Sidebar dinámico */}
      <Sidebar />

      <div className="flex-1 ml-24 grid md:grid-cols-2 gap-8 p-8">
        {/* ◤ Panel datos mesa ◢ */}
        <section className="bg-[#2c3a4a] rounded-2xl shadow-2xl p-8 space-y-6 transition-shadow duration-300 hover:shadow-black/40">
          <h1 className="text-4xl font-extrabold mb-4 text-center">
            Mesa <span className="text-sky-300">#{mesa.numero}</span>
          </h1>

          {/* Datos simples */}
          <div className="space-y-4 text-sm">
            <p className="flex justify-between items-center">
              <span className="font-semibold">Capacidad:</span>
              <span className="text-base">{mesa.capacidad} personas</span>
            </p>
            <p className="flex justify-between items-center">
              <span className="font-semibold">Ubicación:</span>
              <span className="text-base text-sky-300">{nice(mesa.ubicacion)}</span>
            </p>

            {/* Estado (editable) */}
            <div className="flex justify-between items-center">
              <span className="font-semibold">Estado:</span>
              {editEstado ? (
                <div className="flex items-center gap-2">
                  <select
                    value={estadoSel}
                    onChange={(e) => setEstadoSel(e.target.value)}
                    className="rounded-md bg-gray-800 px-3 py-1 text-white text-sm transition-colors duration-200 focus:ring focus:ring-sky-500"
                  >
                    {ESTADOS.map((e) => (
                      <option key={e} value={e}>
                        {nice(e)}
                      </option>
                    ))}
                  </select>
                  <Button
                    size="sm"
                    onClick={guardarEstado}
                    className="bg-yellow-400 hover:bg-yellow-300 text-black transition-transform transform hover:scale-105"
                  >
                    ✔
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEstadoSel(mesa.estado ?? 'libre');
                      setEditEstado(false);
                    }}
                    className="border-gray-500 text-gray-300 hover:bg-gray-700 transition-colors duration-200"
                  >
                    ✕
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className={`${colorEstado(mesa.estado)} font-medium`}>
                    {nice(mesa.estado)}
                  </span>
                  <button
                    onClick={() => setEditEstado(true)}
                    className="text-gray-400 hover:text-gray-200 transition-colors duration-200"
                  >
                    <FaRegEdit size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Mesero (editable) */}
            <div className="flex justify-between items-center">
              <span className="font-semibold">Mesero:</span>
              {editMesero ? (
                <div className="flex items-center gap-2">
                  <select
                    value={meseroSel}
                    onChange={(e) => setMeseroSel(e.target.value)}
                    className="rounded-md bg-gray-800 px-3 py-1 text-white text-sm transition-colors duration-200 focus:ring focus:ring-sky-500"
                  >
                    <option value="">— Selecciona —</option>
                    {meseros.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nombre}
                      </option>
                    ))}
                  </select>
                  <Button
                    size="sm"
                    onClick={guardarMesero}
                    disabled={!meseroSel}
                    className={`bg-yellow-400 hover:bg-yellow-300 text-black transition-transform transform hover:scale-105 ${
                      !meseroSel ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    ✔
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setMeseroSel('');
                      setEditMesero(false);
                    }}
                    className="border-gray-500 text-gray-300 hover:bg-gray-700 transition-colors duration-200"
                  >
                    ✕
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-base">{mesa.mesero?.nombre ?? '—'}</span>
                  <button
                    onClick={() => setEditMesero(true)}
                    className="text-gray-400 hover:text-gray-200 transition-colors duration-200"
                  >
                    <FaRegEdit size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-500 transition-colors duration-200 transform hover:scale-[1.02] py-4 text-lg font-semibold"
              onClick={() => router.push(`/mesas/${id}/productos`)}
            >
              Agregar productos
            </Button>
            <Button
              variant="outline"
              className="w-full border-gray-500 text-gray-300 hover:bg-gray-700 transition-colors duration-200 py-3"
              onClick={() => router.back()}
            >
              Volver
            </Button>
          </div>
        </section>

        {/* ◤ Ticket ◢ */}
        <section className="bg-[#2c3a4a] rounded-2xl shadow-2xl p-8 flex flex-col transition-shadow duration-300 hover:shadow-black/40">
          <h2 className="text-3xl font-bold mb-6 text-center">Ticket</h2>

          {productos.length === 0 ? (
            <p className="text-gray-400 text-center mt-8">Sin productos aún</p>
          ) : (
            <ul className="flex-1 overflow-y-auto space-y-3 pr-2">
              {productos.map((p) => (
                <li
                  key={p.id}
                  className="flex justify-between items-center bg-gray-800 hover:bg-gray-700 transition-colors duration-200 px-5 py-3 rounded-lg"
                >
                  <span className="truncate text-base font-medium max-w-[60%]">
                    {p.nombre}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-green-400 font-semibold">${p.precio}</span>
                    <button
                      onClick={() => quitarProducto(p.id)}
                      className="text-red-400 hover:text-red-300 transition-colors duration-200"
                      title="Quitar producto"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="pt-6 border-t border-gray-700 mt-6 flex justify-between items-center">
            <span className="font-semibold text-xl">
              Total:{' '}
              <span className="text-green-400">${total}</span>
            </span>
            <Button
              className="bg-purple-600 hover:bg-purple-500 transition-colors duration-200 transform hover:scale-[1.02] py-2 px-6 text-base font-medium"
              onClick={() => {
                const url =
                  `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api'}` +
                  `/mesas/${id}/ticket`;
                window.open(url, '_blank');
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
