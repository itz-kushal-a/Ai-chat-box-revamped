import { ToolDefinition, ToolCall, ToolResult } from '@ai-chat-box/shared';

export interface AIMessage {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  toolCallId?: string;
  toolCalls?: ToolCall[];
}

export interface AIProvider {
  name: string;
  getCompletion(messages: AIMessage[]): Promise<string>;
  getStreamingCompletion(messages: AIMessage[]): AsyncIterable<string>;
  getCompletionWithTools(messages: AIMessage[], tools: ToolDefinition[]): Promise<{ content: string; toolCalls?: ToolCall[] }>;
}
