export type SlashCommandId = 'proposal' | 'apply' | 'archive' | 'clarify';

const novelContextPrefix = `**小说创作上下文**
你正在协助进行 NovelSpec 小说创作管理：
- \`novelspec/specs/\` = 已确定的设定（角色、世界观、大纲）- 这是**唯一真相**
- \`novelspec/changes/\` = 待创作的章节或设定变更 - 这是**提案和任务**
- 你的职责是帮助用户创建/执行/归档这些变更

**关键原则**:
- 规格必须可验证（使用 Requirements + Scenarios 格式）
- 每次变更都要记录意图（proposal.md 说明"为什么"）
- 保持一致性（角色、世界观、情节）`;

const baseGuardrails = `**守则**
- 优先选择简单直接的方案，只在明确需要时添加复杂性
- 保持修改范围聚焦在请求的目标上
- 如需额外的NovelSpec约定或说明，请参考 \`novelspec/AGENTS.md\``;

const proposalGuardrails = `${baseGuardrails}
- 识别任何模糊或含糊的细节，在编辑文件前询问必要的跟进问题
- 对于小说创作，特别关注：角色设定完整性、世界观合理性、情节逻辑`;

const proposalSteps = `**步骤（小说创作流程）**

0. **【推荐】检查规格清晰度**
   - 快速扫描用户提供的规格或创作意图
   - 识别 7 大类别的潜在模糊点：
     * **创作定位**：目标读者年龄段、作品类型（商业/文学）、预期规模是否明确？
     * **世界观设定**：时代背景、世界规则、地理范围是否清晰？
     * **角色设计**：主角性格特质、成长曲线、核心动机是否具体？
     * **叙事策略**：视角选择、时间线结构、叙事节奏是否确定？
     * **情节核心**：核心冲突类型、主线目标、结局倾向是否明确？
     * **风格基调**：文风选择、描写侧重、情感基调是否清楚？
     * **创作约束**：敏感内容处理、价值观导向、更新计划是否界定？

   **如果发现 2 个以上明显的模糊点**：
   - 输出提示：
     \`\`\`
     ⚠️ 检测到规格中有 X 个模糊决策点：
     - [具体列出识别到的模糊点]

     💡 建议先运行 /novelspec-clarify 进行澄清：
     - 通过并行路径展示（路径A/B/C）帮助你明确创作方向
     - 避免后续返工和方向偏移
     - 提高规格质量和可执行性
     - 批量澄清模式，一次性完成所有决策

     是否继续创建提案？
     - 输入 "clarify" 或 "c" → 建议用户先运行 /novelspec-clarify
     - 输入 "continue" 或 "y" → 继续当前流程（接受风险）
     \`\`\`

   **如果规格已经清晰**（模糊点 ≤ 1）：
   - 简短确认："✅ 规格清晰度良好，继续创建提案"
   - 直接进入步骤1

1. **了解创作意图**
   - 询问用户：想创作第几章？还是扩展设定（如添加新角色、扩展魔法体系）？
   - 如果是章节创作，询问大致情节走向和目标

2. **查看当前状态**
   - 阅读 \`novelspec/project.md\` 了解创作原则和风格指南
   - 运行 \`novelspec list\` 查看活跃的变更
   - 运行 \`novelspec list --specs\` 查看已有的规格（角色、世界观、大纲）
   - 注意需要澄清的空白点

3. **创建变更目录和文件**
   - 选择唯一的 \`change-id\`，动词开头（如 \`add-chapter-1-10\`, \`expand-magic-system\`）
   - 在 \`novelspec/changes/<id>/\` 创建：
     * \`proposal.md\`: 为什么要做这个变更？（Why/What/Impact）
     * \`tasks.md\`: 要做什么？（规格更新、章节创作）
     * \`design.md\`（可选）: 复杂变更的技术方案（如节奏控制、伏笔安排）

4. **编写规格增量**
   - 在 \`changes/<id>/specs/\` 创建规格增量（保持与 \`novelspec/specs/\` 相同的目录结构）
   - 常见规格类型：
     * \`characters/[name]/spec.md\` - 角色规格（新增或修改）
     * \`worldbuilding/[system]/spec.md\` - 世界观规格（魔法体系、地理、势力）
     * \`outline/spec.md\` - 大纲规格（章节情节）
   - 使用 \`## ADDED Requirements\` （新内容）或 \`## MODIFIED Requirements\` （修改现有设定）
   - 每个 Requirement 至少一个 \`#### Scenario:\` （使用 WHEN/THEN 格式）

5. **编写任务清单**
   - 在 \`tasks.md\` 中列出有序的工作项：
     * 第一部分：规格更新（如更新角色、扩展世界观）
     * 第二部分：章节创作（如创作第1-10章）
     * 第三部分：验证（一致性检查、伏笔记录）
   - 每个任务要具体可验证

6. **验证提案**
   - 运行 \`novelspec validate <id> --strict\`
   - 解决所有格式和语义错误
   - 在分享提案前确保验证通过`;

