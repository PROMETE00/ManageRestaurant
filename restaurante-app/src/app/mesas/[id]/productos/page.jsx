'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import SidebarNavegacionAdmin from '@/components/SideBarNavegacionAdmin';
import SidebarNavegacionEmpleado from '@/components/SideBarNavegacionEmpleado';
import { Button } from '@/components/ui/button';
import { FaTrash } from 'react-icons/fa';

/* ---------- helpers ---------- */
const buildSrc = ruta =>
  !ruta ? '/placeholder.jpg' : ruta.startsWith('http') ? ruta : '/' + ruta.replace(/^\/+/, '');

const nice = t => (t ? t.charAt(0).toUpperCase() + t.slice(1) : '');

/* ---------- page component ---------- */
export default function MesaProductosPage() {
  const { id } = useParams(); // mesa id (string)
  const router = useRouter();

  const [productos, setProductos] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState(0);
  const [mesaItems, setMesaItems] = useState([]); // array de MenuMesaDTO
  const [usuario, setUsuario] = useState(null);

  /* --- catálogo completo --- */
  useEffect(() => {
    axios.get('http://localhost:8080/api/productos').then(r => setProductos(r.data));
  }, []);

  /* --- productos ya asignados a la mesa --- */
  const fetchMesaItems = () =>
    axios
      .get(`http://localhost:8080/api/mesas/${id}/productos`)
      .then(r => setMesaItems(r.data))
      .catch(err => console.error(err));

  useEffect(() => {
    fetchMesaItems();
  }, [id]);

  /* --- categorías únicas del catálogo --- */
  const categorias = useMemo(() => {
    const map = new Map();
    productos.forEach(p => p.categoria && map.set(p.categoria.id, p.categoria));
    return [{ id: 0, nombre: 'All' }, ...Array.from(map.values())];
  }, [productos]);

  const filtrados =
    categoriaActiva === 0
      ? productos
      : productos.filter(p => p.categoria?.id === categoriaActiva);

  /* --- agregar producto --- */
  const add = async prodId => {
    try {
      const { data } = await axios.post(
        `http://localhost:8080/api/mesas/${id}/productos`,
        { productoId: prodId },
        { headers: { 'Content-Type': 'application/json' } },
      );
      setMesaItems(prev => [...prev, data]);
    } catch {
      alert('No se pudo agregar');
    }
  };

  /* --- quitar producto --- */
  const delItem = async menuMesaId => {
    try {
      await axios.delete(`http://localhost:8080/api/mesas/${id}/productos/${menuMesaId}`);
      setMesaItems(prev => prev.filter(x => x.id !== menuMesaId));
    } catch {
      alert('No se pudo quitar');
    }
  };

  /* --- total --- */
  const total = useMemo(
    () => mesaItems.reduce((s, it) => s + (it.precio ?? 0), 0).toFixed(2),
    [mesaItems],
  );

  /* --- protección de ruta y validación de usuario --- */
  useEffect(() => {
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
  }, [router]);

  /* --- Sidebar dinámico según rol --- */
  const Sidebar = usuario?.rol === 'admin' ? SidebarNavegacionAdmin : SidebarNavegacionEmpleado;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* sidebar dinámico */}
      <Sidebar />

      <div className="flex-1 ml-24 flex">
        {/* panel izquierdo: productos de la mesa */}
        <aside className="w-72 bg-[#2b3748] px-4 py-6 space-y-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Mesa #{id}</h2>

          {mesaItems.length === 0 ? (
            <p className="text-gray-400 text-sm">Sin productos aún</p>
          ) : (
            <ul className="space-y-2">
              {mesaItems.map(it => (
                <li
                  key={it.id}
                  className="flex justify-between bg-gray-800 px-3 py-2 rounded items-center"
                >
                  <span className="text-sm truncate max-w-[140px]">
                    {it.nombre}{' '}
                    <span className="text-gray-400 text-xs">(${it.precio})</span>
                  </span>

                  <button
                    onClick={() => delItem(it.id)}
                    className="text-red-400 hover:text-red-300 p-1"
                    title="Quitar"
                  >
                    <FaTrash size={12} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="pt-4 border-t border-gray-700 text-right font-semibold">
            Total:{' '}
            <span className="text-green-400">${total}</span>
          </div>

          <Button
            variant="outline"
            onClick={() => router.back()}
            className="w-full mt-4 border-gray-400 text-gray-300 hover:bg-gray-700"
          >
            Volver
          </Button>
        </aside>

        {/* catálogo */}
        <main className="flex-1 px-10 py-8">
          {/* Tabs de categoría */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {categorias.map(c => (
              <button
                key={c.id}
                onClick={() => setCategoriaActiva(c.id)}
                className={`px-5 py-2 font-semibold rounded-full ${
                  categoriaActiva === c.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-green-500'
                } transition`}
              >
                {c.nombre}
              </button>
            ))}
          </div>

          {/* Grid de productos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filtrados.map(p => (
              <div
                key={p.id}
                className="bg-white text-gray-900 rounded-lg overflow-hidden shadow-lg flex flex-col"
              >
                <img
                  src={buildSrc(p.rutaFoto)}
                  alt={p.nombre}
                  className="w-full aspect-[4/3] object-cover"
                  loading="lazy"
                />

                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-lg">{p.nombre}</h3>
                  <p className="text-sm text-gray-600 flex-1 mt-1">{nice(p.categoria?.nombre)}</p>
                  <p className="text-xl font-bold text-green-700 mb-3">${p.precio}</p>

                  <Button
                    onClick={() => add(p.id)}
                    className="bg-yellow-500 hover:bg-yellow-400"
                  >
                    Agregar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
