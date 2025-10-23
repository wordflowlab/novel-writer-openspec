import * as path from 'path';
import { FileOperations } from '../utils/file-ops.js';
import { MarkdownParser } from './parser.js';

/**
 * 验证错误类型
 */
export interface ValidationError {
  file: string;
  line?: number;
  type: 'format' | 'semantic' | 'cross-chapter';
  message: string;
  suggestion?: string;
}

/**
 * 验证警告类型
 */
export interface ValidationWarning {
  file: string;
  line?: number;
  message: string;
}

/**
 * 验证结果
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

/**
 * 格式验证器
 */
export class FormatValidator {
  private parser: MarkdownParser;

  constructor() {
    this.parser = new MarkdownParser();
  }

  /**
   * 验证变更提案
   * 
   * @param changePath 变更目录路径
   * @param strict 是否严格验证
   * @returns 验证结果
   */
  validateChange(changePath: string, strict: boolean = false): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // 验证 proposal.md
    const proposalPath = path.join(changePath, 'proposal.md');
    if (FileOperations.exists(proposalPath)) {
      const proposalErrors = this.validateProposal(proposalPath);
      errors.push(...proposalErrors);
    } else {
      errors.push({
        file: 'proposal.md',
        type: 'format',
        message: '缺少 proposal.md 文件',
        suggestion: '创建 proposal.md 文件，包含 Why, What Changes, Impact 章节',
      });
    }

    // 验证 tasks.md
    const tasksPath = path.join(changePath, 'tasks.md');
    if (FileOperations.exists(tasksPath)) {
      const tasksErrors = this.validateTasks(tasksPath);
      errors.push(...tasksErrors);
    } else {
      errors.push({
        file: 'tasks.md',
        type: 'format',
        message: '缺少 tasks.md 文件',
        suggestion: '创建 tasks.md 文件，使用任务清单格式（- [ ] 或 - [x]）',
      });
    }

    // 验证 specs/ 目录下的 delta spec
    const specsPath = path.join(changePath, 'specs');
    if (FileOperations.exists(specsPath) && FileOperations.isDirectory(specsPath)) {
      const specErrors = this.validateDeltaSpecs(specsPath, strict);
      errors.push(...specErrors);
    } else {
      errors.push({
        file: 'specs/',
        type: 'format',
        message: '缺少 specs/ 目录或 delta spec 文件',
        suggestion: '创建 specs/ 目录并添加至少一个 delta spec 文件',
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * 验证 proposal.md 格式
   */
  private validateProposal(proposalPath: string): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = FileOperations.readFile(proposalPath);
    const lines = content.split('\n');

    let hasWhy = false;
    let hasWhatChanges = false;
    let hasImpact = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line === '## Why') {
        hasWhy = true;
      } else if (line === '## What Changes') {
        hasWhatChanges = true;
      } else if (line === '## Impact') {
        hasImpact = true;
      }
    }

    if (!hasWhy) {
      errors.push({
        file: 'proposal.md',
        type: 'format',
        message: '缺少 ## Why 章节',
        suggestion: '添加 ## Why 章节说明变更原因',
      });
    }

    if (!hasWhatChanges) {
      errors.push({
        file: 'proposal.md',
        type: 'format',
        message: '缺少 ## What Changes 章节',
        suggestion: '添加 ## What Changes 章节列出变更内容',
      });
    }

    if (!hasImpact) {
      errors.push({
        file: 'proposal.md',
        type: 'format',
        message: '缺少 ## Impact 章节',
        suggestion: '添加 ## Impact 章节标注影响的规格和代码',
      });
    }

    return errors;
  }

  /**
   * 验证 tasks.md 格式
   */
  private validateTasks(tasksPath: string): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = FileOperations.readFile(tasksPath);
    const lines = content.split('\n');

