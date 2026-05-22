# Steam 上架前檢查表

最後更新：2026-05-23

本檔分三區，按工作性質分類。每完成一項請在 `[ ]` 改為 `[x]`，並在備註欄補充結果或決定內容。

---

## 一、現在就能補（不需製作人決定）

### 素材確認

- [ ] 6 張桌面直式截圖排序合理，涵蓋：標題畫面、戰鬥中、牌型預覽、商店遺物、Boss 枷鎖、靈魂奉獻
  - 備註：
- [ ] 6 張截圖確認適合全年齡顯示（無血腥、無成人內容）
  - 備註：
- [x] 小膠囊 `store_small_capsule_462x174.png` Logo 在縮圖尺寸下仍清楚可讀
  - 備註：2026-05-21 已重產 Store Capsule D8 修正版，尺寸為 `462x174`；已移除額外英文 `BIBI DICE` 疊字，中文主視覺 Logo 未被遮擋。
- [x] 6 張 Store / Library Capsule D8 修正版已由製作人目視確認通過
  - 備註：2026-05-21 製作人確認 `store_header`、`store_small`、`store_main`、`store_vertical`、`library_capsule`、`library_header_capsule` 六張圖沒有問題。
- [x] Steam 素材檔案完整性與尺寸自動驗證通過
  - 備註：2026-05-21 已新增並執行 `npm.cmd run steam:assets:verify`；D8 修正版重產後再次通過，確認 15 個必要素材尺寸正確，且 `library_hero_3840x1240.png` 不存在。
- [x] 確認 Library Logo `library_logo_1280x720.png` 在 Steam Library 深色背景下可讀
  - 備註：2026-05-21 Library Logo 維持主視覺美術字擷取版；D8 修正版 Library Capsule / Header 重產時未覆蓋 Logo 風格。
- [x] 確認 Shortcut Icon `shortcut_icon_256x256.png` 在桌面環境清晰
  - 備註：2026-05-21 已以 AI 重生 favicon 重產，尺寸驗證通過；仍建議製作人最後目視確認。

### Build 確認

- [x] `npm.cmd run steam:build` 可正常產出 `dist/steam-demo`（無錯誤）
  - 備註：2026-05-20 以 `npm.cmd run steam:verify` 自動重建並通過。
- [x] `dist/steam-demo` 目錄下有完整遊戲檔案，能在瀏覽器本地開啟
  - 備註：已確認包含 `bgm`、`css`、`img`、`js`、`sfx`，Electron 以 `bibi://app/index.html` 載入。
- [x] `npm.cmd run steam:app` 可正常啟動 Electron 桌面視窗
  - 備註：已用 Playwright Electron 啟動 `steam-app/main.js` 驗證。
- [x] Electron 視窗預設尺寸為 540×960，比例正確（9:16 直式）
  - 備註：自動驗證 viewport 為 `540x960`，body 包含 `steam-portrait`。
- [x] Electron 視窗可切換三種解析度（450×800、540×960、675×1200），切換後畫面縮放正確
  - 備註：`npm.cmd run steam:verify` 已驗證 small `450x800`、medium `540x960`、large `675x1200`；large 模式會套用 `steam-portrait-large`。
- [x] Electron build 可在**沒有網路連線**的環境下正常啟動並遊玩
  - 備註：`steam:build` 的離線 runtime 檢查通過，Electron 以本機 `bibi://` protocol 載入，未偵測到外部 runtime 參照。
- [x] 存檔路徑確認使用 Electron `userData` 資料夾，不依賴外部伺服器
  - 備註：已修正 Electron 執行期 app 名稱，驗證結果為 `%APPDATA%\BIBI DICE 比比丟八\`。
- [x] 重開 Electron 後存檔資料（靈魂奉獻、收集冊）可正確讀取
  - 備註：`steam:verify` 寫入臨時 localStorage sentinel，關閉並重開 Electron 後成功讀回，最後已清除測試 key。

### i18n 確認

- [x] 確認四個語系（繁中、簡中、英文、日文）切換正常
  - 備註：2026-05-21 新增 `npm.cmd run steam:i18n:verify` 自動驗證，四語系共 601 個 key 完全對齊。修補日文缺漏 2 個 key（`messages.extremist_zone_note`、`messages.scale_apex_order_note`）。

---

## 二、需製作人決定

- [x] **遊戲定價**：建議 Demo 免費、正式版 US$2.99，確認後填入 Steamworks 定價頁
  - 決定：B-01 US$2.99（Demo 免費）
- [x] **商店標籤**：確認核心標籤與備用標籤
  - 決定：B-02/B-03 全採用核心 10 + 製作人新增「小遊戲」「僅滑鼠」+ 備用 7 個，合計 19 個
- [x] **支援語言**：繁體中文、簡體中文、英文、日文（介面文字已完成）；音效與字幕語言待確認
  - 決定：四語介面，音效與字幕欄位維持不勾選（遊戲無語音對白）
- [~] **年齡分級**：需完成 IARC 自評問卷（Steam 後台內建）
  - 決定：E-01~E-07/E-09 否；E-08 Demo 否、正式版 是；E-10 是。隱私政策已完成，見 `PRIVACY_POLICY.md`；GitHub 公開 URL 為 `https://github.com/Leijoa/bibi-dice/blob/main/promo/steam/PRIVACY_POLICY.md`。Demo 送審時依 Demo 內容作答；正式版需重新評估 E-08
