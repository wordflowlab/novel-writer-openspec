# Project Context

## Purpose
Novel-Writer-OpenSpec 是一个基于 OpenSpec 方法论的小说创作管理工具，通过 `specs/`（已确定真相）和 `changes/`（变更提案）的分离管理，为 AI 辅助小说创作提供清晰的上下文和严格的验证机制。

## Tech Stack
- **语言**: TypeScript
- **运行时**: Node.js ≥ 18.0.0
- **包管理**: npm/pnpm
- **CLI 框架**: Commander.js 或类似
- **验证**: 自定义 Markdown 解析器 + Requirements/Scenarios 验证

## Project Conventions

### Code Style
- 使用 TypeScript strict mode
- Prettier 格式化，2 空格缩进
- ESLint 代码质量检查
- 函数和类使用 JSDoc 注释

### Architecture Patterns
- **命令模式**: CLI 命令独立实现（`commands/init.ts`, `commands/validate.ts`, 等）
- **核心层分离**: Parser、Validator、Archiver 作为独立模块
- **文件约定**: 所有规格文件使用 Markdown 格式，遵循 Requirements + Scenarios 结构

### Testing Strategy
- 单元测试覆盖核心模块（Parser、Validator、Archiver）
- 集成测试覆盖 CLI 命令
- 使用真实小说规格文件作为测试夹具

### Git Workflow
- 主分支: `main`
- Feature 分支: `feature/[description]`
- Commit 格式: Conventional Commits（`feat:`, `fix:`, `docs:`, 等）

## Domain Context

### 小说创作术语
- **角色规格 (Character Spec)**: 定义角色的身份、性格、行为模式、对话风格
- **世界观规格 (Worldbuilding Spec)**: 定义魔法体系、地理、势力组织、历史背景
- **大纲规格 (Outline Spec)**: 定义章节大纲和情节发展
- **变更提案 (Change Proposal)**: 创作新章节或扩展设定的提案

### OpenSpec 方法论应用
- **specs/**: 已确定的小说规格（角色、世界观、大纲）
- **changes/**: 待创作的章节和设定变更
- **Requirements**: 使用 SHALL/MUST 表达的规格需求
- **Scenarios**: 使用 WHEN/THEN 格式的可验证场景

## Important Constraints

1. **命名空间独立**: 使用 `novelspec` 命令和 `novelspec/` 目录，避免与 OpenSpec 冲突
2. **无 constitution**: 创作原则整合到 `project.md`，而非单独 spec
3. **格式严格**: 必须使用 `#### Scenario:` 格式（4个#），每个 Requirement 至少一个 Scenario
4. **增量标记**: 变更必须使用 ADDED/MODIFIED/REMOVED 明确标记

## External Dependencies

- 无外部 API 依赖
- 本地文件系统操作
- 可选：Git 集成（未来）

## Novelspec-Specific Conventions

### 项目结构
小说项目使用以下结构：
```
my-novel/
├── novelspec/              # 规格管理目录
│   ├── project.md          # 项目约定
│   ├── AGENTS.md           # AI 助手指令
│   ├── specs/              # 已确定规格
│   └── changes/            # 变更提案
└── chapters/               # 章节内容
```

### 验证规则
- 格式验证：检查文件结构和语法
- 语义验证：检查角色一致性、世界观一致性、情节一致性
- 跨章节验证：检查时间线、角色状态、伏笔管理
