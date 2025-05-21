import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import treeIcon from '@/assets/icons/tree-svgrepo-com.svg';
import umbrellaIcon from '@/assets/icons/umbrella-sea-svgrepo-com.svg';
import chairIcon from '@/assets/icons/chair-svgrepo-com.svg';


const DashboardRestaurante = () => {
  const navigate = useNavigate();

  const reservas = [
    { hora: '13:30h', pax: 5, mesa: 3, zona: 'Comedor', nombre: 'Luis' },
    { hora: '15:00h', pax: 4, mesa: 5, zona: 'Comedor', nombre: 'Ana' },
    { hora: '15:00h', pax: 2, mesa: 3, zona: 'Terraza', nombre: 'Carlos' },
  ];

  const mesasActivas = reservas.map((r) => r.mesa);

  return (
    <div className="flex min-h-screen bg-[#1f2a37] text-white">
      {/* Panel izquierdo */}
      <aside className="w-1/3 p-4 border-r border-gray-700 overflow-y-auto">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">RESTAURANT</h1>
          <input
            type="text"
            placeholder="Buscar"
            className="bg-gray-800 rounded px-3 py-1 text-sm focus:outline-none"
          />
        </header>

        <div className="flex space-x-2 mb-4">
          <Button className="bg-yellow-500 text-black">Pedidos Activos</Button>
          <Button variant="outline" className="text-yellow-500 border-yellow-500">Pedidos Completados</Button>
        </div>

        <div className="flex space-x-2 mb-4">
          <Button className="bg-white text-black">Hora</Button>
          <Button className="bg-white text-black">Nombre</Button>
        </div>

        <div className="space-y-4">
          {reservas.map((reserva, i) => (
            <div key={i} className="bg-gray-800 rounded p-4 flex flex-col shadow border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="text-green-400 w-5 h-5" />
                <span className="text-sm text-gray-300 font-semibold">{reserva.nombre}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-300">
                <span className="text-green-400 font-bold">{reserva.hora}</span>
                <span>{reserva.zona}</span>
              </div>
              <div className="text-sm text-gray-300 mt-1">
                {reserva.pax} personas • Mesa {reserva.mesa}
              </div>
              <div className="flex space-x-2 mt-3">
                <Button className="bg-green-600 text-white text-xs px-2 py-1">Completar</Button>
                <Button className="bg-red-600 text-white text-xs px-2 py-1">Borrar</Button>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Panel derecho con plano visual */}
      <main className="flex-1 p-6 relative">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Plano del Restaurante</h2>
          <Button className="bg-yellow-400 text-black font-semibold">NUEVA RESERVA</Button>
        </header>

        <div
          className="grid grid-cols-7 gap-3 auto-rows-[70px] justify-items-center items-center"
          style={{ backgroundColor: '#1f2a37' }}
        >
          {[
            'tree', 'tree', 'mesa-1', 'tree', 'mesa-2', 'tree', 'tree',
            'mesa-3', 'libre', 'mesa-4', 'bloque', 'mesa-5', 'libre', 'mesa-6',
            'mesa-7', 'bloque', 'bloque', 'mesa-8', 'bloque', 'bloque', 'mesa-9',
            'sombrilla', 'tree', 'sombrilla', 'tree', 'sombrilla', 'tree', 'mesa-10',
            'bloque', 'bloque', 'libre', 'bloque', 'libre', 'bloque', 'bloque',
          ].map((item, i) => {
            if (item.startsWith('mesa')) {
              const numeroMesa = parseInt(item.split('-')[1]);
              const estaActiva = mesasActivas.includes(numeroMesa);
              const reservaMesa = reservas.find(r => r.mesa === numeroMesa);

              return (
                <div
                  key={i}
                  onClick={() => navigate(`/mesa/${numeroMesa}`)}
                  className={`cursor-pointer w-full h-full rounded flex flex-col items-center justify-center font-bold text-xs text-black text-center transition-colors duration-300 p-1 ${
                    estaActiva ? 'bg-red-500 hover:bg-red-600' : 'bg-green-400 hover:bg-green-500'
                  }`}
                >
                  <span>Mesa {numeroMesa}</span>
                  {reservaMesa && (
                    <>
                      <span className="text-[10px]">{reservaMesa.hora}</span>
                      <span className="text-[10px]">{reservaMesa.pax}p</span>
                    </>
                  )}
                </div>
              );
            }

            if (item === 'tree') {
  return (
    <div key={i} className="w-full h-full flex justify-center items-center">
      <img src={treeIcon} alt="Árbol" className="w-10 h-10 object-contain" />
    </div>
  );
}
            if (item === 'bloque') {
  return (
    <div key={i} className="w-full h-full flex items-center justify-center">
      <img
        src={chairIcon}
        alt="Silla"
        className="w-8 h-8 object-contain"
      />
    </div>
  );
}

            if (item === 'sombrilla') {
  return (
    <div key={i} className="w-full h-full flex justify-center items-center">
      <img src={umbrellaIcon} alt="Sombrilla" className="w-10 h-10 object-contain" />
    </div>
  );
}

            return <div key={i} className="w-full h-full"></div>;
          })}
        </div>
      </main>
    </div>
  );
};

export default DashboardRestaurante;
