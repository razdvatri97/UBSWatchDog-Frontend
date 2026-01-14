# 🚀 UBS Watchdog Frontend

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF.svg)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC.svg)](https://tailwindcss.com/)
[![Radix UI](https://img.shields.io/badge/Radix_UI-Components-000000.svg)](https://www.radix-ui.com/)

Este é o frontend da solução **UBS Watchdog**, uma aplicação web para monitoramento e compliance desenvolvida com tecnologias modernas para uma experiência de usuário excepcional.

## ✨ Funcionalidades

- 📊 **Dashboard Interativo**: Visualização de dados em tempo real com gráficos e tabelas
- 👥 **Gestão de Clientes**: Interface completa para administração de clientes
- 💳 **Monitoramento de Transações**: Acompanhamento detalhado de transações financeiras
- 🚨 **Sistema de Alertas**: Notificações e status de alertas de compliance
- 📈 **Relatórios**: Geração e visualização de relatórios personalizados
- 🎨 **UI Moderna**: Design responsivo com componentes acessíveis

## 🛠️ Tecnologias Utilizadas

### Core
- **React** 18.3.1 - Biblioteca para construção de interfaces
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** 6.3.5 - Build tool rápido e moderno

### UI/UX
- **Tailwind CSS** - Framework CSS utilitário
- **Radix UI** - Componentes primitivos acessíveis
- **Lucide React** 0.487.0 - Ícones modernos
- **Recharts** 2.15.4 - Biblioteca de gráficos

### Estado e Roteamento
- **Zustand** - Gerenciamento de estado leve
- **React Router DOM** - Roteamento para aplicações React
- **React Hook Form** 7.55.0 - Gerenciamento de formulários

### Desenvolvimento
- **SWC** - Compilador rápido para React
- **Vite React Plugin** 3.10.2 - Suporte React no Vite

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** v22.21.1 ou superior
- **npm** v10.9.4 ou superior (ou **pnpm** v10.27.0 ou superior)
- **Git** para controle de versão

> 💡 **Dica**: Você pode verificar as versões instaladas executando:
> ```bash
> node --version
> npm --version
> ```

## 🚀 Instalação e Execução

Siga estes passos para executar o projeto localmente:

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/UBSWatchDog-Frontend.git
cd UBSWatchDog-Frontend
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Execute o servidor de desenvolvimento
```bash
npm run dev
```

A aplicação abrirá automaticamente em [http://localhost:5173](http://localhost:5173)

> 🎉 **Pronto!** A aplicação estará rodando em modo de desenvolvimento com hot-reload ativado.

## 🏗️ Build para Produção

Para gerar uma versão otimizada para produção:

```bash
npm run build
```

Os arquivos de build serão gerados na pasta `build/` e `dist/`.

## 📁 Estrutura do Projeto

```
UBSWatchDog-Frontend/
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   ├── ui/            # Componentes base (Radix UI + Tailwind)
│   │   ├── layout/        # Layout e navegação
│   │   ├── modals/        # Modais da aplicação
│   │   └── ImageFallback/ # Componente de fallback de imagem
│   ├── pages/             # Páginas da aplicação
│   ├── store/             # Gerenciamento de estado (Zustand)
│   ├── styles/            # Estilos globais
│   ├── types/             # Definições de tipos TypeScript
│   ├── App.tsx            # Componente principal
│   └── main.tsx           # Ponto de entrada
├── build/                 # Build otimizado
├── package.json           # Dependências e scripts
├── vite.config.ts         # Configuração do Vite
└── README.md              # Este arquivo
```

## 📦 Dependências Principais

### Versões Atuais
- React: 18.3.1
- Vite: 6.3.5
- TypeScript: ^19.2.7
- React Router DOM: ^
- Zustand: ^
- Recharts: 2.15.4
- Sonner: 2.0.3
- Lucide React: 0.487.0

Para uma lista completa de todas as dependências, consulte o arquivo [package.json](package.json).

  
