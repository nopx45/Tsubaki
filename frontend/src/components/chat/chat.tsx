import React, { useState, CSSProperties, useEffect, useRef } from 'react';
import { Badge, Avatar, Button, Input } from 'antd';
import { CloseOutlined, SendOutlined } from '@ant-design/icons';
import useWebSocket from '../../socket';
import { getAuthToken, GetMessages, GetUserByUsername } from '../../services/https';
import { jwtDecode } from 'jwt-decode';
import { TiMessages } from "react-icons/ti";
import {WS_URL} from '../../socket'

interface ChatComponentProps {
  isLoggedIn: boolean;
}

const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 50%, 90%)`; // HSL สีสดใส
  return color;
};

const ADMIN_COLOR = '#cce5ff';

const Chat: React.FC<ChatComponentProps> = ({ isLoggedIn }) => {
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage } = useWebSocket(WS_URL);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ text: string; sender: string; role: 'user' | 'admin'; time: string }>>([]);
  const [newMessage, setNewMessage] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [sendto, setSendto] = useState("");
  const [role, setRole] = useState("");

  const [userColors, setUserColors] = useState<Record<string, string>>({});


  useEffect(() => {
    const fetchUser = async () => {
      const token = await getAuthToken();
      if (token) {
        const decoded = jwtDecode(token);
        setRole((decoded as any).role);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
  const fetchMessages = async () => {
    try {
      const allMessages = await GetMessages(); // ✅ API ดึงข้อความทั้งหมด
      const formatted = allMessages.data.map((msg: any) => ({
        text: msg.content,
        sender: msg.from,
        role: (msg.role === "admin" ? "admin" : "user") as "admin" | "user",
        time: new Date(msg.created_at || Date.now()).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      const userColorMap: Record<string, string> = {};
      formatted.forEach((m: { sender: string; }) => {
        if (!userColorMap[m.sender]) {
          userColorMap[m.sender] = stringToColor(m.sender);
        }
      });

      setUserColors(userColorMap);
      setChatMessages(formatted);
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  fetchMessages();
}, []);

useEffect(() => {
  if (messages.length === 0) return;

  const lastMessage = messages[messages.length - 1];

  const formattedMessage = {
    text: lastMessage.content,
    sender: lastMessage.from,
    role: (lastMessage.role === "admin" ? "admin" : "user") as "admin" | "user",
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };

  setUserColors((prev) => {
    if (!prev[lastMessage.from]) {
      return { ...prev, [lastMessage.from]: stringToColor(lastMessage.from) };
    }
    return prev;
  });

  setChatMessages((prevMessages) => [...prevMessages, formattedMessage]);
  setSendto(formattedMessage.sender);

  if (!isChatOpen) {
    setUnreadCount((prev) => prev + 1);
  }

  setTimeout(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, 100);
}, [messages]);

useEffect(() => {
  if (isChatOpen) {
    setTimeout(() => {
      if (chatBodyRef.current) {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      }
    }, 100);
  }
}, [isChatOpen]);

   
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setUnreadCount(0);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    let messageToSend = newMessage;
    let recipient = sendto || "admin";

    // ตรวจสอบว่าข้อความมีรูปแบบชาร์ป (#) ตามด้วยชื่อผู้ใช้หรือไม่
    const match = newMessage.match(/#(\w+)/);
    if (match) {
        recipient = match[1]; // ดึงชื่อผู้ใช้ที่อยู่หลัง #
        messageToSend = newMessage.replace(/#(\w+)/, "").trim(); // ลบ #ชื่อผู้ใช้ออกจากข้อความ

        // ตรวจสอบว่าชื่อผู้ใช้มีอยู่ในระบบหรือไม่
        const userExists = await GetUserByUsername(recipient);
        if (!userExists) {
            alert(`ไม่พบผู้ใช้: ${recipient}`);
            return;
        }
    }
    sendMessage(JSON.stringify({ type: "send_message", from: recipient, role: role, content: messageToSend }));
    setNewMessage("");
};

  const handleSelectRecipient = (selectedUser: string) => {
    setSendto(selectedUser);
  };
  
  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      <div style={chatStyles.chatButton} onClick={toggleChat}>
        <Badge count={!isChatOpen ? unreadCount : 0} size="small">
          <Avatar size={70} icon={<TiMessages />} style={chatStyles.chatAvatar} />
        </Badge>
      </div>
      {isChatOpen && (
        <div style={chatStyles.chatContainer}>
          <div style={chatStyles.chatHeader}>
            <h3 style={chatStyles.chatTitle}>ช่วยเหลือ</h3>
            <Button type="text" icon={<CloseOutlined style={{ color: 'white' }} />} onClick={toggleChat} style={chatStyles.closeButton} />
          </div>
          <div style={chatStyles.chatBody} ref={chatBodyRef}>
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              style={{
                ...chatStyles.messageContainer,
                justifyContent: msg.role === 'admin' ? 'flex-end' : 'flex-start'
              }}
              onClick={() => handleSelectRecipient(msg.sender)}
            >
              <div
                style={{
                  ...chatStyles.message,
                  backgroundColor: msg.role === 'admin'
                    ? ADMIN_COLOR
                    : userColors[msg.sender] || '#f0f0f0',
                  color: '#333',
                  borderBottomRightRadius: msg.role === 'admin' ? '5px' : undefined,
                  borderBottomLeftRadius: msg.role !== 'admin' ? '5px' : undefined
                }}
              >
                <strong>{msg.sender}:</strong>
                <div style={chatStyles.messageText}>{msg.text}</div>
                <div style={chatStyles.messageTime}>{msg.time}</div>
              </div>
            </div>

          ))}
          </div>
          <div style={chatStyles.chatFooter}>
            <Input placeholder={`พิมพ์ข้อความของคุณ... (ส่งถึง ${sendto || "admin"})`} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onPressEnter={handleSendMessage} style={chatStyles.chatInput} />
            <Button type="primary" icon={<SendOutlined />} onClick={handleSendMessage} style={chatStyles.sendButton} />
          </div>
        </div>
      )}
    </>
  );
};

// สไตล์สำหรับ component แชท
const chatStyles: Record<string, CSSProperties> = {
  chatButton: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 1000,
    cursor: 'pointer',
  },
  chatAvatar: {
    backgroundColor: '#1890ff',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatContainer: {
    position: 'fixed',
    bottom: '80px',
    right: '20px',
    width: '320px',
    height: '400px',
    borderRadius: '10px',
    backgroundColor: 'white',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 1000,
  },
  chatHeader: {
    backgroundColor: '#1890ff',
    color: 'white',
    padding: '10px 15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #e8e8e8',
  },
  chatTitle: {
    margin: 0,
    fontSize: '16px',
  },
  closeButton: {
    border: 'none',
    padding: 0,
  },
  chatBody: {
    padding: '10px',
    flexGrow: 1,
    overflowY: 'auto',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    flexDirection: 'column',
  },
  chatFooter: {
    padding: '10px',
    borderTop: '1px solid #e8e8e8',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
  },
  chatInput: {
    flexGrow: 1,
    marginRight: '10px',
    borderRadius: '20px',
  },
  sendButton: {
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  messageContainer: {
    display: 'flex',
    marginBottom: '10px',
  },
  message: {
    maxWidth: '70%',
    padding: '8px 12px',
    borderRadius: '18px',
    position: 'relative',
  },
  userMessage: {
    backgroundColor: '#1890ff',
    color: 'white',
    borderBottomRightRadius: '5px',
  },
  systemMessage: {
    backgroundColor: 'white',
    color: '#333',
    borderBottomLeftRadius: '5px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  },
  messageText: {
    wordWrap: 'break-word',
  },
  messageTime: {
    fontSize: '10px',
    opacity: 0.7,
    textAlign: 'right',
    marginTop: '4px',
  }
};

export default Chat;