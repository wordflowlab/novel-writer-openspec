# Design: MVP Core Functionality

## Context

Novel-Writer-OpenSpec 是一个应用 OpenSpec 方法论到小说创作的新工具。核心挑战是：
- 适配 OpenSpec 的 specs/changes 结构到小说创作场景
- 提供简洁易用的 CLI 和 AI 助手集成
- 确保验证器能准确识别小说规格格式错误

**约束**:
- 使用 `novelspec` 命名空间，避免与 OpenSpec 冲突
- MVP 阶段聚焦格式验证，语义验证留到 Phase 2
- 模板需适配中文网文创作习惯

**利益相关者**:
- AI 辅助创作的网文作者（主要用户）
- 需要管理复杂设定的长篇小说作者（次要用户）

## Goals / Non-Goals

**Goals**:
- ✅ 用户可以运行 `novelspec init my-novel` 创建小说项目
- ✅ 用户可以运行 `novelspec validate <change>` 检查格式错误
- ✅ AI 可以通过 `/novelspec-proposal` 创建提案
- ✅ 模板包含小说专用规格示例（角色、世界观、大纲）
- ✅ README 提供快速入门指南

**Non-Goals**:
- ❌ 语义验证（角色行为一致性、设定冲突检测）- Phase 2
- ❌ 跨章节验证（时间线、伏笔追踪）- Phase 3
- ❌ 归档功能 - Phase 2
- ❌ VS Code 扩展或 Web 界面 - Phase 4
- ❌ 自动章节生成（由 AI 完成，工具仅提供验证）

## Technical Decisions

### 决策 1: CLI 框架选择

**选择**: 使用 Commander.js

**原因**:
- 轻量且成熟
- 支持子命令、选项、帮助生成
- 与 OpenSpec CLI 保持一致

**备选**:
- Yargs: 更强大但更重
- 手写 CLI: 灵活但需要更多工作

### 决策 2: 文件解析策略

**选择**: 自定义 Markdown 解析器（基于正则表达式 + 状态机）

**原因**:
- Requirements + Scenarios 格式特定，通用 Markdown 解析器过度复杂
- 需要精确识别 `### Requirement:` 和 `#### Scenario:` 结构
- 轻量，无外部依赖

**实现**:
```typescript
interface Spec {
  purpose: string;
  requirements: Requirement[];
}

interface Requirement {
  name: string;
  level: 'SHALL' | 'MUST' | 'MAY';
  scenarios: Scenario[];
}

interface Scenario {
  name: string;
  conditions: string[];  // WHEN/THEN lines
}
```

**备选**:
- unified + remark: 重量级，但更健壮（如需支持复杂 Markdown 功能可考虑）

### 决策 3: 模板变量替换

**选择**: 简单字符串替换（`{{VARIABLE}}`）

**原因**:
- 模板简单，无需复杂逻辑
- 用户友好，一目了然

**实现**:
```typescript
function applyTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] || '');
}
```

**备选**:
- Handlebars/Mustache: 功能强大但过度设计

### 决策 4: 验证错误报告格式

**选择**: 清晰的文本输出 + 可选 JSON 格式

**文本格式**:
```
格式验证：
✓ proposal.md 包含 Why/What/Impact
✗ tasks.md 缺少任务清单格式
  → 必须使用 - [ ] 或 - [x]

验证结果：1个错误
```

**JSON 格式**（`--json` 选项）:
```json
{
  "valid": false,
  "errors": [
    {
      "file": "tasks.md",
      "type": "format",
      "message": "缺少任务清单格式"
    }
  ]
}
```

**原因**:
- 文本输出人类友好
- JSON 输出支持 CI/CD 集成

### 决策 5: 目录结构规范

**选择**: 严格遵循 OpenSpec 结构，仅调整命名空间

```
my-novel/
├── novelspec/              # 核心规格目录
│   ├── project.md          # 项目约定（含创作原则）
│   ├── AGENTS.md           # AI 助手指令
│   ├── specs/              # 已确定规格
│   │   ├── characters/
│   │   ├── worldbuilding/
│   │   └── outline/
│   └── changes/            # 变更提案
│       └── archive/
├── chapters/               # 章节内容（生成产物）
└── docs/                   # 项目文档
```

