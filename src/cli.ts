#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { InitCommand } from './commands/init';
import { ValidateCommand } from './commands/validate';
import { ListCommand } from './commands/list';
import { ShowCommand } from './commands/show';
import { ArchiveCommand } from './commands/archive';

const program = new Command();

// 版本信息
const version = '0.1.0';

program
  .name('novelspec')
  .description('基于 OpenSpec 方法论的小说创作管理工具')
  .version(version, '-v, --version', '显示版本号');

// novelspec init <project-name>
program
  .command('init <project-name>')
  .description('初始化一个新的小说项目')
  .option('--here', '在当前目录初始化')
  .action(async (projectName: string, options: any) => {
    try {
      const initCommand = new InitCommand();
      await initCommand.execute(projectName, options);
    } catch (error) {
      console.error(chalk.red(`错误: ${(error as Error).message}`));
      process.exit(1);
    }
  });

// novelspec validate [change-id]
program
  .command('validate [change-id]')
  .description('验证变更提案的格式')
  .option('--strict', '严格验证模式')
  .option('--json', 'JSON 格式输出')
  .action((changeId: string | undefined, options: any) => {
    try {
      const validateCommand = new ValidateCommand();
      validateCommand.execute(changeId, options);
    } catch (error) {
      console.error(chalk.red(`错误: ${(error as Error).message}`));
      process.exit(1);
    }
  });

// novelspec list
program
  .command('list')
  .description('列出变更或规格')
  .option('--archive', '列出已归档的变更')
  .option('--specs', '列出所有规格')
  .option('--json', 'JSON 格式输出')
  .action((options: any) => {
    try {
      const listCommand = new ListCommand();
      listCommand.execute(options);
    } catch (error) {
      console.error(chalk.red(`错误: ${(error as Error).message}`));
      process.exit(1);
    }
  });

// novelspec show <item-id>
program
  .command('show <item-id>')
  .description('显示变更或规格详情')
  .option('--type <type>', '指定类型: change 或 spec')
  .option('--json', 'JSON 格式输出')
  .action((itemId: string, options: any) => {
    try {
      const showCommand = new ShowCommand();
      showCommand.execute(itemId, options);
    } catch (error) {
      console.error(chalk.red(`错误: ${(error as Error).message}`));
      process.exit(1);
    }
  });

// novelspec archive <change-id>
program
  .command('archive <change-id>')
  .description('归档已完成的变更')
  .option('-y, --yes', '跳过确认提示')
  .action(async (changeId: string, options: any) => {
    try {
      const archiveCommand = new ArchiveCommand();
      await archiveCommand.execute(changeId, options);
    } catch (error) {
      console.error(chalk.red(`错误: ${(error as Error).message}`));
      process.exit(1);
    }
  });

// 显示帮助信息
program.on('--help', () => {
  console.log('');
  console.log(chalk.blue('示例:'));
  console.log('  $ novelspec init my-novel        # 创建新项目');
  console.log('  $ novelspec init my-novel --here # 在当前目录初始化');
  console.log('  $ novelspec list                 # 列出活跃变更');
  console.log('  $ novelspec list --specs         # 列出所有规格');
  console.log('  $ novelspec list --archive       # 列出已归档变更');
  console.log('  $ novelspec show add-ch-1        # 显示变更详情');
  console.log('  $ novelspec show characters/protagonist --type spec  # 显示规格详情');
  console.log('  $ novelspec validate             # 验证所有变更');
  console.log('  $ novelspec validate add-ch-1    # 验证单个变更');
  console.log('  $ novelspec validate --strict    # 严格验证');
  console.log('  $ novelspec archive add-ch-1     # 归档已完成的变更');
  console.log('  $ novelspec archive add-ch-1 -y  # 归档（跳过确认）');
  console.log('');
  console.log(chalk.blue('文档:'));
  console.log('  https://github.com/wordflowlab/novel-writer-openspec');
  console.log('');
});

// 解析命令行参数
program.parse(process.argv);

// 如果没有参数，显示帮助
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

