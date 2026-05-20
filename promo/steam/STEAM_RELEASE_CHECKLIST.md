# Steam 上架前檢查表

最後更新：2026-05-20

本檔分三區，按工作性質分類。每完成一項請在 `[ ]` 改為 `[x]`，並在備註欄補充結果或決定內容。

---

## 一、現在就能補（不需製作人決定）

### 素材確認

- [ ] 6 張桌面直式截圖排序合理，涵蓋：標題畫面、戰鬥中、牌型預覽、商店遺物、Boss 枷鎖、靈魂奉獻
  - 備註：
- [ ] 6 張截圖確認適合全年齡顯示（無血腥、無成人內容）
  - 備註：
- [ ] 小膠囊 `store_small_capsule_462x174.png` Logo 在縮圖尺寸下仍清楚可讀
  - 備註：
- [ ] 確認 Library Logo `library_logo_1280x720.png` 在 Steam Library 深色背景下可讀
  - 備註：
- [ ] 確認 Shortcut Icon `shortcut_icon_256x256.png` 在桌面環境清晰
  - 備註：

### Build 確認

- [ ] `npm.cmd run steam:build` 可正常產出 `dist/steam-demo`（無錯誤）
  - 備註：
- [ ] `dist/steam-demo` 目錄下有完整遊戲檔案，能在瀏覽器本地開啟
  - 備註：
- [ ] `npm.cmd run steam:app` 可正常啟動 Electron 桌面視窗
  - 備註：
- [ ] Electron 視窗預設尺寸為 540×960，比例正確（9:16 直式）
  - 備註：
- [ ] Electron 視窗可切換三種解析度（450×800、540×960、675×1200），切換後畫面縮放正確
  - 備註：
- [ ] Electron build 可在**沒有網路連線**的環境下正常啟動並遊玩
  - 備註：
- [ ] 存檔路徑確認使用 Electron `userData` 資料夾，不依賴外部伺服器
  - 備註：（預期路徑：`%APPDATA%\bibi-dice\` 或類似位置）
- [ ] 重開 Electron 後存檔資料（靈魂奉獻、收集冊）可正確讀取
  - 備註：

### i18n 確認

- [ ] 確認四個語系（繁中、簡中、英文、日文）切換正常
  - 備註：

---

## 二、需製作人決定

- [ ] **遊戲定價**：建議 Demo 免費、正式版 US$2.99，確認後填入 Steamworks 定價頁
  - 決定：
- [ ] **商店標籤**：確認核心標籤與備用標籤（草案見 `STEAM_STORE_BRIEF.md`）
  - 核心標籤草案：Roguelite、Dice、Deckbuilding、Strategy、Turn-Based、Score Attack、Replay Value、Singleplayer、Casual、Indie
  - 決定：
- [ ] **支援語言**：繁體中文、簡體中文、英文、日文（介面文字已完成）；音效與字幕語言待確認
  - 決定：
- [ ] **年齡分級**：需完成 IARC 自評問卷（Steam 後台內建），決定遊戲是否含暴力、賭博、恐怖等元素描述
  - 決定：
- [ ] **AI 生成素材揭露**：確認素材（截圖、Capsule、Library 圖）是否有 AI 生成圖，Steam 後台要求勾選揭露
  - 決定（是 / 否）：
- [ ] **Library Hero 處置**：目前暫不產出；確認正式上架前是否補做，或維持不提交
  - 決定：
- [ ] **Page Background（1438×810）**：目前缺；確認是否要在上架前補做
  - 決定：
- [ ] **Steam Trailer**：目前有 25 秒宣傳影片草稿（`bibi-dice-cn-promo.mp4`），確認是否剪出 Steam trailer 版本
  - 決定：
- [ ] **Coming Soon 頁公開時機**：Steam 規定 Coming Soon 需公開至少 2 週才能發布；確認目標發布日與倒推上線日
  - 決定：
- [ ] **Developer / Publisher 名稱**：Steamworks 後台顯示名稱，確認中英文呈現方式
  - 決定：

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
- [ ] 設定支援語言（介面：繁中、簡中、英、日）
- [ ] 設定遊戲分類標籤（Roguelite、Dice 等）
- [ ] 設定定價（正式版 US$2.99，Demo 免費）
- [ ] 確認系統需求欄位（Windows 最低規格）

### Build 上傳與審核

- [ ] 安裝 SteamPipe CLI（`steamcmd`）並設定 depot
- [ ] 上傳 `dist/steam-demo` 作為 Demo Build
- [ ] 在後台確認 Build 出現在 Builds 頁面
- [ ] 送出 Base Game Store Presence 審核
- [ ] Coming Soon 頁公開（目標時間：待定）
- [ ] 等待至少 2 週後，送出 Demo Build 與 Demo Store Presence 審核
- [ ] Demo 審核通過後發布

---

## 備注

- 詳細商店文案草案：[`STEAM_STORE_BRIEF.md`](STEAM_STORE_BRIEF.md)
- Demo / 正式版承諾範圍：[`FULL_VERSION_SCOPE.md`](FULL_VERSION_SCOPE.md)
- 素材尺寸與現有檔案：[`ASSET_CHECKLIST.md`](ASSET_CHECKLIST.md)
- 桌面直式策略：[`STEAM_DESKTOP_PORTRAIT_STRATEGY.md`](STEAM_DESKTOP_PORTRAIT_STRATEGY.md)
