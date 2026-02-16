import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { signInWithPopup } from "firebase/auth"; // 👈 Firebase functions
import { auth, provider } from '../../firebase'; // 👈 Your config
import styles from './login.module.css';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // NORMAL LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const endpoint = isSignup ? 'https://moodokka-backend.onrender.com/api/auth/register' : 'https://moodokka-backend.onrender.com/api/auth/login';

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

  // GOOGLE LOGIN HANDLER
  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      // 1. Pop up Google Window
      const result = await signInWithPopup(auth, provider);
      const googleEmail = result.user.email;

      // 2. Send Email to Backend to create account/login
      const response = await axios.post('/api/auth/google', { 
        email: googleEmail 
      });

      // 3. Login with the token our backend gave us
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