# LINE 指令建置：已實測路徑

## 共用設定與條件更新

沿用設定表唯一 setting_key=stock_drop_threshold，保留其他欄位。新增 state_version（number，初始化0）與 event_state（string，初始化 {"events":{},"lastTimestamp":0}）。只有 threshold_pct 是此模式的可調門檻來源；舊 symbols／line_user_id 欄位若存在不可自動覆寫，當前股票與路由仍沿用原通知設定節點。

使用 [指令處理程式](command-processing.js) 的 parseCommand、eligibleEvents、signatureEqual、planEvents 作為可重用邏輯，在 Code 節點內執行，不在 SDK builder 執行。owner 從本次已確認路由取得，不放老師的 User ID。準備候選時取得同一列 id、state_version；Data Table update 的 allConditions 同時比對 id 與舊 state_version，單次更新 threshold_pct、updated_at、state_version、新 event_state。寫入後檢查返回列的新版序號與候選內容，再重新讀取共用列，確認本批事件的 commit 標記。競爭失敗回503，不回覆成功、不繼續LINE回覆。這是帶條件的資料庫更新，不是先查後無條件寫；需核對本次平台實作並用隔離表驗證，不能只憑此文件承諾。

目前個人模式保留24小時內最多5000個事件紀錄，拒絕過期／過度超前事件，防止移除舊去重鍵後又重播更新。超限停止，不默默丟紀錄。批次先依事件時間排序；較舊或同時刻的後到門檻指令不覆蓋現值。主張適用本人低流量用途，不承諾任意高併發或LINE必定重送。可恢復的競爭回503需配合LINE的重送設定；狀態不明先查紀錄。

更新、查詢、格式錯誤與過時指令均先在事件狀態記錄前後值、commit及reply_reserved，再回覆。另在指令紀錄表保存event_id、event_timestamp、old_threshold、new_threshold、action、status、execution_id、recorded_at，不保存Token、原始訊息或完整User ID。回覆用reply API，不使用push；分記reply_reserved／reply_accepted／reply_rejected／reply_unknown。不在不明結果下重用replyToken；設定已成功但回覆失敗仍保留設定成功的事實，不稱手機已收到。

## 原始請求與驗簽

本次實例的 Crypto v2 使用 crypto Credentials，Hmac Secret 存在受保護憑證；HMAC action 設SHA256、base64、binaryData=true，binaryPropertyName=data。Webhook開rawBody。Code用 this.helpers.getBinaryDataBuffer(0,'data') 取得原始位元組；缺資料停止，不能重新JSON序列化冒充原文。先保存 rawBody UTF-8 字串與receivedSignature供驗簽後解析，再讓Crypto對原始binary計算。Crypto輸出不保留binary，後續不可假設它存在；測試產生簽章後若需重建fixture binary，只使用已知隔離原文，不讀取secret。

signatureEqual 比對簽章，失敗走403，且不到設定表／LINE節點。通過後才JSON.parse、核對本人及事件種類。有效空events／無可處理事件回200。真正更新通過條件提交及讀回才回HTTP200，再處理reply；接收、設定寫入與reply接受分開。

## 驗證順序與證據限制

1. Crypto憑證計算HMAC的無副作用測試。
2. 隔離事件測試合法／非法指令、本人限定、群組與非文字、空事件、多事件、重送、亂序、無效設定。
3. 隔離表實測舊版本條件不符時無法寫入；非原子查再寫不能當通過。
4. 相同原始資料程式的簽章正確、內容竄改、簽章缺失案例。
5. 正式指令草稿的Test URL實際HTTP：缺失簽章403、正確簽章空events200、改動原文403。MCP execute_workflow 的 webhookData 在本次環境沒有提供raw binary，會被安全阻擋；不為測試放寬正式驗簽。可用內建瀏覽器按 Execute workflow 啟動測試接收，再對工具讀回的Test URL發送已知隔離請求，仍由MCP讀回Execution；標明瀏覽器啟動、實際HTTP與MCP取證，不能冒稱MCP輸入已通過原始HTTP驗簽。
6. 建立隔離指令副本，只換模擬本人與測試表，移除所有LINE回覆節點；用簽署的模擬事件測完整提交、讀回與重送，確認沒有動正式資料或發LINE。
7. 原通知無推播副本讀正式共用值，確認真實行情計算、IF與Flex使用相同門檻。保留原功能、憑證與排程，驗證後依main範圍發布遷移版。新指令入口仍維持草稿，待上線指示才啟用並替換舊Webhook。
8. LINE真正Verify、本人傳指令與手機看到回覆屬上線後驗證。以同一secret自行簽署的fixture只證明程式一致，尚不證明secret與LINE Channel實際相符。沒有本人新證據不得標手機通過。

資料表、工作流、憑證與Execution ID皆由當次工具取得，不套用本次老師實例。測試流程命名含隔離／不發送、不啟用；已有流程就接續，不重建。測試表欄位與正式表相符但資料分開，完成不自動刪除成果或回復本人正式新門檻。
