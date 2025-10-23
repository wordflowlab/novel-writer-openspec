export const NOVELSPEC_DIR_NAME = 'novelspec';

export const NOVELSPEC_MARKERS = {
  start: '<!-- NOVELSPEC:START -->',
  end: '<!-- NOVELSPEC:END -->'
};

export interface NovelSpecConfig {
  aiTools: string[];
}

export interface AIToolOption {
  name: string;
  value: string;
  available: boolean;
  successLabel?: string;
}

export const AI_TOOLS: AIToolOption[] = [
  { name: 'Auggie (Augment CLI)', value: 'auggie', available: true, successLabel: 'Auggie' },
  { name: 'Claude Code', value: 'claude', available: true, successLabel: 'Claude Code' },
  { name: 'Cline', value: 'cline', available: true, successLabel: 'Cline' },
  { name: 'CodeBuddy Code (CLI)', value: 'codebuddy', available: true, successLabel: 'CodeBuddy Code' },
  { name: 'Crush', value: 'crush', available: true, successLabel: 'Crush' },
  { name: 'Cursor', value: 'cursor', available: true, successLabel: 'Cursor' },
  { name: 'Factory Droid', value: 'factory', available: true, successLabel: 'Factory Droid' },
  { name: 'OpenCode', value: 'opencode', available: true, successLabel: 'OpenCode' },
  { name: 'Kilo Code', value: 'kilocode', available: true, successLabel: 'Kilo Code' },
  { name: 'Windsurf', value: 'windsurf', available: true, successLabel: 'Windsurf' },
  { name: 'Codex', value: 'codex', available: true, successLabel: 'Codex' },
  { name: 'GitHub Copilot', value: 'github-copilot', available: true, successLabel: 'GitHub Copilot' },
  { name: 'Amazon Q Developer', value: 'amazon-q', available: true, successLabel: 'Amazon Q Developer' },
  { name: 'AGENTS.md (works with Amp, VS Code, …)', value: 'agents', available: false, successLabel: 'your AGENTS.md-compatible assistant' }
];
