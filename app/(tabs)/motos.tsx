import React, { createContext, useContext, useState } from 'react';
import { Animated } from 'react-native';
import useThemeColors from '../hooks/useThemeColors';


interface Moto {
  id: string;
  placa: string;
  pan: Animated.ValueXY;
  historico: string[];
}

interface MotoContextData {
  motos: Moto[];
  moverMoto: (id: string, x: number, y: number) => void;
}

const MotoContext = createContext<MotoContextData>({} as MotoContextData);

export const MotoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [motos, setMotos] = useState<Moto[]>([
    { id: '1', placa: 'ABC1234', pan: new Animated.ValueXY({ x: 100, y: 100 }), historico: ['Inicial: 100x100'] },
  ]);

  const moverMoto = (id: string, x: number, y: number) => {
    setMotos(prev =>
      prev.map(m =>
        m.id === id
          ? { ...m, pan: new Animated.ValueXY({ x, y }), historico: [...m.historico, `Movido para ${x.toFixed(0)}x${y.toFixed(0)}`] }
          : m
      )
    );
  };

  return <MotoContext.Provider value={{ motos, moverMoto }}>{children}</MotoContext.Provider>;
};

export const useMotoContext = () => useContext(MotoContext);
