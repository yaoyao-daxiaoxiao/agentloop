export class BaseProvider {
  constructor(config) {
    this.config = config;
  }

  async chat(messages, options = {}) {
    throw new Error('Method not implemented');
  }

  get toolsFormat() {
    throw new Error('toolsFormat getter not implemented');
  }
}
