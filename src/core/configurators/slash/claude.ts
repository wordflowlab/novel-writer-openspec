import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/slash-command-templates.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  proposal: '.claude/commands/novelspec/proposal.md',
  apply: '.claude/commands/novelspec/apply.md',
  archive: '.claude/commands/novelspec/archive.md'
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  proposal: `---
name: NovelSpec: Proposal
description: 创建新的NovelSpec变更提案并进行严格验证。
category: NovelSpec
tags: [novelspec, proposal]
---`,
  apply: `---
name: NovelSpec: Apply
description: 实施已批准的NovelSpec变更并保持任务同步。
category: NovelSpec
tags: [novelspec, apply]
---`,
  archive: `---
name: NovelSpec: Archive
description: 归档已部署的NovelSpec变更并更新规格。
category: NovelSpec
tags: [novelspec, archive]
---`
};

export class ClaudeSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'claude';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string {
    return FRONTMATTER[id];
  }
}
