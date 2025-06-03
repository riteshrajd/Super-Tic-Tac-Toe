import React from 'react'
import superTypographyImage from '../assets/images/super_typography.png'

const SuperTitle = () => {
  return (
    <div className="flex flex-col items-center justify-center mb-8">
      <img 
        src={superTypographyImage} 
        alt="Super Typography" 
        className="w-80 sm:h-40 md:w-120 md:h-60 object-cover z-0"
      />
      <h1 className="z-10 text-6xl md:text-8xl font-extrabold animate-pulse text-red-500 tracking-wider text-center">
        TIC TAC TOE
      </h1>
    </div>
  )
}

export default SuperTitle