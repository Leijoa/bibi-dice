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
- 工作中發現的 bug、風險、缺漏、待確認事項，即使尚未修正，也必須寫入本檔的「待處理問題」或當次工作紀錄。
- 已完成的問題不得只從待處理清單刪除，必須移到「已處理問題」並註明完成日期與處理方式。

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

## 待處理問題

| 狀態 | 發現日期 | 發現者 | 問題 | 影響 | 預計處理 |
| --- | --- | --- | --- | --- | --- |
| ~~已完成~~ | 2026-05-20 | 阿扣 → 阿扣 | `package.json` 缺少 `name`、`productName`、`version` 欄位。 | Electron 可能把 app 名稱視為 `Electron`，導致 `userData` 存檔路徑落到 `%APPDATA%\Electron\`，未來與其他 Electron app 或 debug 存檔混淆。 | 已修正，見「已處理問題」。 |

## 已處理問題

| 完成日期 | 處理者 | 問題 | 處理方式 | 驗證 |
| --- | --- | --- | --- | --- |
| 2026-05-20 | 阿扣 | `package.json` 缺少 `name`、`productName`、`version`，Electron userData 路徑為 `%APPDATA%\Electron\`。 | 加入 `"name": "bibi-dice"`、`"productName": "BIBI DICE 比比丟八"`、`"version": "0.1.0"`。 | 靜態確認欄位已寫入；執行期 userData 路徑須製作人實際啟動 Electron 後以 `app.getPath('userData')` 確認。 |
| 2026-05-20 | 鑀韻東 | `library_logo_1280x720.png` 使用普通系統字，風格不符合主視覺。 | 改為從 `img/home_bg.webp` 擷取主視覺美術 Logo，輸出透明 PNG。 | 已重跑 `npm.cmd run steam:library` 並確認尺寸為 `1280x720`。 |
| 2026-05-20 | 鑀韻東 | `library_hero_3840x1240.png` 與遊戲本體關聯不足，可能被誤用。 | 從產圖腳本移除 Library Hero 產出，檔案由製作人刪除後不再重生。 | 已確認重跑 `npm.cmd run steam:library` 不會產出 `library_hero_3840x1240.png`。 |

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

1. ~~新增 `promo/steam/STEAM_RELEASE_CHECKLIST.md`~~（已完成 2026-05-20）
2. 依 `STEAM_RELEASE_CHECKLIST.md` 第一區，逐項驗證：
   - Electron build 能否離線啟動
   - 視窗尺寸預設正確（540×960）
   - 存檔路徑穩定（Electron userData）
   - 重開後存檔可正確讀取
3. 確認 6 張截圖排序與全年齡可顯示
4. 製作人依第二區決定定價、標籤、年齡分級、AI 素材揭露
5. Steamworks 後台第三區，製作人登入後依序操作

## 工作後更新格式

每次 AI 工作完成後，請在本區最上方新增一筆。

請固定使用以下欄位。若沒有內容，請寫「無」，不要省略欄位。

```md
### YYYY-MM-DD 名稱

- 狀態：
- 本次做了什麼：
- 發現的問題：
- 預計但尚未執行的修改：
- 已完成問題：
- 改了哪些檔案：
- 驗證結果：
- 下一步：
- 注意事項：
```

### 2026-05-20 鑀韻東

- 狀態：已完成
- 本次做了什麼：補強 `SYNC.md` 的問題追蹤規則，新增「待處理問題」與「已處理問題」區塊。
- 發現的問題：阿扣發現 `package.json` 缺少 `name`、`productName`、`version` 欄位，但尚未寫入文件。
- 預計但尚未執行的修改：後續需修改 `package.json`，讓 Electron 正確使用 `bibi-dice` / `BIBI DICE 比比丟八` 作為 app 名稱與 `userData` 路徑基準。
- 已完成問題：已把 `package.json` app 命名問題補進「待處理問題」；已把 Library Logo 與 Library Hero 兩個已修事項補進「已處理問題」。
- 改了哪些檔案：`SYNC.md`、`CHANGELOG.md`
- 驗證結果：已確認 `SYNC.md` 包含待處理與已處理問題清單。
- 下一步：修正 `package.json` app 命名欄位，並驗證 Electron `userData` 路徑。
- 注意事項：`.claude/settings.local.json` 是本機設定變更，不應納入專案提交。

### 2026-05-20 阿扣（第二次）

- 狀態：已完成
- 本次做了什麼：靜態驗證 Electron build 架構（離線、視窗尺寸、存檔機制），發現並修正 `package.json` 缺少 app 命名欄位問題。
- 發現的問題：`package.json` 無 `name` / `productName` / `version`，Electron 預設以 `"Electron"` 為 app 名稱，userData 路徑不正確。
- 預計但尚未執行的修改：無。
- 已完成問題：`package.json` app 命名欄位已補齊，問題移至「已處理問題」。
- 改了哪些檔案：`package.json`、`SYNC.md`、`CHANGELOG.md`
- 驗證結果：靜態確認 `dist/steam-demo` 存在、index.html 無外部 CDN、存檔全用 localStorage、視窗預設 540×960、9:16 比例鎖定。執行期 userData 路徑需製作人啟動 Electron 後目視確認。
- 下一步：製作人可執行 `npm.cmd run steam:app:dev` 實際啟動 Electron，確認 userData 路徑與三段解析度切換正常。
- 注意事項：無。

### 2026-05-20 阿扣

- 狀態：已完成
- 本次做了什麼：建立 `promo/steam/STEAM_RELEASE_CHECKLIST.md`，分三區（現在就能補、需製作人決定、Steamworks 後台才能做），涵蓋素材確認、Build 驗證、後台填寫、送審流程。
- 發現的問題：無（本次為新增文件，未修改既有邏輯）。
- 預計但尚未執行的修改：無。
- 已完成問題：無。
- 改了哪些檔案：`promo/steam/STEAM_RELEASE_CHECKLIST.md`（新增）、`SYNC.md`、`CHANGELOG.md`
- 驗證結果：文件結構與 `STEAM_STORE_BRIEF.md`、`FULL_VERSION_SCOPE.md`、`ASSET_CHECKLIST.md` 交叉核對，無遺漏。
- 下一步：依第一區逐項驗證 Electron build（離線、視窗尺寸、存檔路徑）。
- 注意事項：AI 生成素材揭露、Library Hero、Page Background、Trailer 需製作人決定後再填入。

### 2026-05-20 鑀韻東

- 狀態：已完成
- 本次做了什麼：建立 `SYNC.md` 作為所有 AI 的共同同步入口。
- 改了哪些檔案：`SYNC.md`、`CHANGELOG.md`
- 驗證結果：確認專案有 GitHub remote `origin`，本檔位於專案根目錄。
- 下一步：建立 Steam 上架前檢查表 `promo/steam/STEAM_RELEASE_CHECKLIST.md`。
- 注意事項：之後任何 AI 開工前只要先讀 `SYNC.md`，就會被要求補讀 `AGENTS.md` 與 `CHANGELOG.md`。
