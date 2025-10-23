import * as fs from 'fs';
import * as path from 'path';

/**
 * 文件和目录操作工具类
 */
export class FileOperations {
  /**
   * 检查文件或目录是否存在
   */
  static exists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  /**
   * 创建目录（递归创建）
   */
  static createDirectory(dirPath: string): void {
    if (!this.exists(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * 读取文件内容
   */
  static readFile(filePath: string): string {
    return fs.readFileSync(filePath, 'utf-8');
  }

  /**
   * 写入文件内容
   */
  static writeFile(filePath: string, content: string): void {
    const dir = path.dirname(filePath);
    this.createDirectory(dir);
    fs.writeFileSync(filePath, content, 'utf-8');
  }

  /**
   * 复制文件
   */
  static copyFile(source: string, destination: string): void {
    const content = this.readFile(source);
    this.writeFile(destination, content);
  }

  /**
   * 复制目录（递归）
   */
  static copyDirectory(source: string, destination: string): void {
    this.createDirectory(destination);
    const entries = fs.readdirSync(source, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(source, entry.name);
      const destPath = path.join(destination, entry.name);

      if (entry.isDirectory()) {
        this.copyDirectory(srcPath, destPath);
      } else {
        this.copyFile(srcPath, destPath);
      }
    }
  }

  /**
   * 列出目录中的文件
   */
  static listFiles(dirPath: string, recursive: boolean = false): string[] {
    if (!this.exists(dirPath)) {
      return [];
    }

    const files: string[] = [];
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory() && recursive) {
        files.push(...this.listFiles(fullPath, true));
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * 获取文件的绝对路径
   */
  static resolvePath(...pathSegments: string[]): string {
    return path.resolve(...pathSegments);
  }

  /**
   * 获取文件名（不含扩展名）
   */
  static getBaseName(filePath: string): string {
    return path.basename(filePath, path.extname(filePath));
  }

  /**
   * 检查路径是否是目录
   */
  static isDirectory(dirPath: string): boolean {
    if (!this.exists(dirPath)) {
      return false;
    }
    return fs.statSync(dirPath).isDirectory();
  }
}

