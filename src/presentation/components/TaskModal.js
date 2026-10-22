/**
 * ============================================================================
 * CAMADA DE APRESENTAÇÃO (PRESENTATION LAYER)
 * Arquivo: src/presentation/components/TaskModal.js
 * 
 * Componente modal para inserção e edição de tarefas.
 * Utiliza o componente nativo Modal do React Native e KeyboardAvoidingView
 * para manter a experiência fluida no Android.
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function TaskModal({
  visible,
  onClose,
  onSave,
  taskToEdit = null,
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Sincroniza os campos quando o modal abre para edição ou nova tarefa
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
    setErrorMessage('');
  }, [taskToEdit, visible]);

  const handleSave = () => {
    if (!title.trim()) {
      setErrorMessage('Por favor, informe o título da tarefa.');
      return;
    }

    onSave(title, description, taskToEdit ? taskToEdit.id : null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose} // Trata o botão nativo Voltar do Android
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.modalCard}>
          {/* Título do Modal (Sem emojis) */}
          <Text style={styles.modalTitle}>
            {taskToEdit ? 'Editar Tarefa' : 'Nova Tarefa'}
          </Text>

          {/* Campo de Título */}
          <Text style={styles.inputLabel}>Título</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Ex: Estudar camadas de software"
            placeholderTextColor="#9E9E9E"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (errorMessage) setErrorMessage('');
            }}
            autoFocus={true}
            maxLength={100}
          />

          {/* Campo de Descrição */}
          <Text style={styles.inputLabel}>Descrição (opcional)</Text>
          <TextInput
            style={[styles.textInput, styles.multilineInput]}
            placeholder="Observações ou detalhes adicionais"
            placeholderTextColor="#9E9E9E"
            value={description}
            onChangeText={setDescription}
            multiline={true}
            numberOfLines={3}
            maxLength={250}
          />

          {/* Mensagem de Erro de Validação */}
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

          {/* Botões de Ação */}
          <View style={styles.buttonRow}>
            <Pressable
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={onClose}
              android_ripple={{ color: '#E0E0E0' }}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.saveButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleSave}
              android_ripple={{ color: '#1B5E20' }}
            >
              <Text style={styles.saveButtonText}>
                {taskToEdit ? 'Salvar' : 'Adicionar'}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)', // Escurecimento nativo de fundo
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    elevation: 5, // Sombra nativa do Android
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#616161',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  textInput: {
    backgroundColor: '#F5F5F7',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#212121',
    marginBottom: 14,
  },
  multilineInput: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    color: '#D32F2F',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 10,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#EEEEEE',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#616161',
  },
  saveButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#212121',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonPressed: {
    opacity: 0.75,
  },
});

