import cron from "node-cron";
import { ReminderScheduler } from "../core/reminderScheduler";
import { Skill, SkillResponse } from "../core/types";
import { SilvermoonDatabase } from "../storage/database";

export class ReminderSkill implements Skill {
  readonly name = "reminder_skill";

  constructor(
    private readonly db: SilvermoonDatabase,
    private readonly scheduler: ReminderScheduler,
    private readonly notify: (message: string) => void
  ) {}

  canHandle(input: string): boolean {
    const lower = input.toLowerCase();
    return lower.includes("remind") || lower.includes("reminder") || lower.includes("cron");
  }

  async handle(input: string): Promise<SkillResponse> {
    const lower = input.toLowerCase();
    if (lower.includes("list")) {
      const reminders = this.db.listActiveReminders();
      if (!reminders.length) {
        return { text: "No active reminders found." };
      }
      return {
        text: `Active reminders:\n${reminders
          .map((r) => `#${r.id} [${r.cron_expr}] ${r.message}`)
          .join("\n")}`
      };
    }

    const parsed = parseReminderInput(input);
    if (!parsed) {
      return {
        text: "To create a reminder use: `remind <message> | <cron>`. Example: `remind drink water | */30 * * * *`."
      };
    }

    if (!cron.validate(parsed.cronExpr)) {
      return { text: `Invalid cron expression: ${parsed.cronExpr}` };
    }

    const reminder = this.db.createReminder(parsed.message, parsed.cronExpr);
    this.scheduler.schedule(reminder, (scheduledReminder) => {
      this.notify(`⏰ Reminder #${scheduledReminder.id}: ${scheduledReminder.message}`);
    });

    return { text: `Reminder created (#${reminder.id}) with cron: ${reminder.cron_expr}` };
  }
}

function parseReminderInput(input: string): { message: string; cronExpr: string } | null {
  const cleaned = input.replace(/^remind(er)?\s*/i, "").trim();
  const parts = cleaned.split("|").map((part) => part.trim());
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return null;
  }

  return { message: parts[0], cronExpr: parts[1] };
}
