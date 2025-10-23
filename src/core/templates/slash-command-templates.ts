export type SlashCommandId = 'proposal' | 'apply' | 'archive';

const baseGuardrails = `**守则**
- 优先选择简单直接的实现方案，只在明确需要时添加复杂性
- 保持修改范围聚焦在请求的目标上
- 如需额外的NovelSpec约定或说明，请参考 \`novelspec/AGENTS.md\`（位于 \`novelspec/\` 目录内）`;

const proposalGuardrails = `${baseGuardrails}\n- 识别任何模糊或含糊的细节，在编辑文件前询问必要的跟进问题`;

const proposalSteps = `**步骤**
1. 查看 \`novelspec/project.md\`，运行 \`novelspec list\` 和 \`novelspec list --specs\`，检查相关代码或文档，了解当前状态；注意需要澄清的空白点
2. 选择唯一的动词开头的 \`change-id\`，在 \`novelspec/changes/<id>/\` 下创建 \`proposal.md\`、\`tasks.md\` 和 \`design.md\`（如需要）
3. 将变更映射到具体的能力或需求，将多范围工作分解为独立的规格增量，明确关系和顺序
4. 当解决方案跨多个系统、引入新模式或需要在提交规格前讨论权衡时，在 \`design.md\` 中记录架构推理
5. 在 \`changes/<id>/specs/<capability>/spec.md\` 中编写规格增量（每个能力一个文件夹），使用 \`## ADDED|MODIFIED|REMOVED Requirements\`，每个需求至少一个 \`#### Scenario:\`，在相关时交叉引用相关能力
6. 将 \`tasks.md\` 编写为有序的小型、可验证的工作项列表，提供用户可见的进展，包括验证（测试、工具），突出依赖关系或可并行的工作
7. 使用 \`novelspec validate <id> --strict\` 验证，在分享提案前解决每个问题`;

const proposalReferences = `**参考**
- 当验证失败时，使用 \`novelspec show <id> --json --deltas-only\` 或 \`novelspec show <spec> --type spec\` 检查详细信息
- 在编写新需求前，使用 \`rg -n "Requirement:|Scenario:" novelspec/specs\` 搜索现有需求`;

const applySteps = `**步骤**
将这些步骤作为TODO跟踪并逐一完成。
1. 阅读 \`changes/<id>/proposal.md\`、\`design.md\`（如果存在）和 \`tasks.md\` 以确认范围和验收标准
2. 按顺序完成任务，保持编辑最小化，聚焦在请求的变更上
3. 在更新状态前确认完成——确保 \`tasks.md\` 中的每个项目都已完成
4. 所有工作完成后更新清单，将每个任务标记为 \`- [x]\` 并反映实际情况
5. 需要额外上下文时，参考 \`novelspec list\` 或 \`novelspec show <item>\``;

const applyReferences = `**参考**
- 实现时如需提案的额外上下文，使用 \`novelspec show <id> --json --deltas-only\``;

const archiveSteps = `**步骤**
1. 确定要归档的变更ID：
   - 如果此提示已包含特定的变更ID（例如在由slash命令参数填充的 \`<ChangeId>\` 块内），在修剪空白后使用该值
   - 如果对话松散地引用变更（例如通过标题或摘要），运行 \`novelspec list\` 显示可能的ID，分享相关候选项，并确认用户意图哪一个
   - 否则，查看对话，运行 \`novelspec list\`，询问用户要归档哪个变更；在继续前等待确认的变更ID
   - 如果仍无法识别单个变更ID，停止并告诉用户您还无法归档任何内容
2. 通过运行 \`novelspec list\`（或 \`novelspec show <id>\`）验证变更ID，如果变更缺失、已归档或未准备好归档，则停止
3. 运行 \`novelspec archive <id> --yes\`，CLI会移动变更并应用规格更新而不提示（仅对工具性工作使用 \`--skip-specs\`）
4. 查看命令输出以确认目标规格已更新，变更已进入 \`changes/archive/\`
5. 使用 \`novelspec validate --strict\` 验证，如有问题使用 \`novelspec show <id>\` 检查`;

const archiveReferences = `**参考**
- 归档前使用 \`novelspec list\` 确认变更ID
- 使用 \`novelspec list --specs\` 检查刷新的规格，在交接前解决任何验证问题`;

export const slashCommandBodies: Record<SlashCommandId, string> = {
  proposal: [proposalGuardrails, proposalSteps, proposalReferences].join('\n\n'),
  apply: [baseGuardrails, applySteps, applyReferences].join('\n\n'),
  archive: [baseGuardrails, archiveSteps, archiveReferences].join('\n\n')
};

export function getSlashCommandBody(id: SlashCommandId): string {
  return slashCommandBodies[id];
}
