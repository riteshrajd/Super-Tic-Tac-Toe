import React, { useCallback, useEffect, useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import EndGame from '../components/EndGame';
import Board from '../components/Board';
import HomeButton from '../components/HomeButton';

const GamePage = ({name, room, roomId}) => {
// -1 is 'X' and 1 is 'O' and 0 is 'blank'
  const [grid, setGrid] = useState(Array(9).fill(null).map(()=>Array(9).fill(0)));
  const [myTurn, setMyTurn] = useState(true); // Assuming client starts
  const [mySign, setMySign] = useState(-1); // Assuming client is 'X'
  const [waiting, setWaiting] = useState(true);
  const [oppName, setOppName] = useState(null);
  const [oppSocketId, setOppSocketId] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [reset, setReset] = useState(false);
  const [endGameText, setEndGameText] = useState(null);
  const [metaGrid, setMetaGrid] = useState(Array(9).fill(0));
  const [activeGridPosition, setActiveGridPosition] = useState(4);

  const socket = useSocket();
  const handlePlayAgain = () => {
    setGrid(Array(9).fill(null).map(() => Array(9).fill(0)));    
    setMyTurn(true);
    setMySign(-1);
    setWaiting(true);
    setOppName(null);
    setOppSocketId(null);
    setGameOver(false);
    setMetaGrid(Array(9).fill(0));
    setActiveGridPosition(4);
    setReset(r => (!r));
  }

  const log_out_states = useCallback(() => {
    console.log(`mySign${mySign}, gameOver: ${gameOver}`);
  }, [gameOver, mySign])

  useEffect(() => {
    socket.emit('match:request', {name, room, roomId});
    console.log(`socket: ${socket}`);
  }, [name, socket, reset, room, roomId])

  useEffect(()=> {
    socket.on('opponent:disconnected', ({message})=>{
      setEndGameText(message);
      setGameOver(true);
    })
  }, [socket])

  useEffect(() => {
    socket.on('match:start', ({oppName, oppId, sign, turn})=>{
      setOppName(oppName);
      setOppSocketId(oppId);
      setMySign(sign);
      setMyTurn(turn);
      setWaiting(false);
    })

    socket.on('opp:move', ({ move, gameOver, winner , nextActiveGrid, metaGrid}) => {
      setActiveGridPosition(nextActiveGrid);
      console.log(`opp:move -> ${JSON.stringify({move, gameOver, winner, nextActiveGrid, metaGrid})}`);
      // update grid 

      setGrid(prevGrid => {
        const newGrid = [...prevGrid];
        newGrid[move.gridIndex][move.cellIndex] = mySign === -1 ? 1 : -1;

        setMetaGrid(metaGrid);

        // set game outcome if game over
        if (gameOver) {
          setGameOver(true);
          setEndGameText(winner === 'draw' ? "IT'S A DRAW!" : (winner === mySign ? "YOU WIN!" : "YOU LOSE!"));
        }
        else {
          log_out_states();
        }
        return newGrid;
      });

      // set my turn
      if (!gameOver) {
        setMyTurn(true);
        console.log("Opponent moved, now your turn!");
      }
    });

    return () => {
      socket.off('match:start');
      socket.off('opp:move');
    }
  }, [log_out_states, mySign, socket])


  const checkResult = useCallback((currentGrid) => {
    // winning lines
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (currentGrid[a] && currentGrid[a] === currentGrid[b] && currentGrid[a] === currentGrid[c]) {
          return currentGrid[a]; // returns -1 for 'X' win, 1 for 'O' win
        }
    }

    // checks for draw (if no winner and no empty squares)
    if (currentGrid.every(square => square !== 0)) {
      return 'draw';
    }

    return null; // no winner yet
  }, []);

  const handleMove = useCallback((gridIndex, i) => {
    console.log('gridIndex:', gridIndex, ' i:', i);

    // invalid move cases
    if (!myTurn || grid[gridIndex][i] !== 0) return;
    if (activeGridPosition !== null && gridIndex !== activeGridPosition ) return;
    if (metaGrid[gridIndex] !== 0) return;

    setGrid(prevGrid => {
      const newGrid = prevGrid.map(subGrid => [...subGrid]);
      newGrid[gridIndex][i] = mySign;

      console.log(`handle Move mySign:${mySign}`);

      // check if the current sub-grid is won
      const subGridResult = checkResult(newGrid[gridIndex]);
      let newMetaGrid = [...metaGrid];

      if (subGridResult && subGridResult !== 'draw') {
        newMetaGrid[gridIndex] = subGridResult;
        setMetaGrid(newMetaGrid);
      } else if (subGridResult === 'draw') {
        newMetaGrid[gridIndex] = 'draw';
        setMetaGrid(newMetaGrid);
      }

      // seting next active grid position
      let nextActiveGridPosition = i;

      // if the target sub-grid is already won or drawn, player can choose any available grid -> nextActiveGridPosition = null
      if (newMetaGrid[nextActiveGridPosition] !== 0) {
        nextActiveGridPosition = null;
      }

      setActiveGridPosition(nextActiveGridPosition);

      // check if game is won
      const metaGameResult = checkResult(newMetaGrid.map(cell => cell === 'draw' ? 0 : cell));

      if (metaGameResult) {
        setEndGameText(metaGameResult === 'draw' ? "IT'S A DRAW!" : (metaGameResult === mySign ? "YOU WIN!" : "YOU LOSE!"));
        setGameOver(true);
      }

      // check for meta-grid draw (all sub-grids are either won or drawn)
      else if (newMetaGrid.every(cell => cell !== 0)) {
        setEndGameText("IT'S A DRAW!");
        setGameOver(true);
      }

      // send move to server
      socket.emit('my:move', {
        move: { gridIndex, cellIndex: i },
        to: oppSocketId,
        gameOver: !!metaGameResult || newMetaGrid.every(cell => cell !== 0),
        winner: metaGameResult,
        nextActiveGrid: nextActiveGridPosition,
        metaGrid: newMetaGrid,
      });

      return newGrid;
    });

    setMyTurn(false);
  }, [myTurn, grid, mySign, checkResult, socket, oppSocketId, activeGridPosition, metaGrid]);

  return (

    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 relative">
      <HomeButton />

      {/* 1. names header */}
      <div className="flex justify-between w-60 sm:w-120 md:w-180 mb-8 font-mono">
        <div className='flex gap-x-4 justify-center items-center w-20 sm:w-40 md:w-60'>
          <p className={`text-xl sm:text-2xl md:text-3xl text-yellow-400 font-bold animate-bounce pointer-events-none ${!myTurn || waiting ? 'opacity-0' : ''}`}>▶</p>
          <h2 className={`
            text-3xl md:text-4xl font-extrabold tracking-wider
            ${myTurn ? 'text-green-500 animate-pulse' : 'text-gray-600'}
            transition-colors duration-300
          `}>
            {name || "Player 1"} {mySign=== -1 ? '(X)' : '(O)'}
          </h2>
        </div>
        <div className="flex items-center justify-center px-4 w-20 sm:w-40 md:w-60 font-mono">
          <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-400">
            VS
          </span>
        </div>
        <div className='flex gap-x-4 justify-center items-center w-20 sm:w-40 md:w-60'>
          <p className={`text-xl sm:text-2xl md:text-3xl text-yellow-400 font-bold animate-bounce order-1 sm:order-2 pointer-events-none ${myTurn || waiting ? 'opacity-0' : ''}`}>◀</p>
          <h2 className={`
            text-3xl md:text-4xl font-extrabold tracking-wider
            ${!myTurn ? 'text-red-500 animate-pulse' : 'text-gray-600'}
            transition-colors duration-300
          `}>
            {oppName || "Player 2"} {mySign === -1 ? '(O)' : '(X)'}
          </h2>
        </div>
        
      </div>

      {!waiting ? ( 
        
        // 2.1 if not waiting then show the board
        <Board grid={grid} handleMove={handleMove} myTurn={myTurn} gameOver={gameOver} activeGridPosition={activeGridPosition} metaGrid={metaGrid}/>

        
      ) : ( 

        // 2.2 waiting screen
        <div className='flex flex-col items-center text-center font-mono'>
          <h1 className="text-4xl text-white font-bold animate-pulse mt-8">waiting for opponent...</h1>
          {room && <h1 className=' text-white/80 text-xl sm:text-3xl border-none text-center rounded-lg mt-10 py-2 px-3'>ROOM ID</h1>}
          {room && <h1 className=' bg-gray-600 text-white text-xl sm:text-3xl border-none text-center rounded-lg py-2 px-3'>{roomId}</h1>}
        </div>
      )}

      {/* 3. game over overlay */}
      {gameOver && (
        <EndGame text={endGameText} handlePlayAgain={handlePlayAgain} />
      )}
    </div>
  );
}

export default GamePage