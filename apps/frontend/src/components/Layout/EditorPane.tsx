import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { FileNode } from '@ai-chat-box/shared';
import './EditorPane.css';

interface EditorPaneProps {
  activeFile: FileNode | null;
  content: string;
  isLoading: boolean;
  onSave: (content: string) => void;
  onContentChange: (content: string) => void;
  isDirty: boolean;
}

const EditorPane: React.FC<EditorPaneProps> = ({ 
  activeFile, 
  content, 
  isLoading, 
  onSave, 
  onContentChange,
  isDirty 
}) => {
  const [localContent, setLocalContent] = useState(content);

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  const handleEditorChange = (value: string | undefined) => {
    const newValue = value || '';
    setLocalContent(newValue);
    onContentChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      onSave(localContent);
    }
  };

  return (
    <main className="editor-pane" onKeyDown={handleKeyDown}>
      <div className="editor-header">
        {activeFile && (
          <div className={`tab active ${isDirty ? 'dirty' : ''}`}>
            {activeFile.name}
            {isDirty && <span className="dirty-indicator">•</span>}
          </div>
        )}
        <div className="header-actions">
          {activeFile && (
            <button 
              className="save-btn" 
              onClick={() => onSave(localContent)}
              disabled={!isDirty || isLoading}
            >
              Save
            </button>
          )}
        </div>
      </div>
      <div className="editor-content">
        {isLoading ? (
          <div className="loading">Loading content...</div>
        ) : activeFile ? (
          <Editor
            height="100%"
            theme="vs-dark"
            language={activeFile.language || 'typescript'}
            value={localContent}
            onChange={handleEditorChange}
            options={{
              readOnly: false,
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: 'Fira Code, Consolas, monospace',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
            }}
          />
        ) : (
          <div className="empty-editor">Select a file to start editing</div>
        )}
      </div>
    </main>
  );
};

export default EditorPane;
