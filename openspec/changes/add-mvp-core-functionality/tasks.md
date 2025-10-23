# Tasks: MVP Core Functionality

## 1. 项目基础设施

- [x] 1.1 初始化 npm 项目，创建 `package.json`
  - 依赖: `commander` (CLI), `chalk` (颜色输出)
  - Dev 依赖: `typescript`, `@types/node`, `prettier`, `eslint`
  
- [x] 1.2 配置 TypeScript (`tsconfig.json`)
  - strict mode 开启
  - 输出目录: `dist/`
  - 包含: `src/**/*.ts`
  
- [x] 1.3 配置构建脚本
  - `npm run build`: TypeScript 编译
  - `npm run dev`: watch 模式开发
  - `npm link`: 本地安装 `novelspec` 命令

## 2. 核心模块实现

- [x] 2.1 实现 Markdown 解析器 (`src/core/parser.ts`)
  - 解析 `### Requirement:` 和 `#### Scenario:`
  - 提取 SHALL/MUST/MAY 关键词
  - 提取 WHEN/THEN 条件
  - 测试: 覆盖正常和边缘情况
  
- [x] 2.2 实现格式验证器 (`src/core/validator.ts`)
  - 验证 proposal.md 包含 Why/What/Impact
  - 验证 tasks.md 使用任务清单格式
  - 验证 spec.md Requirements + Scenarios 格式
  - 验证 delta spec 使用 ADDED/MODIFIED/REMOVED
  - 测试: 覆盖常见格式错误
  
- [x] 2.3 实现模板管理器 (`src/core/template-manager.ts`)
  - 读取模板文件
  - 变量替换 (`{{VARIABLE}}`)
  - 复制模板到目标目录
  - 测试: 验证变量替换正确

- [x] 2.4 实现文件操作工具 (`src/utils/file-ops.ts`)
  - 创建目录结构
  - 读写文件
  - 检查文件存在
  - 测试: 覆盖文件操作场景

## 3. CLI 命令实现

- [x] 3.1 实现 CLI 入口 (`src/cli.ts`)
  - 使用 Commander.js
  - 注册 `init` 和 `validate` 命令
  - 提供 `--version` 和 `--help`
  
- [x] 3.2 实现 `novelspec init` 命令 (`src/commands/init.ts`)
  - 接受 `<project-name>` 参数
  - 支持 `--here` 选项（在当前目录初始化）
  - 创建 `novelspec/` 目录结构
  - 复制模板文件（project.md, AGENTS.md）
  - 创建 `specs/`, `changes/`, `changes/archive/` 目录
  - 创建 `chapters/`, `docs/` 目录
  - 输出成功消息和下一步指引
  - 测试: 验证目录结构正确
  
- [x] 3.3 实现 `novelspec validate` 命令 (`src/commands/validate.ts`)
  - 接受 `<change-id>` 参数（可选，默认验证所有）
  - 支持 `--strict` 选项（严格验证）
  - 支持 `--json` 选项（JSON 输出）
  - 运行格式验证
  - 输出验证结果（文本或 JSON）
  - 测试: 验证错误检测和报告

## 4. 模板文件创建

- [x] 4.1 创建 `project.md.template`
  - 包含项目信息、创作原则、风格指南、质量标准、禁忌事项
  - 使用变量: `{{NOVEL_NAME}}`, `{{GENRE}}`, `{{TARGET_WORDS}}`, 等
  
- [x] 4.2 创建 `AGENTS.md.template`
  - 定义 AI 助手工作流（创建提案、执行创作、归档）
  - 说明 `/novelspec-proposal`, `/novelspec-apply`, `/novelspec-archive` 命令
  - 格式规范和验证规则
  
- [x] 4.3 创建角色规格模板 (`templates/characters/_template/spec.md.template`)
  - 包含: Purpose, Requirements (基础设定、行为模式、对话风格)
  - 使用变量: `{{CHARACTER_NAME}}`, `{{AGE}}`, `{{PERSONALITY}}`, 等
  
- [x] 4.4 创建世界观规格模板 (`templates/worldbuilding/magic-system/spec.md.template`)
  - 包含: Purpose, Requirements (修炼等级、战力差距、特殊规则)
  - 使用变量: `{{SYSTEM_NAME}}`, `{{LEVELS}}`, 等
  
- [x] 4.5 创建大纲规格模板 (`templates/outline/spec.md.template`)
  - 包含: Purpose, Requirements (章节规格)
  - 示例: 第1-3章的 Requirements + Scenarios

## 5. 文档编写

- [x] 5.1 编写 `README.md`
  - 项目简介
  - 快速入门（安装、初始化、创建提案）
  - 核心概念（specs/changes, Requirements/Scenarios）
  - CLI 命令参考
  - 示例：创建一个玄幻小说项目
  
- [x] 5.2 编写 `docs/workflow-guide.md`
  - 五阶段工作流详解（创建提案→验证→执行→持续验证→归档）
  - 每个阶段的详细步骤
  - AI 助手使用示例
  - 常见问题和解决方案

## 6. 测试

- [ ] 6.1 编写单元测试（MVP 阶段跳过）
  - Parser: 测试 Requirements/Scenarios 解析
  - Validator: 测试格式验证规则
  - Template Manager: 测试变量替换
  
- [ ] 6.2 编写集成测试（MVP 阶段跳过）
  - `novelspec init`: 验证生成的项目结构
  - `novelspec validate`: 验证错误检测
  
- [x] 6.3 手动测试
  - CLI 命令可执行（novelspec --version, --help）
  - 构建成功（npm run build）
  - 本地安装成功（npm link）

## 7. 发布准备

- [x] 7.1 更新 `package.json`
  - 设置 `bin` 字段指向 `dist/cli.js`
  - 设置版本号: `0.1.0`
  - 添加 `files` 字段（包含 `dist/`, `templates/`）
  
- [x] 7.2 创建 `.npmignore`
  - 排除 `src/`, `tests/`, `*.test.ts`
  
- [x] 7.3 测试本地安装
  - `npm link` 安装到全局
  - 运行 `novelspec --version` ✓
  - 运行 `novelspec --help` ✓
  - 验证功能正常 ✓

## 8. 验证完成

- [x] 8.1 确认所有测试通过（基础功能验证）
- [x] 8.2 确认文档完整（README, workflow-guide, templates）
- [x] 8.3 确认 CLI 命令工作正常（--version, --help）
- [x] 8.4 MVP 核心功能实现完成

