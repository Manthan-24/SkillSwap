import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Chat from "../components/Chat";
import { getApiConfig } from "../utils/APIUtil";

const RequestsInbox = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  // fetch user inbox requests
  const load = useCallback(async (isMounted) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/requests/my-inbox/${user._id}`, getApiConfig());
      if (isMounted) {
        setRequests(res.data);
        setLoading(false);
      }
    } catch (err) {
      if (isMounted) {
        console.error("Mailbox Sync Error:", err);
        setLoading(false);
      }
    }
  }, [user._id]);

  useEffect(() => {
    let isMounted = true;
    const initLoad = async () => { await load(isMounted); };
    initLoad();
    return () => { isMounted = false; };
  }, [load]);

  // handle accept or reject
  const action = async (id, status) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/requests/update/${id}`, { status }, getApiConfig());
      
      if (status === "accepted") {
        // sync local star balance
        localStorage.setItem("user", JSON.stringify(res.data.updatedUser));
        window.dispatchEvent(new Event("storage"));
      }
      
      await load(true);
    } catch (err) {
      console.error("Action Error:", err);
    }
  };

  // delete completed swap session
  const end = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/requests/end/${id}`, getApiConfig());
      setActiveChat(null);
      await load(true);
    } catch (err) {
      console.error("End Session Error:", err);
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '100px' }}>
      <h1 className="animate-bounce" style={{ fontSize: '50px' }}>🌀</h1>
      <p style={{ fontWeight: '900', color: '#ff85b3', letterSpacing: '2px' }}>POLISHING YOUR MAILBOX...</p>
    </div>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <header style={{ marginBottom: '50px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '50px', color: '#2d3436', margin: 0, textShadow: '3px 3px 0px #ffe4ed' }}>Your Inbox 📩</h1>
        <p style={{ fontSize: '20px', color: '#70d6ff', fontWeight: '700' }}>"Swap your talent, win the world!" ✨</p>
      </header>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'flex-start' }}>
        
        {/* display active skill requests */}
        <div style={{ flex: '1', minWidth: '350px', display: 'grid', gap: '25px' }}>
          {requests.length > 0 ? requests.map(req => {
            const isTeacher = req.receiverId._id === user._id;
            const partner = isTeacher ? req.senderId : req.receiverId;
            const isAccepted = req.status === "accepted";

            return (
              <div key={req._id} className="bubble-card" style={{ 
                borderLeft: `15px solid ${isAccepted ? '#99ffd1' : '#ffd670'}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '20px',
                background: '#fff',
                borderRadius: '20px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
              }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '22px' }}>{partner.name} 👤</h3>
                  <p style={{ color: '#70d6ff', fontWeight: '900', margin: '5px 0' }}>
                    {req.skillName} <span style={{ fontSize: '10px', background: '#eee', padding: '2px 8px', borderRadius: '10px', marginLeft: '10px' }}>{req.status.toUpperCase()}</span>
                  </p>
                </div>
                
                {/* buttons for request actions */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  {req.status === "pending" && isTeacher && (
                    <>
                      <button onClick={() => action(req._id, "accepted")} className="bouncy-btn btn-sky" style={{ padding: '10px 20px', cursor: 'pointer' }}>YES! ✅</button>
                      <button onClick={() => action(req._id, "rejected")} className="bouncy-btn btn-pink" style={{ padding: '10px 20px', cursor: 'pointer' }}>NO ❌</button>
                    </>
                  )}
                  {isAccepted && (
                    <>
                      <button onClick={() => setActiveChat({ id: partner._id, name: partner.name })} className="bouncy-btn btn-yellow" style={{ padding: '10px 20px', cursor: 'pointer' }}>CHAT! 💬</button>
                      <button onClick={() => end(req._id)} className="bouncy-btn btn-pink" style={{ padding: '10px 15px', cursor: 'pointer' }}>End</button>
                    </>
                  )}
                </div>
              </div>
            );
          }) : (
            <div className="bubble-card" style={{ textAlign: 'center', opacity: 0.6, borderStyle: 'dashed', padding: '40px' }}>
              <p style={{ fontSize: '20px', fontWeight: '700' }}>No mail yet! 🕸️ Go swap some skills!</p>
            </div>
          )}
        </div>

        {/* side panel for chat */}
        <div style={{ width: '450px', position: 'sticky', top: '120px' }}>
          {activeChat ? (
            <div className="bubble-card" style={{ border: '8px solid #70d6ff', padding: '0', overflow: 'hidden', borderRadius: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 20px', background: '#70d6ff', color: 'white' }}>
                <span style={{ fontWeight: '900' }}>Talking to: {activeChat.name}</span>
                <button onClick={() => setActiveChat(null)} style={{ border: 'none', background: 'white', borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer', fontWeight: 'bold' }}>×</button>
              </div>
              <Chat receiverId={activeChat.id} receiverName={activeChat.name} />
            </div>
          ) : (
            <div className="bubble-card" style={{ textAlign: 'center', background: '#fdfdfd', border: '5px dashed #ccc', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '25px' }}>
              <p style={{ fontWeight: '700', color: '#bbb', textTransform: 'uppercase', letterSpacing: '1px' }}>Select a chat to<br/>start talking! 🗣️</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default RequestsInbox;