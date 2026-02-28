import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

dotenv.config();

const root = process.cwd();

function ensureDir(dirPath: string): string {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  return dirPath;
}

export const config = {
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
  openaiModel: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
  dataDir: ensureDir(path.join(root, "silvermoon", "data")),
  avatarDir: ensureDir(path.join(root, "silvermoon", "avatars")),
  dbPath: path.join(root, "silvermoon", "data", "silvermoon.db")
};

export function validateConfig(): void {
  if (!config.openaiApiKey) {
    throw new Error("Missing OPENAI_API_KEY. Add it to .env before starting Silvermoon.");
  }
}
