import React from 'react'
import Grid from './Grid'

const Board = ({grid, handleMove, myTurn, gameOver, activeGridPosition, metaGrid}) => {
  console.log('grid:',grid)
  return (
    <div className='
      border-1 sm:border-2 md:border-4 border-yellow-500
      grid grid-cols-3 grid-rows-3 
      w-78 h-78 sm:w-[390px] sm:h-[390px] md:w-[810px] md:h-[810px] 
      m-2 sm:m-3 md:m-4
      gap-1 sm:gap-1 md:gap-3
      p-2 sm:p-2 md:p-4
      rounded-lg md:rounded-xl
    '>
      {
        metaGrid.map((metaValue, i) => (
          <Grid 
            key={i}
            grid={grid[i]} 
            handleMove={handleMove} 
            myTurn={myTurn} 
            gameOver={gameOver} 
            gridIndex={i} 
            activeGridPosition={activeGridPosition} 
            metaValue={metaValue}
          />
        ))
      }
    </div>
  )
}

export default Board