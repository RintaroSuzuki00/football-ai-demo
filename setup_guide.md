# CodeSandboxを使ったフルスタック体験環境の構築・頒布ガイド

フロントエンド（React）とバックエンド（Python/FastAPI + YOLO）を一貫して動かす体験環境を、エディター不要のCodeSandboxで構築し、参加者に頒布する方法を解説します。

## 1. 環境構成の設計

CodeSandboxの「Devbox（コンテナ環境）」機能を使用します。これにより、ブラウザ上でNode.js（React）とPython（FastAPI）の両方を同時に動かすことができます。

*   **フロントエンド**: React (Vite) - ポート `5173` で動作
*   **バックエンド**: Python (FastAPI) + `ultralytics` (YOLOv8) - ポート `8000` で動作

---

## 2. 事前準備（運営側が行う作業）

体験会の前に、運営側で「テンプレートとなるCodeSandboxプロジェクト」を作成しておきます。

### ステップ1: GitHubリポジトリの作成
CodeSandboxはGitHubリポジトリと連携するのが最も安定します。以下の構成でリポジトリを作成します。

```text
my-football-ai-demo/
├── .codesandbox/
│   └── tasks.json       # CodeSandboxの起動タスク定義
├── backend/
│   ├── main.py          # FastAPI + YOLOのコード
│   └── requirements.txt # fastapi, uvicorn, ultralytics, opencv-python-headless 等
├── frontend/
│   ├── package.json     # Reactの依存関係
│   ├── src/
│   │   └── App.jsx      # UIのコード
│   └── ...
└── README.md
```

### ステップ2: `.codesandbox/tasks.json` の設定
CodeSandboxが開かれたときに、自動的にバックエンドとフロントエンドの両方が立ち上がるように設定します。

```json
{
  "$schema": "https://codesandbox.io/schemas/tasks.json",
  "setupTasks": [
    {
      "name": "Install Backend Dependencies",
      "command": "pip install -r backend/requirements.txt"
    },
    {
      "name": "Install Frontend Dependencies",
      "command": "cd frontend && npm install"
    }
  ],
  "tasks": {
    "start-backend": {
      "name": "Run FastAPI Server",
      "command": "cd backend && uvicorn main:app --host 0.0.0.0 --port 8000",
      "runAtStart": true
    },
    "start-frontend": {
      "name": "Run React App",
      "command": "cd frontend && npm run dev",
      "runAtStart": true
    }
  }
}
```

### ステップ3: CodeSandboxへのインポート
1. CodeSandboxにログインし、「Import from GitHub」を選択します。
2. 作成したリポジトリのURLを入力します。
3. CodeSandboxが自動的にコンテナを構築し、サーバーが立ち上がります。

---

## 3. 参加者への頒布方法（体験会当日）

参加者には、**CodeSandboxのプロジェクトURL（プレビューURLではなく、エディターのURL）**を共有するだけです。

### 頒布手順
1. 運営側が作成したCodeSandboxのURL（例: `https://codesandbox.io/p/github/your-org/my-football-ai-demo`）をQRコードやチャットで共有します。
2. 参加者がURLを開くと、ブラウザ上でVS Code風のエディターが立ち上がります。
3. 参加者がコードを編集しようとすると、自動的に**「Fork（参加者専用のコピー）」**が作成されます。これにより、他の参加者の環境を壊すことなく、安全に開発を体験できます。

---

## 4. 体験会でのハンズオン・シナリオ

この環境を使った、フロントエンドからバックエンドまで一貫した体験シナリオです。

### ① 完成品の動作確認（2分）
1. 画面右側のプレビューウィンドウ（Reactアプリ）で「画像を選択」ボタンを押します。
2. 自チームの画像をアップロードし、「YOLOで解析する」ボタンを押します。
3. バックエンド（FastAPI）に画像が送信され、YOLOで処理された結果（バウンディングボックス付き画像と人数）がフロントエンドに返ってきて表示されるのを確認します。

### ② フロントエンドの改修体験（3分）
1. `frontend/src/App.jsx` を開きます。
2. ボタンのテキスト（例: `"YOLOで解析する"` → `"AIで選手を見つける！"`）や、デザイン（CSS）を変更します。
3. 保存（Ctrl+S）すると、右側のプレビュー画面が**即座に更新（ホットリロード）**されることを体験します。

### ③ バックエンド（AIモデル）の改修体験（5分）
1. `backend/main.py` を開きます。
2. YOLOの信頼度閾値を変更してみます。
   * 変更前: `results = model(img, conf=0.25)`
   * 変更後: `results = model(img, conf=0.80)` （80%以上の確信があるものだけ検出）
3. ターミナルでFastAPIサーバーが自動再起動するのを確認します。
4. 再度フロントエンドから同じ画像をアップロードし、**「閾値を上げたことで、検出される人数（バウンディングボックス）が減った（誤検出が減った代わりに見逃しが増えた）」**というAIの挙動の変化を体験します。

---

## 5. 運営上の注意点（トラブルシューティング）

*   **バックエンドURLの動的変更**: CodeSandboxのプレビューURLはフォークするたびに変わります。そのため、React側（`App.jsx`）の `BACKEND_URL` を、参加者自身の環境のポート8000のURLに書き換えてもらう手順を最初に入れる必要があります。（CodeSandboxのポートパネルからURLをコピーできます）。
*   **初回起動の遅延**: YOLOモデル（`yolov8n.pt`）は初回実行時にダウンロードされるため、最初の1回目の解析だけ数秒〜十数秒かかる場合があります。参加者には「AIモデルをダウンロード中なので少し待ちます」とアナウンスしてください。
*   **メモリ制限**: 無料版のCodeSandboxはメモリ制限があるため、YOLOモデルは最も軽量な `yolov8n.pt`（nanoモデル）を使用することが必須です。
