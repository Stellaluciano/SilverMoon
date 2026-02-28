export type SkillResponse = {
  text: string;
  metadata?: Record<string, unknown>;
};

export interface Skill {
  readonly name: string;
  canHandle(input: string): boolean;
  handle(input: string): Promise<SkillResponse>;
}
