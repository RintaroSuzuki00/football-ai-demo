import React, { useState } from "react";
import "./styles.css";

export default function App() {
  // ==========================================
  // 1. 状態（State）の準備
  // Reactでは、この変数が変わると画面が自動的に更新されます
  // ==========================================
  const [selectedFile, setSelectedFile] = useState(null); // 選んだ画像ファイル
  const [previewUrl, setPreviewUrl] = useState(null);     // 画面に表示する用のURL
  const [resultImage, setResultImage] = useState(null);   // AIが返してきた結果画像
  const [personCount, setPersonCount] = useState(null);   // AIが見つけた人数
  const [isLoading, setIsLoading] = useState(false);      // 通信中かどうか

  // ★体験会ポイント：自分のCodeSandboxのバックエンドURLに書き換えよう！
  const BACKEND_URL = "https://your-backend-url.csb.app";

  // ==========================================
  // 2. 画像が選ばれたときの処理
  // ==========================================
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // 状態をリセット
      setSelectedFile(file);
      setResultImage(null);
      setPersonCount(null);

      // ブラウザ上で画像を読み込んでプレビュー表示する
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // ==========================================
  // 3. 「AIで解析する」ボタンが押されたときの処理
  // ==========================================
  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsLoading(true); // 「通信中」状態にする

    // 画像データを「荷物（FormData）」に詰める
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // バックエンド（Python）に荷物を送る
      const response = await fetch(`${BACKEND_URL}/analyze`, {
        method: "POST",
        body: formData,
      });

      // バックエンドから返ってきた結果（JSON）を受け取る
      const data = await response.json();
      
      // 結果を状態にセットする → 画面が自動で更新される！
      setResultImage(data.image_data);
      setPersonCount(data.person_count);

    } catch (error) {
      alert("エラーが発生しました。バックエンドのURLが正しいか確認してください。");
      console.error(error);
    } finally {
      setIsLoading(false); // 「通信中」状態を解除
    }
  };

  // ==========================================
  // 4. 画面の見た目（JSX）
  // ==========================================
  return (
    <div className="App">
      <h1>アメフト画像解析（YOLOv8）</h1>
      <p>フロントエンド（React）からバックエンド（Python）へ画像を送り、AIで解析します。</p>

      {/* 画像を選ぶボタン */}
      <div className="upload-section">
        <label className="btn-upload">
          画像を選択
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
        </label>
      </div>

      {/* 画像が選ばれていたら、プレビューと解析ボタンを表示 */}
      {previewUrl && (
        <div className="preview-section">
          <h3>1. 選択した画像（フロントエンド）</h3>
          <img src={previewUrl} alt="プレビュー" className="preview-image" />
          
          <button className="btn-analyze" onClick={handleAnalyze} disabled={isLoading}>
            {isLoading ? "AIで解析中..." : "YOLOで解析する"}
          </button>
        </div>
      )}

      {/* AIから結果が返ってきていたら、結果を表示 */}
      {resultImage && (
        <div className="result-section">
          <h3>2. 解析結果（バックエンドから返却）</h3>
          <div className="result-stats">
            検出された人数: <strong>{personCount} 人</strong>
          </div>
          <img src={resultImage} alt="解析結果" className="result-image" />
        </div>
      )}
    </div>
  );
}
