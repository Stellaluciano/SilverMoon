import { Skill, SkillResponse } from "../core/types";
import { SilvermoonDatabase } from "../storage/database";

export class MemorySkill implements Skill {
  readonly name = "memory_skill";

  constructor(private readonly db: SilvermoonDatabase) {}

  canHandle(input: string): boolean {
    const lower = input.toLowerCase();
    return lower.includes("remember") || lower.includes("memory") || lower.includes("recall");
  }

  async handle(input: string): Promise<SkillResponse> {
    const lower = input.toLowerCase();

    if (lower.includes("recall") || lower.includes("retrieve") || lower.includes("what do you know")) {
      const query = input.replace(/recall|retrieve|memory|memories/gi, "").trim();
      const memories = query ? this.db.searchMemories(query) : this.db.listRecentMemories();
      if (!memories.length) {
        return { text: "I couldn't find any matching memories yet." };
      }
      return {
        text: `Here is what I remember:\n${memories.map((m) => `- ${m.content}`).join("\n")}`,
        metadata: { count: memories.length }
      };
    }

    const content = input.replace(/remember( that)?/i, "").trim();
    if (!content) {
      return { text: "Tell me what to remember, for example: `remember that I prefer morning workouts`." };
    }

    const memory = this.db.createMemory(content);
    return { text: `Saved to memory (#${memory.id}).` };
  }
}
