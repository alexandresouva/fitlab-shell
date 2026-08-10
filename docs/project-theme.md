# 🏋️ FitLab — Assistente Pessoal de Treinos & Nutrição

O **FitLab** é o tema oficial do ecossistema de micro-frontends deste projeto. Trata-se de um portal de utilidades e gerenciamento de qualidade de vida voltado para atletas e praticantes de treinos físicos (musculação/calistenia), focado em montagem de rotinas, cronômetros de alta performance, acompanhamento de metas nutricionais e exportação de fichas.

Este tema demonstra a convivência de tecnologias (Angular, React, Vue e Python Flask) sob as três abordagens de renderização de micro-frontends da Shell em um cenário prático, útil e visualmente rico.

---

## 🏗️ Matriz de Módulos & Tecnologias

A tabela abaixo descreve o papel de cada MFE no portal, o stack utilizado e a estratégia de carregamento adotada:

| Módulo MFE           | Escopo de Negócio                                         | Stack Utilizado  | Abordagem de Carga                    |
| :------------------- | :-------------------------------------------------------- | :--------------- | :------------------------------------ |
| **Shell**            | Workspace Switcher, Perfil do Usuário e Metas Diárias     | **Angular 18**   | Roteador SPA (Hospedeiro)             |
| **Workout Planner**  | Montador de rotinas de exercícios diários com Signals     | **Angular 18**   | `angular-native` (Native Federation)  |
| **Interval Timer**   | Cronômetro de descanso entre séries com áudio e alertas   | **React 18**     | `web-component` (Custom Element)      |
| **Nutrition Wheel**  | Registro de refeições e gráfico de macronutrientes        | **Vue 3**        | `web-component` (defineCustomElement) |
| **Workout Card Gen** | Upload de treinos e exportação de fichas em PDF compactas | **Python Flask** | `iframe` (Iframe Controlado)          |

---

## 🔌 Especificação da Integração & Comunicação

### 1. Estado Global do Usuário & Perfil

- A **Shell** inicializa o contexto recuperando os dados do usuário (como peso, altura, metas diárias de calorias e água) e os expõe no coordenador de estado global `window.mfeContext.userProfile`.
- O MFE _Nutrition Wheel_ lê essas metas de consumo diário para calcular as proporções de macronutrientes ideais relativas ao peso do usuário.

### 2. O MFE Wrapper & Controle de Transição Visual

Para mitigar a latência de carregamento de frameworks adicionais (React/Vue) e frames (Flask), a Shell utiliza o `MfeWrapperComponent`:

- Ao mudar de rota, a Shell lê o `type` do MFE no `navigation.manifest.json`.
- O Wrapper renderiza imediatamente o título do aplicativo no cabeçalho.
- Enquanto o script do remoto ou o iframe está baixando, exibe-se um **Skeleton Loader** na área de conteúdo.
- O MFE é mantido invisível (`display: none`) até que o evento de carregamento complete, acionando um efeito fade-in suave para simular transição SPA nativa.

### 3. Comunicação Baseada em Eventos Nativos (Exemplo de Integração)

- **Série Concluída:** Quando o usuário está realizando o treino no MFE _Workout Planner_ (Angular) e marca uma série como "concluída", a aplicação dispara um evento nativo no `window`:
  ```javascript
  window.dispatchEvent(
    new CustomEvent('mfe:workout:set-completed', {
      detail: { restTimeSeconds: 60 }
    })
  );
  ```
- **Disparo do Cronômetro:** O MFE _Interval Timer_ (React) escuta este evento localmente e inicia automaticamente a contagem regressiva de 60 segundos de descanso, tocando um bipe de áudio quando o tempo acabar. Isso mostra uma integração limpa entre os frameworks Angular e React em tempo de execução.
- **Ponte de Mensagens (PostMessage Bridge) para o Iframe:** O MFE _Workout Card Gen_ (Flask) roda em documento isolado. Para ler a rotina de exercícios ativa criada no Angular e gerar o PDF, o iframe envia uma mensagem para o pai solicitando o treino ativo. A Shell escuta, valida o `allowedOrigin` configurado no manifesto, e devolve os dados em JSON.

---

## 🧬 Justificativa Técnica das Escolhas de Stack

- **Angular 18 Nativo (Workout Planner):** Desempenho máximo para a ferramenta principal. Compartilha as dependências e o bootstrap da Shell via Native Federation, reduzindo o tempo de carregamento para milissegundos.
- **React 18 (Interval Timer):** O cronômetro precisa de atualizações de alta frequência para animar os milissegundos e a borda circular de progresso. React gerencia estados de renderização de tempo de forma robusta e possui excelente ecossistema para efeitos de física/animação de tempo.
- **Vue 3 (Nutrition Wheel):** Requer renderização leve e rápida. O Vue compila componentes gráficos nativos como Custom Elements com facilidade extrema (`defineCustomElement`), oferecendo carregamento rápido do gráfico de macronutrientes (roda de macros).
- **Python Flask (Workout Card Gen):** O processamento de criação de arquivos PDF altamente formatados para impressão (com tabelas de repetições, checkboxes de séries e layout responsivo para celular) é resolvido de forma madura usando bibliotecas de geração de relatórios em Python (como `reportlab` ou `weasyprint`). Manter essa lógica no backend Flask legado, acessível via iframe, demonstra o reuso perfeito de sistemas legados.
