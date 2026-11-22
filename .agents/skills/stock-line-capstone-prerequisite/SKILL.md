---
name: stock-line-capstone-prerequisite
description: 在實作美股跌幅 LINE 通知前，盤點 n8n MCP、專案、JSON 範本設定、Twelve Data 與 LINE 帳號及憑證，協助補齊缺項並交付可查證的前置檢查結果。
---

# 美股通知：前置檢查

承接 TXT 單元 2 的環境建置。本 Skill 負責盤點與補齊前置條件，不建立正式通知工作流、不推播、不啟用排程。使用繁體中文，每次只交接一項必要的人工作業；能代辦的表單與非秘密設定先準備好。

## 檢查及補齊

1. 發現並呼叫 n8n MCP get_instance_context，核對本次實例與專案。沿用本次 MCP 建立／執行的驗收證據；沒有工具時回到 TXT 連線與 Authenticate 步驟，不用瀏覽器結果冒充 MCP 通過。
2. 盤點工具是否能建立、修改、手動執行及讀取 Execution，列出及綁定 Credentials；主線使用範本設定節點，不以 Data Tables 管理能力作為必要前置。區分已看見工具與已實測能力。缺少秘密寫入工具不等於帳號不可用，改由私密表單交接。
3. 查專案內既有工作流、設定節點與非秘密憑證中繼資料，記錄 ID、名稱、類型與來源。已有設定保留；本次僅盤點，不遷移或覆寫正式資料。不要把 context 未曝光工作流當成完全空白實例。
4. 先處理 Twelve Data：已有帳號沿用；請使用者登入並取得自己的 API Key。準備獨立「Twelve Data 行情」Query Auth，Name=apikey，秘密由使用者在私密欄位輸入並儲存。可以使用未啟用的唯讀測試工作流綁定憑證，實際取得預計追蹤股票的最近兩筆日線。不能只因憑證存在或使用者說已儲存就標 API 可用。無行情或額度不足明列；主工作流計算留給 main。
5. 行情前置通過後處理 LINE：核對本人管理的官方帳號、Messaging API 已啟用、同 Provider/channel 的個人 User ID、手機加好友且未封鎖。User ID 必須 U 加32位十六進位，不是 @ Basic ID。收件人只存本人專案設定，不在聊天完整顯示。
6. 以 GET https://api.line.me/v2/bot/info 唯讀驗證「LINE 股價提醒」Bearer Auth。已有憑證且驗證通過就沿用；缺少憑證或 API 回傳 401 時，依下方「引導取得 LINE Channel access token」準備表單、開啟頻道頁面並交接私密輸入。單向通知不需要 Channel secret 或 Webhook，前置測試不推播。
7. 確認股票與門檻意圖：全新預設 TSM,NVDA,GOOGL、2.5%；既有保留實際值。以台灣時間說明每週二至六，夏令05:00／冬令06:00；實作維持 America/New_York 平日17:00 自動切換；排程只是需求，不能因確認時間就啟用。所在地未知才問。

金鑰只在 Credentials，不索取聊天中的秘密、不放 Data Tables／Variables／Code，不索取 n8n Public API Key或升級方案。工具不足以準備憑證時用可用介面準備表單，只交給使用者私密輸入；網站註冊／條款由本人完成。依當前官方文件核對帳號與API流程，不把舊教材當現況。

## 使用 Codex 內建瀏覽器完成憑證設定

工作流建置與測試使用 n8n MCP。當 MCP 無法建立憑證或準備秘密欄位，直接使用 Codex 內建瀏覽器協助，不操控使用者平常使用的 Chrome。這項分工由本 Skill 接續執行，不要求使用者另貼一段瀏覽器 Prompt。

1. 在內建瀏覽器開啟使用者的 n8n，沿用已登入分頁。若需要登入，開好頁面並請使用者完成後回覆「已登入，請繼續」，保留分頁等待。
2. 準備目前需要的憑證表單與非秘密欄位。Twelve Data 使用 Query Auth，憑證名稱「Twelve Data 行情」，Name 設為 apikey；已存在的正確憑證沿用，不重建。
3. 表單準備後，先依下一節引導使用者取得 API Key，再交給使用者私密貼入 Value 並按 Save。不讀取、顯示或要求金鑰貼聊天。
4. LINE 憑證需要新增或更新時，依下方「引導取得 LINE Channel access token」實際開啟 Token 區塊，再交給使用者私密複製、貼入及儲存。
5. 使用者回報儲存後，使用 n8n MCP 查詢憑證中繼資料、綁定並做唯讀實測。儲存不等於 API 可用，結果分開回報。不要將需要人操作的全部步驟一次丟給使用者。

## 引導取得 Twelve Data API Key

先確認是否已有帳號；沒有時開啟 https://twelvedata.com/ ，引導使用者註冊與完成 Email 驗證；已建立帳號就沿用，不重問或重辦。必要登入、條款及私密操作由使用者完成。

