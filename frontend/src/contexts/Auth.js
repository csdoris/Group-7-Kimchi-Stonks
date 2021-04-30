import React, { useState } from 'react';
import axios from 'axios';

const AuthContext = React.createContext();

const URL = process.env.REACT_APP_API_URL;

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

  async function register(firstName, lastName, email, password) {
    try {
      const res = await axios.post(`${URL}/auth/register`, {
        firstName,
        lastName,
        email,
        password,
      });

      const { status, data } = res;
      const { user } = data;
      const { token, expiresIn } = user.accessToken;

      if (status === 201 && token) {
        setUser(user);
        setAuthTimer(expiresIn);

        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresIn * 1000);

        saveAuthData(token, expirationDate);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }

  async function login(email, password) {
    try {
      const res = await axios.post(`${URL}/auth/login`, {
        email,
        password,
      });

      const { status, data } = res;
      const { user } = data;
      const { token, expiresIn } = user.accessToken;

      if (status === 200 && token) {
        setUser(user);
        setAuthTimer(expiresIn);

        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresIn * 1000);

        saveAuthData(token, expirationDate);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }

  function autoLogin() {
    const authInfo = getAuthData();

    if (authInfo) {
      const { token, expirationDate } = authInfo;

      const now = new Date();
      const expiresIn = expirationDate.getTime() - now.getTime();

      if (expiresIn > 0) {
        axios.get(`${URL}/auth/auto-login`, {
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
    axios.get(`${URL}/user/info`, {
      headers: {
        Authorization: `Bearer ${user.accessToken.token}`,
      },
    }).then((res) => {
      const { status, data } = res;
      const { user: updatedUser } = data;

      if (status === 200) {
        setUser({ ...updatedUser, accessToken: user.accessToken });
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
