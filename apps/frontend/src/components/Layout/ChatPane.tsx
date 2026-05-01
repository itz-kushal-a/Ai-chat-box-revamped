import React, { useState, useEffect, useRef } from 'react';
import { Message, FileNode, ChatRequest, AIProviderType } from '@ai-chat-box/shared';
import { useAuth } from '../../context/AuthContext';
import MarkdownContent from '../Chat/MarkdownContent';
import './ChatPane.css';

interface ChatPaneProps {
  activeFile: (FileNode & { content: string }) | null;
  chatId: string | null;
  onChatCreated: (id: string) => void;
  onApplyCode: (content: string) => void;
}

const ChatPane: React.FC<ChatPaneProps> = ({ activeFile, chatId, onChatCreated, onApplyCode }) => {
  const { token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<AIProviderType>('openai');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (chatId && token) {
      setIsLoading(true);
      fetch(`http://localhost:3001/api/chat/${chatId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(json => {
          if (json.status === 'success') {
            setMessages(json.data.chat.messages);
          }
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Failed to load chat messages:', err);
          setIsLoading(false);
        });
    } else {
      setMessages([]);
    }
  }, [chatId, token]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !token) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const request: ChatRequest = {
        messages: [...messages, userMessage],
        activeFile: activeFile ? {
          path: activeFile.path,
          content: activeFile.content,
          language: activeFile.language
        } : undefined,
        chatId: chatId || undefined,
        provider: provider
      };

      const response = await fetch('http://localhost:3001/api/chat-stream', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) throw new Error('Streaming failed');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';
      let receivedChatId = chatId;

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunkText = decoder.decode(value);
          const lines = chunkText.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6).trim();
              if (dataStr === '[DONE]') break;
              
              try {
                const { chunk: contentChunk, chatId: respChatId } = JSON.parse(dataStr);
                accumulatedContent += contentChunk;
                
                if (!receivedChatId && respChatId) {
                  receivedChatId = respChatId;
                  onChatCreated(respChatId);
                }

                setMessages((prev) => {
                  const last = prev[prev.length - 1];
                  if (last.id === assistantMessageId) {
                    return [...prev.slice(0, -1), { ...last, content: accumulatedContent }];
                  }
                  return prev;
                });
              } catch (e) {
                console.error('Error parsing chunk:', e);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages((prev) => [...prev.slice(0, -1), { 
        id: assistantMessageId, 
        role: 'assistant', 
        content: 'Sorry, I encountered an error while processing your request.', 
        timestamp: Date.now() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="chat-pane">
      <div className="chat-header">
        <div className="header-title">
          AI ASSISTANT
          <select 
            className="provider-select" 
            value={provider} 
            onChange={(e) => setProvider(e.target.value as AIProviderType)}
          >
            <option value="openai">OpenAI (GPT-3.5)</option>
            <option value="gemini">Google Gemini</option>
            <option value="anthropic">Anthropic Claude</option>
          </select>
        </div>
        {chatId && <span className="chat-id-tag">ID: {chatId.slice(0, 8)}</span>}
      </div>
      
      <div className="chat-messages">
        {messages.length === 0 && !isLoading && (
          <div className="welcome-msg">
            How can I help you with your code today?
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`message-bubble ${msg.role}`}>
            <div className="role-label">{msg.role.toUpperCase()}</div>
            <div className="content">
              {msg.role === 'assistant' ? (
                <MarkdownContent 
                  content={msg.content} 
                  onApplyCode={onApplyCode}
                  activeFileName={activeFile?.name}
                />
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length-1]?.content === '' && (
          <div className="loading-indicator">AI is thinking...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {activeFile && (
        <div className="quick-actions">
          <button onClick={() => setInput('Please explain this file.')}>Explain</button>
          <button onClick={() => setInput('Find and fix bugs in this file.')}>Fix</button>
        </div>
      )}

      <div className="chat-input-wrapper">
        <textarea 
          placeholder="Ask anything..." 
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
          disabled={isLoading}
        />
        <button className="send-btn" onClick={handleSend} disabled={isLoading || !input.trim()}>
          {isLoading ? '...' : 'Send'}
        </button>
      </div>
    </section>
  );
};

export default ChatPane;
