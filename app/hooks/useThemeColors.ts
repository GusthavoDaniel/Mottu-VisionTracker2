
import { useTheme } from '../contexts/ThemeContext';

/**
 * Hook para obter as cores do tema global
 * @deprecated Use useTheme() diretamente do ThemeContext para garantir consistência global
 */
export default function useThemeColors() {
  
  const { isDark, colors: themeColors } = useTheme();
  
  
  const colors = {
    ...themeColors,
    
    primary: isDark ? '#00EF7F' : '#121212',         
    textSecondary: isDark ? '#A0A0A0' : '#555555',   
  };

  return { colors, isDark };
}
