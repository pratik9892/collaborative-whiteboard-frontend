import React, { useEffect, useRef, useState } from "react";
import { getSocket } from "../socket.js";
import { useAuth } from "../hooks/useAuth.js";

const Chat = ({ roomId }) => {
const socketRef = useRef(null);
const [messages, setMessages] = useState([]);
const [input, setInput] = useState("");
const [userCount, setUserCount] = useState(1); // 🔥 added
const chatEndRef = useRef(null);

const { user } = useAuth();
const currentUserId = user?.id || user?.username || "anon";

useEffect(() => {
socketRef.current = getSocket();


// messages
socketRef.current.on("init-messages", (msgs) => {
  setMessages(msgs);
});

socketRef.current.on("receive-message", (msg) => {
  setMessages((prev) => [...prev, msg]);
});

// 🔥 user count
socketRef.current.on("user-count", (count) => {
  setUserCount(count);
});

return () => {
  socketRef.current.off("init-messages");
  socketRef.current.off("receive-message");
  socketRef.current.off("user-count");
};


}, []);

useEffect(() => {
chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

const sendMessage = () => {
if (!input.trim()) return;

const message = {
  text: input,
  username: user?.username || "anon",
  userId: currentUserId,
  time: new Date().toLocaleTimeString(),
};

socketRef.current.emit("send-message", { roomId, message });
setInput("");


};

const getInitial = (name) => name?.[0]?.toUpperCase() || "U";

return ( <div className="w-80 h-full flex flex-col bg-white border-l border-gray-300 shadow-lg">


  {/* HEADER */}
  <div className="px-4 py-3 flex items-center justify-between border-b bg-white">

    <div className="flex items-center gap-2">
      <h2 className="font-semibold text-gray-900">💬 Chat</h2>

      {/* 👥 user count badge */}
      <span className="flex items-center gap-1 bg-gray-200 text-gray-800 text-xs px-2 py-0.5 rounded-full font-medium">
        👥 {userCount}
      </span>
    </div>

    <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
      Live
    </div>
  </div>

  {/* MESSAGES */}
  <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 bg-gray-100">
    {messages.length === 0 && (
      <p className="text-center text-gray-500 text-sm">
        Start the conversation 👋
      </p>
    )}

    {messages.map((msg, index) => {
      const isMe = msg.userId === currentUserId;

      return (
        <div
          key={index}
          className={`flex items-end gap-2 ${
            isMe ? "justify-end" : "justify-start"
          }`}
        >
          {!isMe && (
            <div className="w-7 h-7 rounded-full bg-gray-400 flex items-center justify-center text-xs font-bold text-white">
              {getInitial(msg.username)}
            </div>
          )}

          <div
            className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow
            ${
              isMe
                ? "bg-blue-600 text-white rounded-br-md"
                : "bg-white text-gray-900 border border-gray-300 rounded-bl-md"
            }`}
          >
            <div className="text-[10px] opacity-70 mb-1">
              {isMe ? "You" : msg.username} • {msg.time}
            </div>
            <div className="break-words">{msg.text}</div>
          </div>

          {isMe && (
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
              {getInitial(user?.username)}
            </div>
          )}
        </div>
      );
    })}

    <div ref={chatEndRef} />
  </div>

  {/* INPUT */}
  <div className="p-3 bg-white border-t">
    <div className="flex items-center gap-2 bg-gray-200 rounded-full px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition">

      <input
        className="flex-1 bg-transparent outline-none text-sm px-2 text-gray-800"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />

      <button
        onClick={sendMessage}
        className="bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition active:scale-95"
      >
        ➤
      </button>
    </div>
  </div>

</div>


);
};

export default Chat;
