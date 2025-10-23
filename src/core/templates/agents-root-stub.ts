export const agentsRootStubTemplate = `# NovelSpec Instructions

这些指令适用于在本项目中工作的AI助手。

当请求涉及以下内容时，始终打开 \`@/novelspec/AGENTS.md\`：
- 提及规划或提案（如proposal、spec、change、plan等词）
- 引入新能力、破坏性更改、架构转变或重大性能/安全工作
- 听起来模糊不清，需要在编码前了解权威规格

使用 \`@/novelspec/AGENTS.md\` 来学习：
- 如何创建和应用变更提案
- 规格格式和约定
- 项目结构和指南

保留此托管块，以便 'novelspec update' 可以刷新指令。
`;
