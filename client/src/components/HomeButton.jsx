import React from 'react'
import { Home } from 'lucide-react'

const HomeButton = () => {
  return (
    <button onClick={() => window.location.href='/'} 
      className="absolute top-4 left-4 sm:text-3xl px-4 py-1 text-white bg-green-600 hover:bg-green-700 text-2xl font-bold uppercase rounded-lg shadow-lg transition-transform duration-200 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-75 border-4 border-green-800">
      <Home size={20} className="md:w-6 md:h-6" />
    </button>
  )
}

export default HomeButton