const proposalReferences = `**参考**
- 当验证失败时，使用 \`novelspec show <id> --json --deltas-only\` 或 \`novelspec show <spec> --type spec\` 检查详细信息
- 在编写新需求前，使用 \`rg -n "Requirement:|Scenario:" novelspec/specs\` 搜索现有需求`;

const applySteps = `**步骤（章节创作执行流程）**
将这些步骤作为TODO跟踪并逐一完成。

1. **理解任务范围**
   - 阅读 \`changes/<id>/proposal.md\` 了解"为什么"要做这个变更
   - 阅读 \`design.md\`（如果存在）了解技术方案（节奏控制、伏笔安排等）
   - 阅读 \`tasks.md\` 获取具体的任务清单

2. **准备创作上下文**
   - 阅读 \`novelspec/project.md\` 的创作原则和风格指南
   - 阅读相关的 \`specs/\`：
     * \`specs/characters/\` - 涉及的角色规格
     * \`specs/worldbuilding/\` - 相关的世界观设定
     * \`specs/outline/\` - 已有的大纲
   - 阅读 \`changes/<id>/specs/\` 的规格增量，了解本次变更

3. **按顺序执行任务**
   - 先完成规格更新任务（如果有）
   - 再执行章节创作任务
   - 最后完成验证任务
   - **重要**: 每完成一个任务就标记为 \`- [x]\`，不要批量更新

4. **创作章节时的注意事项**
   - 严格遵守 \`project.md\` 的风格指南（章节长度、语言风格等）
   - 角色行为必须符合 \`specs/characters/<name>/spec.md\`
   - 魔法/技能使用必须符合 \`specs/worldbuilding/magic-system/spec.md\`
   - 情节发展必须符合 \`specs/outline/spec.md\` 或 \`changes/<id>/specs/outline/spec.md\`
   - 不要出现未定义的角色、地点、技能

5. **持续验证**
   - 每完成几章，运行 \`novelspec validate <id>\` 检查一致性
   - 发现问题立即修正，不要累积

6. **完成确认**
   - 确保 \`tasks.md\` 中的每个项目都已完成
   - 所有章节文件已生成到 \`chapters/\` 目录
   - 运行最终验证确保无错误`;

const applyReferences = `**参考**
- 实现时如需提案的额外上下文，使用 \`novelspec show <id> --json --deltas-only\``;

const archiveSteps = `**步骤（归档完成的变更）**

1. **确定要归档的变更**
   - 如果用户明确指定了变更ID，直接使用
   - 如果不确定，运行 \`novelspec list\` 查看所有活跃变更
   - 询问用户确认要归档哪个变更
   - 如果无法识别变更ID，停止并请求用户提供明确的ID

2. **验证变更状态**
   - 运行 \`novelspec show <id>\` 查看变更详情
   - 确认：
     * 所有任务已完成（\`tasks.md\` 中全部标记为 \`[x]\`）
     * 验证已通过（\`novelspec validate <id>\` 无错误）
     * 章节文件已生成（如果是章节创作任务）
   - 如果变更未准备好，停止归档并告知用户

3. **执行归档**
   - 运行 \`novelspec archive <id> --yes\`
   - CLI 会自动：
     * 将规格增量（\`changes/<id>/specs/\`）合并到 \`novelspec/specs/\`
     * 移动整个变更目录到 \`changes/archive/YYYY-MM-DD-<id>/\`
     * 添加日期前缀保留历史

4. **确认归档结果**
   - 查看命令输出，确认：
     * 规格已更新（如 \`specs/outline/spec.md\` 新增了章节）
     * 变更已移动到 \`changes/archive/\`
   - 运行 \`novelspec list --specs\` 查看更新后的规格列表

5. **最终验证**
   - 运行 \`novelspec validate --strict\` 验证整个项目
   - 如有问题，检查并修复
   - 确保 \`specs/\` 目录成为新的"唯一真相"`;

