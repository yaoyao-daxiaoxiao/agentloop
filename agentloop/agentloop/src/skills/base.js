export class BaseSkill {
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }

  async execute(context, args) {
    throw new Error('Method not implemented');
  }

  toJSON() {
    return {
      name: this.name,
      description: this.description
    };
  }
}
