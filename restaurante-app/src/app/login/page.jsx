'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isNavigating, setIsNavigating] = useState(false); // Estado para animación
  const router = useRouter();

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/usuarios/login', {
        email,
        password,
      });

      const usuario = response.data;
      localStorage.setItem('usuario', JSON.stringify(usuario));

      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Email o contraseña incorrectos');
    }
  };

  // Manejo de la navegación a Registro con fade‐out
  const handleNavigateToRegister = (e) => {
    e.preventDefault();
    setIsNavigating(true); // Activar animación de transición
    setTimeout(() => {
      router.push('/register'); // Redirigir a la página de registro
    }, 500); // El retraso de 500ms corresponde al fade-out
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black relative">
      <Image
        src="/assets/ImagenesLogin/fondococina.png"
        alt="Food Background"
        fill
        className="object-cover opacity-70"
      />

      {/* Contenedor principal con fade-out */}
      <div
        className={`relative z-10 flex flex-row rounded-xl shadow-2xl overflow-hidden ${isNavigating ? 'opacity-0 transition-opacity duration-500' : ''}`}
        style={{ height: '600px' }}
      >
        {/* Imagen lateral */}
        <div className="h-full w-[500px]">
          <Image
            src="/assets/ImagenesLogin/meseroyadmin.png"
            alt="Food"
            width={500}
            height={600}
            className="object-cover h-full w-full"
          />
        </div>

        {/* Login */}
        <div className="w-[400px] bg-[#1a1e2a] text-white flex flex-col justify-center px-12">
          <h2 className="text-4xl font-bold mb-8 text-center">Login</h2>
          <form onSubmit={handleLogin} className="space-y-6">
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
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="block w-full rounded-md bg-gray-800 px-3 py-2 text-base text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-orange-600 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-600"
            >
              Sign in
            </button>
          </form>

          <p className="mt-8 text-center text-gray-400">
            No tienes cuenta?{' '}
            <Link
              href="/register"
              onClick={handleNavigateToRegister} // Añadimos el evento de clic aquí
              className="text-orange-600 font-semibold"
            >
              Registrarse
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
