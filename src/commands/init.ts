import path from 'path';
import {
  createPrompt,
  isBackspaceKey,
  isDownKey,
  isEnterKey,
  isSpaceKey,
  isUpKey,
  useKeypress,
  usePagination,
  useState,
} from '@inquirer/core';
import chalk from 'chalk';
import ora from 'ora';
import { FileSystemUtils } from '../utils/file-system.js';
import { TemplateManager, ProjectContext } from '../core/templates/index.js';
import { ToolRegistry } from '../core/configurators/registry.js';
import { SlashCommandRegistry } from '../core/configurators/slash/registry.js';
import {
  NovelSpecConfig,
  AI_TOOLS,
  NOVELSPEC_DIR_NAME,
  AIToolOption,
} from '../core/config.js';
import { PALETTE } from '../core/styles/palette.js';

const PROGRESS_SPINNER = {
  interval: 80,
  frames: ['░░░', '▒░░', '▒▒░', '▒▒▒', '▓▒▒', '▓▓▒', '▓▓▓', '▒▓▓', '░▒▓'],
};

const LETTER_MAP: Record<string, string[]> = {
  N: ['██  ██', '███ ██', '██ ███', '██  ██', '██  ██'],
  O: [' ████ ', '██  ██', '██  ██', '██  ██', ' ████ '],
  V: ['██  ██', '██  ██', '██  ██', ' ████ ', '  ██  '],
  E: ['██████', '██    ', '█████ ', '██    ', '██████'],
  L: ['██    ', '██    ', '██    ', '██    ', '██████'],
  S: [' █████', '██    ', ' ████ ', '    ██', '█████ '],
  P: ['█████ ', '██  ██', '█████ ', '██    ', '██    '],
  C: [' █████', '██    ', '██    ', '██    ', ' █████'],
  ' ': ['  ', '  ', '  ', '  ', '  '],
};

type ToolLabel = {
  primary: string;
  annotation?: string;
};

const sanitizeToolLabel = (raw: string): string =>
  raw.replace(/✅/gu, '✔').trim();

const parseToolLabel = (raw: string): ToolLabel => {
  const sanitized = sanitizeToolLabel(raw);
  const match = sanitized.match(/^(.*?)\s*\((.+)\)$/u);
  if (!match) {
    return { primary: sanitized };
  }
  return {
    primary: match[1].trim(),
    annotation: match[2].trim(),
  };
};

const isSelectableChoice = (
  choice: ToolWizardChoice
): choice is Extract<ToolWizardChoice, { selectable: true }> => choice.selectable;

type ToolWizardChoice =
  | {
      kind: 'heading' | 'info';
      value: string;
      label: ToolLabel;
      selectable: false;
    }
  | {
      kind: 'option';
      value: string;
      label: ToolLabel;
      configured: boolean;
      selectable: true;
    };

type ToolWizardConfig = {
  extendMode: boolean;
  baseMessage: string;
  choices: ToolWizardChoice[];
  initialSelected?: string[];
};

type WizardStep = 'intro' | 'select' | 'review';

type ToolSelectionPrompt = (config: ToolWizardConfig) => Promise<string[]>;

type RootStubStatus = 'created' | 'updated' | 'skipped';

const ROOT_STUB_CHOICE_VALUE = '__root_stub__';
const OTHER_TOOLS_HEADING_VALUE = '__heading-other__';
const LIST_SPACER_VALUE = '__list-spacer__';

