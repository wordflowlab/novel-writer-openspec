# Novel-Writer-OpenSpec 产品需求文档（PRD）

> 版本：1.0  
> 日期：2025-01-22  
> 状态：Draft

## 文档说明

本文档定义 **Novel-Writer-OpenSpec** 产品的核心需求和技术规格。该产品借鉴 OpenSpec 方法论，将 specs/（真相）+ changes/（提案）的双轨结构应用于小说创作领域，通过结构化管理和自动化验证提升 AI 辅助创作的效率和质量。

---

## 一、产品概述

### 1.1 产品定位

**Novel-Writer-OpenSpec** 是一个基于 OpenSpec 方法论核心理念的小说创作管理工具，通过 `specs/`（已确定真相）和 `changes/`（变更提案）的分离管理，为 AI 辅助小说创作提供清晰的上下文和严格的验证机制。

**与 OpenSpec 的关系**：
- **借鉴理念**：specs/（真相）+ changes/（提案）的双轨制结构
- **独立工具**：使用 `novelspec` 命令，独立命名空间，避免与 OpenSpec 冲突
- **定制化**：针对小说创作优化规格格式、验证规则和工作流

### 1.2 核心价值主张

利用 OpenSpec 方法论的三大优势，解决 AI 辅助小说创作的核心痛点：

#### 1. 清晰的上下文管理

**问题**：AI 容易混淆"已有设定"和"计划中设定"

**解决方案**：
- `novelspec/specs/` 存储已确定的设定（角色、世界观、大纲）
- `novelspec/changes/` 管理待创作的章节和设定变更
- AI 明确知道"当前真相"和"工作任务"

**效果**：AI 理解成本降低 50%，减少偏离规格的情况

#### 2. 严格的规格格式

**问题**：AI 生成内容容易偏离规格，难以验证

**解决方案**：
- 使用 Requirements + Scenarios 格式，让规格可验证
- SHALL/MUST 关键词明确约束强度
- ADDED/MODIFIED/REMOVED 清晰管理设定演进

**效果**：规格可自动解析和验证，减少人设崩塌和设定冲突

#### 3. 自动化验证机制

**问题**：一致性检查依赖人工或 AI 主观判断

**解决方案**：
- `novelspec validate` 自动检查一致性
- 即时反馈，防止错误累积
- 结构化验证，覆盖角色、世界观、情节等维度

**效果**：验证效率提升 10 倍，质量更稳定

### 1.3 目标用户

- **主要用户**：使用 AI 辅助创作的网文作者
- **次要用户**：需要管理复杂设定的长篇小说作者
- **潜在用户**：重视一致性和质量控制的创作团队

### 1.4 核心问题与解决方案

| 创作痛点 | Novel-Writer-OpenSpec 解决方案 |
|---------|-------------------------------|
| AI 混淆已有设定和计划设定 | `specs/`（真相）vs `changes/`（任务）分离 |
| AI 生成内容偏离规格 | Requirements + Scenarios 严格约束 |
| 难以追溯"为什么这样改" | `proposal.md` 明确变更意图 |
| 一致性检查依赖人工 | `novelspec validate` 自动化验证 |
| 设定演进难以管理 | ADDED/MODIFIED/REMOVED 增量管理 |
| 多版本大纲混乱 | specs/ 唯一真相，archive/ 保留历史 |

---

## 二、系统架构

### 2.1 目录结构设计

```
my-novel/
├── novelspec/                  # 小说规格管理目录（核心）
│   ├── project.md              # 项目约定（小说信息、创作原则、风格指南）
│   ├── AGENTS.md               # AI 助手工作指令
│   │
│   ├── specs/                  # 已确定的小说规格（唯一真相）
│   │   ├── characters/         # 角色规格
│   │   │   ├── protagonist/
│   │   │   │   └── spec.md    # 主角完整规格
│   │   │   ├── heroine/
│   │   │   │   └── spec.md    # 女主完整规格
│   │   │   └── supporting/
│   │   │       ├── mentor/spec.md
│   │   │       └── villain/spec.md
│   │   │
│   │   ├── worldbuilding/      # 世界观规格
│   │   │   ├── magic-system/
│   │   │   │   └── spec.md    # 魔法体系规格
│   │   │   ├── geography/
│   │   │   │   └── spec.md    # 地理设定规格
│   │   │   ├── factions/
│   │   │   │   └── spec.md    # 势力组织规格
│   │   │   └── history/
│   │   │       └── spec.md    # 历史背景规格
│   │   │
│   │   └── outline/            # 故事大纲规格
│   │       └── spec.md        # 已确定的章节大纲
│   │
│   └── changes/                # 待创作的变更（提案）
│       ├── add-chapter-1-10/   # 第1-10章创作提案
│       │   ├── proposal.md     # 为什么写这10章
│       │   ├── design.md       # 技术方案（POV、节奏、伏笔）
│       │   ├── tasks.md        # 创作任务清单
│       │   └── specs/          # 规格增量
│       │       ├── outline/spec.md              # 大纲增量
│       │       ├── characters/protagonist/spec.md  # 主角发展
│       │       └── worldbuilding/magic-system/spec.md
│       │
│       ├── add-chapter-11-20/  # 第11-20章创作提案
│       │   ├── proposal.md
│       │   ├── design.md
│       │   ├── tasks.md
│       │   └── specs/
│       │       └── outline/spec.md
│       │
│       ├── expand-magic-advanced/  # 魔法扩展提案
│       │   ├── proposal.md
│       │   ├── design.md
│       │   ├── tasks.md
│       │   └── specs/
│       │       └── worldbuilding/magic-system/spec.md
│       │
│       └── archive/            # 已完成变更归档
│           ├── 2025-01-20-add-chapter-1-10/
│           └── 2025-01-21-expand-magic-basic/
│
├── chapters/                   # 实际章节内容（生成产物）
│   ├── volume-1/
│   │   ├── chapter-001.md
│   │   ├── chapter-002.md
│   │   └── ...
│   └── volume-2/
│       ├── chapter-011.md
│       └── ...
│
└── docs/                       # 项目文档
    ├── PRD.md                  # 本文档
    └── workflow-guide.md       # 工作流指南
```

**关键设计点**：

1. **独立命名空间**：使用 `novelspec/` 而非 `openspec/`，避免冲突
2. **无 constitution**：创作原则整合到 `project.md`，而非单独 spec（OpenSpec 没有 constitution 概念）
3. **清晰分离**：`specs/`（真相）和 `changes/`（提案）严格分离
4. **结构化归档**：`archive/` 保留完整历史和变更意图

### 2.2 规格文件格式

#### Project（项目约定）

