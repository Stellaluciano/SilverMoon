import { config } from "../config";
import { CalendarSkill } from "../skills/calendarSkill";
import { MemorySkill } from "../skills/memorySkill";
import { ReminderSkill } from "../skills/reminderSkill";
import { TaskSkill } from "../skills/taskSkill";
import { SilvermoonDatabase } from "../storage/database";
import { AvatarManager } from "./avatarManager";
import { LlmClient } from "./llm";
import { OpenClawGateway } from "./openClawGateway";
import { ReminderScheduler } from "./reminderScheduler";
import { SilvermoonAgent } from "./silvermoonAgent";

export class SilvermoonRuntime {
  readonly db: SilvermoonDatabase;
  readonly avatarManager: AvatarManager;
  readonly scheduler: ReminderScheduler;
  readonly gateway: OpenClawGateway;

  constructor(notify: (message: string) => void) {
    this.db = new SilvermoonDatabase(config.dbPath);
    this.avatarManager = new AvatarManager(config.avatarDir);
    this.scheduler = new ReminderScheduler(this.db);

    const llm = new LlmClient(config.openaiApiKey, config.openaiModel);

    const skills = [
      new TaskSkill(this.db),
      new ReminderSkill(this.db, this.scheduler, notify),
      new MemorySkill(this.db),
      new CalendarSkill()
    ];

    const agent = new SilvermoonAgent(skills, llm);
    this.gateway = new OpenClawGateway(agent);
  }

  startSchedulers(notify: (message: string) => void): void {
    this.scheduler.hydrate((reminder) => notify(`⏰ Reminder #${reminder.id}: ${reminder.message}`));
  }
}
