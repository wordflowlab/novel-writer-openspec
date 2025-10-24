import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  proposal: '.windsurf/workflows/novelspec-proposal.md',
  apply: '.windsurf/workflows/novelspec-apply.md',
  archive: '.windsurf/workflows/novelspec-archive.md',
  clarify: '.windsurf/workflows/novelspec-clarify.md'
};

export class WindsurfSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'windsurf';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string | undefined {
    const descriptions: Record<SlashCommandId, string> = {
      proposal: '创建新的NovelSpec变更提案并进行严格验证。',
      apply: '实施已批准的NovelSpec变更并保持任务同步。',
      archive: '归档已部署的NovelSpec变更并更新规格。',
      clarify: '澄清规格中的模糊决策点（并行路径展示模式）。'
    };
    const description = descriptions[id];
    return `---\ndescription: ${description}\nauto_execution_mode: 3\n---`;
  }
}
