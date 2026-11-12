---
name: stock-line-capstone-prerequisite
description: 在實作美股跌幅 LINE 通知前，盤點 n8n MCP、專案、Data Tables、Twelve Data 與 LINE 帳號及憑證，協助補齊缺項並交付可查證的前置檢查結果。
---

# 美股通知：前置檢查

承接 TXT 單元 2 的環境建置。本 Skill 負責盤點與補齊前置條件，不建立正式通知工作流、不推播、不啟用排程。使用繁體中文，每次只交接一項必要的人工作業；能代辦的表單與非秘密設定先準備好。

## 檢查及補齊

1. 發現並呼叫 n8n MCP get_instance_context，核對本次實例與專案。沿用本次 MCP 建立／執行的驗收證據；沒有工具時回到 TXT 連線與 Authenticate 步驟，不用瀏覽器結果冒充 MCP 通過。
2. 盤點工具是否能建立、修改、手動執行及讀取 Execution，管理 Data Tables、列出及綁定 Credentials。區分已看見工具與已實測能力。缺少秘密寫入工具不等於帳號不可用，改由私密表單交接。
3. 查專案內既有工作流、設定表與非秘密憑證中繼資料，記錄 ID、名稱、類型與來源。已有設定保留；本次僅盤點，不遷移或覆寫正式資料。不要把 context 未曝光工作流當成完全空白實例。
4. 先處理 Twelve Data：已有帳號沿用；請學員登入並取得自己的 API Key。準備獨立「Twelve Data 行情」Query Auth，Name=apikey，秘密由學員在私密欄位輸入並儲存。可以使用未啟用的唯讀測試工作流綁定憑證，實際取得預計追蹤股票的最近兩筆日線。不能只因憑證存在或學員說已儲存就標 API 可用。無行情或額度不足明列；主工作流計算留給 main。
5. 行情前置通過後處理 LINE：核對本人管理的官方帳號、Messaging API 已啟用、同 Provider/channel 的個人 User ID、手機加好友且未封鎖。User ID 必須 U 加32位十六進位，不是 @ Basic ID。收件人只存本人專案設定，不在聊天完整顯示。
6. 準備獨立「LINE 股價提醒」Bearer Auth，Token 原文由學員私密填入，不加 Bearer。以 GET https://api.line.me/v2/bot/info 唯讀確認可用，不能用推播作前置測試。已有可用 Token 不重新發行，單向通知不需要 Channel secret 或 Webhook。
7. 確認股票與門檻意圖：全新預設 TSM,NVDA,GOOGL、2.5%；既有保留實際值。確認使用 America/New_York 平日17:00；排程只是需求，不能因確認時間就啟用。所在地未知才問。

金鑰只在 Credentials，不索取聊天中的秘密、不放 Data Tables／Variables／Code，不索取 n8n Public API Key或升級方案。工具不足以準備憑證時用可用介面準備表單，只交給學員私密輸入；網站註冊／條款由本人完成。依當前官方文件核對帳號與API流程，不把舊教材當現況。

## 交付與銜接

用「前置項目／通過、未通過或待確認／證據與下一步」表回報。分開列帳號可登入、憑證存在、唯讀API可用、收件人已設定與好友本人確認。不把手機送達列前置通過，它是 main 實測事項。

交接摘要包含本次查核時間、實例、專案ID、可用工具、工作流與設定表現況、非秘密憑證ID／類型、唯讀Execution連結、股票門檻與待補項。缺關鍵前置不宣稱就緒；已補齊則告知下一步執行 $stock-line-capstone。不自動重做已通過項目，不在此階段執行 main。
