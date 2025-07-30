from flask import Flask, request, jsonify
import pymysql
from flask_cors import CORS  # 允许跨域

app = Flask(__name__)
CORS(app)  # 允许前端 JS 从不同源访问这个服务

# 数据库配置（根据你的实际情况修改）
db_config = {
    "host": "localhost",
    "user": "root",        # 通常是 'root'
    "password": "Cyh051127",    # 你设置的 MySQL 密码
    "database": "message_board",  # 数据库名称
    "charset": "utf8mb4"
}

# 提交留言接口
@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    print("收到留言数据：", data)
    username = data.get("username", "匿名")
    content = data.get("content", "")

    conn = pymysql.connect(**db_config)
    cursor = conn.cursor()
    sql = "INSERT INTO messages (username, content) VALUES (%s, %s)"
    cursor.execute(sql, (username, content))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"status": "success"})

# 获取留言列表接口
@app.route('/messages', methods=['GET'])
def get_messages():
    conn = pymysql.connect(**db_config)
    cursor = conn.cursor()
    cursor.execute("SELECT username, content, created_at FROM messages ORDER BY id DESC")
    result = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
