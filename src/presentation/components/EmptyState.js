/**
 * ============================================================================
 * CAMADA DE APRESENTAÇÃO (PRESENTATION LAYER)
 * Arquivo: src/presentation/components/EmptyState.js
 * 
 * Exibido quando não há tarefas cadastradas na lista.
 * Design minimalista e direto, estritamente sem emojis.
 * ============================================================================
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function EmptyState() {
  return (
    <View style={styles.container}>
      <MaterialIcons name="assignment-late" size={48} color="#bdbdbd" />
      <Text style={styles.title}>Nenhuma tarefa cadastrada</Text>
      <Text style={styles.description}>
        Toque no botão de adicionar (+) acima para criar sua primeira tarefa.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#616161',
    marginTop: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    color: '#9E9E9E',
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 18,
  },
});

