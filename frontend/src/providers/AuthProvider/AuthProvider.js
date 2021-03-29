import React, { useState } from 'react';

const AuthContext = React.createContext();

function AuthProvider ({ children }) {
  const [user, setUser] = useState(undefined);

  const context = {
    user,
    setUser
  };

  return (
    <AuthContext.Provider value={context}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
