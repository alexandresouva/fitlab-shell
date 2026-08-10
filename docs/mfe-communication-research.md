# 📡 Pesquisa e Descobertas: Estratégias de Comunicação entre Micro Frontends

Este documento detalha os conceitos, códigos de exemplo e comparações arquiteturais para a troca de estado e mensagens entre a Shell e os Micro Frontends Remotos de forma desacoplada e performática.

---

## 1. Padrão Recomendado: Híbrido (Cache + Eventos Nativos)

Para que a comunicação seja 100% agnóstica a frameworks (Angular, React, Vue, Vanilla HTML/Flask), evitamos o uso de bibliotecas de estado de terceiros no nível global da janela (`window`). Em vez disso, utilizamos o **DOM Event System** do navegador combinado com um objeto de cache em memória.

```
+-------------------------------------------------------------+
|                     Browser (Window)                        |
|                                                             |
|  +-------------------------------------------------------+  |
|  |                   mfeContext (Cache)                  |  |
|  |   _state = { userProfile: {...} }                     |  |
|  |   getState(key)   |   setState(key, value)            |  |
|  +-------------------------------------------------------+  |
|                               |                             |
|                               v                             |
|                    CustomEvent ('mfe:state:key')            |
|                               |                             |
|           +-------------------+-------------------+         |
|           v                                       v         |
|   MFE Products (Angular)                  MFE Checkout (React)
|   - Ouve 'mfe:state:key'                  - Ouve 'mfe:state:key'
|   - Converte para Signals                 - Converte para useState
+-------------------------------------------------------------+
```

### Código de Inicialização na Shell (Vanilla JS puro)

```javascript
// app.component.ts (Shell) - Executado uma única vez no bootstrap
window.mfeContext = {
  _state: {},

  // Retorno síncrono do último valor armazenado (comportamento de BehaviorSubject)
  getState(key) {
    return this._state[key];
  },

  // Grava o valor e despacha a atualização na engine de eventos do navegador
  setState(key, value) {
    this._state[key] = value;
    window.dispatchEvent(
      new CustomEvent(`mfe:state:${key}`, { detail: value })
    );
  }
};
```

### Exemplo de Inscrição e Limpeza (Consumo Agnóstico)

```javascript
// 1. Obtém o estado inicial síncrono para renderização imediata
const userProfile = window.mfeContext.getState('userProfile');

// 2. Cria a função listener para atualizações futuras
const onProfileUpdate = (event) => {
  const updatedProfile = event.detail;
  console.log('Perfil atualizado em tempo de execução:', updatedProfile);
};

// 3. Registra na fila de eventos nativos do navegador
window.addEventListener('mfe:state:userProfile', onProfileUpdate);

// 4. Unsubscribe (Crucial para evitar vazamentos de memória ao desmontar a página)
// window.removeEventListener('mfe:state:userProfile', onProfileUpdate);
```

---

## 2. Tipagem em Desenvolvimento: O Contrato de Eventos (`Event Bus` Helper)

Embora a comunicação em tempo de execução seja feita por strings soltas do navegador, nós mantemos a segurança em tempo de compilação criando uma classe utilitária de suporte com tipos TypeScript dentro do pacote compartilhado `@cookbook/contracts`.

```typescript
// @cookbook/contracts (Instalado nos MFEs)
export interface MfeSharedState {
  userProfile: { name: string; email: string };
  userPermissions: string[];
  language: 'pt-BR' | 'en-US';
}

export class MfeEventBus {
  // Emite evento tipado
  static emit<K extends keyof MfeSharedState>(
    key: K,
    value: MfeSharedState[K]
  ): void {
    window.mfeContext.setState(key, value);
  }

  // Ouve evento com autocomplete e tipagem no editor de código
  static listen<K extends keyof MfeSharedState>(
    key: K,
    callback: (value: MfeSharedState[K]) => void
  ): () => void {
    const handler = (e: Event) => callback((e as CustomEvent).detail);
    window.addEventListener(`mfe:state:${key}`, handler);

    // Retorna a função de unsubscribe diretamente
    return () => window.removeEventListener(`mfe:state:${key}`, handler);
  }
}
```

---

## 3. Padrão Alternativo: RxJS Centralizado (Para análise futura)

Caso o ecossistema venha a se tornar puramente Angular e os times queiram tirar proveito de operadores avançados de fluxo de dados (como `debounceTime`, `switchMap`, `filter`), mapeamos a alternativa de um Barramento baseado em RxJS.

### Código de Implementação

```typescript
import { Subject, BehaviorSubject } from 'rxjs';

window.mfeRxjsBridge = {
  _subjects: new Map<string, Subject<any>>(),

  // Obtém ou inicializa um canal de dados dinâmico
  getChannel<T>(key: string, defaultValue?: T): Subject<T> {
    if (!this._subjects.has(key)) {
      const subject =
        defaultValue !== undefined
          ? new BehaviorSubject<T>(defaultValue)
          : new Subject<T>();
      this._subjects.set(key, subject);
    }
    return this._subjects.get(key) as Subject<T>;
  }
};
```

### Comparação das Abordagens

| Característica        | Opção Híbrida (Eventos Nativos + Cache)                   | Opção RxJS Bridge                                              |
| :-------------------- | :-------------------------------------------------------- | :------------------------------------------------------------- |
| **Agnosticismo**      | 100% Nativo (Funciona em Angular, React, Vue, HTML/Flask) | Restrito (Exige carregar a biblioteca RxJS em cada framework)  |
| **Performance**       | Alta (Executado no compilador C++ do browser)             | Média (Executado via loops JS da biblioteca RxJS)              |
| **Tamanho do Bundle** | Zero bytes extras                                         | Adiciona peso de biblioteca em remotes não-Angular             |
| **Complexidade**      | Simples (Baseado em funções normais da Web API)           | Alta (Exige conhecimento de Reactive Programming e operadores) |

---

## 4. Contrato de Roteamento por Prefixo (Wildcard Routing)

Para manter a Shell cega às regras de sub-rotas e parâmetros específicos de negócios dos remotes, o ecossistema utiliza roteamento por delegação:

1.  **A Shell decide apenas a porta de entrada:** Ela escuta caminhos de primeiro nível (ex: `/products/**`) e repassa o controle de roteamento ao remote.
2.  **O Remote resolve internamente:** O sub-roteador do remote gerencia parâmetros de rota (`/detail/:id`) e query params (`?viewMode=full`) de forma local, injetando os valores de forma reativa nos componentes de página de forma autônoma.
3.  **Contrato Agnostic:** A URL serve como a única ponte de transição entre remotes, viabilizando a futura alteração tecnológica dos micro-frontends sem impactar a orquestração da casca.
