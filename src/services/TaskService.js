/**
 * ============================================================================
 * CAMADA DE NEGÓCIO / SERVIÇO (BUSINESS / SERVICE LAYER)
 * Arquivo: src/services/TaskService.js
 * 
 * Esta camada concentra TODAS as regras de negócio e validações da aplicação.
 * Ela orquestra as ações do usuário (adicionar, editar, alternar status, remover)
 * e decide se os dados estão válidos antes de chamar o repositório para salvar.
 * 
 * Benefício na Arquitetura em Camadas:
 * - A interface gráfica (UI) não precisa saber onde nem como os dados são salvos.
 * - Ela apenas solicita: "TaskService, adicione esta tarefa".
 * - Se a regra de validação mudar (ex: título ter no mínimo 3 caracteres),
 *   alteramos apenas aqui, sem mexer na tela nem no banco/arquivo.
 * ============================================================================
 */

import { createTask } from '../models/Task';
import { TaskRepository } from '../repositories/TaskRepository';

export const TaskService = {
  /**
   * Retorna a lista de tarefas, aplicando a regra de ordenação:
   * 1º Tarefas pendentes primeiro (mais recentes no topo)
   * 2º Tarefas já concluídas no final da lista
   * 
   * @returns {Promise<Array>} Lista de tarefas ordenadas
   */
  async getTasks() {
    const tasks = await TaskRepository.getAllTasks();

    // Regra de ordenação da aplicação
    return tasks.sort((a, b) => {
      // Se uma está concluída e a outra não, a pendente vem antes
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1;
      }
      // Se ambas tiverem o mesmo status, ordena pela data mais recente
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  },

  /**
   * Valida e adiciona uma nova tarefa.
   * 
   * Regras de negócio:
   * - O título não pode ser vazio ou conter apenas espaços.
   * 
   * @param {string} title - Título da tarefa
   * @param {string} description - Descrição ou observações
   * @returns {Promise<{ success: boolean, task?: object, error?: string }>}
   */
  async addTask(title, description = '') {
    // Validação da regra de negócio: título obrigatório
    if (!title || title.trim().length === 0) {
      return { success: false, error: 'O título da tarefa não pode estar vazio.' };
    }

    // 1. Cria o objeto estruturado usando a camada de modelo
    const newTask = createTask(title, description);

    // 2. Busca as tarefas existentes
    const currentTasks = await TaskRepository.getAllTasks();

    // 3. Adiciona a nova tarefa no início da lista
    const updatedTasks = [newTask, ...currentTasks];

    // 4. Salva a nova lista através do repositório
    const saved = await TaskRepository.saveAllTasks(updatedTasks);

    if (!saved) {
      return { success: false, error: 'Falha ao gravar os dados no armazenamento local.' };
    }

    return { success: true, task: newTask };
  },

  /**
   * Alterna o estado de conclusão de uma tarefa (de pendente para concluída e vice-versa).
   * 
   * @param {string} taskId - ID da tarefa a ser alternada
   * @returns {Promise<{ success: boolean, tasks?: Array, error?: string }>}
   */
  async toggleTaskStatus(taskId) {
    if (!taskId) {
      return { success: false, error: 'Identificador de tarefa inválido.' };
    }

    const tasks = await TaskRepository.getAllTasks();
    const taskIndex = tasks.findIndex((t) => t.id === taskId);

    if (taskIndex === -1) {
      return { success: false, error: 'Tarefa não encontrada.' };
    }

    // Inverte o booleano de conclusão
    tasks[taskIndex].isCompleted = !tasks[taskIndex].isCompleted;

    const saved = await TaskRepository.saveAllTasks(tasks);
    if (!saved) {
      return { success: false, error: 'Erro ao atualizar status da tarefa.' };
    }

    // Retorna a lista reordenada
    const reorderedTasks = await this.getTasks();
    return { success: true, tasks: reorderedTasks };
  },

  /**
   * Atualiza os dados de uma tarefa existente (título e descrição).
   * 
   * @param {string} taskId - ID da tarefa
   * @param {string} newTitle - Novo título
   * @param {string} newDescription - Nova descrição
   * @returns {Promise<{ success: boolean, tasks?: Array, error?: string }>}
   */
  async updateTask(taskId, newTitle, newDescription = '') {
    if (!taskId) {
      return { success: false, error: 'Identificador de tarefa inválido.' };
    }

    if (!newTitle || newTitle.trim().length === 0) {
      return { success: false, error: 'O título não pode estar vazio.' };
    }

    const tasks = await TaskRepository.getAllTasks();
    const taskIndex = tasks.findIndex((t) => t.id === taskId);

    if (taskIndex === -1) {
      return { success: false, error: 'Tarefa não encontrada para edição.' };
    }

    // Atualiza os dados da tarefa
    tasks[taskIndex].title = newTitle.trim();
    tasks[taskIndex].description = newDescription.trim();

    const saved = await TaskRepository.saveAllTasks(tasks);
    if (!saved) {
      return { success: false, error: 'Erro ao salvar alterações da tarefa.' };
    }

    const reorderedTasks = await this.getTasks();
    return { success: true, tasks: reorderedTasks };
  },

  /**
   * Remove uma tarefa da lista pelo seu ID.
   * 
   * @param {string} taskId - ID da tarefa a ser excluída
   * @returns {Promise<{ success: boolean, tasks?: Array, error?: string }>}
   */
  async deleteTask(taskId) {
    if (!taskId) {
      return { success: false, error: 'Identificador de tarefa inválido.' };
    }

    const tasks = await TaskRepository.getAllTasks();
    const filteredTasks = tasks.filter((t) => t.id !== taskId);

    const saved = await TaskRepository.saveAllTasks(filteredTasks);
    if (!saved) {
      return { success: false, error: 'Erro ao excluir a tarefa do armazenamento.' };
    }

    const reorderedTasks = await this.getTasks();
    return { success: true, tasks: reorderedTasks };
  },

  /**
   * Calcula estatísticas resumidas das tarefas para exibição no cabeçalho.
   * 
   * @param {Array} tasks - Lista de tarefas
   * @returns {{ total: number, completed: number, pending: number, percentage: number }}
   */
  calculateStats(tasks = []) {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.isCompleted).length;
    const pending = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, percentage };
  },
};

