import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  proposal: '.factory/commands/novelspec-proposal.md',
  apply: '.factory/commands/novelspec-apply.md',
  archive: '.factory/commands/novelspec-archive.md',
  clarify: '.factory/commands/novelspec-clarify.md'
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  proposal: `---
description: Scaffold a new NovelSpec change and validate strictly.
argument-hint: request or feature description
---`,
  apply: `---
description: Implement an approved NovelSpec change and keep tasks in sync.
argument-hint: change-id
---`,
  archive: `---
description: Archive a deployed NovelSpec change and update specs.
argument-hint: change-id
---`,
  clarify: `---
description: Clarify ambiguous decision points in specs (parallel path display mode).
argument-hint: spec context (optional)
---`
};

export class FactorySlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'factory';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string {
    return FRONTMATTER[id];
  }

  protected getBody(id: SlashCommandId): string {
    const baseBody = super.getBody(id);
    return `${baseBody}\n\n$ARGUMENTS`;
  }
}
