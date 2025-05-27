'use client'

import { useEffect, useState } from 'react'

export default function ListaMeseros() {
  const [meseros, setMeseros] = useState([])

  useEffect(() => {
    fetch('http://localhost:8080/api/meseros')
      .then(res => res.json())
      .then(data => setMeseros(data))
      .catch(err => console.error('Error al obtener meseros:', err))
  }, [])

  return (
    <div className="min-h-screen p-6 bg-[#1f2a37] text-white">
      <h1 className="text-2xl font-bold mb-4">Lista de Meseros</h1>
      <ul className="space-y-2">
        {meseros.map(m => (
          <li key={m.id} className="bg-gray-800 p-4 rounded-md shadow">
            <div><strong>{m.nombre}</strong> — Turno: {m.turno}</div>
            <div>Sexo: {m.sexo} | Salario: ${m.salario}</div>
            <div>Nacimiento: {m.fechaNacimiento}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