- [x] **AI 生成素材揭露**：確認素材是否有 AI 生成
  - 決定：D-01/02/03/04 是、D-05/06 部分、D-07 否。後台需勾選「使用 AI 生成內容」並貼上揭露文字（見 `STEAMWORKS_FIELDS_DRAFT.md` 第 8 區）
- [x] **Library Hero 處置**：維持不提交
  - 決定：已刪除，不重產
- [~] **Page Background（1438×810）**：先補做，看效果再決定使用
  - 決定：B-05 補做但保留是否上傳的決定權
- [~] **Steam Trailer**：先剪，看效果再決定使用
  - 決定：B-06 剪輯後製作人自行評估
- [x] **Coming Soon 頁公開時機**：Steam 規定 Coming Soon 需公開至少 2 週才能發布
  - 決定：2026-06-01 前完成素材文案 Build；2026-06-03 送商店頁審核；2026-06-10 公開 Coming Soon；2026-07-01 發布 Demo。間隔 21 天符合要求。
- [x] **Developer / Publisher 名稱**：Steamworks 後台顯示名稱
  - 決定：A-01 雷爪獅；A-02 雷爪獅（同 A-01）

---

## 三、Steamworks 後台才能做

以下項目需登入 Steamworks Partner 後台操作，無法由 AI 代勞，請製作人依序完成。

### 應用程式設定

- [ ] 建立 Steam Direct App（需支付 US$100 App Fee，可於收回）
- [ ] 在 App Landing Page 填寫 Base Game 基本資料（名稱、開發商、發行商）
- [ ] 建立 Demo App 並關聯 Base Game

### 商店頁文字

- [ ] 填寫短版描述（上限 300 字元）
  - 草案見 `STEAM_STORE_BRIEF.md`
- [ ] 填寫長版介紹（支援 BBCode）
  - 草案見 `STEAM_STORE_BRIEF.md`
- [ ] 填寫 Base Game 頁的「關於此遊戲」區塊
- [ ] 填寫 Demo 頁的「關於此 Demo」區塊（說明 Demo 包含哪些內容）

### 素材上傳

- [ ] 上傳 Header Capsule `920×430`
- [ ] 上傳 Small Capsule `462×174`
- [ ] 上傳 Main Capsule `1232×706`
- [ ] 上傳 Vertical Capsule `748×896`
- [ ] 上傳 6 張 Screenshot（1920×1080）
- [ ] 上傳 Library Capsule `600×900`
- [ ] 上傳 Library Header Capsule `920×430`
- [ ] 上傳 Library Logo（透明 PNG）
- [ ] 上傳 Shortcut Icon `256×256`
- [ ] 上傳 App Icon `184×184`（JPG）
- [ ] （選擇性）上傳 Page Background `1438×810`
- [ ] （選擇性）上傳 Trailer 影片

### 設定與分級

- [ ] 完成 IARC 年齡分級問卷（後台內建流程）
- [ ] 填寫 AI 生成素材揭露（若有使用 AI 圖）
- [ ] 填寫 Privacy Policy URL：`https://github.com/Leijoa/bibi-dice/blob/main/promo/steam/PRIVACY_POLICY.md`
- [ ] 設定支援語言（介面：繁中、簡中、英、日）
- [ ] 設定遊戲分類標籤（Roguelite、Dice 等）
- [ ] 設定定價（正式版 US$2.99，Demo 免費）
- [ ] 確認系統需求欄位（Windows 最低規格）

### Build 上傳與審核

- [ ] 安裝 SteamPipe CLI（`steamcmd`）並設定 depot
- [ ] 上傳 `dist/steam-demo` 作為 Demo Build
- [ ] 在後台確認 Build 出現在 Builds 頁面
- [ ] 2026-06-03 送出 Base Game Store Presence 審核
- [ ] 2026-06-10 目標公開 Coming Soon 頁
- [ ] 等待至少 2 週後，送出 Demo Build 與 Demo Store Presence 審核
- [ ] 2026-07-01 目標發布 Demo

---

## 備注

- 詳細商店文案草案：[`STEAM_STORE_BRIEF.md`](STEAM_STORE_BRIEF.md)
- Demo / 正式版承諾範圍：[`FULL_VERSION_SCOPE.md`](FULL_VERSION_SCOPE.md)
- 素材尺寸與現有檔案：[`ASSET_CHECKLIST.md`](ASSET_CHECKLIST.md)
- 桌面直式策略：[`STEAM_DESKTOP_PORTRAIT_STRATEGY.md`](STEAM_DESKTOP_PORTRAIT_STRATEGY.md)
