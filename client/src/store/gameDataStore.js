// src/stores/gameStore.js
import { create } from 'zustand';

export const useGameStore = create((set) => ({
  // State
  start: false,
  name: '',
  room: false, // This could represent if the user chose to create/join a specific room
  roomId: null,

  // Actions
  setName: (name) => set({ name: name }),
  setRoom: (room) => set({ room: room }),
  setRoomId: (id) => set({ roomId: id }),
  setStart: (start) => set({ start }),
}));