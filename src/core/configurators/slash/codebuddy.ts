import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  proposal: '.codebuddy/commands/novelspec/proposal.md',
  apply: '.codebuddy/commands/novelspec/apply.md',
  archive: '.codebuddy/commands/novelspec/archive.md',
  clarify: '.codebuddy/commands/novelspec/clarify.md'
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  proposal: `---
name: NovelSpec: Proposal
description: Scaffold a new NovelSpec change and validate strictly.
category: NovelSpec
tags: [novelspec, change]
---`,
  apply: `---
name: NovelSpec: Apply
description: Implement an approved NovelSpec change and keep tasks in sync.
category: NovelSpec
tags: [novelspec, apply]
---`,
  archive: `---
name: NovelSpec: Archive
description: Archive a deployed NovelSpec change and update specs.
category: NovelSpec
tags: [novelspec, archive]
---`,
  clarify: `---
name: NovelSpec: Clarify
description: Clarify ambiguous decision points in specs (parallel path display mode).
category: NovelSpec
tags: [novelspec, clarify]
---`
};

export class CodeBuddySlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'codebuddy';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string {
    return FRONTMATTER[id];
  }
}

