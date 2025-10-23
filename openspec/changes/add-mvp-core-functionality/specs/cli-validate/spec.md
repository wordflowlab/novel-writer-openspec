# CLI Validate Capability

## Purpose
提供 `novelspec validate` 命令，检查变更提案的格式是否符合 Requirements + Scenarios 规范。

## ADDED Requirements

### Requirement: 格式验证命令
系统必须（MUST）提供 `novelspec validate` 命令来验证变更提案格式。

#### Scenario: 验证单个变更
- **WHEN** 用户运行 `novelspec validate add-chapter-1-10`
- **THEN** 检查 `novelspec/changes/add-chapter-1-10/` 目录存在
- **THEN** 检查 `proposal.md` 格式（包含 Why/What/Impact）
- **THEN** 检查 `tasks.md` 格式（使用任务清单格式）
- **THEN** 检查 `specs/` 下的 spec.md 格式（Requirements + Scenarios）
- **THEN** 输出验证结果

#### Scenario: 验证所有活跃变更
- **WHEN** 用户运行 `novelspec validate`（无参数）
- **THEN** 列出所有活跃变更
- **THEN** 依次验证每个变更
- **THEN** 输出综合验证结果

#### Scenario: 严格验证模式
- **WHEN** 用户运行 `novelspec validate add-chapter-1-10 --strict`
- **THEN** 执行所有格式检查
- **THEN** 额外检查: 每个 Requirement 至少一个 Scenario
- **THEN** 额外检查: Scenario 使用 `#### Scenario:` 格式（4个#）
- **THEN** 额外检查: 使用 SHALL/MUST/MAY 关键词
- **THEN** 额外检查: delta spec 使用 ADDED/MODIFIED/REMOVED 标记

### Requirement: proposal.md 格式验证
系统必须（MUST）验证 proposal.md 包含必需的章节。

#### Scenario: 验证 Why 章节
- **WHEN** 验证 proposal.md
- **THEN** 检查存在 `## Why` 章节
- **THEN** 检查 Why 章节至少 1 句话

#### Scenario: 验证 What Changes 章节
- **WHEN** 验证 proposal.md
- **THEN** 检查存在 `## What Changes` 章节
- **THEN** 检查 What Changes 使用列表格式

#### Scenario: 验证 Impact 章节
- **WHEN** 验证 proposal.md
- **THEN** 检查存在 `## Impact` 章节
- **THEN** 检查 Impact 标注影响的规格

#### Scenario: 缺少必需章节错误
- **WHEN** proposal.md 缺少 `## Why` 章节
- **THEN** 输出错误: "proposal.md 缺少 ## Why 章节"
- **THEN** 验证失败

### Requirement: tasks.md 格式验证
系统必须（MUST）验证 tasks.md 使用任务清单格式。

#### Scenario: 验证任务清单格式
- **WHEN** 验证 tasks.md
- **THEN** 检查至少包含一个 `- [ ]` 或 `- [x]` 行
- **THEN** 检查任务描述清晰（非空）

#### Scenario: 任务清单格式错误
- **WHEN** tasks.md 不包含任务清单
- **THEN** 输出错误: "tasks.md 必须使用任务清单格式（- [ ] 或 - [x]）"
- **THEN** 验证失败

### Requirement: spec.md 格式验证
系统必须（MUST）验证 spec.md 使用 Requirements + Scenarios 格式。

#### Scenario: 验证 Requirements 格式
- **WHEN** 验证 spec.md
- **THEN** 检查存在 `### Requirement:` 标题
- **THEN** 检查每个 Requirement 有描述文本

#### Scenario: 验证 Scenarios 格式
- **WHEN** 验证 spec.md
- **THEN** 检查每个 Requirement 至少一个 `#### Scenario:` （4个#）
- **THEN** 检查 Scenario 包含 WHEN/THEN 条件

#### Scenario: Scenario 格式错误
- **WHEN** Scenario 使用 `### Scenario:` （3个#）而非 4个#
- **THEN** 输出错误: "Scenario 必须使用 #### Scenario: 格式（4个#）"
- **THEN** 验证失败

#### Scenario: 缺少 Scenario 错误
- **WHEN** Requirement 没有 Scenario
- **THEN** 输出错误: "Requirement '[name]' 缺少 Scenario"
- **THEN** 验证失败

### Requirement: Delta Spec 格式验证
系统必须（MUST）验证 delta spec 使用 ADDED/MODIFIED/REMOVED 标记。

#### Scenario: 验证 ADDED Requirements
- **WHEN** 验证 changes/.../specs/[capability]/spec.md
- **THEN** 检查存在 `## ADDED Requirements` 章节
- **THEN** 检查 ADDED 下的 Requirements 格式正确

#### Scenario: 验证 MODIFIED Requirements
- **WHEN** delta spec 包含 `## MODIFIED Requirements`
- **THEN** 检查 MODIFIED 下的 Requirements 完整（包含所有 Scenarios）

#### Scenario: 缺少操作标记错误
- **WHEN** delta spec 没有 ADDED/MODIFIED/REMOVED 标记
- **THEN** 输出错误: "Delta spec 必须使用 ADDED/MODIFIED/REMOVED 标记"
- **THEN** 验证失败

### Requirement: 验证结果输出
系统应该（SHALL）输出清晰的验证结果。

#### Scenario: 文本格式输出
- **WHEN** 验证完成（默认模式）
- **THEN** 输出格式验证清单（✓ 通过，✗ 失败）
- **THEN** 输出错误详情和修复建议
- **THEN** 输出验证结果摘要（X个错误，Y个警告）

#### Scenario: JSON 格式输出
- **WHEN** 用户运行 `novelspec validate <change> --json`
- **THEN** 输出 JSON 格式验证结果
- **THEN** 包含 `valid`, `errors`, `warnings` 字段
- **THEN** 每个错误包含 `file`, `type`, `message`, `suggestion` 字段

