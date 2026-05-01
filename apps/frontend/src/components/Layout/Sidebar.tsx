import React, { useState, useEffect } from 'react';
import { FileNode } from '@ai-chat-box/shared';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

interface SidebarProps {
  onFileSelect: (file: FileNode) => void;
  onChatSelect: (chatId: string | null) => void;
  activeChatId: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ onFileSelect, onChatSelect, activeChatId }) => {
  const { token, logout } = useAuth();
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [loadingChats, setLoadingChats] = useState(true);
  const [activeTab, setActiveTab] = useState<'files' | 'chats'>('files');

  useEffect(() => {
    if (!token) return;

    // Fetch files
    fetch('http://localhost:3001/api/project/tree', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(json => {
        if (json.status === 'success') {
          setFileTree(json.data.tree);
        }
        setLoadingFiles(false);
      })
      .catch(err => {
        console.error('Failed to fetch file tree:', err);
        setLoadingFiles(false);
      });

    // Fetch chat history
    fetch('http://localhost:3001/api/history', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(json => {
        if (json.status === 'success') {
          setChats(json.data.chats);
        }
        setLoadingChats(false);
      })
      .catch(err => {
        console.error('Failed to fetch chat history:', err);
        setLoadingChats(false);
      });
  }, [activeChatId, token]);

  const renderTree = (nodes: FileNode[], level = 0) => {
    return nodes.map(node => (
      <div key={node.id}>
        <div 
          className={`file-item ${node.type}`} 
          style={{ paddingLeft: `${level * 12 + 12}px` }}
          onClick={() => node.type === 'file' && onFileSelect(node)}
        >
          <span className="icon">{node.type === 'directory' ? '📁' : '📄'}</span>
          {node.name}
        </div>
        {node.children && renderTree(node.children, level + 1)}
      </div>
    ));
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-tabs">
        <button 
          className={activeTab === 'files' ? 'active' : ''} 
          onClick={() => setActiveTab('files')}
        >
          Files
        </button>
        <button 
          className={activeTab === 'chats' ? 'active' : ''} 
          onClick={() => setActiveTab('chats')}
        >
          Chats
        </button>
      </div>

      <div className="sidebar-content">
        {activeTab === 'files' ? (
          <>
            <div className="sidebar-section-header">EXPLORER</div>
            {loadingFiles ? <div className="loading">Loading...</div> : renderTree(fileTree)}
          </>
        ) : (
          <>
            <div className="sidebar-section-header">
              HISTORY
              <button className="new-chat-btn" onClick={() => onChatSelect(null)}>+</button>
            </div>
            {loadingChats ? (
              <div className="loading">Loading...</div>
            ) : (
              <div className="chat-history-list">
                {chats.length === 0 && <div className="empty-msg">No chats yet</div>}
                {chats.map(chat => (
                  <div 
                    key={chat.id} 
                    className={`chat-history-item ${activeChatId === chat.id ? 'active' : ''}`}
                    onClick={() => onChatSelect(chat.id)}
                  >
                    <div className="chat-title">{chat.title || 'Untitled Chat'}</div>
                    <div className="chat-meta">{new Date(chat.createdAt).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>
    </aside>
  );
};

export default Sidebar;
