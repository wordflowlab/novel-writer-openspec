/**
 * 小说创作模板库索引
 *
 * 提供各类小说创作模板的导出
 */

// 角色模板
import { getProtagonistTemplate } from './characters/protagonist-template.js';
import { getSupportingTemplate } from './characters/supporting-template.js';
import { getVillainTemplate } from './characters/villain-template.js';

// 世界观模板
import { getXuanhuanTemplate } from './worldbuilding/xuanhuan-template.js';
import { getWuxiaTemplate } from './worldbuilding/wuxia-template.js';
import { getUrbanTemplate } from './worldbuilding/urban-template.js';

// 大纲模板
import { getChapterTemplate, getOutlineTemplate } from './outline/chapter-template.js';

// 重新导出
export { getProtagonistTemplate, getSupportingTemplate, getVillainTemplate };
export { getXuanhuanTemplate, getWuxiaTemplate, getUrbanTemplate };
export { getChapterTemplate, getOutlineTemplate };

/**
 * 模板类型定义
 */
export type TemplateType = 'character' | 'worldbuilding' | 'outline';
export type CharacterType = 'protagonist' | 'supporting' | 'villain';
export type WorldbuildingType = 'xuanhuan' | 'wuxia' | 'urban';

/**
 * 模板元数据
 */
export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  category: TemplateType;
  subcategory?: string;
}

/**
 * 所有可用模板的元数据
 */
export const AVAILABLE_TEMPLATES: TemplateMetadata[] = [
  // 角色模板
  {
    id: 'character-protagonist',
    name: '主角规格模板',
    description: '完整的主角角色规格，包含基础设定、成长轨迹、行为模式、对话风格等',
    category: 'character',
    subcategory: 'protagonist'
  },
  {
    id: 'character-supporting',
    name: '配角规格模板',
    description: '配角角色规格，包含角色定位、与主角关系、故事功能等',
    category: 'character',
    subcategory: 'supporting'
  },
  {
    id: 'character-villain',
    name: '反派规格模板',
    description: '反派角色规格，包含动机目标、冲突设定、智慧能力、人性化特征等',
    category: 'character',
    subcategory: 'villain'
  },
  // 世界观模板
  {
    id: 'worldbuilding-xuanhuan',
    name: '玄幻世界观模板',
    description: '玄幻修炼体系，包含等级体系、战力规则、资源体系、金手指系统等',
    category: 'worldbuilding',
    subcategory: 'xuanhuan'
  },
  {
    id: 'worldbuilding-wuxia',
    name: '武侠世界观模板',
    description: '武侠武功体系，包含境界划分、内功招式、兵器体系、江湖势力等',
    category: 'worldbuilding',
    subcategory: 'wuxia'
  },
  {
    id: 'worldbuilding-urban',
    name: '都市世界观模板',
    description: '都市现代背景，包含社会阶层、财富体系、商业活动、人际关系等',
    category: 'worldbuilding',
    subcategory: 'urban'
  },
  // 大纲模板
  {
    id: 'outline-chapter',
    name: '章节大纲模板',
    description: '单章大纲规格，包含开篇、主要情节、角色表现、结尾、伏笔管理等',
    category: 'outline'
  },
  {
    id: 'outline-complete',
    name: '完整大纲模板',
    description: '完整故事大纲框架，包含整体规划、卷数规划、章节功能分配等',
    category: 'outline'
  }
];

/**
 * 根据类型获取模板
 */
export function getTemplate(type: string): string | null {
  switch (type) {
    // 角色模板
    case 'character-protagonist':
      return getProtagonistTemplate('主角姓名', '25', '理性、内向、善良但不圣母');
    case 'character-supporting':
      return getSupportingTemplate('配角姓名', '导师/好友/女主', '与主角的关系');
    case 'character-villain':
      return getVillainTemplate('反派姓名', '前期反派/中期反派/终极反派', '与主角的冲突点');

    // 世界观模板
    case 'worldbuilding-xuanhuan':
      return getXuanhuanTemplate();
    case 'worldbuilding-wuxia':
      return getWuxiaTemplate();
    case 'worldbuilding-urban':
      return getUrbanTemplate();

    // 大纲模板
    case 'outline-chapter':
      return getChapterTemplate(1, '章节标题', '推进情节/塑造角色/展现世界观');
    case 'outline-complete':
      return getOutlineTemplate();

    default:
      return null;
  }
}

/**
 * 获取分类下的所有模板
 */
export function getTemplatesByCategory(category: TemplateType): TemplateMetadata[] {
  return AVAILABLE_TEMPLATES.filter(t => t.category === category);
}

/**
 * 模板使用指南
 */
export const TEMPLATE_GUIDE = `
## 📚 如何使用模板库

### 模板说明

模板库提供了三大类模板：

1. **角色模板** - 快速创建角色规格
   - 主角模板：完整的主角设定
   - 配角模板：重要配角设定
   - 反派模板：立体化的反派设定

2. **世界观模板** - 构建世界观体系
   - 玄幻模板：修炼体系和力量规则
   - 武侠模板：武功体系和江湖规则
   - 都市模板：现代背景和社会体系

3. **大纲模板** - 规划故事情节
   - 章节模板：单章情节规格
   - 完整大纲：整体故事规划

### 使用方式

在 AI 助手对话中，可以请求使用模板：

\`\`\`
请使用主角模板帮我创建主角规格
姓名：陈凡
年龄：25岁
性格：理性、内向、善良但不圣母
\`\`\`

AI 会基于模板生成完整的规格文件，你只需补充 [待补充] 的部分。

### 模板优势

- ✅ **结构完整**：不会遗漏重要部分
- ✅ **格式规范**：符合 NovelSpec 规格要求
- ✅ **可验证**：使用 Requirements + Scenarios 格式
- ✅ **快速开始**：大幅降低初始化成本
`;
