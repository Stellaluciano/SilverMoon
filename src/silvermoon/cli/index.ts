#!/usr/bin/env node
import readline from "node:readline";
import { validateConfig } from "../config";
import { SilvermoonRuntime } from "../core/runtime";

async function startChat(): Promise<void> {
  validateConfig();

  const printNotify = (message: string): void => {
    process.stdout.write(`\n${message}\n> `);
  };

  const runtime = new SilvermoonRuntime(printNotify);
  runtime.startSchedulers(printNotify);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "> "
  });

  console.log("🌙 Silvermoon started. Type 'exit' to quit.");
  console.log("Commands: remind <msg> | <cron>, add task <title>, list tasks, remember <fact>, /avatar upload <path>");
  rl.prompt();

  rl.on("line", async (line: string) => {
    const input = line.trim();

    if (!input) {
      rl.prompt();
      return;
    }

    if (input === "exit") {
      rl.close();
      return;
    }

    if (input.startsWith("/avatar upload ")) {
      const filePath = input.replace("/avatar upload ", "").trim();
      try {
        const destination = runtime.avatarManager.uploadAvatar(filePath);
        console.log(`Avatar saved to ${destination}`);
      } catch (error) {
        console.error((error as Error).message);
      }
      rl.prompt();
      return;
    }

    if (input === "/avatar list") {
      const avatars = runtime.avatarManager.listAvatars();
      console.log(avatars.length ? avatars.join("\n") : "No avatars uploaded yet.");
      rl.prompt();
      return;
    }

    try {
      const response = await runtime.gateway.routeMessage(input);
      console.log(response);
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
    }

    rl.prompt();
  });

  rl.on("close", () => {
    runtime.scheduler.stopAll();
    console.log("Goodbye from Silvermoon 🌙");
    process.exit(0);
  });
}

const command = process.argv[2];

if (command === "start") {
  void startChat();
} else {
  console.log("Usage: silvermoon start");
}
