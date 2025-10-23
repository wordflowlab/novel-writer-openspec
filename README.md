# Novel-Writer-OpenSpec

> 基于 OpenSpec 方法论的小说创作管理工具

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/wordflowlab/novel-writer-openspec)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

## 📖 简介

**Novel-Writer-OpenSpec** 是一个将 OpenSpec 方法论应用于小说创作的工具，通过 `specs/`（已确定规格）和 `changes/`（变更提案）的分离管理，为 AI 辅助小说创作提供清晰的上下文和严格的验证机制。

### 核心优势

- ✅ **清晰的上下文管理**：AI 明确知道"已有设定"和"计划设定"
- ✅ **严格的规格格式**：Requirements + Scenarios 可验证格式
- ✅ **自动化验证**：格式验证自动化，减少人设崩塌和设定冲突
- ✅ **结构化演进**：ADDED/MODIFIED/REMOVED 清晰管理设定演进
- ✅ **AI 友好**：提供 AI 助手集成指令，提升创作效率

## 🚀 快速开始

### 安装

```bash
npm install -g novelspec
```

或本地开发：

```bash
git clone https://github.com/wordflowlab/novel-writer-openspec.git
cd novel-writer-openspec
npm install
npm link
```

### 创建第一个小说项目

```bash
# 初始化项目
novelspec init my-novel

# 进入项目目录
cd my-novel

# 查看项目结构
tree -L 2 novelspec/
```

输出：
```
novelspec/
├── project.md       # 项目约定（创作原则、风格指南）
├── AGENTS.md        # AI 助手工作指令
├── specs/           # 已确定的规格（唯一真相）
│   ├── characters/
│   ├── worldbuilding/
│   └── outline/
└── changes/         # 变更提案
    └── archive/
```

### 使用 AI 助手创建提案

在 Cursor/Claude/Windsurf 等 AI 工具中使用斜杠命令：

```
/novelspec-proposal
```

AI 会引导你创建第一个变更提案（如创作第1-10章）。

### 验证提案

```bash
novelspec validate add-chapter-1-10
```

输出：
```
变更: add-chapter-1-10
──────────────────────────────────────────────────
格式验证:
✓ proposal.md 包含 Why/What/Impact
✓ tasks.md 使用任务清单格式
✓ specs/outline/spec.md 格式正确
✓ 所有 Requirement 至少一个 Scenario

验证结果: 通过
```

## 📚 核心概念

### specs/ - 已确定的规格（唯一真相）

