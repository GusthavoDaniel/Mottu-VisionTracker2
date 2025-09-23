// Tipos de dados principais
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Moto {
  id: string;
  placa: string;
  modelo: string;
  cor: string;
  proprietario: string;
  localizacao?: {
    setor: string;
    posicao: string;
    ultimaAtualizacao: string;
  };
  status: 'ativa' | 'manutencao' | 'inativa';
  createdAt: string;
  updatedAt: string;
}

export interface Alerta {
  id: string;
  motoId: string;
  tipo: 'movimento_nao_autorizado' | 'manutencao_necessaria' | 'bateria_baixa' | 'fora_da_area';
  descricao: string;
  timestamp: string;
  resolvido: boolean;
}

// Tipos para API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Tipos para contextos
export interface ThemeColors {
  background: string;
  text: string;
  accent: string;
  border: string;
  card: string;
  success: string;
  error: string;
  warning: string;
  textSecondary: string;
  primary: string;
}

export interface ThemeContextProps {
  isDark: boolean;
  toggleTheme: () => void;
  colors: ThemeColors;
}

export interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

// Tipos para formulários
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface MotoFormData {
  placa: string;
  modelo: string;
  cor: string;
  proprietario: string;
  status: 'ativa' | 'manutencao' | 'inativa';
}

// Tipos para componentes
export interface LoadingButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  style?: any;
  textStyle?: any;
}

export interface PickerOption {
  label: string;
  value: string;
}

export interface CustomPickerProps {
  options: PickerOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

// Constantes
export const MODELOS_MOTOS = ['CG 160', 'Factor 125', 'Biz 125', 'PCX 150', 'CB 600F'] as const;
export const CORES_MOTOS = ['Preta', 'Verde Mottu', 'Branca', 'Vermelha', 'Azul'] as const;
export const STATUS_MOTOS = ['ativa', 'manutencao', 'inativa'] as const;

export type ModeloMoto = typeof MODELOS_MOTOS[number];
export type CorMoto = typeof CORES_MOTOS[number];
export type StatusMoto = typeof STATUS_MOTOS[number];

