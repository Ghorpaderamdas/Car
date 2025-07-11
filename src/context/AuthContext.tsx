import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserDto, LoginResponseDto } from '../types';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: UserDto | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (name: string, email: string, phoneNumber: string, password: string, roles: string[]) => Promise<void>;
  setUser: (user: UserDto | null) => void;
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
  const [user, setUser] = useState<UserDto | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting login for:', email);
      
      const response = await authAPI.login({ email, password });
      console.log('✅ Login response:', response.data);
      
      const { accessToken } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      setToken(accessToken);
      
      // Fetch user data separately since backend doesn't return user in login response
      try {
        const userResponse = await authAPI.getUserByEmail(email);
        console.log('✅ User data:', userResponse.data);
        
        const userData = userResponse.data;
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
        toast.success('Login successful!');
      } catch (userError) {
        console.warn('⚠️ Could not fetch user data:', userError);
        toast.error('Login successful but could not fetch user data');
      }
      
    } catch (error: any) {
      console.error('❌ Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const signup = async (name: string, email: string, phoneNumber: string | undefined, password: string, roles: string[]) => {
    try {
      console.log('📝 Attempting signup for:', email, 'with roles:', roles);
      
      await authAPI.signup({ 
        name, 
        email, 
        phoneNumber: phoneNumber || '', 
        password, 
        roles 
      });
      
      console.log('✅ Signup successful');
      toast.success('Signup successful! Please login.');
    } catch (error: any) {
      console.error('❌ Signup error:', error);
      toast.error(error.response?.data?.message || 'Signup failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    logout,
    signup,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};