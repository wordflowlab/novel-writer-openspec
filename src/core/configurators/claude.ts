import path from 'path';
import { ToolConfigurator } from './base.js';
import { FileSystemUtils } from '../../utils/file-system.js';
import { TemplateManager } from '../templates/index.js';
import { NOVELSPEC_MARKERS } from '../config.js';

export class ClaudeConfigurator implements ToolConfigurator {
  name = 'Claude Code';
  configFileName = '.clauderc';
  isAvailable = true;

  async configure(projectPath: string, novelspecDir: string): Promise<void> {
    const filePath = path.join(projectPath, this.configFileName);
    const content = TemplateManager.getClaudeTemplate();

    await FileSystemUtils.updateFileWithMarkers(
      filePath,
      content,
      NOVELSPEC_MARKERS.start,
      NOVELSPEC_MARKERS.end
    );
  }
}