**原因**:
- 与 OpenSpec 一致，降低学习成本
- `novelspec/` 命名空间清晰标识
- `chapters/` 分离内容和规格

### 决策 6: AI 助手集成方式

**选择**: 提供 `novelspec/AGENTS.md` 指令文件 + 示例斜杠命令配置

**AGENTS.md 内容**:
- 何时创建提案（新章节、扩展设定）
- 如何创建 proposal/tasks/specs 结构
- 如何运行 validate
- Requirements + Scenarios 格式规范

**斜杠命令示例**（`.cursor/commands/novelspec-proposal.md`）:
```yaml
name: /novelspec-proposal
description: 创建小说规格提案
steps:
  1. 询问用户创作意图
  2. 创建 changes/<id>/ 结构
  3. 生成 proposal.md, tasks.md, specs/
  4. 运行 novelspec validate
```

**原因**:
- 工具无关（支持 Claude、Cursor、Windsurf 等）
- 清晰的工作流指导

## Data Model

### 核心数据结构

```typescript
// 规格文件
interface SpecFile {
  path: string;              // 文件路径
  purpose: string;           // ## Purpose 内容
  requirements: Requirement[];
}

// Requirement
interface Requirement {
  name: string;              // 需求名称
  level: 'SHALL' | 'MUST' | 'MAY';
  description: string;       // 需求描述
  scenarios: Scenario[];
}

// Scenario
interface Scenario {
  name: string;              // 场景名称
  conditions: {
    type: 'WHEN' | 'THEN';
    text: string;
  }[];
}

// 变更提案
interface Change {
  id: string;                // 变更 ID
  proposalPath: string;      // proposal.md 路径
  tasksPath: string;         // tasks.md 路径
  designPath?: string;       // design.md 路径（可选）
  deltaSpecs: DeltaSpec[];   // 规格增量
}

// 规格增量
interface DeltaSpec {
  capability: string;        // 能力名称（如 'characters/protagonist'）
  operations: {
    type: 'ADDED' | 'MODIFIED' | 'REMOVED' | 'RENAMED';
    requirements: Requirement[];
  }[];
}

// 验证结果
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  file: string;
  line?: number;
  type: 'format' | 'semantic' | 'cross-chapter';
  message: string;
  suggestion?: string;
}
```

## Risks / Trade-offs

### 风险 1: 自定义解析器脆弱

**风险**: 正则表达式解析可能无法处理边缘情况

**缓解**:
- 严格格式要求，减少变化性
- 大量测试夹具覆盖常见和边缘情况
- 清晰错误提示帮助用户修正

**权衡**: 简单性 vs 健壮性（MVP 阶段优先简单）

### 风险 2: 模板不适配用户需求

**风险**: 默认模板可能不符合所有小说类型

**缓解**:
- 提供多个示例模板（玄幻、武侠、都市、科幻）
- 用户可自定义 project.md 和 spec.md 模板
- 文档说明如何调整模板

**权衡**: 通用性 vs 专业性（MVP 阶段聚焦玄幻类型）

### 风险 3: 格式验证误报

**风险**: 过于严格的验证可能误报合法内容

**缓解**:
- 提供 `--strict` 和非严格模式
- 清晰文档说明格式要求
- 收集用户反馈持续优化

**权衡**: 严格性 vs 灵活性（默认非严格，可选严格）

## Migration Plan

无需迁移（新项目）

## Testing Strategy

### 单元测试
- Parser: 测试 Requirements/Scenarios 解析
- Validator: 测试格式验证规则
- Template Manager: 测试变量替换

### 集成测试
- CLI 命令: 测试 `init` 和 `validate` 端到端
- 真实夹具: 使用完整小说规格文件测试

### 手动测试
- 使用 AI 助手创建提案
- 验证错误提示清晰度
- 检查生成的项目结构

## Open Questions

1. **Q**: 是否需要支持多语言（英文、中文）？
   **A**: MVP 阶段聚焦中文，但代码设计考虑国际化

2. **Q**: 是否需要配置文件（`.novelspecrc`）？
   **A**: MVP 阶段不需要，使用 `novelspec/project.md` 作为配置

3. **Q**: 验证器是否需要支持插件扩展？
   **A**: Phase 1 不需要，Phase 3 可考虑

