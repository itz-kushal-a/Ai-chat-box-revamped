import { Request, Response, NextFunction } from 'express';
import { aiService } from '../services/aiService';
import { AppError } from '../utils/appError';

export class ChatController {
  async chat(req: Request, res: Response, next: NextFunction) {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return next(new AppError('Messages are required and must be an array', 400));
      }

      const responseMessage = await aiService.chat(messages);
      res.status(200).json({ status: 'success', data: { message: responseMessage } });
    } catch (error) {
      next(error);
    }
  }

  async explainCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { code } = req.body;
      if (!code) return next(new AppError('Code snippet is required', 400));

      const responseMessage = await aiService.explainCode(code);
      res.status(200).json({ status: 'success', data: { message: responseMessage } });
    } catch (error) {
      next(error);
    }
  }

  async fixCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { code } = req.body;
      if (!code) return next(new AppError('Code snippet is required', 400));

      const responseMessage = await aiService.fixCode(code);
      res.status(200).json({ status: 'success', data: { message: responseMessage } });
    } catch (error) {
      next(error);
    }
  }

  async generateCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { prompt } = req.body;
      if (!prompt) return next(new AppError('Prompt is required', 400));

      const responseMessage = await aiService.generateCode(prompt);
      res.status(200).json({ status: 'success', data: { message: responseMessage } });
    } catch (error) {
      next(error);
    }
  }
}

export const chatController = new ChatController();
