# AI-Chat-Box Monorepo

A production-ready, scalable monorepo for a full-stack AI-Chat-Box application. This project supports Web, Mobile, Desktop, and Backend platforms with shared logic and advanced AI capabilities.

## 🚀 Project Structure

- **`docs/`**: Project documentation (PRD, Architecture, Database, UI/UX, etc.).
- **`apps/backend`**: Professional Node.js + Express + TypeScript API.
  - **Multi-AI Support**: Integrated support for OpenAI (GPT-4), Google Gemini, and Anthropic Claude via an adapter pattern.
  - **Tool Use (Function Calling)**: AI can autonomously explore the codebase using tools like `list_files`, `read_file`, and `grep_search`.
  - **Persistence**: Database integration using Prisma and SQLite for persistent chat history and user profiles.
  - **Authentication**: JWT-based security with bcrypt password hashing.
  - **Streaming**: Real-time response streaming via Server-Sent Events (SSE).
- **`apps/frontend`**: React + Vite + TypeScript Web App.
  - **Monaco Editor**: Professional-grade code editing experience (VS Code engine).
  - **Three-Pane Layout**: Integrated File Explorer, Code Editor, and AI Assistant.
  - **AI Chat**: Markdown rendering with syntax highlighting and "Apply Changes" integration.
- **`apps/mobile`**: React Native (Expo) app for on-the-go assistance.
- **`apps/desktop`**: Professional Electron wrapper with secure IPC bridging.
- **`packages/shared`**: Common TypeScript types, constants, and tool definitions.

## 🛠️ Tooling & Tech Stack

- **Monorepo**: npm Workspaces
- **Backend**: Express, Prisma, SQLite, OpenAI/Gemini/Anthropic SDKs
- **Frontend**: React, Vite, Monaco Editor, React Markdown
- **Mobile/Desktop**: Expo, Electron
- **Linting & Formatting**: ESLint + Prettier

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v7 or higher)

### Installation

Install all dependencies from the root:

```bash
npm install
```

### Configuration

Create a `.env` file in `apps/backend/` based on `.env.example` and add your AI provider API keys.

### Development

Start all applications simultaneously:

```bash
npm run dev
```

### Building

Build all packages and applications:

```bash
npm run build
```

## 📜 Coding Standards

- **ESLint**: Enforces code quality and TypeScript best practices.
- **Prettier**: Enforces consistent code formatting.
- **Shared Logic**: Always put common types and business logic in `packages/shared`.

## 📄 License

MIT
