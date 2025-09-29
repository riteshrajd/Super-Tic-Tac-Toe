// src/hooks/useSocketStore.js
import { create } from 'zustand'
import { io } from 'socket.io-client'

const SOCKET_SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useSocketStore = create((set) => ({
  socket: io(SOCKET_SERVER_URL),
  oppSocketId: null,
  setOppSocketId: (id) =>  set({oppSocketId: id}),
}));
