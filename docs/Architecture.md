# System Architecture: AI-Chat-Box

## 1. High-Level Architecture Diagram (Text-Based)

```text
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Web App    │  │  Desktop     │  │   Mobile     │           │
│  │ (React/Vite) │  │ (Electron)   │  │ (React Native)│           │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘           │
└─────────┼─────────────────┼─────────────────┼───────────────────┘
          │                 │                 │
          ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                          API GATEWAY / LOAD BALANCER            │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND SERVICE                         │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │               Node.js + Express + TypeScript            │   │
│   ├───────────────┬───────────────┬───────────────┬─────────┤   │
│   │ Auth Service  │ Chat Manager  │ File Sync     │ Plugin  │   │
│   └──────┬────────┴───────┬───────┴───────┬───────┴────┬────┘   │
└──────────┼────────────────┼───────────────┼────────────┼────────┘
           │                │               │            │
           ▼                ▼               ▼            ▼
┌───────────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────┐
│     DATABASE      │ │ AI ADAPTER  │ │ FILE SYSTEM │ │ EXTERNAL  │
│ (PostgreSQL/Redis)│ │ (OpenAI/Gem)│ │ (S3/Local)  │ │ TOOLS/APIs│
└───────────────────┘ └─────────────┘ └─────────────┘ └───────────┘
```

## 2. Layer Definitions

### 2.1. Client Layer (Frontend)
- **Responsibility:** User interface, local state management, and real-time UI updates.
- **Tech Stack:** React (TypeScript), Vite, Tailwind CSS (or Vanilla CSS), Expo (Mobile), Electron (Desktop).
- **Key Pattern:** The frontend maintains a local cache of the chat history and the current "Project Context" (files being edited).

### 2.2. Backend Service (Node.js/Express)
- **Responsibility:** Authentication, request validation, business logic, and orchestration between the AI and Database.
- **Key Pattern:** Modular Monolith / Controller-Service-Repository pattern.
- **Features:** 
  - **Chat Manager:** Handles the prompt engineering (injecting context) and streams AI responses.
  - **File Sync:** Manages file read/write permissions and synchronizes changes between client and server.

### 2.3. AI Adapter Layer
- **Responsibility:** Abstracts the complexity of different AI providers (OpenAI, Google Gemini, Anthropic).
- **Logic:** Converts internal message formats to provider-specific payloads and handles token limiting/truncation.

### 2.4. Persistence Layer (Database)
- **Relational (PostgreSQL):** Stores users, projects, persistent chat history, and metadata.
- **Caching (Redis):** Stores active session data and temporary prompt contexts to reduce database load.

## 3. Data Flow

1.  **Request:** User types a question in the **Frontend**. The frontend gathers the question + the current active file content.
2.  **API Call:** An HTTP POST request is sent to the **Backend** `/api/chat` endpoint.
3.  **Context Enrichment:** The **Backend** retrieves historical messages from the **Database** and combines them with the new question and file context.
4.  **AI Invocation:** The **Backend** calls the **AI Provider** via the **AI Adapter**.
5.  **Streaming Response:** The AI begins generating text. The Backend proxies this stream back to the **Frontend** via Server-Sent Events (SSE) or WebSockets.
6.  **Persistence:** Once the response is complete, the entire exchange is saved to the **Database**.
7.  **Update:** The **Frontend** updates the local chat history and re-renders the UI.

## 4. API Structure (RESTful)

### 4.1. Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### 4.2. Chat
- `GET /api/chats` - List all chat sessions.
- `POST /api/chat` - Send a message and get a response (Streaming).
- `GET /api/chat/:id` - Retrieve a specific chat session.

### 4.3. Files
- `GET /api/files` - List project files.
- `GET /api/files/:path` - Read file content.
- `PUT /api/files/:path` - Update file content.

## 5. Architectural Suggestions
- **Streaming:** Use Server-Sent Events (SSE) for AI responses to provide a "typing" effect, which significantly improves perceived UX.
- **Context Management:** Implement a sliding window for conversation history to stay within token limits of LLMs.
- **Security:** Use JWT for session management and implement rate limiting to prevent API abuse/cost overruns.
- **Shared Package:** Utilize the `@ai-chat-box/shared` package to share DTOs (Data Transfer Objects) and validation logic between the Frontend and Backend.
