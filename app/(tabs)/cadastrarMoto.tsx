import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useMotoContext } from '../contexts/MotoContext';
import { useTheme } from '../contexts/ThemeContext';

const MODELOS_MOTOS = ['CG 160', 'Factor 125', 'Biz 125', 'PCX 150', 'CB 600F'] as const;
const CORES_MOTOS = ['Preta', 'Verde Mottu', 'Branca', 'Vermelha', 'Azul'] as const;
const STATUS_MOTOS = ['ativa', 'manutencao', 'inativa'] as const;
type StatusMoto = (typeof STATUS_MOTOS)[number];

export default function CadastrarMotoScreen() {
  const { t } = useTranslation();
  const { adicionarMoto, isLoading, error, clearError } = useMotoContext();
  const router = useRouter();
  const { colors } = useTheme();

  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState<(typeof MODELOS_MOTOS)[number]>(MODELOS_MOTOS[0]);
  const [cor, setCor] = useState<(typeof CORES_MOTOS)[number]>(CORES_MOTOS[1]);
  const [proprietario, setProprietario] = useState('');
  const [status, setStatus] = useState<StatusMoto>('ativa');

  const [openModelo, setOpenModelo] = useState(false);
  const [openCor, setOpenCor] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);

  useEffect(() => {
    if (error) {
      Alert.alert(t('common.error'), error, [{ text: t('common.ok'), onPress: clearError }]);
    }
    return () => {
      if (error) clearError?.();
    };
  }, [error, clearError, t]);

  const placaSanitizada = useMemo(() => placa.trim().toUpperCase(), [placa]);

  const validarFormulario = useCallback((): boolean => {
    if (!placaSanitizada) {
      Alert.alert(t('common.error'), t('cadastrarMoto.validation.placaRequired'));
      return false;
    }
    if (!proprietario.trim()) {
      Alert.alert(t('common.error'), t('cadastrarMoto.validation.proprietarioRequired'));
      return false;
    }
    if (proprietario.trim().length < 2) {
      Alert.alert(t('common.error'), t('cadastrarMoto.validation.proprietarioMinLength'));
      return false;
    }

    const placaAntigaRegex = /^[A-Z]{3}[0-9]{4}$/;
    const placaMercosulRegex = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
    if (!placaAntigaRegex.test(placaSanitizada) && !placaMercosulRegex.test(placaSanitizada)) {
      Alert.alert(t('common.error'), t('cadastrarMoto.validation.placaInvalid'));
      return false;
    }
    return true;
  }, [placaSanitizada, proprietario, t]);

  const handleCadastrar = useCallback(async () => {
    if (isLoading) return;
    if (!validarFormulario()) return;

    // mapeia para o status da API
    const statusApi =
      status === 'manutencao' ? 'MANUTENCAO' : status === 'inativa' ? 'INATIVA' : 'ATIVA';

    const sucesso = await adicionarMoto({
      placa: placaSanitizada,
      modelo,
      cor,
      proprietario: proprietario.trim(),
      status: statusApi as any,
      localizacao: {
        setor: 'A1',
        posicao: `${Math.floor(Math.random() * 10) + 1}`,
        ultimaAtualizacao: new Date().toISOString(),
      },
    });

    if (sucesso) {
      Alert.alert(
        t('common.success'),
        t('cadastrarMoto.successMessage', { modelo, placa: placaSanitizada }),
        [
          {
            text: t('common.ok'),
            onPress: () => {
              setPlaca('');
              setModelo(MODELOS_MOTOS[0]);
              setCor(CORES_MOTOS[1]);
              setProprietario('');
              setStatus('ativa');
              router.replace('/motos');
            },
          },
        ]
      );
    }
  }, [
    isLoading,
    validarFormulario,
    adicionarMoto,
    placaSanitizada,
    modelo,
    cor,
    proprietario,
    status,
    router,
    t,
  ]);

  // componente genérico para select
  const ItemPicker = ({
    labelKey,
    value,
    open,
    setOpen,
    options,
    onSelect,
  }: {
    labelKey: string;
    value: string;
    open: boolean;
    setOpen: (v: boolean) => void;
    options: readonly string[];
    onSelect: (v: string) => void;
  }) => (
    <View style={{ width: '100%', marginBottom: 12 }}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{t(labelKey)}</Text>
      <TouchableOpacity
        style={[
          styles.select,
          { borderColor: colors.border, backgroundColor: colors.surface },
        ]}
        activeOpacity={0.7}
        onPress={() => setOpen(!open)}
        disabled={isLoading}
      >
        <Text style={{ color: colors.text }}>{value}</Text>
      </TouchableOpacity>
      {open && (
        <View
          style={[
            styles.dropdown,
            { borderColor: colors.border, backgroundColor: colors.surface },
          ]}
        >
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={styles.dropdownItem}
              onPress={() => {
                onSelect(opt);
                setOpen(false);
              }}
              disabled={isLoading}
            >
              <Text style={{ color: colors.text }}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const getStatusColor = (s: StatusMoto) =>
    ({ ativa: colors.success, manutencao: colors.warning, inativa: colors.error }[s] ??
    colors.textSecondary);

  const getStatusLabel = (s: StatusMoto) => {
    switch (s) {
      case 'ativa':
        return t('common.active');
      case 'manutencao':
        return t('common.maintenance');
      case 'inativa':
        return t('common.inactive');
      default:
        return s;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { backgroundColor: colors.background },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: colors.text }]}>
          {t('cadastrarMoto.title')}
        </Text>

        {/* Placa */}
        <View style={{ width: '100%' }}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            {t('cadastrarMoto.placaLabel')}
          </Text>
          <TextInput
            placeholder="AAA0A00"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={7}
            value={placaSanitizada}
            onChangeText={setPlaca}
            style={[
              styles.input,
              {
                borderColor: colors.border,
                backgroundColor: colors.surface,
                color: colors.text,
              },
            ]}
            editable={!isLoading}
          />
        </View>

        {/* Proprietário */}
        <View style={{ width: '100%' }}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            {t('cadastrarMoto.proprietarioLabel')}
          </Text>
          <TextInput
            placeholder={t('cadastrarMoto.proprietarioPlaceholder')}
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="words"
            autoCorrect
            value={proprietario}
            onChangeText={setProprietario}
            style={[
              styles.input,
              {
                borderColor: colors.border,
                backgroundColor: colors.surface,
                color: colors.text,
              },
            ]}
            editable={!isLoading}
          />
        </View>

        {/* Modelo */}
        <ItemPicker
          labelKey="common.model"
          value={modelo}
          open={openModelo}
          setOpen={setOpenModelo}
          options={MODELOS_MOTOS}
          onSelect={(v) => setModelo(v as (typeof MODELOS_MOTOS)[number])}
        />

        {/* Cor */}
        <ItemPicker
          labelKey="common.color"
          value={cor}
          open={openCor}
          setOpen={setOpenCor}
          options={CORES_MOTOS}
          onSelect={(v) => setCor(v as (typeof CORES_MOTOS)[number])}
        />

        {/* Status */}
        <View style={{ width: '100%', marginBottom: 12 }}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            {t('cadastrarMoto.statusLabel')}
          </Text>
          <TouchableOpacity
            style={[
              styles.select,
              { borderColor: colors.border, backgroundColor: colors.surface },
            ]}
            activeOpacity={0.7}
            onPress={() => setOpenStatus(!openStatus)}
            disabled={isLoading}
          >
            <Text style={{ color: getStatusColor(status), fontWeight: '700' }}>
              {getStatusLabel(status)}
            </Text>
          </TouchableOpacity>
          {openStatus && (
            <View
              style={[
                styles.dropdown,
                { borderColor: colors.border, backgroundColor: colors.surface },
              ]}
            >
              {STATUS_MOTOS.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setStatus(opt);
                    setOpenStatus(false);
                  }}
                  disabled={isLoading}
                >
                  <Text
                    style={{
                      color: getStatusColor(opt as StatusMoto),
                      fontWeight: '700',
                    }}
                  >
                    {getStatusLabel(opt as StatusMoto)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Botão Cadastrar */}
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: isLoading
                ? colors.textSecondary
                : colors.accent,
            },
          ]}
          onPress={handleCadastrar}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              style={[styles.buttonText, { color: '#fff' }]}
            >
              {t('cadastrarMoto.buttonText')}
            </Text>
          )}
        </TouchableOpacity>

        {/* Voltar */}
        <TouchableOpacity
          style={[styles.backButton, { borderColor: colors.accent }]}
          onPress={() => router.back()}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          <Text
            style={[styles.backButtonText, { color: colors.accent }]}
          >
            {t('common.back')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  label: { marginBottom: 6, fontSize: 13, fontWeight: '600' },
  input: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  select: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 6,
    overflow: 'hidden',
  },
  dropdownItem: { paddingVertical: 12, paddingHorizontal: 12 },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  buttonText: { fontWeight: 'bold', fontSize: 16 },
  backButton: {
    flexDirection: 'row',
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: { fontSize: 14, fontWeight: 'bold' },
});