const archiveReferences = `**参考**
- 归档前使用 \`novelspec list\` 确认变更ID
- 使用 \`novelspec list --specs\` 检查刷新的规格，在交接前解决任何验证问题`;

const clarifySteps = `**步骤（澄清规格流程）**
请按照 \`@novelspec/AGENTS.md\` 中的 "澄清规格（Clarification）- 并行路径展示模式" 章节执行。

1. **读取规格文件**
   - 读取项目中的规格文件（specification.md、story.md 或 specs/ 目录中的文件）
   - 识别用户提供的规格内容和上下文

2. **扫描模糊点**
   - 识别 7 大类别的模糊点：创作定位、世界观、角色、叙事、情节、风格、约束
   - 计算每个类别的模糊度
   - 优先处理模糊度最高的类别

3. **生成 2-3 条并行路径**
   - 路径A：基于规格推断的经典路线（市场验证充分）
   - 路径B：差异化路线（提供不同的创作方向）
   - 路径C：创新混搭路线（**明确鼓励打破常规**）
   - 每条路径包含：
     * 名称和描述
     * 适合人群
     * 核心特点
     * 答案组合（如 "1a 2a 3a 4b 5a"）
     * 优势和注意事项
     * 参考作品示例

4. **生成 5 个问题（最多）**
   - 每个问题包含：
     * 背景说明 (💬) - 说明为什么要问这个问题
     * 核心问题 - 清晰的问题陈述
     * 选项（3-4个）- 带路径标签和常见度标注
   - 选项标注格式：
     * 路径标签：[路径A] [路径B] [路径C]
     * 常见度标签：⚠️ 最常见 | 📊 常见 | ⭐ 创新点 | 🎨 完全创新

5. **批量输出（关键）**
   - **一次性输出**：完整的路径分析 + 所有问题
   - 引导用户**一次性回答**
   - 支持的回答格式：
     * 路径快捷：\`路径A\` 或 \`A\`
     * 简洁组合：\`1 a 2 b 3 c 4 d 5 a\`
     * 混合模式：\`1 a 2 路径B 3 c\`

6. **解析答案并更新规格**
   - 支持多种答案格式的灵活解析
   - 更新规格文件，添加 "## 澄清记录" 章节
   - 记录：选择的路径、具体答案、创新点说明、对规格的更新
   - 输出完成报告

**鼓励创新的关键表述**：
- "**我们支持所有可能的组合！**不要被路径限制，创新往往来自打破规则。"
- "任何非常规组合都有可能成功！"
- "独特性往往来自打破规则，坚持您的创意！"
- 提供具体的创新组合示例（如"学生 + 权谋 = 校园政治小说"）`;

const clarifyReferences = `**参考**
- 完整的澄清指导请参考 \`@novelspec/AGENTS.md\` 的"澄清规格（Clarification）"章节
- 输出格式示例和详细说明请参考 AGENTS.md
- 如果规格已经很清晰，输出"✅ 未检测到需要立即澄清的关键模糊点"`;

export const slashCommandBodies: Record<SlashCommandId, string> = {
  proposal: [novelContextPrefix, proposalGuardrails, proposalSteps, proposalReferences].join('\n\n'),
  apply: [novelContextPrefix, baseGuardrails, applySteps, applyReferences].join('\n\n'),
  archive: [novelContextPrefix, baseGuardrails, archiveSteps, archiveReferences].join('\n\n'),
  clarify: [novelContextPrefix, baseGuardrails, clarifySteps, clarifyReferences].join('\n\n')
};

export function getSlashCommandBody(id: SlashCommandId): string {
  return slashCommandBodies[id];
}
