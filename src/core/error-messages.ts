/**
 * 增强的验证错误消息生成器
 *
 * 提供友好的错误提示和具体的解决方案
 */

export interface EnhancedErrorMessage {
  message: string;
  suggestion: string;
  example?: string;
  documentationLink?: string;
}

/**
 * 小说创作常见错误的增强消息
 */
export class NovelErrorMessages {
  /**
   * 获取 proposal.md 相关的增强错误消息
   */
  static getProposalError(errorType: 'missing-why' | 'missing-what' | 'missing-impact'): EnhancedErrorMessage {
    const messages: Record<string, EnhancedErrorMessage> = {
      'missing-why': {
        message: '缺少 ## Why 章节 - 需要说明为什么要做这个变更',
        suggestion: `添加 ## Why 章节，说明创作意图。

对于章节创作，说明：
- 为什么要写这些章节？
- 这些章节在故事中的作用是什么？
- 推动了哪些情节或角色发展？

对于设定扩展，说明：
- 为什么需要这个设定？
- 这个设定对故事的影响是什么？`,
        example: `## Why
前10章完成了主角入门和基础修炼，第11-20章需要：
- 通过宗门大比展现主角实力和成长
- 推进主线剧情（获得高级功法和资源）
- 建立与核心配角的关系
- 为第二卷埋下伏笔`
      },
      'missing-what': {
        message: '缺少 ## What Changes 章节 - 需要列出具体的变更内容',
        suggestion: `添加 ## What Changes 章节，列出具体变更：

- 新增或修改的规格（角色、世界观、大纲）
- 新增的章节范围
- 影响的现有设定`,
        example: `## What Changes
- 新增第11-20章大纲规格
- 主角等级从炼气7层 → 炼气9层
- 新增配角规格：天才弟子李剑、神秘导师云长老
- 扩展魔法体系：增加高级技能描述（破云手）`
      },
      'missing-impact': {
        message: '缺少 ## Impact 章节 - 需要标注影响的规格范围',
        suggestion: `添加 ## Impact 章节，标注影响：

- 影响的规格文件（具体路径）
- 影响的章节文件
- 预计字数/工作量`,
        example: `## Impact
- **影响规格**：
  - specs/outline/spec.md（新增10章）
  - specs/characters/protagonist/spec.md（等级更新）
  - specs/characters/li-jian/spec.md（新增）
- **影响章节**：新增 chapters/volume-2/chapter-011.md 至 chapter-020.md
- **预计字数**：约 35,000 字（10章 × 3,500字/章）`
      }
    };

    return messages[errorType];
  }

  /**
   * 获取 tasks.md 相关的增强错误消息
   */
  static getTasksError(errorType: 'no-task-list' | 'incomplete-tasks'): EnhancedErrorMessage {
    const messages: Record<string, EnhancedErrorMessage> = {
      'no-task-list': {
        message: '缺少任务清单格式 - tasks.md 应该使用任务清单格式',
        suggestion: `使用 Markdown 任务清单格式：- [ ] 或 - [x]

任务清单应该包含三部分：
1. 规格更新任务（如更新角色、扩展世界观）
2. 章节创作任务（如创作第1-10章）
3. 验证任务（一致性检查、伏笔记录）`,
        example: `## 1. 规格更新

- [ ] 1.1 更新主角规格（specs/characters/protagonist/spec.md）
  - 等级：炼气7层 → 炼气9层
  - 新增技能：破云手

- [ ] 1.2 创建李剑角色规格（specs/characters/li-jian/spec.md）

## 2. 章节创作

- [ ] 2.1 第11章：宗门大比开幕
- [ ] 2.2 第12章：首轮比试
...

## 3. 验证

- [ ] 3.1 一致性检查
- [ ] 3.2 伏笔记录`
      },
      'incomplete-tasks': {
        message: '有未完成的任务 - 请完成所有任务后再归档',
        suggestion: `检查 tasks.md 中的所有任务：

- 确保所有任务都已完成（标记为 [x]）
- 如有无法完成的任务，说明原因并移除
- 验证所有章节文件已生成`
      }
    };

    return messages[errorType];
  }

