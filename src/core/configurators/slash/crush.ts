import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  proposal: '.crush/commands/novelspec/proposal.md',
  apply: '.crush/commands/novelspec/apply.md',
  archive: '.crush/commands/novelspec/archive.md'
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
---`
};

export class CrushSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'crush';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string {
    return FRONTMATTER[id];
  }
}
