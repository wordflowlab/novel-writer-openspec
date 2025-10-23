import path from 'path';
import chalk from 'chalk';
import { FileSystemUtils } from '../utils/file-system.js';
import { TemplateManager, ProjectContext } from '../core/templates/index.js';
import { ToolRegistry } from '../core/configurators/registry.js';
import { SlashCommandRegistry } from '../core/configurators/slash/registry.js';
import { NOVELSPEC_DIR_NAME } from '../core/config.js';

export interface InitOptions {
  here?: boolean; // 在当前目录初始化
}

export class InitCommand {
  async execute(projectName: string, options: InitOptions = {}): Promise<void> {
    const projectPath = options.here
      ? process.cwd()
      : path.join(process.cwd(), projectName);

    const novelspecDir = NOVELSPEC_DIR_NAME;
    const novelspecPath = path.join(projectPath, novelspecDir);

    // 检查权限
    if (!(await FileSystemUtils.ensureWritePermissions(options.here ? projectPath : path.dirname(projectPath)))) {
      throw new Error(`无法写入目标目录 ${projectPath}`);
    }

    // 检查目录是否已存在
    if (!options.here && await FileSystemUtils.directoryExists(projectPath)) {
      console.error(chalk.red(`✗ 错误: 目录 '${projectName}' 已存在`));
      process.exit(1);
    }

    console.log(chalk.blue('\n欢迎使用 Novel-Writer-OpenSpec！\n'));

    // Step 1: 创建目录结构
    console.log(chalk.gray('正在创建项目结构...'));
    await this.createDirectoryStructure(projectPath, novelspecPath);

    // Step 2: 生成基础文件
    await this.generateFiles(novelspecPath);
    console.log(chalk.green('✓ novelspec/ 目录结构创建完成'));

    // Step 3: 配置 AI 工具（默认配置 Claude Code 和 Cursor）
    console.log(chalk.gray('正在配置 AI 工具...'));
    await this.configureAITools(projectPath, novelspecDir, ['claude', 'cursor', 'windsurf']);
    console.log(chalk.green('✓ AI 工具配置完成'));

    // 成功消息
    this.printSuccessMessage(projectName, options.here || false);
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

  private async generateFiles(novelspecPath: string): Promise<void> {
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
  ): Promise<void> {
    // 配置根目录 AGENTS.md stub
    const agentsConfigurator = ToolRegistry.get('agents');
    if (agentsConfigurator && agentsConfigurator.isAvailable) {
      await agentsConfigurator.configure(projectPath, novelspecDir);
    }

    // 配置选定的 AI 工具
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
  }

  private printSuccessMessage(projectName: string, here: boolean): void {
    console.log(chalk.green(`\n✓ 项目 '${projectName}' 初始化成功！\n`));
    console.log(chalk.blue('下一步:'));

    if (!here) {
      console.log(chalk.gray(`  1. cd ${projectName}`));
    }
    console.log(chalk.gray('  2. 编辑 novelspec/project.md 设置创作原则'));
    console.log(chalk.gray('  3. 使用 AI 助手 /novelspec-proposal 创建第一个提案'));
    console.log(chalk.gray('\n运行 novelspec --help 查看可用命令\n'));
  }
}
