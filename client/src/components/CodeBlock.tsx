import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  vscDarkPlus,
  vs,
} from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  theme?: 'light' | 'dark';
  className?: string;
}

// Map our language types to syntax highlighter language identifiers
const mapLanguageToHighlighter = (language?: string): string => {
  if (!language) return 'text';

  const languageMap: Record<string, string> = {
    javascript: 'javascript',
    typescript: 'typescript',
    tsx: 'tsx',
    jsx: 'jsx',
    python: 'python',
    java: 'java',
    c: 'c',
    cpp: 'cpp',
    csharp: 'csharp',
    go: 'go',
    rust: 'rust',
    php: 'php',
    ruby: 'ruby',
    swift: 'swift',
    kotlin: 'kotlin',
    scala: 'scala',
    r: 'r',
    sql: 'sql',
    html: 'markup',
    css: 'css',
    scss: 'scss',
    less: 'less',
    json: 'json',
    xml: 'markup',
    yaml: 'yaml',
    markdown: 'markdown',
    bash: 'bash',
    powershell: 'powershell',
    dockerfile: 'docker',
    other: 'text',
  };

  return languageMap[language.toLowerCase()] || 'text';
};

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  showLineNumbers = true,
  theme = 'dark',
  className = '',
}) => {
  const highlighterLanguage = mapLanguageToHighlighter(language);
  const style = theme === 'dark' ? vscDarkPlus : vs;

  return (
    <div className={`code-block-container ${className}`}>
      <SyntaxHighlighter
        language={highlighterLanguage}
        style={style}
        showLineNumbers={showLineNumbers}
        wrapLines={true}
        wrapLongLines={true}
        customStyle={{
          margin: 0,
          borderRadius: '8px',
          fontSize: '14px',
          lineHeight: '1.5',
        }}
        codeTagProps={{
          style: {
            fontFamily:
              'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
