import { useState, useEffect } from "react";
import io from "socket.io-client";

// connect to chat server
const socket = io("http://localhost:5000");

const Chat = ({ receiverId, receiverName }) => {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  // handle real-time messaging
  useEffect(() => {
    if (user?._id) {
      socket.emit("join_room", user._id);
    }

    socket.on("receive_message", (data) => {
      setChatLog((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, [user?._id]);

  // send text to partner
  const sendMessage = () => {
    if (!message.trim()) return;
    const data = { senderId: user._id, receiverId, text: message, senderName: user.name };
    socket.emit("send_message", data);
    setChatLog((prev) => [...prev, data]);
    setMessage("");
  };

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', height: '500px', width: '100%', 
      background: 'white', borderRadius: '35px', overflow: 'hidden',
      border: '6px solid #e0f7ff', boxShadow: '0 15px 0 0 #f0f9ff'
    }}>
      {/* playful chat header */}
      <div style={{ 
        background: '#70d6ff', padding: '15px 20px', color: 'white', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>💬</span>
          <span style={{ fontWeight: '900', fontSize: '18px' }}>Chat with {receiverName}!</span>
        </div>
        <button 
          onClick={() => window.open("https://meet.google.com/new", "_blank")} 
          className="bouncy-btn btn-yellow" 
          style={{ padding: '8px 15px', fontSize: '12px', borderRadius: '12px' }}
        >
          🎥 MEET!
        </button>
      </div>

      {/* message bubble area */}
      <div style={{ 
        flexGrow: 1, overflowY: 'auto', padding: '20px', 
        background: '#fff9fb', display: 'flex', flexDirection: 'column', gap: '12px' 
      }}>
        {chatLog.map((msg, index) => {
          const isMe = msg.senderId === user._id;
          return (
            <div key={index} style={{ 
              display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start',
              width: '100%'
            }}>
              <div style={{ 
                maxWidth: '80%', padding: '12px 18px', borderRadius: isMe ? '25px 25px 0 25px' : '25px 25px 25px 0',
                background: isMe ? '#ff85b3' : 'white', 
                color: isMe ? 'white' : '#444',
                fontWeight: '700', fontSize: '15px',
                boxShadow: isMe ? '0 4px 0 0 #d64d81' : '0 4px 0 0 #eee',
                border: isMe ? 'none' : '3px solid #f0f0f0'
              }}>
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* user message input */}
      <div style={{ padding: '15px', background: 'white', borderTop: '4px solid #f0f9ff', display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          className="bubbly-input" 
          placeholder="Type a magic message... ✨" 
          style={{ padding: '12px 20px', fontSize: '15px' }}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button 
          onClick={sendMessage} 
          className="bouncy-btn btn-pink" 
          style={{ borderRadius: '15px', padding: '10px 20px' }}
        >
          SEND!
        </button>
      </div>
    </div>
  );
};

export default Chat;