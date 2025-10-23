# Template System Capability

## Purpose
提供小说专用模板文件和变量替换机制，使用户能够快速开始创作不同类型的小说。

## ADDED Requirements

### Requirement: 模板文件管理
系统必须（MUST）提供小说专用模板文件。

#### Scenario: 提供 project.md 模板
- **WHEN** 用户初始化项目
- **THEN** 复制 `templates/project.md.template` 到项目
- **THEN** 模板包含项目信息、创作原则、风格指南、质量标准、禁忌事项章节
- **THEN** 使用 `{{NOVEL_NAME}}`, `{{GENRE}}`, `{{TARGET_WORDS}}`, `{{VOLUMES}}` 变量

#### Scenario: 提供 AGENTS.md 模板
- **WHEN** 用户初始化项目
- **THEN** 复制 `templates/AGENTS.md.template` 到项目
- **THEN** 模板包含 AI 助手工作流指令
- **THEN** 包含 `/novelspec-proposal`, `/novelspec-apply`, `/novelspec-archive` 命令说明

#### Scenario: 提供角色规格模板
- **WHEN** 用户需要创建角色规格
- **THEN** 提供 `templates/characters/_template/spec.md.template`
- **THEN** 模板包含 Purpose, Requirements (基础设定、行为模式、对话风格)
- **THEN** 使用 `{{CHARACTER_NAME}}`, `{{AGE}}`, `{{PERSONALITY}}`, `{{TRAITS}}` 变量

#### Scenario: 提供世界观规格模板
- **WHEN** 用户需要创建世界观规格
- **THEN** 提供 `templates/worldbuilding/magic-system/spec.md.template`
- **THEN** 模板包含 Purpose, Requirements (修炼等级、战力差距、特殊规则)
- **THEN** 使用 `{{SYSTEM_NAME}}`, `{{LEVELS}}` 等变量

#### Scenario: 提供大纲规格模板
- **WHEN** 用户需要创建大纲规格
- **THEN** 提供 `templates/outline/spec.md.template`
- **THEN** 模板包含 Purpose, Requirements (章节规格示例)
- **THEN** 包含第1-3章的示例 Requirements + Scenarios

### Requirement: 变量替换机制
系统必须（MUST）支持模板变量替换。

#### Scenario: 识别模板变量
- **WHEN** 处理模板文件
- **THEN** 识别 `{{VARIABLE}}` 格式的变量
- **THEN** 支持字母数字下划线变量名

#### Scenario: 替换变量
- **WHEN** 应用模板变量
- **THEN** 将 `{{NOVEL_NAME}}` 替换为用户输入的小说名称
- **THEN** 将 `{{GENRE}}` 替换为用户选择的类型
- **THEN** 保留未匹配的变量原样

#### Scenario: 处理缺失变量
- **WHEN** 变量未提供值
- **THEN** 使用默认值或空字符串
- **THEN** 不输出错误（可选变量）

### Requirement: 模板内容规范
模板文件应该（SHALL）包含清晰的示例和说明。

#### Scenario: project.md 模板内容
- **WHEN** 查看 project.md 模板
- **THEN** 包含完整的创作原则示例（逻辑自洽、角色一致性、情节合理性、文风统一）
- **THEN** 包含风格指南示例（叙事视角、语言风格、章节长度）
- **THEN** 包含质量标准示例
- **THEN** 包含禁忌事项示例

#### Scenario: 角色规格模板内容
- **WHEN** 查看角色规格模板
- **THEN** 包含基础设定 Requirement 示例
- **THEN** 包含行为模式 Requirement 示例（面对危险时、面对诱惑时）
- **THEN** 包含对话风格 Requirement 示例
- **THEN** 每个 Requirement 包含完整的 Scenarios

#### Scenario: 世界观规格模板内容
- **WHEN** 查看世界观规格模板
- **THEN** 包含修炼等级体系 Requirement 示例
- **THEN** 包含战力差距 Requirement 示例
- **THEN** 包含特殊规则 Requirement 示例（如签到系统）
- **THEN** 每个 Requirement 包含可验证的 Scenarios

### Requirement: 模板可扩展性
系统应该（SHALL）允许用户自定义模板。

#### Scenario: 用户自定义模板
- **WHEN** 用户修改 `novelspec/project.md`
- **THEN** 保留用户修改的内容
- **THEN** 不被后续命令覆盖

#### Scenario: 用户添加新模板
- **WHEN** 用户在 `templates/` 添加新模板文件
- **THEN** 系统识别并可使用新模板
- **THEN** 支持相同的变量替换机制

