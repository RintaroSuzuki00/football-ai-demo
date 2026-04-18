# アメフト画像解析デモ（フルスタック体験会用）

アメフトチームのエンジニアパート新人勧誘体験会で使用するデモ環境です。  
フロントエンド（React）から画像をアップロードし、バックエンド（Python / FastAPI + YOLOv8）でAI物体検出を行い、結果を返します。

## 構成

```
.
├── .codesandbox/
│   └── tasks.json        # CodeSandbox起動設定（自動でサーバーが立ち上がる）
├── backend/
│   ├── main.py           # FastAPI + YOLOv8 のサーバーコード
│   └── requirements.txt  # Pythonの依存ライブラリ
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx      # Reactのエントリーポイント
        ├── App.jsx       # メインのUIコード ← 主に触る場所
        └── styles.css    # デザイン ← 自由に変えてみよう
```

## CodeSandboxで開く

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/github/YOUR_ORG/YOUR_REPO)

> ※ 上のバッジのURLは、自分のリポジトリのURLに書き換えてください。

## 体験会でのハンズオン手順

### ① バックエンドURLの設定（最初にやること）
1. CodeSandboxの「Ports」パネルを開き、ポート `8000` のプレビューURLをコピーします。
2. `frontend/src/App.jsx` の `BACKEND_URL` にそのURLを貼り付けます。

### ② 完成品を動かす
1. 「画像を選択」ボタンから、自チームの試合画像を選びます。
2. 「YOLOで解析する」ボタンを押します。
3. AIが選手を検出し、バウンディングボックス付きの画像が表示されます。

### ③ フロントエンドを改修してみる（★）
- `styles.css` の `background-color: #ff6b00;` を好きな色に変えてみましょう。
- 保存（Ctrl+S）すると画面が即座に更新されます（ホットリロード）。

### ④ AIのパラメータを変えてみる（★★）
- `backend/main.py` の `conf=0.25` を `0.80` などに変更して再解析してみましょう。
- 閾値を上げると「誤検出（偽陽性）」は減りますが「見逃し（偽陰性）」が増えます。
- これが **Precision（適合率）** と **Recall（再現率）** のトレードオフです。
