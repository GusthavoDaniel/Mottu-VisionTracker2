# Mottu VisionTracker

## Proposta e Funcionalidades

O **Mottu VisionTracker** é um aplicativo móvel desenvolvido em **React Native** com **Expo** e uma API de backend em **Java com Spring Boot**, projetado para ser uma solução completa de **Gestão Inteligente de Pátio** para frotas de motocicletas.

### Funcionalidades Implementadas (Requisitos FIAP)

| Requisito | Descrição | Status |
| :--- | :--- | :--- |
| **1. Telas Funcionais** | Implementação funcional de todas as telas do app. | **COMPLETO** |
| **3. Notificação via Push** | Cenário realista de envio e recebimento de notificações push (via Expo). | **COMPLETO** |
| **4. Integração com API** | Implementação de operações CRUD completas e tratamento de formulários (validações, feedback) com a API Java. | **COMPLETO** |
| **5. Localização e Internacionalização** | Suporte aos idiomas Português (pt), Espanhol (es) e Inglês (en), com troca automática e gerenciamento de strings. | **COMPLETO** |
| **6. Estilização com Tema** | Suporte a modo claro e modo escuro (Dark/Light Mode), com toggle manual na tela principal. | **COMPLETO** |
| **7. Arquitetura de Código** | Organização lógica de arquivos, separação de responsabilidades (componentes, serviços, contextos) e padronização com ESLint/Prettier. | **COMPLETO** |
| **8. Documentação e Apresentação** | README completo e gravação de vídeo demonstrando o app. | **COMPLETO** |
| **2. Publicação do app** | Publicação do app no Firebase App Distribution e tela "Sobre o App" com hash do commit. | **PENDENTE** |

### Telas Principais

*   **Dashboard:** Visão geral do pátio, KPIs operacionais (permanência média, entradas/saídas) e alertas críticos.
*   **Motos:** Listagem, busca, cadastro, edição e exclusão (CRUD completo) de motocicletas.
*   **Alertas:** Histórico de alertas recebidos.
*   **Mapa do Pátio:** Visualização da localização das motos (simulado).
*   **Testes:** Tela para testar o envio e recebimento de notificações push.
*   **Configurações:** Tela para seleção de idioma e alternância de tema (Dark/Light Mode).

## Arquitetura do Projeto

O projeto é composto por duas partes principais:

*   **Frontend**: Aplicativo móvel desenvolvido em **React Native** com **Expo**, utilizando **Firebase Authentication** para o login e **i18next** para internacionalização.
*   **Backend**: API RESTful desenvolvida em **Java** com **Spring Boot**, utilizando **Spring Data JPA** para persistência de dados.

## Estrutura de Pastas

```
Mottu-VisionTracker2/
├── app/                     # Frontend React Native (Expo)
│   ├── (auth)/              # Telas de autenticação (login, cadastro)
│   ├── (tabs)/              # Telas principais (Dashboard, Motos, Alertas, etc.)
│   ├── assets/              # Imagens, ícones
│   ├── components/          # Componentes reutilizáveis da UI
│   ├── contexts/            # Contextos React (AuthContext, MotoContext, ThemeContext)
│   ├── hooks/               # Hooks personalizados
│   ├── locales/             # Arquivos de tradução (pt.json, es.json, en.json)
│   ├── services/            # Serviços de API (Firebase, API Java, Notificações)
│   ├── types/               # Definições de tipos TypeScript
│   ├── i18n.ts              # Configuração do i18next
│   └── ...                  # Outros arquivos de configuração do Expo/RN
├── backend/                 # Backend Java Spring Boot
│   └── mottu-visiontracker-api/
│       └── src/             # Código fonte da API
├── .eslintrc.js             # Configuração do ESLint (qualidade de código)
├── .prettierrc.js           # Configuração do Prettier (formatação)
└── README.md                # Este arquivo
```

## Integrantes

| Nome | RM | GitHub |
| :--- | :--- | :--- |
| **Gusthavo Daniel de Souza** | 554681 | [GusthavoDaniel](https://github.com/GusthavoDaniel) |
| **Guilherme Damasio Roselli** | 555873 | [GuilhermeDamasioRoselli](https://github.com/GuilhermeDamasioRoselli) |
| **Lucas Miranda Leite** | 555161 | [LucasMirandaLeite](https://github.com/LucasMirandaLeite) |

## Como Executar o Projeto

### 1. Backend (API Java Spring Boot)

**Pré-requisitos:** Java Development Kit (JDK) 11+, Apache Maven 3.6+.

1.  Navegue até o diretório do backend: `cd Mottu-VisionTracker2/backend/mottu-visiontracker-api`
2.  Compile e execute a aplicação: `mvn clean install spring-boot:run`
    *   A API estará disponível em `http://localhost:8080`.

### 2. Frontend (Aplicativo React Native)

**Pré-requisitos:** Node.js (LTS), npm/Yarn, Expo CLI.

1.  Navegue até o diretório do frontend: `cd Mottu-VisionTracker2`
2.  Instale as dependências: `npm install`
3.  Inicie o servidor de desenvolvimento: `npm start`
4.  Use o aplicativo Expo Go no seu celular ou um emulador/simulador para escanear o QR code.

### Comandos de Qualidade de Código

Para garantir a padronização e o código limpo (Requisito 7):

*   **Verificar Lint:** `npm run lint`
*   **Corrigir Lint:** `npm run lint:fix`
*   **Formatar Código:** `npm run format`
*   **Verificar Tipagem:** `npm run type-check`

## Próximos Passos (Publicação)

O único requisito pendente é a **Publicação do App** (Requisito 2). Para isso, é necessário:

1.  Criar a tela "Sobre o App" com o hash do commit.
2.  Gerar o build do aplicativo para Android/iOS e distribuí-lo via Firebase App Distribution. (Esta etapa requer acesso a contas de desenvolvedor e configurações que não podem ser feitas no ambiente sandbox).

**Recomendação:** O próximo passo seria o usuário gerar o build do app e fazer o upload para o Firebase App Distribution.

