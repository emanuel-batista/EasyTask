/**
 * ============================================================================
 * PONTO DE ENTRADA DA APLICAÇÃO (ENTRY POINT)
 * Arquivo: App.js
 * 
 * Aplicativo: EasyTask
 * Conceito: Arquitetura em Camadas (Layered Architecture)
 * 
 * Estrutura do projeto:
 * - src/models/        -> Camada de Domínio / Modelo (Task.js)
 * - src/repositories/  -> Camada de Dados / Persistência (TaskRepository.js)
 * - src/services/      -> Camada de Negócio / Regras (TaskService.js)
 * - src/presentation/  -> Camada de Apresentação / Telas e Componentes (UI)
 * ============================================================================
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/presentation/screens/HomeScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      {/* 
        Configuração da barra de status:
        - style="dark": ícones pretos (hora, bateria, wifi)
        - translucent={false}: garante que a barra não fique sobreposta ao layout no Android
        - backgroundColor="#FFFFFF": fundo branco limpo alinhado ao design
      */}
      <StatusBar style="dark" backgroundColor="#FFFFFF" translucent={false} />
      
      {/* Renderização da tela principal da Camada de Apresentação */}
      <HomeScreen />
    </SafeAreaProvider>
  );
}
