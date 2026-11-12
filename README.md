# Codex Capstone：美股跌幅 LINE 通知

環境建置依課程 TXT 完成，不使用 Skills。單元 3 安裝後依序執行：

1. `stock-line-capstone-prerequisite`：前置檢查，補齊 MCP、帳號、API Key與LINE憑證。
2. `stock-line-capstone-main`：main，實作行情、跌幅判斷、LINE Flex 通知及排程。
3. `stock-line-capstone-checklist`：驗收實作結果，提供各項證據與待確認事項。

單元 4 使用 `obsidian-stock-line-capstone` 建立及維護專案知識庫。

通用技術 Skill：`n8n-workflow-builder`，由 Capstone main 在同一對話讀取並使用，負責 n8n MCP／SDK 建置與驗證。

五個 Skill 均位於 `.agents/skills/`，安裝時保留完整資料夾與 references。
目前為實作中的初稿。MCP建立及手動執行已驗證；完整通知仍待端到端驗證。
