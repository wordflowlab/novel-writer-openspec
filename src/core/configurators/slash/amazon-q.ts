import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  proposal: '.amazonq/prompts/novelspec-proposal.md',
  apply: '.amazonq/prompts/novelspec-apply.md',
  archive: '.amazonq/prompts/novelspec-archive.md',
  clarify: '.amazonq/prompts/novelspec-clarify.md'
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  proposal: `---
description: Scaffold a new NovelSpec change and validate strictly.
---

The user has requested the following change proposal. Use the novelspec instructions to create their change proposal.

<UserRequest>
  $ARGUMENTS
</UserRequest>`,
  apply: `---
description: Implement an approved NovelSpec change and keep tasks in sync.
---

The user wants to apply the following change. Use the novelspec instructions to implement the approved change.

<ChangeId>
  $ARGUMENTS
</ChangeId>`,
  archive: `---
description: Archive a deployed NovelSpec change and update specs.
---

The user wants to archive the following deployed change. Use the novelspec instructions to archive the change and update specs.

<ChangeId>
  $ARGUMENTS
</ChangeId>`,
  clarify: `---
description: Clarify ambiguous decision points in specs (parallel path display mode).
---

The user wants to clarify ambiguous points in their spec. Use the novelspec instructions to guide them through the clarification workflow with parallel paths and batch questions.

<UserContext>
  $ARGUMENTS
</UserContext>`
};

export class AmazonQSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'amazon-q';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string {
    return FRONTMATTER[id];
  }
}
