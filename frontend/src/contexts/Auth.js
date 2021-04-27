import React, { useState } from 'react';
import axios from 'axios';

const AuthContext = React.createContext();

const url = process.env.REACT_APP_API_URL;

function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [timer, setTimer] = useState(undefined);

  function updateUser(updatedUser) {
    setUser({ ...updatedUser, accessToken: user.accessToken });
  }

  function saveAuthData(token, expirationDate) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  function clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  function getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');

    if (token && expirationDate) {
      return {
        token,
        expirationDate: new Date(expirationDate),
      };
    }

    return undefined;
  }

  function logOut() {
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
      const { token, expiresIn } = user.accessToken;

      if (status === 201 && token) {
        setUser(user);
        setAuthTimer(expiresIn);

        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresIn * 1000);

        saveAuthData(token, expirationDate);
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
        setUser(user);
        setAuthTimer(expiresIn);

        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresIn * 1000);

        saveAuthData(token, expirationDate);
      }

      // TODO: Error Message
    });
  }

  function autoLogin() {
    const authInfo = getAuthData();

    if (authInfo) {
      const { token, expirationDate } = authInfo;

      const now = new Date();
      const expiresIn = expirationDate.getTime() - now.getTime();

      if (expiresIn > 0) {
        axios.get(`${url}/auth/auto-login`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((res) => {
          const { status, data } = res;
          const { user } = data;

          if (status === 200) {
            setUser(user);
            setAuthTimer(expiresIn / 1000);
          }
        });
      }
    }
  }

  function retrieveUserInfo() {
    axios.get(`${url}/user/info`, {
      headers: {
        Authorization: `Bearer ${user.accessToken.token}`,
      },
    }).then((res) => {
      const { status, data } = res;
      const { user } = data;

      if (status === 200) {
        setUser(user);
      }
    });
  }

  const context = {
    user,
    updateUser,
    logOut,
    register,
    login,
    autoLogin,
    retrieveUserInfo,
  };

  return (
    <AuthContext.Provider value={context}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
