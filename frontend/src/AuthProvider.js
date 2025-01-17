import React, { createContext, useContext } from 'react';
import { auth } from './firebase'; // Adjust the import path to match your project
import { useAuthState } from 'react-firebase-hooks/auth';

// Create a context for authentication
const AuthContext = createContext();

// Define the AuthProvider
export const AuthProvider = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);