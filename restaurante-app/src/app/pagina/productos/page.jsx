'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import axios from 'axios';

export default function ListaProductos() {
  const router = useRouter();
  const [productos, setProductos] = useState([]);

  const obtenerProductos = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/productos');
      setProductos(response.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  const eliminarProducto = async id => {
    if (!confirm('¿Seguro que deseas eliminar este producto?')) return;

    try {
      await axios.delete(`http://localhost:8080/api/productos/${id}`);
      alert('Producto eliminado');
      obtenerProductos();
    } catch (error) {
      alert('Error al eliminar producto');
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  return (
    <div className="p-10 bg-[#1f2a37] min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Menú del Restaurante</h1>
        <Button
          onClick={() => router.push('/pagina/productos/nuevo')}
          className="bg-yellow-500 text-black"
        >
          + Agregar Producto
        </Button>
      </div>

      <table className="w-full table-auto bg-[#2b3748] rounded-xl overflow-hidden shadow-lg">
        <thead className="bg-gray-800 text-yellow-400">
          <tr>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-left">Tipo</th>
            <th className="px-4 py-2 text-left">Precio</th>
            <th className="px-4 py-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(producto => (
            <tr key={producto.id} className="border-b border-gray-700">
              <td className="px-4 py-2">{producto.nombre}</td>
              <td className="px-4 py-2 capitalize">{producto.tipo}</td>
              <td className="px-4 py-2">${producto.precio.toFixed(2)}</td>
              <td className="px-4 py-2 space-x-2">
                <Button
                  onClick={() => router.push(`/pagina/productos/editar/${producto.id}`)}
                  className="bg-blue-500 text-white"
                >
                  Editar
                </Button>
                <Button
                  onClick={() => eliminarProducto(producto.id)}
                  className="bg-red-600 text-white"
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
          {productos.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-400">
                No hay productos registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
