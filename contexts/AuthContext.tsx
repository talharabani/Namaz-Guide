import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  provider: string;
  createdAt: string;
  lastLogin: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('namaz_user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Mock authentication for demo purposes
      if (email && password && password.length >= 6) {
        const mockUser: User = {
          id: 'demo-user-' + Date.now(),
          email: email,
          name: email.split('@')[0],
          picture: undefined,
          provider: 'email',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };

        await AsyncStorage.setItem('namaz_user', JSON.stringify(mockUser));
        setUser(mockUser);
        setIsAuthenticated(true);
      } else {
        throw new Error('Please enter a valid email and password (minimum 6 characters)');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      // Mock authentication for demo purposes
      if (email && password && password.length >= 6 && name) {
        const mockUser: User = {
          id: 'demo-user-' + Date.now(),
          email: email,
          name: name,
          picture: undefined,
          provider: 'email',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };

        await AsyncStorage.setItem('namaz_user', JSON.stringify(mockUser));
        setUser(mockUser);
        setIsAuthenticated(true);
      } else {
        throw new Error('Please enter valid information');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      // Mock Google authentication for demo purposes
      const mockUser: User = {
        id: 'google-user-' + Date.now(),
        email: 'user@gmail.com',
        name: 'Google User',
        picture: undefined,
        provider: 'google.com',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      await AsyncStorage.setItem('namaz_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('namaz_user');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
