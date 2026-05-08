import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { storeToken } from "../utils/TokenService";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  // process login form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      // save session data
      localStorage.setItem("user", JSON.stringify(res.data));
      const token = res.data.token;
      storeToken(token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Oops! Wrong magic words! 🧙‍♂️");
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="bubble-card" style={{ width: '100%', maxWidth: '450px', textAlign: 'center' }}>
        <div style={{ fontSize: '50px', marginBottom: '10px' }}>🔐</div>
        <h2 style={{ fontSize: '40px', color: '#ff85b3', margin: '0 0 10px 0' }}>Welcome Back!</h2>
        <p style={{ color: '#70d6ff', fontWeight: '700', marginBottom: '30px' }}>"Don't just scroll, learn a soul!" 🌟</p>
        
        {/* user credentials form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ width: '100%' }}>
            <input
              type="email"
              placeholder="Your Secret Email 📧"
              className="bubbly-input"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div style={{ width: '100%' }}>
            <input
              type="password"
              placeholder="Secret Password 🔑"
              className="bubbly-input"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="bouncy-btn btn-sky" style={{ justifyContent: 'center', fontSize: '22px' }}>
            Enter SkillSwap! 🚀
          </button>
        </form>

        {/* link to signup */}
        <p style={{ marginTop: '30px', fontWeight: '700', color: '#999' }}>
          New here? <Link to="/register" style={{ color: '#ff85b3', textDecoration: 'none' }}>Join the Party! 🎉</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;