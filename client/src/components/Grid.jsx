import React, { useState, useEffect } from 'react';

const Grid = ({grid, handleMove, myTurn, gameOver, gridIndex, activeGridPosition, metaValue}) => {
  const [showBigSymbol, setShowBigSymbol] = useState(false);
  const delayTime = gameOver ? 0 : 1200; // 1.2 second delay before showing big symbol

  useEffect(() => {
    // If this subgrid is won or drawn (metaValue is not 0)
    if (metaValue !== 0) {
      const timer = setTimeout(() => {
        setShowBigSymbol(true);
      }, delayTime);

      return () => clearTimeout(timer);
    } else {
      setShowBigSymbol(false);
    }
  }, [delayTime, metaValue]);

  // Determine the text to display for the big symbol
  const bigSymbolText = metaValue === -1 ? 'X' : (metaValue === 1 ? 'O' : (metaValue === 'draw' ? 'DRAW' : ''));

  // play anywhere activeGridPosition = null
  const isActiveGrid = (activeGridPosition === null || gridIndex === activeGridPosition);

  return (
    <div className={`
      relative
      grid grid-cols-3 gap-1 sm:gap-1 md:gap-3 p-1.5 sm:p-2 sm:pl-1.5 sm:pt-1.5 md:p-4 
      font-mono
      w-24 h-24 sm:w-30 sm:h-30 md:w-64 md:h-64
      rounded-lg md:rounded-xl
      border-2 md:border-4
      ${isActiveGrid && metaValue === 0 ? 'border-amber-500 bg-gray-900 ' : 'border-gray-900 bg-gray-900'} // Highlight if active AND not won/drawn, otherwise default background
      ${metaValue === -1 ? 'border-red-700' : ''} // Red border if X wins
      ${metaValue === 1 ? 'border-blue-700' : ''} // Blue border if O wins
      ${metaValue === 'draw' ? 'border-gray-700' : ''} // Gray border if draw
    `}>
      {/* overlay big symbol X, O, or DRAW */}
      {showBigSymbol && metaValue !== 0 && (
        <div className={`
          absolute inset-0 flex items-center justify-center
          // RESPONSIVE TEXT SIZE for big symbol
          text-2xl sm:text-4xl md:text-8xl font-extrabold 
          rounded-md
          ${metaValue === -1 ? 'bg-red-700 text-yellow-300' : ''}
          ${metaValue === 1 ? 'bg-blue-700 text-lime-300' : ''}
          ${metaValue === 'draw' ? 'bg-gray-700 text-gray-300 text-xs sm:text-sm md:text-2xl' : ''}
          z-10
          pointer-events-none
          transition-all duration-1000 ease-in-out
        `}>
          {bigSymbolText}
        </div>
      )}

      {/* if not won the subgrid then show normal subgrid cells */}
      {!showBigSymbol && grid.map((ele, i) => (
        <button
          key={i}
          className={`
            w-6 sm:w-8 md:w-16 aspect-square
            flex items-center justify-center
            text-md sm:text-2xl md:text-5xl font-extrabold
            rounded-sm sm:rounded-md
            transition-all duration-150 ease-out

            ${ele === -1 ? 'bg-red-700 text-amber-300' : ''}
            ${ele === 1 ? 'bg-blue-700 text-lime-300' : ''}
            ${ele === 0 ? 'bg-gray-800' : ''}

            ${ele !== 0 ? 'hover:scale-105 active:scale-95' : ''}
            ${(isActiveGrid && ele === 0 && !gameOver && myTurn && metaValue === 0) ? 'hover:bg-gray-700 cursor-pointer' : 'cursor-not-allowed'}
            ${(ele !== 0 || gameOver || !myTurn || metaValue !== 0 || !isActiveGrid) ? 'pointer-events-none' : ''} 
          `}
          onClick={() => handleMove(gridIndex, i)}
          disabled={
            !myTurn ||          // not my turn
            ele !== 0 ||        // cell is already taken
            gameOver ||         // game is over
            metaValue !== 0 ||  // this subgrid is already won/drawn
            !isActiveGrid       // this is not the active grid to play in
          }
        >
          {ele === -1 && 'X'}
          {ele === 1 && 'O'}
        </button>
      ))}
    </div>
  );
};

export default Grid;