在準備好 n8n 憑證表單後，逐步引導：
1. 在 Codex 內建瀏覽器另開 Twelve Data 網站 https://twelvedata.com/ 並讓使用者登入自己的帳號，保留 n8n 憑證表單分頁。
2. 進入帳戶首頁 https://twelvedata.com/account，點選左側「API keys」，或首頁 API keys 區塊的「View」，進入 https://twelvedata.com/account/api-keys。若實際介面不同，依目前畫面引導。
3. 請使用者找到自己的 API Key。若隱藏，點「Reveal」，使用複製按鈕或自行複製完整金鑰。已有可用金鑰就沿用，不重新產生。這一步由使用者操作，Codex 不讀取金鑰欄位或截取含金鑰畫面。
4. 請使用者回到 n8n「Twelve Data 行情」憑證表單，確認 Query Auth、Name=apikey，將金鑰貼入 Value 並按 Save。簡短提醒這裡填 Twelve Data API Key，不是網址、帳號密碼或 LINE Token，不貼聊天或作業筆記。
5. 請使用者回覆「憑證已儲存」，Codex 接續 MCP 綁定及行情驗證。只有取得真實行情才標 API 通過，不用儲存成功代替測試。

## 引導取得 LINE Channel access token

1. 在 n8n 專案開啟既有「LINE 股價提醒」憑證或準備同名 Bearer Auth 表單，保留分頁，將 Bearer Token 欄位留給使用者操作。
2. 用 Codex 內建瀏覽器開啟 [LINE Developers Console](https://developers.line.biz/console/)。若需登入，先請使用者登入，完成後接續導覽到本次確認的 Provider 與 Messaging API 頻道，進入 **Messaging API** 分頁並捲到 **Channel access token** 區塊。核對頻道與官方帳號後停在該區塊，再交接私密輸入。Codex 不讀取或截圖包含 Token 原文的內容。
3. 若已有 Token，明確交接：「請在已開啟的 LINE 頻道頁面複製 Channel access token 原文，貼到 n8n『LINE 股價提醒』的 Bearer Token 欄位並按 Save。請勿加 `Bearer ` 前綴，也不要貼到聊天。完成後回覆『LINE 憑證已儲存』。」
4. 尚無 Token 時，停在 **Issue** 位置，由使用者親自發行後接續私密輸入。若已有 Token 但確認必須重新發行，先說明 **Reissue** 會使現有長效 Token 失效，可能影響同頻道其他整合，由使用者決定並親自操作。[LINE 官方 Token 文件](https://developers.line.biz/en/docs/basics/channel-access-token/#long-lived-channel-access-token)
5. 使用者儲存後，用 n8n MCP 確認憑證並綁定唯讀測試，執行 `GET https://api.line.me/v2/bot/info`。讀回本次 Execution，確認成功回應與預期官方帳號才標通過。若仍為 401，回到同一頻道核對並交接修正。其他錯誤先查明原因。

以上操作路徑維護在本 Skill，課程 TXT 只需提供 prerequisite 的執行指令，不重複放入服務介面與憑證細節。

## 交付與銜接

用「前置項目／通過、未通過或待確認／證據與下一步」表回報。分開列帳號可登入、憑證存在、唯讀API可用、收件人已設定與好友本人確認。不把手機送達列前置通過，它是 main 實測事項。

交接摘要包含本次查核時間、實例、專案ID、可用工具、工作流與設定來源現況、非秘密憑證ID／類型、唯讀Execution連結、股票門檻與待補項。缺關鍵前置不宣稱就緒；已補齊則告知下一步執行 $stock-line-capstone-main。不自動重做已通過項目，不在此階段執行 main。

## 沿用帳號與收件人

使用者不確定是否有 LINE 官方帳號時，可先在已授權的內建瀏覽器查看既有帳號；找到候選後確認沿用對象，不直接重辦。Messaging API 已啟用就接續同 Channel，不重發既有可用 Token。讀取 Your user ID 前確認 Developers 登入帳號就是接收通知的本人；Bot API 回傳的 userId 是機器人身分，不能拿來當本人收件人。提供 Basic ID 或官方加入好友 QR Code，手機加好友與是否封鎖由本人確認。

MCP 連線驗收、帳號可登入、憑證存在、API 可用分層交接，沿用本次證據不重測。回報用 ✅ 通過、❌ 未通過、⏳ 待確認，描述具體下一步，避免只列工具名稱。

## 瀏覽器控制服務未連接時

若瀏覽器控制回傳 `Trusted RPC service is not configured: browser` 或同等的服務未配置錯誤，不將它解釋成網站未登入。先保留目前進度與下一步，請使用者：「請完整退出 Codex（macOS 可按 Command + Q），再重新開啟，回到原對話輸入『繼續』；不需要建立新對話或重做已完成的 OAuth。」等待本人回報，不連續重試相同失敗呼叫，也不直接改走整套人工建置。

重新開啟後重新發現工具，建立當次瀏覽器連線，先列出分頁，再讀取本次目標頁面確認；必要的網站登入另行交接。這次實測重開後內建瀏覽器與 Chrome 均恢復連線，但不保證所有錯誤皆能如此修復。仍失敗就提供實際錯誤與已嘗試步驟，不反覆要求重開、重新授權 n8n MCP 或重新登入網站。Chrome 只在使用者明確選擇後使用；恢復後接續原憑證準備，不重複建立。