const toolSelectionWizard = createPrompt<string[], ToolWizardConfig>(
  (config, done) => {
    const totalSteps = 3;
    const [step, setStep] = useState<WizardStep>('intro');
    const selectableChoices = config.choices.filter(isSelectableChoice);
    const initialCursorIndex = config.choices.findIndex((choice) =>
      choice.selectable
    );
    const [cursor, setCursor] = useState<number>(
      initialCursorIndex === -1 ? 0 : initialCursorIndex
    );
    const [selected, setSelected] = useState<string[]>(() => {
      const initial = new Set(
        (config.initialSelected ?? []).filter((value) =>
          selectableChoices.some((choice) => choice.value === value)
        )
      );
      return selectableChoices
        .map((choice) => choice.value)
        .filter((value) => initial.has(value));
    });
    const [error, setError] = useState<string | null>(null);

    const selectedSet = new Set(selected);
    const pageSize = Math.max(config.choices.length, 1);

    const updateSelected = (next: Set<string>) => {
      const ordered = selectableChoices
        .map((choice) => choice.value)
        .filter((value) => next.has(value));
      setSelected(ordered);
    };

    const page = usePagination({
      items: config.choices,
      active: cursor,
      pageSize,
      loop: false,
      renderItem: ({ item, isActive }) => {
        if (!item.selectable) {
          const prefix = item.kind === 'info' ? '  ' : '';
          const textColor =
            item.kind === 'heading' ? PALETTE.lightGray : PALETTE.midGray;
          return `${PALETTE.midGray(' ')} ${PALETTE.midGray(' ')} ${textColor(
            `${prefix}${item.label.primary}`
          )}`;
        }

        const isSelected = selectedSet.has(item.value);
        const cursorSymbol = isActive
          ? PALETTE.white('›')
          : PALETTE.midGray(' ');
        const indicator = isSelected
          ? PALETTE.white('◉')
          : PALETTE.midGray('○');
        const nameColor = isActive ? PALETTE.white : PALETTE.midGray;
        const annotation = item.label.annotation
          ? PALETTE.midGray(` (${item.label.annotation})`)
          : '';
        const configuredNote = item.configured
          ? PALETTE.midGray(' (已配置)')
          : '';
        const label = `${nameColor(item.label.primary)}${annotation}${configuredNote}`;
        return `${cursorSymbol} ${indicator} ${label}`;
      },
    });

    const moveCursor = (direction: 1 | -1) => {
      if (selectableChoices.length === 0) {
        return;
      }

      let nextIndex = cursor;
      while (true) {
        nextIndex = nextIndex + direction;
        if (nextIndex < 0 || nextIndex >= config.choices.length) {
          return;
        }

        if (config.choices[nextIndex]?.selectable) {
          setCursor(nextIndex);
          return;
        }
      }
    };

    useKeypress((key) => {
      if (step === 'intro') {
        if (isEnterKey(key)) {
          setStep('select');
        }
        return;
      }

      if (step === 'select') {
        if (isUpKey(key)) {
          moveCursor(-1);
          setError(null);
          return;
        }

        if (isDownKey(key)) {
          moveCursor(1);
          setError(null);
          return;
        }

        if (isSpaceKey(key)) {
          const current = config.choices[cursor];
          if (!current || !current.selectable) return;

          const next = new Set(selected);
          if (next.has(current.value)) {
            next.delete(current.value);
          } else {
            next.add(current.value);
          }

          updateSelected(next);
          setError(null);
          return;
        }

        if (isEnterKey(key)) {
          const current = config.choices[cursor];
          if (
            current &&
            current.selectable &&
            !selectedSet.has(current.value)
          ) {
            const next = new Set(selected);
            next.add(current.value);
            updateSelected(next);
          }
          setStep('review');
          setError(null);
          return;
        }

        if (key.name === 'escape') {
          const next = new Set<string>();
          updateSelected(next);
          setError(null);
        }
        return;
      }

      if (step === 'review') {
        if (isEnterKey(key)) {
          const finalSelection = config.choices
            .map((choice) => choice.value)
            .filter(
              (value) =>
                selectedSet.has(value) && value !== ROOT_STUB_CHOICE_VALUE
            );
          done(finalSelection);
          return;
        }

        if (isBackspaceKey(key) || key.name === 'escape') {
          setStep('select');
          setError(null);
        }
      }
    });

    const rootStubChoice = selectableChoices.find(
      (choice) => choice.value === ROOT_STUB_CHOICE_VALUE
    );
    const rootStubSelected = rootStubChoice
      ? selectedSet.has(ROOT_STUB_CHOICE_VALUE)
      : false;
    const nativeChoices = selectableChoices.filter(
      (choice) => choice.value !== ROOT_STUB_CHOICE_VALUE
    );
    const selectedNativeChoices = nativeChoices.filter((choice) =>
      selectedSet.has(choice.value)
    );

    const formatSummaryLabel = (
      choice: Extract<ToolWizardChoice, { selectable: true }>
    ) => {
      const annotation = choice.label.annotation
        ? PALETTE.midGray(` (${choice.label.annotation})`)
        : '';
      const configuredNote = choice.configured
        ? PALETTE.midGray(' (已配置)')
        : '';
      return `${PALETTE.white(choice.label.primary)}${annotation}${configuredNote}`;
    };

    const stepIndex = step === 'intro' ? 1 : step === 'select' ? 2 : 3;
    const lines: string[] = [];
    lines.push(PALETTE.midGray(`步骤 ${stepIndex}/${totalSteps}`));
    lines.push('');

    if (step === 'intro') {
      const introHeadline = config.extendMode
        ? '扩展 NovelSpec 工具配置'
        : '配置 NovelSpec 工具';
      const introBody = config.extendMode
        ? '检测到已有配置。我们将帮助您刷新或添加集成。'
        : '让我们配置 AI 助手，使其理解 NovelSpec。';

      lines.push(PALETTE.white(introHeadline));
      lines.push(PALETTE.midGray(introBody));
      lines.push('');
      lines.push(PALETTE.midGray('按回车键继续。'));
    } else if (step === 'select') {
      lines.push(PALETTE.white(config.baseMessage));
      lines.push(
        PALETTE.midGray(
          '使用 ↑/↓ 移动 · 空格切换 · 回车选择高亮工具并确认'
        )
      );
      lines.push('');
      lines.push(page);
      lines.push('');
      lines.push(PALETTE.midGray('已选择的配置:'));
      if (rootStubSelected && rootStubChoice) {
        lines.push(
          `  ${PALETTE.white('-')} ${formatSummaryLabel(rootStubChoice)}`
        );
      }
      if (selectedNativeChoices.length === 0) {
        lines.push(
          `  ${PALETTE.midGray('- 未选择原生支持的工具')}`
        );
      } else {
        selectedNativeChoices.forEach((choice) => {
          lines.push(
            `  ${PALETTE.white('-')} ${formatSummaryLabel(choice)}`
          );
        });
      }
    } else {
      lines.push(PALETTE.white('确认选择'));
      lines.push(
        PALETTE.midGray('按回车确认，或按退格键调整。')
      );
      lines.push('');

      if (rootStubSelected && rootStubChoice) {
        lines.push(
          `${PALETTE.white('▌')} ${formatSummaryLabel(rootStubChoice)}`
        );
      }

      if (selectedNativeChoices.length === 0) {
        lines.push(
          PALETTE.midGray(
            '未选择原生支持的工具。仍将应用通用指令。'
          )
        );
      } else {
        selectedNativeChoices.forEach((choice) => {
          lines.push(
            `${PALETTE.white('▌')} ${formatSummaryLabel(choice)}`
          );
        });
      }
    }

    if (error) {
      return [lines.join('\n'), chalk.red(error)];
    }

    return lines.join('\n');
  }
);

