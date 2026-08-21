import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContainer from "../components/Auth/AuthContainer";

function SignUp() {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "",
    confirmPassword: "" 
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      // Store both token AND user data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify({
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        profilePic: res.data.profilePic,
        isVerified: res.data.isVerified
      }));
      
      setMessage("Registration successful! Redirecting...");
      
      // Force page reload to trigger AuthContext initialization
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
      
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
      setLoading(false);
    }
  };
    
  return (
    <AuthContainer>
      <div className="auth-header">
        <div className="auth-logo">
          <div className="logo-icon">H</div>
          <div className="logo-text">Haqtri</div>
        </div>
        <h2>Create Your Account</h2>
        <p>Join Nigeria's premier real estate community</p>
      </div>
      
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input 
            type="text" 
            name="name" 
            placeholder="Enter your full name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            disabled={loading}
          />
          <i className="fas fa-user"></i>
        </div>
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
            placeholder="Create a password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            disabled={loading}
          />
          <i className="fas fa-lock"></i>
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input 
            type="password" 
            name="confirmPassword" 
            placeholder="Confirm your password" 
            value={formData.confirmPassword} 
            onChange={handleChange} 
            required 
            disabled={loading}
          />
          <i className="fas fa-lock"></i>
        </div>
        
        <button type="submit" className="auth-btn" disabled={loading}>
          <span>{loading ? "Creating Account..." : "Sign Up"}</span>
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
        Already have an account? <Link to="/signin" className="auth-link">Sign In</Link>
      </p>
    </AuthContainer>
  );
}

export default SignUp;