import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  proposal: '.clinerules/novelspec-proposal.md',
  apply: '.clinerules/novelspec-apply.md',
  archive: '.clinerules/novelspec-archive.md',
  clarify: '.clinerules/novelspec-clarify.md'
};

export class ClineSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'cline';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string | undefined {
    const descriptions: Record<SlashCommandId, string> = {
      proposal: 'Scaffold a new NovelSpec change and validate strictly.',
      apply: 'Implement an approved NovelSpec change and keep tasks in sync.',
      archive: 'Archive a deployed NovelSpec change and update specs.',
      clarify: 'Clarify ambiguous decision points in specs (parallel path display mode).'
    };
    const description = descriptions[id];
    return `# NovelSpec: ${id.charAt(0).toUpperCase() + id.slice(1)}\n\n${description}`;
  }
}
