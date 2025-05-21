'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function Home() {
  const router = useRouter()

  return (
    <main className="p-10 text-white bg-[#1f2a37] min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Bienvenido al Restaurante</h1>
      <Button onClick={() => router.push('/login')} className="bg-yellow-400 text-black">
        Ir a Login
      </Button>
    </main>
  )
}