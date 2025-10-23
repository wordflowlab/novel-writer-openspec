# AI Integration Capability

## Purpose
提供 AI 助手集成指令和工作流指导，使 AI 能够高效使用 novelspec 工具辅助小说创作。

## ADDED Requirements

### Requirement: AGENTS.md 指令文件
系统必须（MUST）提供 `novelspec/AGENTS.md` 文件指导 AI 助手。

#### Scenario: 包含工作流指引
- **WHEN** AI 助手读取 `novelspec/AGENTS.md`
- **THEN** 包含五阶段工作流说明（创建提案→验证→执行→持续验证→归档）
- **THEN** 每个阶段包含具体步骤和命令

#### Scenario: 包含命令说明
- **WHEN** AI 助手读取 `novelspec/AGENTS.md`
- **THEN** 包含 `/novelspec-proposal` 命令说明
- **THEN** 包含 `/novelspec-apply` 命令说明
- **THEN** 包含 `/novelspec-archive` 命令说明

#### Scenario: 包含格式规范
- **WHEN** AI 助手读取 `novelspec/AGENTS.md`
- **THEN** 包含 Requirements + Scenarios 格式规范
- **THEN** 包含 ADDED/MODIFIED/REMOVED 使用说明
- **THEN** 包含常见错误和修正示例

### Requirement: /novelspec-proposal 命令定义
系统应该（SHALL）定义 `/novelspec-proposal` AI 命令行为。

#### Scenario: 创建提案流程
- **WHEN** AI 执行 `/novelspec-proposal`
- **THEN** 询问用户创作意图（创作第X-Y章/扩展设定）
- **THEN** 创建 `changes/<change-id>/` 目录结构
- **THEN** 生成 `proposal.md`（Why/What/Impact）
- **THEN** 生成 `tasks.md`（任务清单）
- **THEN** 生成 `specs/` 增量（ADDED/MODIFIED Requirements）
- **THEN** 运行 `novelspec validate <change-id>` 检查
- **THEN** 输出验证结果和修改建议

#### Scenario: 读取上下文
- **WHEN** AI 执行 `/novelspec-proposal`
- **THEN** 读取 `novelspec/project.md`（创作原则）
- **THEN** 读取 `novelspec/specs/`（当前规格）
- **THEN** 基于现有规格生成增量

#### Scenario: 生成 proposal.md
- **WHEN** AI 生成 proposal.md
- **THEN** Why 章节说明创作目标
- **THEN** What Changes 列出规格变更
- **THEN** Impact 标注影响的 specs 和新增章节

### Requirement: /novelspec-apply 命令定义
系统应该（SHALL）定义 `/novelspec-apply` AI 命令行为。

#### Scenario: 执行创作流程
- **WHEN** AI 执行 `/novelspec-apply`
- **THEN** 读取 `proposal.md`（理解意图）
- **THEN** 读取 `design.md`（如存在，理解技术方案）
- **THEN** 读取 `tasks.md`（获取任务清单）
- **THEN** 按顺序执行任务
- **THEN** 生成章节内容到 `chapters/`
- **THEN** 每完成一章运行 `novelspec validate`
- **THEN** 标记完成的任务为 `[x]`

#### Scenario: 持续验证
- **WHEN** AI 创作章节时
- **THEN** 每完成一章运行格式验证
- **THEN** 检查内容符合规格（主角行为、魔法使用、情节）
- **THEN** 如有错误立即修正

### Requirement: /novelspec-archive 命令定义
系统应该（SHALL）定义 `/novelspec-archive` AI 命令行为（MVP 阶段仅说明，不实现）。

#### Scenario: 归档提示
- **WHEN** AI 执行 `/novelspec-archive`
- **THEN** 提示用户归档功能在 Phase 2 实现
- **THEN** 说明归档流程（合并 delta 到 specs/, 移动到 archive/）

### Requirement: 格式规范文档
`AGENTS.md` 必须（MUST）包含清晰的格式规范。

#### Scenario: Requirements 格式规范
- **WHEN** AI 阅读格式规范
- **THEN** 说明使用 `### Requirement:` 格式（3个#）
- **THEN** 说明使用 SHALL/MUST/MAY 关键词
- **THEN** 提供正确示例和错误示例对比

#### Scenario: Scenarios 格式规范
- **WHEN** AI 阅读格式规范
- **THEN** 强调使用 `#### Scenario:` 格式（4个#）
- **THEN** 说明使用 WHEN/THEN 条件
- **THEN** 提供正确示例和错误示例对比

#### Scenario: Delta 操作规范
- **WHEN** AI 阅读格式规范
- **THEN** 说明 ADDED（新增内容）
- **THEN** 说明 MODIFIED（修改现有内容，需完整复制）
- **THEN** 说明 REMOVED（删除内容，标注原因）
- **THEN** 说明 RENAMED（仅改名）

### Requirement: 示例和最佳实践
`AGENTS.md` 应该（SHALL）包含实际示例。

#### Scenario: 完整提案示例
- **WHEN** AI 阅读 AGENTS.md
- **THEN** 包含创作第11-20章的完整提案示例
- **THEN** 包含 proposal.md, tasks.md, specs/ 完整内容
- **THEN** 包含验证通过和失败的示例

#### Scenario: 常见错误和修正
- **WHEN** AI 阅读 AGENTS.md
- **THEN** 包含常见格式错误示例（Scenario 用3个#、缺少 WHEN/THEN）
- **THEN** 包含对应的修正方法
- **THEN** 包含调试命令（`novelspec validate --strict`）

