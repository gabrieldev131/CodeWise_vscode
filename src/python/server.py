# src/python/server.py

from flask import Flask, request, jsonify
from codewise.Observer.Observer import start_observing, find_git_repo
import threading

app = Flask(__name__)

@app.route('/iniciar', methods=['POST'])
def iniciar():
    data = request.get_json()
    caminho = data.get("caminho")

    if not caminho:
        return jsonify({"erro": "Caminho não fornecido"}), 400

    thread = threading.Thread(target=start_observing, args=(find_git_repo(start_path=caminho)))
    thread.daemon = True
    thread.start()

    return jsonify({"mensagem": "Observador iniciado"}), 200

if __name__ == '__main__':
    app.run(port=5000)
