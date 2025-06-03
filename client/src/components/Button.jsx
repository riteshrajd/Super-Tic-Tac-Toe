import React from 'react'

const Button = ({handleClick, text}) => {
  return (
    <button
      onClick={handleClick}
      className=" sm:text-3xl px-10 py-5 text-white bg-green-600 hover:bg-green-700 text-2xl font-bold uppercase rounded-lg shadow-lg transition-transform duration-200 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-75 border-4 border-green-800"
    >
      {text}
    </button>
  )
}

export default Button