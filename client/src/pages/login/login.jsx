import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from '../../firebase';
import styles from './login.module.css';
import { useAuth } from '../../context/AuthContext';

// Logic to pick the right environment variable based on your build tool
const BASE_URL = import.meta.env?.VITE_API_URL || process.env?.REACT_APP_API_URL || 'http://localhost:5000';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Using the BASE_URL from env here
    const endpoint = isSignup 
      ? `${BASE_URL}/api/auth/register` 
      : `${BASE_URL}/api/auth/login`;

    try {
      const response = await axios.post(endpoint, { email, password });
      login(response.data.token, response.data._id);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const googleEmail = result.user.email;

      // Also updated Google login to use BASE_URL
      const response = await axios.post(`${BASE_URL}/api/auth/google`, { 
        email: googleEmail 
      });

      login(response.data.token, response.data._id);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError("Google Login Failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.login}>
      <div className={styles.card}>
        <h1>{isSignup ? 'Create Account' : 'Welcome Back'}</h1>
        {error && <p style={{ color: '#ff7675', marginBottom: '10px' }}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            placeholder="Email Address"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Processing...' : (isSignup ? 'Sign Up' : 'Login')}
          </button>
        </form>

        <button onClick={handleGoogleLogin} className={styles.googleBtn} type="button">
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google" 
            width="20" 
          />
          {isSignup ? 'Sign up with Google' : 'Sign in with Google'}
        </button>

        <div className={styles.footer}>
          <p>
            {isSignup ? 'Already have an account? ' : 'New here? '}
            <span
              onClick={() => setIsSignup(!isSignup)}
              style={{ cursor: 'pointer', color: '#ff9f1c', fontWeight: 'bold' }}
            >
              {isSignup ? 'Login' : 'Create Account'}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;