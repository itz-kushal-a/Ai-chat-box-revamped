import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import EditorPane from './EditorPane';
import ChatPane from './ChatPane';
import Login from '../Auth/Login';
import { useAuth } from '../../context/AuthContext';
import { FileNode } from '@ai-chat-box/shared';
import './MainLayout.css';

const MainLayout: React.FC = () => {
  const { isAuthenticated, isLoading: isAuthLoading, token } = useAuth();
  const [activeFile, setActiveFile] = useState<FileNode | null>(null);
  const [activeFileContent, setActiveFileContent] = useState<string>('');
  const [isEditorLoading, setIsEditorLoading] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const handleFileSelect = (file: FileNode) => {
    if (isDirty) {
      if (!window.confirm('You have unsaved changes. Discard them?')) {
        return;
      }
    }
    setActiveFile(file);
    setIsDirty(false);
  };

  const handleChatSelect = (chatId: string | null) => {
    setActiveChatId(chatId);
  };

  const handleContentChange = (newContent: string) => {
    if (newContent !== activeFileContent) {
      setIsDirty(true);
    } else {
      setIsDirty(false);
    }
  };

  const handleSaveFile = async (content: string) => {
    if (!activeFile || !token) return;

    try {
      const response = await fetch('http://localhost:3001/api/project/file', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          filePath: activeFile.path,
          content: content
        })
      });

      if (response.ok) {
        setActiveFileContent(content);
        setIsDirty(false);
        console.log('File saved successfully');
      } else {
        console.error('Failed to save file');
      }
    } catch (err) {
      console.error('Error saving file:', err);
    }
  };

  const handleApplyCode = async (newContent: string) => {
    await handleSaveFile(newContent);
  };

  useEffect(() => {
    if (!activeFile || !token) {
      setActiveFileContent('');
      return;
    }

    setIsEditorLoading(true);
    fetch(`http://localhost:3001/api/project/file?filePath=${encodeURIComponent(activeFile.path)}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(json => {
        if (json.status === 'success') {
          setActiveFileContent(json.data.content);
        }
        setIsEditorLoading(false);
        setIsDirty(false);
      })
      .catch(err => {
        console.error('Failed to fetch file content:', err);
        setIsEditorLoading(false);
      });
  }, [activeFile, token]);

  if (isAuthLoading) {
    return <div className="loading-screen">Loading AI-Chat-Box...</div>;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="main-layout">
      <Sidebar 
        onFileSelect={handleFileSelect} 
        onChatSelect={handleChatSelect}
        activeChatId={activeChatId}
      />
      <EditorPane 
        activeFile={activeFile} 
        content={activeFileContent} 
        isLoading={isEditorLoading} 
        onSave={handleSaveFile}
        onContentChange={handleContentChange}
        isDirty={isDirty}
      />
      <ChatPane 
        activeFile={activeFile ? { ...activeFile, content: activeFileContent } : null} 
        chatId={activeChatId}
        onChatCreated={(id) => setActiveChatId(id)}
        onApplyCode={handleApplyCode}
      />
    </div>
  );
};

export default MainLayout;
