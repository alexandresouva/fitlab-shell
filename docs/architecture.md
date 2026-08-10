# 🏗️ Arquitetura do Ecossistema MFE (Multirepo & Native Federation)

Este documento registra as decisões de design de arquitetura, padrões técnicos e diretrizes operacionais acordadas para o ecossistema de **Micro Frontends (MFE)**.

Para ver o tema de negócio oficial do projeto e como cada tecnologia é integrada, acesse o documento [project-theme.md](file:///Users/alexandre/Desktop/playground/mfe-cookbook/docs/project-theme.md).

---

## 1. Visão Geral da Arquitetura

O ecossistema é projetado sob o modelo **Multirepo** (repositórios de código separados) para simular o padrão de governança e escalabilidade do mercado real.

### Componentes Principais do Ecossistema

1.  **`mfe-tooling` (Pacote de Governança `@cookbook/mfe-tooling`):** Repositório isolado que centraliza regras de qualidade, modelos de IA e o motor de geração de novos projetos.
2.  **`mfe-shell` (Host/Orquestrador):** A casca da aplicação que controla autenticação, tema global, e carrega dinamicamente os Micro Frontends.
3.  **`mfe-[name]` (Remotes):** Aplicações independentes que hospedam subdomínios de negócio e expõem rotas de páginas para a Shell.

---

## 2. A Biblioteca de Governança (`@cookbook/mfe-tooling`)

A fundação do ecossistema é centralizada em um pacote de desenvolvimento que é distribuído para todos os repositórios remotos para evitar fadiga de configuração.

### O que o pacote `@cookbook/mfe-tooling` contém:

- **Módulo de Qualidade (ESLint & Prettier):** Centraliza as regras flat do ESLint, regras TypeScript, boas práticas do Angular Template (incluindo acessibilidade/a11y) e configurações padrão do `eslint-plugin-boundaries` focadas em remotos.
- **Regras e Agentes de IA:** Centraliza as configurações do ciclo de desenvolvimento assistido por IA (como o arquivo `.cursorrules`, custom skills do diretório `.agents/` para criação automática de issues e commits semânticos).
- **Angular Schematic de Scaffolding (`mfe-setup`):** Um gerador automatizado que cria o projeto a partir do zero utilizando o Angular CLI internamente na versão travada, e em seguida injeta automaticamente:
  - Linting estendido do pacote central.
  - Scripts de build configurados com o Native Federation.
  - Estrutura de pastas Feature-Based (`core/`, `shared/`, `features/`).
  - Instalação e configuração de Husky (git hooks) e Commitlint locais.
  - Injeção da esteira local de IA (`.agents/`).

---

## 3. Arquitetura da Shell (`mfe-shell`)

Por ser uma aplicação única e com o papel de orquestrador, a Shell não consome o schematic de geração de remotos, tendo suas regras configuradas de forma direta:

- **Configurações Locais:** Arquivos de linting e regras de boundaries são escritos diretamente em seu repositório, focados em proteger as camadas estruturais da casca (ex: separação estrita de `core/layout`, `core/auth`, `core/theme`).
- **Layout & Core Reativo:** A Shell é responsável por expor a casca visual e prover estados globais reativos baseados em **Angular Signals** (como chaveamento de tema claro/escuro via injeção de classes HTML + variáveis CSS globais, e tokens de autenticação).

---

## 4. Compartilhamento de Dependências & Negociação em Runtime

Para evitar duplicação de pacotes (como baixar o Angular duas vezes) e garantir estabilidade de execução, adotamos o compartilhamento de dependências via **Native Federation** suportado por **Import Maps** nativos do navegador.

### Tabela de Diretrizes de Versionamento

| Pacote                                        | Compartilhamento      | Tipo de Resolução                         | Objetivo                                                                                                                             |
| :-------------------------------------------- | :-------------------- | :---------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| **Angular Core (`@angular/*`, `rxjs`)**       | Singleton Obrigatório | `strictVersion: true`                     | Evitar conflitos de injeção de dependências e crash de runtime. Devem rodar estritamente sob a mesma versão Major.                   |
| **Design System (`@cookbook/design-system`)** | Singleton Flexível    | `strictVersion: false` com range `^1.0.0` | Permitir deploy independente. O navegador seleciona dinamicamente a maior versão minor/patch disponível na memória em runtime.       |
| **Bibliotecas Utilitárias (ex: `lodash`)**    | Negociação SemVer     | Fallback Automático                       | Se as versões forem compatíveis, compartilha. Se houver quebra de Major, o orquestrador isola e carrega ambas de forma transparente. |

---

## 5. Fluxo de Comunicação e Limites

Para manter o desacoplamento de deploy e desenvolvimento de forma sustentável:

- **Importações Cruzadas (Proibido):** Um MFE Remote nunca pode importar arquivos físicos de outro MFE ou da Shell em tempo de compilação.
- **Comunicação em Runtime:** Qualquer troca de estado necessária é realizada através de parâmetros na URL (query params) ou por meio de eventos nativos do navegador (`CustomEvent`), garantindo que os MFEs possam evoluir sem quebrar os outros.

---

## 6. Autenticação, Permissionamento & Menu Dinâmico

A casca (Shell) opera de forma totalmente guiada a dados (Data-Driven), eliminando o conhecimento rígido sobre regras ou links de remotos.

### Controle de Acesso e Segurança Reativa

- **Exposição de Perfis e Permissões:** A Shell autentica o usuário, recupera os dados base (`UserProfileDTO`) e a lista de privilégios (`UserPermissionsDTO`), expondo-os de forma unificada em `window.mfeContext`.
- **Diretiva Global (`*hasPermission`):** O pacote `@cookbook/mfe-tooling` (ou sub-pacotes correspondentes) exporta a lógica e as diretivas de acesso. Isso permite que qualquer MFE ou a Shell façam validações de UI de forma declarativa (`*hasPermission="'mfe-remote:write'"`).

### Roteamento Contextual e Áreas de Trabalho (Workspaces)

- **Workspaces por Path Parameter:** O menu lateral e as permissões de acesso são agrupados em áreas de trabalho (ex: Financeiro, RH, Operações). A área ativa é controlada via path parameter no início da URL (ex: `/:workspace-id/products`).
- **Fallback e Área Padrão:** Na inicialização, se nenhuma área for informada (caminho `/`), a Shell redireciona automaticamente para a área padrão do usuário (`defaultWorkspace` no perfil). Caso não exista, redireciona para a primeira área para a qual o usuário tenha permissão.
- **Reload de Contexto:** A transição de rota entre workspaces (ex: mudar de `/rh/` para `/finance/`) dispara a reinicialização lógica do estado da Shell, limpando caches e variáveis locais de forma segura para evitar vazamentos de dados entre contextos.

### O Componente Wrapper e o Header do Portal

- **MfeWrapperComponent:** Todos os remotes carregados no `ng-content` são encapsulados por um wrapper de visualização da Shell.
- **Carga Visual Instantânea (Manifesto):** O Header do wrapper exibe o título da aplicação (campo `label` no manifesto) e renderiza botões de ações estáticas pré-configurados no JSON de forma instantânea. Enquanto o bundle do MFE é baixado em background, o wrapper exibe um esqueleto (Skeleton Loader) na área de conteúdo.
- **Barramento de Cliques Desacoplados:** Os botões de ação do Header (ex: "Exportar") são renderizados pela Shell, mas quando clicados, disparam `CustomEvent` nativos mapeados no JSON. O remoto ativo apenas ouve esse evento localmente para executar sua ação de negócio, mantendo o desacoplamento de código.
- **Ações e Modais Comuns (Favoritos, Info, Avaliação):** O Header integra ações comuns nativas da Shell:
  - _Favoritar:_ Star toggle que salva o MFE na lista de acessos rápidos do usuário daquela área de trabalho específica.
  - _Info:_ Exibição de modal com metadados do MFE (Nome, Squad Responsável, Versão).
  - _Avaliar:_ Formulário integrado de feedback de satisfação do usuário sobre o MFE ativo.

### Menu Lateral e Cadastro Dinâmico (Deploy Livre)

- **navigation.manifest.json:** Durante o bootstrap, a Shell busca um manifesto dinâmico central que descreve a árvore de workspaces, itens de menu e caminhos.
- **Feature Toggles & Canary Deploy:** O manifesto introduz a chave `status` (`active` | `inactive` | `canary`) para cada MFE.
  - `inactive`: Oculta do menu lateral e impede que a rota seja acessada.
  - `canary`: Permite que apenas usuários com flag de beta-tester no perfil acessem e visualizem o MFE em produção.
- **MfeStatusGuard (Guarda de Rota de Performance):** A Shell executa um guard de rota global que avalia o status do MFE no manifesto _antes_ de iniciar o carregamento dinâmico do Native Federation. Se o MFE estiver marcado como `inactive` (ou `canary` para um usuário comum), o guard bloqueia a navegação e evita requisições HTTP desnecessárias para buscar o arquivo `remoteEntry.json` do remoto.
- **Reversão Instantânea (Rollback):** Alterações no status no manifesto central (gerenciado pelo MFE Administrativo) ativam ou desativam rotas em segundos para todos os usuários, sem necessidade de novos builds ou deploys de código.

---

## 7. Estrutura de Hospedagem e Pipelines (DevOps)

Para otimizar os custos de infraestrutura e acelerar a esteira de entregas, adotamos um único ambiente unificado:

### Bucket S3 Único com Isolamento Lógico

- **Hospedagem Unificada:** A Shell, a biblioteca compartilhada e todos os MFEs Remotos residem sob o **mesmo Bucket S3 físico**, divididos em subpastas com o nome do respectivo MFE (ex: `s3://mfe-assets/nome-do-mfe/`).
- **Isolamento no Deploy:** A esteira de CI/CD (GitHub Actions) usa um template comum de deploy que infere a pasta destino obrigatoriamente do **nome do repositório Git**. Como o nome do repositório é único, garante-se de forma lógica e simples que um MFE Remote nunca sobrescreva os arquivos da Shell ou de outros MFEs.
