/**
 * ============================================================================
 * CAMADA DE APRESENTAÇÃO (PRESENTATION LAYER)
 * Arquivo: src/presentation/screens/HomeScreen.js
 * 
 * Tela principal do EasyTask.
 * 
 * Papel nesta camada:
 * - Gerencia o estado visual (lista de tarefas, modal aberto/fechado, carregamento).
 * - Delega TODA a lógica de negócios e validação para a Camada de Serviço (TaskService).
 * - Utiliza recursos nativos do Android:
 *   1. Alert.alert: Diálogo nativo do sistema operacional.
 *   2. RefreshControl: Indicador nativo de 'puxe para atualizar'.
 *   3. FlatList: Lista otimizada para desempenho em dispositivos móveis.
 *   4. SafeAreaView (react-native-safe-area-context): Respeita a barra de status
 *      e entalhes de câmera sem sobreposição visual.
 * ============================================================================
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Importação da Camada de Negócio (Service)
import { TaskService } from '../../services/TaskService';

// Importação dos Componentes Visuais
import Header from '../components/Header';
import TaskItem from '../components/TaskItem';
import TaskModal from '../components/TaskModal';
import EmptyState from '../components/EmptyState';

export default function HomeScreen() {
  // Estado local para a lista de tarefas
  const [tasks, setTasks] = useState([]);

  // Estado para controle de carregamento visual
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Estados para controle do Modal de Criar/Editar
  const [modalVisible, setModalVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  /**
   * Carrega as tarefas através do TaskService (que por sua vez lê do TaskRepository).
   */
  const loadTasks = useCallback(async () => {
    try {
      const loadedTasks = await TaskService.getTasks();
      setTasks(loadedTasks);
    } catch (error) {
      console.error('Erro ao carregar tarefas na tela:', error);
      Alert.alert('Erro', 'Não foi possível carregar as tarefas salvas.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Carrega as tarefas logo ao abrir o aplicativo
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Função disparada no 'puxe para atualizar' nativo do Android
  const onRefresh = () => {
    setRefreshing(true);
    loadTasks();
  };

  /**
   * Alterna o status da tarefa (concluída / pendente).
   */
  const handleToggleTask = async (taskId) => {
    const result = await TaskService.toggleTaskStatus(taskId);
    if (result.success && result.tasks) {
      setTasks(result.tasks);
    } else if (result.error) {
      Alert.alert('Erro', result.error);
    }
  };

  /**
   * Salva a tarefa (seja uma nova inclusão ou uma edição).
   */
  const handleSaveTask = async (title, description, editId = null) => {
    if (editId) {
      // Caso de Edição
      const result = await TaskService.updateTask(editId, title, description);
      if (result.success && result.tasks) {
        setTasks(result.tasks);
      } else {
        Alert.alert('Erro', result.error || 'Não foi possível editar a tarefa.');
      }
    } else {
      // Caso de Nova Tarefa
      const result = await TaskService.addTask(title, description);
      if (result.success) {
        // Recarrega lista ordenada
        await loadTasks();
      } else {
        Alert.alert('Erro', result.error || 'Não foi possível cadastrar a tarefa.');
      }
    }
  };

  /**
   * Ação de exclusão definitiva de uma tarefa.
   */
  const handleDeleteTask = async (taskId) => {
    const result = await TaskService.deleteTask(taskId);
    if (result.success && result.tasks) {
      setTasks(result.tasks);
    } else {
      Alert.alert('Erro', result.error || 'Não foi possível excluir a tarefa.');
    }
  };

  /**
   * Abertura do diálogo de opções (Editar / Excluir / Cancelar):
   * Pode ser acionado tanto pelo toque longo quanto pelo clique no ícone de três pontos.
   */
  const handleOpenTaskOptions = (task) => {
    Alert.alert(
      task.title,
      'Selecione a ação desejada para esta tarefa:',
      [
        {
          text: 'Editar',
          onPress: () => {
            setTaskToEdit(task);
            setModalVisible(true);
          },
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => confirmDeleteTask(task),
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  /**
   * Confirmação nativa antes de excluir para evitar exclusões acidentais.
   */
  const confirmDeleteTask = (task) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente excluir a tarefa "${task.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => handleDeleteTask(task.id),
        },
      ],
      { cancelable: true }
    );
  };

  /**
   * Abre o modal limpo para cadastrar nova tarefa.
   */
  const handleOpenNewTaskModal = () => {
    setTaskToEdit(null);
    setModalVisible(true);
  };

  // Cálculo das métricas a partir da camada de serviço
  const stats = TaskService.calculateStats(tasks);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Cabeçalho com estatísticas e botão de adicionar */}
        <Header stats={stats} onAddNewTask={handleOpenNewTaskModal} />

        {/* Lista nativa de tarefas com FlatList */}
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onToggle={handleToggleTask}
              onLongPress={handleOpenTaskOptions}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={!loading ? <EmptyState /> : null}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#1C1C1E']} // Cor do spinner nativo no Android
            />
          }
        />

        {/* Modal de Adição/Edição de Tarefas */}
        <TaskModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleSaveTask}
          taskToEdit={taskToEdit}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Cor de fundo da área segura (mesma do header)
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Fundo sutil para destacar os cards brancos
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
});
