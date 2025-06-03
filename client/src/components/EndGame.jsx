import React from 'react'
import Button from './Button'

const EndGame = ({text, handlePlayAgain}) => {
  return (
    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-50 backdrop-blur-sm ">
      <h2 className="text-center text-4xl sm:text-6xl font-extrabold text-yellow-400 mb-6 animate-bounce font-mono">
        {text}
      </h2>
      <Button handleClick={handlePlayAgain} text={'Play Again!'} />
    </div>
  )
}

export default EndGame