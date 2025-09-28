import React, { useEffect, useRef } from 'react';

const VideoPlayer = ({ stream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      className="w-72 h-56 bg-slate-800 rounded-lg shadow-xl object-cover border-2 border-slate-700"
      style={{ width: '300px' }}
      ref={videoRef}
      autoPlay
      playsInline
    />
  );
};

export default VideoPlayer;