# Home Colab

Aplicativo mobile para organizacao familiar com tarefas, agenda e colaboracao entre membros da casa.

## Visao Geral

O Home Colab foi construido com React Native + Expo e usa Supabase como backend.

No app, a familia pode:
- Criar ou entrar em um grupo familiar por codigo.
- Gerenciar membros (nome, cor e papel).
- Criar, editar, concluir e remover tarefas.
- Usar recorrencia de tarefas (unica, diaria, semanal e mensal).
- Organizar compromissos no modulo de calendario.
- Navegar por visoes de dia, semana e mes.

## Tecnologias

- Expo
- React Native
- React
- Supabase

## Estrutura do Projeto

```text
FamilyTaskerApp/
  App.js
  index.js
  app.json
  src/
    components/
      OnboardingFlow.js
      DashboardShell.js
      Header.js
      Footer.js
      TasksModule.js
      CalendarModule.js
      TaskFormModal.js
      MemberManagementModal.js
      common/
        DateNavigatorPicker.js
        MemberFormSection.js
        MonthCellBadges.js
        MonthGrid.js
        SharedMonthView.js
        TaskCards.js
        TimelineColumnsView.js
        TimePickerModal.js
        WeeklyColumnHeader.js
    hooks/
      useAppData.js
    services/
      supabase.js
    utils/
      taskRules.js
```

## Requisitos

- Node.js 18+
- npm
- Expo Go no celular (ou emulador Android/iOS)

## Instalacao

```bash
npm install
```

## Executar o Projeto

```bash
npm run start
```

Comandos auxiliares:

```bash
npm run android
npm run ios
npm run web
```

## Configuracao do Supabase

O projeto usa as tabelas abaixo:
- grupos
- membros
- tarefas
- tarefas_concluidas

Atualmente a conexao esta em `src/services/supabase.js`.

Para producao, o recomendado e usar variaveis de ambiente do Expo (`EXPO_PUBLIC_*`) em vez de manter chaves no codigo.

## Fluxos Principais

1. Onboarding
- Criar novo grupo (administrador)
- Entrar em grupo existente com codigo

2. Dashboard
- Modulo Tarefas
- Modulo Calendario
- Navegacao por dia/semana/mes

3. Modais
- Formulario de tarefa
- Gerenciamento de membros
- Seletor de hora

## Observacoes

- Interface em portugues (pt-BR).
- Calendario com semana iniciando na segunda-feira.
- Foco em usabilidade para rotina familiar no dia a dia.

## Licenca

Este projeto possui arquivo de licenca em `LICENSE`.
