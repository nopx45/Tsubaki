import React, { useState, useEffect, useRef } from 'react';
import { Badge, Avatar, Button, Input, Tooltip } from 'antd';
import { CloseOutlined, SendOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import { BsFillChatDotsFill, BsStars } from "react-icons/bs";
import { RiChatNewLine, RiMoonFill, RiSparkling2Fill } from "react-icons/ri";
import { IoMdNotifications } from "react-icons/io";
import { motion, AnimatePresence } from 'framer-motion';
import useWebSocket from '../../socket';
import { DeleteMessagesByMany, getAuthToken, GetMessagesByUsername } from '../../services/https';
import { jwtDecode } from 'jwt-decode';
import { WS_URL } from '../../socket';

interface ChatComponentProps {
  isLoggedIn: boolean;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ isLoggedIn }) => {
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage } = useWebSocket(WS_URL);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ID: number; text: string; sender: string; role: 'user' | 'admin'; time: string }>>([]);
  const [newMessage, setNewMessage] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [username, setUsername] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [pulse, setPulse] = useState(false);

  const [selectMode, setSelectMode] = useState(false);
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);


useEffect(() => {
  if (isChatOpen) {
    setTimeout(() => {
      if (chatBodyRef.current) {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      }
    }, 100);
  }
}, [isChatOpen]);

