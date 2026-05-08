import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

// connect to live server
const socket = io("http://localhost:5000");

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [hasNotif, setHasNotif] = useState(false);

  useEffect(() => {
    // keep user data synced
    const sync = () => setUser(JSON.parse(localStorage.getItem("user")));
    window.addEventListener("storage", sync);

    if (user?._id) {
      socket.emit("join_room", user._id);

      // show new request alerts
      socket.on("new_notification", (data) => {
        setHasNotif(true);
        alert(data.message);
      });

      // update stars in real-time
      socket.on("update_credits", (data) => {
        localStorage.setItem("user", JSON.stringify(data.updatedUser));
        setUser(data.updatedUser);
        console.log("Wallet Updated:", data.updatedUser.credits);
      });
    }

    return () => {
      window.removeEventListener("storage", sync);
      socket.off("new_notification");
      socket.off("update_credits");
    };
  }, [user?._id]);

  if (!user) return null;

  return (
    <nav style={{ padding: '15px 20px', position: 'sticky', top: 0, zIndex: 1000 }}>
      <div style={{ 
        maxWidth: '1100px', margin: '0 auto', background: 'rgba(255, 255, 255, 0.9)', 
        backdropFilter: 'blur(10px)', padding: '12px 30px', borderRadius: '50px', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        border: '4px solid #ffecf2', boxShadow: '0 8px 20px rgba(255, 133, 179, 0.15)'
      }}>
        <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#ffd670', padding: '8px', borderRadius: '15px', transform: 'rotate(-10deg)' }}>
            <span style={{ fontSize: '24px' }}>🚀</span>
          </div>
          <span style={{ fontSize: '26px', fontWeight: '900', color: '#ff85b3' }}>SkillSwap!</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* user star balance display */}
          <div style={{ background: '#e0f7ff', padding: '10px 20px', borderRadius: '25px', border: '3px solid #b3e5fc' }}>
            <span style={{ fontWeight: '900', color: '#0288d1', fontSize: '18px' }}>✨ {user.credits} Stars</span>
          </div>
          
          <Link to="/inbox" onClick={() => setHasNotif(false)} style={{ fontSize: '30px', position: 'relative', textDecoration: 'none' }}>
            📬 {hasNotif && <span style={{ position: 'absolute', top: 0, right: -5, height: '14px', width: '14px', background: '#ff5252', borderRadius: '50%', border: '3px solid white', animation: 'bounce 1s infinite' }} />}
          </Link>
          
          <button onClick={() => {localStorage.clear(); navigate("/login")}} className="bouncy-btn btn-pink" style={{ padding: '10px 20px' }}>Bye-Bye!</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;