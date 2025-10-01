

export const formatPlaca = (placa: string): string => {
  
  const cleanPlaca = placa.replace(/\s/g, '').toUpperCase();
  

  if (cleanPlaca.length === 7) {
    if (/^[A-Z]{3}[0-9]{4}$/.test(cleanPlaca)) {
      
      return `${cleanPlaca.slice(0, 3)}-${cleanPlaca.slice(3)}`;
    } else if (/^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(cleanPlaca)) {
      
      return `${cleanPlaca.slice(0, 3)}${cleanPlaca.slice(3, 4)}${cleanPlaca.slice(4, 5)}${cleanPlaca.slice(5)}`;
    }
  }
  
  return cleanPlaca;
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

export const formatTimeAgo = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInMinutes < 1) {
      return 'Agora mesmo';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} min atrás`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h atrás`;
    } else if (diffInDays < 7) {
      return `${diffInDays} dias atrás`;
    } else {
      return formatDate(dateString);
    }
  } catch {
    return dateString;
  }
};

export const formatName = (name: string): string => {
  return name
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const getStatusLabel = (status: string): string => {
  const labels = {
    ativa: 'Ativa',
    manutencao: 'Manutenção',
    inativa: 'Inativa'
  };
  return labels[status as keyof typeof labels] || status;
};

export const getAlertTypeLabel = (tipo: string): string => {
  const labels = {
    movimento_nao_autorizado: 'Movimento Não Autorizado',
    manutencao_necessaria: 'Manutenção Necessária',
    bateria_baixa: 'Bateria Baixa',
    fora_da_area: 'Fora da Área'
  };
  return labels[tipo as keyof typeof labels] || tipo;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - 3) + '...';
};