```markdown
# novelspec/project.md

## 项目信息
- 小说名称：《星辰之梦》
- 类型：玄幻修真
- 目标字数：100万字
- 预计卷数：4卷

## 创作原则

本项目遵循以下核心创作原则（AI 必须严格遵守）：

1. **逻辑自洽**：世界观设定一旦确立，必须保持一致，不得随意修改
2. **角色一致性**：角色行为必须符合性格设定和成长轨迹
3. **情节合理性**：情节发展需有因果逻辑，不强行制造冲突
4. **文风统一**：保持统一的叙事风格和语言特色

## 风格指南

- **叙事视角**：第三人称限制视角（以主角视角为主）
- **语言风格**：现代白话，简洁明快，避免文言和网络流行语
- **章节长度**：3000-4000字/章
- **更新频率**：日更，每日 1 章

## 质量标准

- 每章必须推进情节或深化角色
- 对话符合角色身份和性格
- 描写要有画面感，避免流水账
- 伏笔必须记录并回收

## 禁忌事项

- ❌ 不得出现现代网络用语
- ❌ 不得随意改变魔法体系规则
- ❌ 不得让角色 OOC（Out of Character）
- ❌ 不得出现未定义的设定（角色、地点、技能等）
```

**说明**：
- `project.md` 承载了创作原则和风格指南，相当于 novel-writer 的 constitution
- 但这不是一个独立的 spec，而是项目级别的约定
- AI 在工作时会读取这个文件作为最高约束

#### Character（角色规格）

```markdown
# novelspec/specs/characters/protagonist/spec.md

## Purpose
主角陈凡的完整规格定义，AI 生成对话和行为的依据。

## Requirements

### Requirement: 基础设定
主角应该（SHALL）具有明确且一致的身份背景。

#### Scenario: 身份信息
- **WHEN** 主角出场或被提及
- **THEN** 姓名：陈凡
- **THEN** 年龄：25岁
- **THEN** 职业：程序员（穿越前）
- **THEN** 性格：理性、内向、善良但不圣母
- **THEN** 特点：逻辑思维强，不善社交，观察力敏锐

### Requirement: 能力成长
主角必须（MUST）经历可验证的成长轨迹。

#### Scenario: 第一卷成长（第1-30章）
- **WHEN** 完成第一卷
- **THEN** 修为等级：从普通人到炼气5层
- **THEN** 性格变化：从胆怯到自信但依然谨慎
- **THEN** 关系变化：与女主从陌生到朋友
- **THEN** 掌握技能：玄元诀、风雷步

### Requirement: 行为模式
主角在不同情境下应该（SHALL）展现一致的行为模式。

#### Scenario: 面对危险时
- **WHEN** 遇到生命威胁
- **THEN** 保持冷静，理性分析局势
- **THEN** 优先寻找逃生路线
- **THEN** 不轻易与强敌硬拼
- **THEN** 如有同伴，优先保护弱者

#### Scenario: 面对诱惑时
- **WHEN** 有人提供强大功法或宝物
- **THEN** 先分析风险和代价
- **THEN** 询问来源和附加条件
- **THEN** 谨慎判断是否接受
- **THEN** 不贪图天降之物

#### Scenario: 面对冲突时
- **WHEN** 与他人产生矛盾
- **THEN** 优先沟通解决
- **THEN** 避免无意义的争斗
- **THEN** 必要时果断出手
- **THEN** 不滥杀无辜

### Requirement: 对话风格
主角的对话应该（SHALL）符合其身份和性格。

#### Scenario: 日常对话
- **WHEN** 与同辈或晚辈对话
- **THEN** 语气平和，用词简洁
- **THEN** 不说废话，言之有物
- **THEN** 偶尔展现程序员式的逻辑思维

#### Scenario: 面对强者对话
- **WHEN** 与前辈或强者对话
- **THEN** 保持尊重但不卑躬屈膝
- **THEN** 措辞谨慎，避免冒犯
- **THEN** 该坚持原则时不退让
```

#### Worldbuilding（世界观规格）

```markdown
# novelspec/specs/worldbuilding/magic-system/spec.md

## Purpose
定义本世界的修炼体系和魔法规则，AI 描写相关场景的依据。

## Requirements

### Requirement: 修炼等级体系
修炼体系必须（MUST）清晰且一致。

#### Scenario: 等级划分
- **WHEN** 提及修炼等级
- **THEN** 使用以下体系：
  - 炼气期（1-9层）
  - 筑基期（前、中、后期）
  - 金丹期（前、中、后期）
  - 元婴期（前、中、后期）
  - 化神期（前、中、后期）

### Requirement: 等级差距战力
不同等级间的战力差距应该（SHALL）合理。

#### Scenario: 越级战斗限制
- **WHEN** 角色越级战斗
- **THEN** 最多越 2 小层级（如炼气3层 vs 炼气5层）
- **THEN** 需要特殊条件（功法、法宝、环境优势）
- **THEN** 跨大境界（如炼气 vs 筑基）几乎不可能

### Requirement: 签到系统规则
主角的签到系统必须（MUST）遵循固定规则。

#### Scenario: 签到机制
- **WHEN** 主角签到
- **THEN** 每日只能签到一次
- **THEN** 不同地点签到奖励不同
- **THEN** 特殊地点奖励更好（宗门禁地、遗迹等）
- **THEN** 奖励范围：功法、丹药、法宝、灵石

#### Scenario: 签到奖励平衡
- **WHEN** 获得签到奖励
- **THEN** 不得过于逆天（如直接突破大境界）
- **THEN** 需要主角后续修炼消化
- **THEN** 保持合理的成长曲线
```

#### Outline（大纲规格）

```markdown
# novelspec/specs/outline/spec.md

## Purpose
故事大纲的已确定部分，AI 推进情节的依据。

## Requirements

### Requirement: 第1章 - 穿越觉醒
第1章应该（SHALL）建立世界观和主角设定。

#### Scenario: 开篇设定
- **WHEN** 第1章开始
- **THEN** 主角陈凡穿越到玄幻世界
- **THEN** 发现自己获得签到系统
- **THEN** 初步了解修炼体系
- **THEN** 埋下伏笔：系统来源神秘，未来将揭晓

#### Scenario: 世界观展现
- **WHEN** 第1章进行中
- **THEN** 介绍主角所在地：青云宗外门
- **THEN** 展现宗门基本结构
- **THEN** 暗示修炼世界的残酷

### Requirement: 第2章 - 初探系统
第2章应该（SHALL）展示系统能力。

#### Scenario: 首次签到
- **WHEN** 主角首次使用系统
- **THEN** 签到地点：宗门广场
- **THEN** 获得奖励：基础功法《玄元诀》
- **THEN** 了解签到规则（每日一次）
- **THEN** 开始修炼

#### Scenario: 初次修炼
- **WHEN** 主角修炼玄元诀
- **THEN** 展现修炼过程
- **THEN** 突破到炼气1层
- **THEN** 感受到实力提升

### Requirement: 第3章 - 小试牛刀
第3章应该（SHALL）初步展现主角实力。

#### Scenario: 遇到麻烦
- **WHEN** 第3章
- **THEN** 主角遇到欺负新人的外门师兄
- **THEN** 被迫动手
- **THEN** 运用玄元诀击退对手
- **THEN** 引起注意，为后续剧情埋伏笔
```

#### Change Delta（变更增量）

