from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from ollama import chat  # 调用 Ollama API

app = Flask(__name__)
CORS(app)

# 用于保存任务（内存存储，生产环境可使用数据库）
tasks = []

def call_deepseek(prompt: str) -> dict:
    """
    调用 Ollama API 与 DeepSeek 模型对话，并解析返回的思考过程和最终回复。
    """
    try:
        response = chat(model="deepseek-r1", messages=[
            {"role": "user", "content": prompt}
        ])
        content = response.get("message", {}).get("content", "")
        if not content:
            print("DeepSeek 返回为空:", response)
            return {"think": "", "reply": "模型没有返回结果，请稍后重试。"}
        
        # 解析思考过程和最终回复
        think_content = ""
        final_reply = content

        if '<think>' in content and '</think>' in content:
            think_start = content.find('<think>') + len('<think>')
            think_end = content.find('</think>')
            think_content = content[think_start:think_end].strip()
            final_reply = content[think_end + len('</think>'):].strip()

        return {"think": think_content, "reply": final_reply}
    except Exception as e:
        print("调用 DeepSeek 出错:", e)
        return {"think": "", "reply": f"模型调用出错：{e}"}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat_route():
    data = request.get_json()
    user_input = data.get("message", "").strip() if data else ""
    print("收到消息:", user_input)

    if not user_input:
        return jsonify({"think": "", "reply": "请输入消息。"})

    # 判断是否为任务管理指令
    if user_input.startswith("/add"):
        task_info = user_input[len("/add"):].strip()
        tasks.append(task_info)
        reply = f"任务已添加：{task_info}"
        think_content = ""
    elif user_input.startswith("/list"):
        if tasks:
            reply = "当前任务列表：\n" + "\n".join(tasks)
        else:
            reply = "目前没有任务。"
        think_content = ""
    else:
        # 调用 DeepSeek 模型
        result = call_deepseek(user_input)
        think_content = result["think"]
        reply = result["reply"]

    print("思考过程:", think_content)
    print("回复消息:", reply)
    return jsonify({"think": think_content, "reply": reply})

if __name__ == '__main__':
    # 启动 Flask 服务并监听 5001 端口
    app.run(host="0.0.0.0", port=5001, debug=True)