useEffect(() => {
  const fetchUserAndChat = async () => {
    const token = await getAuthToken();
    if (token) {
      const decoded = jwtDecode(token);
      const username = (decoded as any).username;
      setUsername(username);

      // ⬇️ ดึงข้อความย้อนหลังจาก backend
      try {
        const response = await GetMessagesByUsername(username);
        const formattedMessages = response.data.map((msg: any) => ({
          ID: msg.ID,
          text: msg.content,
          sender: msg.from,
          role: msg.role === 'admin' ? 'admin' : 'user',
          time: new Date(msg.created_at || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }));

        setChatMessages(formattedMessages);
        // scroll to bottom after setting history
        setTimeout(() => {
          if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
          }
        }, 200);
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
      }
    }
  };
  fetchUserAndChat();
}, []);


  useEffect(() => {
    if (messages.length === 0) return;
  
    const lastMessage = messages[messages.length - 1];
  
    if (!lastMessage?.ID) {
  console.warn("🟡 WebSocket message has no ID:", lastMessage);
}
    try {
      const formattedMessage = {
        ID: lastMessage.ID,
        text: lastMessage.content,
        sender: lastMessage.from,
        role: lastMessage.role === "admin" ? "admin" : "user" as "user" | "admin",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
  
      setChatMessages(prevMessages => [...prevMessages, formattedMessage]);
  
      if (!isChatOpen) {
        setUnreadCount(prev => prev + 1);
        setPulse(true);
        setTimeout(() => setPulse(false), 1000);
      }
    } catch (error) {
      console.error("Error formatting message:", error);
    }
    
    setTimeout(() => {
      if (chatBodyRef.current) {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      }
    }, 100);
  }, [messages]);
  
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setUnreadCount(0);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    
    sendMessage(JSON.stringify({ 
      type: "send_message", 
      from: username, 
      role: "user", 
      content: newMessage 
    }));
    
    setNewMessage("");
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

 const handleDeleteSelectedMessages = async () => {
  try {
    const selectedMessages = selectedIndexes.map(i => chatMessages[i]);
    const selectedIds = selectedMessages.map(m => m.ID);

    await DeleteMessagesByMany(selectedIds);

    const remaining = chatMessages.filter((_, i) => !selectedIndexes.includes(i));
    setChatMessages(remaining);
    setSelectMode(false);
    setSelectedIndexes([]);
  } catch (err) {
    console.error("Failed to delete messages:", err);
  }
};

  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      <Tooltip title="Live Chat Support" placement="left">
        <motion.div 
          className="chat-button"
          onClick={toggleChat}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Badge 
            count={!isChatOpen ? unreadCount : 0} 
            size="small" 
            offset={[-5, 5]}
            className="chat-badge"
          >
            <motion.div
              animate={{ 
                rotate: isChatOpen ? [0, 10, -10, 0] : 0,
                scale: isChatOpen ? 1.1 : pulse ? [1, 1.1, 1] : 1,
              }}
              transition={{ duration: 0.5 }}
            >
              <Avatar 
                size={64} 
                icon={isChatOpen ? 
                  <RiChatNewLine className="chat-icon" /> : 
                  <BsFillChatDotsFill className="chat-icon" />} 
                className={`chat-avatar ${isChatOpen ? 'chat-open' : ''}`}
              />
            </motion.div>
          </Badge>
          {!isChatOpen && (
            <motion.div
              className="floating-stars"
              animate={{
                y: [0, -5, 0],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut"
              }}
            >
              <RiSparkling2Fill />
            </motion.div>
          )}
        </motion.div>
      </Tooltip>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            className="chat-container"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 25 }}
          >
            <div className="chat-header">
              <div className="header-content">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    repeatDelay: 5,
                    duration: 2
                  }}
                >
                  <Avatar 
                    size={32} 
                    icon={<CustomerServiceOutlined />} 
                    className="admin-icon"
                  />
                </motion.div>
                <h3 className="chat-title">
                  <div className="title-content">
                    <span>Live Support</span>
                    <RiMoonFill className="moon-icon" />
                  </div>
                  {isTyping && (
                    <motion.span 
                      className="typing-indicator"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <span className="typing-text">
                        is typing
                        <span className="typing-dots">
                          <span>.</span>
                          <span>.</span>
                          <span>.</span>
                        </span>
                      </span>
                    </motion.span>
                  )}
                </h3>
              </div>
              <Button 
                type="text" 
                icon={<CloseOutlined className="close-icon" />} 
                onClick={toggleChat} 
                className="close-button"
              />
            </div>

            <div className="chat-body" ref={chatBodyRef}>
              <div className="welcome-message">
                <motion.div
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    ease: "easeInOut"
                  }}
                >
                  <Avatar 
                    size={48} 
                    icon={<CustomerServiceOutlined />} 
                    className="welcome-avatar"
                  />
                </motion.div>
                <div className="welcome-text">
                  <div className="welcome-title">
                    <strong>Admin Support</strong>
                    <IoMdNotifications className="notification-icon" />
                  </div>
                  <p>Hello! How can we help you today?</p>
                  <small className="welcome-subtext">
                    <BsStars className="star-icon" /> We usually reply within minutes
                  </small>
                </div>
              </div>

              {chatMessages.map((msg, index) => (
                <motion.div 
                  key={msg.ID}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`message-container ${msg.role === 'user' ? 'user-message-container' : 'system-message-container'}`}
                >
                  <div className={`message ${msg.role === 'user' ? 'user-message' : 'system-message'}`}>
                    {/* ถ้าอยู่ใน selectMode ให้แสดง checkbox */}
                    {selectMode ? (
                      <input 
                        type="checkbox" 
                        checked={selectedIndexes.includes(index)}
                        onChange={() => {
                          setSelectedIndexes((prev) =>
                            prev.includes(index)
                              ? prev.filter(i => i !== index)
                              : [...prev, index]
                          );
                        }}
                        style={{ marginRight: 8 }}
                      />
                    ) : (
                      msg.role === "user" && (
                        <div 
                          style={{ position: "absolute", left: -24, top: 8, cursor: "pointer", color: "#888" }}
                          onClick={() => setSelectMode(true)}
                        >
                          ...
                        </div>
                      )
                    )}

                    {msg.role === 'admin' && (
                      <div className="message-sender">
                        Admin Support
                        <RiSparkling2Fill className="sender-icon" />
                      </div>
                    )}
                    <div className="message-text">{msg.text}</div>
                    <div className="message-time">
                      {msg.time}
                      {msg.role === 'user' && (
                        <span className="message-status">
                          
                          <motion.span
                            animate={{ opacity: [0.6, 1, 0.6] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          >
                            ✓
                          </motion.span>
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {selectMode && (
              <div style={{ padding: '8px 16px', display: 'flex', justifyContent: 'space-between' }}>
                <Button 
                  type="default" 
                  danger 
                  onClick={handleDeleteSelectedMessages}
                >
                  Delete Selected
                </Button>
                <Button 
                  style={{ marginLeft: 8 }} 
                  onClick={() => {
                    setSelectMode(false);
                    setSelectedIndexes([]);
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}

            <div className="chat-footer">
              <Input.TextArea
                placeholder={`Type your message...`}
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  setIsTyping(e.target.value.length > 0);
                }}
                onKeyDown={handleKeyDown}
                autoSize={{ minRows: 1, maxRows: 4 }}
                className="chat-input"
              />
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  type="primary" 
                  shape="circle" 
                  icon={<SendOutlined style={{ fontSize: 16 }} />}
                  className="send-button"
                  disabled={!newMessage.trim()}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
      /* Base Styles */
      .chat-button {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 1000;
        cursor: pointer;
        filter: drop-shadow(0 4px 12px rgba(107, 115, 255, 0.5));
      }

      .chat-badge .ant-badge-count {
        background: linear-gradient(135deg, #9F7AEA 0%, #6B73FF 100%);
        box-shadow: 0 0 0 2px #6B73FF;
      }

      .floating-stars {
        position: absolute;
        top: -10px;
        right: -10px;
        font-size: 24px;
        color: rgba(255, 255, 255, 0.8);
      }

      .chat-icon {
        color: white;
      }

      .chat-avatar {
        box-shadow: 0 4px 20px rgba(107, 115, 255, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        background: linear-gradient(135deg, #6B73FF 0%, #000DFF 100%);
      }

      .chat-avatar.chat-open {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      /* Chat Container */
      .chat-container {
        position: fixed;
        bottom: 100px;
        right: 24px;
        width: 350px;
        height: 500px;
        border-radius: 16px;
        background: linear-gradient(to bottom right, rgba(255,255,255,0.9), rgba(245, 243, 255, 0.9));
        box-shadow: 0 10px 30px rgba(107, 115, 255, 0.3);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        z-index: 1000;
        border: none;
      }

      .message input[type="checkbox"] {
        transform: scale(1.2);
      }

      /* Chat Header */
      .chat-header {
        background: linear-gradient(135deg, #6B73FF 0%, #9F7AEA 100%);
        color: white;
        padding: 14px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 2px 10px rgba(107, 115, 255, 0.2);
      }

      .header-content {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .admin-icon {
        background-color: #fff;
        color: #6B73FF;
        box-shadow: 0 2px 8px rgba(107, 115, 255, 0.4);
      }

      .chat-title {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        display: flex;
        flex-direction: column;
        text-shadow: 0 1px 2px rgba(0,0,0,0.1);
      }

      .title-content {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .moon-icon {
        color: #9F7AEA;
      }

      .typing-indicator {
        font-size: 12px;
        font-weight: normal;
        margin-top: 4px;
        font-style: italic;
        color: rgba(255,255,255,0.8);
      }

      .typing-text {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .typing-dots {
        display: inline-flex;
        align-items: flex-end;
        height: 1em;
      }

      .typing-dots span {
        display: inline-block;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: rgba(255,255,255,0.8);
        margin: 0 1px;
        animation: typing 1.5s infinite ease-in-out;
      }

      .typing-dots span:nth-child(1) { animation-delay: 0s; }
      .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
      .typing-dots span:nth-child(3) { animation-delay: 0.4s; }

      @keyframes typing {
        0%, 100% { transform: translateY(0); opacity: 0.6; }
        50% { transform: translateY(-3px); opacity: 1; }
      }

      .send-button {
        width: 42px;
        height: 42px;
        min-height: 42px;
        aspect-ratio: 1 / 1;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0;
        background: linear-gradient(135deg, #6B73FF 0%, #9F7AEA 100%);
        border: none;
        border-radius: 50%;
        box-shadow: 0 4px 8px rgba(107, 115, 255, 0.3);
        transition: all 0.3s;
      }

      .close-button:hover {
        background-color: rgba(255,255,255,0.2);
      }

      .close-icon {
        color: white;
      }

      /* Chat Body */
      .chat-body {
        padding: 16px;
        flex-grow: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        background: linear-gradient(to bottom right, rgba(255,255,255,0.9), rgba(245, 243, 255, 0.9));
      }

      .chat-body::-webkit-scrollbar {
        width: 6px;
      }

      .chat-body::-webkit-scrollbar-track {
        background: rgba(245, 243, 255, 0.5);
      }

      .chat-body::-webkit-scrollbar-thumb {
        background: linear-gradient(#6B73FF, #9F7AEA);
        border-radius: 3px;
      }

      /* Welcome Message */
      .welcome-message {
        background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(245, 243, 255, 0.9));
        border-radius: 16px;
        padding: 16px;
        margin-bottom: 16px;
        display: flex;
        gap: 12px;
        align-items: center;
        box-shadow: 0 4px 12px rgba(107, 115, 255, 0.1);
        border: 1px solid rgba(107, 115, 255, 0.1);
      }

      .welcome-avatar {
        background: linear-gradient(135deg, #6B73FF 0%, #9F7AEA 100%);
        color: white;
        flex-shrink: 0;
        box-shadow: 0 4px 8px rgba(107, 115, 255, 0.3);
      }

      .welcome-text {
        font-size: 14px;
        color: #4A5568;
        line-height: 1.5;
      }

      .welcome-text strong {
        color: #6B73FF;
      }

      .welcome-text p {
        margin: 6px 0;
        color: #4A5568;
      }

      .welcome-subtext {
        color: #9F7AEA;
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .welcome-title {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .notification-icon {
        color: #9F7AEA;
      }

      .star-icon {
        color: #9F7AEA;
      }

      /* Messages */
      .message-container {
        display: flex;
        margin-bottom: 12px;
      }

      .user-message-container {
        justify-content: flex-end;
      }

      .system-message-container {
        justify-content: flex-start;
      }

      .message {
        max-width: 75%;
        padding: 12px 16px;
        border-radius: 18px;
        position: relative;
        font-size: 14px;
        line-height: 1.4;
        word-break: break-word;
        transition: all 0.3s;
      }

      .user-message {
        background: linear-gradient(135deg, #6B73FF 0%, #9F7AEA 100%);
        color: white;
        border-bottom-right-radius: 4px;
        box-shadow: 0 4px 12px rgba(107, 115, 255, 0.3);
      }

      .system-message {
        background: white;
        color: #4A5568;
        border-bottom-left-radius: 4px;
        border: 1px solid rgba(107, 115, 255, 0.1);
        box-shadow: 0 4px 12px rgba(159, 122, 234, 0.2);
      }

      .message-sender {
        font-weight: bold;
        font-size: 12px;
        margin-bottom: 4px;
        color: #6B73FF;
        display: flex;
        align-items: center;
      }

      .sender-icon {
        margin-left: 4px;
        color: #9F7AEA;
      }

      .message-text {
        margin-bottom: 4px;
      }

      .message-time {
        font-size: 11px;
        opacity: 0.8;
        text-align: right;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 4px;
      }

      .message-status {
        font-size: 10px;
        opacity: 0.8;
        display: flex;
        align-items: center;
      }

      /* Chat Footer */
      .chat-footer {
  padding: 12px 16px;
  border-top: 1px solid rgba(107, 115, 255, 0.1);
  background: rgba(255,255,255,0.8);
  display: flex;
  align-items: center; /* เปลี่ยนจาก flex-end เป็น center */
  gap: 8px;
  backdrop-filter: blur(5px);
}

      .chat-input {
  flex-grow: 1;
  border-radius: 20px;
  padding: 10px 16px; /* ปรับ padding ให้พอดี */
  border: 1px solid rgba(107, 115, 255, 0.3);
  resize: none;
  box-shadow: 0 2px 8px rgba(107, 115, 255, 0.1);
  transition: all 0.3s;
  background: rgba(255,255,255,0.8);
  min-height: 42px; /* กำหนดความสูงขั้นต่ำให้เท่ากับปุ่ม */
  line-height: 1.5; /* ปรับ line-height ให้เหมาะสม */
}

      .chat-input:focus {
        border-color: #6B73FF;
        box-shadow: 0 0 0 2px rgba(107, 115, 255, 0.2);
      }

      .chat-input::placeholder {
        color: #A0AEC0;
      }

      .send-button {
        width: 42px !important;
        height: 42px !important;
        min-width: 42px !important;
        min-height: 42px !important;
        aspect-ratio: 1 / 1;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        background: linear-gradient(135deg, #6B73FF 0%, #9F7AEA 100%);
        border: none;
        box-shadow: 0 4px 8px rgba(107, 115, 255, 0.3);
        transition: all 0.3s;
      }

      /* ปรับแต่ง hover state */
      .send-button:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(107, 115, 255, 0.4);
      }

      /* ปรับแต่ง disabled state */
      .send-button:disabled {
        background: #CBD5E0;
        box-shadow: none;
        cursor: not-allowed;
      }
      `}</style>
    </>
  );
};

export default ChatComponent;
