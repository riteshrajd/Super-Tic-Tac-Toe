import React, { useState } from 'react'
import GamePage from './pages/GamePage';
import LobbyPage from './pages/LobbyPage';

const App = () => {
  const [start, setStart] = useState(false);
  const [name, setName] = useState('');
  const [room, setRoom] = useState(false);
  const [roomId, setRoomId] = useState(null);


  return (
    <div>
      {!start ? (
        <LobbyPage setStart={setStart} setName={setName} setRoom={setRoom} setRoomId={setRoomId} />
      ) : (
        <GamePage name={name} room={room} roomId={roomId} />
      )}
    </div>
  )
}

export default App