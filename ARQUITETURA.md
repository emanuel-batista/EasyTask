# EasyTask - Documentação da Arquitetura em Camadas

Este documento explica os conceitos teóricos e práticos aplicados no desenvolvimento do aplicativo **EasyTask**, desenvolvido em **React Native** com **Expo**.

---

## 1. O Conceito de Arquitetura em Camadas (Layered Architecture)

A **Arquitetura em Camadas** é um padrão de projeto estrutural amplamente utilizado na engenharia de software cujo princípio fundamental é a **Separação de Responsabilidades (Separation of Concerns)**.

No **EasyTask**, o sistema é dividido em 4 camadas bem definidas:

```
┌────────────────────────────────────────────────────────┐
│ 1. Camada de Apresentação (UI / Presentation Layer)    │
│    - HomeScreen, TaskItem, TaskModal, Header           │
└───────────────────────────┬────────────────────────────┘
                            │ solicita ações
                            ▼
┌────────────────────────────────────────────────────────┐
│ 2. Camada de Negócio (Service / Business Layer)        │
│    - TaskService (validação, ordenação, regras)        │
└───────────────────────────┬────────────────────────────┘
                            │ persiste dados
                            ▼
┌────────────────────────────────────────────────────────┐
│ 3. Camada de Persistência (Data Access / Repository)   │
│    - TaskRepository (leitura/escrita no tasks.json)    │
└───────────────────────────┬────────────────────────────┘
                            │ grava em disco
                            ▼
┌────────────────────────────────────────────────────────┐
│ 4. Sistema de Arquivos do Dispositivo                  │
│    - Arquivo físico: tasks.json                        │
└────────────────────────────────────────────────────────┘

        ▲ utiliza
        │
┌───────┴────────────────────────────────────────────────┐
│ 4. Camada de Domínio / Modelo (Model Layer)            │
│    - Task (estrutura: id, title, isCompleted, ...)     │
└────────────────────────────────────────────────────────┘
```

---

## 2. Detalhamento de Cada Camada

### Camada 1: Domínio / Modelo (`src/models/Task.js`)
- **Responsabilidade**: Define a estrutura oficial dos dados de uma tarefa (`id`, `title`, `description`, `isCompleted`, `createdAt`).
- **Por que existe?** Garante que todas as outras camadas trabalhem com a mesma estrutura de dados previsível, evitando campos faltantes ou tipos incorretos.

### Camada 2: Persistência / Dados (`src/repositories/TaskRepository.js`)
- **Responsabilidade**: Realizar as operações de entrada e saída (I/O) no arquivo físico local do aparelho (`easytask_data.json`) utilizando a biblioteca nativa `expo-file-system`.
- **Por que existe?** Desacopla a forma de armazenamento do restante do sistema. Se no futuro for necessário trocar o arquivo `.json` por SQLite ou uma API na nuvem, **nenhuma outra camada precisará ser alterada**.

### Camada 3: Negócio / Serviço (`src/services/TaskService.js`)
- **Responsabilidade**: Aplicar as regras de negócio da aplicação:
  - Validações (impede cadastrar tarefa sem título).
  - Regras de ordenação (tarefas pendentes no topo, tarefas concluídas ao final).
  - Cálculo de estatísticas e percentual de progresso.
- **Por que existe?** Garante que a lógica do negócio não fique misturada com botões, estilos ou elementos de tela.

### Camada 4: Apresentação (`src/presentation/`)
- **Responsabilidade**: Renderizar a interface visual e capturar as interações do usuário.
- **Componentes**:
  - `HomeScreen.js`: Orquestra o estado visual da tela e respeita as áreas seguras do dispositivo via `react-native-safe-area-context`.
  - `Header.js`: Exibe o título, estatísticas e barra de progresso.
  - `TaskItem.js`: Renderiza cada item com suporte a toque simples (concluir), toque longo no card e clique direto no botão de três pontos (`more-vert`).
  - `TaskModal.js`: Modal para criar e editar tarefas.
  - `EmptyState.js`: Mensagem minimalista para quando não houver tarefas.

---

## 3. Por que persistência em `.json` e não `.txt`?

1. **Legibilidade e Padrão de Mercado**: Arquivos `.json` são arquivos de texto puro legíveis por humanos e representam o padrão absoluto na indústria de software para estruturação de dados leves.
2. **Integridade de Tipos**: Permite salvar tipos nativos (booleanos `isCompleted: true`, timestamps e strings) sem o risco de corromper o arquivo.
3. **Segurança contra Delimitadores**: Se usássemos `.txt` com delimitadores (ex: `1|Estudar React|false`), qualquer tarefa que o usuário digitasse contendo o caractere `|` quebraria o sistema. Com JSON (`JSON.stringify` / `JSON.parse`), qualquer texto digitado pelo usuário é tratado e escapado com segurança.

---

## 4. Recursos Nativos do Android Utilizados

O aplicativo foi projetado para valorizar recursos nativos do ecossistema Android:

- **Área Segura e Barra de Notificações (`react-native-safe-area-context`)**: Respeita a barra de status e entalhes de câmera (*notches*), garantindo que o cabeçalho fique perfeitamente posicionado abaixo da barra de notificações.
- **Botão Direto de Opções & Toque Longo (`onLongPress` + botão `more-vert`)**: Permite tanto o toque longo no card quanto o clique direto nos três pontos para acionar o menu de contexto.
- **Diálogos Nativos (`Alert.alert`)**: Usa o popup de confirmação e ações padrão do Android para opções de "Editar" e "Excluir".
- **Feedback Tátil (`expo-haptics`)**: Resposta vibratória sutil ao concluir tarefas e nos menus de ação.
- **Efeito Ripple (`android_ripple`)**: Efeito de onda visual nativo do Material Design nos toques dos botões e cards.
- **Atualização por Gesto (`RefreshControl`)**: Spinner nativo do Android ao puxar a lista para baixo.
- **Teclado Inteligente (`KeyboardAvoidingView`)**: Adaptação da tela durante a digitação para não obstruir os campos.

---

## 5. Diretrizes de Clean Code e Design

- **Zero Emojis**: Interface sóbria, elegante e profissional, utilizando apenas ícones funcionais do `MaterialIcons`.
- **Código Comentado em Português**: Cada arquivo e função contém blocos explicativos detalhando sua responsabilidade e funcionamento.
