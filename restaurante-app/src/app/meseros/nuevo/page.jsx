'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function NuevoMesero() {
  const router = useRouter();

  const [form, setForm] = useState({
    nombre: '',
    sexo: 'M',
    fechaNacimiento: '',
    turno: '',
    salario: '',
  });

  const [usuario, setUsuario] = useState(null);

  // Verificación de si el usuario está logueado y es admin
  useEffect(() => {
    const userJson = localStorage.getItem('usuario');
    if (userJson) {
      const user = JSON.parse(userJson);
      if (user.rol !== 'admin') {
        alert('❌ No tienes permiso para acceder a esta página.');
        router.push('/login');
      } else {
        setUsuario(user);
      }
    } else {
      router.push('/login');  // Redirige a login si no está logueado
    }
  }, [router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/meseros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        alert('Mesero registrado correctamente');
        router.push('/meseros');
      } else {
        alert('Error al registrar mesero');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión con el servidor');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-[#1f2a37] text-white">
      <h1 className="text-2xl font-bold mb-4">Registrar Mesero</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          required
          className="w-full p-2 rounded bg-gray-700"
        />
        <select
          name="sexo"
          value={form.sexo}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-700"
        >
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
        </select>
        <input
          type="date"
          name="fechaNacimiento"
          value={form.fechaNacimiento}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-700"
        />
        <input
          type="text"
          name="turno"
          value={form.turno}
          onChange={handleChange}
          placeholder="Turno"
          className="w-full p-2 rounded bg-gray-700"
        />
        <input
          type="number"
          name="salario"
          value={form.salario}
          onChange={handleChange}
          placeholder="Salario"
          className="w-full p-2 rounded bg-gray-700"
        />

        <div className="flex justify-between mt-4">
          <Button type="button" onClick={() => router.back()} className="bg-gray-600">
            Cancelar
          </Button>
          <Button type="submit" className="bg-yellow-500 text-black">
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
}
