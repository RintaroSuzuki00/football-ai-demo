import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

// Reactアプリを index.html の <div id="root"> に埋め込む
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
