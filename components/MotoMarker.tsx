
import React from 'react';
import { Animated, StyleSheet, TouchableOpacity, Image, GestureResponderHandlers } from 'react-native';
import { useTheme } from '@/app/contexts/ThemeContext';

interface MotoMarkerProps extends GestureResponderHandlers {
  pan: Animated.ValueXY;
  placa: string;
  onPress: () => void;
}

export default function MotoMarker({ pan, placa, onPress, ...panHandlers }: MotoMarkerProps) {
  const { colors } = useTheme();

  // Adicione um console.log para depuração
  console.log('Renderizando MotoMarker:', { placa, pan: pan.getTranslateTransform() });

  return (
    <Animated.View 
      style={[
        styles.moto, 
        { transform: pan.getTranslateTransform() }
      ]} 
      {...panHandlers}
    >
      <TouchableOpacity onPress={onPress} style={[styles.iconWrapper, { borderColor: colors.accent }]}>
        <Image
          source={require('../assets/mottu_moto.png')}
          style={styles.image}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  moto: {
    position: 'absolute',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, 
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 10,
    borderWidth: 2,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.5)', 
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
