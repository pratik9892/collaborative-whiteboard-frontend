import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const DrawingCanvas = ({ socket, roomId, color, strokeWidth, tool, canvasRef }) => {
const ctxRef = useRef();
const [drawing, setDrawing] = useState(false);

const colorRef = useRef(color);
const widthRef = useRef(strokeWidth);

const { user } = useAuth();

// keep latest color & width
useEffect(() => {
colorRef.current = color;
widthRef.current = strokeWidth;
}, [color, strokeWidth]);

// setup canvas
useEffect(() => {
const canvas = canvasRef.current;


const resizeCanvas = () => {
  const { width, height } = canvas.parentElement.getBoundingClientRect();
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctxRef.current = ctx;
};

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

return () => {
  window.removeEventListener('resize', resizeCanvas);
};


}, [canvasRef]);

// start drawing
const startDrawing = ({ nativeEvent }) => {
if (!socket?.connected) return;


const { offsetX, offsetY } = nativeEvent;
const ctx = ctxRef.current;

ctx.beginPath();
ctx.moveTo(offsetX, offsetY);
ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : colorRef.current;
ctx.lineWidth = widthRef.current;

setDrawing(true);

socket.emit('draw-start', {
  roomId,
  offsetX,
  offsetY,
  color: ctx.strokeStyle,
  strokeWidth: widthRef.current,
  username: user?.username || 'Anonymous',
});


};

// drawing move
const draw = ({ nativeEvent }) => {
if (!drawing || !socket?.connected) return;


const { offsetX, offsetY } = nativeEvent;
const ctx = ctxRef.current;

ctx.lineTo(offsetX, offsetY);
ctx.stroke();

socket.emit('draw-move', { roomId, offsetX, offsetY });


};

// end drawing
const endDrawing = () => {
if (!drawing || !socket?.connected) return;


ctxRef.current.closePath();
setDrawing(false);

socket.emit('draw-end', {
  roomId,
  username: user?.username || 'Anonymous',
});


};

// listen to other users
useEffect(() => {
if (!socket || !roomId) return;


const handleDrawStart = ({ offsetX, offsetY, color, strokeWidth }) => {
  const ctx = ctxRef.current;
  ctx.beginPath();
  ctx.moveTo(offsetX, offsetY);
  ctx.strokeStyle = color;
  ctx.lineWidth = strokeWidth;
};

const handleDrawMove = ({ offsetX, offsetY }) => {
  const ctx = ctxRef.current;
  ctx.lineTo(offsetX, offsetY);
  ctx.stroke();
};

const handleDrawEnd = () => {
  ctxRef.current.closePath();
};

const handleClearCanvas = () => {
  const canvas = canvasRef.current;
  ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
};

socket.on('draw-start', handleDrawStart);
socket.on('draw-move', handleDrawMove);
socket.on('draw-end', handleDrawEnd);
socket.on('clear-canvas', handleClearCanvas);

return () => {
  socket.off('draw-start', handleDrawStart);
  socket.off('draw-move', handleDrawMove);
  socket.off('draw-end', handleDrawEnd);
  socket.off('clear-canvas', handleClearCanvas);
};


}, [socket, roomId, canvasRef]);

return (
<canvas
ref={canvasRef} // ✅ SAME REF FROM PARENT
onMouseDown={startDrawing}
onMouseMove={draw}
onMouseUp={endDrawing}
onMouseLeave={endDrawing}
className="absolute inset-0 z-0"
/>
);
};

export default DrawingCanvas;
