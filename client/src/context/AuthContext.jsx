import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Create the Context (The "Box" for our data)
const AuthContext = createContext();

// 2. Create the Provider (The "Manager" of the box)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in when app starts
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (token && userId) {
      setUser({ id: userId }); // We assume they are logged in if token exists
    }
    setLoading(false);
  }, []);

  // Login Function
  const login = (token, userId) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    setUser({ id: userId });
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. Custom Hook (A shortcut to use the context)
export const useAuth = () => useContext(AuthContext);