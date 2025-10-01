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
import useThemeColors from '../../hooks/useThemeColors';

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

export default function FilterModal({
  visible,
  onClose,
  onApply,
  onClear,
  currentFilters,
  availableOptions,
}: FilterModalProps) {
  const { colors } = useThemeColors();
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);

  const toggleFilter = (category: keyof FilterOptions, value: string) => {
    setFilters((prev) => {
      if (category === 'sortBy' || category === 'sortOrder') {
        return { ...prev, [category]: value };
      }

      const currentValues = prev[category] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [category]: newValues };
    });
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleClear = () => {
    setFilters({
      status: [],
      filial: [],
      modelo: [],
      sortBy: '',
      sortOrder: 'asc',
    });
    onClear();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[styles.overlay, { backgroundColor: colors.background + 'CC' }]}>
        <View style={[styles.modal, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.text }]}>Filtros</Text>

          <ScrollView style={{ maxHeight: height * 0.6 }}>
            <FilterSection
              title="Status"
              options={availableOptions.status}
              selectedValues={filters.status}
              category="status"
              toggleFilter={toggleFilter}
              colors={colors}
            />
            <FilterSection
              title="Filial"
              options={availableOptions.filiais}
              selectedValues={filters.filial}
              category="filial"
              toggleFilter={toggleFilter}
              colors={colors}
            />
            <FilterSection
              title="Modelo"
              options={availableOptions.modelos}
              selectedValues={filters.modelo}
              category="modelo"
              toggleFilter={toggleFilter}
              colors={colors}
            />
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, { borderColor: colors.error }]}
              onPress={handleClear}
            >
              <Text style={{ color: colors.error }}>Limpar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, { borderColor: colors.accent }]}
              onPress={handleApply}
            >
              <Text style={{ color: colors.accent }}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const FilterSection: React.FC<{
  title: string;
  options: string[];
  selectedValues: string[];
  category: keyof FilterOptions;
  toggleFilter: (c: keyof FilterOptions, v: string) => void;
  colors: { [key: string]: string };
}> = ({ title, options, selectedValues, category, toggleFilter, colors }) => {
  return (
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
                  backgroundColor: isSelected ? colors.accent : colors.surface,
                  borderColor: isSelected ? colors.accent : colors.border,
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
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  btn: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
