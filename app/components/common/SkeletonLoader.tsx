import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  StyleProp,
  ViewStyle,
} from 'react-native';
import useThemeColors from '../../hooks/useThemeColors';

type ThemeColors = {
  primary: string;
  text?: string;
  textSecondary?: string;
  surface?: string;
  background?: string;
  border?: string;
};

type ThemeHookReturn = {
  colors: ThemeColors;
  isDark: boolean;
};

export interface SkeletonLoaderProps {
  /** Aceita número (px) ou porcentagem tipada */
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  animated?: boolean;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
  animated = true,
}) => {
  const { colors } = useThemeColors() as ThemeHookReturn;
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) return;

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false, // backgroundColor não usa driver nativo
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [animated, animatedValue]);

  const backgroundColor =
    animated
      ? animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [colors.border ?? '#E5E7EB', colors.surface ?? '#F3F4F6'],
        })
      : (colors.border ?? '#E5E7EB');

  // Monta um estilo "animável" com tipos aceitos pelo Animated
  const animatedStyle = {
    width,
    height,
    borderRadius,
    backgroundColor,
  } as Animated.WithAnimatedObject<ViewStyle>;

  return <Animated.View style={[animatedStyle, style]} />;
};

// --------- Componentes auxiliares ---------

export const SkeletonText: React.FC<{
  lines?: number;
  lastLineWidth?: number | `${number}%`;
  lineHeight?: number;
  spacing?: number;
}> = ({
  lines = 1,
  lastLineWidth = '70%',
  lineHeight = 16,
  spacing = 8,
}) => (
  <View>
    {Array.from({ length: lines }).map((_, index) => (
      <SkeletonLoader
        key={index}
        height={lineHeight}
        width={index === lines - 1 ? lastLineWidth : '100%'}
        style={{ marginBottom: index < lines - 1 ? spacing : 0 }}
      />
    ))}
  </View>
);

export const SkeletonCard: React.FC = () => {
  const { colors } = useThemeColors() as ThemeHookReturn;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface ?? '#FFFFFF' }]}>
      <View style={styles.cardHeader}>
        <SkeletonLoader width={60} height={60} borderRadius={30} />
        <View style={styles.cardHeaderText}>
          <SkeletonLoader width="80%" height={18} />
          <SkeletonLoader width="60%" height={14} style={{ marginTop: 8 }} />
        </View>
      </View>
      <View style={styles.cardContent}>
        <SkeletonText lines={3} />
      </View>
      <View style={styles.cardFooter}>
        <SkeletonLoader width={80} height={32} borderRadius={16} />
        <SkeletonLoader width={80} height={32} borderRadius={16} />
      </View>
    </View>
  );
};

export const SkeletonList: React.FC<{
  itemCount?: number;
  spacing?: number;
}> = ({ itemCount = 5, spacing = 12 }) => (
  <View>
    {Array.from({ length: itemCount }).map((_, index) => (
      <View key={index} style={{ marginBottom: spacing }}>
        <SkeletonCard />
      </View>
    ))}
  </View>
);

export const SkeletonMotoCard: React.FC = () => {
  const { colors } = useThemeColors() as ThemeHookReturn;

  return (
    <View style={[styles.motoCard, { backgroundColor: colors.surface ?? '#FFFFFF' }]}>
      <View style={styles.motoCardHeader}>
        <SkeletonLoader width={50} height={50} borderRadius={8} />
        <View style={styles.motoCardInfo}>
          <SkeletonLoader width="70%" height={16} />
          <SkeletonLoader width="50%" height={14} style={{ marginTop: 6 }} />
          <SkeletonLoader width="40%" height={12} style={{ marginTop: 4 }} />
        </View>
        <SkeletonLoader width={24} height={24} borderRadius={12} />
      </View>
      <View style={styles.motoCardFooter}>
        <SkeletonLoader width={60} height={20} borderRadius={10} />
        <SkeletonLoader width={80} height={20} borderRadius={10} />
        <SkeletonLoader width={70} height={20} borderRadius={10} />
      </View>
    </View>
  );
};

export const SkeletonDashboard: React.FC = () => {
  const { colors } = useThemeColors() as ThemeHookReturn;

  return (
    <View style={styles.dashboard}>
      <View style={[styles.dashboardHeader, { backgroundColor: colors.surface ?? '#FFFFFF' }]}>
        <SkeletonLoader width="60%" height={24} />
        <SkeletonLoader width="40%" height={16} style={{ marginTop: 8 }} />
      </View>

      <View style={styles.statsGrid}>
        {Array.from({ length: 4 }).map((_, index) => (
          <View
            key={index}
            style={[styles.statCard, { backgroundColor: colors.surface ?? '#FFFFFF' }]}
          >
            <SkeletonLoader width={40} height={40} borderRadius={20} />
            <SkeletonLoader width="80%" height={20} style={{ marginTop: 12 }} />
            <SkeletonLoader width="60%" height={16} style={{ marginTop: 6 }} />
          </View>
        ))}
      </View>

      <View style={[styles.chartContainer, { backgroundColor: colors.surface ?? '#FFFFFF' }]}>
        <SkeletonLoader width="50%" height={20} />
        <SkeletonLoader width="100%" height={200} style={{ marginTop: 16 }} borderRadius={8} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderText: { flex: 1, marginLeft: 12 },
  cardContent: { marginBottom: 16 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },

  motoCard: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  motoCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  motoCardInfo: { flex: 1, marginLeft: 12 },
  motoCardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  dashboard: { padding: 16 },
  dashboardHeader: { padding: 20, borderRadius: 12, marginBottom: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  chartContainer: { padding: 20, borderRadius: 12 },
});

export default SkeletonLoader;
