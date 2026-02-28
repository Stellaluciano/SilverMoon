import { Skill, SkillResponse } from "../core/types";
import { SilvermoonDatabase } from "../storage/database";

export class TaskSkill implements Skill {
  readonly name = "task_skill";

  constructor(private readonly db: SilvermoonDatabase) {}

  canHandle(input: string): boolean {
    const lower = input.toLowerCase();
    return (
      lower.includes("task") ||
      lower.startsWith("todo") ||
      lower.startsWith("add task") ||
      lower.startsWith("complete task")
    );
  }

  async handle(input: string): Promise<SkillResponse> {
    const lower = input.toLowerCase();

    if (lower.includes("list")) {
      const tasks = this.db.listTasks();
      if (!tasks.length) {
        return { text: "You don't have any tasks yet." };
      }
      const list = tasks
        .map((task) => `#${task.id} [${task.completed ? "x" : " "}] ${task.title}`)
        .join("\n");
      return { text: `Here are your tasks:\n${list}`, metadata: { count: tasks.length } };
    }

    if (lower.includes("complete") || lower.includes("done")) {
      const match = input.match(/(\d+)/);
      if (!match) {
        return { text: "Please tell me which task id to complete (e.g. `complete task 2`)." };
      }
      const id = Number(match[1]);
      const task = this.db.completeTask(id);
      return { text: `Done. I marked task #${task?.id} as complete.` };
    }

    const cleaned = input
      .replace(/add task/i, "")
      .replace(/create task/i, "")
      .replace(/new task/i, "")
      .trim();

    const title = cleaned || "Untitled task";
    const task = this.db.createTask(title);
    return { text: `Task created: #${task.id} ${task.title}` };
  }
}
