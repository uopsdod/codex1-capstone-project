# Codex Capstone：美股跌幅 LINE 通知

環境建置依課程 TXT 完成，不使用 Skills。單元 3 安裝後依序執行：

1. `stock-line-capstone-prerequisite`：前置檢查，補齊 MCP、帳號、API Key與LINE憑證。
2. `stock-line-capstone-main`：main，實作行情、跌幅判斷、LINE Flex 通知及排程。
3. `stock-line-capstone-checklist`：驗收實作結果，提供各項證據與待確認事項。

單元 4 依序使用：

1. `obsidian-stock-line-capstone-prerequisite`：檢查 MCP、Vault、筆記與來源。
2. `obsidian-stock-line-capstone-main`：整理專案知識與修改紀錄。
3. `obsidian-stock-line-capstone-checklist`：讀回筆記、連結、附件及證據驗收。

通用技術 Skills：`n8n-workflow-builder` 與 `obsidian-knowledge-base-builder`，由各自 main 在同一對話使用。

八個 Skill 均位於 `.agents/skills/`，安裝時保留完整資料夾與 references。
目前為實作中的初稿。MCP建立及手動執行已驗證；完整通知與知識庫仍待端到端驗證。
