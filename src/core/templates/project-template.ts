export interface ProjectContext {
  projectName?: string;
  description?: string;
  genre?: string;  // 小说类型
  targetWords?: string;  // 目标字数
  volumes?: string;  // 预计卷数
  conventions?: string;
}

export const projectTemplate = (context: ProjectContext = {}) => `# ${context.projectName || '小说项目'} Context

## 项目信息
- **小说名称**: ${context.projectName || '[小说名称]'}
- **类型**: ${context.genre || '[玄幻/武侠/都市/科幻/其他]'}
- **目标字数**: ${context.targetWords || '[例如：100]'}万字
- **预计卷数**: ${context.volumes || '[例如：4]'}卷

## 项目简介
${context.description || '[描述你的小说故事概要、核心卖点、目标读者群等]'}

## 创作原则

本项目遵循以下核心创作原则（AI 必须严格遵守）：

1. **逻辑自洽**: 世界观设定一旦确立，必须保持一致，不得随意修改
2. **角色一致性**: 角色行为必须符合性格设定和成长轨迹
3. **情节合理性**: 情节发展需有因果逻辑，不强行制造冲突
4. **文风统一**: 保持统一的叙事风格和语言特色

## 风格指南

### 叙事风格
- **视角**: [第一人称/第三人称限制视角/全知视角]
- **语言风格**: [现代白话/文言/网络文学/其他]
- **章节长度**: [例如：3000-4000]字/章
- **更新频率**: [日更/周更]

### 质量标准
- 每章必须推进情节或深化角色
- 对话符合角色身份和性格
- 描写要有画面感，避免流水账
- 伏笔必须记录并回收

### 禁忌事项
- ❌ 不得随意改变核心设定
- ❌ 不得让角色OOC（Out of Character）
- ❌ 不得出现未定义的设定（角色、地点、技能等）
${context.conventions || ''}

## 规格管理

### 角色规格
存放位置: \`novelspec/specs/characters/\`
- 主角规格: \`protagonist/spec.md\`
- 女主规格: \`heroine/spec.md\`
- 配角规格: \`supporting/[name]/spec.md\`

### 世界观规格
存放位置: \`novelspec/specs/worldbuilding/\`
- 魔法体系: \`magic-system/spec.md\`
- 地理设定: \`geography/spec.md\`
- 势力组织: \`factions/spec.md\`
- 历史背景: \`history/spec.md\`

### 大纲规格
存放位置: \`novelspec/specs/outline/spec.md\`
- 已确定的章节大纲

## AI 工作模式

NovelSpec 支持两种 AI 工作模式，你可以根据任务复杂度选择：

### 详细模式（默认）
**特点**:
- AI 会询问更多澄清问题
- 生成完整的 proposal.md + design.md + tasks.md
- 严格验证所有规格格式和语义
- 提供详细的一致性检查

**适合场景**:
- 大量章节创作（10章以上）
- 复杂的设定扩展（新增多个角色、完整的魔法体系）
- 重大情节调整（涉及多个角色和情节线）

**使用方式**: 直接使用斜杠命令，如 \`/novelspec-proposal\`

### 快速模式
**特点**:
- AI 基于最少信息快速生成提案
- 跳过 design.md（除非明确需要）
- 基础格式验证，宽松的语义检查
- 快速迭代，适合小改动

**适合场景**:
- 少量章节创作（1-3章）
- 小规模设定调整（如角色小幅成长）
- 快速原型验证

**使用方式**: 在斜杠命令后添加说明，如 \`/novelspec-proposal --mode quick\`

### 如何选择？
- 🤔 **不确定？** 使用详细模式，更安全
- ⚡ **追求速度？** 使用快速模式，但要自己多检查
- 📝 **初次使用？** 建议先用详细模式熟悉流程

## 重要约定

### 必须遵守的规则
1. **规格即真相**: \`novelspec/specs/\` 目录是唯一可信的设定来源
2. **变更需验证**: 所有变更必须通过 \`novelspec validate\` 验证
3. **不能跳过归档**: 完成的变更必须归档到 \`changes/archive/\`
4. **保持一致性**: 所有创作必须符合已有规格

### 创作红线（禁止事项）
- 🚫 **不得** 随意改变已确定的核心设定（如魔法体系基本规则）
- 🚫 **不得** 让角色 OOC（行为偏离性格设定）
- 🚫 **不得** 出现未定义的设定（角色、地点、技能等必须先定义）
- 🚫 **不得** 跳过验证步骤直接创作

[在此添加项目特定的额外约定、规则和注意事项]
`;
