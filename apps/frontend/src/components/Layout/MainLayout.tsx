import React from 'react';
import Sidebar from './Sidebar';
import EditorPane from './EditorPane';
import ChatPane from './ChatPane';
import './MainLayout.css';

const MainLayout: React.FC = () => {
  return (
    <div className="main-layout">
      <Sidebar />
      <EditorPane />
      <ChatPane />
    </div>
  );
};

export default MainLayout;
