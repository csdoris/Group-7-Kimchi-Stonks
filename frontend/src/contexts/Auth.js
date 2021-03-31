import React, { useState } from 'react';
import axios from 'axios';

const AuthContext = React.createContext();

const url = process.env.REACT_APP_API_URL;

function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);

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

      if (status === 200) {
        setUser(user);
      }

      // TODO: Error Message
    });
  }

  function logOut() {
    // TODO: Remove local storage
    setUser(undefined);
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
