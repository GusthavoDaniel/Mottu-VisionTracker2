import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useThemeColors from '../../hooks/useThemeColors';

export interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSearch?: (text: string) => void;
  onClear?: () => void;
  onFilterPress?: () => void;
  showFilter?: boolean;
  autoFocus?: boolean;
  editable?: boolean;
}

const { width } = Dimensions.get('window');

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Buscar...',
  value,
  onChangeText,
  onSearch,
  onClear,
  onFilterPress,
  showFilter = true,
  autoFocus = false,
  editable = true,
}) => {
  const { colors } = useThemeColors(); // <-- pega somente 'colors'
  const [isFocused, setIsFocused] = useState(false);

  // mantém o Animated.Value entre renders
  const animatedWidth = useRef(new Animated.Value(width - 32)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: isFocused ? width - (showFilter ? 80 : 32) : width - 32,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, showFilter, animatedWidth]);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  const handleSearch = () => onSearch?.(value);

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 25,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: isFocused ? colors.accent : colors.border, // accent no foco
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    searchIcon: { marginRight: 8 },
    textInput: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      paddingVertical: 0,
    },
    clearButton: { marginLeft: 8, padding: 4 },
    filterButton: {
      marginLeft: 12,
      backgroundColor: colors.accent, // accent no botão de filtro
      borderRadius: 20,
      padding: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.searchContainer, { width: animatedWidth }]}>
        <Ionicons
          name="search"
          size={20}
          color={colors.textSecondary}
          style={styles.searchIcon}
        />

        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={handleSearch}
          autoFocus={autoFocus}
          editable={editable}
          returnKeyType="search"
        />

        {value.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
            activeOpacity={0.7}
          >
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </Animated.View>

      {showFilter && (
        <TouchableOpacity
          style={styles.filterButton}
          onPress={onFilterPress}
          activeOpacity={0.8}
        >
          <Ionicons name="options" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
