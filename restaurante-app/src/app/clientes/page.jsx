'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, UserPlus } from 'lucide-react';
import axios from 'axios';
import SidebarNavegacionAdmin from '@/components/SideBarNavegacionAdmin';
import SidebarNavegacionEmpleado from '@/components/SideBarNavegacionEmpleado';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState('');
  const [usuario, setUsuario] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Verificar si hay usuario logueado
    const userJson = localStorage.getItem('usuario');
    if (userJson) {
      const user = JSON.parse(userJson);
      setUsuario(user);
      if (user.rol === 'empleado') {
        // Si el usuario es un empleado, no debería acceder a esta página
        router.push('/pagina'); // Redirigir a una página accesible solo para empleados
      }
    } else {
      // Si no hay usuario logueado, redirigir a login
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/clientes')
      .then(res => setClientes(res.data))
      .catch(err => console.error('Error al cargar clientes:', err));
  }, []);

  const handleDelete = async id => {
    const confirm = window.confirm('¿Seguro que deseas eliminar este cliente?');
    if (!confirm) return;
    try {
      await axios.delete(`http://localhost:8080/api/clientes/${id}`);
      setClientes(clientes.filter(c => c.id !== id)); // Filtra y actualiza el estado
    } catch (err) {
      alert('❌ No se pudo eliminar.');
    }
  };

  const handleSearchChange = e => {
    setSearch(e.target.value);
  };

  const filteredClientes = clientes.filter(c =>
    c.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Sidebar con validación del rol */}
      {usuario?.rol === 'admin' ? <SidebarNavegacionAdmin /> : <SidebarNavegacionEmpleado />}

      <main className="ml-16 p-8">
        <h1 className="text-3xl font-bold mb-6">👥 Clientes</h1>

        <div className="flex justify-between mb-4">
          {/* Botón que ahora navega a la página de "Nuevo Cliente" */}
          <button
            onClick={() => router.push('/clientes/nuevo')}  // Redirige a la página de nuevo cliente
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded inline-flex items-center gap-2"
          >
            <UserPlus size={18} /> Nuevo Cliente
          </button>

          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-600 focus:outline-none"
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        <div className="overflow-x-auto rounded shadow-lg">
          <table className="min-w-full bg-gray-800 text-white">
            <thead className="bg-yellow-500 text-gray-900 font-bold">
              <tr>
                <th className="py-2 px-4 text-left">ID</th>
                <th className="py-2 px-4 text-left">Nombre</th>
                <th className="py-2 px-4 text-left">Teléfono</th>
                <th className="py-2 px-4 text-left">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredClientes.map(cliente => (
                <tr key={cliente.id} className="hover:bg-gray-700">
                  <td className="py-2 px-4">{cliente.id}</td>
                  <td className="py-2 px-4">{cliente.nombre}</td>
                  <td className="py-2 px-4">{cliente.telefono}</td>
                  <td className="py-2 px-4 flex gap-2">
                    {/* Botón de eliminación */}
                    <button
                      onClick={() => handleDelete(cliente.id)}
                      className="bg-red-500 hover:bg-red-600 p-2 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredClientes.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-400">
                    No hay clientes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
