import * as path from 'path';
import * as fs from 'fs';
import chalk from 'chalk';
import { FileOperations } from '../utils/file-ops';

/**
 * 列出选项
 */
export interface ListOptions {
  archive?: boolean; // 列出已归档变更
  specs?: boolean;   // 列出规格
  json?: boolean;    // JSON 输出
}

/**
 * 列出命令处理器
 */
export class ListCommand {
  /**
   * 执行列出命令
   */
  execute(options: ListOptions = {}): void {
    try {
      if (options.specs) {
        this.listSpecs(options.json || false);
      } else if (options.archive) {
        this.listArchived(options.json || false);
      } else {
        this.listActiveChanges(options.json || false);
      }
    } catch (error) {
      console.error(chalk.red(`\n✗ 列出失败: ${(error as Error).message}`));
      process.exit(1);
    }
  }

  /**
   * 列出活跃变更
   */
  private listActiveChanges(json: boolean): void {
    const changesDir = path.join(process.cwd(), 'novelspec', 'changes');

    if (!FileOperations.exists(changesDir)) {
      if (json) {
        console.log(JSON.stringify({ changes: [] }, null, 2));
      } else {
        console.log(chalk.yellow('未找到 novelspec/changes/ 目录'));
      }
      return;
    }

    const entries = fs.readdirSync(changesDir, { withFileTypes: true });
    const changes = entries
      .filter((e) => e.isDirectory() && e.name !== 'archive')
      .map((e) => {
        const changePath = path.join(changesDir, e.name);
        const proposalPath = path.join(changePath, 'proposal.md');
        
        let description = '';
        if (FileOperations.exists(proposalPath)) {
          const content = FileOperations.readFile(proposalPath);
          const whyMatch = content.match(/## Why\n\n(.*?)(?=\n\n##|\n##|$)/s);
          if (whyMatch) {
            description = whyMatch[1].trim().split('\n')[0]; // 第一行
          }
        }

        return {
          id: e.name,
          description,
          path: changePath,
        };
      });

    if (json) {
      console.log(JSON.stringify({ changes }, null, 2));
    } else {
      if (changes.length === 0) {
        console.log(chalk.yellow('\n没有活跃的变更'));
        return;
      }

      console.log(chalk.blue(`\n活跃变更 (${changes.length}):\n`));
      for (const change of changes) {
        console.log(chalk.green(`  ${change.id}`));
        if (change.description) {
          console.log(chalk.gray(`    ${change.description}`));
        }
      }
      console.log('');
    }
  }

  /**
   * 列出已归档变更
   */
  private listArchived(json: boolean): void {
    const archiveDir = path.join(process.cwd(), 'novelspec', 'changes', 'archive');

    if (!FileOperations.exists(archiveDir)) {
      if (json) {
        console.log(JSON.stringify({ archived: [] }, null, 2));
      } else {
        console.log(chalk.yellow('未找到归档目录'));
      }
      return;
    }

    const entries = fs.readdirSync(archiveDir, { withFileTypes: true });
    const archived = entries
      .filter((e) => e.isDirectory())
      .map((e) => {
        const dateMatch = e.name.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/);
        return {
          id: e.name,
          date: dateMatch ? dateMatch[1] : '',
          name: dateMatch ? dateMatch[2] : e.name,
          path: path.join(archiveDir, e.name),
        };
      })
      .sort((a, b) => b.date.localeCompare(a.date)); // 最新的在前

    if (json) {
      console.log(JSON.stringify({ archived }, null, 2));
    } else {
      if (archived.length === 0) {
        console.log(chalk.yellow('\n没有已归档的变更'));
        return;
      }

      console.log(chalk.blue(`\n已归档变更 (${archived.length}):\n`));
      for (const item of archived) {
        console.log(chalk.green(`  ${item.name}`));
        if (item.date) {
          console.log(chalk.gray(`    归档日期: ${item.date}`));
        }
      }
      console.log('');
    }
  }

  /**
   * 列出规格
   */
  private listSpecs(json: boolean): void {
    const specsDir = path.join(process.cwd(), 'novelspec', 'specs');

    if (!FileOperations.exists(specsDir)) {
      if (json) {
        console.log(JSON.stringify({ specs: [] }, null, 2));
      } else {
        console.log(chalk.yellow('未找到 novelspec/specs/ 目录'));
      }
      return;
    }

    const specs = this.findSpecs(specsDir);

    if (json) {
      console.log(JSON.stringify({ specs }, null, 2));
    } else {
      if (specs.length === 0) {
        console.log(chalk.yellow('\n没有找到规格文件'));
        return;
      }

      console.log(chalk.blue(`\n规格列表 (${specs.length}):\n`));
      
      // 按类别分组
      const grouped: Record<string, any[]> = {};
      for (const spec of specs) {
        const category = spec.category;
        if (!grouped[category]) {
          grouped[category] = [];
        }
        grouped[category].push(spec);
      }

      for (const [category, items] of Object.entries(grouped)) {
        console.log(chalk.cyan(`  ${category}/`));
        for (const item of items) {
          console.log(chalk.green(`    ${item.name}`));
          if (item.purpose) {
            console.log(chalk.gray(`      ${item.purpose}`));
          }
        }
        console.log('');
      }
    }
  }

  /**
   * 查找所有规格文件
   */
  private findSpecs(specsDir: string): any[] {
    const specs: any[] = [];

    const walk = (dir: string, category: string = '') => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(specsDir, fullPath);

        if (entry.isDirectory()) {
          const newCategory = category ? `${category}/${entry.name}` : entry.name;
          walk(fullPath, newCategory);
        } else if (entry.name === 'spec.md') {
          const content = FileOperations.readFile(fullPath);
          const purposeMatch = content.match(/## Purpose\n\n?(.*?)(?=\n\n##|\n##|$)/s);
          const purpose = purposeMatch ? purposeMatch[1].trim().split('\n')[0] : '';

          specs.push({
            name: category,
            category: category.split('/')[0] || 'root',
            purpose,
            path: fullPath,
          });
        }
      }
    };

    walk(specsDir);
    return specs;
  }
}

