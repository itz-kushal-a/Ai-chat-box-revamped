import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownContentProps {
  content: string;
  onApplyCode?: (code: string) => void;
  activeFileName?: string;
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({ content, onApplyCode, activeFileName }) => {
  return (
    <ReactMarkdown
      components={{
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '');
          const codeString = String(children).replace(/\n$/, '');

          if (!inline && match) {
            return (
              <div className="code-block-wrapper">
                <div className="code-block-header">
                  <span className="lang-tag">{match[1]}</span>
                  {onApplyCode && activeFileName && (
                    <button 
                      className="apply-inline-btn"
                      onClick={() => onApplyCode(codeString)}
                    >
                      Apply to {activeFileName}
                    </button>
                  )}
                </div>
                <SyntaxHighlighter
                  {...props}
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{ margin: 0, borderRadius: '0 0 4px 4px', fontSize: '12px' }}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            );
          }
          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownContent;
