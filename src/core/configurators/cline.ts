import path from 'path';
import { ToolConfigurator } from './base.js';
import { FileSystemUtils } from '../../utils/file-system.js';
import { TemplateManager } from '../templates/index.js';
import { NOVELSPEC_MARKERS } from '../config.js';

export class ClineConfigurator implements ToolConfigurator {
  name = 'Cline';
  configFileName = '.clinerules';
  isAvailable = true;

  async configure(projectPath: string, _novelspecDir: string): Promise<void> {
    const filePath = path.join(projectPath, '.clinerules', 'novelspec.md');
    const content = TemplateManager.getClineTemplate();

    await FileSystemUtils.updateFileWithMarkers(
      filePath,
      content,
      NOVELSPEC_MARKERS.start,
      NOVELSPEC_MARKERS.end
    );
  }
}
