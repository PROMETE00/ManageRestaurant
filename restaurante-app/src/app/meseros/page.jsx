'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SidebarNavegacionAdmin from '@/components/SideBarNavegacionAdmin'; // Sidebar Admin
import SidebarNavegacionEmpleado from '@/components/SideBarNavegacionEmpleado'; // Sidebar Empleado

export default function ListaMeseros() {
  const [meseros, setMeseros] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const router = useRouter();

  // Validación de usuario logueado y roles
  useEffect(() => {
    const userJson = localStorage.getItem('usuario');
    if (userJson) {
      const user = JSON.parse(userJson);
      if (user.rol !== 'admin' && user.rol !== 'empleado') {
        // Si el rol no es admin o empleado, redirigir
        alert('❌ Acceso denegado. Solo administradores y empleados pueden acceder.');
        router.push('/login'); // Redirige a login
      } else {
        setUsuario(user);
      }
    } else {
      // Si no hay usuario logueado, redirigir a login
      router.push('/login');
    }
  }, [router]);

  // Cargar lista de meseros
  useEffect(() => {
    fetch('http://localhost:8080/api/meseros')
      .then(res => res.json())
      .then(data => setMeseros(data))
      .catch(err => console.error('Error al obtener meseros:', err));
  }, []);

  // Sidebar dinámico según el rol del usuario
  const Sidebar = usuario?.rol === 'admin' ? SidebarNavegacionAdmin : SidebarNavegacionEmpleado;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar dinámico */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="ml-16 flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-8 text-yellow-400">Lista de Meseros</h1>

        <ul className="space-y-6">
          {meseros.map((m) => (
            <li key={m.id} className="bg-gray-800 p-6 rounded-lg shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="flex justify-between items-center mb-3">
                <div className="font-semibold text-lg text-green-400">{m.nombre}</div>
                <div className="text-sm text-gray-500">{m.turno}</div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">Sexo: {m.sexo}</div>
                <div className="text-sm text-gray-400">Salario: ${m.salario}</div>
              </div>

              <div className="mt-2 text-sm text-gray-500">Nacimiento: {m.fechaNacimiento}</div>
            </li>
          ))}
          {meseros.length === 0 && (
            <li className="bg-gray-800 p-6 rounded-lg shadow-lg text-center text-gray-400">
              No hay meseros disponibles.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
