import React, { useMemo } from 'react'
import SocketContext from './SocketContext'
import { io } from 'socket.io-client'

const SOCKET_SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const SocketProvider = (props) => {

  const socket = useMemo(() => io(SOCKET_SERVER_URL), []);

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  )
}

export default SocketProvider