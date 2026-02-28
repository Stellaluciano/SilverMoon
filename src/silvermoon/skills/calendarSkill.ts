import { Skill, SkillResponse } from "../core/types";

export class CalendarSkill implements Skill {
  readonly name = "calendar_skill";

  canHandle(input: string): boolean {
    const lower = input.toLowerCase();
    return lower.includes("calendar") || lower.includes("event");
  }

  async handle(): Promise<SkillResponse> {
    return {
      text: "Calendar skill is currently a stub. Next step: connect Google Calendar APIs through OpenClaw integrations."
    };
  }
}
