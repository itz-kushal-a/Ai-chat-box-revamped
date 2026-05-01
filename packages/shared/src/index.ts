export const APP_NAME = 'AI-Chat-Box';

export type Role = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
}

export interface ChatRequest {
  messages: Message[];
}

export interface ChatResponse {
  message: Message;
}

export interface ApiError {
  error: string;
}
