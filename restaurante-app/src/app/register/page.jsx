'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';

export default function Register() {
  const router = useRouter();

  // Estados para el formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rol, setRol] = useState('empleado');
  const [isNavigating, setIsNavigating] = useState(false);

  // Estado para el slider
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    // SLIDE 0: Imagen “Mesero y Administrador”
    {
      type: 'image',
      src: '/assets/ImagenesLogin/newe.png',
      alt: 'Mesero y Administrador saludando',
    },
    // SLIDE 1: Visión (imagen)
    {
      type: 'image',
      src: '/assets/ImagenesLogin/vision.png',
      alt: 'Imagen de Visión del Restaurante',
    },
    
    {
      type: 'image',
      src: '/assets/ImagenesLogin/mision.png',
      alt: 'Imagen de Misión del Restaurante',
    },
   
    // SLIDE 3: Reglas Básicas (imagen)
    {
      type: 'image',
      src: '/assets/ImagenesLogin/reglas1.png',
      alt: 'Cartel con Reglas Básicas del Restaurante',
    },

    // SLIDE 4: Bienvenida (imagen)
    {
      type: 'image',
      src: '/assets/ImagenesLogin/bienvenido.png',
      alt: 'Bienvenido al Restaurante, trabajadores saludando',
    },
    
  ];

  // Función para pasar a la siguiente diapositiva 
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // Función para retroceder a la diapositiva anterior 
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto‐desplazamiento: cambia de slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Manejo del registro
  const handleRegister = async (e) => {
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
      setIsNavigating(true);
      setTimeout(() => {
        router.push('/login');
      }, 500);
    } catch (error) {
      console.error(error);
      alert('❌ Error al registrar usuario');
    }
  };

  // Manejo de la navegación a Login con fade‐out
  const handleNavigateToLogin = (e) => {
    e.preventDefault();
    setIsNavigating(true);
    setTimeout(() => {
      router.push('/login');
    }, 500);
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black transition-opacity duration-500 ${
        isNavigating ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Imagen de fondo de toda la pantalla */}
      <Image
        src="/assets/ImagenesLogin/newe.png"
        alt="Fondo de comedor"
        fill
        className="object-cover opacity-70"
      />

      {/* Contenedor central: 900px ancho x 600px alto */}
      <div
        className="relative z-10 flex flex-row rounded-xl shadow-2xl overflow-hidden"
        style={{ width: '900px', height: '600px' }}
      >
        {/* ================================
            PANEL IZQUIERDO: SLIDER (450px de ancho)
            ================================ */}
        <div className="relative h-full w-[450px] bg-gray-900">
          {/* Botón “Anterior” */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 z-20"
            aria-label="Anterior"
          >
            ‹
          </button>

          {/* Contenedor relativo para que <Image fill> cubra todo el espacio */}
          <div className="relative h-full w-full">
            {slides[currentSlide].type === 'image' ? (
              <Image
                src={slides[currentSlide].src}
                alt={slides[currentSlide].alt}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white text-center">
                <h3 className="text-2xl font-semibold">{slides[currentSlide].title}</h3>
                <p className="whitespace-pre-line mt-4">{slides[currentSlide].content}</p>
              </div>
            )}
          </div>

          {/* Botón “Siguiente” */}
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 z-20"
            aria-label="Siguiente"
          >
            ›
          </button>

          {/* Indicadores (puntos) */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {slides.map((_, idx) => (
              <span
                key={idx}
                className={`block h-2 w-2 rounded-full ${
                  idx === currentSlide ? 'bg-white' : 'bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>

        {/* ================================
            PANEL DERECHO: FORMULARIO DE REGISTRO (450px de ancho)
            ================================ */}
        <div className="w-[450px] bg-[#1a1e2a] text-white flex flex-col justify-center px-12">
          <h2 className="text-4xl font-bold mb-6 text-center">Registro</h2>
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-300">
                Nombre
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="mt-1 block w-full rounded-md bg-gray-800 px-3 py-2 text-base text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-600"
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
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="mt-1 block w-full rounded-md bg-gray-800 px-3 py-2 text-base text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-600"
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
                className="mt-1 block w-full rounded-md bg-gray-800 px-3 py-2 text-base text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-600"
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
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-md bg-gray-800 px-3 py-2 text-base text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-600"
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
                onChange={(e) => setRol(e.target.value)}
                required
                className="mt-1 block w-full rounded-md bg-gray-800 px-3 py-2 text-base text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-600"
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

          <p className="mt-6 text-center text-gray-400">
            ¿Ya tienes cuenta?{' '}
            <a
              href="#"
              onClick={handleNavigateToLogin}
              className="text-orange-600 font-semibold cursor-pointer"
            >
              Iniciar sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}