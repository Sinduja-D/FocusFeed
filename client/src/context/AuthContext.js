import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    user: null,
    loading: true
  });

  useEffect(() => {
    const loadUser = async () => {
      if (auth.token) {
        try {
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${auth.token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setAuth({
              token: auth.token,
              user: data.data,
              loading: false
            });
          } else {
            setAuth({
              token: null,
              user: null,
              loading: false
            });
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Error loading user:', error);
          setAuth({
            token: null,
            user: null,
            loading: false
          });
          localStorage.removeItem('token');
        }
      } else {
        setAuth({
          token: null,
          user: null,
          loading: false
        });
      }
    };

    loadUser();
  }, [auth.token]);

  const login = (token, user) => {
    setAuth({
      token,
      user,
      loading: false
    });
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setAuth({
      token: null,
      user: null,
      loading: false
    });
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;