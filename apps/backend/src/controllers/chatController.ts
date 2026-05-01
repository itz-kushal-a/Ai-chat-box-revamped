import { Request, Response, NextFunction } from 'express';
import { aiService } from '../services/aiService';
import { chatService } from '../services/chatService';
import { AppError } from '../utils/appError';

// Mock User ID until auth is implemented
const MOCK_USER_ID = 'mock-user-123';

export class ChatController {
  async getChatHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const chats = await chatService.getChats(MOCK_USER_ID);
      res.status(200).json({ status: 'success', data: { chats } });
    } catch (error) {
      next(error);
    }
  }

  async getChatMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const chat = await chatService.getChatWithMessages(id);
      if (!chat) return next(new AppError('Chat not found', 404));
      res.status(200).json({ status: 'success', data: { chat } });
    } catch (error) {
      next(error);
    }
  }

  async chat(req: Request, res: Response, next: NextFunction) {
    try {
      const { messages, activeFile, chatId: existingChatId, provider: providerType } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return next(new AppError('Messages are required and must be an array', 400));
      }

      let chatId = existingChatId;
      if (!chatId) {
        const newChat = await chatService.createChat(MOCK_USER_ID, messages[0].content.substring(0, 50));
        chatId = newChat.id;
      }

      // Save user message
      const lastUserMessage = messages[messages.length - 1];
      await chatService.saveMessage(chatId, 'user', lastUserMessage.content);

      const responseMessage = await aiService.chat(messages, activeFile, providerType);
      
      // Save AI message
      await chatService.saveMessage(chatId, 'assistant', responseMessage.content);

      res.status(200).json({ status: 'success', data: { message: responseMessage, chatId } });
    } catch (error) {
      next(error);
    }
  }

  async streamChat(req: Request, res: Response, next: NextFunction) {
    try {
      const { messages, activeFile, chatId: existingChatId, provider: providerType } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return next(new AppError('Messages are required and must be an array', 400));
      }

      let chatId = existingChatId;
      if (!chatId) {
        const newChat = await chatService.createChat(MOCK_USER_ID, messages[0].content.substring(0, 50));
        chatId = newChat.id;
      }

      // Save user message
      const lastUserMessage = messages[messages.length - 1];
      await chatService.saveMessage(chatId, 'user', lastUserMessage.content);

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      let fullAIContent = '';
      for await (const chunk of aiService.streamChat(messages, activeFile, providerType)) {
        fullAIContent += chunk;
        res.write(`data: ${JSON.stringify({ chunk, chatId })}\n\n`);
      }

      // Save completed AI message
      await chatService.saveMessage(chatId, 'assistant', fullAIContent);

      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error) {
      next(error);
    }
  }

  async explainCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, provider: providerType } = req.body;
      if (!code) return next(new AppError('Code snippet is required', 400));

      const responseMessage = await aiService.explainCode(code, providerType);
      res.status(200).json({ status: 'success', data: { message: responseMessage } });
    } catch (error) {
      next(error);
    }
  }

  async fixCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, provider: providerType } = req.body;
      if (!code) return next(new AppError('Code snippet is required', 400));

      const responseMessage = await aiService.fixCode(code, providerType);
      res.status(200).json({ status: 'success', data: { message: responseMessage } });
    } catch (error) {
      next(error);
    }
  }

  async generateCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { prompt, provider: providerType } = req.body;
      if (!prompt) return next(new AppError('Prompt is required', 400));

      const responseMessage = await aiService.generateCode(prompt, providerType);
      res.status(200).json({ status: 'success', data: { message: responseMessage } });
    } catch (error) {
      next(error);
    }
  }
}

export const chatController = new ChatController();
