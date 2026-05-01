import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIProvider, AIMessage } from './types';
import { AppError } from '../../utils/appError';
import { ToolDefinition, ToolCall } from '@ai-chat-box/shared';

export class GeminiProvider implements AIProvider {
  name = 'Gemini';
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  private prepareHistory(messages: AIMessage[]) {
    const history = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));
    const lastMessage = history.pop();
    if (!lastMessage) throw new Error('No user message found');
    return { history, lastMessageText: lastMessage.parts[0].text };
  }

  async getCompletion(messages: AIMessage[]): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-pro' });
      const { history, lastMessageText } = this.prepareHistory(messages);
      
      const chat = model.startChat({ history });
      const result = await chat.sendMessage(lastMessageText);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      throw new AppError(`Gemini Error: ${error.message}`, 502);
    }
  }

  async *getStreamingCompletion(messages: AIMessage[]): AsyncIterable<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-pro' });
      const { history, lastMessageText } = this.prepareHistory(messages);

      const chat = model.startChat({ history });
      const result = await chat.sendMessageStream(lastMessageText);

      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) yield text;
      }
    } catch (error: any) {
      throw new AppError(`Gemini Stream Error: ${error.message}`, 502);
    }
  }

  async getCompletionWithTools(messages: AIMessage[], tools: ToolDefinition[]): Promise<{ content: string; toolCalls?: ToolCall[] }> {
    // Basic implementation placeholder - Gemini also supports function calling
    const content = await this.getCompletion(messages);
    return { content };
  }
}
