#!/usr/bin/env node
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { program } from 'commander';
import { AgentLoop } from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

program
  .name('agentloop')
  .description('An intelligent agent loop with tools and skills')
  .version('1.0.0');

program
  .command('chat')
  .description('Start an interactive chat session with the agent')
  .option('-p, --prompt <prompt>', 'Initial prompt to start the conversation')
  .option('-m, --model <model>', 'Model to use')
  .option('-v, --vibe', 'Enable vibe coding mode')
  .action(async (options) => {
    const agent = new AgentLoop({
      model: options.model,
      vibeCoding: options.vibe
    });
    await agent.start(options.prompt);
  });

program
  .command('run <task>')
  .description('Run a single task')
  .option('-m, --model <model>', 'Model to use')
  .action(async (task, options) => {
    const agent = new AgentLoop({ model: options.model });
    await agent.runTask(task);
  });

program.parse();
