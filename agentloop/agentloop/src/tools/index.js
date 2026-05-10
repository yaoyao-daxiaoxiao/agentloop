import { BaseTool } from './base.js';
import {
  ReadFileTool,
  WriteFileTool,
  ListDirectoryTool,
  DeleteFileTool,
  FileExistsTool
} from './file.js';
import { ExecCommandTool } from './command.js';

export class ToolManager {
  constructor() {
    this.tools = new Map();
    this.registerDefaultTools();
  }

  registerDefaultTools() {
    this.registerTool(new ReadFileTool());
    this.registerTool(new WriteFileTool());
    this.registerTool(new ListDirectoryTool());
    this.registerTool(new DeleteFileTool());
    this.registerTool(new FileExistsTool());
    this.registerTool(new ExecCommandTool());
  }

  registerTool(tool) {
    this.tools.set(tool.name, tool);
  }

  getTool(name) {
    return this.tools.get(name);
  }

  getAllTools(format = 'openai') {
    return Array.from(this.tools.values()).map(tool => tool.toJSON(format));
  }

  async executeTool(name, args) {
    const tool = this.tools.get(name);
    if (!tool) {
      return { success: false, error: `Tool ${name} not found` };
    }
    return await tool.execute(args);
  }
}

export { BaseTool };