存储已经确定的小说规格：
- **characters/** - 角色规格（主角、配角、反派）
- **worldbuilding/** - 世界观规格（魔法体系、地理、势力）
- **outline/** - 故事大纲规格（已完成的章节大纲）

### changes/ - 变更提案

管理待创作的章节和设定变更：
- 每个变更包含：`proposal.md`, `tasks.md`, `specs/` 增量
- 验证通过后开始创作
- 完成后归档到 `archive/`

### Requirements + Scenarios 格式

所有规格使用可验证的格式：

```markdown
### Requirement: 角色基础设定
主角应该（SHALL）具有明确的身份背景。

#### Scenario: 身份信息
- **WHEN** 主角出场或被提及
- **THEN** 姓名：陈凡
- **THEN** 年龄：25岁
- **THEN** 性格：理性、内向、善良但不圣母
```

## 🛠️ CLI 命令

### `novelspec init <project-name>`

初始化一个新的小说项目。

```bash
novelspec init my-novel           # 创建新项目
novelspec init my-novel --here    # 在当前目录初始化
```

### `novelspec list`

列出变更或规格。

```bash
novelspec list                    # 列出活跃变更
novelspec list --archive          # 列出已归档变更
novelspec list --specs            # 列出所有规格
novelspec list --json             # JSON 格式输出
```

### `novelspec show <item-id>`

显示变更或规格详情。

```bash
novelspec show add-chapter-1-10                      # 显示变更详情
novelspec show characters/protagonist --type spec    # 显示规格详情
novelspec show add-chapter-1-10 --json               # JSON 输出
```

### `novelspec validate [change-id]`

验证变更提案的格式。

```bash
novelspec validate                    # 验证所有活跃变更
novelspec validate add-chapter-1-10   # 验证单个变更
novelspec validate --strict           # 严格验证模式
novelspec validate --json             # JSON 输出
```

### `novelspec archive <change-id>`

归档已完成的变更。

```bash
novelspec archive add-chapter-1-10    # 归档变更
novelspec archive add-chapter-1-10 -y # 归档（跳过确认）
```

### `novelspec --help`

查看帮助信息。

```bash
novelspec --help
novelspec init --help
novelspec validate --help
novelspec list --help
novelspec show --help
novelspec archive --help
```

## 🤖 AI 助手集成

Novel-Writer-OpenSpec 在初始化项目时会自动创建 AI 助手集成指令：

### 自动创建的文件

运行 `novelspec init my-novel` 后，会在项目中创建：

- **`.cursor/commands/`** - Cursor 斜杠命令配置
  - `novelspec-proposal.md` - 创建提案命令
  - `novelspec-apply.md` - 执行创作命令
  - `novelspec-archive.md` - 归档变更命令
- **`novelspec/AGENTS.md`** - 完整的 AI 助手工作指令

### 支持的 AI 工具

- **Cursor** - 自动创建 `.cursor/commands/`
- **Claude** - 参考 `novelspec/AGENTS.md`
- **Windsurf** - 参考 `novelspec/AGENTS.md`
- **其他** - 参考 `novelspec/AGENTS.md`

### AI 助手命令

#### `/novelspec-proposal` - 创建变更提案

AI 会引导你创建结构化提案：
1. 询问创作意图（第X-Y章/扩展设定）
2. 生成 `proposal.md`, `tasks.md`, `specs/`
3. 自动运行 `novelspec validate`
4. 输出验证结果

#### `/novelspec-apply` - 执行创作

AI 按照提案和任务清单创作章节：
1. 读取 `proposal.md`, `design.md`, `tasks.md`
2. 基于 `specs/` 的真相创作
3. 持续验证每一章
4. 标记完成的任务

#### `/novelspec-archive` - 归档变更

（Phase 2 将实现）

## 📖 工作流示例

### 创作第1-10章的完整流程

#### 1. 创建提案

使用 AI 助手：
```
/novelspec-proposal
```

AI 询问：
```
你想创作第几章？或扩展什么设定？
```

回答：
```
创作第1-10章，主角穿越到玄幻世界，获得签到系统，完成入门修炼
```

AI 生成：
- `novelspec/changes/add-chapter-1-10/proposal.md`
- `novelspec/changes/add-chapter-1-10/tasks.md`
- `novelspec/changes/add-chapter-1-10/specs/outline/spec.md`
- `novelspec/changes/add-chapter-1-10/specs/characters/protagonist/spec.md`

#### 2. 验证提案

```bash
novelspec validate add-chapter-1-10 --strict
```

#### 3. 执行创作

使用 AI 助手：
```
/novelspec-apply
```

AI 自动：
- 读取所有相关规格
- 按 `tasks.md` 顺序创作章节
- 生成 `chapters/volume-1/chapter-001.md` 至 `chapter-010.md`
- 持续验证每一章

#### 4. 归档变更

（Phase 2 将支持）

```bash
novelspec archive add-chapter-1-10
```

## 🗂️ 项目结构

```
my-novel/
├── novelspec/                  # 规格管理目录
│   ├── project.md              # 项目约定
│   ├── AGENTS.md               # AI 助手指令
│   ├── specs/                  # 已确定规格（唯一真相）
│   │   ├── characters/
│   │   │   ├── protagonist/spec.md
│   │   │   ├── heroine/spec.md
│   │   │   └── supporting/
│   │   ├── worldbuilding/
│   │   │   ├── magic-system/spec.md
│   │   │   ├── geography/spec.md
│   │   │   └── factions/spec.md
│   │   └── outline/spec.md
│   └── changes/                # 变更提案
│       ├── add-chapter-1-10/
│       │   ├── proposal.md
│       │   ├── tasks.md
│       │   └── specs/
│       └── archive/
├── chapters/                   # 章节内容（生成产物）
│   ├── volume-1/
│   │   ├── chapter-001.md
│   │   ├── chapter-002.md
│   │   └── ...
│   └── volume-2/
└── docs/                       # 项目文档
    └── workflow-guide.md
```

## 📝 规格示例

### 角色规格

```markdown
# novelspec/specs/characters/protagonist/spec.md

## Purpose
主角陈凡的完整规格定义。

## Requirements

### Requirement: 基础设定
主角应该（SHALL）具有明确且一致的身份背景。

#### Scenario: 身份信息
- **WHEN** 主角出场或被提及
- **THEN** 姓名：陈凡
- **THEN** 年龄：25岁
- **THEN** 性格：理性、内向、善良但不圣母

### Requirement: 行为模式
主角在不同情境下应该（SHALL）展现一致的行为模式。

#### Scenario: 面对危险时
- **WHEN** 遇到生命威胁
- **THEN** 保持冷静，理性分析局势
- **THEN** 优先寻找逃生路线
```

### 变更提案示例

```markdown
# novelspec/changes/add-chapter-11-20/proposal.md

## Why
前10章完成了主角入门和基础修炼，第11-20章需要通过宗门大比展现主角实力和成长。

## What Changes
- 新增第11-20章大纲规格
- 主角等级从炼气7层 → 炼气9层
- 新增配角规格：天才弟子李剑、神秘导师云长老

## Impact
- **影响规格**：
  - `specs/outline/spec.md`（新增10章）
  - `specs/characters/protagonist/spec.md`（等级更新）
  - `specs/characters/li-jian/spec.md`（新增）
```

## 🔧 开发

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/wordflowlab/novel-writer-openspec.git
cd novel-writer-openspec

# 安装依赖
npm install

# 构建
npm run build

# 本地安装命令
npm link

# 测试
novelspec --version
```

### 目录结构

```
novel-writer-openspec/
├── src/                    # 源代码
│   ├── cli.ts              # CLI 入口
│   ├── commands/           # CLI 命令
│   │   ├── init.ts
│   │   └── validate.ts
│   ├── core/               # 核心模块
│   │   ├── parser.ts
│   │   ├── validator.ts
│   │   └── template-manager.ts
│   └── utils/              # 工具函数
│       └── file-ops.ts
├── templates/              # 模板文件
│   ├── project.md.template
│   ├── AGENTS.md.template
│   ├── characters/
│   ├── worldbuilding/
│   └── outline/
├── docs/                   # 文档
│   ├── PRD.md
│   └── workflow-guide.md
├── openspec/               # OpenSpec 规格（项目自身）
│   ├── project.md
│   ├── specs/
│   └── changes/
├── package.json
├── tsconfig.json
└── README.md
```

## 📚 文档

- [PRD - 产品需求文档](./docs/PRD.md)
- [工作流指南](./docs/workflow-guide.md)
- [AI 助手指令示例](./templates/AGENTS.md.template)

## 🤝 贡献

欢迎贡献！请查看 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 📄 许可证

MIT License - 详见 [LICENSE](./LICENSE)

## 🔗 相关项目

- [OpenSpec](https://github.com/Fission-AI/OpenSpec) - 原始 OpenSpec 方法论
- [Novel-Writer](https://github.com/wordflowlab/novel-writer) - 基于 Spec-Kit 的小说创作工具

## 📮 联系方式

- Issues: [GitHub Issues](https://github.com/wordflowlab/novel-writer-openspec/issues)
- Email: [your-email@example.com](mailto:your-email@example.com)

---

**Happy Writing! 📝✨**

