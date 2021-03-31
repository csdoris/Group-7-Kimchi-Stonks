import React, { useState } from 'react';

const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);

  function logOut() {
    // TODO: Remove local storage
    console.log('logged out');
    setUser(undefined);
  }

  const context = {
    user,
    setUser,
    logOut,
  };

  return (
    <AuthContext.Provider value={context}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
