
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import ApiService from '../services/api';
import NotificationService from '../services/notificationService';

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
  isAuthenticated: boolean;
  clearError: () => void;

  
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;

  
  setSession: (u: User | null) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const clearError = () => setError(null);

  const setSession = useCallback(async (u: User | null) => {
    if (u) {
      setUser(u);
      const pairs: [string, string][] = [['@user', JSON.stringify(u)]];
      if (u.token) pairs.push(['@token', u.token]);
      await AsyncStorage.multiSet(pairs);
    } else {
      setUser(null);
      await AsyncStorage.multiRemove(['@user', '@token']);
    }
  }, []);

  const checkAuthState = useCallback(async () => {
    try {
      const [userData, token] = await AsyncStorage.multiGet(['@user', '@token']);
      const rawUser = userData?.[1];
      const rawToken = token?.[1];

      if (rawUser) {
        const parsed = JSON.parse(rawUser) as User;
        const u: User = { ...parsed, token: rawToken || parsed.token };
        setUser(u);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Erro ao verificar estado de autenticação:', err);
      await AsyncStorage.multiRemove(['@user', '@token']);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  const validateEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string): { isValid: boolean; message?: string } => {
    if (password.length < 6) return { isValid: false, message: 'A senha deve ter pelo menos 6 caracteres' };
    if (!/(?=.*[a-z])/.test(password)) return { isValid: false, message: 'A senha deve conter pelo menos uma letra minúscula' };
    if (!/(?=.*\d)/.test(password)) return { isValid: false, message: 'A senha deve conter pelo menos um número' };
    return { isValid: true };
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      const e = email.trim().toLowerCase();
      const p = password.trim();

      if (!e) return { success: false, error: 'Email é obrigatório' };
      if (!validateEmail(e)) return { success: false, error: 'Formato de email inválido' };
      if (!p) return { success: false, error: 'Senha é obrigatória' };

      
      const api = await ApiService.login(e, p);
      if (api.success && api.data) {
        const u: User = {
          id: api.data.id || Date.now().toString(),
          name: api.data.name || api.data.nome || 'Usuário',
          email: e,
          token: api.data.token,
        };
        await setSession(u);

        // Registrar o token de push após o login bem-sucedido
        const pushToken = await NotificationService.getPushToken();
        if (pushToken && u.id) {
          await ApiService.registerPushToken(pushToken, u.id);
        }

        return { success: true };
      }

      
      const usersData = await AsyncStorage.getItem('@users');
      const users = usersData ? JSON.parse(usersData) : [];
      const found = users.find((u: any) => u.email === e && u.password === p);
      if (found) {
        const u: User = { id: found.id, name: found.name, email: found.email };
        await setSession(u);
        return { success: true };
      }

      return { success: false, error: api.error || 'Email ou senha incorretos' };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro de conexão';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      const n = name.trim();
      const e = email.trim().toLowerCase();
      const p = password;

      if (!n) return { success: false, error: 'Nome é obrigatório' };
      if (n.length < 2) return { success: false, error: 'Nome deve ter pelo menos 2 caracteres' };
      if (!e) return { success: false, error: 'Email é obrigatório' };
      if (!validateEmail(e)) return { success: false, error: 'Formato de email inválido' };

      const pass = validatePassword(p);
      if (!pass.isValid) return { success: false, error: pass.message };

      
      const api = await ApiService.register(n, e, p);
      if (api.success && api.data) {
        const u: User = {
          id: api.data.id || Date.now().toString(),
          name: api.data.name || n,
          email: e,
          token: api.data.token,
        };
        await setSession(u);
        return { success: true };
      }

      
      const usersData = await AsyncStorage.getItem('@users');
      const users = usersData ? JSON.parse(usersData) : [];
      if (users.find((u: any) => u.email === e)) {
        return { success: false, error: 'Este email já está cadastrado' };
      }

      const newUser = { id: Date.now().toString(), name: n, email: e, password: p };
      users.push(newUser);
      await AsyncStorage.setItem('@users', JSON.stringify(users));

      const u: User = { id: newUser.id, name: n, email: e };
      await setSession(u);
      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro de conexão';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);

    try {
      
      try { await ApiService.logout(); } catch (e) { /* ignora erro de rede */ }
      
      await setSession(null);
      setError(null);

    } finally {

      setIsLoading(false);
      
      router.replace('/auth/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        isAuthenticated: !!user,
        clearError,
        login,
        register,
        logout,
        setSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);

