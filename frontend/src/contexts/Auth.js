import React, { useState } from 'react';
import axios from 'axios';

const AuthContext = React.createContext();

const url = process.env.REACT_APP_API_URL;

function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [token, setToken] = useState(undefined);

  function saveAuthData(token, expirationDate, userId) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  function clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  function logOut() {
    // TODO: Remove local storage
    setUser(undefined);
    clearAuthData();
    console.log(token);
  }

  function setAuthTimer(duration) {
    setTimeout(() => {
      logOut();
    }, duration * 1000);
  }

  function register(firstName, lastName, email, password) {
    axios.post(`${url}/auth/register`, {
      firstName,
      lastName,
      email,
      password,
    }).then((res) => {
      const { status, data } = res;
      const { user } = data;

      if (status === 201) {
        setUser(user);
      }

      // TODO: Error Message
    });
  }

  function login(email, password) {
    axios.post(`${url}/auth/login`, {
      email,
      password,
    }).then((res) => {
      const { status, data } = res;
      const { user } = data;
      const { token, expiresIn } = user.accessToken;

      if (status === 200 && token) {
        setToken(token);
        setAuthTimer(5);
        setUser(user);

        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresIn * 1000);

        saveAuthData(token, expirationDate, user._id);

        console.log(expiresIn);
      }

      // TODO: Error Message
    });
  }

  const context = {
    user,
    register,
    login,
    logOut,
  };

  return (
    <AuthContext.Provider value={context}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
