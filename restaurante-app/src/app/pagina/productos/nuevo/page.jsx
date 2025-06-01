'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import axios from 'axios';

export default function NuevoProducto() {
  const router = useRouter();

  const [producto, setProducto] = useState({
    nombre: '',
    tipo: 'comida',
    precio: '',
  });

  const handleChange = e => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:8080/api/productos', {
        nombre: producto.nombre,
        tipo: producto.tipo,
        precio: parseFloat(producto.precio),
      });

      alert('✅ Producto creado correctamente');
      router.push('/pagina');
    } catch (err) {
      console.error('❌ Error al crear producto:', err);
      alert('Error al crear producto');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1f2a37] p-4">
      <div className="w-full max-w-md bg-[#2b3748] rounded-xl shadow-xl p-8 text-white">
        <h1 className="text-2xl font-bold text-center mb-6">Nuevo Producto</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre */}
          <div>
            <label className="block mb-1 text-sm font-medium">Nombre del producto</label>
            <input
              type="text"
              name="nombre"
              value={producto.nombre}
              onChange={handleChange}
              required
              className="w-full rounded-md bg-gray-800 px-3 py-2"
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="block mb-1 text-sm font-medium">Tipo</label>
            <select
              name="tipo"
              value={producto.tipo}
              onChange={handleChange}
              className="w-full rounded-md bg-gray-800 px-3 py-2"
            >
              <option value="comida">Comida</option>
              <option value="bebida">Bebida</option>
              <option value="postre">Postre</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          {/* Precio */}
          <div>
            <label className="block mb-1 text-sm font-medium">Precio ($)</label>
            <input
              type="number"
              name="precio"
              min="0"
              step="0.01"
              value={producto.precio}
              onChange={handleChange}
              required
              className="w-full rounded-md bg-gray-800 px-3 py-2"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-500 hover:bg-gray-600"
            >
              Cancelar
            </Button>

            <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600">
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
