import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { Stack } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { useMotoContext } from './contexts/MotoContext';
import useThemeColors from './hooks/useThemeColors';

type Periodo = '7d' | '30d' | 'all';

const normalizeStatus = (s?: string) => {
  const v = String(s ?? '').toLowerCase();
  if (v.includes('manut')) return 'MANUTENCAO';
  if (v.includes('inativ')) return 'INATIVA';
  return 'ATIVA';
};

const inPeriodo = (iso?: string, periodo: Periodo = 'all') => {
  if (!iso || periodo === 'all') return true;
  const d = new Date(iso).getTime();
  if (Number.isNaN(d)) return true;
  const now = Date.now();
  const delta = periodo === '7d' ? 7 : 30;
  return d >= now - delta * 24 * 60 * 60 * 1000;
};

function StatCard({
  icon,
  color,
  label,
  value,
  border,
}: {
  icon: any;
  color: string;
  label: string;
  value: number | string;
  border: string;
}) {
  return (
    <View style={[styles.statCard, { borderColor: border }]}>
      <View style={[styles.statIconWrap, { backgroundColor: `${color}22` }]}>
        <FontAwesome5 name={icon} size={18} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function BarRow({
  label,
  value,
  max,
  fg,
  bg,
  textColor,
}: {
  label: string;
  value: number;
  max: number;
  fg: string;
  bg: string;
  textColor: string;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <View style={{ marginBottom: 10 }}>
      <View style={styles.rowBetween}>
        <Text style={[styles.barLabel, { color: textColor }]} numberOfLines={1}>
          {label}
        </Text>
        <Text style={[styles.barLabel, { color: textColor }]}>{value}</Text>
      </View>
      <View style={[styles.barBg, { backgroundColor: bg }]}>
        <View style={[styles.barFg, { width: `${pct}%`, backgroundColor: fg }]} />
      </View>
    </View>
  );
}

export default function RelatoriosScreen() {
  const { t } = useTranslation();
  const { colors, isDark } = useThemeColors();
  const { motos, alertas, isLoading, isLoadingAlertas } = useMotoContext();

  const [periodo, setPeriodo] = useState<Periodo>('all');

  const {
    total,
    ativas,
    manutencao,
    inativas,
    modelosTop,
    alertasPorTipo,
    maxModelo,
    maxAlerta,
    amostra,
  } = useMemo(() => {
    const filtrarData = <T extends { createdAt?: string }>(arr: T[]) =>
      arr.filter((i) => inPeriodo(i.createdAt, periodo));

    const motosF = filtrarData(motos);
    const total = motosF.length;

    let ativas = 0,
      manutencao = 0,
      inativas = 0;

    const modelosCount = new Map<string, number>();

    motosF.forEach((m) => {
      const st = normalizeStatus((m as any).status);
      if (st === 'ATIVA') ativas++;
      else if (st === 'MANUTENCAO') manutencao++;
      else inativas++;

      const key = m.modelo || '—';
      modelosCount.set(key, (modelosCount.get(key) ?? 0) + 1);
    });

    const modelosTop = [...modelosCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    const maxModelo = modelosTop.length ? modelosTop[0][1] : 0;

    const alertasF = filtrarData(alertas as any);
    const tipoCount = new Map<string, number>();
    alertasF.forEach((a: any) => {
      const t = String(a?.tipo ?? 'OUTROS').toUpperCase();
      tipoCount.set(t, (tipoCount.get(t) ?? 0) + 1);
    });
    const alertasPorTipo = [...tipoCount.entries()].sort((a, b) => b[1] - a[1]);
    const maxAlerta = alertasPorTipo.length ? alertasPorTipo[0][1] : 0;

    const amostra = motosF.slice(0, 6);

    return {
      total,
      ativas,
      manutencao,
      inativas,
      modelosTop,
      alertasPorTipo,
      maxModelo,
      maxAlerta,
      amostra,
    };
  }, [motos, alertas, periodo]);

  const ACCENT = colors.accent;
  const WARN = '#ffb020';
  const DANGER = '#ff6b6b';
  const MUTED = colors.surface;

  const loading = isLoading || isLoadingAlertas;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
    >
      <Stack.Screen
        options={{
          title: t('common.reports'),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />

      {/* Filtro de período */}
      <View style={styles.segment}>
        {(['7d', '30d', 'all'] as Periodo[]).map((p) => {
          const active = periodo === p;
          const label =
            p === '7d'
              ? t('reportsScreen.period7d')
              : p === '30d'
              ? t('reportsScreen.period30d')
              : t('reportsScreen.periodAll');

          return (
            <Pressable
              key={p}
              onPress={() => setPeriodo(p)}
              style={[
                styles.segmentItem,
                {
                  backgroundColor: active ? ACCENT : colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={{
                  fontWeight: '700',
                  color: active ? '#000' : colors.text,
                }}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* KPIs */}
      <View style={styles.grid}>
        <StatCard
          icon="warehouse"
          color={ACCENT}
          label={t('reportsScreen.totalInYard')}
          value={total}
          border={ACCENT}
        />
        <StatCard
          icon="tools"
          color={WARN}
          label={t('reportsScreen.maintenance')}
          value={manutencao}
          border={WARN}
        />
        <StatCard
          icon="check-circle"
          color={ACCENT}
          label={t('reportsScreen.active')}
          value={ativas}
          border={ACCENT}
        />
        <StatCard
          icon="ban"
          color={DANGER}
          label={t('reportsScreen.inactive')}
          value={inativas}
          border={DANGER}
        />
      </View>

      {/* Loading */}
      {loading && (
        <View style={{ paddingVertical: 24, alignItems: 'center' }}>
          <ActivityIndicator />
          <Text style={{ color: colors.textSecondary, marginTop: 8 }}>
            {t('common.loading')}
          </Text>
        </View>
      )}

      {/* Motos por Modelo */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {t('reportsScreen.byModelTitle')}
      </Text>
      <View style={[styles.card, { backgroundColor: MUTED, borderColor: colors.border }]}>
        {modelosTop.length === 0 ? (
          <Text style={{ color: colors.textSecondary }}>
            {t('reportsScreen.noDataPeriod')}
          </Text>
        ) : (
          modelosTop.map(([model, count]) => (
            <BarRow
              key={model}
              label={model}
              value={count}
              max={maxModelo}
              fg={ACCENT}
              bg={isDark ? '#ffffff20' : '#00000010'}
              textColor={colors.text}
            />
          ))
        )}
      </View>

      {/* Alertas por Tipo */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {t('reportsScreen.alertsByTypeTitle')}
      </Text>
      <View style={[styles.card, { backgroundColor: MUTED, borderColor: colors.border }]}>
        {alertasPorTipo.length === 0 ? (
          <Text style={{ color: colors.textSecondary }}>
            {t('reportsScreen.noAlertsPeriod')}
          </Text>
        ) : (
          alertasPorTipo.map(([tipo, count]) => (
            <BarRow
              key={tipo}
              label={tipo}
              value={count}
              max={maxAlerta}
              fg={DANGER}
              bg={isDark ? '#ffffff20' : '#00000010'}
              textColor={colors.text}
            />
          ))
        )}
      </View>

      {/* Amostra de Motos */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {t('reportsScreen.sampleTitle')}
      </Text>
      <View style={[styles.table, { backgroundColor: MUTED, borderColor: colors.border }]}>
        <View style={[styles.tr, styles.trHead, { borderColor: colors.border }]}>
          <Text style={[styles.th, { color: colors.textSecondary }]}>
            {t('common.plate')}
          </Text>
          <Text style={[styles.th, { color: colors.textSecondary, flex: 1 }]}>
            {t('common.model')}
          </Text>
          <Text style={[styles.th, { color: colors.textSecondary }]}>
            {t('common.status')}
          </Text>
        </View>

        {amostra.length === 0 ? (
          <View style={[styles.tr, { borderColor: colors.border }]}>
            <Text style={[styles.td, { color: colors.textSecondary }]}>
              {t('reportsScreen.noRecords')}
            </Text>
          </View>
        ) : (
          amostra.map((m) => {
            const norm = normalizeStatus((m as any).status);
            const badgeBg =
              norm === 'MANUTENCAO'
                ? `${WARN}22`
                : norm === 'INATIVA'
                ? `${DANGER}22`
                : `${ACCENT}22`;
            const badgeFg =
              norm === 'MANUTENCAO' ? WARN : norm === 'INATIVA' ? DANGER : ACCENT;

            return (
              <View key={m.id} style={[styles.tr, { borderColor: colors.border }]}>
                <Text
                  style={[styles.td, { color: colors.text, fontWeight: '700' }]}
                >
                  {m.placa}
                </Text>
                <Text style={[styles.td, { color: colors.text, flex: 1 }]}>
                  {m.modelo || '—'}
                </Text>
                <Text
                  style={[
                    styles.badge,
                    {
                      backgroundColor: badgeBg,
                      color: badgeFg,
                    },
                  ]}
                >
                  {norm}
                </Text>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    width: '47.7%',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  statIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { marginTop: 2, fontSize: 12, opacity: 0.8 },

  sectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 8, marginTop: 6 },

  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  barLabel: { fontWeight: '600' },
  barBg: { height: 10, borderRadius: 999, overflow: 'hidden', marginTop: 6 },
  barFg: { height: 10, borderRadius: 999 },

  table: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tr: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  trHead: { backgroundColor: 'transparent' },
  th: {
    width: 90,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    fontWeight: '700',
  },
  td: { width: 90, fontSize: 14 },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
    fontWeight: '800',
    fontSize: 12,
    textAlign: 'center',
    minWidth: 82,
  },

  segment: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  segmentItem: {
    flex: 1,
    height: 36,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
