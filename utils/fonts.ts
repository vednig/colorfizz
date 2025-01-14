import { Geist, Inter } from 'next/font/google'

export const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
})

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const fontOptions = [
  { name: 'Geist', value: geist.className },
  { name: 'Inter', value: inter.className },
]

export const gradients = [
  'bg-gradient-to-r from-rose-400 to-purple-500',
  'bg-gradient-to-r from-purple-400 to-blue-500',
  'bg-gradient-to-r from-orange-400 to-pink-500',
  'bg-gradient-to-r from-gray-200 to-blue-400',
]

