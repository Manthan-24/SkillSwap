import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { getApiConfig } from "../utils/APIUtil";

const Dashboard = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [newSkill, setNewSkill] = useState("");
  const [dailyTip, setDailyTip] = useState("Fetching magic wisdom...");

  // get daily motivation
  useEffect(() => {
    fetch("https://api.adviceslip.com/advice")
      .then((res) => res.json())
      .then((data) => setDailyTip(data.slip.advice))
      .catch((err) => {
        console.error("API Error:", err);
        setDailyTip("Believe in your magic! ✨");
      });
  }, []);

  // sync skill updates
  const update = async (newList) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/auth/update-skills/${user._id}`, { skillsOffered: newList }, getApiConfig());
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Update Error:", err);
    }
  };

  // add new superpower
  const add = () => {
    if (newSkill) update([...(user.skillsOffered || []), newSkill]);
    setNewSkill("");
  };

  // remove a skill
  const del = (skill) => update(user.skillsOffered.filter(s => s !== skill));

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '60px', color: '#ff85b3', margin: 0, textShadow: '4px 4px 0px #ffe4ed' }}>Yay, {user.name}! 🌈</h1>
        <p style={{ fontSize: '24px', color: '#70d6ff', fontWeight: '700', marginTop: '10px' }}>"Swap your talent, win the world!" ✨🌍</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', alignItems: 'stretch' }}>
        
        {/* external advice section */}
        <div className="bubble-card" style={{ 
          background: 'linear-gradient(135deg, #70d6ff, #009bd6)', 
          color: 'white', 
          border: 'none', 
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: '250px'
        }}>
          <div style={{ fontSize: '45px', marginBottom: '10px' }}>💡</div>
          <p style={{ fontWeight: '900', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '2px', opacity: 0.9 }}>
            Daily Magic Tip
          </p>
          <h3 style={{ 
            fontSize: '24px', 
            lineHeight: '1.4', 
            margin: '15px 0', 
            fontWeight: '700',
            padding: '0 15px'
          }}>
            "{dailyTip}"
          </h3>
          <p style={{ fontSize: '12px', fontWeight: '900', marginTop: '10px', color: '#ffd670' }}>
            KEEP GOING, SUPERSTAR! 🌟
          </p>
        </div>

        {/* skill list management */}
        <div className="bubble-card">
          <h3 style={{ marginTop: 0, fontSize: '24px', color: '#444' }}>What's your Superpower? 🦸‍♂️</h3>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
            <input 
              value={newSkill} 
              onChange={e => setNewSkill(e.target.value)} 
              className="bubbly-input" 
              placeholder="I can teach... (e.g. Drawing!)" 
            />
            <button onClick={add} className="bouncy-btn btn-yellow">ADD!</button>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {user.skillsOffered?.map(s => (
              <div key={s} style={{ background: '#e0fff4', padding: '12px 25px', borderRadius: '20px', border: '3px solid #99ffd1', fontWeight: '900', color: '#2d6a4f', display: 'flex', alignItems: 'center', gap: '10px' }}>
                ✅ {s} 
                <button onClick={() => del(s)} style={{ border: 'none', background: '#ffccd5', color: '#ff4d6d', borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer', fontWeight: '900' }}>×</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* link to marketplace */}
      <div style={{ textAlign: 'center', marginTop: '60px' }}>
        <Link to="/marketplace" className="bouncy-btn btn-sky" style={{ fontSize: '24px', padding: '25px 50px', borderRadius: '30px' }}>
          Go Shopping for Skills! 🛍️
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;