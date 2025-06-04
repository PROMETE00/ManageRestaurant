'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
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

  const handleRegister = (e) => {
    e.preventDefault();
    setIsNavigating(true);
    // La transición de Tailwind dura 500 ms; después redirige:
    setTimeout(() => {
      router.push('/register');
    }, 500);
  };

  return (
    // Div principal que cubre toda la pantalla y tiene la transición de opacidad
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black transition-opacity duration-500 ${
        isNavigating ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Imagen de fondo en toda la pantalla */}
      <Image
        src="/assets/ImagenesLogin/fondococina.png"
        alt="Food Background"
        fill
        className="object-cover opacity-70"
      />

      {/* Contenedor principal (login + imagen lateral) */}
      <div
        className="relative z-10 flex flex-row rounded-xl shadow-2xl overflow-hidden"
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

        {/* Formulario de login */}
        <div className="w-[400px] bg-[#1a1e2a] text-white flex flex-col justify-center px-12">
          {/* Icono de chef arriba y mensaje de bienvenida */}
          <div className="flex flex-col items-center mb-6">
            <Image
              src="/assets/ImagenesLogin/chef1.png"
              alt="Chef Icon"
              width={94}
              height={94}
              className="mb-4"
            />
            <h2 className="text-3xl font-bold text-center">Bienvenido nuevamente</h2>
            <p className="text-gray-300 text-center mt-2">Por favor, inicie sesión</p>
          </div>

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
                onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="block w-full rounded-md bg-gray-800 px-3 py-2 text-base text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-600"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-orange-600 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-600"
            >
              Iniciar sesión
            </button>
          </form>

          <p className="mt-8 text-center text-gray-400">
            ¿No tienes cuenta?{' '}
            <a
              href="#"
              onClick={handleRegister}
              className="text-orange-600 font-semibold cursor-pointer"
            >
              Registrarse
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
