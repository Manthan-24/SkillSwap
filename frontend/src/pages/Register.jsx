import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  // handle user registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      alert("Registration Successful! 🎉");
      navigate("/login"); 
    } catch (err) {
      console.error(err);
      alert("Something went wrong! 😵");
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <form onSubmit={handleSubmit} className="bubble-card" style={{ width: '100%', maxWidth: '450px', textAlign: 'center' }}>
        <div style={{ fontSize: '50px', marginBottom: '10px' }}>🌟</div>
        <h2 style={{ fontSize: '40px', color: '#ff85b3', margin: '0 0 10px 0' }}>Join SkillSwap!</h2>
        <p style={{ color: '#70d6ff', fontWeight: '700', marginBottom: '30px' }}>Start your magic journey today! ✨</p>
        
        {/* signup input fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ width: '100%' }}>
            <input
              type="text"
              placeholder="Your Cool Name 😎"
              required
              className="bubbly-input"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div style={{ width: '100%' }}>
            <input
              type="email"
              placeholder="Magic Email 📧"
              required
              className="bubbly-input"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div style={{ width: '100%' }}>
            <input
              type="password"
              placeholder="Secret Password 🔑"
              required
              className="bubbly-input"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
        </div>

        {/* submit registration form */}
        <button type="submit" className="bouncy-btn btn-pink" style={{ width: '100%', justifyContent: 'center', fontSize: '22px', marginTop: '30px' }}>
          Create My Account! 🚀
        </button>

        {/* link to login */}
        <p style={{ marginTop: '30px', fontWeight: '700', color: '#999' }}>
          Already have an account? <Link to="/login" style={{ color: '#70d6ff', textDecoration: 'none' }}>Login here! 🚪</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;