export interface InitOptions {
  here?: boolean;
  tools?: string;
}

export class InitCommand {
  private readonly prompt: ToolSelectionPrompt;
  private readonly toolsArg?: string;

  constructor(options: { tools?: string; prompt?: ToolSelectionPrompt } = {}) {
    this.prompt = options.prompt ?? ((config) => toolSelectionWizard(config));
    this.toolsArg = options.tools;
  }

  async execute(projectName: string, options: InitOptions = {}): Promise<void> {
    const projectPath = options.here
      ? process.cwd()
      : path.join(process.cwd(), projectName);

    const novelspecDir = NOVELSPEC_DIR_NAME;
    const novelspecPath = path.join(projectPath, novelspecDir);

    // 验证发生在后台
    const extendMode = await this.validate(projectPath, novelspecPath, options.here || false);
    const existingToolStates = await this.getExistingToolStates(projectPath);

    this.renderBanner(extendMode);

    // 获取配置
    const config = await this.getConfiguration(existingToolStates, extendMode);

    const availableTools = AI_TOOLS.filter((tool) => tool.available);
    const selectedIds = new Set(config.aiTools);
    const selectedTools = availableTools.filter((tool) =>
      selectedIds.has(tool.value)
    );
    const created = selectedTools.filter(
      (tool) => !existingToolStates[tool.value]
    );
    const refreshed = selectedTools.filter(
      (tool) => existingToolStates[tool.value]
    );
    const skippedExisting = availableTools.filter(
      (tool) => !selectedIds.has(tool.value) && existingToolStates[tool.value]
    );
    const skipped = availableTools.filter(
      (tool) => !selectedIds.has(tool.value) && !existingToolStates[tool.value]
    );

    // Step 1: 创建目录结构
    if (!extendMode) {
      const structureSpinner = this.startSpinner('正在创建 NovelSpec 结构...');
      await this.createDirectoryStructure(projectPath, novelspecPath);
      await this.generateFiles(novelspecPath, config);
      structureSpinner.stopAndPersist({
        symbol: PALETTE.white('▌'),
        text: PALETTE.white('NovelSpec 结构已创建'),
      });
    } else {
      ora({ stream: process.stdout }).info(
        PALETTE.midGray(
          'ℹ NovelSpec 已初始化。跳过基础脚手架。'
        )
      );
    }

    // Step 2: 配置 AI 工具
    const toolSpinner = this.startSpinner('正在配置 AI 工具...');
    const rootStubStatus = await this.configureAITools(
      projectPath,
      novelspecDir,
      config.aiTools
    );
    toolSpinner.stopAndPersist({
      symbol: PALETTE.white('▌'),
      text: PALETTE.white('AI 工具配置完成'),
    });

    // 成功消息
    this.displaySuccessMessage(
      selectedTools,
      created,
      refreshed,
      skippedExisting,
      skipped,
      extendMode,
      rootStubStatus,
      projectName,
      options.here || false
    );
  }

