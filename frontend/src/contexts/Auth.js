import React, { useState } from 'react';
import axios from 'axios';

const AuthContext = React.createContext();

const url = process.env.REACT_APP_API_URL;

function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [timer, setTimer] = useState(undefined);

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

  function getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');

    if (token && expirationDate) {
      return {
        token,
        expirationDate: new Date(expirationDate),
        userId,
      };
    }

    return undefined;
  }

  function logOut() {
    // TODO: Remove local storage
    setUser(undefined);
    clearTimeout(timer);
    clearAuthData();
  }

  function setAuthTimer(duration) {
    setTimer(setTimeout(() => {
      logOut();
    }, duration * 1000));
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
        setAuthTimer(expiresIn);
        setUser(user);

        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresIn * 1000);

        saveAuthData(token, expirationDate, user._id);
      }

      // TODO: Error Message
    });
  }

  function autoLogin() {
    const authInfo = getAuthData();

    if (authInfo) {
      const now = new Date();
      const expiresIn = authInfo.expirationDate.getTime() - now.getTime();

      if (expiresIn > 0) {
        setUser(authInfo.userId);
        setAuthTimer(expiresIn / 1000);
      }
    }
  }

  const context = {
    user,
    logOut,
    register,
    login,
    autoLogin,
  };

  return (
    <AuthContext.Provider value={context}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
