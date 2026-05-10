import { BaseSkill } from './base.js';

export class SkillManager {
  constructor() {
    this.skills = new Map();
  }

  registerSkill(skill) {
    this.skills.set(skill.name, skill);
  }

  getSkill(name) {
    return this.skills.get(name);
  }

  getAllSkills() {
    return Array.from(this.skills.values());
  }

  async executeSkill(name, context, args) {
    const skill = this.skills.get(name);
    if (!skill) {
      return { success: false, error: `Skill ${name} not found` };
    }
    return await skill.execute(context, args);
  }
}

export { BaseSkill };
