import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/slash-command-templates.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  proposal: '.cursor/commands/novelspec-proposal.md',
  apply: '.cursor/commands/novelspec-apply.md',
  archive: '.cursor/commands/novelspec-archive.md'
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  proposal: `---
name: /novelspec-proposal
id: novelspec-proposal
category: NovelSpec
description: 创建新的NovelSpec变更提案并进行严格验证。
---`,
  apply: `---
name: /novelspec-apply
id: novelspec-apply
category: NovelSpec
description: 实施已批准的NovelSpec变更并保持任务同步。
---`,
  archive: `---
name: /novelspec-archive
id: novelspec-archive
category: NovelSpec
description: 归档已部署的NovelSpec变更并更新规格。
---`
};

export class CursorSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'cursor';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string {
    return FRONTMATTER[id];
  }
}
