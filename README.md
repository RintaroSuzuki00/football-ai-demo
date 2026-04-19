# アメフト画像解析デモ（フルスタック体験会用）

アメフトチームのエンジニアパート新人勧誘体験会で使用するデモ環境です。

## 構成

```
フロントエンド（CodeSandbox）  ←→  バックエンド（Google Colab）
     React + Vite                   FastAPI + YOLOv8
     ポート 5173                      ngrok で公開
```

```
football-ai-demo/
├── .codesandbox/
│   └── tasks.json          # CodeSandbox起動設定（Reactが自動で立ち上がる）
├── backend/
│   └── yolo_backend.ipynb  # Google Colabで開くバックエンドノートブック
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx        # Reactのエントリーポイント
        ├── App.jsx         # メインのUIコード ← 主に触る場所
        └── styles.css      # デザイン ← 自由に変えてみよう
```

---

## 体験会当日の手順

### 【運営側】バックエンドの起動（事前に行う）

1. `backend/yolo_backend.ipynb` を [Google Colab](https://colab.research.google.com) で開きます。
2. セルを上から順に実行します。
3. 最後のセルを実行すると、以下のようなURLが表示されます。
   ```
   Public URL: https://xxxx-xx-xxx-xxx-xxx.ngrok-free.app
   ```
4. このURLを参加者に共有します（QRコードやチャットで）。

### 【参加者】フロントエンドのセットアップ

1. 以下のURLをブラウザで開きます。
   ```
   https://codesandbox.io/p/github/RintaroSuzuki00/football-ai-demo
   ```
2. CodeSandboxが自動でForkし、Reactアプリが起動します。
3. `frontend/src/App.jsx` を開き、`BACKEND_URL` を運営から共有されたngrokのURLに書き換えます。
   ```js
   // 変更前
   const BACKEND_URL = "https://your-backend-url.ngrok-free.app";
   // 変更後（運営から共有されたURLに書き換える）
   const BACKEND_URL = "https://xxxx-xx-xxx-xxx-xxx.ngrok-free.app";
   ```
4. 保存（Ctrl+S）すると画面が自動更新されます。

---

## ハンズオン体験シナリオ

### ① 完成品を動かす
1. 「画像を選択」ボタンから、自チームの試合画像を選びます。
2. 「YOLOで解析する」ボタンを押します。
3. AIが選手を検出し、バウンディングボックス付きの画像が表示されます。

### ② フロントエンドを改修してみる（★）
- `styles.css` の `background-color: #ff6b00;` を好きな色に変えてみましょう。
- 保存（Ctrl+S）すると画面が即座に更新されます（ホットリロード）。

### ③ AIのパラメータを変えてみる（★★）
- Google Colabの `conf=0.25` を `0.80` などに変更して再解析してみましょう。
- 閾値を上げると「誤検出（偽陽性）」は減りますが「見逃し（偽陰性）」が増えます。
- これが **Precision（適合率）** と **Recall（再現率）** のトレードオフです。
