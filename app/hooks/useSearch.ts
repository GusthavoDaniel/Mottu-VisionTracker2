import { useState, useMemo, useCallback } from 'react';
import { Moto } from '../types';
import { FilterOptions } from '../components/search/FilterModal';

export interface UseSearchReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  filteredData: Moto[];
  clearFilters: () => void;
  hasActiveFilters: boolean;
  searchHistory: string[];
  addToSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
}

const defaultFilters: FilterOptions = {
  status: [],
  filial: [],   // segue existindo no modal; mapeamos para localizacao.setor
  modelo: [],
  sortBy: 'placa',
  sortOrder: 'asc',
};

export const useSearch = (data: Moto[]): UseSearchReturn => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const normalizeText = useCallback((text: string): string => {
    return (text || '')
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }, []);

  // helper para “filial” (mapeia para setor, se existir)
  const getFilial = useCallback((item: Moto): string => {
    // se algum dia o backend passar `filial`, priorizamos; senão usamos setor
    // @ts-expect-error compat future
    return (item.filial as string | undefined) ?? item.localizacao?.setor ?? '';
  }, []);

  // campos usados na busca textual
  const matchesSearch = useCallback(
    (item: Moto, query: string): boolean => {
      if (!query.trim()) return true;

      const q = normalizeText(query);
      const searchFields: Array<string | undefined> = [
        item.placa,
        item.modelo,
        item.proprietario,
        item.cor,
        item.status,
        getFilial(item),
        item.localizacao?.posicao,
      ];

      return searchFields.some((field) => field && normalizeText(field).includes(q));
    },
    [normalizeText, getFilial],
  );

  // filtros
  const matchesFilters = useCallback(
    (item: Moto): boolean => {
      // status
      if (filters.status.length > 0 && !filters.status.includes(item.status)) {
        return false;
      }

      // filial (mapeia para setor)
      const filial = getFilial(item);
      if (filters.filial.length > 0 && !filters.filial.includes(filial)) {
        return false;
      }

      // modelo
      if (filters.modelo.length > 0 && !filters.modelo.includes(item.modelo)) {
        return false;
      }

      return true;
    },
    [filters, getFilial],
  );

  // ordenação
  const sortData = useCallback(
    (arr: Moto[]): Moto[] => {
      return [...arr].sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        switch (filters.sortBy) {
          case 'placa':
            aValue = a.placa;
            bValue = b.placa;
            break;
          case 'modelo':
            aValue = a.modelo;
            bValue = b.modelo;
            break;
          case 'proprietario':
            aValue = a.proprietario;
            bValue = b.proprietario;
            break;
          case 'created_at': // compat com UI: usa createdAt do tipo
          case 'createdAt':
            aValue = new Date((a as any).createdAt || 0).getTime();
            bValue = new Date((b as any).createdAt || 0).getTime();
            break;
          default:
            aValue = a.placa;
            bValue = b.placa;
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const cmp = normalizeText(aValue).localeCompare(normalizeText(bValue));
          return filters.sortOrder === 'asc' ? cmp : -cmp;
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return filters.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        }

        return 0;
      });
    },
    [filters.sortBy, filters.sortOrder, normalizeText],
  );

  // aplica busca + filtros + ordenação
  const filteredData = useMemo(() => {
    const result = data.filter(
      (item) => matchesSearch(item, searchQuery) && matchesFilters(item),
    );
    return sortData(result);
  }, [data, searchQuery, matchesSearch, matchesFilters, sortData]);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.status.length > 0 ||
      filters.filial.length > 0 ||
      filters.modelo.length > 0 ||
      filters.sortBy !== 'placa' ||
      filters.sortOrder !== 'asc'
    );
  }, [filters]);

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // histórico de busca
  const addToSearchHistory = useCallback((query: string) => {
    const q = query.trim();
    if (!q) return;

    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item !== q);
      return [q, ...filtered].slice(0, 10);
    });
  }, []);

  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    filteredData,
    clearFilters,
    hasActiveFilters,
    searchHistory,
    addToSearchHistory,
    clearSearchHistory,
  };
};
