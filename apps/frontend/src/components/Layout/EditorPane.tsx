import React from 'react';
import './EditorPane.css';

const EditorPane: React.FC = () => {
  return (
    <main className="editor-pane">
      <div className="editor-header">
        <div className="tab active">App.tsx</div>
      </div>
      <div className="editor-content">
        <pre><code>{`// Start coding here...`}</code></pre>
      </div>
    </main>
  );
};

export default EditorPane;
