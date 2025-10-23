/**
 * 章节大纲规格模板
 */
export const chapterTemplate = (context: {
  chapterNumber: number;
  chapterTitle: string;
  purpose: string; // 推进情节/塑造角色/展现世界观
}) => `### Requirement: 第${context.chapterNumber}章 - ${context.chapterTitle}
第${context.chapterNumber}章应该（SHALL）${context.purpose}。

#### Scenario: 章节开篇
- **WHEN** 第${context.chapterNumber}章开始
- **THEN** [待补充开场场景，如：时间、地点、出场角色]
- **THEN** [待补充开场氛围或状态]
- **THEN** [待补充引出本章主要事件的契机]

#### Scenario: 主要情节
- **WHEN** 第${context.chapterNumber}章进行中
- **THEN** [待补充第一个情节点]
- **THEN** [待补充第二个情节点]
- **THEN** [待补充第三个情节点]
- **THEN** [待补充冲突或高潮]

#### Scenario: 角色表现
- **WHEN** 第${context.chapterNumber}章中
- **THEN** 主要角色：[待补充涉及哪些角色]
- **THEN** 角色行为：[待补充关键角色的行为]
- **THEN** 角色状态：[待补充角色在本章的状态变化]
- **THEN** 关系变化：[待补充角色关系的变化]

#### Scenario: 章节结尾
- **WHEN** 第${context.chapterNumber}章结束
- **THEN** [待补充结尾场景或状态]
- **THEN** [待补充达成的目标或效果]
- **THEN** [待补充留下的悬念或引子（如有）]
- **THEN** [待补充为下一章的铺垫]

#### Scenario: 伏笔管理（如有）
- **WHEN** 第${context.chapterNumber}章涉及伏笔
- **THEN** 埋下伏笔：[待补充本章埋下的伏笔]
- **THEN** 回收伏笔：[待补充本章回收的伏笔]
- **THEN** 预期回收：[待补充埋下的伏笔计划在哪章回收]
`;

export const getChapterTemplate = (chapterNumber: number, chapterTitle: string, purpose: string) => {
  return chapterTemplate({ chapterNumber, chapterTitle, purpose });
};

/**
 * 完整大纲模板（包含多章）
 */
export const outlineTemplate = () => `# novelspec/specs/outline/spec.md

## Purpose
故事大纲的已确定部分，AI 推进情节的依据。

## Requirements

### Requirement: 整体规划
故事应该（SHALL）有清晰的整体规划。

#### Scenario: 卷数规划
- **WHEN** 规划整体故事
- **THEN** 总卷数：[待补充，如：4卷]
- **THEN** 总章节数：[待补充预计章节数]
- **THEN** 每卷主题：[待补充每卷的核心主题]

#### Scenario: 第一卷规划
- **WHEN** 第一卷
- **THEN** 卷名：[待补充第一卷卷名]
- **THEN** 章节范围：[待补充，如：第1-30章]
- **THEN** 核心目标：[待补充第一卷要达成的目标]
- **THEN** 结束状态：[待补充第一卷结束时的状态]

[在下方添加具体章节规格，使用章节模板]

## 创作指导

### 章节规划原则
1. **节奏控制**：合理安排高潮和舒缓章节
2. **信息密度**：每章包含适量的信息和情节
3. **连贯性**：章节间要有逻辑联系
4. **伏笔管理**：记录和追踪伏笔

### 每章标准长度
- 一般章节：[待补充，如：3000-4000字]
- 重要章节：[待补充，如：4000-5000字]
- 高潮章节：[待补充，如：5000-6000字]

### 章节功能分配
- **情节推进章**（60%）：主要推动剧情发展
- **角色塑造章**（25%）：深入刻画角色
- **世界观展现章**（10%）：扩展世界观设定
- **过渡章**（5%）：连接大情节，舒缓节奏

### 更新规划
当需要添加新章节时：
- 使用 \`## ADDED Requirements\` 在 \`changes/<id>/specs/outline/spec.md\` 中
- 使用章节模板创建新章节规格
- 确保与已有章节的连贯性
`;

export const getOutlineTemplate = () => outlineTemplate();
