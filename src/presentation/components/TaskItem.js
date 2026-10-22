/**
 * ============================================================================
 * CAMADA DE APRESENTAÇÃO (PRESENTATION LAYER)
 * Arquivo: src/presentation/components/TaskItem.js
 * 
 * Componente visual responsável por renderizar uma tarefa individual na lista.
 * 
 * Recursos Nativos do Android Utilizados:
 * 1. android_ripple: Efeito cascata visual nativo do Android ao tocar.
 * 2. onLongPress: Detecção nativa de pressão prolongada no corpo do card.
 * 3. Haptics: Resposta tátil de vibração ao clicar e ao segurar.
 * 4. Botão dedicado de Mais Opções (três pontos): Clicável diretamente para
 *    abrir o menu de ações, além de suportar o toque longo no card.
 * ============================================================================
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function TaskItem({ task, onToggle, onLongPress }) {
  // Disparado ao dar um toque simples na tarefa para alternar conclusão
  const handlePress = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {
      // Ignora silenciosamente se o dispositivo não tiver suporte a haptics
    }
    onToggle(task.id);
  };

  // Disparado ao manter a tarefa pressionada (toque longo nativo)
  const handleLongPress = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {
      // Ignora silenciosamente se o dispositivo não tiver suporte
    }
    onLongPress(task);
  };

  // Disparado ao tocar diretamente no botão de menu (ícone de três pontos)
  const handleMorePress = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {
      // Ignora se não houver suporte a haptics
    }
    onLongPress(task);
  };

  return (
    <View style={[styles.cardContainer, task.isCompleted && styles.completedCard]}>
      {/* Área principal da tarefa: toque simples conclui / toque longo abre opções */}
      <Pressable
        onPress={handlePress}
        onLongPress={handleLongPress}
        delayLongPress={400} // Tempo padrão nativo para toque longo (400ms)
        android_ripple={{ color: '#E0E0E0', borderless: false }}
        style={({ pressed }) => [
          styles.mainContentArea,
          pressed && styles.pressedState,
        ]}
      >
        {/* Ícone de status (MaterialIcons nativo, sem emojis) */}
        <View style={styles.iconContainer}>
          <MaterialIcons
            name={task.isCompleted ? 'check-circle' : 'radio-button-unchecked'}
            size={24}
            color={task.isCompleted ? '#2E7D32' : '#757575'}
          />
        </View>

        {/* Título e descrição da tarefa */}
        <View style={styles.textContent}>
          <Text
            style={[
              styles.title,
              task.isCompleted && styles.completedTitle,
            ]}
            numberOfLines={2}
          >
            {task.title}
          </Text>

          {task.description ? (
            <Text
              style={[
                styles.description,
                task.isCompleted && styles.completedDescription,
              ]}
              numberOfLines={2}
            >
              {task.description}
            </Text>
          ) : null}
        </View>
      </Pressable>

      {/* Botão de ação direta (três pontos): totalmente clicável de forma independente */}
      <Pressable
        onPress={handleMorePress}
        hitSlop={{ top: 12, bottom: 12, left: 8, right: 12 }}
        android_ripple={{ color: '#E0E0E0', borderless: true, radius: 20 }}
        style={({ pressed }) => [
          styles.moreButton,
          pressed && styles.pressedState,
        ]}
        accessibilityLabel="Opções da tarefa"
      >
        <MaterialIcons name="more-vert" size={22} color="#757575" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    overflow: 'hidden', // Garante que o efeito ripple do Android respeite as bordas
  },
  mainContentArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingLeft: 16,
    paddingRight: 8,
  },
  pressedState: {
    opacity: 0.85,
  },
  completedCard: {
    backgroundColor: '#FAFAFA',
    borderColor: '#E8E8E8',
  },
  iconContainer: {
    marginRight: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: '#212121',
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#9E9E9E',
  },
  description: {
    fontSize: 13,
    color: '#757575',
    marginTop: 3,
  },
  completedDescription: {
    textDecorationLine: 'line-through',
    color: '#BDBDBD',
  },
  moreButton: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
