import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import DrawingCanvas from './DrawingCanvas';
import Toolbar from './Toolbar';
import UserCursors from './UserCursors';
import Chat from './Chat';
import { getSocket } from '../socket.js';
import jsPDF from "jspdf";
import { useAuth } from '../hooks/useAuth';

const channel = new BroadcastChannel('whiteboard-sync');

const Whiteboard = () => {
const { roomId } = useParams();
const { user } = useAuth();

const [color, setColor] = useState('black');
const [strokeWidth, setStrokeWidth] = useState(2);
const [tool, setTool] = useState('pencil');

const socketRef = useRef(null);
const canvasRef = useRef(null);
const hasJoinedRef = useRef(false);

// 🔌 Socket join
useEffect(() => {
const socket = getSocket();
socketRef.current = socket;


if (roomId && !hasJoinedRef.current) {
  socket.emit('join-room', roomId);
  hasJoinedRef.current = true;
}


}, [roomId]);

// 🧹 Clear canvas
const handleClearCanvas = () => {
socketRef.current.emit('clear-canvas', { roomId });
channel.postMessage({ type: 'clear-canvas' });
};

// 🔄 Sync tools across tabs
useEffect(() => {
channel.onmessage = (event) => {
const { type, data } = event.data;


  if (type === 'color-change') setColor(data.color);
  if (type === 'stroke-change') setStrokeWidth(data.strokeWidth);
  if (type === 'tool-change') setTool(data.tool);

  if (type === 'clear-canvas') {
    socketRef.current.emit('clear-canvas', { roomId });
  }
};

return () => channel.close();


}, [roomId]);

// =========================
// 📥 EXPORT FUNCTIONS
// =========================

const getCanvasWithWhiteBg = () => {
const canvas = canvasRef.current;
if (!canvas) return null;


const tempCanvas = document.createElement("canvas");
const ctx = tempCanvas.getContext("2d");

tempCanvas.width = canvas.width;
tempCanvas.height = canvas.height;

ctx.fillStyle = "#ffffff";
ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
ctx.drawImage(canvas, 0, 0);

return tempCanvas;


};

const downloadPNG = () => {
const tempCanvas = getCanvasWithWhiteBg();
if (!tempCanvas) return;


const link = document.createElement("a");
link.download = `whiteboard-${roomId}.png`;
link.href = tempCanvas.toDataURL("image/png", 1.0);
link.click();


};

const downloadPDF = () => {
const tempCanvas = getCanvasWithWhiteBg();
if (!tempCanvas) return;


const imgData = tempCanvas.toDataURL("image/png");

const pdf = new jsPDF("landscape");
const imgWidth = 280;
const imgHeight = (tempCanvas.height * imgWidth) / tempCanvas.width;

pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
pdf.save(`whiteboard-${roomId}.pdf`);


};

return ( <div className="w-screen h-screen flex flex-col bg-slate-50">

  {/* ===== HEADER ===== */}
  <div className="w-full px-6 py-3 bg-white flex items-center justify-between border-b border-slate-200">

    {/* LEFT */}
    <div className="flex items-center gap-4">
      <h1 className="text-lg font-semibold text-slate-900">
        🧠 Whiteboard
      </h1>

      <span className="text-sm text-slate-500">
        Room: <span className="font-medium text-slate-700">{roomId}</span>
      </span>
    </div>

    {/* RIGHT */}
    <div className="flex items-center gap-4">

      {/* EXPORT */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500">Export</span>

        <div className="flex items-center bg-slate-100 rounded-md overflow-hidden border border-slate-200">
          <button
            onClick={downloadPNG}
            className="px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-200 transition"
          >
            PNG
          </button>

          <div className="w-px h-4 bg-slate-300"></div>

          <button
            onClick={downloadPDF}
            className="px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-200 transition"
          >
            PDF
          </button>
        </div>
      </div>

      {/* USER */}
      <UserAvatar user={user} />

    </div>
  </div>

  {/* ===== TOOLBAR ===== */}
  <div className="bg-white border-b border-slate-200">
    <Toolbar
      color={color}
      setColor={(c) => {
        setColor(c);
        channel.postMessage({ type: 'color-change', data: { color: c } });
      }}
      strokeWidth={strokeWidth}
      setStrokeWidth={(w) => {
        setStrokeWidth(w);
        channel.postMessage({ type: 'stroke-change', data: { strokeWidth: w } });
      }}
      onClear={handleClearCanvas}
      tool={tool}
      setTool={(t) => {
        setTool(t);
        channel.postMessage({ type: 'tool-change', data: { tool: t } });
      }}
    />
  </div>

  {/* ===== MAIN AREA ===== */}
  <div className="flex flex-1 overflow-hidden">

    {/* CANVAS */}
    <div className="relative flex-1 bg-white">

      <DrawingCanvas
        socket={socketRef.current}
        roomId={roomId}
        color={color}
        strokeWidth={strokeWidth}
        tool={tool}
        canvasRef={canvasRef}
      />

      <UserCursors roomId={roomId} />
    </div>

    {/* CHAT */}
    <div className="border-l border-slate-200 bg-white">
      <Chat roomId={roomId} />
    </div>

  </div>
</div>


);
};

// =========================
// 👤 USER AVATAR COMPONENT
// =========================

const UserAvatar = ({ user }) => {
const [open, setOpen] = useState(false);

return ( <div className="relative">


  {/* Avatar + Username */}
  <div
    onClick={() => setOpen(!open)}
    className="flex items-center gap-2 cursor-pointer"
  >
    <div className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">
      {user?.username?.[0]?.toUpperCase()}
    </div>

    <span className="text-sm font-medium text-slate-700 hidden sm:block">
      {user?.username}
    </span>
  </div>

  {/* Dropdown */}
  {open && (
    <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-lg p-4 z-50">

      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">
          {user?.username?.[0]?.toUpperCase()}
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">
            {user?.name || "User"}
          </p>
          <p className="text-xs text-slate-500">
            @{user?.username}
          </p>
        </div>
      </div>

      <div className="text-sm text-slate-600 border-t pt-2">
        <p className="truncate">{user?.email}</p>
      </div>

    </div>
  )}
</div>

);
};

export default Whiteboard;
