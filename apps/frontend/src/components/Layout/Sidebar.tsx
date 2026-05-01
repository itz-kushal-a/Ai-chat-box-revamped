import React from 'react';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        EXPLORER
      </div>
      <div className="sidebar-content">
        {/* File tree will go here */}
        <div className="file-item">src</div>
        <div className="file-item indent">App.tsx</div>
        <div className="file-item indent">main.tsx</div>
        <div className="file-item indent">index.css</div>
      </div>
    </aside>
  );
};

export default Sidebar;
