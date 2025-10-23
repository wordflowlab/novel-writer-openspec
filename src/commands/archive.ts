import * as path from 'path';
import * as fs from 'fs';
import * as readline from 'readline';
import chalk from 'chalk';
import { FileOperations } from '../utils/file-ops.js';
import { MarkdownParser } from '../core/parser.js';

/**
 * 归档选项
 */
export interface ArchiveOptions {
  yes?: boolean; // 跳过确认
}

/**
 * 归档命令处理器
 */
export class ArchiveCommand {
  private parser: MarkdownParser;

  constructor() {
    this.parser = new MarkdownParser();
  }

  /**
   * 执行归档命令
   */
  async execute(changeId: string, options: ArchiveOptions = {}): Promise<void> {
    try {
      const changePath = this.getChangePath(changeId);

      if (!FileOperations.exists(changePath)) {
        console.error(chalk.red(`✗ 变更 '${changeId}' 不存在`));
        process.exit(1);
      }

      // 1. 检查任务完成状态
      console.log(chalk.blue('\n检查任务完成状态...'));
      const tasksComplete = this.checkTasksComplete(changePath);
      if (!tasksComplete) {
        console.error(chalk.red('\n✗ 变更尚未完成所有任务'));
        console.log(chalk.yellow('提示: 请先完成 tasks.md 中的所有任务'));
        process.exit(1);
      }
      console.log(chalk.green('✓ 所有任务已完成'));

      // 2. 确认归档
      if (!options.yes) {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });

        const confirm = await new Promise<string>((resolve) => {
          rl.question(
            chalk.yellow(`\n确认归档变更 '${changeId}'? (y/n): `),
            (answer: string) => {
              rl.close();
              resolve(answer);
            }
          );
        });

        if (confirm.toLowerCase() !== 'y') {
          console.log(chalk.gray('已取消归档'));
          return;
        }
      }

      // 3. 合并规格增量
      console.log(chalk.blue('\n合并规格增量...'));
      const mergedCount = this.mergeDeltas(changePath);
      console.log(chalk.green(`✓ 合并了 ${mergedCount} 个规格`));

      // 4. 移动到归档
      console.log(chalk.blue('\n移动到归档目录...'));
      const archivePath = this.moveToArchive(changePath, changeId);
      console.log(chalk.green(`✓ 已归档到 ${path.relative(process.cwd(), archivePath)}`));

      // 5. 输出总结
      this.printSummary(changeId, archivePath, mergedCount);
    } catch (error) {
      console.error(chalk.red(`\n✗ 归档失败: ${(error as Error).message}`));
      process.exit(1);
    }
  }

  /**
   * 检查任务是否全部完成
   */
  private checkTasksComplete(changePath: string): boolean {
    const tasksPath = path.join(changePath, 'tasks.md');
    
    if (!FileOperations.exists(tasksPath)) {
      return false;
    }

    const content = FileOperations.readFile(tasksPath);
    const incompleteTasks = content.match(/^- \[ \]/gm);
    
    return !incompleteTasks || incompleteTasks.length === 0;
  }

  /**
   * 合并规格增量到 specs/
   */
  private mergeDeltas(changePath: string): number {
    const deltaSpecsPath = path.join(changePath, 'specs');
    
    if (!FileOperations.exists(deltaSpecsPath)) {
      return 0;
    }

    let mergedCount = 0;
    const deltaSpecs = this.findDeltaSpecs(deltaSpecsPath);

    for (const deltaSpec of deltaSpecs) {
      const deltaFilePath = path.join(deltaSpecsPath, deltaSpec, 'spec.md');
      const targetFilePath = path.join(
        process.cwd(),
        'novelspec',
        'specs',
        deltaSpec,
        'spec.md'
      );

      const deltaContent = FileOperations.readFile(deltaFilePath);
      const delta = this.parser.parseDelta(deltaContent, deltaSpec);

      if (delta.operations.length > 0) {
        this.applyDelta(delta, targetFilePath);
        mergedCount++;
      }
    }

    return mergedCount;
  }

  /**
   * 应用 delta 到目标规格文件
   */
  private applyDelta(delta: any, targetFilePath: string): void {
    let targetContent = '';
    
    // 如果目标文件存在，读取
    if (FileOperations.exists(targetFilePath)) {
      targetContent = FileOperations.readFile(targetFilePath);
    } else {
      // 如果不存在，创建基础结构
      targetContent = `# ${delta.capability} 规格\n\n## Purpose\n\n## Requirements\n\n`;
    }

    for (const operation of delta.operations) {
      if (operation.type === 'ADDED') {
        // 追加新 Requirements
        for (const req of operation.requirements) {
          targetContent += this.formatRequirement(req) + '\n\n';
        }
      } else if (operation.type === 'MODIFIED') {
        // 替换现有 Requirements
        for (const req of operation.requirements) {
          const reqPattern = new RegExp(
            `### Requirement: ${this.escapeRegex(req.name)}[\\s\\S]*?(?=### Requirement:|$)`,
            'g'
          );
          const replacement = this.formatRequirement(req);
          targetContent = targetContent.replace(reqPattern, replacement + '\n');
        }
      } else if (operation.type === 'REMOVED') {
        // 删除 Requirements
        for (const req of operation.requirements) {
          const reqPattern = new RegExp(
            `### Requirement: ${this.escapeRegex(req.name)}[\\s\\S]*?(?=### Requirement:|$)`,
            'g'
          );
          targetContent = targetContent.replace(reqPattern, '');
        }
      }
    }

    // 清理多余空行
    targetContent = targetContent.replace(/\n{3,}/g, '\n\n');
    
    // 写入文件
    FileOperations.writeFile(targetFilePath, targetContent.trim() + '\n');
  }

  /**
   * 格式化 Requirement 为 Markdown
   */
  private formatRequirement(req: any): string {
    let md = `### Requirement: ${req.name}\n`;
    if (req.description) {
      md += `${req.description.trim()}\n`;
    }
    
    for (const scenario of req.scenarios) {
      md += `\n#### Scenario: ${scenario.name}\n`;
      for (const condition of scenario.conditions) {
        md += `- **${condition.type}** ${condition.text}\n`;
      }
    }
    
    return md;
  }

  /**
   * 移动变更到归档目录
   */
  private moveToArchive(changePath: string, changeId: string): string {
    const archiveDir = path.join(process.cwd(), 'novelspec', 'changes', 'archive');
    FileOperations.createDirectory(archiveDir);

    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const archiveName = `${date}-${changeId}`;
    const archivePath = path.join(archiveDir, archiveName);

    // 移动目录
    fs.renameSync(changePath, archivePath);

    return archivePath;
  }

  /**
   * 查找所有 delta specs
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
   * 转义正则表达式特殊字符
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * 获取变更路径
   */
  private getChangePath(changeId: string): string {
    return path.join(process.cwd(), 'novelspec', 'changes', changeId);
  }

  /**
   * 输出归档总结
   */
  private printSummary(changeId: string, archivePath: string, mergedCount: number): void {
    console.log(chalk.green(`\n✓ 变更归档成功！\n`));
    console.log(chalk.blue('归档信息:'));
    console.log(chalk.gray(`  变更 ID: ${changeId}`));
    console.log(chalk.gray(`  归档位置: ${path.relative(process.cwd(), archivePath)}`));
    console.log(chalk.gray(`  合并规格: ${mergedCount} 个\n`));
    console.log(chalk.blue('下一步:'));
    console.log(chalk.gray('  1. 运行 novelspec list --specs 查看所有规格'));
    console.log(chalk.gray('  2. 创建下一批章节提案: /novelspec-proposal\n'));
  }
}

