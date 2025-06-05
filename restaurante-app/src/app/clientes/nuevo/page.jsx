'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function NuevoCliente() {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [usuario, setUsuario] = useState(null);
  const router = useRouter();

  // Validación de usuario para acceso restringido
  useEffect(() => {
    const userJson = localStorage.getItem('usuario');
    if (userJson) {
      const user = JSON.parse(userJson);
      if (user.rol !== 'admin') {
        // Si el usuario no es admin, redirigir a otra página
        alert('❌ Acceso denegado. Solo los administradores pueden agregar clientes.');
        router.push('/pagina'); // Redirige a otra página
      } else {
        setUsuario(user);
      }
    } else {
      // Si no hay usuario logueado, redirigir a login
      alert('Por favor, inicia sesión.');
      router.push('/login'); // Redirige a login si no hay usuario
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setErrorMessage(''); // Resetear el mensaje de error
      await axios.post('http://localhost:8080/api/clientes', { nombre, telefono });
      alert('Cliente agregado correctamente');
      router.push('/clientes');  // Redirige a la lista de clientes
    } catch (error) {
      console.error('Error al agregar cliente', error);
      setErrorMessage('❌ Error al agregar cliente. Intenta de nuevo.');
    }
  };

  if (!usuario) {
    return null; // Evitar renderizar la página si el usuario no está validado
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-700 to-blue-700 text-white p-8 flex items-center justify-center">
      <div className="w-full max-w-lg bg-[#2c3e50] p-8 rounded-xl shadow-xl transform transition-transform hover:scale-105">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-yellow-400">Nuevo Cliente</h1>

        {errorMessage && (
          <div className="text-red-500 text-center mb-4">
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-200">Nombre:</label>
            <input
              type="text"
              className="bg-gray-800 text-white p-3 rounded-md w-full focus:ring-2 focus:ring-blue-500"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-200">Teléfono:</label>
            <input
              type="text"
              className="bg-gray-800 text-white p-3 rounded-md w-full focus:ring-2 focus:ring-blue-500"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
          </div>

          <div className="flex space-x-4 mt-6">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-md text-white transition-all duration-300 transform hover:scale-105"
            >
              Agregar Cliente
            </button>
            <button
              type="button"
              onClick={() => router.push('/clientes')}
              className="w-full bg-gray-600 hover:bg-gray-500 py-3 rounded-md text-white transition-all duration-300 transform hover:scale-105"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
