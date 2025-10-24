# novel-writer-openspec 项目约定

## 项目概述

基于 OpenSpec 方法论的小说创作管理工具，提供结构化的规格管理和创作工作流程。

## 核心理念

1. **规格驱动创作**：先定义规格，再进行创作
2. **渐进式澄清**：从模糊到清晰，逐步明确创作方向
3. **多样性保护**：避免同质化，鼓励创新组合
4. **版本管理**：使用 OpenSpec 方法论管理规格变更

## 目录结构

```
novelspec/
├── AGENTS.md           # 小说创作工作流程指导（AI 助手专用）
├── project.md          # 本文件：项目约定
├── specs/              # 已确认的小说规格
│   ├── characters/     # 角色规格
│   │   ├── protagonist/
│   │   │   └── spec.md
│   │   └── supporting/
│   │       └── spec.md
│   ├── worldbuilding/  # 世界观规格
│   │   ├── magic-system/
│   │   │   └── spec.md
│   │   └── geography/
│   │       └── spec.md
│   ├── outline/        # 大纲规格
│   │   └── chapter-plan/
│   │       └── spec.md
│   └── knowledge/      # 知识库
│       ├── character-profiles/
│       └── world-settings/
├── changes/            # 待审核的变更提案
│   ├── add-character-arc/
│   │   ├── proposal.md
│   │   ├── tasks.md
│   │   └── specs/
│   │       └── characters/protagonist/spec.md
│   └── archive/        # 已归档的变更
└── tracking/           # 创作进度跟踪（JSON 格式）
    ├── plot-tracker.json
    ├── timeline.json
    └── relationships.json
```

## 文件命名约定

### 规格文件（specs/）

- **目录名**：kebab-case，如 `character-protagonist`、`magic-system`
- **文件名**：统一为 `spec.md`
- **路径示例**：`specs/characters/protagonist/spec.md`

### 变更 ID（changes/）

- **格式**：动词引导，kebab-case
- **动词选择**：
  - `add-` - 新增功能或内容
  - `update-` - 修改现有内容
  - `remove-` - 删除内容
  - `refactor-` - 重构结构
  - `fix-` - 修复错误
- **示例**：
  - `add-character-arc` - 添加角色成长线
  - `update-worldbuilding-system` - 更新世界观体系
  - `refactor-outline-structure` - 重构大纲结构

### 知识库文件（knowledge/）

- **角色档案**：`character-profiles/{name}.md`
- **世界设定**：`world-settings/{topic}.md`
- **命名规则**：kebab-case，中文拼音或英文

### 跟踪文件（tracking/）

- **格式**：JSON
- **命名**：kebab-case，如 `plot-tracker.json`
- **更新频率**：每章创作后更新

## 规格格式约定

### Requirements + Scenarios 格式

所有规格文件使用 OpenSpec 的 Requirements + Scenarios 格式：

```markdown
## Requirements

### Requirement: 主角基本设定
主角应当具备清晰的背景、性格特质和核心动机。

#### Scenario: 主角背景设定
- **WHEN** 创建主角规格时
- **THEN** 必须明确主角的年龄、职业、家庭背景
- **AND** 性格特质应包含至少3个核心特点
- **AND** 核心动机应当明确且合理

### Requirement: 主角成长轨迹
主角应当有清晰的成长轨迹，从初始状态到最终状态。

#### Scenario: 成长阶段划分
- **WHEN** 规划主角成长时
- **THEN** 应划分为至少3个成长阶段
- **AND** 每个阶段应有明确的触发事件
- **AND** 成长应体现在能力、心态或价值观的变化
```

### 变更提案格式

参见 OpenSpec 标准：

- `proposal.md` - 变更提案（Why、What、Impact）
- `tasks.md` - 实施任务清单（勾选式）
- `specs/{capability}/spec.md` - 规格增量（ADDED/MODIFIED/REMOVED）

## 创作工作流程

### 标准流程

1. **规格定义 (Specify)**
   - 使用模板创建初始规格
   - 支持 Level 1-4 渐进式规格

2. **澄清决策 (Clarify)**
   - 使用 `novelspec clarify` 命令
   - 批量澄清模式（并行路径展示）
   - 一次性完成所有决策

3. **规划创作 (Plan)**
   - 制定章节大纲
   - 分配写作任务

4. **执行写作 (Write)**
   - 按照规格进行创作
   - 使用跟踪系统记录进度

5. **分析验证 (Analyze)**
   - 验证是否符合规格
   - 检查一致性

### 变更管理流程

参见 OpenSpec 标准的三阶段工作流程：

1. **Creating Changes** - 创建变更提案
2. **Implementing Changes** - 实施变更
3. **Archiving Changes** - 归档变更

## 模板库

### 可用模板

1. **角色模板**：
   - `character-protagonist` - 主角规格模板
   - `character-supporting` - 配角规格模板
   - `character-villain` - 反派规格模板

2. **世界观模板**：
   - `worldbuilding-xuanhuan` - 玄幻世界观模板
   - `worldbuilding-wuxia` - 武侠世界观模板
   - `worldbuilding-urban` - 都市世界观模板

3. **大纲模板**：
   - `outline-chapter` - 章节大纲模板
   - `outline-complete` - 完整大纲模板

4. **知识模板**：
   - `knowledge-world-setting` - 世界设定模板
   - `knowledge-character-profile` - 角色档案模板

5. **跟踪模板**：
   - `tracking-plot-tracker` - 情节追踪模板
   - `tracking-timeline` - 时间线模板
   - `tracking-relationships` - 关系网模板

### 使用模板

```bash
# CLI 命令（未来功能）
novelspec create character --template protagonist

# 或手动复制模板
# 模板位置：src/core/templates/novel-templates/
```

## 验证规则

### 规格验证

```bash
# 验证单个变更
novelspec validate add-character-arc

# 验证所有变更
novelspec validate

# 严格验证
novelspec validate --strict
```

### 常见验证失败

1. **缺少 Scenario**：每个 Requirement 至少需要一个 Scenario
2. **格式错误**：Scenario 必须使用 `WHEN/THEN/AND` 格式
3. **缺少描述性文本**：Requirement 下方必须有描述文本

## 最佳实践

### 规格编写

1. **从小开始**：使用 Level 1-2 渐进式规格，逐步扩展
2. **保持简洁**：Requirement 应当聚焦单一关注点
3. **可验证**：Scenario 应当可测试、可验证
4. **避免过早细节**：不要在初期规格中过度细化

### 澄清决策

1. **使用批量模式**：一次性回答所有问题，减少交互
2. **鼓励创新**：不要被常见路径束缚
3. **记录理由**：澄清记录应包含决策理由

### 版本管理

1. **小步快跑**：频繁的小变更优于大规模重构
2. **清晰命名**：变更 ID 应清晰表达意图
3. **及时归档**：完成后及时归档，保持 changes/ 目录整洁

## 工具支持

### CLI 命令

```bash
novelspec init <project-name>    # 初始化项目
novelspec clarify                 # 澄清规格
novelspec validate                # 验证规格
novelspec list                    # 列出变更
novelspec list --specs            # 列出规格
novelspec show <item-id>          # 显示详情
novelspec archive <change-id>     # 归档变更
```

### AI 助手指导

- **AGENTS.md** - 完整的 AI 工作流程指导
- **Claude Code 斜杠命令** - `.claude/commands/clarify.md`

## 参考资源

- **OpenSpec 文档**：https://github.com/Fission-AI/OpenSpec
- **项目 README**：`@/README.md`
- **AI 工作流程指导**：`@novelspec/AGENTS.md`
