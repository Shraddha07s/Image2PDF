import React from 'react';
import Home from './pages/Home';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Home />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            fontSize: '0.875rem',
            borderRadius: '0.75rem',
            padding: '10px 16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </>
  );
}

export default App;
