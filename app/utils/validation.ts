/**
 * Utilitários de validação para formulários
 */

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePlaca = (placa: string): boolean => {
  // Validação de placa brasileira (formato antigo e Mercosul)
  const placaAntigaRegex = /^[A-Z]{3}[0-9]{4}$/;
  const placaMercosulRegex = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
  
  return placaAntigaRegex.test(placa) || placaMercosulRegex.test(placa);
};

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 6) {
    return { isValid: false, message: 'A senha deve ter pelo menos 6 caracteres' };
  }
  
  return { isValid: true };
};

export const validateName = (name: string): { isValid: boolean; message?: string } => {
  const trimmedName = name.trim();
  
  if (trimmedName.length < 2) {
    return { isValid: false, message: 'O nome deve ter pelo menos 2 caracteres' };
  }
  
  if (trimmedName.length > 50) {
    return { isValid: false, message: 'O nome deve ter no máximo 50 caracteres' };
  }
  
  return { isValid: true };
};

export const validateRequired = (value: string, fieldName: string): { isValid: boolean; message?: string } => {
  if (!value.trim()) {
    return { isValid: false, message: `${fieldName} é obrigatório` };
  }
  
  return { isValid: true };
};

export const validateForm = (data: Record<string, any>, rules: Record<string, (value: any) => { isValid: boolean; message?: string }>): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  let isValid = true;
  
  for (const [field, rule] of Object.entries(rules)) {
    const result = rule(data[field]);
    if (!result.isValid) {
      errors[field] = result.message || 'Campo inválido';
      isValid = false;
    }
  }
  
  return { isValid, errors };
};

