import * as fs from 'fs/promises';
import * as path from 'path';
import { getSlashCommandBody, SlashCommandId } from '../../templates/slash-command-templates.js';
import { NOVELSPEC_MARKERS } from '../../config.js';

export interface SlashCommandTarget {
  id: SlashCommandId;
  path: string;
  kind: 'slash';
}

const ALL_COMMANDS: SlashCommandId[] = ['proposal', 'apply', 'archive'];

export abstract class SlashCommandConfigurator {
  abstract readonly toolId: string;
  abstract readonly isAvailable: boolean;

  getTargets(): SlashCommandTarget[] {
    return ALL_COMMANDS.map((id) => ({
      id,
      path: this.getRelativePath(id),
      kind: 'slash'
    }));
  }

  async generateAll(projectPath: string, _novelspecDir: string): Promise<string[]> {
    const createdOrUpdated: string[] = [];

    for (const target of this.getTargets()) {
      const body = this.getBody(target.id);
      const filePath = path.join(projectPath, target.path);

      if (await this.fileExists(filePath)) {
        await this.updateBody(filePath, body);
      } else {
        const frontmatter = this.getFrontmatter(target.id);
        const sections: string[] = [];
        if (frontmatter) {
          sections.push(frontmatter.trim());
        }
        sections.push(`${NOVELSPEC_MARKERS.start}\n${body}\n${NOVELSPEC_MARKERS.end}`);
        const content = sections.join('\n') + '\n';
        await this.ensureDirectoryExists(path.dirname(filePath));
        await fs.writeFile(filePath, content, 'utf-8');
      }

      createdOrUpdated.push(target.path);
    }

    return createdOrUpdated;
  }

  async updateExisting(projectPath: string, _novelspecDir: string): Promise<string[]> {
    const updated: string[] = [];

    for (const target of this.getTargets()) {
      const filePath = path.join(projectPath, target.path);
      if (await this.fileExists(filePath)) {
        const body = this.getBody(target.id);
        await this.updateBody(filePath, body);
        updated.push(target.path);
      }
    }

    return updated;
  }

  protected abstract getRelativePath(id: SlashCommandId): string;
  protected abstract getFrontmatter(id: SlashCommandId): string | undefined;

  protected getBody(id: SlashCommandId): string {
    return getSlashCommandBody(id).trim();
  }

  // Resolve absolute path for a given slash command target
  resolveAbsolutePath(projectPath: string, id: SlashCommandId): string {
    const rel = this.getRelativePath(id);
    return path.join(projectPath, rel);
  }

  protected async updateBody(filePath: string, body: string): Promise<void> {
    const content = await fs.readFile(filePath, 'utf-8');
    const startIndex = content.indexOf(NOVELSPEC_MARKERS.start);
    const endIndex = content.indexOf(NOVELSPEC_MARKERS.end);

    if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
      throw new Error(`Missing NovelSpec markers in ${filePath}`);
    }

    const before = content.slice(0, startIndex + NOVELSPEC_MARKERS.start.length);
    const after = content.slice(endIndex);
    const updatedContent = `${before}\n${body}\n${after}`;

    await fs.writeFile(filePath, updatedContent, 'utf-8');
  }

  protected async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  protected async ensureDirectoryExists(dirPath: string): Promise<void> {
    await fs.mkdir(dirPath, { recursive: true });
  }
}
