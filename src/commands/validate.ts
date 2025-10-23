import * as path from 'path';
import chalk from 'chalk';
import { FileOperations } from '../utils/file-ops';
import { FormatValidator, ValidationResult } from '../core/validator';

/**
 * 验证选项
 */
export interface ValidateOptions {
  strict?: boolean; // 严格验证
  json?: boolean;   // JSON 输出
}

/**
 * 验证命令处理器
 */
export class ValidateCommand {
  private validator: FormatValidator;

  constructor() {
    this.validator = new FormatValidator();
  }

  /**
   * 执行验证命令
   */
  execute(changeId?: string, options: ValidateOptions = {}): void {
    try {
      // 确定验证范围
      if (changeId) {
        this.validateSingleChange(changeId, options);
      } else {
        this.validateAllChanges(options);
      }
    } catch (error) {
      console.error(chalk.red(`\n✗ 验证失败: ${(error as Error).message}`));
      process.exit(1);
    }
  }

  /**
   * 验证单个变更
   */
  private validateSingleChange(changeId: string, options: ValidateOptions): void {
    const changePath = this.getChangePath(changeId);

    if (!FileOperations.exists(changePath)) {
      console.error(chalk.red(`✗ 错误: 变更 '${changeId}' 不存在`));
      process.exit(1);
    }

    const result = this.validator.validateChange(changePath, options.strict || false);

    if (options.json) {
      this.outputJSON(result);
    } else {
      this.outputText(changeId, result);
    }

    if (!result.valid) {
      process.exit(1);
    }
  }

  /**
   * 验证所有活跃变更
   */
  private validateAllChanges(options: ValidateOptions): void {
    const changesDir = path.join(process.cwd(), 'novelspec', 'changes');

    if (!FileOperations.exists(changesDir)) {
      console.error(chalk.red('✗ 错误: 未找到 novelspec/changes/ 目录'));
      console.log(chalk.gray('提示: 请在 novelspec 项目根目录运行此命令'));
      process.exit(1);
    }

    const fs = require('fs');
    const entries = fs.readdirSync(changesDir, { withFileTypes: true });
    const changeIds = entries
      .filter((e: any) => e.isDirectory() && e.name !== 'archive')
      .map((e: any) => e.name);

    if (changeIds.length === 0) {
      console.log(chalk.yellow('没有找到活跃的变更'));
      return;
    }

    console.log(chalk.blue(`\n找到 ${changeIds.length} 个活跃变更:\n`));

    let allValid = true;
    const results: { changeId: string; result: ValidationResult }[] = [];

    for (const changeId of changeIds) {
      const changePath = this.getChangePath(changeId);
      const result = this.validator.validateChange(changePath, options.strict || false);
      results.push({ changeId, result });
      
      if (!result.valid) {
        allValid = false;
      }
    }

    if (options.json) {
      console.log(JSON.stringify(results, null, 2));
    } else {
      for (const { changeId, result } of results) {
        this.outputText(changeId, result);
        console.log(''); // 空行分隔
      }

      if (allValid) {
        console.log(chalk.green('✓ 所有变更验证通过\n'));
      } else {
        console.log(chalk.red('✗ 部分变更验证失败\n'));
      }
    }

    if (!allValid) {
      process.exit(1);
    }
  }

  /**
   * 文本格式输出
   */
  private outputText(changeId: string, result: ValidationResult): void {
    console.log(chalk.blue(`\n变更: ${changeId}`));
    console.log(chalk.gray('─'.repeat(50)));

    if (result.valid) {
      console.log(chalk.green('✓ 验证通过'));
      return;
    }

    console.log(chalk.yellow('格式验证:'));

    for (const error of result.errors) {
      const location = error.line ? `${error.file}:${error.line}` : error.file;
      console.log(chalk.red(`  ✗ ${location}`));
      console.log(chalk.gray(`    ${error.message}`));
      if (error.suggestion) {
        console.log(chalk.cyan(`    → ${error.suggestion}`));
      }
    }

    if (result.warnings.length > 0) {
      console.log(chalk.yellow('\n警告:'));
      for (const warning of result.warnings) {
        const location = warning.line ? `${warning.file}:${warning.line}` : warning.file;
        console.log(chalk.yellow(`  ⚠ ${location}`));
        console.log(chalk.gray(`    ${warning.message}`));
      }
    }

    console.log(chalk.red(`\n验证结果: ${result.errors.length} 个错误`));
    if (result.warnings.length > 0) {
      console.log(chalk.yellow(`         ${result.warnings.length} 个警告`));
    }
  }

  /**
   * JSON 格式输出
   */
  private outputJSON(result: ValidationResult): void {
    console.log(JSON.stringify(result, null, 2));
  }

  /**
   * 获取变更路径
   */
  private getChangePath(changeId: string): string {
    return path.join(process.cwd(), 'novelspec', 'changes', changeId);
  }
}

