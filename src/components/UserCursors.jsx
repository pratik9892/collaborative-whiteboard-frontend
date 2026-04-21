import React, { useEffect, useRef, useState } from 'react';
import { getSocket } from '../socket.js';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../hooks/useAuth.js';

const COLORS = ["#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#FFD133"];

const UserCursors = ({ roomId }) => {
const [cursors, setCursors] = useState({});
const [drawingUsers, setDrawingUsers] = useState(new Set());

const userIdRef = useRef(uuidv4());
const colorRef = useRef(COLORS[Math.floor(Math.random() * COLORS.length)]);
const socketRef = useRef(null);

const { user } = useAuth();

// 🧠 SEND CURSOR POSITION
useEffect(() => {
socketRef.current = getSocket();


const handleMouseMove = (e) => {
  socketRef.current?.emit('cursor-move', {
    roomId,
    userId: userIdRef.current,
    username: user?.username || "anon",
    x: e.clientX,
    y: e.clientY,
    color: colorRef.current,
  });
};

window.addEventListener('mousemove', handleMouseMove);

return () => {
  window.removeEventListener('mousemove', handleMouseMove);
};

}, [roomId, user?.username]);

// 🧠 RECEIVE CURSOR + HANDLE EVENTS
useEffect(() => {
const socket = getSocket();
socketRef.current = socket;


const handleCursorUpdate = ({ userId, x, y, color, username }) => {
  if (userId === userIdRef.current) return;

  setCursors((prev) => ({
    ...prev,
    [userId]: {
      x,
      y,
      color,
      username,
      lastSeen: Date.now(),
    },
  }));
};

const handleDrawStart = ({ username }) => {
  setDrawingUsers((prev) => new Set(prev).add(username));
};

const handleDrawEnd = ({ username }) => {
  setDrawingUsers((prev) => {
    const newSet = new Set(prev);
    newSet.delete(username);
    return newSet;
  });
};

socket.on('cursor-update', handleCursorUpdate);
socket.on('draw-start', handleDrawStart);
socket.on('draw-end', handleDrawEnd);

return () => {
  socket.off('cursor-update', handleCursorUpdate);
  socket.off('draw-start', handleDrawStart);
  socket.off('draw-end', handleDrawEnd);
};


}, [roomId]);

// 🧹 REMOVE IDLE CURSORS
useEffect(() => {
const interval = setInterval(() => {
setCursors((prev) => {
const now = Date.now();
const updated = {};


    Object.entries(prev).forEach(([id, cursor]) => {
      if (now - cursor.lastSeen < 2000) {
        updated[id] = cursor;
      }
    });

    return updated;
  });
}, 1000);

return () => clearInterval(interval);


}, []);

// 🎨 RENDER
return (
<>
{Object.entries(cursors).map(([userId, { x, y, color, username }]) => {
const isDrawing = drawingUsers.has(username);

    return (
      <div
        key={userId}
        className="pointer-events-none fixed z-50 transition-transform duration-75 ease-out"
        style={{
          left: `${x}px`,
          top: `${y}px`,
          transform: 'translate(-1px, -1px)', // ✅ FIXED ALIGNMENT
        }}
      >
        {/* Cursor */}
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path
            d="M0 0 L0 16 L4 12 L7 16 L9 15 L6 11 L10 11 Z"
            fill={color}
            stroke="white"
            strokeWidth="1"
            style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))" }}
          />
        </svg>

        {/* Name tag */}
        <div
          className={`mt-1 px-2 py-1 text-xs font-medium rounded-md shadow-md whitespace-nowrap transition-all
          ${
            isDrawing
              ? "bg-green-500 text-white scale-105"
              : "bg-black text-white opacity-80"
          }`}
        >
          {username} {isDrawing && "✏️"}
        </div>
      </div>
    );
  })}
</>


);
};

export default UserCursors;