  /**
   * 获取 spec 相关的增强错误消息
   */
  static getSpecError(errorType: 'no-delta-marker' | 'no-scenario' | 'invalid-format' | 'missing-keywords'): EnhancedErrorMessage {
    const messages: Record<string, EnhancedErrorMessage> = {
      'no-delta-marker': {
        message: 'Delta spec 缺少 ADDED/MODIFIED/REMOVED 标记',
        suggestion: `在 changes/<id>/specs/ 中的 spec.md 必须使用 delta 标记：

- ## ADDED Requirements - 新增的内容
- ## MODIFIED Requirements - 修改现有内容
- ## REMOVED Requirements - 删除的内容
- ## RENAMED Requirements - 重命名`,
        example: `## ADDED Requirements

### Requirement: 第11章 - 宗门大比开幕
第11章应该（SHALL）开启宗门大比篇章。

#### Scenario: 大比开幕
- **WHEN** 第11章开始
- **THEN** 宗门宣布三年一度大比
- **THEN** 介绍奖励：前三名进入藏经阁`
      },
      'no-scenario': {
        message: 'Requirement 缺少 Scenario - 每个需求必须至少有一个可验证的场景',
        suggestion: `为每个 Requirement 添加至少一个 Scenario：

Scenario 使用 WHEN/THEN 格式，使需求可验证。
对于小说创作，Scenario 描述具体的情节或行为。`,
        example: `### Requirement: 主角行为模式
主角应该（SHALL）展现一致的行为模式。

#### Scenario: 面对危险时
- **WHEN** 遇到生命威胁
- **THEN** 保持冷静，理性分析局势
- **THEN** 优先寻找逃生路线
- **THEN** 不轻易与强敌硬拼`
      },
      'invalid-format': {
        message: 'Scenario 格式不正确 - 必须使用 #### Scenario: 格式（4个#）',
        suggestion: `正确的 Scenario 格式：

- 使用 #### Scenario: （4个井号）
- Scenario 名称要简洁清晰
- 使用 WHEN/THEN 格式描述条件和结果`,
        example: `❌ 错误：
### Scenario: 身份信息  （3个#，错误）
## Scenario: 身份信息   （2个#，错误）

✅ 正确：
#### Scenario: 身份信息  （4个#，正确）
- **WHEN** 主角出场或被提及
- **THEN** 姓名：陈凡
- **THEN** 年龄：25岁`
      },
      'missing-keywords': {
        message: '缺少规范性关键词 - Requirement 应该使用 SHALL/MUST/MAY',
        suggestion: `使用规范性关键词明确约束强度：

- SHALL/应该（SHALL）: 推荐做法，一般情况下遵守
- MUST/必须（MUST）: 强制要求，必须遵守
- MAY/可以（MAY）: 可选项，根据情况决定`,
        example: `✅ 正确示例：

### Requirement: 角色一致性
主角应该（SHALL）展现一致的行为模式。

### Requirement: 修炼体系
修炼体系必须（MUST）清晰且一致。

### Requirement: 特殊情节
在特殊情况下，可以（MAY）偏离常规设定。`
      }
    };

    return messages[errorType];
  }

  /**
   * 获取小说创作特定的错误消息
   */
  static getNovelSpecificError(errorType: 'character-ooc' | 'undefined-setting' | 'inconsistent-power' | 'missing-foreshadowing'): EnhancedErrorMessage {
    const messages: Record<string, EnhancedErrorMessage> = {
      'character-ooc': {
        message: '角色行为 OOC（人设崩塌） - 角色行为不符合性格设定',
        suggestion: `检查角色行为是否符合 specs/characters/<name>/spec.md 中的定义：

1. 对照"行为模式"部分，检查角色反应是否一致
2. 检查对话风格是否符合角色性格
3. 如果角色确实需要改变，在 changes/<id>/specs/ 中说明原因`,
        example: `如果主角性格是"理性、谨慎"，但突然变得"冲动、鲁莽"，
这就是 OOC。需要：

1. 要么修改章节内容，使行为符合设定
2. 要么在规格中说明主角成长/变化的契机`
      },
      'undefined-setting': {
        message: '出现未定义的设定 - 使用了 specs/ 中没有定义的角色/地点/技能',
        suggestion: `所有设定必须先在 specs/ 中定义再使用：

1. 检查 specs/characters/ - 所有角色是否已定义
2. 检查 specs/worldbuilding/ - 地点、技能是否已定义
3. 如需新增设定，在 changes/<id>/specs/ 中先定义`,
        example: `❌ 错误：
在章节中直接使用"破云手"技能，但 specs/worldbuilding/magic-system/spec.md 中没有定义

✅ 正确：
1. 先在 changes/add-chapter-11-20/specs/worldbuilding/magic-system/spec.md 中：

## ADDED Requirements
### Requirement: 破云手技能
...

2. 然后在章节中使用`
      },
      'inconsistent-power': {
        message: '战力体系前后矛盾 - 角色战力或修为描写不一致',
        suggestion: `检查战力设定是否符合 specs/worldbuilding/magic-system/spec.md：

1. 修为等级变化是否合理（不能跳跃式突破）
2. 战力差距是否符合体系规则
3. 越级战斗是否在限制范围内`,
        example: `❌ 常见错误：
- 炼气5层的主角轻松打败筑基期的对手（跨大境界，不合理）
- 主角一章内从炼气3层突破到炼气7层（过快，缺少铺垫）

✅ 合理设定：
- 主角炼气7层，借助特殊法宝勉强击败炼气9层对手（越2小层，有代价）
- 主角经过10章的积累，在特殊契机下突破到炼气6层（合理节奏）`
      },
      'missing-foreshadowing': {
        message: '缺少伏笔记录 - 重要伏笔需要在规格中记录',
        suggestion: `在 specs/outline/spec.md 中记录伏笔：

1. 在埋下伏笔的章节 Scenario 中标注
2. 注明计划在哪章回收
3. 回收时检查是否与埋笔时一致`,
        example: `### Requirement: 第13章 - 遇见云长老

#### Scenario: 伏笔管理
- **WHEN** 第13章
- **THEN** 埋下伏笔：云长老的真实身份（计划第30章揭晓）
- **THEN** 埋下伏笔：云长老为何关注主角（计划第25章揭晓）`
      }
    };

    return messages[errorType];
  }

  /**
   * 格式化错误消息供显示
   */
  static formatError(enhanced: EnhancedErrorMessage): string {
    let output = `📍 ${enhanced.message}\n\n`;
    output += `💡 解决方案：\n${enhanced.suggestion}\n`;

    if (enhanced.example) {
      output += `\n📝 示例：\n${enhanced.example}\n`;
    }

    if (enhanced.documentationLink) {
      output += `\n📚 参考文档：${enhanced.documentationLink}\n`;
    }

    return output;
  }
}
