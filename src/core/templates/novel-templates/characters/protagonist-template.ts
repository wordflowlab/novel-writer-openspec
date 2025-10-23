/**
 * 主角角色规格模板
 */
export const protagonistTemplate = (context: {
  name: string;
  age: string;
  personality: string;
  background?: string;
}) => `# novelspec/specs/characters/protagonist/spec.md

## Purpose
主角${context.name}的完整规格定义，AI 生成对话和行为的依据。

## Requirements

### Requirement: 基础设定
主角应该（SHALL）具有明确且一致的身份背景。

#### Scenario: 身份信息
- **WHEN** 主角出场或被提及
- **THEN** 姓名：${context.name}
- **THEN** 年龄：${context.age}
- **THEN** 性格：${context.personality}
- **THEN** 背景：${context.background || '[待补充主角背景故事]'}
- **THEN** 特点：[待补充主角显著特征，如外貌、口头禅等]

### Requirement: 能力成长
主角必须（MUST）经历可验证的成长轨迹。

#### Scenario: 初始状态（第1卷）
- **WHEN** 故事开始
- **THEN** 修为等级：[待补充，如：普通人/炼气初期]
- **THEN** 性格状态：[待补充，如：胆怯但善良]
- **THEN** 掌握技能：[待补充，如：无/基础剑法]
- **THEN** 关键关系：[待补充，如：与师父关系、与女主关系]

#### Scenario: 成长轨迹
- **WHEN** 第一卷结束
- **THEN** 修为等级：[待补充目标等级]
- **THEN** 性格变化：[待补充性格成长方向]
- **THEN** 新增技能：[待补充要学会的技能]
- **THEN** 关系发展：[待补充关键关系的变化]

### Requirement: 行为模式
主角在不同情境下应该（SHALL）展现一致的行为模式。

#### Scenario: 面对危险时
- **WHEN** 遇到生命威胁
- **THEN** [待补充反应方式，如：保持冷静，理性分析局势]
- **THEN** [待补充决策倾向，如：优先寻找逃生路线]
- **THEN** [待补充战斗风格，如：不轻易与强敌硬拼]

#### Scenario: 面对诱惑时
- **WHEN** 有人提供强大力量或宝物
- **THEN** [待补充思考方式，如：先分析风险和代价]
- **THEN** [待补充决策标准，如：询问来源和附加条件]
- **THEN** [待补充底线原则，如：不贪图天降之物]

#### Scenario: 面对冲突时
- **WHEN** 与他人产生矛盾
- **THEN** [待补充处理方式，如：优先沟通解决]
- **THEN** [待补充行动准则，如：避免无意义的争斗]
- **THEN** [待补充底线，如：必要时果断出手，但不滥杀无辜]

### Requirement: 对话风格
主角的对话应该（SHALL）符合其身份和性格。

#### Scenario: 日常对话
- **WHEN** 与同辈或晚辈对话
- **THEN** 语气：[待补充，如：平和、简洁]
- **THEN** 用词：[待补充，如：不说废话，言之有物]
- **THEN** 特点：[待补充，如：偶尔展现理性思维]

#### Scenario: 面对强者对话
- **WHEN** 与前辈或强者对话
- **THEN** 态度：[待补充，如：保持尊重但不卑躬屈膝]
- **THEN** 措辞：[待补充，如：谨慎，避免冒犯]
- **THEN** 原则：[待补充，如：该坚持时不退让]

### Requirement: 核心动机
主角必须（MUST）有明确且一致的核心动机。

#### Scenario: 行动驱动力
- **WHEN** 主角做出重大决策
- **THEN** 核心目标：[待补充，如：变强以保护重要的人]
- **THEN** 短期目标：[待补充，如：在宗门大比中取得名次]
- **THEN** 恐惧：[待补充，如：失去亲人/朋友]
- **THEN** 渴望：[待补充，如：获得认可/找到真相]

## 创作指导

### 使用本规格时
1. **行为一致性**：所有主角行为必须符合上述行为模式
2. **成长合理性**：修为提升、性格变化需要有合理的契机和过程
3. **对话真实性**：对话内容和风格必须符合主角性格
4. **动机驱动**：主角的行动应该由核心动机驱动，而非情节需要

### 常见错误
- ❌ 主角突然 OOC（行为偏离性格）
- ❌ 修为突破过快，缺少铺垫
- ❌ 对话风格不统一
- ❌ 行动缺少动机支撑

### 更新规格
当需要更新主角规格时：
- 使用 \`## MODIFIED Requirements\` 标记修改的部分
- 在 \`changes/<id>/specs/characters/protagonist/spec.md\` 中编写增量
- 说明修改原因（为什么主角要成长/改变）
`;

export const getProtagonistTemplate = (name: string, age: string, personality: string, background?: string) => {
  return protagonistTemplate({ name, age, personality, background });
};
