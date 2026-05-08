import { useState, useEffect } from "react";
import axios from "axios";
import { getApiConfig } from "../utils/APIUtil";

const Marketplace = () => {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // load all available teachers
  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get("http://localhost:5000/api/auth/all-users", getApiConfig());
      setUsers(res.data.filter(u => u._id !== currentUser._id));
    };
    fetch();
  }, );

  // send skill swap request
  const handleRequest = async (receiverId, skill) => {
    try {
      await axios.post("http://localhost:5000/api/requests/send", { senderId: currentUser._id, receiverId, skillName: skill }, getApiConfig());
      alert("Sent! Wait for your teacher to say YES! 🎈");
    } catch (err) { alert(err.response.data); }
  };

  // search logic for skills
  const filtered = users.filter(u => u.skillsOffered.some(s => s.toLowerCase().includes(query.toLowerCase())));

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '45px', fontWeight: '900' }}>The Skill Shop 🍭</h1>
        {/* search bar for marketplace */}
        <input type="text" placeholder="Search skills..." className="bubbly-input" style={{ maxWidth: '400px' }} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
        {filtered.map(u => (
          <div key={u._id} className="bubble-card">
            {/* user profile thumbnail */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ width: '60px', height: '60px', background: '#ff85b3', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '900', color: 'white' }}>{u.name[0]}</div>
              <h3 style={{ margin: 0 }}>{u.name}</h3>
            </div>
            {/* list of teachable skills */}
            {u.skillsOffered.map(skill => (
              <button key={skill} onClick={() => handleRequest(u._id, skill)} className="bouncy-btn btn-yellow" style={{ width: '100%', marginBottom: '10px' }}>Learn {skill}! 🎨</button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;