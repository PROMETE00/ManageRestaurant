'use client'

import { useRouter } from 'next/navigation'
import { Home, Users, UtensilsCrossed, ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'

const navItems = [
  { label: 'Dashboard', icon: <Home size={20} />, path: '/dashboard' },
  { label: 'Clientes', icon: <Users size={20} />, path: '/clientes' },
  { label: 'Platillos', icon: <UtensilsCrossed size={20} />, path: '/platillos' },
  { label: 'Pedidos', icon: <ShoppingCart size={20} />, path: '/pedidos' },
]

export default function SidebarNavegacion() {
  const router = useRouter()

  return (
    <div className="group fixed left-0 top-1/2 -translate-y-1/2 z-50">
      <motion.aside
        initial={{ width: 56 }}
        whileHover={{ width: 160 }}
        className="bg-[#151521] rounded-r-xl shadow-lg py-4 px-2 h-auto transition-all duration-300 overflow-hidden"
      >
        <div className="flex flex-col items-start space-y-3">
          {navItems.map((item, index) => (
            <div
              key={index}
              onClick={() => router.push(item.path)}
              className="flex items-center w-full px-2 py-2 rounded-md cursor-pointer hover:bg-purple-600 transition"
            >
              <div className="text-white">{item.icon}</div>
              <span className="ml-3 text-sm text-white font-medium hidden group-hover:inline-block transition-opacity duration-300">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </motion.aside>
    </div>
  )
}
