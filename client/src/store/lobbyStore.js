// src/stores/gameStore.js
import { create } from 'zustand';

export const useLobbyStore = create((set) => ({
  // State
  start: false,
  name: '',
  room: false,
  roomId: null,

  // Actions
  setName: (name) => set({ name: name }),
  setRoom: (room) => set({ room: room }),
  setRoomId: (id) => set({ roomId: id }),
  setStart: (start) => set({ start }),
}));