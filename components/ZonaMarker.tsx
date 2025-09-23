import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useThemeColors from '@/app/hooks/useThemeColors';

interface ZonaMarkerProps {
  nome: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function ZonaMarker({ nome, x, y, width, height }: ZonaMarkerProps) {
  const { colors } = useThemeColors();

  return (
    <View
      style={[
        styles.zona,
        {
          left: x,
          top: y,
          width,
          height,
          borderColor: colors.border,
          backgroundColor: colors.card,
        },
      ]}
    >
      <Text style={[styles.zonaLabel, { color: colors.text }]}>{nome}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  zona: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    opacity: 0.25,
  },
  zonaLabel: {
    fontWeight: 'bold',
  },
});
