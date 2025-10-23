import * as path from 'path';
import * as fs from 'fs';
import chalk from 'chalk';
import { FileOperations } from '../utils/file-ops.js';
import { MarkdownParser } from '../core/parser.js';

/**
 * 显示选项
 */
export interface ShowOptions {
  type?: 'change' | 'spec'; // 类型（变更或规格）
  json?: boolean;            // JSON 输出
}

/**
 * 显示命令处理器
 */
export class ShowCommand {
  private parser: MarkdownParser;

  constructor() {
    this.parser = new MarkdownParser();
  }

  /**
   * 执行显示命令
   */
  execute(itemId: string, options: ShowOptions = {}): void {
    try {
      if (options.type === 'spec') {
        this.showSpec(itemId, options.json || false);
      } else {
        this.showChange(itemId, options.json || false);
      }
    } catch (error) {
      console.error(chalk.red(`\n✗ 显示失败: ${(error as Error).message}`));
      process.exit(1);
    }
  }

  /**
   * 显示变更详情
   */
  private showChange(changeId: string, json: boolean): void {
    const changePath = path.join(process.cwd(), 'novelspec', 'changes', changeId);

    if (!FileOperations.exists(changePath)) {
      console.error(chalk.red(`✗ 变更 '${changeId}' 不存在`));
      process.exit(1);
    }

    // 读取各个文件
    const proposalPath = path.join(changePath, 'proposal.md');
    const tasksPath = path.join(changePath, 'tasks.md');
    const designPath = path.join(changePath, 'design.md');
    const specsPath = path.join(changePath, 'specs');

    const proposal = FileOperations.exists(proposalPath)
      ? FileOperations.readFile(proposalPath)
      : '';
    const tasks = FileOperations.exists(tasksPath)
      ? FileOperations.readFile(tasksPath)
      : '';
    const design = FileOperations.exists(designPath)
      ? FileOperations.readFile(designPath)
      : '';

    // 查找 delta specs
    const deltaSpecs: string[] = [];
    if (FileOperations.exists(specsPath)) {
      deltaSpecs.push(...this.findDeltaSpecs(specsPath));
    }

    // 提取关键信息
    const whyMatch = proposal.match(/## Why\n\n(.*?)(?=\n\n##|\n##|$)/s);
    const whatMatch = proposal.match(/## What Changes\n\n(.*?)(?=\n\n##|\n##|$)/s);
    const impactMatch = proposal.match(/## Impact\n\n(.*?)(?=\n\n##|\n##|$)/s);

    const why = whyMatch ? whyMatch[1].trim() : '';
    const what = whatMatch ? whatMatch[1].trim() : '';
    const impact = impactMatch ? impactMatch[1].trim() : '';

    // 统计任务
    const totalTasks = (tasks.match(/^- \[.\]/gm) || []).length;
    const completedTasks = (tasks.match(/^- \[x\]/gm) || []).length;

    if (json) {
      console.log(
        JSON.stringify(
          {
            id: changeId,
            proposal: { why, what, impact },
            tasks: { total: totalTasks, completed: completedTasks },
            hasDesign: design !== '',
            deltaSpecs,
          },
          null,
          2
        )
      );
    } else {
      console.log(chalk.blue(`\n变更: ${changeId}`));
      console.log(chalk.gray('─'.repeat(50)));

      if (why) {
        console.log(chalk.cyan('\n为什么（Why）:'));
        console.log(chalk.white(this.indent(why)));
      }

      if (what) {
        console.log(chalk.cyan('\n变更内容（What Changes）:'));
        console.log(chalk.white(this.indent(what)));
      }

      if (impact) {
        console.log(chalk.cyan('\n影响范围（Impact）:'));
        console.log(chalk.white(this.indent(impact)));
      }

      console.log(chalk.cyan('\n任务进度:'));
      console.log(
        chalk.white(
          `  已完成: ${completedTasks}/${totalTasks} (${totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%)`
        )
      );

      if (design) {
        console.log(chalk.cyan('\n技术设计:'));
        console.log(chalk.gray('  包含 design.md'));
      }

      if (deltaSpecs.length > 0) {
        console.log(chalk.cyan('\n规格增量:'));
        for (const spec of deltaSpecs) {
          console.log(chalk.green(`  ${spec}`));
        }
      }

      console.log('');
    }
  }

  /**
   * 显示规格详情
   */
  private showSpec(specId: string, json: boolean): void {
    const specPath = path.join(process.cwd(), 'novelspec', 'specs', specId, 'spec.md');

    if (!FileOperations.exists(specPath)) {
      console.error(chalk.red(`✗ 规格 '${specId}' 不存在`));
      process.exit(1);
    }

    const content = FileOperations.readFile(specPath);
    const spec = this.parser.parseSpec(content, specPath);

    if (json) {
      console.log(JSON.stringify(spec, null, 2));
    } else {
      console.log(chalk.blue(`\n规格: ${specId}`));
      console.log(chalk.gray('─'.repeat(50)));

      if (spec.purpose) {
        console.log(chalk.cyan('\n目的（Purpose）:'));
        console.log(chalk.white(this.indent(spec.purpose)));
      }

      console.log(chalk.cyan(`\n需求（Requirements）: ${spec.requirements.length}`));
      
      for (const req of spec.requirements) {
        console.log(chalk.green(`\n  ${req.name}`));
        console.log(chalk.gray(`    级别: ${req.level}`));
        if (req.description) {
          console.log(chalk.white(`    ${req.description.substring(0, 100)}...`));
        }
        console.log(chalk.yellow(`    场景数: ${req.scenarios.length}`));
      }

      console.log('');
    }
  }

  /**
   * 查找 delta specs
   */
  private findDeltaSpecs(specsPath: string): string[] {
    const specs: string[] = [];

    const walk = (dir: string, relativePath: string = '') => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const newRelativePath = relativePath
          ? `${relativePath}/${entry.name}`
          : entry.name;

        if (entry.isDirectory()) {
          walk(fullPath, newRelativePath);
        } else if (entry.name === 'spec.md') {
          specs.push(newRelativePath.replace('/spec.md', ''));
        }
      }
    };

    walk(specsPath);
    return specs;
  }

  /**
   * 缩进文本
   */
  private indent(text: string, spaces: number = 2): string {
    const indent = ' '.repeat(spaces);
    return text
      .split('\n')
      .map((line) => indent + line)
      .join('\n');
  }
}

