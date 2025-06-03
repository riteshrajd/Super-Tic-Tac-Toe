import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import { useCallback } from 'react';
import { useSocket } from '../hooks/useSocket';
import SuperTitle from '../components/SuperTitle';
import HomeButton from '../components/HomeButton';


const LobbyPage = ({ setStart, setName, setRoom, setRoomId}) => {
  const [localName, setLocalName] = useState('');
  const [selectType, setSelectType] = useState(false); // for random and create/join room buttons
  const [joinCreate, setJoinCreate] = useState(false);
  const [joining, setJoining] = useState(false);
  const [localRoomId, setLocalRoomId] = useState(null);

  const socket = useSocket();
  
  const handleNameInput = useCallback(() => {
    if (localName.trim() !== '') {
      if(localName.trim().length >= 10) {
        alert('Name is too long, please input less than 10 character');
        return;
      }
      setName(localName.trim());
      setSelectType(true);
    }
    else {
      alert('Please enter your name!')
    }
  }, [localName, setName])

  const handleJoinRoom = useCallback(() => {
    socket.emit('check:room', {roomId: localRoomId});
  }, [localRoomId, socket])

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        if (document.activeElement && document.activeElement.tagName === 'BUTTON') return;
        if(!joining && !selectType){
          handleNameInput();

          // Simulate Tab+Enter
          setTimeout(() => {
            document.dispatchEvent(new KeyboardEvent('keydown', {
              key: 'Tab',
              code: 'Tab',
              keyCode: 9,
              which: 9,
              bubbles: true
            }));
            setTimeout(() => {
              document.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true
              }));
            }, 50);
          }, 50);
        }
        else if(joining && selectType && joinCreate){
          handleJoinRoom();
        }
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [setStart, setName, localName, handleNameInput, joining, handleJoinRoom, joinCreate, selectType]);

  useEffect(()=> {
    socket.on('room:checked', ({available})=>{
      if(!available) {
        alert('Room not found');
        return;
      }
      setRoomId(localRoomId);
      setRoom(true);
      setStart(true);
    })
  }, [localRoomId, setRoom, setRoomId, setStart, socket])


  const handleRandomButton = () => {
    setRoom(false);
    setRoomId(null);
    setStart(true);
  }
  

  const handleCreateRoom = () => {
    const id = Math.floor(Math.random()*1000000);
    console.log(`generated roomId -> ${id}`);
    setRoomId(id);
    setRoom(true);
    setStart(true);
  }


  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center text-white font-mono p-4">
      {selectType && <HomeButton />}

      <SuperTitle />


      {!joinCreate ? (!selectType ? (
        // 1. enter name
        <div className='flex flex-col justify-center items-center'>
          <input
            type="text"
            placeholder="Enter your name"
            value={localName}
            onChange={(e) => {setLocalName(e.target.value)}}
            className="
              mb-6 p-4 text-2xl text-gray-900 bg-gray-200 rounded-lg border-4 border-blue-500 focus:border-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-75 shadow-lg  placeholder-gray-500 text-center w-full max-w-sm transition-all duration-200 ease-in-out"
          />

          <Button text={'PLAY GAME'} handleClick={handleNameInput} />
          <p className="mt-8 text-xl text-gray-400 animate-bounce text-center">
            Press ENTER or click to proceed!
          </p>
        </div>
      ) : (

        // 2. select type
        <div className='flex flex-col gap-5'>
          <Button text={'Random'} handleClick={handleRandomButton} />
          <Button text={'Create/Join Room'} handleClick={()=>setJoinCreate(true)} />
        </div>
      )) : (
        <div>
          { !joining ? (

            // 3. create/join room
            <div className='flex flex-col gap-5'>
              <Button text={'Join Room'} handleClick={()=>setJoining(true)} />
              <Button text={'Create Room'} handleClick={handleCreateRoom} />
            </div>
          ) : (

            // 4. join room
            <div className='flex flex-col justify-center items-center'>
              <input
                type="text"
                placeholder="Enter Room ID"
                value={localRoomId}
                onChange={(e) => {setLocalRoomId(e.target.value)}}
                className="
                  mb-6 p-4 text-2xl text-gray-900 bg-gray-200 rounded-lg border-4 border-blue-500 focus:border-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-75 shadow-lg  placeholder-gray-500 text-center w-full max-w-sm transition-all duration-200 ease-in-out"
              />
              <Button text={'JOIN'} handleClick={handleJoinRoom} />
              <p className="mt-8 text-xl text-gray-400 animate-bounce text-center">
                Press ENTER or click to proceed!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LobbyPage;