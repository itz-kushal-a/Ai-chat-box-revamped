# AI-Chat-Box Monorepo

A production-ready, scalable monorepo for a full-stack AI-Chat-Box application. This project supports Web, Mobile, Desktop, and Backend platforms with shared logic.

## 🚀 Project Structure

- **`apps/backend`**: Node.js + Express + TypeScript API.
- **`apps/frontend`**: React + Vite + TypeScript Web App.
- **`apps/mobile`**: React Native (Expo) Mobile App.
- **`apps/desktop`**: Electron Desktop Application.
- **`packages/shared`**: Common TypeScript types, constants, and utility functions used across all platforms.

## 🛠️ Tooling & Tech Stack

- **Monorepo Management**: npm Workspaces
- **Languages**: TypeScript, JavaScript
- **Styling**: Vanilla CSS (Global & Modules)
- **Linting & Formatting**: ESLint + Prettier
- **Build Tools**: Vite, TSC, Electron-Builder, Expo CLI

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v7 or higher)

### Installation

Install all dependencies for all workspaces from the root:

```bash
npm install
```

### Development

Start all applications simultaneously:

```bash
npm run dev
```

The project is configured to handle Windows-specific Node.js path issues automatically via `apps/mobile/metro.config.js`.

To run a specific application:

```bash
# Backend
npm run dev -w @ai-chat-box/backend

# Frontend
npm run dev -w @ai-chat-box/frontend

# Mobile
npm run start -w @ai-chat-box/mobile

# Desktop
npm run dev -w @ai-chat-box/desktop
```

### Building

Build all packages and applications:

```bash
npm run build
```

## 📜 Coding Standards

- **ESLint**: Enforces code quality and TypeScript best practices.
- **Prettier**: Enforces consistent code formatting.
- **Shared Logic**: Always put common types and business logic in `packages/shared` to avoid duplication.

## 📄 License

MIT