  private async validate(
    projectPath: string,
    novelspecPath: string,
    here: boolean
  ): Promise<boolean> {
    const extendMode = await FileSystemUtils.directoryExists(novelspecPath);

    // 检查目录是否已存在
    if (!here && !extendMode && await FileSystemUtils.directoryExists(projectPath)) {
      console.error(chalk.red(`✗ 错误: 目录已存在`));
      process.exit(1);
    }

    // 检查写入权限
    if (!(await FileSystemUtils.ensureWritePermissions(here ? projectPath : path.dirname(projectPath)))) {
      throw new Error(`无法写入目标目录 ${projectPath}`);
    }
    return extendMode;
  }

  private async getConfiguration(
    existingTools: Record<string, boolean>,
    extendMode: boolean
  ): Promise<NovelSpecConfig> {
    const selectedTools = await this.getSelectedTools(existingTools, extendMode);
    return { aiTools: selectedTools };
  }

  private async getSelectedTools(
    existingTools: Record<string, boolean>,
    extendMode: boolean
  ): Promise<string[]> {
    const nonInteractiveSelection = this.resolveToolsArg();
    if (nonInteractiveSelection !== null) {
      return nonInteractiveSelection;
    }

    // 回退到交互模式
    return this.promptForAITools(existingTools, extendMode);
  }

  private resolveToolsArg(): string[] | null {
    if (typeof this.toolsArg === 'undefined') {
      return null;
    }

    const raw = this.toolsArg.trim();
    if (raw.length === 0) {
      throw new Error(
        '--tools 选项需要一个值。使用 "all"、"none" 或逗号分隔的工具 ID。'
      );
    }

    const availableTools = AI_TOOLS.filter((tool) => tool.available);
    const availableValues = availableTools.map((tool) => tool.value);
    const availableSet = new Set(availableValues);
    const availableList = ['all', 'none', ...availableValues].join(', ');

    const lowerRaw = raw.toLowerCase();
    if (lowerRaw === 'all') {
      return availableValues;
    }

    if (lowerRaw === 'none') {
      return [];
    }

    const tokens = raw
      .split(',')
      .map((token) => token.trim())
      .filter((token) => token.length > 0);

    if (tokens.length === 0) {
      throw new Error(
        '当不使用 "all" 或 "none" 时，--tools 选项至少需要一个工具 ID。'
      );
    }

    const normalizedTokens = tokens.map((token) => token.toLowerCase());

    if (normalizedTokens.some((token) => token === 'all' || token === 'none')) {
      throw new Error('无法将保留值 "all" 或 "none" 与特定工具 ID 组合。');
    }

    const invalidTokens = tokens.filter(
      (_token, index) => !availableSet.has(normalizedTokens[index])
    );

    if (invalidTokens.length > 0) {
      throw new Error(
        `无效的工具: ${invalidTokens.join(', ')}。可用值: ${availableList}`
      );
    }

    const deduped: string[] = [];
    for (const token of normalizedTokens) {
      if (!deduped.includes(token)) {
        deduped.push(token);
      }
    }

    return deduped;
  }

