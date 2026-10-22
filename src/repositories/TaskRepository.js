/**
 * ============================================================================
 * CAMADA DE DADOS / PERSISTÊNCIA (DATA ACCESS / REPOSITORY LAYER)
 * Arquivo: src/repositories/TaskRepository.js
 * 
 * Esta camada é a ÚNICA responsável pela entrada e saída física de dados.
 * Ela lida diretamente com o sistema de arquivos do dispositivo (Android/iOS).
 * 
 * Benefício na Arquitetura em Camadas:
 * - Se no futuro o professor pedir para trocar o arquivo local por SQLite,
 *   AsyncStorage ou uma API remota, APENAS este arquivo precisará ser alterado.
 *   As camadas de Apresentação e Serviço continuarão funcionando normalmente.
 * ============================================================================
 */

import * as FileSystem from 'expo-file-system/legacy';

// Caminho absoluto do arquivo onde as tarefas serão salvas localmente
// Exemplo no Android: file:///data/user/0/com.easytask/files/easytask_data.json
const FILE_PATH = `${FileSystem.documentDirectory}easytask_data.json`;

export const TaskRepository = {
  /**
   * Obtém o caminho do arquivo para exibição ou depuração.
   * @returns {string}
   */
  getStoragePath() {
    return FILE_PATH;
  },

  /**
   * Lê todas as tarefas gravadas no arquivo local.
   * Se o arquivo ainda não existir (primeira execução), cria o arquivo com uma lista vazia.
   * 
   * @returns {Promise<Array>} Lista de tarefas recuperadas
   */
  async getAllTasks() {
    try {
      // 1. Verifica se o arquivo já existe no armazenamento do dispositivo
      const fileInfo = await FileSystem.getInfoAsync(FILE_PATH);

      if (!fileInfo.exists) {
        // Se não existir, inicializa o arquivo com um array vazio []
        await this.saveAllTasks([]);
        return [];
      }

      // 2. Lê o conteúdo bruto como texto puro
      const fileContent = await FileSystem.readAsStringAsync(FILE_PATH);

      // 3. Se o arquivo estiver vazio por algum motivo, retorna array vazio
      if (!fileContent || fileContent.trim() === '') {
        return [];
      }

      // 4. Converte a string JSON para um array de objetos JavaScript
      const parsedTasks = JSON.parse(fileContent);

      return Array.isArray(parsedTasks) ? parsedTasks : [];
    } catch (error) {
      console.error('Erro ao ler tarefas do arquivo local:', error);
      // Em caso de falha, retorna lista vazia para evitar que o app trave
      return [];
    }
  },

  /**
   * Salva a lista completa de tarefas no arquivo local em formato JSON.
   * 
   * @param {Array} tasks - Array de objetos de tarefas a serem persistidos
   * @returns {Promise<boolean>} Retorna true se salvou com sucesso
   */
  async saveAllTasks(tasks) {
    try {
      // Converte o array de tarefas para formato texto JSON indentado
      const jsonContent = JSON.stringify(tasks, null, 2);

      // Grava no arquivo sobrescrevendo o conteúdo anterior
      await FileSystem.writeAsStringAsync(FILE_PATH, jsonContent);

      return true;
    } catch (error) {
      console.error('Erro ao salvar tarefas no arquivo local:', error);
      return false;
    }
  },

  /**
   * Utilitário opcional: remove o arquivo local de tarefas (reset dos dados).
   * 
   * @returns {Promise<boolean>}
   */
  async clearStorage() {
    try {
      const fileInfo = await FileSystem.getInfoAsync(FILE_PATH);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(FILE_PATH);
      }
      return true;
    } catch (error) {
      console.error('Erro ao apagar arquivo de tarefas:', error);
      return false;
    }
  },
};

