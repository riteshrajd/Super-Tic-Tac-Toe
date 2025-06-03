const express = require('express');
const http = require('http');
const { Server } = require('socket.io'); 
const cors = require('cors');
const { json } = require('stream/consumers');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const players = [];
const pairs = new Map();

const roomToSocket = new Map();// key -> roomId(string), value -> {name, id: socke.id}
const pairInRoom = new Map();// key -> socket.id, value -> {roomId, oppName, oppId: oppSocketId});

console.log(`process env origin: ${process.env.ORIGIN}`)

app.use(cors({
  origin: process.env.ORIGIN,
  methods: ["GET", "POST"]
}));

const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN,
    methods: ["GET", "POST"]
  }
});

const deleteIfValueExists = (searchValue) => {
  for (const key of roomToSocket.keys()) {
    if (roomToSocket.get(key).id === searchValue) {
      roomToSocket.delete(key);
      return true;
    }
  }
  return false; 
};


const handleWithoutRoom = ({name, socket}) => {
    if(players.length) {
      const sign = Math.floor(Math.random()*2) === 0 ? -1 : 1;
      const turn = sign === -1 ? true : false;// X plays first
      const oppSign = sign === -1 ? 1 : -1;

      const data = {oppName: players[0].name, oppId: players[0].id, turn, sign};
      players.pop();
    
      io.to(socket.id).emit('match:start', data);
      io.to(data.oppId).emit('match:start', {oppName: name, oppId: socket.id, turn: !turn, sign: oppSign})

      pairs.set(socket.id, data.oppId);
      pairs.set(data.oppId,  socket.id);

      
      console.log(`data sent to ${name} -> ${JSON.stringify(data)}`);
      console.log(`data sent to ${data.name} -> ${JSON.stringify({name, oppId: socket.id, turn: !turn, oppSign})}`)
    }
    else {
      players.push({name, id: socket.id});
    }
}

const handleWithRoom = ({name, roomId, socket}) => {
  roomId = String(roomId);
  
  if(!roomToSocket.has(roomId)) {
    roomToSocket.set(roomId, {id: socket.id, name});
    console.log('room registered by ', name, ' roomId:', roomId);
  }
  else if(roomToSocket.get(roomId).id === socket.id) return;
  else {
    const opp = roomToSocket.get(roomId);
    const oppId = opp.id;
    const oppName = opp.name;
    roomToSocket.delete(roomId);
    pairInRoom.set(socket.id, {roomId, oppId, oppName});
    pairInRoom.set(oppId,{roomId, oppId: socket.id, oppName: name});

    const sign = Math.floor(Math.random()*2) === 0 ? -1 : 1;
    const turn = sign === -1 ? true : false;// X plays first
    const oppSign = sign === -1 ? 1 : -1;

    const dataToMe = {oppName, oppId, turn, sign};
    const datatoOpp = {oppName: name, oppId: socket.id, turn: !turn, sign: oppSign}

    // send data to opp and yourself to matchStart----

    io.to(socket.id).emit('match:start', dataToMe);
    io.to(oppId).emit('match:start', datatoOpp);

    //------------------------------------------------

    console.log(`data to Opp:${datatoOpp}`);
    console.log(`data to me:${dataToMe}`)
  }
}

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('check:room', ({roomId}) => {
    // convert roomId to string
    const roomIdStr = String(roomId);
    const available = roomToSocket.has(roomIdStr);
    
    console.log(`check room available: ${available}, roomId: ${roomId} (type: ${typeof roomId})`);
    console.log(`current rooms:`, Array.from(roomToSocket.keys()));
    console.log(`roomToSocket size:`, roomToSocket.size);
    
    socket.emit('room:checked', {available});
  });

  socket.on('match:request', ({name, room, roomId}) => {
    console.log('match request by:', name, ' room:', room);
    if(!room) handleWithoutRoom({name, socket});
    else handleWithRoom({name, roomId, socket});
  });

  socket.on('my:move', ({move, to, gameOver, winner, nextActiveGrid, metaGrid}) => {
    console.log(`make:move ->  move:${move}, to:${to}, gameOver:${gameOver}, winner:${winner}`)
    io.to(to).emit('opp:move', {move, from:socket.id , gameOver, winner, nextActiveGrid, metaGrid});
  });

  socket.on('disconnect', () => {
    if(players.length && players[0].id===socket.id) players.pop();
    deleteIfValueExists(socket.id);
    if(pairInRoom.get(socket.id)) {
      const opp = pairInRoom.get(socket.id);
      io.to(opp.oppId).emit('opponent:disconnected', {message: 'Opponent disconnected!'});
      if(pairInRoom.get(opp.oppId)) {
        roomToSocket.set(opp.roomId, {name: opp.oppName, id: opp.oppId});
        pairInRoom.delete(opp.oppId);
      }
      pairInRoom.delete(socket.id);
    }
    const disconnectedPlayer = socket.id;
    let otherPlayer = pairs.get(disconnectedPlayer);
    
    pairs.delete(socket.id);
    pairs.delete(otherPlayer);

    io.to(otherPlayer).emit('opponent:disconnected', {message: 'Opponent disconnected!'});
    
    console.log(`User Disconnected: ${socket.id}`);
  });
});

app.get('/', (req, res) => {
  res.send('Uno Server is Running!');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open your browser to http://localhost:${PORT}`);
});