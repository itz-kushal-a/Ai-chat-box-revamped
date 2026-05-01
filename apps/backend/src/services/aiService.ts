import { Message, AIProviderType } from '@ai-chat-box/shared';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { AppError } from '../utils/appError';
import { AIProvider, AIMessage } from './providers/types';
import { OpenAIProvider } from './providers/OpenAIProvider';
import { GeminiProvider } from './providers/GeminiProvider';
import { AnthropicProvider } from './providers/AnthropicProvider';
import { toolService, CODING_TOOLS } from './toolService';

dotenv.config();

export class AIService {
  private providers: Map<AIProviderType, AIProvider> = new Map();

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    if (process.env.OPENAI_API_KEY) {
      this.providers.set('openai', new OpenAIProvider(process.env.OPENAI_API_KEY));
    }
    if (process.env.GEMINI_API_KEY) {
      this.providers.set('gemini', new GeminiProvider(process.env.GEMINI_API_KEY));
    }
    if (process.env.ANTHROPIC_API_KEY) {
      this.providers.set('anthropic', new AnthropicProvider(process.env.ANTHROPIC_API_KEY));
    }
  }

  private getProvider(type?: AIProviderType): AIProvider {
    const selectedType = type || (process.env.AI_PROVIDER as AIProviderType) || 'openai';
    const provider = this.providers.get(selectedType.toLowerCase() as AIProviderType);
    if (!provider) throw new AppError(`AI Provider "${selectedType}" not configured.`, 400);
    return provider;
  }

  private generateResponse(content: string, role: any = 'assistant'): Message {
    return { id: uuidv4(), role, content, timestamp: Date.now() };
  }

  async chat(history: Message[], activeFile?: { path: string; content: string }, providerType?: AIProviderType): Promise<Message> {
    const provider = this.getProvider(providerType);
    
    // Convert history to AI Messages
    const messages: AIMessage[] = [
      { 
        role: 'system', 
        content: `You are a helpful coding assistant. You have access to tools to explore the codebase.\n\nActive File: ${activeFile?.path || 'None'}\nContent: ${activeFile?.content || 'None'}` 
      },
      ...history.map(m => ({ role: m.role as any, content: m.content }))
    ];

    // Attempt completion with tools
    let aiResponse = await provider.getCompletionWithTools(messages, CODING_TOOLS);

    // Loop to handle tool calls (up to 3 for safety)
    let iterations = 0;
    while (aiResponse.toolCalls && iterations < 3) {
      iterations++;
      
      // Add assistant message with tool calls to memory
      messages.push({
        role: 'assistant',
        content: aiResponse.content,
        toolCalls: aiResponse.toolCalls
      });

      // Execute each tool call
      for (const tc of aiResponse.toolCalls) {
        const result = await toolService.executeTool(tc.name, tc.arguments);
        messages.push({
          role: 'tool',
          content: result,
          toolCallId: tc.id
        });
      }

      // Get next turn from AI
      aiResponse = await provider.getCompletionWithTools(messages, CODING_TOOLS);
    }

    return this.generateResponse(aiResponse.content);
  }

  async *streamChat(history: Message[], activeFile?: { path: string; content: string }, providerType?: AIProviderType): AsyncIterable<string> {
    const provider = this.getProvider(providerType);
    const contextMessage = activeFile 
      ? `The user is currently viewing the file: "${activeFile.path}".\n\nFile Content:\n\`\`\`\n${activeFile.content}\n\`\`\``
      : 'No file is currently active in the workspace.';

    yield* provider.getStreamingCompletion([
      { 
        role: 'system', 
        content: `You are a helpful coding assistant. ${contextMessage}\nUse this context to help the user with their questions about the code.` 
      },
      ...history.map(m => ({ role: m.role as any, content: m.content }))
    ]);
  }

  async explainCode(code: string, providerType?: AIProviderType): Promise<Message> {
    const provider = this.getProvider(providerType);
    const response = await provider.getCompletion([{ role: 'system', content: 'Explain code.' }, { role: 'user', content: code }]);
    return this.generateResponse(response);
  }

  async fixCode(code: string, providerType?: AIProviderType): Promise<Message> {
    const provider = this.getProvider(providerType);
    const response = await provider.getCompletion([{ role: 'system', content: 'Fix code.' }, { role: 'user', content: code }]);
    return this.generateResponse(response);
  }

  async generateCode(prompt: string, providerType?: AIProviderType): Promise<Message> {
    const provider = this.getProvider(providerType);
    const response = await provider.getCompletion([{ role: 'system', content: 'Generate code.' }, { role: 'user', content: prompt }]);
    return this.generateResponse(response);
  }
}

export const aiService = new AIService();