```markdown
# novelspec/changes/add-chapter-11-20/specs/outline/spec.md

## ADDED Requirements

### Requirement: 第11章 - 宗门大比
第11章应该（SHALL）开启宗门大比篇章。

#### Scenario: 大比开幕
- **WHEN** 第11章开始
- **THEN** 宗门宣布三年一度大比
- **THEN** 介绍奖励：前三名进入藏经阁
- **THEN** 主角决定参加
- **THEN** 介绍对手：外门天才李剑

### Requirement: 第12章 - 初战告捷
第12章应该（SHALL）展现主角实力增长。

#### Scenario: 首轮比试
- **WHEN** 主角参加首轮
- **THEN** 对手是炼气6层外门弟子
- **THEN** 主角隐藏实力（仅用70%）
- **THEN** 险胜但不暴露签到系统能力
- **THEN** 引起部分人关注

### Requirement: 第13章 - 神秘导师
第13章应该（SHALL）引入重要配角。

#### Scenario: 遇见云长老
- **WHEN** 比试后主角独自修炼
- **THEN** 神秘云长老出现
- **THEN** 云长老看出主角不凡
- **THEN** 提出指点主角
- **THEN** 埋下伏笔：云长老身份神秘

## MODIFIED Requirements

### Requirement: 主角实力等级
主角在第11-20章必须（MUST）达到炼气9层。

#### Scenario: 第20章时的状态
- **WHEN** 第20章结束
- **THEN** 修为等级：炼气9层（接近筑基）
- **THEN** 掌握技能：玄元诀（大成）、风雷步（熟练）、破云手（初窥）
- **THEN** 战力：可越2层战斗
- **THEN** 名声：在外门小有名气

#### Scenario: 成长轨迹
- **WHEN** 第11-20章过程中
- **THEN** 第11章：炼气7层
- **THEN** 第15章：突破到炼气8层
- **THEN** 第19章：突破到炼气9层
- **THEN** 每次突破都有合理契机（签到奖励+自身努力）
```

**ADDED/MODIFIED 使用说明**：

- **ADDED**：新增内容，之前 specs/ 中不存在
- **MODIFIED**：修改现有内容，需要完整复制原 Requirement 并修改
- **REMOVED**：删除内容（标注原因和迁移方案）
- **RENAMED**：仅改名（标注 FROM/TO）

### 2.3 工作流程设计

Novel-Writer-OpenSpec 采用 **五阶段工作流**，借鉴 OpenSpec 的三阶段循环：

```
┌─────────────────────────────────────┐
│  Stage 1: 创建变更提案                 │
│  - 定义创作目标（第X-Y章）              │
│  - 生成 proposal/design/tasks       │
│  - 编写规格增量（ADDED/MODIFIED）       │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  Stage 2: 验证提案                    │
│  - novelspec validate --strict      │
│  - 检查格式、语义、一致性               │
│  - AI 修正错误                       │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  Stage 3: 执行创作                    │
│  - AI 读取 specs/（真相）            │
│  - AI 读取 change delta（增量）      │
│  - 根据 tasks.md 生成章节             │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  Stage 4: 持续验证                    │
│  - 每完成一章运行 validate            │
│  - AI 收到即时反馈                    │
│  - 修正错误后继续                     │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  Stage 5: 归档变更                    │
│  - novelspec archive <change-id>    │
│  - 合并 delta 到 specs/              │
│  - 移动到 archive/                   │
│  - specs/ 成为新真相                  │
└─────────────────────────────────────┘
         │
         └──> 回到 Stage 1（下一批章节）
```

#### Stage 1: 创建变更提案（详细示例）

**场景**：创作第11-20章

```bash
# 人类通过 AI 助手创建提案
# 使用命令：/novelspec-proposal

# AI 创建目录结构
mkdir -p novelspec/changes/add-chapter-11-20/specs/{outline,characters}
```

**文件 1: `proposal.md`**（变更意图）

```markdown
## Why
前10章完成了主角入门和基础修炼，第11-20章需要：
- 通过宗门大比展现主角实力和成长
- 推进主线剧情（获得高级功法和资源）
- 建立与核心配角的关系（李剑、云长老）
- 为第二卷埋下伏笔

## What Changes
- 新增第11-20章大纲规格
- 主角等级从炼气7层 → 炼气9层
- 新增配角规格：天才弟子李剑、神秘导师云长老
- 扩展魔法体系：增加高级技能描述（破云手）

## Impact
- **影响规格**：
  - `specs/outline/spec.md`（新增10章）
  - `specs/characters/protagonist/spec.md`（等级和技能更新）
  - `specs/characters/li-jian/spec.md`（新增）
  - `specs/characters/yun-elder/spec.md`（新增）
  - `specs/worldbuilding/magic-system/spec.md`（新增技能）
- **影响章节**：新增 `chapters/volume-2/chapter-011.md` 至 `chapter-020.md`
- **预计字数**：约 35,000 字（10章 × 3,500字/章）
```

**文件 2: `design.md`**（技术方案）

```markdown
## Context
第11-20章是第一卷的高潮部分，需要平衡节奏感和爽点。

## Goals / Non-Goals

**Goals**：
- 展现主角天赋和努力的结合
- 建立读者对主角实力的期待
- 埋下第二卷重要伏笔
- 引入关键配角丰富故事

**Non-Goals**：
- 不过度暴露签到系统秘密
- 不引入过多新设定增加复杂度
- 不让主角实力提升过快失去合理性

## Technical Decisions

### POV（视角）设计
- **第11-15章**：主角第三人称限制视角为主
- **第16-18章**：穿插对手视角（李剑），增加悬念和对比
- **第19-20章**：回归主角视角，展现高潮和转折

### 节奏控制
- **第11章**：铺垫（慢节奏），介绍大比规则和对手
- **第12-18章**：比试（快节奏），一章一战或一章多战
- **第19-20章**：转折（中节奏），意外情况和收尾

### 伏笔安排
- **第13章**：埋下云长老真实身份伏笔（第二卷揭晓）
- **第17章**：暗示宗门内部矛盾（第二卷主线）
- **第20章**：引出更大世界观（其他宗门、邪修组织）

### 爽点设计
- 第12章：首胜，展现实力
- 第15章：突破炼气8层
- 第18章：绝境反杀强敌
- 第19章：突破炼气9层
- 第20章：获得珍贵奖励

## Risks / Trade-offs

**风险**：
- 节奏过快可能导致读者疲劳
- 新角色过多可能分散注意力

**应对**：
- 每2-3章安排一个舒缓章节（日常、感情线）
- 新角色聚焦在2个核心配角

## Migration Plan
无需迁移，纯新增内容。
```

**文件 3: `tasks.md`**（任务清单）

