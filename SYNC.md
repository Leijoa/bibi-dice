# SYNC.md

這是 `bibi-dice` 專案的 AI 協作同步入口。任何 AI Agent 開始工作前，請先讀本檔，並依照本檔要求補讀其他文件。工作結束後，必須更新本檔與 `CHANGELOG.md`，讓下一位接手者能接上進度。

## 一句話指令

如果製作人只對你說「先讀 SYNC.md」，你必須執行以下流程：

1. 讀 `SYNC.md`
2. 讀 `AGENTS.md`
3. 讀 `CHANGELOG.md`
4. 再讀本次任務相關檔案
5. 開始修改前，先列出預計修改項目與涉及檔案，取得製作人同意
6. 工作完成後，更新 `SYNC.md` 與 `CHANGELOG.md`

## 必守規則

- 全程使用繁體中文溝通、寫計畫、寫紀錄、寫 commit message 與 PR 描述。
- 不要假設現況。修改前先讀相關檔案與最近紀錄。
- 不要跨 `engine.js`、`ui.js`、`data.js` 做無差別重構。
- 新增任何遊戲內顯示文字時，必須同步更新 `js/locales/en.js`、`js/locales/ja.js`、`js/locales/zh-cn.js`、`js/locales/zh-tw.js`。
- 修改後必須記錄到 `CHANGELOG.md`。
- 本檔必須跟著重要進度更新，並在提交或 PR 中同步到 GitHub。

## 協作稱呼

- 阿雲：Google Gemini
- 阿揪：Google Jules
- 阿克：Claude
- 阿扣：Claude Code
- 鑀韻東：Codex

這些稱呼只作為溝通代號，不代表固定分工。製作人會依任務安排誰接手。

## 目前產品方向

狀態：進行中

Steam 版方向已從橫版大螢幕改為「桌面直式小遊戲」。

- 遊戲啟動時以直式桌面視窗呈現，接近手機比例。
- 玩家可切換直式解析度大小，但仍維持直式比例。
- 不承諾 Steam Deck / 掌機橫版支援。
- 定位為約 US$2.99 的輕量桌面小遊戲。
- 目前版本可作為 Demo，正式版再增加成就、靈魂奉獻、更多內容與長線目標。

## 目前 Steam 進度

| 項目 | 狀態 | 備註 |
| --- | --- | --- |
| Steam 桌面直式策略 | 已完成 | 見 `promo/steam/STEAM_DESKTOP_PORTRAIT_STRATEGY.md` |
| Steam Demo 輸出 | 已完成第一版 | `scripts/publish-steam-demo.ps1` 會注入 `steam-portrait` |
| Electron 桌面殼 | 已完成第一版 | `steam-app/main.js`、`steam-app/preload.js` |
| 直式桌面截圖 | 已完成第一版 | `npm.cmd run steam:capture` 可重產 |
| Store Capsule | 已完成第一版 | `npm.cmd run steam:capsules` 可重產 |
| Library Capsule / Header / Logo / Icon | 已完成第一版 | `npm.cmd run steam:library` 可重產 |
| Library Hero | 暫停 / 不做 | 已刪除，不要重產 `library_hero_3840x1240.png` |
| Steam Release Checklist | 待做 | 下一步建議先做 |
| Steam 可上傳 Build / depot 檢查 | 待做 | Release checklist 後進行 |
| Steamworks 後台資料填寫 | 待做 | 需要製作人決定欄位內容 |

## 重要踩雷紀錄

- 不要再走 Steam 橫版 UI 主路線。橫版文件只保留為探索紀錄。
- 不要產出或誤用 `library_hero_3840x1240.png`。前一版素材與遊戲關聯不足，製作人已刪除。
- `library_logo_1280x720.png` 必須使用主視覺美術字風格，不可用普通系統字。
- 正確遊戲名是「比比丟八」，不是「比比丟人」。
- Store / Library 圖不要讓英文 `BIBI DICE` 遮住中文主視覺 Logo。
- Steam screenshot 必須使用實機遊戲畫面；宣傳合成圖不能混進 screenshot 欄位。
- Steam 版不承諾掌機與橫版 UI。

## 目前可用指令

```powershell
npm.cmd run steam:build
npm.cmd run steam:app
npm.cmd run steam:app:dev
npm.cmd run steam:capture
npm.cmd run steam:capsules
npm.cmd run steam:library
```

注意：在 Windows PowerShell 中，優先使用 `npm.cmd`，避免 `npm.ps1` execution policy 問題。

## 下一步建議

狀態：待做

1. 新增 `promo/steam/STEAM_RELEASE_CHECKLIST.md`
2. 把上架前工作分成：
   - 現在就能補
   - 需要製作人決定
   - Steamworks 後台才能做
3. 接著做「Steam 可上傳 Build / depot 檢查」
4. 檢查 Electron build 是否能離線啟動、是否使用正確視窗尺寸、是否有穩定存檔路徑
5. 整理 Steamworks 後台要填的商店文字、標籤、支援語言、價格、年齡分級、AI 生成素材揭露

## 工作後更新格式

每次 AI 工作完成後，請在本區最上方新增一筆。

### 2026-05-20 鑀韻東

- 狀態：已完成
- 本次做了什麼：建立 `SYNC.md` 作為所有 AI 的共同同步入口。
- 改了哪些檔案：`SYNC.md`、`CHANGELOG.md`
- 驗證結果：確認專案有 GitHub remote `origin`，本檔位於專案根目錄。
- 下一步：建立 Steam 上架前檢查表 `promo/steam/STEAM_RELEASE_CHECKLIST.md`。
- 注意事項：之後任何 AI 開工前只要先讀 `SYNC.md`，就會被要求補讀 `AGENTS.md` 與 `CHANGELOG.md`。
