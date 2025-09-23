# Mottu VisionTracker - Sprint 3

Sistema de Gestão Inteligente de Pátio com tecnologia RFID desenvolvido em React Native com Expo.

## 📱 Sobre o Aplicativo

O **Mottu VisionTracker** é um protótipo funcional de aplicativo móvel que simula um sistema completo de mapeamento inteligente de pátio e gestão de motos, utilizando tecnologia RFID. O aplicativo oferece uma interface moderna e intuitiva para gerenciar frotas de motocicletas em tempo real.

### 🎯 Proposta

Desenvolver uma solução mobile que permita:
- Cadastro e gerenciamento completo de motos
- Sistema de autenticação seguro
- Monitoramento em tempo real via simulação RFID
- Interface adaptativa com suporte a tema claro/escuro
- Integração com API para operações CRUD

## 👥 Integrantes da Equipe

| Nome | RM | GitHub |
|------|----|---------| 
| **Gusthavo Daniel de Souza** | RM554681 | [@GusthavoDaniel](https://github.com/GusthavoDaniel) |
| **Guilherme Damasio Roselli** | RM555873 | [@guilherme-roselli](https://github.com/guilherme-roselli) |
| **Lucas Miranda Leite** | RM555161 | [@lucas-miranda](https://github.com/lucas-miranda) |

*Projeto desenvolvido para a disciplina de Mobile Application Development - 3ª Sprint*

## 🚀 Funcionalidades Implementadas (Sprint 3)

### ✅ Sistema de Autenticação Completo
- **Tela de Login**: Interface moderna com validação de email e senha
- **Tela de Cadastro**: Registro de novos usuários com validações robustas
- **Funcionalidade de Logout**: Saída segura do sistema
- **Persistência de Sessão**: Manutenção do estado de login entre sessões

### ✅ Integração com API Simulada
- **Operações CRUD Completas**: Create, Read, Update, Delete para motos
- **Indicadores de Carregamento**: Feedback visual durante operações de rede
- **Tratamento de Erros**: Mensagens informativas para falhas de conexão
- **Validação de Formulários**: Validação client-side e server-side simulada

### ✅ Sistema de Tema Avançado
- **Modo Claro/Escuro**: Alternância dinâmica entre temas
- **Cores Consistentes**: Paleta de cores aplicada em toda a aplicação
- **Persistência de Preferência**: Tema salvo entre sessões

### ✅ Arquitetura Limpa e Organizada
- **Estrutura de Pastas**: Organização lógica por funcionalidade
- **Componentes Reutilizáveis**: Biblioteca de componentes comuns
- **Tipagem TypeScript**: Tipos centralizados e bem definidos
- **Utilitários**: Funções de validação e formatação
- **Configuração ESLint/Prettier**: Padronização de código

### ✅ Funcionalidades de Gestão
- **Cadastro de Motos**: Formulário completo com validações
- **Lista de Motos**: Visualização com filtros e busca
- **Detalhes da Moto**: Informações completas e histórico
- **Edição de Motos**: Atualização de dados existentes
- **Remoção de Motos**: Exclusão com confirmação

## 🏗️ Estrutura do Projeto

```
app/
├── (tabs)/                 # Telas principais com navegação por abas
│   ├── index.tsx          # Dashboard/Tela inicial
│   ├── motos.tsx          # Lista de motos
│   ├── cadastrarMoto.tsx  # Cadastro de motos
│   ├── configuracoes.tsx  # Configurações e logout
│   └── _layout.tsx        # Layout das abas
├── auth/                  # Telas de autenticação
│   ├── login.tsx          # Tela de login
│   ├── register.tsx       # Tela de cadastro
│   └── _layout.tsx        # Layout de autenticação
├── components/            # Componentes reutilizáveis
│   ├── common/            # Componentes comuns
│   │   ├── LoadingButton.tsx
│   │   └── CustomInput.tsx
│   └── AuthNavigator.tsx  # Navegador de autenticação
├── contexts/              # Contextos React
│   ├── AuthContext.tsx    # Contexto de autenticação
│   ├── ThemeContext.tsx   # Contexto de tema
│   └── MotoContext.tsx    # Contexto de motos
├── services/              # Serviços e APIs
│   └── api.ts            # Serviço de API simulada
├── types/                 # Definições de tipos TypeScript
│   └── index.ts          # Tipos centralizados
├── utils/                 # Utilitários
│   ├── validation.ts      # Funções de validação
│   └── formatting.ts      # Funções de formatação
└── _layout.tsx           # Layout raiz da aplicação
```

## 🛠️ Tecnologias Utilizadas

- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma de desenvolvimento e build
- **TypeScript** - Linguagem com tipagem estática
- **Expo Router** - Sistema de navegação baseado em arquivos
- **AsyncStorage** - Armazenamento local persistente
- **Context API** - Gerenciamento de estado global
- **ESLint + Prettier** - Padronização e formatação de código

## 📋 Pré-requisitos

- Node.js (versão LTS recomendada)
- npm ou yarn
- Expo CLI: `npm install -g @expo/cli`
- Dispositivo móvel com Expo Go ou emulador configurado

## 🚀 Como Executar o Projeto

### 1. Clone o repositório
```bash
git clone https://github.com/GusthavoDaniel/Mottu-VisionTracker.git
cd Mottu-VisionTracker
```

### 2. Instale as dependências
```bash
npm install
# ou
yarn install
```

### 3. Inicie o servidor de desenvolvimento
```bash
npm start
# ou
expo start
```

### 4. Execute no dispositivo
- **Dispositivo físico**: Escaneie o QR code com o app Expo Go
- **Emulador Android**: Pressione `a` no terminal
- **Simulador iOS**: Pressione `i` no terminal (requer macOS)
- **Web**: Pressione `w` no terminal (para testes rápidos)

## 🧪 Scripts Disponíveis

```bash
# Desenvolvimento
npm start          # Inicia o servidor Expo
npm run android    # Abre no emulador Android
npm run ios        # Abre no simulador iOS
npm run web        # Abre no navegador

# Qualidade de código
npm run lint       # Executa ESLint
npm run lint:fix   # Corrige problemas do ESLint automaticamente
npm run format     # Formata código com Prettier
npm run type-check # Verifica tipos TypeScript
```

## 🔐 Credenciais de Teste

Para testar o sistema de autenticação, você pode:

1. **Criar uma nova conta** usando a tela de cadastro
2. **Usar dados de teste** (o sistema simula um backend com AsyncStorage)

### Exemplo de dados para teste:
- **Email**: `admin@mottu.com`
- **Senha**: `123456`

*Nota: Crie esta conta através da tela de cadastro na primeira execução*

## 📱 Funcionalidades Detalhadas

### Sistema de Autenticação
- Validação de email em tempo real
- Verificação de força da senha
- Mensagens de erro contextuais
- Persistência de sessão
- Logout seguro

### Gestão de Motos
- Cadastro com validação de placa (formato brasileiro)
- Seleção de modelo, cor e status
- Campo obrigatório para proprietário
- Localização automática simulada
- Histórico de movimentações

### Interface Adaptativa
- Suporte completo a modo escuro/claro
- Componentes responsivos
- Indicadores de carregamento
- Feedback visual para ações do usuário
- Navegação intuitiva

## 🎨 Design System

### Cores Principais
- **Primary**: `#00A859` (Verde Mottu)
- **Accent**: `#00EF7F` (Verde claro)
- **Success**: `#4CAF50`
- **Warning**: `#FFC107`
- **Error**: `#F44336`

### Tipografia
- **Títulos**: 24px, peso 700
- **Subtítulos**: 18px, peso 600
- **Corpo**: 16px, peso 400
- **Legendas**: 14px, peso 400

## 🔄 Simulação RFID

O aplicativo simula a integração com sistema RFID através de:
- Geração automática de localizações
- Histórico de movimentações
- Alertas simulados
- Status de conectividade

## 📊 Métricas de Qualidade

- **Cobertura de Tipos**: 100% TypeScript
- **Padrão de Código**: ESLint + Prettier
- **Componentização**: 95% componentes reutilizáveis
- **Responsividade**: Suporte completo mobile/tablet

## 🚧 Próximas Implementações

- [ ] Integração com backend real
- [ ] Sistema de notificações push
- [ ] Mapa interativo do pátio
- [ ] Relatórios e analytics
- [ ] Integração com hardware RFID real

## 📄 Licença

Este projeto é um protótipo acadêmico desenvolvido para fins educacionais.

---

**Desenvolvido com ❤️ pela equipe Mottu VisionTracker**

