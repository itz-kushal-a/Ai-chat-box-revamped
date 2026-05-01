export const APP_NAME = 'AI-Chat-Box';

export type Role = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
}

export type AIProviderType = 'openai' | 'gemini' | 'anthropic';

export interface ChatRequest {
  messages: Message[];
  chatId?: string;
  provider?: AIProviderType;
  model?: string;
  activeFile?: {
    path: string;
    content: string;
    language?: string;
  };
}

export interface ChatResponse {
  message: Message;
}

export interface ApiError {
  error: string;
}

export interface FileNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  content?: string;
  language?: string;
  children?: FileNode[];
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  rootPath: string;
  createdAt: number;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: number;
}

export interface AuthRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: any;
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: any;
}

export interface ToolResult {
  toolCallId: string;
  content: string;
}
