import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../../hooks/useThemeColors';

export interface FilterOptions {
  status: string[];
  filial: string[];
  modelo: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  onClear: () => void;
  currentFilters: FilterOptions;
  availableOptions: {
    status: string[];
    filiais: string[];
    modelos: string[];
  };
}

const { height } = Dimensions.get('window');

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  onClear,
  currentFilters,
  availableOptions,
}) => {
  const colors = useThemeColors();
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters: FilterOptions = {
      status: [],
      filial: [],
      modelo: [],
      sortBy: 'placa',
      sortOrder: 'asc',
    };
    setFilters(clearedFilters);
    onClear();
  };

  const toggleFilter = (category: keyof FilterOptions, value: string) => {
    if (category === 'sortBy') {
      setFilters(prev => ({ ...prev, sortBy: value }));
    } else if (category === 'sortOrder') {
      setFilters(prev => ({ ...prev, sortOrder: value as 'asc' | 'desc' }));
    } else {
      setFilters(prev => {
        const currentArray = prev[category] as string[];
        const newArray = currentArray.includes(value)
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value];
        return { ...prev, [category]: newArray };
      });
    }
  };

  const FilterSection: React.FC<{
    title: string;
    options: string[];
    selectedValues: string[];
    category: keyof FilterOptions;
  }> = ({ title, options, selectedValues, category }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => {
          const isSelected = selectedValues.includes(option);
          return (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                {
                  backgroundColor: isSelected ? colors.primary : colors.surface,
                  borderColor: isSelected ? colors.primary : colors.border,
                },
              ]}
              onPress={() => toggleFilter(category, option)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.optionText,
                  { color: isSelected ? '#FFFFFF' : colors.text },
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const SortSection: React.FC = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Ordenar por</Text>
      <View style={styles.optionsContainer}>
        {[
          { key: 'placa', label: 'Placa' },
          { key: 'modelo', label: 'Modelo' },
          { key: 'proprietario', label: 'Proprietário' },
          { key: 'created_at', label: 'Data de Cadastro' },
        ].map((option) => {
          const isSelected = filters.sortBy === option.key;
          return (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.optionButton,
                {
                  backgroundColor: isSelected ? colors.primary : colors.surface,
                  borderColor: isSelected ? colors.primary : colors.border,
                },
              ]}
              onPress={() => toggleFilter('sortBy', option.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.optionText,
                  { color: isSelected ? '#FFFFFF' : colors.text },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      
      <View style={styles.sortOrderContainer}>
        <TouchableOpacity
          style={[
            styles.sortOrderButton,
            {
              backgroundColor: filters.sortOrder === 'asc' ? colors.primary : colors.surface,
              borderColor: filters.sortOrder === 'asc' ? colors.primary : colors.border,
            },
          ]}
          onPress={() => toggleFilter('sortOrder', 'asc')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-up"
            size={16}
            color={filters.sortOrder === 'asc' ? '#FFFFFF' : colors.text}
          />
          <Text
            style={[
              styles.sortOrderText,
              { color: filters.sortOrder === 'asc' ? '#FFFFFF' : colors.text },
            ]}
          >
            Crescente
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.sortOrderButton,
            {
              backgroundColor: filters.sortOrder === 'desc' ? colors.primary : colors.surface,
              borderColor: filters.sortOrder === 'desc' ? colors.primary : colors.border,
            },
          ]}
          onPress={() => toggleFilter('sortOrder', 'desc')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-down"
            size={16}
            color={filters.sortOrder === 'desc' ? '#FFFFFF' : colors.text}
          />
          <Text
            style={[
              styles.sortOrderText,
              { color: filters.sortOrder === 'desc' ? '#FFFFFF' : colors.text },
            ]}
          >
            Decrescente
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    container: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: height * 0.8,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
    },
    closeButton: {
      padding: 4,
    },
    content: {
      flex: 1,
    },
    section: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 12,
    },
    optionsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    optionButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
    },
    optionText: {
      fontSize: 14,
      fontWeight: '500',
    },
    sortOrderContainer: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 12,
    },
    sortOrderButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      borderRadius: 8,
      borderWidth: 1,
      gap: 6,
    },
    sortOrderText: {
      fontSize: 14,
      fontWeight: '500',
    },
    footer: {
      flexDirection: 'row',
      padding: 20,
      gap: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    clearButton: {
      flex: 1,
      backgroundColor: colors.surface,
      paddingVertical: 16,
      borderRadius: 8,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    clearButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    applyButton: {
      flex: 1,
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    applyButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Filtros</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <FilterSection
              title="Status"
              options={availableOptions.status}
              selectedValues={filters.status}
              category="status"
            />
            
            <FilterSection
              title="Filial"
              options={availableOptions.filiais}
              selectedValues={filters.filial}
              category="filial"
            />
            
            <FilterSection
              title="Modelo"
              options={availableOptions.modelos}
              selectedValues={filters.modelo}
              category="modelo"
            />
            
            <SortSection />
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClear}
              activeOpacity={0.7}
            >
              <Text style={styles.clearButtonText}>Limpar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApply}
              activeOpacity={0.8}
            >
              <Text style={styles.applyButtonText}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;

