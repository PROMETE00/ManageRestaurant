'use client';

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import SidebarNavegacionAdmin from '@/components/SideBarNavegacionAdmin'; // Sidebar Admin
import SidebarNavegacionEmpleado from '@/components/SideBarNavegacionEmpleado'; // Sidebar Empleado
import { useRouter } from 'next/navigation';

/* ─────────────────────────────
   Helper: construye la URL segura
───────────────────────────────*/
const buildSrc = (ruta) => {
  if (!ruta) return '/placeholder.jpg'; // sin imagen → placeholder
  if (ruta.startsWith('http')) return ruta; // URL completa (CDN, backend)
  return '/' + ruta.replace(/^\/+/, '');
};

export default function Platillos() {
  const [productos, setProductos] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState(0); // 0 = All
  const [usuario, setUsuario] = useState(null); // Almacenamos el usuario
  const router = useRouter();

  // Cargar usuario desde localStorage
  useEffect(() => {
    const userJson = localStorage.getItem('usuario');
    if (userJson) {
      const user = JSON.parse(userJson);
      if (user.rol !== 'admin' && user.rol !== 'empleado') {
        // Si el usuario no tiene un rol válido, lo redirigimos
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

  // Cargar productos desde la API
  useEffect(() => {
    axios
      .get('http://localhost:8080/api/productos')
      .then((res) => setProductos(res.data))
      .catch((err) => console.error('Error al cargar productos:', err));
  }, []);

  // Construir lista única de categorías
  const categorias = useMemo(() => {
    const mapa = new Map(); // key = id, value = { id, nombre }
    productos.forEach((p) => {
      const c = p.categoria;
      if (c && !mapa.has(c.id)) mapa.set(c.id, c);
    });
    return [{ id: 0, nombre: 'All' }, ...Array.from(mapa.values())];
  }, [productos]);

  // Filtrar productos
  const productosFiltrados =
    categoriaActiva === 0 ? productos : productos.filter((p) => p.categoria?.id === categoriaActiva);

  // Mostrar sidebar según el rol del usuario
  const Sidebar = usuario?.rol === 'admin' ? SidebarNavegacionAdmin : SidebarNavegacionEmpleado;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex relative">
      {/* Sidebar de admin o empleado */}
      <Sidebar />

      <div className="flex-1 ml-16 px-8 py-10">
        {/* Tabs de Categoría */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {categorias.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoriaActiva(cat.id)}
              className={`px-5 py-2 font-semibold rounded-full ${
                categoriaActiva === cat.id
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-green-500'
              } transition`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>

        {/* Grid de Platillos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {productosFiltrados.map((p) => (
            <div
              key={p.id}
              className="bg-white text-gray-900 rounded-lg overflow-hidden shadow-lg flex flex-col"
            >
              {/* Imagen con proporción 4:3, no deformada */}
              <img
                src={buildSrc(p.rutaFoto)}
                alt={p.nombre}
                className="w-full aspect-[4/3] object-cover"
                loading="lazy"
              />

              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-lg mb-1">{p.nombre}</h3>

                <p className="text-yellow-600 font-semibold mb-1">
                  ⭐ {p.calificacion ?? 'N/A'}{' '}
                  <span className="text-sm text-gray-500">(500)</span>
                </p>

                <p className="text-sm text-gray-600 mb-2 flex-1">
                  03 piezas por porción
                </p>

                <p className="text-xl font-bold text-green-700">${p.precio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
