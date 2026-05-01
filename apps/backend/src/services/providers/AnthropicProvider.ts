import Anthropic from '@anthropic-ai/sdk';
import { AIProvider, AIMessage } from './types';
import { AppError } from '../../utils/appError';
import { ToolDefinition, ToolCall } from '@ai-chat-box/shared';

export class AnthropicProvider implements AIProvider {
  name = 'Anthropic';
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  async getCompletion(messages: AIMessage[]): Promise<string> {
    try {
      const systemMessage = messages.find(m => m.role === 'system')?.content;
      const userMessages = messages.filter(m => m.role !== 'system');

      const response = await this.client.messages.create({
        model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20240620',
        max_tokens: 1024,
        system: systemMessage,
        messages: userMessages.map(m => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content
        })),
      });

      const firstBlock = response.content[0];
      if (firstBlock && 'text' in firstBlock) {
        return firstBlock.text;
      }
      
      return 'No text response from Anthropic.';
    } catch (error: any) {
      throw new AppError(`Anthropic Error: ${error.message}`, 502);
    }
  }

  async *getStreamingCompletion(messages: AIMessage[]): AsyncIterable<string> {
    try {
      const systemMessage = messages.find(m => m.role === 'system')?.content;
      const userMessages = messages.filter(m => m.role !== 'system');

      const stream = await this.client.messages.create({
        model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20240620',
        max_tokens: 1024,
        system: systemMessage,
        messages: userMessages.map(m => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content
        })),
        stream: true,
      });

      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          yield chunk.delta.text;
        }
      }
    } catch (error: any) {
      throw new AppError(`Anthropic Stream Error: ${error.message}`, 502);
    }
  }

  async getCompletionWithTools(messages: AIMessage[], tools: ToolDefinition[]): Promise<{ content: string; toolCalls?: ToolCall[] }> {
    const content = await this.getCompletion(messages);
    return { content };
  }
}
