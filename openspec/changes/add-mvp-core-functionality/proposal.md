# Proposal: Add MVP Core Functionality

## Why

Novel-Writer-OpenSpec 是一个新项目，需要实施 Phase 1 MVP 核心功能，验证 OpenSpec 方法论在小说创作领域的可行性。

当前状态：项目仅有 PRD 文档，无实际代码。

目标：实现最小可行产品，包括项目初始化、基础验证和 AI 助手集成，使用户能够：
1. 初始化一个小说项目
2. 创建和验证规格提案
3. 通过 AI 助手使用 `/novelspec-proposal` 命令

## What Changes

- **CLI 基础框架**: 实现 `novelspec` CLI 工具，支持 `init` 和 `validate` 命令
- **项目初始化**: 实现 `novelspec init <project-name>` 创建小说项目结构
- **模板系统**: 提供小说专用模板（project.md, AGENTS.md, 角色/世界观/大纲 spec.md 模板）
- **格式验证器**: 实现格式验证（proposal.md, tasks.md, spec.md 格式检查）
- **AI 助手指令**: 创建 AGENTS.md，定义 `/novelspec-proposal` 等命令
- **基础文档**: README 和 workflow-guide

**不包括**（Phase 2 及以后）:
- 语义验证（角色一致性、世界观一致性）
- 跨章节验证（时间线、伏笔追踪）
- `novelspec archive` 命令
- Web 界面或 VS Code 扩展

## Impact

### Affected Specs
新增以下能力规格：
- `specs/cli-init/spec.md` - 项目初始化功能
- `specs/cli-validate/spec.md` - 格式验证功能
- `specs/template-system/spec.md` - 模板系统
- `specs/ai-integration/spec.md` - AI 助手集成

### Affected Code
新增以下文件和目录：
- `src/` - 源代码目录
  - `cli.ts` - CLI 入口
  - `commands/init.ts` - init 命令
  - `commands/validate.ts` - validate 命令
  - `core/parser.ts` - Markdown 解析器
  - `core/validator.ts` - 格式验证器
  - `core/template-manager.ts` - 模板管理器
  - `utils/file-ops.ts` - 文件操作工具
- `templates/` - 模板文件目录
  - `project.md.template`
  - `AGENTS.md.template`
  - `characters/_template/spec.md.template`
  - `worldbuilding/magic-system/spec.md.template`
  - `outline/spec.md.template`
- `package.json` - 项目配置和依赖
- `tsconfig.json` - TypeScript 配置
- `README.md` - 用户文档
- `docs/workflow-guide.md` - 工作流指南

### Breaking Changes
无（新项目）

### Migration
无需迁移（新项目）

