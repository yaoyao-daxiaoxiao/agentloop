import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import { BaseTool } from './base.js';

const execAsync = promisify(exec);

export class ExecCommandTool extends BaseTool {
  constructor() {
    super(
      'exec_command',
      'Execute a shell command',
      {
        command: {
          type: 'string',
          description: 'Command to execute',
          required: true
        },
        cwd: {
          type: 'string',
          description: 'Working directory',
          required: false
        },
        timeout: {
          type: 'number',
          description: 'Timeout in milliseconds',
          required: false
        }
      }
    );
  }

  async execute(args) {
    try {
      const { stdout, stderr } = await execAsync(args.command, {
        cwd: args.cwd,
        timeout: args.timeout || 30000
      });
      return {
        success: true,
        stdout,
        stderr,
        command: args.command
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        stdout: error.stdout,
        stderr: error.stderr
      };
    }
  }
}