  private async promptForAITools(
    existingTools: Record<string, boolean>,
    extendMode: boolean
  ): Promise<string[]> {
    const availableTools = AI_TOOLS.filter((tool) => tool.available);

    const baseMessage = extendMode
      ? '您想添加或刷新哪些原生支持的 AI 工具？'
      : '您使用哪些原生支持的 AI 工具？';
    const initialNativeSelection = extendMode
      ? availableTools
          .filter((tool) => existingTools[tool.value])
          .map((tool) => tool.value)
      : [];

    const initialSelected = Array.from(new Set(initialNativeSelection));

    const choices: ToolWizardChoice[] = [
      {
        kind: 'heading',
        value: '__heading-native__',
        label: {
          primary:
            '原生支持的工具 (✔ 可用 NovelSpec 自定义斜杠命令)',
        },
        selectable: false,
      },
      ...availableTools.map<ToolWizardChoice>((tool) => ({
        kind: 'option',
        value: tool.value,
        label: parseToolLabel(tool.name),
        configured: Boolean(existingTools[tool.value]),
        selectable: true,
      })),
      ...(availableTools.length
        ? ([
            {
              kind: 'info' as const,
              value: LIST_SPACER_VALUE,
              label: { primary: '' },
              selectable: false,
            },
          ] as ToolWizardChoice[])
        : []),
      {
        kind: 'heading',
        value: OTHER_TOOLS_HEADING_VALUE,
        label: {
          primary:
            '其他工具 (使用通用 AGENTS.md 适用于 Amp, VS Code, GitHub Copilot 等)',
        },
        selectable: false,
      },
      {
        kind: 'option',
        value: ROOT_STUB_CHOICE_VALUE,
        label: {
          primary: '通用 AGENTS.md',
          annotation: '始终可用',
        },
        configured: extendMode,
        selectable: true,
      },
    ];

    return this.prompt({
      extendMode,
      baseMessage,
      choices,
      initialSelected,
    });
  }

  private async getExistingToolStates(
    projectPath: string
  ): Promise<Record<string, boolean>> {
    const states: Record<string, boolean> = {};
    for (const tool of AI_TOOLS) {
      states[tool.value] = await this.isToolConfigured(projectPath, tool.value);
    }
    return states;
  }

  private async isToolConfigured(
    projectPath: string,
    toolId: string
  ): Promise<boolean> {
    const configFile = ToolRegistry.get(toolId)?.configFileName;
    if (
      configFile &&
      (await FileSystemUtils.fileExists(path.join(projectPath, configFile)))
    )
      return true;

    const slashConfigurator = SlashCommandRegistry.get(toolId);
    if (!slashConfigurator) return false;
    for (const target of slashConfigurator.getTargets()) {
      const absolute = slashConfigurator.resolveAbsolutePath(
        projectPath,
        target.id
      );
      if (await FileSystemUtils.fileExists(absolute)) return true;
    }
    return false;
  }

  private async createDirectoryStructure(projectPath: string, novelspecPath: string): Promise<void> {
    const directories = [
      projectPath,
      novelspecPath,
      path.join(novelspecPath, 'specs'),
      path.join(novelspecPath, 'specs', 'characters'),
      path.join(novelspecPath, 'specs', 'worldbuilding'),
      path.join(novelspecPath, 'specs', 'outline'),
      path.join(novelspecPath, 'changes'),
      path.join(novelspecPath, 'changes', 'archive'),
      path.join(projectPath, 'chapters'),
      path.join(projectPath, 'docs'),
    ];

    for (const dir of directories) {
      await FileSystemUtils.createDirectory(dir);
    }
  }

  private async generateFiles(
    novelspecPath: string,
    config: NovelSpecConfig
  ): Promise<void> {
    const context: ProjectContext = {
      projectName: '小说项目',
      description: '一部精彩的小说',
      genre: '玄幻',
      targetWords: '100',
      volumes: '4',
    };

    const templates = TemplateManager.getTemplates(context);

    for (const template of templates) {
      const filePath = path.join(novelspecPath, template.path);
      const content =
        typeof template.content === 'function'
          ? template.content(context)
          : template.content;

      await FileSystemUtils.writeFile(filePath, content);
    }
  }

  private async configureAITools(
    projectPath: string,
    novelspecDir: string,
    toolIds: string[]
  ): Promise<RootStubStatus> {
    const rootStubStatus = await this.configureRootAgentsStub(
      projectPath,
      novelspecDir
    );

    for (const toolId of toolIds) {
      const configurator = ToolRegistry.get(toolId);
      if (configurator && configurator.isAvailable) {
        await configurator.configure(projectPath, novelspecDir);
      }

      const slashConfigurator = SlashCommandRegistry.get(toolId);
      if (slashConfigurator && slashConfigurator.isAvailable) {
        await slashConfigurator.generateAll(projectPath, novelspecDir);
      }
    }

    return rootStubStatus;
  }

