'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';

export default function EditarProducto() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [form, setForm] = useState({
    nombre: '',
    tipo: '',
    precio: '',
  });

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/productos/${id}`);
        setForm(response.data);
      } catch (error) {
        alert('Error al obtener el producto');
      }
    };
    if (id) fetchProducto();
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/productos/${id}`, form);
      alert('Producto actualizado correctamente');
      router.push('/pagina/productos');
    } catch (error) {
      alert('Error al actualizar el producto');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1f2a37] p-4 text-white">
      <div className="w-full max-w-md bg-[#2b3748] rounded-xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Editar producto</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full rounded-md bg-gray-800 px-3 py-2 focus:outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Tipo</label>
            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              required
              className="w-full rounded-md bg-gray-800 px-3 py-2 focus:outline-none"
            >
              <option value="">Selecciona una opción</option>
              <option value="entrada">Entrada</option>
              <option value="plato_fuerte">Plato fuerte</option>
              <option value="bebida">Bebida</option>
              <option value="postre">Postre</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Precio</label>
            <input
              type="number"
              name="precio"
              value={form.precio}
              onChange={handleChange}
              step="0.01"
              required
              className="w-full rounded-md bg-gray-800 px-3 py-2 focus:outline-none"
            />
          </div>

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-500 hover:bg-gray-600"
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black">
              Guardar cambios
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
