import { ToolDefinition } from '@ai-chat-box/shared';
import { fileService } from './fileService';
import path from 'path';
import fs from 'fs-extra';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const CODING_TOOLS: ToolDefinition[] = [
  {
    name: 'list_files',
    description: 'Lists all files in a directory recursively.',
    parameters: {
      type: 'object',
      properties: {
        directory: { type: 'string', description: 'The directory path relative to project root (e.g., "src"). Use "." for root.' }
      },
      required: ['directory']
    }
  },
  {
    name: 'read_file',
    description: 'Reads the content of a specific file.',
    parameters: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'The file path relative to project root.' }
      },
      required: ['path']
    }
  },
  {
    name: 'grep_search',
    description: 'Searches for a regex pattern in the project files.',
    parameters: {
      type: 'object',
      properties: {
        pattern: { type: 'string', description: 'The regex pattern to search for.' }
      },
      required: ['pattern']
    }
  }
];

export class ToolService {
  private projectRoot: string;

  constructor() {
    this.projectRoot = path.resolve(__dirname, '../../../../');
  }

  async executeTool(name: string, args: any): Promise<string> {
    console.log(`Executing Tool: ${name}`, args);
    
    try {
      switch (name) {
        case 'list_files':
          return await this.listFiles(args.directory);
        case 'read_file':
          return await this.readFile(args.path);
        case 'grep_search':
          return await this.grepSearch(args.pattern);
        default:
          return `Error: Tool "${name}" not found.`;
      }
    } catch (error: any) {
      return `Error executing tool: ${error.message}`;
    }
  }

  private async listFiles(dir: string): Promise<string> {
    const fullPath = path.join(this.projectRoot, dir);
    const tree = await fileService.getFileTree(fullPath);
    return JSON.stringify(tree, null, 2);
  }

  private async readFile(filePath: string): Promise<string> {
    const fullPath = path.join(this.projectRoot, filePath);
    if (!fullPath.startsWith(this.projectRoot)) throw new Error('Access denied');
    return await fileService.getFileContent(fullPath);
  }

  private async grepSearch(pattern: string): Promise<string> {
    // Simple mock grep implementation using Node.js for Windows/Mac compatibility
    // In a real app, we might use a library or native 'grep'/'findstr'
    try {
      const { stdout } = await execAsync(`powershell.exe -Command "Get-ChildItem -Recurse | Select-String -Pattern '${pattern}' | Select-Object -Property Path, LineNumber, Line"`);
      return stdout || 'No matches found.';
    } catch (e: any) {
      return `No matches found or search failed: ${e.message}`;
    }
  }
}

export const toolService = new ToolService();
