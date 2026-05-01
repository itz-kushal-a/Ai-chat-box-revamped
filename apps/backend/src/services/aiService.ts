import { Message, Role } from '@ai-chat-box/shared';
import { v4 as uuidv4 } from 'uuid';

export class AIService {
  private static generateMessage(content: string, role: Role = 'assistant'): Message {
    return {
      id: uuidv4(),
      role,
      content,
      timestamp: Date.now(),
    };
  }

  async chat(messages: Message[]): Promise<Message> {
    const lastUserMessage = messages[messages.length - 1];
    return AIService.generateMessage(`Echoing: ${lastUserMessage.content}. How else can I help?`);
  }

  async explainCode(code: string): Promise<Message> {
    return AIService.generateMessage(`This code does the following:\n1. Logic initialization\n2. Execution flow\n3. Result return.\n\nCode snippet: \`\`\`${code}\`\`\``);
  }

  async fixCode(code: string): Promise<Message> {
    return AIService.generateMessage(`I found an issue. Here is the fixed version:\n\n\`\`\`\n// Fixed Version\n${code}\n\`\`\``);
  }

  async generateCode(prompt: string): Promise<Message> {
    return AIService.generateMessage(`Here is the code based on your prompt "${prompt}":\n\n\`\`\`typescript\nfunction generated() {\n  console.log("Hello World");\n}\n\`\`\``);
  }
}

export const aiService = new AIService();
