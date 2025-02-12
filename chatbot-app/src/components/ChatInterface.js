import React, { useState, useLayoutEffect, useRef } from 'react';
import { Button, Input, List, Typography, Collapse } from 'antd';
import { motion } from 'framer-motion';
import { CloudOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Panel } = Collapse;

const ThinkingBubble = () => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
      style={{ fontSize: '16px', marginRight: '8px' }}
    >
      思考中...
    </motion.span>
    <motion.span
      initial={{ x: 0 }}
      animate={{ x: 20 }}
      transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
      style={{ width: '24px', height: '24px' }}
    >
      <CloudOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
    </motion.span>
  </div>
);

const ChatInterface = ({ onSendMessage, messages, loading }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  // 使用 useLayoutEffect 保证 DOM 更新完成后再滚动
  useLayoutEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  return (
    <div
      style={{
        width: '66%',                // 占页面宽度的约 2/3
        position: 'fixed',
        top: '10vh',                 // 上边距 10vh
        right: '10vh',               // 右边距 10vh
        bottom: '10vh',              // 下边距 10vh
        backgroundColor: '#fff',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
      }}
    >
      {/* 单独的消息列表容器，确保输入框不会因列表高度变化而重新渲染 */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          marginBottom: '20px'
        }}
      >
        <List
          bordered={false}
          dataSource={
            loading
              ? [...messages, { role: 'bot', content: <ThinkingBubble />, think: '' }]
              : messages
          }
          renderItem={(item) => {
            const isUser = item.role === 'user';
            return (
              <List.Item
                style={{
                  display: 'flex',
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                  background: 'transparent',
                  border: 'none',
                  padding: '8px 0'
                }}
              >
                <div
                  style={{
                    backgroundColor: isUser ? '#007aff' : '#e5e5ea',
                    color: isUser ? '#fff' : '#000',
                    padding: '10px 14px',
                    borderRadius: '20px',
                    maxWidth: '70%',
                    wordBreak: 'break-word'
                  }}
                >
                  {!isUser && item.think ? (
                    <div>
                      <Collapse ghost>
                        <Panel header="模型思考过程" key="1">
                          <Text type="secondary">{item.think}</Text>
                        </Panel>
                      </Collapse>
                      <div style={{ marginTop: 10 }}>{item.content}</div>
                    </div>
                  ) : (
                    <>{item.content}</>
                  )}
                </div>
              </List.Item>
            );
          }}
        />
        {/* 滚动锚点 */}
        <div ref={messagesEndRef} />
      </div>
      <Input.Group compact>
        <Input
          style={{ width: 'calc(100% - 85px)' }}
          value={inputValue}
          onChange={handleInputChange}
          onPressEnter={handleSend}
          placeholder="输入消息..."
        />
        <Button type="primary" onClick={handleSend} loading={loading}>
          发送
        </Button>
      </Input.Group>
    </div>
  );
};

export default ChatInterface;
