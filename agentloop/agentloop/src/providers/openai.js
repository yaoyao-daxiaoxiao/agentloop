import OpenAI from 'openai';
import { BaseProvider } from './base.js';

export class OpenAIProvider extends BaseProvider {
  constructor(config) {
    super(config);
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL || 'https://api.openai.com/v1'
    });
    this.model = config.model || 'gpt-4o';
  }

  async chat(messages, options = {}) {
    const response = await this.client.chat.completions.create({
      model: options.model || this.model,
      messages,
      tools: options.tools,
      tool_choice: options.toolChoice || 'auto',
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens,
      stream: options.stream ?? false
    });
    return response.choices[0];
  }

  get toolsFormat() {
    return 'openai';
  }
}
