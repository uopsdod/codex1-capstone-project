# 建置規格

## 資料與憑證

同專案 stock_alert_settings：setting_key string、threshold_pct number、symbols string（逗號分隔）、line_user_id string、updated_at date。唯一設定鍵 stock_drop_threshold。新建值 2.5、TSM,NVDA,GOOGL，行情階段收件人可空。先查後建，重複列、缺列、非法值明確停止，不回退預設。用 Data Table 節點讀寫，不假設 Code 能直接讀表。每次手動及排程先讀唯一設定列，向後傳遞同一快照。

「Twelve Data 行情」使用 Query Auth，Name=apikey，Value 由學員私密輸入。「LINE 股價提醒」使用獨立 Bearer Auth，只輸入 Token 原文。AI 準備表單、名稱、類型、專案與節點綁定；只讓學員填秘密並自行儲存。已有可用憑證沿用其 ID，不讀秘密。憑證不足時逐一交接；不要索取 Channel secret 來做單向推播。

## 行情與條件

依當前 Twelve Data time_series 文件使用日線最近兩筆，確認 API 方案與符號實際可取，不承諾方案永遠足夠。排序日期後比較，驗證無 API 錯誤、至少兩個不同日期、有效且大於零的收盤價、預期股票／美國市場／USD，保留來源與查閱時間。缺資料或錯誤不能補零。

changePct=(close-previousClose)/previousClose*100。判斷 changePct < -threshold_pct，用原始精度；等於不通知，上漲或持平不通知，0% 有效。只在顯示時保留兩位小數。嚴格邊界測試可用精確可表示的模擬價格及門檻避免誤把浮點誤差當作規則。

手動使用最新有效日線，盤中不能聲稱已收盤。正式排程 America/New_York，週一至五 17:00（cron 以當前節點能力核對）。正式採紐約當日日線，休市／未更新略過且記錄原因。週末／休市不以舊日線當當日再發。

## LINE 與版型

從 LINE Official Account Manager 啟用 Messaging API，再到同 Provider 的 Developers Console。已有帳號／Token 不重辦或 Reissue。學員完成條款、Provider 選擇、私密輸入及手機加好友。收件人使用同 channel 對應的本人 U 加 32 位十六進位 User ID，放私有設定列；不是 @ Basic ID。缺值或格式不符禁止發送，不用預設收件人。

先 GET https://api.line.me/v2/bot/info，接著 POST https://api.line.me/v2/bot/message/validate/push 驗證 messages，再 POST https://api.line.me/v2/bot/message/push。當前端點與 JSON schema 要重新核對官方文件。Bearer 由憑證處理。無達標股票不產生訊息。

Flex type=flex、動態 altText、bubble size=mega。深藍 header #193747、白色粗體16px、paddingAll 14px，標題 M/d 美股收盤跌幅提醒通知，日期用實際交易日。白色 body paddingAll14px，每檔三個文字元件：名稱（粗體）、收盤價：$xx.xx USD、單日漲跌：↓ x.xx%。內文15px #202A30，股票內 spacing4px，股票間 separator #E0E4E8 約10px 間距。footer #F0F2F5、padding12px、15px，顯示本次門檻及實際通知檔數。名稱台積電 · TSM、輝達 · NVDA、Google · GOOGL；箭頭依方向，百分比絕對值不加正負號。shrink-to-fit、wrap 備援，不固定高度或截字。單檔、多檔與空集合先檢查，手機版面由本人驗收。

## 去重與失敗

正式按股票＋交易日期持久去重，只有 LINE 接受後記錄 accepted，不寫 delivered。手動允許重發，不寫正式排程去重。使用同專案可查詢的持久紀錄，實際表名及欄位交接紀錄，別把一般查再寫當原子鎖。確認併發能力，必要時序列化／排除重疊執行；無法保證就列限制。LINE 成功但記錄失敗或網路結果不明時標為需核對，不自動重試造成重複。API 接受不能代替手機送達。

## 測試設定

預設不改正式門檻。學員具體授權暫改 0.5% 時先保存舊值、阻止正式並行讀到臨時值；無法隔離就不改。執行一次後不論成功失敗立即恢復並讀回，不等待手機確認。若期間他人更改不覆寫新值，報告衝突。0.5% 無股票達標就停，不再降低、不捏造行情。歷史重播限本人已成功真實行情，未啟用隔離副本，同版型邏輯且清楚標歷史，不當作即時端到端驗證。

## 官方來源

製作時於 2026-11-12 開啟：
- https://docs.n8n.io/data/data-tables/
- https://docs.n8n.io/integrations/builtin/credentials/httprequest/
- https://developers.line.biz/en/reference/messaging-api/
- https://twelvedata.com/docs

執行時依實際介面與服務能力更新查核，不能把文件可行當成本帳號實測。帳號流程另查 LINE getting-started、getting-user-ids；排程以 IANA 時區換算，台灣為隔日05:00（美國夏令）或06:00（冬令），不寫全年固定時間。
