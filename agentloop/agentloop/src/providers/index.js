import { OpenAIProvider } from './openai.js';

const PROVIDERS = {
  openai: OpenAIProvider
};

export class ProviderManager {
  constructor(config) {
    this.config = config;
    this.providers = new Map();
  }

  getProvider(name = 'openai') {
    if (this.providers.has(name)) {
      return this.providers.get(name);
    }

    const ProviderClass = PROVIDERS[name];
    if (!ProviderClass) {
      throw new Error(`Provider ${name} not found`);
    }

    const provider = new ProviderClass(this.config[name] || this.config);
    this.providers.set(name, provider);
    return provider;
  }

  registerProvider(name, ProviderClass) {
    PROVIDERS[name] = ProviderClass;
  }
}
