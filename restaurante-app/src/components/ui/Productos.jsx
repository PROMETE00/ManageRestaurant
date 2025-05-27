import { useEffect, useState } from "react";
import axios from "axios";

export default function Productos() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/productos")
      .then((res) => setProductos(res.data))
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <div className="p-4 text-white">
      <h2 className="text-2xl font-bold mb-4">Productos del Menú</h2>
      <ul className="space-y-2">
        {productos.map(prod => (
          <li key={prod.id} className="bg-gray-800 p-2 rounded">
            {prod.nombre} - ${prod.precio}
          </li>
        ))}
      </ul>
    </div>
  );
}
