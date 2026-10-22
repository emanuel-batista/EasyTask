/**
 * ============================================================================
 * CAMADA DE DOMÍNIO / MODELO (MODEL LAYER)
 * Arquivo: src/models/Task.js
 * 
 * Esta camada é responsável por definir a estrutura e o formato de dados
 * de uma "Tarefa" (Task) no EasyTask.
 * 
 * Benefício na Arquitetura em Camadas:
 * - Garante que todas as camadas (Apresentação, Negócio e Dados) trabalhem
 *   com o mesmo padrão de objeto.
 * ============================================================================
 */

/**
 * Cria um novo objeto de tarefa com valores padrão.
 * 
 * @param {string} title - Título da tarefa (obrigatório)
 * @param {string} [description=""] - Descrição ou observações adicionais (opcional)
 * @returns {object} Objeto estruturado da tarefa
 */
export function createTask(title, description = '') {
  return {
    // Identificador único baseado no timestamp atual (ex: "1729624500000")
    id: Date.now().toString(),
    
    // Título da tarefa sem espaços desnecessários nas pontas
    title: title.trim(),
    
    // Descrição ou anotação complementar
    description: description.trim(),
    
    // Estado de conclusão: toda tarefa inicia como pendente (false)
    isCompleted: false,
    
    // Data e hora de criação no formato ISO
    createdAt: new Date().toISOString(),
  };
}

