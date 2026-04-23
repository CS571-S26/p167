import React, { useState, useContext } from "react";
import { useUser } from "../../hooks/useUser";
import { motion, AnimatePresence } from "framer-motion";
import ThemeContext from "../../contexts/ThemeContext";

const Profile = () => {
  const { user, login, register, logout } = useUser();
  const [theme] = useContext(ThemeContext) || ["dark"];
  const isDark = theme === "dark";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await register(email, password);
        // Email confirmation is off for now on Supabase, can be enabled later
        // alert("Check your email for a confirmation link!");
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className={`auth-page-container ${isDark ? 'dark-theme' : ''}`}>
      <AnimatePresence mode="wait">
        {!user ? (
          <motion.div 
            key="auth"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="auth-card text-center"
          >
            <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
              <div className="pulse-dot" />
              <span className="status-text text-primary" style={{ letterSpacing: '0.3em', fontSize: '0.7rem', fontWeight: 800 }}>
                World News Mapper
              </span>
            </div>

            <h2 className="display-6 fw-bold tracking-tighter mb-4">
              {isRegistering ? "New Account" : "Welcome Back"}
            </h2>

            <form onSubmit={handleSubmit} className="text-start">
              <label className="extra-small fw-bold opacity-50 mb-2 ms-1">Email Address</label>
              <input 
                type="email" 
                className="terminal-input"
                placeholder="name@domain.com" 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
              
              <label className="extra-small fw-bold opacity-50 mb-2 ms-1">Password</label>
              <input 
                type="password" 
                className="terminal-input"
                placeholder="" 
                onChange={e => setPassword(e.target.value)} 
                required 
              />

              <button type="submit" className="btn-luxury w-100 py-3 mt-2">
                {isRegistering ? "Register" : "Login"}
              </button>
            </form>

            <button 
              className="auth-toggle-btn" 
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? "Already have an account? Sign in" : "Create an account"}
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="profile"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="auth-card text-center"
          >
            <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
              <div className="pulse-dot" />
              <span className="status-text text-primary" style={{ letterSpacing: '0.3em', fontSize: '0.7rem', fontWeight: 800 }}>
                World News Mapper
              </span>
            </div>

            <div className="py-4">
              <h3 className="extra-small fw-bold opacity-50 mb-1">You are currently logged in as</h3>
              <h3 className="fw-bold tracking-tighter mb-4">{user.email}</h3>
            </div>

            <button onClick={logout} className="btn-luxury-outline w-100 py-3">
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;