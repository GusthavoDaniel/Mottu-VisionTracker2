import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import useThemeColors from '../../hooks/useThemeColors';

type ThemeColors = {
  primary: string;
  text: string;
  textSecondary?: string;
  background?: string;
  surface?: string;
  border?: string;
  success?: string;
  error?: string;
  warning?: string;
  card?: string;
  accent?: string;
};

type ThemeHookReturn = {
  colors: ThemeColors;
  isDark: boolean;
};

export type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'default';

export interface ToastProps {
  message: string;
  variant?: ToastVariant;
  style?: StyleProp<ViewStyle>;
  /** Ícone opcional que você estiver usando no app (Ionicons, etc.) */
  iconName?: string;
}

/** Configura cores por variante com fallbacks */
const getToastColors = (variant: ToastVariant, colors: ThemeColors) => {
  switch (variant) {
    case 'success':
      return {
        backgroundColor: colors.success ?? '#4CAF50',
        iconColor: '#FFFFFF',
      };
    case 'error':
      return {
        backgroundColor: colors.error ?? '#F44336',
        iconColor: '#FFFFFF',
      };
    case 'warning':
      return {
        backgroundColor: colors.warning ?? '#FF9800',
        iconColor: '#111111',
      };
    case 'info':
      return {
        backgroundColor: colors.primary ?? '#3B82F6',
        iconColor: '#FFFFFF',
      };
    default:
      return {
        backgroundColor: colors.primary ?? '#3B82F6',
        iconColor: '#FFFFFF',
      };
  }
};

const Toast: React.FC<ToastProps> = ({
  message,
  variant = 'default',
  style,
  iconName,
}) => {
  // ✅ o hook retorna { colors, isDark }
  const { colors } = useThemeColors() as ThemeHookReturn;

  const { backgroundColor } = getToastColors(variant, colors);

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      {/* Coloque aqui seu componente de ícone se quiser, ex:
          <Ionicons name={iconName ?? defaultIcon(variant)} size={18} color={iconColor} />
       */}
      <Text style={[styles.text, { color: colors.text ?? '#FFFFFF' }]} numberOfLines={2}>
        {message}
      </Text>
    </View>
  );
};

export default Toast;

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
});
