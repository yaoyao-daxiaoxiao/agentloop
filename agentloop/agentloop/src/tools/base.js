export class BaseTool {
  constructor(name, description, parameters) {
    this.name = name;
    this.description = description;
    this.parameters = parameters;
  }

  async execute(args) {
    throw new Error('Method not implemented');
  }

  toJSON(format = 'openai') {
    const properties = {};
    const required = [];
    
    for (const [key, value] of Object.entries(this.parameters)) {
      properties[key] = {
        type: value.type,
        description: value.description
      };
      if (value.required) {
        required.push(key);
      }
    }
    
    return {
      type: 'function',
      function: {
        name: this.name,
        description: this.description,
        parameters: {
          type: 'object',
          properties: properties,
          required: required
        }
      }
    };
  }
}
