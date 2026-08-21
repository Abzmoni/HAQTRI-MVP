import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContainer from "../components/Auth/AuthContainer";

function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await axios.post("http://localhost:4000/api/auth/login", formData);
      
      // Store both token AND user data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify({
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        profilePic: res.data.profilePic,
        isVerified: res.data.isVerified
      }));
      
      setMessage("Login successful! Redirecting...");
      
      // Force page reload to trigger AuthContext initialization
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
      
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <AuthContainer isSignIn={true}>
      <div className="auth-header">
        <div className="auth-logo">
          <div className="logo-icon">H</div>
          <div className="logo-text">Haqtri</div>
        </div>
        <h2>Welcome Back</h2>
        <p>Access your premium real estate dashboard</p>
      </div>
      
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            name="email" 
            placeholder="Enter your email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            disabled={loading}
          />
          <i className="fas fa-envelope"></i>
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            name="password" 
            placeholder="Enter your password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            disabled={loading}
          />
          <i className="fas fa-lock"></i>
        </div>
        
        <div className="form-options">
          <label className="remember-me">
            <input type="checkbox" />
            <span className="checkmark"></span>
            Remember me
          </label>
          <a href="#" className="forgot-password">Forgot password?</a>
        </div>
        
        <button type="submit" className="auth-btn" disabled={loading}>
          <span>{loading ? "Signing In..." : "Sign In"}</span>
          <i className="fas fa-arrow-right"></i>
        </button>
      </form>

      {message && (
        <div className={`auth-message ${message.includes("successful") ? "success" : "error"}`}>
          {message}
        </div>
      )}
      
      <div className="auth-divider">
        <span>Or continue with</span>
      </div>
      
      <div className="social-auth">
        <button className="social-btn google-btn" type="button" disabled={loading}>
          <i className="fab fa-google"></i>
          Google
        </button>
        <button className="social-btn facebook-btn" type="button" disabled={loading}>
          <i className="fab fa-facebook-f"></i>
          Facebook
        </button>
      </div>
      
      <p className="auth-footer">
        Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link>
      </p>
    </AuthContainer>
  );
}

export default SignIn;