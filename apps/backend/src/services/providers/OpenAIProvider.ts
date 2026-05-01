import OpenAI from 'openai';
import { AIProvider, AIMessage } from './types';
import { AppError } from '../../utils/appError';
import { ToolDefinition, ToolCall } from '@ai-chat-box/shared';

export class OpenAIProvider implements AIProvider {
  name = 'OpenAI';
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async getCompletion(messages: AIMessage[]): Promise<string> {
    try {
      const completion = await this.client.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: messages as any,
      });

      return completion.choices[0]?.message?.content || 'No response from OpenAI.';
    } catch (error: any) {
      throw new AppError(`OpenAI Error: ${error.message}`, 502);
    }
  }

  async *getStreamingCompletion(messages: AIMessage[]): AsyncIterable<string> {
    try {
      const stream = await this.client.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: messages as any,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) yield content;
      }
    } catch (error: any) {
      throw new AppError(`OpenAI Stream Error: ${error.message}`, 502);
    }
  }

  async getCompletionWithTools(messages: AIMessage[], tools: ToolDefinition[]): Promise<{ content: string; toolCalls?: ToolCall[] }> {
    try {
      const completion = await this.client.chat.completions.create({
        model: 'gpt-4-turbo-preview', // Force gpt-4 for better tool use
        messages: messages as any,
        tools: tools.map(t => ({
          type: 'function',
          function: {
            name: t.name,
            description: t.description,
            parameters: t.parameters,
          }
        }))
      });

      const message = completion.choices[0].message;
      const toolCalls = message.tool_calls?.map(tc => {
        const functionCall = (tc as any).function;
        return {
          id: tc.id,
          name: functionCall.name,
          arguments: JSON.parse(functionCall.arguments)
        };
      });

      return {
        content: message.content || '',
        toolCalls
      };
    } catch (error: any) {
      throw new AppError(`OpenAI Tools Error: ${error.message}`, 502);
    }
  }
}
