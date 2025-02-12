import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import { sendMessageToBackend } from './services/api';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (message) => {
    const userMessage = { role: 'user', content: message };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setLoading(true);

    try {
      const response = await sendMessageToBackend(message);
      
      // 从响应中解析思考过程和最终回复
      const botMessage = {
        role: 'bot',
        content: response.reply,
        think: response.think,
      };
      
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('请求出错:', error);
      const errorMessage = { role: 'bot', content: '回复失败，请稍后重试。', think: '' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
      <ChatInterface onSendMessage={handleSendMessage} messages={messages} loading={loading} />
    </div>
  );
};

export default App;
