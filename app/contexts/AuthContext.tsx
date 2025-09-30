import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  token?: string;
}

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuthState();
  }, []);

  const clearError = () => setError(null);

  const checkAuthState = async () => {
    try {
      const userData = await AsyncStorage.getItem('@user');
      const token = await AsyncStorage.getItem('@token');
      
      if (userData && token) {
        const parsedUser = JSON.parse(userData);
        setUser({ ...parsedUser, token });
      }
    } catch (error) {
      console.error('Erro ao verificar estado de autenticação:', error);
      // Limpar dados corrompidos
      await AsyncStorage.multiRemove(['@user', '@token']);
    } finally {
      setIsLoading(false);
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): { isValid: boolean; message?: string } => {
    if (password.length < 6) {
      return { isValid: false, message: 'A senha deve ter pelo menos 6 caracteres' };
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return { isValid: false, message: 'A senha deve conter pelo menos uma letra minúscula' };
    }
    if (!/(?=.*\d)/.test(password)) {
      return { isValid: false, message: 'A senha deve conter pelo menos um número' };
    }
    return { isValid: true };
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validações client-side
      if (!email.trim()) {
        return { success: false, error: 'Email é obrigatório' };
      }
      
      if (!validateEmail(email.trim())) {
        return { success: false, error: 'Formato de email inválido' };
      }
      
      if (!password.trim()) {
        return { success: false, error: 'Senha é obrigatória' };
      }

      // Tentar login via API primeiro
      const apiResponse = await ApiService.login(email.trim().toLowerCase(), password);
      
      if (apiResponse.success && apiResponse.data) {
        const userData: User = {
          id: apiResponse.data.id || Date.now().toString(),
          name: apiResponse.data.name || apiResponse.data.nome || 'Usuário',
          email: email.trim().toLowerCase(),
          token: apiResponse.data.token
        };
        
        setUser(userData);
        await AsyncStorage.setItem('@user', JSON.stringify(userData));
        if (userData.token) {
          await AsyncStorage.setItem('@token', userData.token);
        }
        
        return { success: true };
      }
      
      // Fallback para AsyncStorage (desenvolvimento)
      const usersData = await AsyncStorage.getItem('@users');
      const users = usersData ? JSON.parse(usersData) : [];
      
      const foundUser = users.find((u: any) => 
        u.email === email.trim().toLowerCase() && u.password === password
      );
      
      if (foundUser) {
        const userData: User = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email
        };
        
        setUser(userData);
        await AsyncStorage.setItem('@user', JSON.stringify(userData));
        return { success: true };
      }
      
      return { success: false, error: 'Email ou senha incorretos' };
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro de conexão';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validações client-side
      if (!name.trim()) {
        return { success: false, error: 'Nome é obrigatório' };
      }
      
      if (name.trim().length < 2) {
        return { success: false, error: 'Nome deve ter pelo menos 2 caracteres' };
      }
      
      if (!email.trim()) {
        return { success: false, error: 'Email é obrigatório' };
      }
      
      if (!validateEmail(email.trim())) {
        return { success: false, error: 'Formato de email inválido' };
      }
      
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        return { success: false, error: passwordValidation.message };
      }

      // Tentar registro via API primeiro
      const apiResponse = await ApiService.register(name.trim(), email.trim().toLowerCase(), password);
      
      if (apiResponse.success && apiResponse.data) {
        const userData: User = {
          id: apiResponse.data.id || Date.now().toString(),
          name: name.trim(),
          email: email.trim().toLowerCase(),
          token: apiResponse.data.token
        };
        
        setUser(userData);
        await AsyncStorage.setItem('@user', JSON.stringify(userData));
        if (userData.token) {
          await AsyncStorage.setItem('@token', userData.token);
        }
        
        return { success: true };
      }
      
      // Fallback para AsyncStorage (desenvolvimento)
      const usersData = await AsyncStorage.getItem('@users');
      const users = usersData ? JSON.parse(usersData) : [];
      
      const existingUser = users.find((u: any) => u.email === email.trim().toLowerCase());
      if (existingUser) {
        return { success: false, error: 'Este email já está cadastrado' };
      }
      
      const newUser = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password
      };
      
      users.push(newUser);
      await AsyncStorage.setItem('@users', JSON.stringify(users));
      
      const userData: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      };
      
      setUser(userData);
      await AsyncStorage.setItem('@user', JSON.stringify(userData));
      
      return { success: true };
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro de conexão';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Tentar logout via API
      await ApiService.logout();
    } catch (error) {
      console.warn('Erro no logout da API:', error);
    }
    
    try {
      await AsyncStorage.multiRemove(['@user', '@token']);
      setUser(null);
      setError(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        error,
        login, 
        register, 
        logout, 
        isAuthenticated: !!user,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

