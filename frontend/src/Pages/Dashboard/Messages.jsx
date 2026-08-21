import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import API from '../../utils/api';
import './Messages.css';

export default function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await API.get('/messages/conversations');
      setConversations(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const res = await API.get(`/messages/${conversationId}/messages`);
      setMessages(res.data.messages);
      setSelectedConversation(conversationId);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await API.post(`/messages/${selectedConversation}`, {
        text: newMessage
      });
      
      setMessages(prev => [...prev, res.data]);
      setNewMessage('');
      // Refresh conversations to update last message
      fetchConversations();
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const startNewConversation = async (userId) => {
    try {
      const res = await API.get(`/messages/conversation/${userId}`);
      setConversations(prev => [res.data, ...prev]);
      fetchMessages(res.data._id);
    } catch (err) {
      console.error('Error starting conversation:', err);
    }
  };

  if (loading) {
    return (
      <div className="messages-page">
        <div className="loading-spinner">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="messages-page">
      <div className="messages-container">
        {/* Conversations List */}
        <div className="conversations-sidebar">
          <div className="conversations-header">
            <h3>Messages</h3>
            <button className="new-chat-btn">
              <i className="fas fa-edit"></i>
            </button>
          </div>
          
          <div className="conversations-list">
            {conversations.length === 0 ? (
              <div className="no-conversations">
                <i className="fas fa-comments"></i>
                <p>No messages yet</p>
              </div>
            ) : (
              conversations.map(conversation => {
                const otherUser = conversation.participants.find(p => p._id !== user._id);
                return (
                  <div
                    key={conversation._id}
                    className={`conversation-item ${selectedConversation === conversation._id ? 'active' : ''}`}
                    onClick={() => fetchMessages(conversation._id)}
                  >
                    <div className="user-avatar">
                      {otherUser?.profilePic ? (
                        <img src={`http://localhost:4000${otherUser.profilePic}`} alt={otherUser.name} />
                      ) : (
                        <i className="fas fa-user"></i>
                      )}
                    </div>
                    <div className="conversation-info">
                      <div className="user-name">{otherUser?.name || 'Unknown User'}</div>
                      <div className="last-message">
                        {conversation.lastMessage?.text || 'Start a conversation...'}
                      </div>
                    </div>
                    <div className="conversation-meta">
                      <div className="time">
                        {conversation.lastMessage ? 
                          new Date(conversation.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : ''
                        }
                      </div>
                      {conversation.unreadCount?.get(user._id) > 0 && (
                        <div className="unread-badge">
                          {conversation.unreadCount.get(user._id)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          {selectedConversation ? (
            <>
              <div className="chat-header">
                {(() => {
                  const conversation = conversations.find(c => c._id === selectedConversation);
                  const otherUser = conversation?.participants.find(p => p._id !== user._id);
                  return (
                    <>
                      <div className="chat-user-info">
                        <div className="user-avatar">
                          {otherUser?.profilePic ? (
                            <img src={`http://localhost:4000${otherUser.profilePic}`} alt={otherUser.name} />
                          ) : (
                            <i className="fas fa-user"></i>
                          )}
                        </div>
                        <div className="user-details">
                          <div className="user-name">{otherUser?.name || 'Unknown User'}</div>
                          {otherUser?.isVerified && (
                            <span className="verified-badge">
                              <i className="fas fa-check-circle"></i>
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="chat-actions">
                        <button className="action-btn">
                          <i className="fas fa-phone"></i>
                        </button>
                        <button className="action-btn">
                          <i className="fas fa-video"></i>
                        </button>
                        <button className="action-btn">
                          <i className="fas fa-ellipsis-v"></i>
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="messages-list">
                {messages.length === 0 ? (
                  <div className="no-messages">
                    <i className="fas fa-comment"></i>
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map(message => (
                    <div
                      key={message._id}
                      className={`message ${message.sender._id === user._id ? 'sent' : 'received'}`}
                    >
                      <div className="message-content">
                        {message.text && <p>{message.text}</p>}
                        {message.media && (
                          <div className="message-media">
                            {message.media.type === 'image' ? (
                              <img src={`http://localhost:4000${message.media.url}`} alt="Shared content" />
                            ) : (
                              <div className="file-message">
                                <i className="fas fa-file"></i>
                                <span>File attached</span>
                              </div>
                            )}
                          </div>
                        )}
                        <div className="message-time">
                          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form className="message-input-form" onSubmit={sendMessage}>
                <div className="input-container">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="message-input"
                  />
                  <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="no-chat-selected">
              <i className="fas fa-comments"></i>
              <h3>Select a conversation</h3>
              <p>Choose a conversation from the list to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}