```markdown
## 1. 规格更新

- [ ] 1.1 更新主角规格（`specs/characters/protagonist/spec.md`）
  - 等级：炼气7层 → 炼气9层
  - 新增技能：破云手
  - 更新战力描述
  
- [ ] 1.2 创建李剑角色规格（`specs/characters/li-jian/spec.md`）
  - 基础设定：外门天才，炼气8层
  - 性格：骄傲但不愚蠢，有自己的坚持
  - 行为模式：面对挑战、面对失败
  
- [ ] 1.3 创建云长老角色规格（`specs/characters/yun-elder/spec.md`）
  - 基础设定：神秘强者，修为不明
  - 性格：淡然、睿智、惜才
  - 行为模式：指点主角、观察主角
  
- [ ] 1.4 扩展魔法体系（`specs/worldbuilding/magic-system/spec.md`）
  - 新增技能：破云手（炼气后期技能）
  - 技能效果、修炼条件、威力描述

## 2. 章节创作

- [ ] 2.1 第11章：宗门大比开幕
  - 介绍大比规则和奖励
  - 主角决定参加
  - 引出对手李剑
  
- [ ] 2.2 第12章：首轮比试
  - 主角 vs 外门普通弟子
  - 轻松获胜但不暴露全部实力
  - 引起部分人关注
  
- [ ] 2.3 第13章：遇见云长老
  - 比试后独自修炼
  - 云长老出现并看出主角不凡
  - 提出指点，埋下身份伏笔
  
- [ ] 2.4 第14章：特训开始
  - 云长老指点修炼要诀
  - 主角修炼破云手
  - 实力稳步提升
  
- [ ] 2.5 第15章：第二轮比试
  - 主角 vs 炼气7层对手
  - 运用新学技能
  - 战斗中突破到炼气8层
  
- [ ] 2.6 第16章：对手视角（李剑）
  - 切换到李剑视角
  - 展现李剑的实力和内心
  - 对主角产生兴趣
  
- [ ] 2.7 第17章：半决赛
  - 主角 vs 强敌
  - 陷入苦战
  - 暗示宗门内部有人针对主角
  
- [ ] 2.8 第18章：险境突破
  - 绝境中领悟破云手精髓
  - 反败为胜
  - 获得观众认可
  
- [ ] 2.9 第19章：决赛开始
  - 主角 vs 李剑
  - 激烈交战
  - 比试中突破到炼气9层
  
- [ ] 2.10 第20章：宗门大比落幕
  - 主角获胜或惜败（根据后续规划）
  - 获得奖励（进入藏经阁）
  - 引出更大世界观

## 3. 验证

- [ ] 3.1 一致性检查
  - 角色行为符合设定
  - 魔法使用符合规则
  - 时间线无冲突
  
- [ ] 3.2 伏笔记录
  - 记录云长老身份伏笔
  - 记录宗门矛盾伏笔
  - 记录第二卷引子
```

**文件 4: `specs/outline/spec.md`**（大纲增量）

```markdown
## ADDED Requirements

### Requirement: 第11章 - 宗门大比开幕
[完整规格，见前文示例]

### Requirement: 第12章 - 初战告捷
[完整规格，见前文示例]

...（第13-20章规格）
```

**文件 5: `specs/characters/li-jian/spec.md`**（新角色规格）

```markdown
## Purpose
外门天才李剑的完整规格定义。

## Requirements

### Requirement: 基础设定
李剑应该（SHALL）是外门公认的天才。

#### Scenario: 身份信息
- **WHEN** 李剑登场或被提及
- **THEN** 姓名：李剑
- **THEN** 年龄：22岁
- **THEN** 修为：炼气8层
- **THEN** 性格：骄傲但不傻，有原则
- **THEN** 地位：外门第一天才

### Requirement: 行为模式
李剑应该（SHALL）展现一致的行为模式。

#### Scenario: 面对挑战时
- **WHEN** 有人挑战李剑
- **THEN** 接受挑战但不轻敌
- **THEN** 全力以赴
- **THEN** 胜不骄败不馁

#### Scenario: 面对失败时
- **WHEN** 李剑失败（如被主角击败）
- **THEN** 承认对手实力
- **THEN** 反思自身不足
- **THEN** 不记恨，反而尊重对手
```

#### Stage 2: 验证提案

```bash
# 运行验证命令
novelspec validate add-chapter-11-20 --strict

# 系统检查项
检查项：
✓ proposal.md 格式正确，包含 Why/What/Impact 三部分
✓ design.md 包含 Context、Goals、Technical Decisions
✓ tasks.md 使用任务清单格式，包含规格更新、章节创作、验证
✓ specs/outline/spec.md 使用 ADDED 格式添加新章节
✓ specs/characters/li-jian/spec.md 格式正确
✓ 所有 Requirements 包含至少一个 Scenario
✓ 所有 Scenario 使用 `#### Scenario:` 格式（4个#）
✓ 使用 SHALL/MUST 关键词明确约束强度
✗ specs/characters/li-jian/spec.md 缺少"对话风格"Requirement

# AI 收到反馈后补充
→ AI 补充"对话风格"Requirement
→ 重新验证
✓ 全部检查通过
```

#### Stage 3: 执行创作

```bash
# AI 通过 /novelspec-apply 命令执行创作

# AI 读取上下文（按优先级）
1. novelspec/project.md（最高约束：创作原则、风格指南）
2. novelspec/specs/characters/protagonist/spec.md（主角设定）
3. novelspec/specs/characters/heroine/spec.md（女主设定，如相关）
4. novelspec/specs/worldbuilding/magic-system/spec.md（魔法体系）
5. novelspec/specs/outline/spec.md（已有大纲）
6. novelspec/changes/add-chapter-11-20/（本次任务）
   - proposal.md（理解意图）
   - design.md（技术方案）
   - tasks.md（执行清单）
   - specs/（增量规格）

# AI 执行 tasks.md
Task 1.1: 更新主角规格
→ 在 changes/add-chapter-11-20/specs/characters/protagonist/spec.md
  使用 MODIFIED Requirements 格式
  完整复制原 Requirement 并修改等级和技能

Task 2.1: 创作第11章
→ 基于所有规格生成 chapters/volume-2/chapter-011.md
→ 内容包括：
  - 遵守 project.md 的风格指南（3000-4000字，现代白话）
  - 主角行为符合 protagonist/spec.md
  - 魔法使用符合 magic-system/spec.md
  - 情节符合 outline/spec.md 的第11章 Requirement
→ 自动运行 novelspec validate add-chapter-11-20
→ 如有错误，修正后继续

Task 2.2-2.10: 依次创作第12-20章
→ 每完成一章验证一次
→ 确保连贯性
```

**AI 生成的第11章示例**：

```markdown
# 第11章 宗门大比开幕

青云宗外门广场上人头攒动。

陈凡站在人群后方，目光扫过高台上的几位内门长老。三年一度的宗门大比，今日终于拉开帷幕。

"此次大比，前三名可进入藏经阁挑选一门功法。"主持长老的声音清晰传遍全场。

藏经阁。陈凡眼神一凝。

那里收藏着宗门珍贵的功法秘籍，平日里外门弟子根本无法接近。若能进去，或许能找到更适合玄元诀的配套技能。

"陈师弟也要参加？"

身旁传来熟悉的声音。陈凡转头，看到同门师兄张云。

"嗯，想试试。"陈凡平静回答。

张云苦笑："我就算了，炼气三层参加就是送人头。不过陈师弟你炼气七层，倒是有些机会。"

炼气七层。这是陈凡对外宣称的修为。实际上，经过这段时间的签到和修炼，他已经稳固在炼气七层巅峰，随时可能突破。

但他不会说出来。

