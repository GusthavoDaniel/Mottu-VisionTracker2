import { useState, useCallback } from 'react';

// Tipo usado pelo Toast (mantém compatibilidade com o componente)
export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'default';

export interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
  actionText?: string;
  onActionPress?: () => void;
}

export interface UseToastReturn {
  toast: ToastState;
  showToast: (message: string, type: ToastType, actionText?: string, onActionPress?: () => void) => void;
  showSuccess: (message: string, actionText?: string, onActionPress?: () => void) => void;
  showError: (message: string, actionText?: string, onActionPress?: () => void) => void;
  showWarning: (message: string, actionText?: string, onActionPress?: () => void) => void;
  showInfo: (message: string, actionText?: string, onActionPress?: () => void) => void;
  hideToast: () => void;
}

export const useToast = (): UseToastReturn => {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: '',
    type: 'info',
  });

  const showToast = useCallback(
    (message: string, type: ToastType, actionText?: string, onActionPress?: () => void) => {
      setToast({
        visible: true,
        message,
        type,
        actionText,
        onActionPress,
      });
    },
    []
  );

  const showSuccess = useCallback(
    (message: string, actionText?: string, onActionPress?: () => void) => {
      showToast(message, 'success', actionText, onActionPress);
    },
    [showToast]
  );

  const showError = useCallback(
    (message: string, actionText?: string, onActionPress?: () => void) => {
      showToast(message, 'error', actionText, onActionPress);
    },
    [showToast]
  );

  const showWarning = useCallback(
    (message: string, actionText?: string, onActionPress?: () => void) => {
      showToast(message, 'warning', actionText, onActionPress);
    },
    [showToast]
  );

  const showInfo = useCallback(
    (message: string, actionText?: string, onActionPress?: () => void) => {
      showToast(message, 'info', actionText, onActionPress);
    },
    [showToast]
  );

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  return { toast, showToast, showSuccess, showError, showWarning, showInfo, hideToast };
};
