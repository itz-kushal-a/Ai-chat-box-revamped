import fs from 'fs-extra';
import path from 'path';
import { FileNode } from '@ai-chat-box/shared';
import { AppError } from '../utils/appError';

export class FileService {
  async getFileTree(basePath: string): Promise<FileNode[]> {
    try {
      const exists = await fs.pathExists(basePath);
      if (!exists) throw new AppError('Directory not found', 404);

      return this.readDir(basePath, basePath);
    } catch (error: any) {
      throw new AppError(`File System Error: ${error.message}`, 500);
    }
  }

  private async readDir(currentPath: string, rootPath: string): Promise<FileNode[]> {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });
    
    const nodes: FileNode[] = [];

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      const relativePath = path.relative(rootPath, fullPath);
      
      const node: FileNode = {
        id: Buffer.from(relativePath).toString('base64'), // Simple stable ID
        name: entry.name,
        path: relativePath,
        type: entry.isDirectory() ? 'directory' : 'file',
      };

      if (entry.isDirectory()) {
        node.children = await this.readDir(fullPath, rootPath);
      } else {
        node.language = this.getLanguage(entry.name);
      }

      nodes.push(node);
    }

    return nodes;
  }

  private getLanguage(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const map: Record<string, string> = {
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.css': 'css',
      '.json': 'json',
      '.md': 'markdown',
      '.html': 'html',
    };
    return map[ext] || 'text';
  }

  async getFileContent(filePath: string): Promise<string> {
    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch (error: any) {
      throw new AppError(`Could not read file: ${error.message}`, 404);
    }
  }
}

export const fileService = new FileService();
