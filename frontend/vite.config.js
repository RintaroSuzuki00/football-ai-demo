import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // CodeSandboxのプレビューURLからのアクセスを許可する
    allowedHosts: [".csb.app"],
  },
});
