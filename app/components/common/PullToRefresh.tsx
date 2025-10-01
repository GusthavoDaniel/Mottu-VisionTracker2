import React, { useState } from 'react';
import { ScrollView, RefreshControl, ScrollViewProps } from 'react-native';
import useThemeColors from '../../hooks/useThemeColors';

type ThemeColors = {
  primary: string;
  text?: string;
  textSecondary?: string;
  surface?: string;
  background?: string;
};

type ThemeHookReturn = {
  colors: ThemeColors;
  isDark: boolean;
};

export interface PullToRefreshProps
  extends Omit<ScrollViewProps, 'refreshControl'> {
  onRefresh: () => Promise<void>;
  refreshing?: boolean;
  children: React.ReactNode;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  refreshing: externalRefreshing,
  children,
  ...scrollViewProps
}) => {
  
  const { colors } = useThemeColors() as ThemeHookReturn;

  const [internalRefreshing, setInternalRefreshing] = useState(false);
  const isRefreshing = externalRefreshing ?? internalRefreshing;

  const handleRefresh = async () => {
    if (externalRefreshing === undefined) setInternalRefreshing(true);

    try {
      await onRefresh();
    } catch (error) {
      console.error('Erro durante refresh:', error);
    } finally {
      if (externalRefreshing === undefined) setInternalRefreshing(false);
    }
  };

  return (
    <ScrollView
      {...scrollViewProps}
      refreshControl={
        <RefreshControl
          refreshing={!!isRefreshing}
          onRefresh={handleRefresh}
          
          colors={[colors.primary]}
          progressBackgroundColor={colors.surface ?? colors.background}
          
          tintColor={colors.primary}
          title="Atualizando..."
          titleColor={colors.textSecondary ?? colors.text}
        />
      }
    >
      {children}
    </ScrollView>
  );
};

export default PullToRefresh;
