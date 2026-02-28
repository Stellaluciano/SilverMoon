import Database from "better-sqlite3";

export type Task = {
  id: number;
  title: string;
  completed: number;
  created_at: string;
};

export type Reminder = {
  id: number;
  message: string;
  cron_expr: string;
  active: number;
  created_at: string;
};

export type Memory = {
  id: number;
  content: string;
  created_at: string;
};

export class SilvermoonDatabase {
  private readonly db: Database.Database;

  constructor(dbPath: string) {
    this.db = new Database(dbPath);
    this.initialize();
  }

  private initialize(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS reminders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message TEXT NOT NULL,
        cron_expr TEXT NOT NULL,
        active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS memories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  createTask(title: string): Task {
    const stmt = this.db.prepare("INSERT INTO tasks(title) VALUES (?)");
    const info = stmt.run(title.trim());
    return this.getTaskById(Number(info.lastInsertRowid));
  }

  listTasks(): Task[] {
    return this.db.prepare("SELECT * FROM tasks ORDER BY id DESC").all() as Task[];
  }

  completeTask(id: number): Task | null {
    this.db.prepare("UPDATE tasks SET completed = 1 WHERE id = ?").run(id);
    return this.getTaskById(id);
  }

  private getTaskById(id: number): Task {
    const row = this.db.prepare("SELECT * FROM tasks WHERE id = ?").get(id) as Task | undefined;
    if (!row) {
      throw new Error(`Task ${id} not found`);
    }
    return row;
  }

  createReminder(message: string, cronExpr: string): Reminder {
    const stmt = this.db.prepare("INSERT INTO reminders(message, cron_expr) VALUES (?, ?)");
    const info = stmt.run(message.trim(), cronExpr.trim());
    return this.getReminderById(Number(info.lastInsertRowid));
  }

  listActiveReminders(): Reminder[] {
    return this.db.prepare("SELECT * FROM reminders WHERE active = 1 ORDER BY id DESC").all() as Reminder[];
  }

  deactivateReminder(id: number): Reminder | null {
    this.db.prepare("UPDATE reminders SET active = 0 WHERE id = ?").run(id);
    return this.getReminderById(id);
  }

  private getReminderById(id: number): Reminder {
    const row = this.db.prepare("SELECT * FROM reminders WHERE id = ?").get(id) as Reminder | undefined;
    if (!row) {
      throw new Error(`Reminder ${id} not found`);
    }
    return row;
  }

  createMemory(content: string): Memory {
    const stmt = this.db.prepare("INSERT INTO memories(content) VALUES (?)");
    const info = stmt.run(content.trim());
    return this.getMemoryById(Number(info.lastInsertRowid));
  }

  searchMemories(query: string): Memory[] {
    return this.db
      .prepare("SELECT * FROM memories WHERE content LIKE ? ORDER BY id DESC LIMIT 10")
      .all(`%${query}%`) as Memory[];
  }

  listRecentMemories(limit = 10): Memory[] {
    return this.db.prepare("SELECT * FROM memories ORDER BY id DESC LIMIT ?").all(limit) as Memory[];
  }

  private getMemoryById(id: number): Memory {
    const row = this.db.prepare("SELECT * FROM memories WHERE id = ?").get(id) as Memory | undefined;
    if (!row) {
      throw new Error(`Memory ${id} not found`);
    }
    return row;
  }
}