  private async configureRootAgentsStub(
    projectPath: string,
    novelspecDir: string
  ): Promise<RootStubStatus> {
    const configurator = ToolRegistry.get('agents');
    if (!configurator || !configurator.isAvailable) {
      return 'skipped';
    }

    const stubPath = path.join(projectPath, configurator.configFileName);
    const existed = await FileSystemUtils.fileExists(stubPath);

    await configurator.configure(projectPath, novelspecDir);

    return existed ? 'updated' : 'created';
  }

  private displaySuccessMessage(
    selectedTools: AIToolOption[],
    created: AIToolOption[],
    refreshed: AIToolOption[],
    skippedExisting: AIToolOption[],
    skipped: AIToolOption[],
    extendMode: boolean,
    rootStubStatus: RootStubStatus,
    projectName: string,
    here: boolean
  ): void {
    console.log(); // 空行
    const successHeadline = extendMode
      ? 'NovelSpec 工具配置已更新！'
      : 'NovelSpec 初始化成功！';
    ora().succeed(PALETTE.white(successHeadline));

    console.log();
    console.log(PALETTE.lightGray('工具摘要:'));
    const summaryLines = [
      rootStubStatus === 'created'
        ? `${PALETTE.white('▌')} ${PALETTE.white(
            '已为其他助手创建根 AGENTS.md 存根'
          )}`
        : null,
      rootStubStatus === 'updated'
        ? `${PALETTE.lightGray('▌')} ${PALETTE.lightGray(
            '已为其他助手刷新根 AGENTS.md 存根'
          )}`
        : null,
      created.length
        ? `${PALETTE.white('▌')} ${PALETTE.white(
            '已创建:'
          )} ${this.formatToolNames(created)}`
        : null,
      refreshed.length
        ? `${PALETTE.lightGray('▌')} ${PALETTE.lightGray(
            '已刷新:'
          )} ${this.formatToolNames(refreshed)}`
        : null,
      skippedExisting.length
        ? `${PALETTE.midGray('▌')} ${PALETTE.midGray(
            '已跳过 (已配置):'
          )} ${this.formatToolNames(skippedExisting)}`
        : null,
      skipped.length
        ? `${PALETTE.darkGray('▌')} ${PALETTE.darkGray(
            '已跳过:'
          )} ${this.formatToolNames(skipped)}`
        : null,
    ].filter((line): line is string => Boolean(line));
    for (const line of summaryLines) {
      console.log(line);
    }

    console.log();
    console.log(PALETTE.blue('\n下一步:'));

    if (!here) {
      console.log(PALETTE.gray(`  1. cd ${projectName}`));
    }
    console.log(PALETTE.gray('  2. 编辑 novelspec/project.md 设置创作原则'));
    console.log(PALETTE.gray('  3. 使用 AI 助手 /novelspec-proposal 创建第一个提案'));
    console.log(PALETTE.gray('\n运行 novelspec --help 查看可用命令\n'));
  }

  private formatToolNames(tools: AIToolOption[]): string {
    const names = tools
      .map((tool) => tool.successLabel ?? tool.name)
      .filter((name): name is string => Boolean(name));

    if (names.length === 0)
      return PALETTE.lightGray('您的 AGENTS.md 兼容助手');
    if (names.length === 1) return PALETTE.white(names[0]);

    const base = names.slice(0, -1).map((name) => PALETTE.white(name));
    const last = PALETTE.white(names[names.length - 1]);

    return `${base.join(PALETTE.midGray(', '))}${
      base.length ? PALETTE.midGray(' 和 ') : ''
    }${last}`;
  }

  private renderBanner(_extendMode: boolean): void {
    const rows = ['', '', '', '', ''];
    for (const char of 'NOVELSPEC') {
      const glyph = LETTER_MAP[char] ?? LETTER_MAP[' '];
      for (let i = 0; i < rows.length; i += 1) {
        rows[i] += `${glyph[i]}  `;
      }
    }

    const rowStyles = [
      PALETTE.white,
      PALETTE.lightGray,
      PALETTE.midGray,
      PALETTE.lightGray,
      PALETTE.white,
    ];

    console.log();
    rows.forEach((row, index) => {
      console.log(rowStyles[index](row.replace(/\s+$/u, '')));
    });
    console.log();
    console.log(PALETTE.white('欢迎使用 NovelSpec！'));
    console.log();
  }

  private startSpinner(text: string) {
    return ora({
      text,
      stream: process.stdout,
      color: 'gray',
      spinner: PROGRESS_SPINNER,
    }).start();
  }
}
