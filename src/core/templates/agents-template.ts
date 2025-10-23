export const agentsTemplate = `# NovelSpec Instructions

使用NovelSpec进行小说创作的AI助手指令。

## 快速检查清单

- 搜索现有工作: \`novelspec spec list --long\`, \`novelspec list\`
- 决定范围: 新能力 vs 修改现有能力
- 选择唯一的 \`change-id\`: kebab-case，动词开头 (\`add-\`, \`update-\`, \`remove-\`, \`refactor-\`)
- 创建结构: \`proposal.md\`, \`tasks.md\`, \`design.md\` (仅在需要时)，以及每个受影响能力的规格增量
- 编写增量: 使用 \`## ADDED|MODIFIED|REMOVED|RENAMED Requirements\`; 每个需求至少包含一个 \`#### Scenario:\`
- 验证: \`novelspec validate [change-id] --strict\` 并修复问题
- 请求批准: 在提案获批前不要开始实施

## 三阶段工作流

### 阶段1: 创建变更提案

**何时创建提案:**
- 添加功能或特性
- 进行破坏性更改（API、架构）
- 更改架构或模式
- 优化性能（改变行为）
- 更新安全模式

**工作流**
1. 查看 \`novelspec/project.md\`, \`novelspec list\`, 和 \`novelspec list --specs\` 以了解当前上下文
2. 选择唯一的动词开头的 \`change-id\`，在 \`novelspec/changes/<id>/\` 下创建 \`proposal.md\`, \`tasks.md\`, 可选的 \`design.md\`，以及规格增量
3. 使用 \`## ADDED|MODIFIED|REMOVED Requirements\` 编写规格增量，每个需求至少一个 \`#### Scenario:\`
4. 运行 \`novelspec validate <id> --strict\` 并在分享提案前解决所有问题

### 阶段2: 实施变更

将这些步骤作为TODO跟踪并逐一完成。
1. **阅读 proposal.md** - 了解要构建什么
2. **阅读 design.md** (如果存在) - 查看技术决策
3. **阅读 tasks.md** - 获取实施清单
4. **按顺序实施任务** - 按顺序完成
5. **确认完成** - 确保 \`tasks.md\` 中的每个项目在更新状态前都已完成
6. **更新清单** - 所有工作完成后，将每个任务设置为 \`- [x]\` 以反映实际情况
7. **批准门** - 在提案审查和批准前不要开始实施

### 阶段3: 归档变更

部署后：
- 将 \`changes/[name]/\` → \`changes/archive/YYYY-MM-DD-[name]/\`
- 如果能力发生更改则更新 \`specs/\`
- 对仅工具性的更改使用 \`novelspec archive <change-id> --skip-specs --yes\` (始终明确传递change ID)
- 运行 \`novelspec validate --strict\` 以确认归档的变更通过检查

## 规格文件格式

### 关键: Scenario格式

**正确** (使用 #### 标题):
\`\`\`markdown
#### Scenario: 用户登录成功
- **WHEN** 提供有效凭据
- **THEN** 返回JWT令牌
\`\`\`

每个需求必须至少有一个scenario。

### 需求措辞
- 对规范性需求使用 SHALL/MUST (除非有意为非规范性，否则避免 should/may)

### 增量操作

- \`## ADDED Requirements\` - 新能力
- \`## MODIFIED Requirements\` - 更改的行为
- \`## REMOVED Requirements\` - 废弃的功能
- \`## RENAMED Requirements\` - 名称更改

## CLI命令

\`\`\`bash
novelspec list               # 查看活跃的变更
novelspec list --specs       # 列出规格
novelspec show <item>        # 显示变更或规格详情
novelspec validate <item>    # 验证变更或规格
novelspec archive <change-id> [--yes|-y]   # 归档已完成的变更
\`\`\`

## 小说创作最佳实践

### 角色一致性
- 角色行为必须符合 \`specs/characters/<name>/spec.md\` 的定义
- 对话风格符合角色设定
- 修为等级变化合理（不能跳跃式突破）

### 世界观一致性
- 魔法使用符合 \`specs/worldbuilding/magic-system/spec.md\`
- 地理描写符合 \`specs/worldbuilding/geography/spec.md\`
- 势力关系符合 \`specs/worldbuilding/factions/spec.md\`

### 情节一致性
- 章节内容符合 \`specs/outline/spec.md\` 的定义
- 情节发展有因果逻辑
- 不出现未定义的角色、地点、技能

记住: 规格是真相。变更是提案。保持它们同步。
`;
