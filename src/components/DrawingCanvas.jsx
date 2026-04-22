import React, { useEffect, useRef, useState } from "react";

const DrawingCanvas = ({ socket, roomId, color, strokeWidth, tool, canvasRef }) => {
  const ctxRef = useRef();
  const [drawing, setDrawing] = useState(false);

  const pathsRef = useRef({});
  const shapeRef = useRef(null);
  const shapesRef = useRef([]);

  // =========================
  // SETUP CANVAS
  // =========================
  useEffect(() => {
    const canvas = canvasRef.current;

    const resize = () => {
      const { width, height } = canvas.parentElement.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctxRef.current = ctx;

      redrawAll();
    };

    resize();
    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, [canvasRef]);

  // =========================
  // DRAW SHAPE
  // =========================
  const drawShape = (shape) => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.strokeWidth;

    if (shape.type === "line") {
      ctx.beginPath();
      ctx.moveTo(shape.startX, shape.startY);
      ctx.lineTo(shape.endX, shape.endY);
      ctx.stroke();
    }

    if (shape.type === "rectangle") {
      ctx.strokeRect(
        shape.startX,
        shape.startY,
        shape.endX - shape.startX,
        shape.endY - shape.startY
      );
    }

    if (shape.type === "circle") {
      const r = Math.sqrt(
        (shape.endX - shape.startX) ** 2 +
        (shape.endY - shape.startY) ** 2
      );

      ctx.beginPath();
      ctx.arc(shape.startX, shape.startY, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (shape.type === "text") {
      ctx.fillStyle = shape.color;
      ctx.font = `${shape.fontSize}px sans-serif`;
      ctx.fillText(shape.text, shape.x, shape.y);
    }
  };

  // =========================
  // REDRAW ALL
  // =========================
  const redrawAll = () => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    shapesRef.current.forEach(drawShape);
  };

  // =========================
  // START
  // =========================
  const startDrawing = ({ nativeEvent }) => {
    if (!socket || !socket.connected) return;

    const { offsetX, offsetY } = nativeEvent;

    if (tool === "pencil" || tool === "eraser") {
      pathsRef.current[socket.id] = { x: offsetX, y: offsetY };

      socket.emit("draw-start", {
        roomId,
        offsetX,
        offsetY,
        color: tool === "eraser" ? "#ffffff" : color,
        strokeWidth,
      });
    }

    if (["line", "rectangle", "circle"].includes(tool)) {
      shapeRef.current = {
        type: tool,
        startX: offsetX,
        startY: offsetY,
        endX: offsetX,
        endY: offsetY,
        color,
        strokeWidth,
        roomId,
      };
    }

    if (tool === "text") {
      const text = prompt("Enter text");
      if (!text) return;

      const shape = {
        type: "text",
        text,
        x: offsetX,
        y: offsetY,
        color,
        fontSize: 20,
        roomId,
      };

      shapesRef.current.push(shape);
      drawShape(shape);

      socket.emit("draw-shape", shape);
      return;
    }

    setDrawing(true);
  };

  // =========================
  // MOVE
  // =========================
  const draw = ({ nativeEvent }) => {
    if (!drawing) return;

    const { offsetX, offsetY } = nativeEvent;
    const ctx = ctxRef.current;

    if (tool === "pencil" || tool === "eraser") {
      const prev = pathsRef.current[socket.id];
      if (!prev) return;

      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(offsetX, offsetY);
      ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
      ctx.lineWidth = strokeWidth;
      ctx.stroke();

      pathsRef.current[socket.id] = { x: offsetX, y: offsetY };

      socket.emit("draw-move", { roomId, offsetX, offsetY });
    }

    if (shapeRef.current) {
      shapeRef.current.endX = offsetX;
      shapeRef.current.endY = offsetY;

      redrawAll();
      drawShape(shapeRef.current);
    }
  };

  // =========================
  // END
  // =========================
  const endDrawing = () => {
    if (!drawing) return;

    if (shapeRef.current) {
      const shape = { ...shapeRef.current };

      shapesRef.current.push(shape);
      drawShape(shape);
      console.log(shape);
      
      socket.emit("draw-shape", shape);

      shapeRef.current = null;
    }

    socket.emit("draw-end", { roomId });
    setDrawing(false);
  };

  // =========================
  // SOCKET LISTENERS
  // =========================
  useEffect(() => {
    if (!socket) return;

    const handleStart = ({ userId, offsetX, offsetY, color, strokeWidth }) => {
      pathsRef.current[userId] = { x: offsetX, y: offsetY };

      ctxRef.current.strokeStyle = color;
      ctxRef.current.lineWidth = strokeWidth;
    };

    const handleMove = ({ userId, offsetX, offsetY }) => {
      const prev = pathsRef.current[userId];
      if (!prev) return;

      const ctx = ctxRef.current;

      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();

      pathsRef.current[userId] = { x: offsetX, y: offsetY };
    };

    const handleEnd = ({ userId }) => {
      delete pathsRef.current[userId];
    };

    const handleShape = (shape) => {
      console.log("RECEIVED SHAPE:", shape); // 🔥 DEBUG

      shapesRef.current.push(shape);
      drawShape(shape);
    };

    const handleClear = () => {
      shapesRef.current = [];
      pathsRef.current = {};

      ctxRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    };

    socket.on("draw-start", handleStart);
    socket.on("draw-move", handleMove);
    socket.on("draw-end", handleEnd);
    socket.on("draw-shape", handleShape);
    socket.on("clear-canvas", handleClear);

    return () => {
      socket.off("draw-start", handleStart);
      socket.off("draw-move", handleMove);
      socket.off("draw-end", handleEnd);
      socket.off("draw-shape", handleShape);
      socket.off("clear-canvas", handleClear);
    };
  }, [socket]);

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={endDrawing}
      onMouseLeave={endDrawing}
      className="absolute inset-0"
    />
  );
};

export default DrawingCanvas;