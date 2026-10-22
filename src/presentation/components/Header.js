/**
 * ============================================================================
 * CAMADA DE APRESENTAÇÃO (PRESENTATION LAYER)
 * Arquivo: src/presentation/components/Header.js
 * 
 * Cabeçalho minimalista da aplicação com resumo estatístico e botão
 * de adicionar nova tarefa.
 * ============================================================================
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function Header({ stats, onAddNewTask }) {
  const handleAddPress = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {
      // Ignora falha de haptics se não houver suporte
    }
    onAddNewTask();
  };

  // Texto formatado de status (sem emojis)
  const getSubtitle = () => {
    if (stats.total === 0) {
      return 'Nenhuma tarefa cadastrada';
    }
    return `${stats.completed} de ${stats.total} concluída${stats.total > 1 ? 's' : ''} (${stats.percentage}%)`;
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.titleRow}>
        <View style={styles.textContainer}>
          <Text style={styles.appTitle}>EasyTask</Text>
          <Text style={styles.subtitle}>{getSubtitle()}</Text>
        </View>

        {/* Botão de Adicionar (+) com toque nativo */}
        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleAddPress}
          android_ripple={{ color: '#424242', borderless: true, radius: 24 }}
          accessibilityLabel="Adicionar nova tarefa"
        >
          <MaterialIcons name="add" size={24} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* Barra de progresso minimalista */}
      {stats.total > 0 && (
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressBar,
              { width: `${stats.percentage}%` },
            ]}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1C1C1E',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#757575',
    marginTop: 2,
    fontWeight: '400',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2, // Sombra nativa Android
  },
  buttonPressed: {
    opacity: 0.8,
  },
  progressBackground: {
    height: 3,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginTop: 14,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2E7D32',
    borderRadius: 2,
  },
});