"李剑也报名了。"张云压低声音，"外门第一天才，炼气八层，几乎没人是他对手。"

陈凡顺着张云的目光看去。

人群前方，一名青衣青年独自而立，周围无人敢靠近。青年面容英俊，目光锐利如剑，身上隐隐透出一股凌厉气势。

李剑。

陈凡默默记下这个名字。炼气八层，确实很强。但若只是如此，倒也不是没有一战之力。

"所有参赛弟子，按修为高低分组..."

随着长老的声音响起，宗门大比正式开始。
```

**validate 自动检查**：

```bash
✓ 字数：约3200字，符合 project.md 的3000-4000字要求
✓ 语言风格：现代白话，简洁明快，无网络用语
✓ 主角行为：冷静观察、谨慎隐藏实力，符合 protagonist/spec.md
✓ 对话风格：简洁有物，符合设定
✓ 情节：符合 outline/spec.md 第11章 Requirement
✓ 无未定义设定（李剑已在规格中定义）
```

#### Stage 4: 持续验证

```bash
# AI 每完成一章自动验证
novelspec validate add-chapter-11-20

# 验证维度示例（第12章）
检查项：
✓ 第12章主角行为符合 specs/characters/protagonist/spec.md
  - 面对危险时保持冷静 ✓
  - 不轻易暴露全部实力 ✓
  
✓ 第12章魔法描写符合 specs/worldbuilding/magic-system/spec.md
  - 使用玄元诀 ✓
  - 使用风雷步 ✓
  
✓ 第12章情节符合 changes/.../specs/outline/spec.md 第12章规格
  - 对手是炼气6层外门弟子 ✓
  - 主角隐藏实力 ✓
  - 险胜 ✓
  
✗ 第12章出现了未定义的"破虚剑法"
  → 违反规则：specs/worldbuilding/magic-system/spec.md 中无此技能
  → AI 收到反馈，选择：
    a) 修改第12章，改用已定义技能（玄元诀或风雷步）
    b) 更新 magic-system/spec.md 添加"破虚剑法"定义
    
# AI 选择方案 a，修改第12章
→ 重新验证
✓ 全部通过
```

#### Stage 5: 归档变更

```bash
# 所有任务完成后归档
novelspec archive add-chapter-11-20

# 系统自动执行合并操作

# 1. 合并大纲增量
合并 changes/add-chapter-11-20/specs/outline/spec.md
  → specs/outline/spec.md
  
操作：
- 将 ADDED Requirements（第11-20章）追加到 specs/outline/spec.md
- 如有 MODIFIED Requirements，替换对应内容
- 如有 REMOVED Requirements，删除对应内容

# 2. 合并主角规格更新
合并 changes/add-chapter-11-20/specs/characters/protagonist/spec.md
  → specs/characters/protagonist/spec.md
  
操作：
- 找到 MODIFIED 的 Requirement（如"能力成长"）
- 完整替换原 Requirement

# 3. 新增角色规格
新增 specs/characters/li-jian/spec.md
新增 specs/characters/yun-elder/spec.md

操作：
- 从 changes/.../specs/characters/ 复制到 specs/characters/
- 移除 ADDED 标记，成为正式规格

# 4. 更新魔法体系（如有）
更新 specs/worldbuilding/magic-system/spec.md

操作：
- 合并新增的技能定义

# 5. 移动到归档
移动 changes/add-chapter-11-20/
  → changes/archive/2025-01-22-add-chapter-11-20/

操作：
- 完整保留 proposal.md、design.md、tasks.md
- 完整保留 specs/ 增量（作为历史记录）
- 添加归档日期前缀

# 结果
归档完成后：
✓ specs/ 成为新的唯一真相，包含第1-20章完整大纲
✓ specs/characters/ 包含所有已登场角色的最新规格
✓ archive/ 保留完整变更历史和意图（proposal.md）
✓ AI 下次创作第21章时，读取最新 specs/ 作为上下文
```

**归档后的 `specs/outline/spec.md`**（部分）：

```markdown
# novelspec/specs/outline/spec.md

## Purpose
故事大纲的已确定部分，AI 推进情节的依据。

## Requirements

### Requirement: 第1章 - 穿越觉醒
[原有内容]

### Requirement: 第2章 - 初探系统
[原有内容]

...

### Requirement: 第10章 - 外门试炼
[原有内容]

### Requirement: 第11章 - 宗门大比开幕
第11章应该（SHALL）开启宗门大比篇章。

#### Scenario: 大比开幕
- **WHEN** 第11章开始
- **THEN** 宗门宣布三年一度大比
- **THEN** 介绍奖励（进入藏经阁）
- **THEN** 主角决定参加
- **THEN** 引出对手李剑

### Requirement: 第12章 - 初战告捷
[完整规格]

...

### Requirement: 第20章 - 宗门大比落幕
[完整规格]
```

---

## 三、功能需求

### 3.1 CLI 命令

Novel-Writer-OpenSpec 使用独立的 `novelspec` 命令，避免与 OpenSpec 冲突：

```bash
# 项目管理
novelspec init <project-name>        # 初始化小说项目
novelspec init <project-name> --here # 在当前目录初始化

# 变更管理
novelspec list                       # 列出活跃变更（待创作章节）
novelspec list --archive             # 列出已归档变更
novelspec show <change-id>           # 查看变更详情
novelspec validate <change-id>       # 验证变更一致性
novelspec validate <change-id> --strict  # 严格验证
novelspec archive <change-id>        # 归档完成的变更

# 规格管理
novelspec list --specs               # 列出已确定规格
novelspec show <spec-id> --type spec # 查看规格详情

