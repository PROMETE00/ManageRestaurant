'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rol, setRol] = useState('empleado'); // valor por defecto

  const handleRegister = async e => {
    e.preventDefault();

    if (!nombre || !email || !password || !confirmPassword || !rol) {
      alert('❌ Todos los campos son obligatorios.');
      return;
    }

    if (password !== confirmPassword) {
      alert('❌ Las contraseñas no coinciden.');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/usuarios', {
        nombre,
        email,
        password,
        rol,
      });

      alert('✅ Registro exitoso');
      router.push('/login');
    } catch (error) {
      console.error(error);
      alert('❌ Error al registrar usuario');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black relative">
      <Image
        src="/assets/ImagenesLogin/comidaRapida.png"
        alt="Fondo de comida"
        fill
        className="object-cover opacity-70"
      />

      <div
        className="relative z-10 flex flex-row rounded-xl shadow-2xl overflow-hidden"
        style={{ height: '750px' }}
      >
        <div className="w-[400px] bg-[#1a1e2a] text-white flex flex-col justify-center px-12">
          <h2 className="text-4xl font-bold mb-8 text-center">Registro</h2>
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-300">
                Nombre
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                required
                className="block w-full rounded-md bg-gray-800 px-3 py-2 text-base text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="block w-full rounded-md bg-gray-800 px-3 py-2 text-base text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="block w-full rounded-md bg-gray-800 px-3 py-2 text-base text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className="block w-full rounded-md bg-gray-800 px-3 py-2 text-base text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
            </div>

            <div>
              <label htmlFor="rol" className="block text-sm font-medium text-gray-300">
                Rol
              </label>
              <select
                id="rol"
                name="rol"
                value={rol}
                onChange={e => setRol(e.target.value)}
                required
                className="block w-full rounded-md bg-gray-800 px-3 py-2 text-base text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-600"
              >
                <option value="admin">Administrador</option>
                <option value="empleado">Empleado</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-orange-600 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-600"
            >
              Crear cuenta
            </button>
          </form>

          <p className="mt-8 text-center text-gray-400">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-orange-600 font-semibold">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
