/**
 * Markdown 解析器 - 解析 OpenSpec 格式的规格文件
 */

export interface Scenario {
  name: string;
  conditions: {
    type: 'WHEN' | 'THEN';
    text: string;
  }[];
  lineNumber?: number;
}

export interface Requirement {
  name: string;
  level: 'SHALL' | 'MUST' | 'MAY' | 'SHOULD';
  description: string;
  scenarios: Scenario[];
  lineNumber?: number;
}

export interface SpecFile {
  path: string;
  purpose: string;
  requirements: Requirement[];
}

export interface DeltaOperation {
  type: 'ADDED' | 'MODIFIED' | 'REMOVED' | 'RENAMED';
  requirements: Requirement[];
}

export interface DeltaSpec {
  capability: string;
  operations: DeltaOperation[];
}

/**
 * Markdown 解析器类
 */
export class MarkdownParser {
  /**
   * 解析规格文件
   */
  parseSpec(content: string, filePath: string = ''): SpecFile {
    const lines = content.split('\n');
    const purpose = this.extractPurpose(lines);
    const requirements = this.extractRequirements(lines);

    return {
      path: filePath,
      purpose,
      requirements,
    };
  }

  /**
   * 解析 delta spec（变更增量）
   */
  parseDelta(content: string, capability: string = ''): DeltaSpec {
    const lines = content.split('\n');
    const operations: DeltaOperation[] = [];

    let currentOperation: DeltaOperation | null = null;
    let currentRequirement: Requirement | null = null;
    let currentScenario: Scenario | null = null;
    let inRequirement = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // 识别操作类型
      if (trimmedLine.startsWith('## ADDED Requirements')) {
        currentOperation = { type: 'ADDED', requirements: [] };
        operations.push(currentOperation);
        inRequirement = false;
        continue;
      } else if (trimmedLine.startsWith('## MODIFIED Requirements')) {
        currentOperation = { type: 'MODIFIED', requirements: [] };
        operations.push(currentOperation);
        inRequirement = false;
        continue;
      } else if (trimmedLine.startsWith('## REMOVED Requirements')) {
        currentOperation = { type: 'REMOVED', requirements: [] };
        operations.push(currentOperation);
        inRequirement = false;
        continue;
      } else if (trimmedLine.startsWith('## RENAMED Requirements')) {
        currentOperation = { type: 'RENAMED', requirements: [] };
        operations.push(currentOperation);
        inRequirement = false;
        continue;
      }

      // 识别 Requirement
      if (trimmedLine.startsWith('### Requirement:')) {
        if (currentRequirement && currentOperation) {
          currentOperation.requirements.push(currentRequirement);
        }

        const name = trimmedLine.substring('### Requirement:'.length).trim();
        currentRequirement = {
          name,
          level: 'SHALL',
          description: '',
          scenarios: [],
          lineNumber: i + 1,
        };
        inRequirement = true;
        currentScenario = null;
        continue;
      }

      // 识别 Scenario
      if (trimmedLine.startsWith('#### Scenario:')) {
        if (currentScenario && currentRequirement) {
          currentRequirement.scenarios.push(currentScenario);
        }

        const name = trimmedLine.substring('#### Scenario:'.length).trim();
        currentScenario = {
          name,
          conditions: [],
          lineNumber: i + 1,
        };
        continue;
      }

      // 提取 Requirement 描述和关键词
      if (inRequirement && !currentScenario && currentRequirement) {
        if (trimmedLine) {
          currentRequirement.description += trimmedLine + ' ';
          
          // 提取 SHALL/MUST/MAY/SHOULD
          if (trimmedLine.includes('SHALL') || trimmedLine.includes('应该（SHALL）')) {
            currentRequirement.level = 'SHALL';
          } else if (trimmedLine.includes('MUST') || trimmedLine.includes('必须（MUST）')) {
            currentRequirement.level = 'MUST';
          } else if (trimmedLine.includes('MAY') || trimmedLine.includes('可以（MAY）')) {
            currentRequirement.level = 'MAY';
          } else if (trimmedLine.includes('SHOULD')) {
            currentRequirement.level = 'SHOULD';
          }
        }
      }

      // 提取 Scenario 条件（WHEN/THEN）
      if (currentScenario) {
        if (trimmedLine.startsWith('- **WHEN**')) {
          const text = trimmedLine.substring('- **WHEN**'.length).trim();
          currentScenario.conditions.push({ type: 'WHEN', text });
        } else if (trimmedLine.startsWith('- **THEN**')) {
          const text = trimmedLine.substring('- **THEN**'.length).trim();
          currentScenario.conditions.push({ type: 'THEN', text });
        }
      }
    }

