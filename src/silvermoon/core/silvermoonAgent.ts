import { LlmClient } from "./llm";
import { Skill } from "./types";

export class SilvermoonAgent {
  constructor(
    private readonly skills: Skill[],
    private readonly llm: LlmClient
  ) {}

  async processInput(input: string): Promise<string> {
    const skill = this.skills.find((candidate) => candidate.canHandle(input));
    if (skill) {
      const result = await skill.handle(input);
      return `(${skill.name}) ${result.text}`;
    }

    const fallback = await this.llm.chat(
      "You are Silvermoon, a calm personal AI life assistant. Keep responses concise and practical.",
      input
    );

    return fallback || "I can help with tasks, reminders, and memories. Try asking me to create a task.";
  }
}