# 辅助功能
novelspec check                      # 检查项目配置
novelspec version                    # 查看版本信息
novelspec help                       # 查看帮助
```

**与 OpenSpec 的区别**：

| 功能 | OpenSpec | Novel-Writer-OpenSpec |
|------|----------|----------------------|
| 命令前缀 | `openspec` | `novelspec` |
| 目录名称 | `openspec/` | `novelspec/` |
| 初始化 | `openspec init` | `novelspec init <project-name>` |
| 验证 | `openspec validate <change>` | `novelspec validate <change>` |

### 3.2 AI 助手集成

支持主流 AI 工具的斜杠命令：

| AI 工具 | 命令格式 | 配置位置 |
|---------|---------|---------|
| **Claude Code** | `/novelspec-proposal`, `/novelspec-apply`, `/novelspec-archive` | `.claude/commands/` |
| **Cursor** | `/novelspec-proposal`, `/novelspec-apply`, `/novelspec-archive` | `.cursor/commands/` |
| **Windsurf** | `/novelspec-proposal`, `/novelspec-apply`, `/novelspec-archive` | `.windsurf/workflows/` |
| **Gemini CLI** | `/novel/proposal`, `/novel/apply`, `/novel/archive` | `.gemini/commands/*.toml` |
| **其他** | 参考 `novelspec/AGENTS.md` 指令 | `novelspec/AGENTS.md` |

**AI 助手命令说明**：

#### `/novelspec-proposal`（创建提案）
```
使用场景：人类想要创作新章节或扩展设定

AI 执行：
1. 创建 changes/<change-id>/ 目录
2. 生成 proposal.md（询问人类意图）
3. 生成 design.md（技术方案）
4. 生成 tasks.md（任务清单）
5. 生成 specs/ 增量（ADDED/MODIFIED）
6. 运行 novelspec validate 检查

输出：
- 完整的变更提案结构
- 验证结果和修改建议
```

#### `/novelspec-apply`（执行创作）
```
使用场景：提案验证通过，开始执行创作

AI 执行：
1. 读取 novelspec/project.md（创作原则）
2. 读取 novelspec/specs/（当前真相）
3. 读取 changes/<change-id>/（本次任务）
4. 按 tasks.md 顺序执行
5. 生成章节内容到 chapters/
6. 每完成一章运行 validate
7. 标记完成的任务为 [x]

输出：
- 章节内容文件
- 持续验证反馈
- 完成进度更新
```

#### `/novelspec-archive`（归档变更）
```
使用场景：所有任务完成，归档变更

AI 执行：
1. 检查 tasks.md 是否全部完成
2. 运行最终 validate
3. 调用 novelspec archive <change-id>
4. 系统自动合并 delta 到 specs/
5. 移动到 archive/

输出：
- 归档成功确认
- specs/ 更新摘要
- 下一步建议
```

### 3.3 验证规则

`novelspec validate` 执行三级验证：

#### 3.3.1 格式验证（Format Validation）

检查文件结构和语法：

```yaml
proposal.md:
  - 必须包含：Why, What Changes, Impact
  - Why: 至少1句话说明原因
  - What Changes: 使用列表格式
  - Impact: 标注影响的规格

design.md:
  - 可选文件
  - 如果存在，必须包含：Context, Goals, Technical Decisions
  
tasks.md:
  - 必须使用任务清单格式：- [ ] 或 - [x]
  - 任务描述清晰
  - 至少包含：规格更新、章节创作

spec.md:
  - 必须使用 Requirements + Scenarios 格式
  - 每个 Requirement 至少一个 Scenario
  - Scenario 必须使用 #### Scenario: 格式（4个#）
  - 必须使用 SHALL/MUST/MAY 关键词

delta spec.md:
  - 必须使用 ADDED/MODIFIED/REMOVED 标记
  - MODIFIED 必须包含完整 Requirement 内容
```

#### 3.3.2 语义验证（Semantic Validation）

检查内容合理性：

```yaml
角色一致性:
  - 角色行为符合 specs/characters/<name>/spec.md 定义
  - 对话风格符合角色设定
  - 修为等级变化合理（不能跳跃式突破）

世界观一致性:
  - 魔法使用符合 specs/worldbuilding/magic-system/spec.md
  - 地理描写符合 specs/worldbuilding/geography/spec.md
  - 势力关系符合 specs/worldbuilding/factions/spec.md

情节一致性:
  - 章节内容符合 specs/outline/spec.md 定义
  - 情节发展有因果逻辑
  - 不出现未定义的角色、地点、技能

引用完整性:
  - 提及的角色在 specs/characters/ 中有定义
  - 使用的技能在 specs/worldbuilding/magic-system/ 中有定义
  - 提及的地点在 specs/worldbuilding/geography/ 中有定义
```

#### 3.3.3 跨章节验证（Cross-Chapter Validation）

检查连贯性：

```yaml
时间线一致性:
  - 章节间时间顺序合理
  - 无时间跳跃矛盾
  - 角色年龄增长符合时间线

角色状态一致性:
  - 修为等级变化可追溯
  - 伤势恢复符合逻辑
  - 关系发展有过程

伏笔管理:
  - 记录埋下的伏笔
  - 检查伏笔回收
  - 警告长期未回收的伏笔
```

**验证输出示例**：

```bash
$ novelspec validate add-chapter-11-20 --strict

格式验证：
✓ proposal.md 包含 Why/What/Impact
✓ design.md 包含 Context/Goals/Technical Decisions
✓ tasks.md 使用任务清单格式
✓ specs/outline/spec.md 使用 ADDED 格式
✓ specs/characters/li-jian/spec.md 格式正确
✓ 所有 Scenario 使用 #### Scenario: 格式
✓ 使用 SHALL/MUST 关键词

语义验证：
✓ 第11章主角行为符合 protagonist/spec.md
✓ 第12章魔法使用符合 magic-system/spec.md
✗ 第13章出现未定义角色"云长老"
  → 需要创建 specs/characters/yun-elder/spec.md
✓ 第14-20章情节符合 outline 规格

跨章节验证：
✓ 时间线连贯（第11-20章跨度约15天）
✓ 主角修为变化合理（7层→9层，有突破契机）
⚠ 第13章埋下云长老身份伏笔，未回收
  → 建议在 design.md 注明回收计划

验证结果：1个错误，1个警告
请修复错误后重新验证。
```

### 3.4 模板系统

项目初始化时提供小说专用模板：

```
novelspec-templates/
├── project.md.template           # 项目约定模板
├── AGENTS.md.template            # AI 助手指令模板
│
├── characters/
│   └── _template/
│       └── spec.md.template     # 角色规格模板
│
├── worldbuilding/
│   ├── magic-system/
│   │   └── spec.md.template     # 魔法体系模板
│   ├── geography/
│   │   └── spec.md.template     # 地理设定模板
│   └── factions/
│       └── spec.md.template     # 势力组织模板
│
└── outline/
    └── spec.md.template         # 大纲模板
```

**`project.md.template`**：

```markdown
# novelspec/project.md

## 项目信息
- 小说名称：{{NOVEL_NAME}}
- 类型：{{GENRE}}（玄幻/武侠/都市/科幻/其他）
- 目标字数：{{TARGET_WORDS}}万字
- 预计卷数：{{VOLUMES}}卷

## 创作原则

本项目遵循以下核心创作原则（AI 必须严格遵守）：

1. **逻辑自洽**：世界观设定一旦确立，必须保持一致
2. **角色一致性**：角色行为必须符合性格设定和成长轨迹
3. **情节合理性**：情节发展需有因果逻辑
4. **文风统一**：保持统一的叙事风格

## 风格指南

- **叙事视角**：{{POV}}（第一人称/第三人称限制视角/全知视角）
- **语言风格**：{{LANGUAGE_STYLE}}
- **章节长度**：{{CHAPTER_LENGTH}}字/章
- **更新频率**：{{UPDATE_FREQUENCY}}

## 质量标准

- 每章必须推进情节或深化角色
- 对话符合角色身份和性格
- 描写要有画面感

## 禁忌事项

- ❌ 不得随意改变核心设定
- ❌ 不得让角色 OOC
- ❌ 不得出现未定义的设定
```

**`characters/_template/spec.md.template`**：

```markdown
# novelspec/specs/characters/{{CHARACTER_ID}}/spec.md

## Purpose
{{CHARACTER_NAME}}的完整规格定义。

## Requirements

### Requirement: 基础设定
{{CHARACTER_NAME}}应该（SHALL）具有明确的身份背景。

#### Scenario: 身份信息
- **WHEN** {{CHARACTER_NAME}}登场或被提及
- **THEN** 姓名：{{CHARACTER_NAME}}
- **THEN** 年龄：{{AGE}}
- **THEN** 性格：{{PERSONALITY}}
- **THEN** 特点：{{TRAITS}}

### Requirement: 行为模式
{{CHARACTER_NAME}}在不同情境下应该（SHALL）展现一致的行为模式。

#### Scenario: 面对危险时
- **WHEN** 遇到威胁
- **THEN** {{BEHAVIOR_PATTERN}}

### Requirement: 对话风格
{{CHARACTER_NAME}}的对话应该（SHALL）符合其身份。

#### Scenario: 日常对话
- **WHEN** 日常交流
- **THEN** {{DIALOGUE_STYLE}}
```

---

## 四、技术实现

### 4.1 技术架构

```
┌─────────────────────────────────────────────┐
│           用户界面（CLI + AI 助手）              │
├─────────────────────────────────────────────┤
│              命令层（Commands）                │
│  ┌──────────┬──────────┬──────────┐        │
│  │  init    │ validate │ archive  │        │
│  └──────────┴──────────┴──────────┘        │
├─────────────────────────────────────────────┤
│              核心层（Core）                    │
│  ┌──────────┬──────────┬──────────┐        │
│  │ Parser   │Validator │ Archiver │        │
│  └──────────┴──────────┴──────────┘        │
├─────────────────────────────────────────────┤
│            工具层（Utils）                     │
│  ┌──────────┬──────────┬──────────┐        │
│  │ FileOps  │  Logger  │ Template │        │
│  └──────────┴──────────┴──────────┘        │
└─────────────────────────────────────────────┘
```

### 4.2 核心模块设计

#### 4.2.1 Parser（解析器）

```typescript
/**
 * 解析规格文件
 */