    // 添加最后的 Requirement 和 Scenario
    if (currentScenario && currentRequirement) {
      currentRequirement.scenarios.push(currentScenario);
    }
    if (currentRequirement && currentOperation) {
      currentOperation.requirements.push(currentRequirement);
    }

    return {
      capability,
      operations,
    };
  }

  /**
   * 提取 Purpose 章节
   */
  private extractPurpose(lines: string[]): string {
    let inPurpose = false;
    let purpose = '';

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith('## Purpose')) {
        inPurpose = true;
        continue;
      }

      if (inPurpose) {
        if (trimmedLine.startsWith('##')) {
          break;
        }
        if (trimmedLine) {
          purpose += trimmedLine + ' ';
        }
      }
    }

    return purpose.trim();
  }

  /**
   * 提取 Requirements
   */
  private extractRequirements(lines: string[]): Requirement[] {
    const requirements: Requirement[] = [];
    let currentRequirement: Requirement | null = null;
    let currentScenario: Scenario | null = null;
    let inRequirement = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // 识别 Requirement
      if (trimmedLine.startsWith('### Requirement:')) {
        if (currentRequirement) {
          requirements.push(currentRequirement);
        }

        const name = trimmedLine.substring('### Requirement:'.length).trim();
        currentRequirement = {
          name,
          level: 'SHALL',
          description: '',
          scenarios: [],
          lineNumber: i + 1,
        };
        inRequirement = true;
        currentScenario = null;
        continue;
      }

      // 识别 Scenario
      if (trimmedLine.startsWith('#### Scenario:')) {
        if (currentScenario && currentRequirement) {
          currentRequirement.scenarios.push(currentScenario);
        }

        const name = trimmedLine.substring('#### Scenario:'.length).trim();
        currentScenario = {
          name,
          conditions: [],
          lineNumber: i + 1,
        };
        inRequirement = false;
        continue;
      }

      // 停止解析其他 ## 章节
      if (trimmedLine.startsWith('## ') && !trimmedLine.startsWith('## Requirements')) {
        inRequirement = false;
      }

      // 提取 Requirement 描述
      if (inRequirement && !currentScenario && currentRequirement) {
        if (trimmedLine && !trimmedLine.startsWith('#')) {
          currentRequirement.description += trimmedLine + ' ';
          
          // 提取关键词
          if (trimmedLine.includes('SHALL') || trimmedLine.includes('应该（SHALL）')) {
            currentRequirement.level = 'SHALL';
          } else if (trimmedLine.includes('MUST') || trimmedLine.includes('必须（MUST）')) {
            currentRequirement.level = 'MUST';
          } else if (trimmedLine.includes('MAY') || trimmedLine.includes('可以（MAY）')) {
            currentRequirement.level = 'MAY';
          } else if (trimmedLine.includes('SHOULD')) {
            currentRequirement.level = 'SHOULD';
          }
        }
      }

      // 提取 Scenario 条件
      if (currentScenario) {
        if (trimmedLine.startsWith('- **WHEN**')) {
          const text = trimmedLine.substring('- **WHEN**'.length).trim();
          currentScenario.conditions.push({ type: 'WHEN', text });
        } else if (trimmedLine.startsWith('- **THEN**')) {
          const text = trimmedLine.substring('- **THEN**'.length).trim();
          currentScenario.conditions.push({ type: 'THEN', text });
        }
      }
    }

    // 添加最后的 Scenario 和 Requirement
    if (currentScenario && currentRequirement) {
      currentRequirement.scenarios.push(currentScenario);
    }
    if (currentRequirement) {
      requirements.push(currentRequirement);
    }

    return requirements;
  }
}

