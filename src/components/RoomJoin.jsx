import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const isValidRoomCode = (code) => /^[a-zA-Z0-9]{6,8}$/.test(code);

const generateRoomCode = () => {
const chars =
"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
let code = "";
for (let i = 0; i < 6; i++) {
code += chars.charAt(Math.floor(Math.random() * chars.length));
}
return code;
};

const RoomJoin = () => {
const [roomCode, setRoomCode] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [showMenu, setShowMenu] = useState(false);

const navigate = useNavigate();
const { user, logout } = useAuth();

const handleJoin = (e) => {
e.preventDefault();
const trimmedCode = roomCode.trim();


if (!isValidRoomCode(trimmedCode)) {
  setError("Room code must be 6–8 alphanumeric characters");
  return;
}

navigate(`/room/${trimmedCode}`);


};

const handleCreateRoom = () => {
const newCode = generateRoomCode();
navigate(`/room/${newCode}`);
};

const handleLogout = async () => {
try {
await logout();
navigate("/login");
} catch (err) {
console.error("Logout failed:", err);
}
};

// Avatar initials
const initials = user?.name
? user.name
.split(" ")
.map((n) => n[0])
.join("")
.toUpperCase()
: "U";

return ( <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-600 px-4">


  {/* ===== Avatar Top Right ===== */}
  <div className="absolute top-4 right-4">
    <div className="relative">
      <div
        onClick={() => setShowMenu((prev) => !prev)}
        className="w-12 h-12 rounded-full bg-white/90 backdrop-blur flex items-center justify-center 
        font-bold text-gray-800 shadow-lg cursor-pointer hover:scale-105 transition"
      >
        {initials}
      </div>

      {/* Dropdown */}
      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl p-3 animate-fadeIn">
          <p className="text-sm text-gray-500">Signed in as</p>
          <p className="font-semibold text-gray-800">{user?.name}</p>
          <p className="text-xs text-gray-500 mb-3">@{user?.username}</p>

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  </div>

  {/* ===== MAIN CARD ===== */}
  <div className="w-full max-w-md backdrop-blur-xl bg-white/90 shadow-2xl rounded-2xl p-8 border border-white/20">

    {/* Header */}
    <div className="text-center mb-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-1">
        Welcome {user?.name?.split(" ")[0]} 👋
      </h1>
      <p className="text-gray-500 text-sm">
        Start or join a collaborative whiteboard
      </p>
    </div>

    {/* Create Room (Primary Action) */}
    <button
      onClick={handleCreateRoom}
      className="w-full mb-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-xl 
      shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
    >
      🚀 Create New Room
    </button>

    {/* Divider */}
    <div className="flex items-center my-4">
      <div className="flex-1 h-px bg-gray-300" />
      <span className="px-3 text-sm text-gray-400">or join with code</span>
      <div className="flex-1 h-px bg-gray-300" />
    </div>

    {/* Join Room */}
    <form onSubmit={handleJoin} className="space-y-4">
      <input
        type="text"
        placeholder="Enter Room Code"
        value={roomCode}
        onChange={(e) => {
          setRoomCode(e.target.value);
          setError("");
        }}
        maxLength={8}
        disabled={loading}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white/80 text-black
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        transition-all duration-200 text-center tracking-widest"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gray-800 text-white py-2.5 rounded-lg 
        hover:bg-gray-700 hover:scale-[1.02] active:scale-[0.98]
        transition-all duration-200 disabled:opacity-50"
      >
        {loading ? "Joining..." : "Join Room"}
      </button>
    </form>

    {/* Error */}
    {error && (
      <p className="text-red-500 mt-3 text-sm text-center animate-pulse">
        {error}
      </p>
    )}
  </div>
</div>

);
};

export default RoomJoin;