    let hasTaskList = false;

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('- [ ]') || trimmedLine.startsWith('- [x]')) {
        hasTaskList = true;
        break;
      }
    }

    if (!hasTaskList) {
      errors.push({
        file: 'tasks.md',
        type: 'format',
        message: '缺少任务清单格式',
        suggestion: '使用 - [ ] 或 - [x] 格式创建任务清单',
      });
    }

    return errors;
  }

  /**
   * 验证 delta spec 文件
   */
  private validateDeltaSpecs(specsPath: string, strict: boolean): ValidationError[] {
    const errors: ValidationError[] = [];
    const specFiles = this.findSpecFiles(specsPath);

    if (specFiles.length === 0) {
      errors.push({
        file: 'specs/',
        type: 'format',
        message: '没有找到任何 spec.md 文件',
        suggestion: '在 specs/ 目录下创建至少一个 capability/spec.md 文件',
      });
      return errors;
    }

    for (const specFile of specFiles) {
      const specErrors = this.validateDeltaSpec(specFile, strict);
      errors.push(...specErrors);
    }

    return errors;
  }

  /**
   * 验证单个 delta spec 文件
   */
  private validateDeltaSpec(specPath: string, strict: boolean): ValidationError[] {
    const errors: ValidationError[] = [];
    const content = FileOperations.readFile(specPath);
    const lines = content.split('\n');
    const relativePath = specPath.substring(specPath.indexOf('specs/'));

    // 检查是否有 delta 操作标记
    let hasDeltaOperation = false;
    const deltaOperations = [
      '## ADDED Requirements',
      '## MODIFIED Requirements',
      '## REMOVED Requirements',
      '## RENAMED Requirements',
    ];

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (deltaOperations.some(op => trimmedLine === op)) {
        hasDeltaOperation = true;
        break;
      }
    }

    if (!hasDeltaOperation) {
      errors.push({
        file: relativePath,
        type: 'format',
        message: 'Delta spec 必须使用 ADDED/MODIFIED/REMOVED/RENAMED 标记',
        suggestion: '添加 ## ADDED Requirements 或其他 delta 操作标记',
      });
    }

    // 解析并验证 Requirements 和 Scenarios
    try {
      const capability = this.extractCapability(specPath);
      const delta = this.parser.parseDelta(content, capability);

      for (const operation of delta.operations) {
        for (const requirement of operation.requirements) {
          // 验证 Requirement 是否有 Scenarios
          if (requirement.scenarios.length === 0) {
            errors.push({
              file: relativePath,
              line: requirement.lineNumber,
              type: 'format',
              message: `Requirement "${requirement.name}" 缺少 Scenario`,
              suggestion: '每个 Requirement 必须至少有一个 #### Scenario:',
            });
          }

          // 严格模式下的额外验证
          if (strict) {
            // 验证是否使用 SHALL/MUST/MAY
            if (!['SHALL', 'MUST', 'MAY', 'SHOULD'].includes(requirement.level)) {
              errors.push({
                file: relativePath,
                line: requirement.lineNumber,
                type: 'format',
                message: `Requirement "${requirement.name}" 没有使用 SHALL/MUST/MAY 关键词`,
                suggestion: '在 Requirement 描述中使用 SHALL、MUST 或 MAY',
              });
            }

            // 验证 Scenario 是否有 WHEN/THEN
            for (const scenario of requirement.scenarios) {
              const hasWhen = scenario.conditions.some((c: any) => c.type === 'WHEN');
              const hasThen = scenario.conditions.some((c: any) => c.type === 'THEN');

              if (!hasWhen || !hasThen) {
                errors.push({
                  file: relativePath,
                  line: scenario.lineNumber,
                  type: 'format',
                  message: `Scenario "${scenario.name}" 缺少 WHEN 或 THEN 条件`,
                  suggestion: 'Scenario 应该包含至少一个 WHEN 和一个 THEN',
                });
              }
            }
          }
        }
      }
    } catch (error) {
      errors.push({
        file: relativePath,
        type: 'format',
        message: `解析 spec 文件失败: ${(error as Error).message}`,
        suggestion: '检查文件格式是否正确',
      });
    }

    return errors;
  }

  /**
   * 查找所有 spec.md 文件
   */
  private findSpecFiles(specsPath: string): string[] {
    const specFiles: string[] = [];
    
    const findRecursive = (dir: string) => {
      const entries = FileOperations.listFiles(dir, false);
      
      for (const entry of entries) {
        if (FileOperations.isDirectory(entry)) {
          findRecursive(entry);
        } else if (entry.endsWith('spec.md')) {
          specFiles.push(entry);
        }
      }
      
      // 检查子目录
      const allEntries = FileOperations.listFiles(dir, false);
      for (const entry of allEntries) {
        if (FileOperations.isDirectory(entry)) {
          findRecursive(entry);
        }
      }
    };

    // 简化：直接列出所有文件
    const walkDir = (dir: string): void => {
      if (!FileOperations.exists(dir)) return;
      
      const fs = require('fs');
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walkDir(fullPath);
        } else if (entry.name === 'spec.md') {
          specFiles.push(fullPath);
        }
      }
    };

    walkDir(specsPath);
    return specFiles;
  }

  /**
   * 从 spec 文件路径提取 capability 名称
   */
  private extractCapability(specPath: string): string {
    // 从路径中提取 specs/ 之后的部分
    const parts = specPath.split(path.sep);
    const specsIndex = parts.indexOf('specs');
    
    if (specsIndex >= 0 && specsIndex < parts.length - 1) {
      const capabilityParts = parts.slice(specsIndex + 1, -1); // 排除最后的 spec.md
      return capabilityParts.join('/');
    }
    
    return 'unknown';
  }
}

