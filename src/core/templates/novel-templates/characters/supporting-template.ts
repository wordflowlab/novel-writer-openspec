/**
 * 配角角色规格模板
 */
export const supportingTemplate = (context: {
  name: string;
  role: string; // 如：导师、好友、女主
  relationship: string; // 与主角的关系
}) => `# novelspec/specs/characters/${context.name.toLowerCase().replace(/\s+/g, '-')}/spec.md

## Purpose
配角${context.name}（${context.role}）的完整规格定义。

## Requirements

### Requirement: 基础设定
配角应该（SHALL）具有明确的身份和角色定位。

#### Scenario: 身份信息
- **WHEN** ${context.name}登场或被提及
- **THEN** 姓名：${context.name}
- **THEN** 角色定位：${context.role}
- **THEN** 年龄：[待补充]
- **THEN** 修为等级：[待补充]
- **THEN** 性格：[待补充主要性格特点]
- **THEN** 地位：[待补充在故事中的地位]

### Requirement: 与主角关系
配角与主角的关系应该（SHALL）清晰定义且有发展。

#### Scenario: 关系设定
- **WHEN** 描述与主角的互动
- **THEN** 关系类型：${context.relationship}
- **THEN** 初次相识：[待补充相识契机和场景]
- **THEN** 关系基础：[待补充关系建立的基础，如共同利益、情感纽带]
- **THEN** 冲突点：[待补充可能的矛盾或冲突]

#### Scenario: 关系发展
- **WHEN** 故事推进过程中
- **THEN** 第一卷：[待补充关系状态，如：陌生→熟悉]
- **THEN** 第二卷：[待补充关系发展，如：朋友→密友]
- **THEN** 关键转折：[待补充关系转折点事件]

### Requirement: 角色功能
配角必须（MUST）在故事中发挥明确的功能作用。

#### Scenario: 故事作用
- **WHEN** 配角出场
- **THEN** 主要功能：[待补充，如：为主角提供指导/制造冲突/推动情节]
- **THEN** 推动情节：[待补充具体推动哪些情节发展]
- **THEN** 角色对比：[待补充与主角的对比或互补]

### Requirement: 行为模式
配角应该（SHALL）展现符合其角色定位的行为模式。

#### Scenario: 典型行为
- **WHEN** 面对主角
- **THEN** 态度：[待补充，如：鼓励/质疑/保护]
- **THEN** 行为方式：[待补充，如：直接/委婉/严厉]
- **THEN** 底线：[待补充行为底线和原则]

#### Scenario: 关键时刻
- **WHEN** 主角遇到困境
- **THEN** 反应：[待补充配角如何反应]
- **THEN** 选择：[待补充配角会做何选择]
- **THEN** 代价：[待补充配角愿意付出的代价]

### Requirement: 对话风格
配角的对话应该（SHALL）符合其身份和性格。

#### Scenario: 与主角对话
- **WHEN** 配角与主角交流
- **THEN** 语气：[待补充，如：温和/严厉/调侃]
- **THEN** 用词：[待补充词汇特点]
- **THEN** 口头禅：[待补充如有特色口头禅]

### Requirement: 成长轨迹（可选）
如果配角有成长，应该（SHALL）定义其成长轨迹。

#### Scenario: 角色变化
- **WHEN** 经历关键事件后
- **THEN** 初始状态：[待补充初始性格/能力]
- **THEN** 变化契机：[待补充导致改变的事件]
- **THEN** 最终状态：[待补充变化后的性格/能力]

## 创作指导

### 使用本规格时
1. **角色一致性**：配角行为必须符合其角色定位
2. **关系合理性**：与主角的互动要符合关系设定
3. **功能明确性**：每次出场都要发挥明确的故事功能
4. **不抢戏**：配角不应过度占据篇幅，除非剧情需要

### 常见错误
- ❌ 配角行为不符合角色定位
- ❌ 与主角的关系发展过快或过慢
- ❌ 配角戏份过多，喧宾夺主
- ❌ 配角突然消失，没有合理的退场

### 退场机制（如需要）
如果配角需要退场：
- 方式：[待补充退场方式，如：离开、牺牲、达成目标]
- 时机：[待补充退场时机]
- 影响：[待补充对主角和故事的影响]
`;

export const getSupportingTemplate = (name: string, role: string, relationship: string) => {
  return supportingTemplate({ name, role, relationship });
};