class SpecParser {
  /**
   * 解析 spec.md 文件，提取 Requirements 和 Scenarios
   */
  parseSpec(filePath: string): Spec {
    // 读取文件内容
    // 提取 Requirements（### Requirement:）
    // 提取 Scenarios（#### Scenario:）
    // 提取关键词（SHALL/MUST/MAY）
    // 返回结构化对象
  }

  /**
   * 解析 delta spec（变更增量）
   */
  parseDelta(filePath: string): Delta {
    // 识别 ADDED/MODIFIED/REMOVED
    // 提取对应的 Requirements
    // 返回变更对象
  }

  /**
   * 解析 proposal.md
   */
  parseProposal(filePath: string): Proposal {
    // 提取 Why/What/Impact
    // 返回提案对象
  }
}
```

#### 4.2.2 Validator（验证器）

```typescript
/**
 * 验证规格和变更
 */
class NovelValidator {
  /**
   * 格式验证
   */
  validateFormat(change: Change): ValidationResult {
    // 检查 proposal.md 格式
    // 检查 tasks.md 格式
    // 检查 spec.md Requirements + Scenarios 格式
    // 检查 SHALL/MUST 关键词使用
  }

  /**
   * 语义验证（小说专用）
   */
  validateSemantics(change: Change, specs: Specs): ValidationResult {
    // 检查角色行为一致性
    // 检查世界观设定一致性
    // 检查情节逻辑
    // 检查引用完整性（无未定义的角色/技能/地点）
  }

  /**
   * 跨章节验证
   */
  validateCrossChapter(chapters: Chapter[]): ValidationResult {
    // 检查时间线一致性
    // 检查角色状态变化合理性
    // 检查伏笔管理
  }

  /**
   * 严格验证（所有检查）
   */
  validateStrict(change: Change, specs: Specs): ValidationResult {
    // 执行所有验证
    // 返回综合结果
  }
}
```

#### 4.2.3 Archiver（归档器）

```typescript
/**
 * 归档变更，合并到 specs/
 */
class ChangeArchiver {
  /**
   * 归档变更
   */
  archive(changeId: string): ArchiveResult {
    // 1. 读取 change delta
    // 2. 应用到 specs/
    //    - ADDED: 追加新 Requirements
    //    - MODIFIED: 替换对应 Requirements
    //    - REMOVED: 删除对应 Requirements
    // 3. 移动 change 到 archive/
    // 4. 添加日期前缀
  }

  /**
   * 合并 delta 到 spec
   */
  private mergeDelta(delta: Delta, spec: Spec): Spec {
    // 处理 ADDED Requirements
    // 处理 MODIFIED Requirements（完整替换）
    // 处理 REMOVED Requirements
    // 返回更新后的 spec
  }
}
```

### 4.3 文件操作

```typescript
/**
 * 文件和目录操作工具
 */
class FileOperations {
  /**
   * 读取规格文件
   */
  readSpec(path: string): string {
    // 读取文件内容
  }

  /**
   * 写入规格文件
   */
  writeSpec(path: string, content: string): void {
    // 写入文件
  }

  /**
   * 移动目录（归档）
   */
  moveDirectory(from: string, to: string): void {
    // 移动目录
  }

