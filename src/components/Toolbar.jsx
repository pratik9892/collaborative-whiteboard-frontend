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

  const tools = [
    { id: "pencil", label: "✏️ Pencil" },
    { id: "eraser", label: "🧽 Eraser" },
    { id: "line", label: "📏 Line" },
    { id: "rectangle", label: "▭ Rect" },
    { id: "circle", label: "⚪ Circle" },
    { id: "text", label: "🔤 Text" },
  ];

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

  return (
    <div className="w-full bg-white border-b border-gray-200 px-4 py-2 flex flex-wrap items-center justify-between gap-3">

      {/* TOOLS */}
      <div className="flex items-center gap-2 flex-wrap">
        {tools.map((t) => (
          <button
            key={t.id}
            onClick={() => setTool(t.id)}
            className={`px-3 py-1.5 rounded-md text-sm transition
              ${
                tool === t.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* CONTROLS */}
      <div className="flex items-center gap-4 flex-wrap">

        {/* COLORS */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Color</span>
          <div className="flex gap-2">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                style={{ backgroundColor: c }}
                className={`w-6 h-6 rounded-full border-2
                  ${
                    color === c
                      ? "border-black scale-110"
                      : "border-transparent"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* STROKE */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Size</span>
          <input
            type="range"
            min="1"
            max="20"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
          />
          <span className="text-xs">{strokeWidth}px</span>
        </div>

      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-2">

        <button
          onClick={onClear}
          className="px-3 py-1.5 bg-gray-800 text-white rounded-md hover:bg-gray-700"
        >
          🧹 Clear
        </button>

        <button
          onClick={handleLeaveRoom}
          className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          🚪 Leave
        </button>

      </div>
    </div>
  );
};

export default Toolbar;