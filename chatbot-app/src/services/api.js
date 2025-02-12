export const sendMessageToBackend = async (message) => {
    const response = await fetch('http://127.0.0.1:5001/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
  
    if (!response.ok) {
      throw new Error('网络响应失败，状态码: ' + response.status);
    }
  
    return response.json();
  };
  