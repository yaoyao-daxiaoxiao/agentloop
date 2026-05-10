import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync, unlinkSync, rmdirSync } from 'fs';
import { join, dirname } from 'path';
import { BaseTool } from './base.js';

export class ReadFileTool extends BaseTool {
  constructor() {
    super(
      'read_file',
      'Read a file from the filesystem',
      {
        path: {
          type: 'string',
          description: 'Path to the file to read',
          required: true
        }
      }
    );
  }

  async execute(args) {
    try {
      const content = readFileSync(args.path, 'utf-8');
      return { success: true, content, path: args.path };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export class WriteFileTool extends BaseTool {
  constructor() {
    super(
      'write_file',
      'Write content to a file',
      {
        path: {
          type: 'string',
          description: 'Path to the file to write',
          required: true
        },
        content: {
          type: 'string',
          description: 'Content to write to the file',
          required: true
        }
      }
    );
  }

  async execute(args) {
    try {
      const dir = dirname(args.path);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
      writeFileSync(args.path, args.content, 'utf-8');
      return { success: true, path: args.path };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export class ListDirectoryTool extends BaseTool {
  constructor() {
    super(
      'list_directory',
      'List contents of a directory',
      {
        path: {
          type: 'string',
          description: 'Path to the directory',
          required: true
        }
      }
    );
  }

  async execute(args) {
    try {
      const items = readdirSync(args.path);
      const files = items.map(item => {
        const fullPath = join(args.path, item);
        const stats = statSync(fullPath);
        return {
          name: item,
          path: fullPath,
          isDirectory: stats.isDirectory()
        };
      });
      return { success: true, files, path: args.path };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export class DeleteFileTool extends BaseTool {
  constructor() {
    super(
      'delete_file',
      'Delete a file or directory',
      {
        path: {
          type: 'string',
          description: 'Path to delete',
          required: true
        },
        recursive: {
          type: 'boolean',
          description: 'Recursively delete directories',
          required: false
        }
      }
    );
  }

  async execute(args) {
    try {
      const stats = statSync(args.path);
      if (stats.isDirectory()) {
        if (args.recursive) {
          rmdirSync(args.path, { recursive: true });
        } else {
          return { success: false, error: 'Directory not empty, use recursive: true' };
        }
      } else {
        unlinkSync(args.path);
      }
      return { success: true, path: args.path };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export class FileExistsTool extends BaseTool {
  constructor() {
    super(
      'file_exists',
      'Check if a file or directory exists',
      {
        path: {
          type: 'string',
          description: 'Path to check',
          required: true
        }
      }
    );
  }

  async execute(args) {
    try {
      const exists = existsSync(args.path);
      const isDir = exists ? statSync(args.path).isDirectory() : false;
      return { success: true, exists, isDirectory: isDir, path: args.path };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
