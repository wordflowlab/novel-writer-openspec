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

## 重要约定

[在此添加项目特定的约定、规则和注意事项]
`;
