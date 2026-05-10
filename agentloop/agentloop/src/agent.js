import { config } from 'dotenv';
import * as readline from 'readline';
import chalk from 'chalk';
import { ProviderManager } from './providers/index.js';
import { ToolManager } from './tools/index.js';
import { SkillManager } from './skills/index.js';
import { MCPManager } from './mcp/index.js';

config();

const SYSTEM_PROMPT = `You are a helpful AI assistant with access to various tools.
You can read and write files, execute commands, and use other tools to help the user.

When you need to use a tool, make a tool call. The user will see the tool results.
Always think about what tools you might need to use before responding.

Guidelines:
1. Use tools when necessary to complete the task
2. Explain your actions clearly
3. Break complex tasks into smaller steps
4. Verify your work as you go

Available tools will be provided in the conversation context.`;

const VIBE_CODING_PROMPT = `You are an expert software developer working in "vibe coding" mode.
In this mode, you should:
1. Understand the project's "vibe" - the coding style, patterns, and architecture
2. Write code that fits seamlessly with the existing codebase
3. Use the same naming conventions, patterns, and architectural choices
4. When making changes, maintain consistency with the surrounding code

Before writing new code, explore the codebase to understand the patterns used.`;

function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

async function askQuestion(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

export class AgentLoop {
  constructor(options = {}) {
    this.options = options;
    this.providerManager = new ProviderManager({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL,
      model: options.model || process.env.MODEL || 'gpt-4o'
    });
    this.toolManager = new ToolManager();
    this.skillManager = new SkillManager();
    this.mcpManager = new MCPManager();
    this.messages = [];
    this.provider = this.providerManager.getProvider('openai');
  }

  getSystemPrompt() {
    let prompt = SYSTEM_PROMPT;
    if (this.options.vibeCoding) {
      prompt += '\n\n' + VIBE_CODING_PROMPT;
    }
    return prompt;
  }

  async start(initialPrompt) {
    console.log(chalk.blue.bold('\n🤖 Agent Loop Started\n'));

    this.messages = [
      { role: 'system', content: this.getSystemPrompt() }
    ];

    if (initialPrompt) {
      await this.processUserMessage(initialPrompt);
    }

    const rl = createInterface();

    while (true) {
      const input = await askQuestion(rl, chalk.green('You: '));

      if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
        console.log(chalk.yellow('\n👋 Goodbye!\n'));
        rl.close();
        break;
      }

      if (input.trim()) {
        await this.processUserMessage(input);
      }
    }
  }

  async runTask(task) {
    console.log(chalk.blue.bold('\n🤖 Running Task\n'));

    this.messages = [
      { role: 'system', content: this.getSystemPrompt() },
      { role: 'user', content: task }
    ];

    await this.step();
  }

  async processUserMessage(content) {
    this.messages.push({ role: 'user', content });
    await this.step();
  }

  async step() {
    const tools = this.toolManager.getAllTools();

    try {
      while (true) {
        console.log(chalk.gray('\n⏳ Thinking...'));

        const response = await this.provider.chat(this.messages, {
          tools: tools.length > 0 ? tools : undefined
        });

        const assistantMessage = response.message;
        this.messages.push(assistantMessage);

        if (assistantMessage.content) {
          console.log(chalk.magenta('\nAssistant:'));
          console.log(assistantMessage.content);
        }

        if (!assistantMessage.tool_calls || assistantMessage.tool_calls.length === 0) {
          break;
        }

        for (const toolCall of assistantMessage.tool_calls) {
          const toolName = toolCall.function.name;
          const toolArgs = JSON.parse(toolCall.function.arguments);

          console.log(chalk.cyan(`\n🔧 Using tool: ${toolName}`));
          console.log(chalk.gray('Arguments:'), toolArgs);

          const result = await this.toolManager.executeTool(toolName, toolArgs);

          console.log(chalk.gray('Result:'), result.success ? chalk.green('✓ Success') : chalk.red('✗ Failed'));

          this.messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(result)
          });
        }
      }
    } catch (error) {
      console.error(chalk.red('\n❌ Error:'), error.message);
      console.error(chalk.yellow('\n💡 Tips:'));
      console.error('  1. Check your .env file has a valid API key');
      console.error('  2. If you are in China, use a mirror API endpoint');
      console.error('  3. Check your network connection');
      console.error('  4. Try a different model');
      console.error('\nEdit your .env file and try again!\n');
    }
  }
}
