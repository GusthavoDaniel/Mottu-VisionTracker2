// app/(tabs)/historicoAlertas.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import useThemeColors from '../hooks/useThemeColors';
import { Alertas, Alerta } from '../services/alertas';

export default function HistoricoAlertasScreen() {
  const { t } = useTranslation();
  const { colors } = useThemeColors();
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await Alertas.list();
      setAlertas(res);
    } catch (error) {
      console.error('Erro ao carregar alertas:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAlerts();
    setRefreshing(false);
  }, [loadAlerts]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={{ color: colors.text, marginTop: 10 }}>
          {t('common.loading')}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        {t('common.alertHistory')}
      </Text>

      {alertas.length === 0 ? (
        <View style={styles.center}>
          <Text style={[styles.empty, { color: colors.textSecondary }]}>
            {t('common.noAlertsFound')}
          </Text>
          <Text style={[styles.empty, { color: colors.textSecondary }]}>
            {t('common.pullToRefresh')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={alertas}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => {
            // 🔹 Traduções por tipo de alerta
            const translatedType = t(`alertTypes.${item.tipo}`, {
              defaultValue: item.tipo,
            });

            const translatedMessage = t(`alertMessages.${item.tipo}`, {
              defaultValue: item.mensagem,
            });

            return (
              <View
                style={[styles.alertItem, { borderBottomColor: colors.border }]}
              >
                <Text
                  style={[styles.alertMessage, { color: colors.text }]}
                >
                  {translatedMessage}
                </Text>

                <Text
                  style={[styles.alertType, { color: colors.textSecondary }]}
                >
                  {t('common.alertType')}: {translatedType}
                </Text>

                {item.createdAt && (
                  <Text
                    style={[styles.alertDate, { color: colors.textSecondary }]}
                  >
                    {new Date(item.createdAt).toLocaleString()}
                  </Text>
                )}
              </View>
            );
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  empty: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  alertItem: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 8,
  },
  alertMessage: {
    fontSize: 16,
    fontWeight: '600',
  },
  alertType: {
    fontSize: 14,
    marginTop: 4,
  },
  alertDate: {
    fontSize: 12,
    marginTop: 4,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
