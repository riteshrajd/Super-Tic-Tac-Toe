import { useEffect, useState } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import GamePage from './GamePage';
import LobbyPage from './LobbyPage';
// import { useLobbyStore } from './store/lobbyStore';
import { useSocketStore } from '../store/socketStore';
import peerService from '../services/peerService';

const GameAndVideo = () => {
  // const { start } = useLobbyStore();
  const [myStream, setMyStream] = useState(null)
  const [opponentStream, setOpponentStream] = useState(null);
  const { oppSocketId, socket } = useSocketStore();

  useEffect(() => {
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })
        setMyStream(stream);
      } catch (err) {
        console.log(err);
      }
    }
    getMedia();
  }, [])

  const callUser = async (targetId) => {
    // Add your local stream's tracks to the connection
    for (const track of myStream.getTracks()) {
      peerService.peer.addTrack(track, myStream);
    }

    // Now create and send the offer
    const offer = await peerService.createOffer();
    socket.emit('webrtc-offer', { target: targetId, sdp: offer });
  };

// handshake
  useEffect(() => {
    const handleIncomingOffer = async ({ from, sdp }) => {
      // Add your local stream's tracks to the connection
      for (const track of myStream.getTracks()) {
        peerService.peer.addTrack(track, myStream);
      }
      
      // Now create and send the answer
      const answer = await peerService.getAnswer(sdp);
      socket.emit('webrtc-answer', { target: from, sdp: answer });
    };
    
    const handleIncomingAnswer = async ({ from, sdp }) => {
      console.log(`Incoming answer from ${from}`);
      await peerService.setRemoteDescription(sdp);
    };
    
    if (socket) {
      socket.on('webrtc-offer', handleIncomingOffer);
      socket.on('webrtc-answer', handleIncomingAnswer);
    }

    // Cleanup listener on component unmount
    return () => {
      if (socket) {
        socket.off('webrtc-offer', handleIncomingOffer);
        socket.off('webrtc-answer', handleIncomingAnswer);
      }
    };
  }, [myStream, socket]);

// ice candidate exchange
  useEffect(() => {
    // Listen for when our browser finds a candidate
    const handleIceCandidate = (event) => {
      if (event.candidate) {
        console.log("Found ICE candidate, sending to peer.");
        socket.emit('ice-candidate', { target: oppSocketId, candidate: event.candidate });
      }
    };

    // Listen for candidates coming from the other peer
    const handleIncomingIceCandidate = ({ candidate }) => {
      console.log("Received ICE candidate from peer.");
      peerService.addIceCandidate(candidate);
    };
    
    if (peerService.peer) {
      // Setup the listeners on the peer connection object
      peerService.peer.addEventListener('icecandidate', handleIceCandidate);
      socket.on('ice-candidate', handleIncomingIceCandidate);
    }

    return () => {
      if (peerService.peer) {
        peerService.peer.removeEventListener('icecandidate', handleIceCandidate);
      }
      if (socket) {
        socket.off('ice-candidate', handleIncomingIceCandidate);
      }
    };
  }, [socket, oppSocketId]);

// show track
  useEffect(() => {
    const handleTrack = (event) => {
      const remoteStream = event.streams[0];
      console.log("GOT TRACKS!!", remoteStream);
      setOpponentStream(remoteStream);
    };

    if (peerService.peer) {
      peerService.peer.addEventListener('track', handleTrack);
    }

    return () => {
      if (peerService.peer) {
        peerService.peer.removeEventListener('track', handleTrack);
        setOpponentStream(null);
      }
    };
  }, []);

  return (
    <div className="bg-slate-900 min-h-screen text-white p-4 pt-8 flex flex-col items-center gap-4 font-sans">      
      <h1 className="text-xl font-bold text-slate-300 tracking-wider mt-6">
        Opponent's Feed
      </h1>
      
      {/* Instruction for VideoPlayer is below */}
      <VideoPlayer stream={opponentStream} />

      {oppSocketId && (
        <button
          className='cursor-pointer bg-green-600 hover:bg-green-500 rounded-lg py-2 px-5 text-white font-semibold shadow-lg transition-transform transform hover:scale-105 mt-6'
          onClick={() => callUser(oppSocketId)}
        >
          Call Opponent
        </button>
      )}
      
      {/* This makes your GamePage have a max-width and some top margin */}
      <div className="w-full max-w-md mt-8">
        <GamePage />
      </div>

    </div>
  );
}

export default GameAndVideo