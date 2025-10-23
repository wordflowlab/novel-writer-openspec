# Novel-Writer-OpenSpec 工作流指南

本指南详细介绍如何使用 Novel-Writer-OpenSpec 进行小说创作的完整流程。

## 目录

1. [准备工作](#准备工作)
2. [五阶段工作流](#五阶段工作流)
3. [实战示例](#实战示例)
4. [常见问题](#常见问题)
5. [最佳实践](#最佳实践)

---

## 准备工作

### 安装工具

```bash
npm install -g novelspec
```

### 初始化项目

```bash
novelspec init my-novel
cd my-novel
```

### 配置项目

编辑 `novelspec/project.md`：

1. **项目信息**：小说名称、类型、目标字数、卷数
2. **创作原则**：逻辑自洽、角色一致性、情节合理性、文风统一
3. **风格指南**：叙事视角、语言风格、章节长度、更新频率
4. **质量标准**：每章必须推进情节、对话符合角色、描写有画面感
5. **禁忌事项**：不得出现现代网络用语、不得随意改变设定、不得让角色 OOC

---

## 五阶段工作流

Novel-Writer-OpenSpec 采用五阶段循环工作流：

```
创建提案 → 验证提案 → 执行创作 → 持续验证 → 归档变更
    ↑                                           ↓
    └───────────── 开始下一批章节 ─────────────────┘
```

### Stage 1: 创建变更提案

**目标**：明确本次创作的目标、范围和规格。

#### 使用 AI 助手创建

在 Cursor/Claude/Windsurf 中执行：

```
/novelspec-proposal
```

AI 会询问：

```
你想创作第几章？或扩展什么设定？
```

#### 回答示例

**示例 1：创作章节**

```
创作第1-10章，主角穿越到玄幻世界，获得签到系统，完成入门修炼
```

**示例 2：扩展设定**

```
扩展魔法体系，添加高级修炼等级和技能
```

**示例 3：新增角色**

```
新增配角：天才弟子李剑，外门第一天才，炼气8层
```

#### AI 生成的内容

AI 会创建：

1. **目录结构**

```
novelspec/changes/add-chapter-1-10/
├── proposal.md      # 变更提案
├── tasks.md         # 任务清单
└── specs/           # 规格增量
    ├── outline/spec.md
    ├── characters/protagonist/spec.md
    └── worldbuilding/magic-system/spec.md
```

2. **proposal.md**（变更意图）

```markdown
## Why
主角入门篇，建立世界观和基础设定。

## What Changes
- 新增第1-10章大纲规格
- 定义主角基础设定
- 定义签到系统规则

## Impact
- `specs/outline/spec.md`（新增10章）
- `specs/characters/protagonist/spec.md`（新增）
- `specs/worldbuilding/magic-system/spec.md`（新增签到系统）
```

3. **tasks.md**（任务清单）

```markdown
## 1. 规格更新
- [ ] 1.1 创建主角规格
- [ ] 1.2 创建签到系统规格
- [ ] 1.3 创建第1-10章大纲

## 2. 章节创作
- [ ] 2.1 第1章：穿越觉醒
- [ ] 2.2 第2章：初探系统
- [ ] 2.3 第3章：小试牛刀
...
```

4. **specs/ 增量**（规格变更）

```markdown
# novelspec/changes/add-chapter-1-10/specs/outline/spec.md

## ADDED Requirements

### Requirement: 第1章 - 穿越觉醒
第1章应该（SHALL）建立世界观和主角设定。

#### Scenario: 开篇设定
- **WHEN** 第1章开始
- **THEN** 主角陈凡穿越到玄幻世界
- **THEN** 发现自己获得签到系统
```

#### 手动创建（可选）

如果不使用 AI 助手，可以手动创建：

```bash
mkdir -p novelspec/changes/add-chapter-1-10/specs/outline
touch novelspec/changes/add-chapter-1-10/proposal.md
touch novelspec/changes/add-chapter-1-10/tasks.md
touch novelspec/changes/add-chapter-1-10/specs/outline/spec.md
```

然后按格式编写内容。

---

### Stage 2: 验证提案

**目标**：确保提案格式正确，规格可验证。

#### 运行验证

```bash
novelspec validate add-chapter-1-10
```

#### 验证输出（通过）

```
变更: add-chapter-1-10
──────────────────────────────────────────────────
格式验证:
✓ proposal.md 包含 Why/What/Impact
✓ tasks.md 使用任务清单格式
✓ specs/outline/spec.md 使用 ADDED 格式
✓ specs/characters/protagonist/spec.md 格式正确
✓ 所有 Requirement 至少一个 Scenario
✓ 所有 Scenario 使用 #### Scenario: 格式

验证结果: 通过
```

#### 验证输出（失败）

```
变更: add-chapter-1-10
──────────────────────────────────────────────────
格式验证:
✓ proposal.md 包含 Why/What/Impact
✓ tasks.md 使用任务清单格式
✗ specs/outline/spec.md:15
    Scenario 必须使用 #### Scenario: 格式（4个#）
    → 当前使用了 ### Scenario:（3个#）

验证结果: 1个错误
请修复错误后重新验证。
```

#### 严格验证

```bash
novelspec validate add-chapter-1-10 --strict
```

严格验证额外检查：
- 每个 Requirement 至少一个 Scenario
- Scenario 使用 `#### Scenario:` 格式（4个#）
- 使用 SHALL/MUST/MAY 关键词
- Scenario 包含 WHEN/THEN 条件

#### 修复错误

根据验证输出修正文件，然后重新验证，直到通过。

---

### Stage 3: 执行创作

**目标**：按照提案和任务清单创作章节内容。

#### 使用 AI 助手创作

在 Cursor/Claude/Windsurf 中执行：

```
/novelspec-apply
```

#### AI 执行流程

1. **读取上下文**（按优先级）

```
1. novelspec/project.md（创作原则、风格指南）
2. novelspec/specs/characters/（角色规格）
3. novelspec/specs/worldbuilding/（世界观规格）
4. novelspec/specs/outline/（已有大纲）
5. novelspec/changes/add-chapter-1-10/（本次任务）
```

2. **按 tasks.md 顺序执行**

```
Task 1.1: 创建主角规格
→ 生成 novelspec/specs/characters/protagonist/spec.md

Task 2.1: 第1章 - 穿越觉醒
→ 生成 chapters/volume-1/chapter-001.md
→ 内容符合所有规格
→ 自动运行 novelspec validate
```

3. **生成章节内容**

AI 确保：
- 遵守 `project.md` 的风格指南（3000-4000字，现代白话）
- 主角行为符合 `protagonist/spec.md`
- 魔法使用符合 `magic-system/spec.md`
- 情节符合 `outline/spec.md` 的第1章 Requirement

4. **标记完成的任务**

```markdown
## 2. 章节创作
- [x] 2.1 第1章：穿越觉醒  ← 标记为完成
- [ ] 2.2 第2章：初探系统
```

#### 手动创作（可选）

如果不使用 AI 助手，手动创作：

1. 阅读 `proposal.md`, `design.md`, `tasks.md`
2. 阅读所有相关 `specs/`
3. 按 `tasks.md` 顺序创作
4. 每完成一章验证一次
5. 手动标记完成的任务

---

### Stage 4: 持续验证

**目标**：确保创作内容符合规格，及时发现错误。

#### 每完成一章验证

```bash
novelspec validate add-chapter-1-10
```

#### 验证维度

1. **格式验证**
   - proposal.md, tasks.md, spec.md 格式正确

2. **语义验证**（MVP 暂不支持，Phase 2 实现）
   - 主角行为符合 `specs/characters/protagonist/spec.md`
   - 魔法使用符合 `specs/worldbuilding/magic-system/spec.md`
   - 情节符合 `specs/outline/spec.md`

3. **跨章节验证**（MVP 暂不支持，Phase 3 实现）
   - 时间线连贯
   - 角色状态一致
   - 伏笔管理

#### 发现错误立即修正

如果验证失败：

1. 查看错误详情
2. 修正文件
3. 重新验证
4. 确保通过后继续

---

### Stage 5: 归档变更

**目标**：合并规格增量到 `specs/`，移动变更到 `archive/`。

⚠️ **注意**：MVP 阶段暂不支持 `archive` 命令，Phase 2 将实现。

#### 归档流程（Phase 2）

```bash
novelspec archive add-chapter-1-10
```

系统自动：

1. **合并 delta 到 specs/**

```
合并 changes/add-chapter-1-10/specs/outline/spec.md
  → specs/outline/spec.md

操作：
- ADDED Requirements 追加到 specs/outline/spec.md
- MODIFIED Requirements 替换对应内容
- REMOVED Requirements 删除对应内容
```

2. **移动到 archive/**

```
移动 changes/add-chapter-1-10/
  → changes/archive/2025-01-22-add-chapter-1-10/
```

3. **结果**

```
✓ specs/ 成为新的唯一真相，包含第1-10章完整大纲
✓ archive/ 保留完整变更历史和意图
✓ AI 下次创作第11章时，读取最新 specs/ 作为上下文
```

---

## 实战示例

### 完整创作流程：第1-10章

#### 1. 创建提案

```
/novelspec-proposal
```

回答：
```
创作第1-10章，主角穿越到玄幻世界，获得签到系统，完成入门修炼
```

#### 2. 验证提案

```bash
novelspec validate add-chapter-1-10 --strict
```

#### 3. 执行创作

```
/novelspec-apply
```

AI 自动创作 10 章，生成：

```
chapters/volume-1/
├── chapter-001.md (3,200字)
├── chapter-002.md (3,500字)
├── chapter-003.md (3,300字)
...
└── chapter-010.md (3,400字)
```

#### 4. 持续验证

每完成一章自动验证，确保符合规格。

#### 5. 归档变更（Phase 2）

```bash
novelspec archive add-chapter-1-10
```

#### 6. 创建下一批章节

```
/novelspec-proposal
```

回答：
```
创作第11-20章，宗门大比，主角展现实力
```

重复 1-5 步骤。

---

## 常见问题

### Q1: 如何修改已有规格？

使用 MODIFIED 操作：

```markdown
# novelspec/changes/update-protagonist/specs/characters/protagonist/spec.md

## MODIFIED Requirements

### Requirement: 能力成长
[完整复制原 Requirement 并修改]
```

### Q2: 如何新增角色？

使用 ADDED 操作：

```markdown
# novelspec/changes/add-supporting-chars/specs/characters/li-jian/spec.md

## ADDED Requirements

### Requirement: 基础设定
李剑应该（SHALL）是外门公认的天才。

#### Scenario: 身份信息
- **WHEN** 李剑登场或被提及
- **THEN** 姓名：李剑
- **THEN** 年龄：22岁
```

### Q3: 如何删除规格？

使用 REMOVED 操作：

```markdown
## REMOVED Requirements

### Requirement: 旧设定
**Reason**: 与后续情节冲突
**Migration**: 改用新的XXX设定
```

### Q4: Scenario 格式错误怎么办？

**错误**：
```markdown
### Scenario: 身份信息  ❌ （3个#，应该4个）
```

**正确**：
```markdown
#### Scenario: 身份信息  ✓ （4个#）
```

### Q5: 如何查看变更详情？

```bash
novelspec show add-chapter-1-10
```

---

## 最佳实践

### 1. 规格优先

先定义规格，再创作内容：

✅ **好的做法**：
```
1. 创建提案（定义第1-10章大纲）
2. 验证提案
3. 创作章节
```

❌ **不好的做法**：
```
1. 直接创作章节
2. 事后补规格
```

### 2. 增量演进

每次变更聚焦 10-20 章，避免过大范围：

✅ **好的做法**：
```
add-chapter-1-10   （10章）
add-chapter-11-20  （10章）
add-chapter-21-30  （10章）
```

❌ **不好的做法**：
```
add-chapter-1-100  （100章，范围过大）
```

### 3. 持续验证

每完成一章验证一次：

✅ **好的做法**：
```
创作第1章 → 验证 → 创作第2章 → 验证 → ...
```

❌ **不好的做法**：
```
创作10章 → 一次性验证（错误累积）
```

### 4. 伏笔记录

在 `design.md` 记录伏笔和回收计划：

```markdown
## 伏笔安排
- 第13章：埋下云长老真实身份伏笔（第二卷揭晓）
- 第17章：暗示宗门内部矛盾（第二卷主线）
```

### 5. 角色一致

严格遵守 `characters/` 规格，避免 OOC：

✅ **好的做法**：
```
参考 specs/characters/protagonist/spec.md
- 面对危险时：保持冷静，理性分析
- 面对诱惑时：先分析风险和代价
```

❌ **不好的做法**：
```
忽略规格，让理性角色突然冲动行事（OOC）
```

### 6. 定期归档

完成一批章节后及时归档：

✅ **好的做法**：
```
第1-10章完成 → 归档 → 第11-20章
```

❌ **不好的做法**：
```
第1-100章全部完成后才归档
```

---

## 附录

### 命令速查

```bash
# 初始化项目
novelspec init <project-name>

# 验证变更
novelspec validate [change-id]
novelspec validate --strict
novelspec validate --json

# 归档变更（Phase 2）
novelspec archive <change-id>

# 帮助
novelspec --help
```

### AI 助手命令速查

```
/novelspec-proposal   # 创建变更提案
/novelspec-apply      # 执行创作
/novelspec-archive    # 归档变更（Phase 2）
```

### 规格格式速查

```markdown
### Requirement: [需求名称]
[描述，使用 SHALL/MUST/MAY]

#### Scenario: [场景名称]
- **WHEN** [条件]
- **THEN** [结果]
```

### Delta 操作速查

```markdown
## ADDED Requirements      # 新增
## MODIFIED Requirements   # 修改（完整复制）
## REMOVED Requirements    # 删除（标注原因）
## RENAMED Requirements    # 改名（标注 FROM/TO）
```

---

**Happy Writing! 📝✨**

