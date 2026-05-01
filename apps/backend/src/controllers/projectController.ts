import { Request, Response, NextFunction } from 'express';
import { fileService } from '../services/fileService';
import { AppError } from '../utils/appError';
import path from 'path';

export class ProjectController {
  async getFileTree(req: Request, res: Response, next: NextFunction) {
    try {
      // In a real app, this would come from a project record in the DB
      // For now, we'll use the monorepo root as a mock project
      const rootPath = path.resolve(__dirname, '../../../../');
      
      const tree = await fileService.getFileTree(rootPath);
      res.status(200).json({ status: 'success', data: { tree } });
    } catch (error) {
      next(error);
    }
  }

  async getFileContent(req: Request, res: Response, next: NextFunction) {
    try {
      const { filePath } = req.query;
      if (!filePath || typeof filePath !== 'string') {
        return next(new AppError('filePath query parameter is required', 400));
      }

      const rootPath = path.resolve(__dirname, '../../../../');
      const fullPath = path.join(rootPath, filePath);

      if (!fullPath.startsWith(rootPath)) {
        return next(new AppError('Access denied: path outside root', 403));
      }

      const content = await fileService.getFileContent(fullPath);
      res.status(200).json({ status: 'success', data: { content } });
    } catch (error) {
      next(error);
    }
  }

  async saveFileContent(req: Request, res: Response, next: NextFunction) {
    try {
      const { filePath, content } = req.body;
      if (!filePath || content === undefined) {
        return next(new AppError('filePath and content are required', 400));
      }

      const rootPath = path.resolve(__dirname, '../../../../');
      const fullPath = path.join(rootPath, filePath);

      // Security check: Ensure requested path is within project root
      if (!fullPath.startsWith(rootPath)) {
        return next(new AppError('Access denied: path outside root', 403));
      }

      const fs = require('fs-extra');
      await fs.writeFile(fullPath, content, 'utf-8');
      
      res.status(200).json({ status: 'success', message: 'File saved successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const projectController = new ProjectController();
