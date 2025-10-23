# CLI Init Capability

## Purpose
提供 `novelspec init` 命令，使用户能够快速初始化一个小说项目，包含完整的 novelspec/ 目录结构和模板文件。

## ADDED Requirements

### Requirement: 项目初始化命令
系统必须（MUST）提供 `novelspec init` 命令来创建小说项目结构。

#### Scenario: 基本项目初始化
- **WHEN** 用户运行 `novelspec init my-novel`
- **THEN** 创建 `my-novel/` 目录
- **THEN** 创建 `my-novel/novelspec/` 目录结构
- **THEN** 复制 `project.md` 模板到 `my-novel/novelspec/project.md`
- **THEN** 复制 `AGENTS.md` 模板到 `my-novel/novelspec/AGENTS.md`
- **THEN** 创建 `novelspec/specs/` 目录
- **THEN** 创建 `novelspec/changes/` 和 `novelspec/changes/archive/` 目录
- **THEN** 创建 `chapters/` 目录
- **THEN** 创建 `docs/` 目录
- **THEN** 输出成功消息和下一步指引

#### Scenario: 在当前目录初始化
- **WHEN** 用户在现有目录运行 `novelspec init my-novel --here`
- **THEN** 在当前目录创建 `novelspec/` 结构
- **THEN** 不创建新的项目目录
- **THEN** 输出成功消息

#### Scenario: 目录已存在错误
- **WHEN** 用户运行 `novelspec init my-novel`
- **THEN** 如果 `my-novel/` 目录已存在
- **THEN** 输出错误消息："目录 'my-novel' 已存在"
- **THEN** 退出码为 1

### Requirement: 模板变量替换
系统应该（SHALL）在初始化时提示用户输入项目信息，并替换模板变量。

#### Scenario: 收集项目信息
- **WHEN** 用户运行 `novelspec init my-novel`
- **THEN** 提示用户输入小说名称（默认: my-novel）
- **THEN** 提示用户选择类型（玄幻/武侠/都市/科幻/其他）
- **THEN** 提示用户输入目标字数（默认: 100万字）
- **THEN** 提示用户输入预计卷数（默认: 4卷）

#### Scenario: 应用模板变量
- **WHEN** 用户提供项目信息
- **THEN** 替换 `project.md` 中的 `{{NOVEL_NAME}}`
- **THEN** 替换 `project.md` 中的 `{{GENRE}}`
- **THEN** 替换 `project.md` 中的 `{{TARGET_WORDS}}`
- **THEN** 替换 `project.md` 中的 `{{VOLUMES}}`

### Requirement: 成功消息和指引
系统应该（SHALL）在初始化成功后提供清晰的下一步指引。

#### Scenario: 输出下一步指引
- **WHEN** 项目初始化成功
- **THEN** 输出: "✓ 项目 'my-novel' 初始化成功！"
- **THEN** 输出: "下一步："
- **THEN** 输出: "1. cd my-novel"
- **THEN** 输出: "2. 编辑 novelspec/project.md 设置创作原则"
- **THEN** 输出: "3. 使用 AI 助手 /novelspec-proposal 创建第一个提案"

