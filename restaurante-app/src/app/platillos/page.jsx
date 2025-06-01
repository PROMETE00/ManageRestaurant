'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '@/components/SidebarNavegacion';

export default function Platillos() {
  const [productos, setProductos] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState('All');

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/productos')
      .then(res => setProductos(res.data))
      .catch(err => console.error('Error al cargar productos:', err));
  }, []);

  const categorias = ['All', ...new Set(productos.map(p => p.categoria))];

  const productosFiltrados =
    categoriaActiva === 'All' ? productos : productos.filter(p => p.categoria === categoriaActiva);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex relative">
      <Sidebar />

      <div className="flex-1 ml-16 px-8 py-10">
        {/* Tabs de Categoría */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {categorias.map((cat, i) => (
            <button
              key={i}
              onClick={() => setCategoriaActiva(cat)}
              className={`px-5 py-2 font-semibold rounded-full ${
                categoriaActiva === cat
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-green-500'
              } transition`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid de Platillos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {productosFiltrados.map(p => (
            <div key={p.id} className="bg-white text-gray-900 rounded-lg overflow-hidden shadow-lg">
              <img src={p.ruta_foto} alt={p.nombre} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{p.nombre}</h3>
                <p className="text-yellow-600 font-semibold mb-1">
                  ⭐ {p.calificacion || 'N/A'} <span className="text-sm text-gray-500">(500)</span>
                </p>
                <p className="text-sm text-gray-600 mb-2">03 piezas por porción</p>
                <p className="text-xl font-bold text-green-700">${p.precio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
