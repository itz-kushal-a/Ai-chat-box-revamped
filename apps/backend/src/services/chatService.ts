import { prisma } from './dbService';
import { Message as SharedMessage } from '@ai-chat-box/shared';

export class ChatService {
  async getChats(userId: string) {
    return prisma.chat.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: {
          select: { messages: true }
        }
      }
    });
  }

  async getChatWithMessages(chatId: string) {
    return prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });
  }

  async createChat(userId: string, title: string, projectId?: string) {
    return prisma.chat.create({
      data: {
        userId,
        title,
        projectId
      }
    });
  }

  async saveMessage(chatId: string, role: string, content: string) {
    const message = await prisma.message.create({
      data: {
        chatId,
        role,
        content,
      }
    });

    // Update the chat's updatedAt timestamp
    await prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() }
    });

    return message;
  }
}

export const chatService = new ChatService();
