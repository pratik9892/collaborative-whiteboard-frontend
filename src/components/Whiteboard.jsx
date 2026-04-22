import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import DrawingCanvas from './DrawingCanvas';
import Toolbar from './Toolbar';
import UserCursors from './UserCursors';
import Chat from './Chat';
import { getSocket } from '../socket.js';
import jsPDF from "jspdf";

const channel = new BroadcastChannel('whiteboard-sync');

const Whiteboard = () => {
  const { roomId } = useParams();

  const [color, setColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [tool, setTool] = useState('pencil');
  const [socket, setSocket] = useState(null); // ✅ FIX: use state

  const canvasRef = useRef(null);
  const hasJoinedRef = useRef(false);

  // 🔌 CONNECT + JOIN ROOM (CORRECT WAY)
  useEffect(() => {
    const s = getSocket();

    setSocket(s);

    s.on("connect", () => {
      console.log("Socket connected:", s.id);

      if (roomId && !hasJoinedRef.current) {
        s.emit('join-room', roomId);
        hasJoinedRef.current = true;
      }
    });

    return () => {
      s.off("connect");
    };
  }, [roomId]);

  // 🧹 CLEAR
  const handleClearCanvas = () => {
    if (!socket) return;

    socket.emit('clear-canvas');
    channel.postMessage({ type: 'clear-canvas' });
  };

  // 🔄 SYNC BETWEEN TABS
  useEffect(() => {
    channel.onmessage = (event) => {
      const { type, data } = event.data;

      if (type === 'color-change') setColor(data.color);
      if (type === 'stroke-change') setStrokeWidth(data.strokeWidth);
      if (type === 'tool-change') setTool(data.tool);

      if (type === 'clear-canvas' && socket) {
        socket.emit('clear-canvas');
      }
    };

    return () => channel.close();
  }, [socket]);

  // =========================
  // EXPORT
  // =========================
  const getCanvasWithWhiteBg = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const temp = document.createElement("canvas");
    const ctx = temp.getContext("2d");

    temp.width = canvas.width;
    temp.height = canvas.height;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, temp.width, temp.height);
    ctx.drawImage(canvas, 0, 0);

    return temp;
  };

  const downloadPNG = () => {
    const temp = getCanvasWithWhiteBg();
    if (!temp) return;

    const link = document.createElement("a");
    link.download = `whiteboard-${roomId}.png`;
    link.href = temp.toDataURL();
    link.click();
  };

  const downloadPDF = () => {
    const temp = getCanvasWithWhiteBg();
    if (!temp) return;

    const pdf = new jsPDF("landscape");

    const imgWidth = 280;
    const imgHeight = (temp.height * imgWidth) / temp.width;

    pdf.addImage(temp.toDataURL(), "PNG", 10, 10, imgWidth, imgHeight);
    pdf.save(`whiteboard-${roomId}.pdf`);
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-100">

      {/* HEADER */}
      <div className="flex justify-between items-center px-4 py-2 bg-white border-b">
        <h1 className="font-semibold text-gray-800">Room: {roomId}</h1>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Export</span>
          <button onClick={downloadPNG} className="px-2 py-1 bg-gray-200 rounded">PNG</button>
          <button onClick={downloadPDF} className="px-2 py-1 bg-gray-800 text-white rounded">PDF</button>
        </div>
      </div>

      {/* TOOLBAR */}
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

      {/* MAIN */}
      <div className="flex flex-1 overflow-hidden">

        {/* CANVAS */}
        <div className="relative flex-1 bg-white">

          {socket && ( // ✅ ONLY render when socket ready
            <DrawingCanvas
              socket={socket}
              roomId={roomId}
              color={color}
              strokeWidth={strokeWidth}
              tool={tool}
              canvasRef={canvasRef}
            />
          )}

          <UserCursors roomId={roomId} />
        </div>

        {/* CHAT */}
        <Chat roomId={roomId} />
      </div>
    </div>
  );
};

export default Whiteboard;