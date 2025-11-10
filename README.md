# 🏍️ Mottu VisionTracker

## 🎯 Proposta e Objetivo

O **Mottu VisionTracker** é um aplicativo móvel desenvolvido em **React Native (Expo)** com uma **API Java Spring Boot**, criado como solução de **Gestão Inteligente de Pátio** para motocicletas da Mottu.

Ele oferece controle completo de motos, notificações com som, troca de idioma, modo escuro e integração entre **frontend (Expo)**, **backend (Spring Boot)** e **serviços em nuvem (Firebase e Azure)**.

## 👥 Integrantes

| Nome | RM | GitHub |
| :--- | :--- | :--- |
| **Gusthavo Daniel de Souza** | 554681 | [@GusthavoDaniel](https://github.com/GusthavoDaniel) |
| **Guilherme Damasio Roselli** | 555873 | [@GuilhermeDamasioRoselli](https://github.com/GuilhermeDamasioRoselli) |
| **Lucas Miranda Leite** | 555161 | [@LucasMirandaLeite](https://github.com/LucasMirandaLeite) |
---

## ✅ Funcionalidades Implementadas (Requisitos FIAP)

| Nº | Requisito | Descrição | Status |
|:--:|:-----------|:-----------|:------:|
| **1** | Telas Funcionais | Todas as telas implementadas (CRUD, configurações, alertas, mapa, etc). | ✅ COMPLETO |
| **2** | Publicação do App | Aplicativo hospedado no **Firebase Hosting**, pronto para o **App Distribution**. | ⚙️ PARCIAL |
| **3** | Notificações Push | Envio e recebimento de notificações locais com **som ativo (Expo Notifications)**. | ✅ COMPLETO |
| **4** | Integração com API | CRUD completo integrado com a API Java (Spring Boot). | ✅ COMPLETO |
| **5** | Localização e Internacionalização | Suporte multilíngue (pt, es, en) via **i18next**, com troca dinâmica. | ✅ COMPLETO |
| **6** | Estilização com Tema | Modo claro/escuro persistente, alternável pelo usuário. | ✅ COMPLETO |
| **7** | Arquitetura e Organização | Código padronizado com **ESLint**, **Prettier** e **TypeScript**. | ✅ COMPLETO |
| **8** | Documentação e Apresentação | README completo + vídeo explicativo. | ✅ COMPLETO |

---

## 📱 Telas Principais

- **Dashboard:** visão geral do pátio e KPIs operacionais.  
- **Motos:** cadastro, listagem, edição e exclusão (CRUD completo).  
- **Alertas:** histórico de notificações recebidas.  
- **Mapa do Pátio:** exibição visual da disposição das motos.  
- **Configurações:** seleção de idioma, alternância de tema e testes de notificação.  
- **Testes:** tela dedicada para testar notificações e funcionalidades locais.  

---

## 🧩 Arquitetura Geral

### **Frontend (React Native + Expo + Firebase)**
- Aplicativo mobile com suporte a temas e idiomas.
- Sistema de notificações push com som (via **expo-notifications**).
- Deploy no **Firebase Hosting**.

### **Backend (Java + Spring Boot + Azure)**
- API RESTful hospedada no **Azure App Service**.
- Persistência no **Azure PostgreSQL Flexible Server**.
- CRUD completo de motos, integrado ao app via REST API.

---

## 🗂️ Estrutura de Pastas

Mottu-VisionTracker2/
├── app/ # Frontend React Native (Expo)
│ ├── (auth)/ # Telas de login e cadastro
│ ├── (tabs)/ # Telas principais
│ ├── assets/ # Ícones e imagens
│ ├── components/ # Componentes de interface reutilizáveis
│ ├── contexts/ # Contextos React (Auth, Moto, Theme)
│ ├── hooks/ # Hooks personalizados
│ ├── locales/ # Traduções (pt, es, en)
│ ├── services/ # Serviços (API, notificações, autenticação)
│ ├── types/ # Tipagens TypeScript
│ ├── i18n.ts # Configuração do i18next
│ └── App.tsx # Ponto de entrada do app
├── backend/ # Backend Java Spring Boot
│ └── mottu-visiontracker-api/
│ └── src/ # Código-fonte da API
├── .eslintrc.js
├── .prettierrc.js
├── package.json
└── README.md

less
Copiar código

---


## ⚙️ Como Executar o Projeto

### 🖥️ 1. Backend (API Java Spring Boot)

**Pré-requisitos:**  
Java Development Kit (JDK) **11+**, Apache Maven **3.6+**, e PostgreSQL configurado.

**Passos:**
```bash
# Acesse o diretório do backend
cd Mottu-VisionTracker2/backend/mottu-visiontracker-api

# Compile e execute o projeto
mvn clean install spring-boot:run
A API estará disponível em:
👉 http://localhost:8080

No ambiente de produção, a API também está hospedada em:
🌐 https://mottuvision-api.azurewebsites.net

📱 2. Frontend (React Native + Expo)
Pré-requisitos:
Node.js LTS, npm/yarn, e Expo CLI instalado globalmente.

Passos:

bash
Copiar código
# Acesse o diretório principal do app
cd Mottu-VisionTracker2

# Instale as dependências
npm install

# Inicie o servidor Expo
npm start
Abra o Expo Go no seu celular e escaneie o QR Code para visualizar o app.

🔔 Notificações Push (com Som)
O app usa o pacote expo-notifications para envio e exibição de notificações locais com som.

Exemplos:
Ao cadastrar uma moto, é exibida uma notificação sonora com o nome e placa.

Ao alterar o idioma, o usuário recebe um alerta confirmando a mudança.

Essas notificações usam o canal padrão Android:

ts
Copiar código
Notifications.setNotificationChannelAsync('default', {
  name: 'default',
  importance: Notifications.AndroidImportance.MAX,
  sound: 'default',
});
🌍 Internacionalização (i18n)
O aplicativo possui suporte a:

🇧🇷 Português

🇪🇸 Espanhol

🇺🇸 Inglês

O idioma é salvo localmente em @language (via AsyncStorage) e carregado automaticamente ao abrir o app.

🌓 Tema Dinâmico
Alternância manual entre modo claro e modo escuro.

Persistência do tema ativo (via ThemeContext e AsyncStorage).

🧠 Qualidade de Código
Scripts configurados para manter o projeto limpo e padronizado:

bash
Copiar código
npm run lint        # Verifica padrões de código
npm run lint:fix    # Corrige erros automaticamente
npm run format      # Formata o código com Prettier
npm run type-check  # Verifica tipagem TypeScript
☁️ Publicação e Deploy
🔹 Frontend
Hospedado no Firebase Hosting
Para atualizar a versão hospedada:

bash
Copiar código
expo export:web
firebase deploy
🔹 Backend
Hospedado no Azure App Service com CI/CD via Azure DevOps Pipeline.

🏁 Status Atual do Projeto
Módulo	Situação
Frontend (Expo + Firebase)	✅ Concluído e hospedado
Backend (Spring Boot + Azure)	✅ Concluído e hospedado
Notificações com Som (Expo)	✅ Ativas e funcionais
Tema e Idiomas (i18n)	✅ Operando corretamente
Publicação App Distribution (APK) ✅

Desenvolvido com 💙 por alunos da FIAP — ADS 2TDS (2025).