  /**
   * 复制模板
   */
  copyTemplate(template: string, dest: string, vars: object): void {
    // 复制模板并替换变量
  }
}
```

### 4.4 AI 提效机制总结

| 机制 | 技术实现 | AI 提效效果 |
|------|---------|-----------|
| **上下文隔离** | `specs/`（真相）vs `changes/`（任务）分离 | AI 明确知道"已有"和"待做"，理解成本降低 50% |
| **意图明确** | `proposal.md` 说明变更原因 | AI 理解"为什么"，减少偏离规格 |
| **格式严格** | Requirements + Scenarios 固定格式 | AI 可自动解析和验证，准确率提升 |
| **增量管理** | ADDED/MODIFIED/REMOVED 明确标记 | AI 精确理解变更范围，避免遗漏或覆盖 |
| **自动验证** | `novelspec validate` 即时反馈 | AI 立即纠错，验证效率提升 10 倍 |
| **真相更新** | archive 后 `specs/` 唯一准确 | AI 下次基于准确状态，减少错误累积 |

---

## 五、实施路线图

### Phase 1: MVP（最小可行产品）

**目标**：验证核心理念，完成基础功能

**功能清单**：
- [ ] `novelspec init` 命令（项目初始化）
- [ ] 小说项目模板（project.md, 基础 specs/ 结构）
- [ ] `novelspec validate` 命令（格式验证）
- [ ] AI 助手指令（AGENTS.md）
- [ ] 基础文档（README, workflow-guide）

**成功标准**：
- 能够初始化一个小说项目
- 能够验证 proposal 和 spec 格式
- AI 可以使用 `/novelspec-proposal` 创建提案

**预计时间**：2-3 周

### Phase 2: 核心功能

**目标**：完善验证和归档功能

**功能清单**：
- [ ] 语义验证器（角色、世界观、情节一致性）
- [ ] `novelspec archive` 命令（变更归档）
- [ ] 完善模板（character, worldbuilding, outline）
- [ ] `/novelspec-apply` 和 `/novelspec-archive` AI 命令
- [ ] 详细文档和示例

**成功标准**：
- validate 能捕获常见错误（人设崩塌、设定冲突）
- archive 能正确合并 delta 到 specs/
- 能够用完整工作流创作 10 万字小说

**预计时间**：3-4 周

### Phase 3: 增强功能

**目标**：提升用户体验和功能完整性

**功能清单**：
- [ ] 跨章节验证（时间线、伏笔追踪）
- [ ] `novelspec list --stats` 统计信息
- [ ] `novelspec check` 健康检查
- [ ] 导出功能（生成 EPUB/PDF）
- [ ] 错误提示优化

**成功标准**：
- 能够追踪伏笔和时间线
- 用户体验流畅，错误提示友好
- 支持导出为电子书格式

**预计时间**：2-3 周

### Phase 4: 生态建设

**目标**：扩展工具链和社区

**功能清单**：
- [ ] VS Code 扩展（语法高亮、实时验证）
- [ ] Web 界面（可视化管理 specs 和 changes）
- [ ] 社区模板库（不同类型小说模板）
- [ ] 最佳实践文档

**成功标准**：
- 有 VS Code 扩展可用
- 有社区贡献的模板
- 有成功案例和最佳实践

**预计时间**：持续进行

---

## 六、成功标准

### 6.1 功能完整性

- [x] **项目初始化**
  - `novelspec init <project-name>` 可以创建完整项目结构
  - 包含 project.md, AGENTS.md, 基础 specs/ 模板
  
- [ ] **变更管理**
  - AI 可以创建结构化提案（proposal, design, tasks, specs）
  - `novelspec validate` 能捕获格式和语义错误
  - `novelspec archive` 能正确合并和归档
  
- [ ] **AI 集成**
  - 支持主流 AI 工具的斜杠命令
  - AI 可以高效使用完整工作流

### 6.2 质量标准

- [ ] **验证准确性**
  - 格式验证：100% 准确识别格式错误
  - 语义验证：捕获 ≥80% 常见错误（人设崩塌、设定冲突）
  - 误报率：≤5%
  
- [ ] **数据一致性**
  - `specs/` 始终是唯一准确的真相
  - `archive/` 完整保留历史和意图
  - 无数据丢失或损坏
  
- [ ] **文档质量**
  - README 清晰完整
  - Workflow guide 有详细示例
  - API 文档准确

### 6.3 可用性

- [ ] **易用性**
  - 新用户 15 分钟内完成首次创建提案
  - 命令简洁直观，无需记忆复杂参数
  - 错误提示友好，提供解决方案
  
- [ ] **性能**
  - `validate` 命令在 < 5 秒内完成
  - `archive` 命令在 < 3 秒内完成
  - 支持 100 万字项目无性能问题
  
- [ ] **兼容性**
  - 支持 macOS/Linux/Windows
  - 支持 Node.js ≥ 18.0.0
  - 支持主流 AI 工具（Claude, Cursor, Windsurf, Gemini）

### 6.4 实际验证

**验证方式**：使用 Novel-Writer-OpenSpec 创作一部 10 万字小说

**验证指标**：
- [ ] AI 理解准确率：≥ 90%（生成内容符合规格）
- [ ] 一致性错误率：≤ 5%（人设崩塌、设定冲突）
- [ ] 创作速度：相比传统方式提升 ≥ 30%
- [ ] 验证效率：相比人工检查提升 ≥ 10 倍
- [ ] 用户满意度：≥ 4/5 星

---

## 七、风险与挑战

### 7.1 技术风险

| 风险 | 影响 | 应对措施 |
|------|------|---------|
| 验证器误报率高 | 用户体验差，不信任工具 | 持续优化验证规则，提供误报反馈机制 |
| 归档合并出错 | 数据损坏，用户损失 | 归档前备份，提供回滚功能 |
| 性能问题 | 大项目卡顿 | 增量解析，缓存机制 |

### 7.2 用户风险

| 风险 | 影响 | 应对措施 |
|------|------|---------|
| 学习曲线陡峭 | 用户放弃使用 | 提供详细文档、视频教程、示例项目 |
| 对 Requirements 格式不熟悉 | 写错格式，验证失败 | 提供模板，AI 辅助生成 |
| 不理解 specs/changes 概念 | 用错目录，混淆真相和提案 | 清晰文档说明，工具自动检查 |

### 7.3 方法论风险

| 风险 | 影响 | 应对措施 |
|------|------|---------|
| 过于严格限制创作自由 | 用户觉得束缚 | 强调方法论是工具而非枷锁，可灵活调整 |
| OpenSpec 方法论不适合小说 | 核心假设错误 | 通过实际验证调整，必要时改进方法论 |
| AI 不理解 specs 格式 | 提效失败 | 优化 prompt，提供 AI 训练数据 |

---

## 八、附录

### 8.1 术语表

| 术语 | 说明 |
|------|------|
| **novelspec** | 本工具的命令前缀和目录名称 |
| **specs/** | 已确定的小说规格（唯一真相） |
| **changes/** | 待创作的变更提案 |
| **Requirement** | 规格中的需求项，使用 SHALL/MUST 表达 |
| **Scenario** | 需求的可验证场景，使用 WHEN/THEN 格式 |
| **Delta** | 变更增量，使用 ADDED/MODIFIED/REMOVED 标记 |
| **Proposal** | 变更提案，说明 Why/What/Impact |
| **Archive** | 已完成变更的归档 |

### 8.2 示例项目

完整示例项目结构（《星辰之梦》玄幻小说）：

```
star-dream-novel/
├── novelspec/
│   ├── project.md
│   ├── AGENTS.md
│   ├── specs/
│   │   ├── characters/
│   │   │   ├── protagonist/spec.md      # 陈凡
│   │   │   ├── heroine/spec.md          # 林曦
│   │   │   └── supporting/
│   │   │       ├── mentor/spec.md       # 云长老
│   │   │       └── villain/spec.md      # 李剑
│   │   ├── worldbuilding/
│   │   │   ├── magic-system/spec.md     # 修炼体系
│   │   │   ├── geography/spec.md        # 青云宗地理
│   │   │   └── factions/spec.md         # 宗门势力
│   │   └── outline/spec.md              # 第1-20章大纲
│   └── changes/
│       ├── add-chapter-21-30/           # 活跃变更
│       └── archive/
│           ├── 2025-01-20-add-chapter-1-10/
│           └── 2025-01-22-add-chapter-11-20/
├── chapters/
│   ├── volume-1/
│   │   ├── chapter-001.md (3,200字)
│   │   ├── chapter-002.md (3,500字)
│   │   └── ... (至 chapter-020.md)
│   └── volume-2/
│       └── chapter-021.md (进行中)
└── docs/
    ├── PRD.md
    └── workflow-guide.md
```

### 8.3 参考资料

- **OpenSpec 官方文档**：https://github.com/Fission-AI/OpenSpec
- **Novel-Writer 项目**：github.com/wordflowlab/novel-writer（参考对比）
- **Spec-Kit 方法论**：OpenSpec 的前身，理念类似

### 8.4 更新日志

| 版本 | 日期 | 变更内容 |
|------|------|---------|
| 1.0 | 2025-01-22 | 初始版本，定义核心功能和架构 |

---

**文档结束**

