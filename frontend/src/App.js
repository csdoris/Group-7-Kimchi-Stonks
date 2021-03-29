import React from 'react';

import { AuthProvider } from './providers/AuthProvider';
import RootRouter from './routes/RootRouter';

function App() {
  return (
    <AuthProvider>
      <RootRouter />
    </AuthProvider>
  );
}

export default App;
