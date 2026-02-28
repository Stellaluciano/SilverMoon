import cron, { ScheduledTask } from "node-cron";
import { Reminder, SilvermoonDatabase } from "../storage/database";

export class ReminderScheduler {
  private readonly tasks = new Map<number, ScheduledTask>();

  constructor(private readonly db: SilvermoonDatabase) {}

  hydrate(callback: (reminder: Reminder) => void): void {
    const reminders = this.db.listActiveReminders();
    for (const reminder of reminders) {
      this.schedule(reminder, callback);
    }
  }

  schedule(reminder: Reminder, callback: (reminder: Reminder) => void): void {
    if (!cron.validate(reminder.cron_expr)) {
      throw new Error(`Invalid cron expression: ${reminder.cron_expr}`);
    }

    const existing = this.tasks.get(reminder.id);
    if (existing) {
      existing.stop();
    }

    const task = cron.schedule(reminder.cron_expr, () => callback(reminder));
    this.tasks.set(reminder.id, task);
  }

  stopAll(): void {
    for (const task of this.tasks.values()) {
      task.stop();
    }
    this.tasks.clear();
  }
}
