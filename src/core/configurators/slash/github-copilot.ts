import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  proposal: '.github/prompts/novelspec-proposal.prompt.md',
  apply: '.github/prompts/novelspec-apply.prompt.md',
  archive: '.github/prompts/novelspec-archive.prompt.md',
  clarify: '.github/prompts/novelspec-clarify.prompt.md'
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  proposal: `---
description: Scaffold a new NovelSpec change and validate strictly.
---

$ARGUMENTS`,
  apply: `---
description: Implement an approved NovelSpec change and keep tasks in sync.
---

$ARGUMENTS`,
  archive: `---
description: Archive a deployed NovelSpec change and update specs.
---

$ARGUMENTS`,
  clarify: `---
description: Clarify ambiguous decision points in specs (parallel path display mode).
---

$ARGUMENTS`
};

export class GitHubCopilotSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'github-copilot';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string {
    return FRONTMATTER[id];
  }
}
