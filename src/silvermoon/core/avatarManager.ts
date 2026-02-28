import fs from "node:fs";
import path from "node:path";

export class AvatarManager {
  constructor(private readonly avatarDir: string) {}

  uploadAvatar(sourcePath: string): string {
    if (!fs.existsSync(sourcePath)) {
      throw new Error(`Avatar file not found: ${sourcePath}`);
    }

    const ext = path.extname(sourcePath) || ".png";
    const filename = `avatar_${Date.now()}${ext}`;
    const destination = path.join(this.avatarDir, filename);
    fs.copyFileSync(sourcePath, destination);

    return destination;
  }

  listAvatars(): string[] {
    return fs
      .readdirSync(this.avatarDir)
      .filter((name: string) => /\.(png|jpg|jpeg|webp|gif)$/i.test(name))
      .map((name: string) => path.join(this.avatarDir, name));
  }
}
