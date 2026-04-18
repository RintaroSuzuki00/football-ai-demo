from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
from ultralytics import YOLO
import base64

# ==========================================
# 1. Webサーバーの準備
# ==========================================
app = FastAPI()

# フロントエンド（React）からの通信を許可する設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # どこからでもアクセスOK
    allow_methods=["*"],  # どんな通信方法（GET, POSTなど）でもOK
)

# ==========================================
# 2. AIモデルの準備
# ==========================================
# YOLOv8の「nano（一番軽くて速い）」モデルを読み込む
model = YOLO('yolov8n.pt')

# ==========================================
# 3. APIの作成（URLにアクセスされたときの処理）
# ==========================================

# ブラウザでアクセスしたときの挨拶
@app.get("/")
def hello():
    return {"message": "AIサーバーが動いています！"}

# 画像を受け取って解析するメインの処理
@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    
    # --- A. 画像を読み込む ---
    # 送られてきた画像データを、OpenCV（画像処理ライブラリ）で扱える形式に変換
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # --- B. AIで物体検出 ---
    # conf=0.25 は「25%以上の自信があるものだけ見つける」という設定
    # ★体験会ポイント：ここの数字を 0.80 などに変えて、結果がどう変わるか試してみよう！
    results = model(img, conf=0.25)
    
    # --- C. 結果を画像に書き込む ---
    # AIが見つけた場所（バウンディングボックス）を画像に直接描画する
    annotated_img = results[0].plot()
    
    # --- D. 人数を数える ---
    # クラス番号「0」が「人（person）」を表す
    person_count = 0
    for box in results[0].boxes:
        if int(box.cls) == 0:
            person_count += 1

    # --- E. フロントエンドに返す準備 ---
    # 描画した画像を、Webで送れる文字の羅列（Base64）に変換する
    _, buffer = cv2.imencode('.jpg', annotated_img)
    img_base64 = base64.b64encode(buffer).decode('utf-8')
    
    # 最終的な結果をフロントエンドに返す
    return {
        "person_count": person_count,
        "image_data": f"data:image/jpeg;base64,{img_base64}"
    }
