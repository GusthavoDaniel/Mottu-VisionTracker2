import React from 'react';
import { Pressable } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useThemeColors from '../../app/hooks/useThemeColors';

export default function BackButton() {
  const router = useRouter();
  const { colors } = useThemeColors();

  return (
    <Pressable
      onPress={() => router.back()}
      hitSlop={10}
      style={{ paddingHorizontal: 8, paddingVertical: 6 }}
    >
      <FontAwesome5 name="chevron-left" size={18} color={colors.text} />
    </Pressable>
  );
}
