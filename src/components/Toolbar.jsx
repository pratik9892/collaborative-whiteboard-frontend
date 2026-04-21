import React from "react";
import { useNavigate } from "react-router-dom";

const Toolbar = ({
color,
setColor,
strokeWidth,
setStrokeWidth,
onClear,
tool,
setTool,
}) => {
const navigate = useNavigate();

const handleLeaveRoom = () => {
navigate("/");
};

const colors = [
"#000000",
"#ef4444",
"#f97316",
"#eab308",
"#22c55e",
"#3b82f6",
"#8b5cf6",
"#ec4899",
"#6b7280",
];

return ( <div className="w-full backdrop-blur-xl bg-white/90 shadow-xl rounded-2xl px-4 py-3 border border-white/20 flex flex-wrap items-center justify-between gap-4">


  {/* ===== LEFT: TOOLS ===== */}
  <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-full">

    <button
      onClick={() => setTool("pencil")}
      className={`flex items-center gap-1 px-3 py-2 rounded-full transition
      ${
        tool === "pencil"
          ? "bg-blue-600 text-white shadow"
          : "hover:bg-gray-200 text-gray-700"
      }`}
    >
      ✏️ <span className="text-sm">Pencil</span>
    </button>

    <button
      onClick={() => setTool("eraser")}
      className={`flex items-center gap-1 px-3 py-2 rounded-full transition
      ${
        tool === "eraser"
          ? "bg-blue-600 text-white shadow"
          : "hover:bg-gray-200 text-gray-700"
      }`}
    >
      🧽 <span className="text-sm">Eraser</span>
    </button>

  </div>

  {/* ===== CENTER: CONTROLS ===== */}
  <div className="flex items-center gap-4 flex-wrap">

    {/* Color */}
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500">Color</span>
      <div className="flex gap-2">
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            style={{ backgroundColor: c }}
            className={`w-7 h-7 rounded-full border-2 transition
            ${
              color === c
                ? "border-black scale-110"
                : "border-transparent hover:scale-105"
            }`}
          />
        ))}
      </div>
    </div>

    {/* Stroke */}
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500">Size</span>
      <input
        type="range"
        min="1"
        max="20"
        value={strokeWidth}
        onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
        className="w-28 accent-blue-600"
      />
      <span className="text-xs text-gray-600">{strokeWidth}px</span>
    </div>

  </div>

  {/* ===== RIGHT: ACTIONS ===== */}
  <div className="flex items-center gap-2">

    <button
      onClick={onClear}
      className="flex items-center gap-1 px-3 py-2 rounded-full bg-gray-800 text-white 
      hover:bg-gray-700 transition hover:scale-105 active:scale-95"
    >
      🧹 <span className="text-sm">Clear</span>
    </button>

    <button
      onClick={handleLeaveRoom}
      className="flex items-center gap-1 px-3 py-2 rounded-full bg-red-500 text-white 
      hover:bg-red-600 transition hover:scale-105 active:scale-95"
    >
      🚪 <span className="text-sm">Leave</span>
    </button>

  </div>
</div>


);
};

export default Toolbar;
