import { SlashCommandConfigurator } from "./base.js";
import { SlashCommandId } from "../../templates/index.js";
import { FileSystemUtils } from "../../../utils/file-system.js";
import { NOVELSPEC_MARKERS } from "../../config.js";

const FILE_PATHS: Record<SlashCommandId, string> = {
  proposal: ".opencode/command/novelspec-proposal.md",
  apply: ".opencode/command/novelspec-apply.md",
  archive: ".opencode/command/novelspec-archive.md",
  clarify: ".opencode/command/novelspec-clarify.md"
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  proposal: `---
agent: build
description: Scaffold a new NovelSpec change and validate strictly.
---
The user has requested the following change proposal. Use the novelspec instructions to create their change proposal.
<UserRequest>
  $ARGUMENTS
</UserRequest>
`,
  apply: `---
agent: build
description: Implement an approved NovelSpec change and keep tasks in sync.
---`,
  archive: `---
agent: build
description: Archive a deployed NovelSpec change and update specs.
---
<ChangeId>
  $ARGUMENTS
</ChangeId>
`,
  clarify: `---
agent: build
description: Clarify ambiguous decision points in specs (parallel path display mode).
---
The user wants to clarify ambiguous points in their spec. Use the novelspec instructions to guide them through the clarification workflow.
<UserContext>
  $ARGUMENTS
</UserContext>
`
};

export class OpenCodeSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = "opencode";
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string | undefined {
    return FRONTMATTER[id];
  }

  async generateAll(projectPath: string, _openspecDir: string): Promise<string[]> {
    const createdOrUpdated = await super.generateAll(projectPath, _openspecDir);
    await this.rewriteArchiveFile(projectPath);
    return createdOrUpdated;
  }

  async updateExisting(projectPath: string, _openspecDir: string): Promise<string[]> {
    const updated = await super.updateExisting(projectPath, _openspecDir);
    const rewroteArchive = await this.rewriteArchiveFile(projectPath);
    if (rewroteArchive && !updated.includes(FILE_PATHS.archive)) {
      updated.push(FILE_PATHS.archive);
    }
    return updated;
  }

  private async rewriteArchiveFile(projectPath: string): Promise<boolean> {
    const archivePath = FileSystemUtils.joinPath(projectPath, FILE_PATHS.archive);
    if (!await FileSystemUtils.fileExists(archivePath)) {
      return false;
    }

    const body = this.getBody("archive");
    const frontmatter = this.getFrontmatter("archive");
    const sections: string[] = [];

    if (frontmatter) {
      sections.push(frontmatter.trim());
    }

    sections.push(`${NOVELSPEC_MARKERS.start}\n${body}\n${NOVELSPEC_MARKERS.end}`);
    await FileSystemUtils.writeFile(archivePath, sections.join("\n") + "\n");
    return true;
  }
}
