### 2026-05-23 鑀韻東（四語系隨機截圖壓測）
- 狀態：完成。
- 任務：依製作人要求，對 `zh-tw`、`zh-cn`、`en`、`ja` 各跑 100 場隨機遊玩流程，並隨機產出 100 張截圖。
- 修改：新增 `scripts/capture-random-locale-playtest.js`，用 Playwright 啟動本機 `dist/steam-demo`，透過既有 dev hook 快速推進遊玩狀態並截圖。
- 產出：`promo/steam/playtest-random-screenshots/2026-05-22T19-32-02-517Z/`，共 100 張 PNG 與 `report.json`。
- 驗證：總場次 400，截圖 100，errorCount 0；截圖分布為 `zh-tw:23`、`zh-cn:25`、`en:24`、`ja:28`。
- 注意：這批截圖是 QA 壓測素材，不是 Steam 商店正式素材。

### 2026-05-23 鑀韻東（新手教學訊息框定位修正）
- 狀態：完成。
- 問題：Steam 直式桌面視窗會將 `#game-container` 以 `scale()` 放大，教學訊息框雖然用 `fixed` 定位，但實際仍受縮放容器影響，導致底部與右側步驟被推出視窗。
- 修改：`js/ui.js` 的 `_positionTutorialTooltip()` 改用 `visualViewport` 量測可視範圍，並將 clamp 後的視窗座標換算回 `#game-container` 的縮放前座標；`css/style.css` 補上教學訊息框寬高限制與內部捲動。
- 驗證：`node --check js/ui.js`、`node --check js/main.js`、`npm.cmd run steam:build` 通過；Playwright 量測 `540x960` 新手教學 step0-step4 無超出可視範圍。
- 下一步：請製作人用 Steam Windows 版本再實機跑一次新手教學，確認商店步驟的手感與遮擋是否符合預期。

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
| Windows Steam Build 打包 | 已完成第一版 | `npm.cmd run steam:package:verify` 會產出並驗證 `dist/steam-windows/BIBI-DICE.exe` |
| 直式桌面截圖 | 已完成第一版 | `npm.cmd run steam:capture` 可重產 |
| Store Capsule | 已完成 D8 修正版，製作人已確認通過 | `npm.cmd run steam:capsules` 可重產；不得額外疊英文遮住中文 Logo |
| Library Capsule / Header / Logo / Icon | 已完成 D8 修正版，製作人已確認通過 | `npm.cmd run steam:library` 可重產；Library Logo 維持主視覺美術字擷取版 |
| Library Hero | 暫停 / 不做 | 已刪除，不要重產 `library_hero_3840x1240.png` |
| 隱私政策 | 已完成，待填入 Steamworks / itch.io | 見 `promo/steam/PRIVACY_POLICY.md`；GitHub 公開 URL：`https://github.com/Leijoa/bibi-dice/blob/main/promo/steam/PRIVACY_POLICY.md`；itch.io 頁面需登入後台手動加入此連結 |
| Steam Release Checklist | 已完成第一版 | 見 `promo/steam/STEAM_RELEASE_CHECKLIST.md` |
| Steam 可上傳 Build / depot 檢查 | Build 已可打包，SteamPipe 待後台 ID | 已通過 Electron 基礎驗證、解析度切換、存檔重開驗證與 Windows exe 煙霧測試；仍需製作人取得 Demo AppID / DepotID 後執行 SteamPipe |
| Steamworks 後台資料填寫 | 進行中 | 已確定 Coming Soon / Demo 目標排程；仍需製作人完成 AI 揭露、IARC、素材目視確認 |

## Steam 目標排程

| 日期 | 目標 |
| --- | --- |
| 2026-06-01 前 | 商店頁素材、文案、Demo Build 準備完成 |
| 2026-06-03 | 送 Steam 商店頁審核 |
| 2026-06-10 | 目標公開 Coming Soon 頁 |
| 2026-07-01 | 目標發布 Demo |

`2026-06-10` 到 `2026-07-01` 間隔 21 天，符合 Steam Coming Soon 頁至少公開 2 週的要求。

## 重要踩雷紀錄

- 不要再走 Steam 橫版 UI 主路線。橫版文件只保留為探索紀錄。
- 不要產出或誤用 `library_hero_3840x1240.png`。前一版素材與遊戲關聯不足，製作人已刪除。
- `library_logo_1280x720.png` 必須使用主視覺美術字風格，不可用普通系統字。
- 正確遊戲名是「比比丟八」，不是「比比丟人」。
- Store / Library 圖不要讓英文 `BIBI DICE` 遮住中文主視覺 Logo。
- `npm.cmd run steam:capsules` 產出的 Store Capsule 不可再額外疊 `BIBI DICE` 或 `bibi-dice` 文字層；只能保留原主視覺中的 Logo。
- Steam screenshot 必須使用實機遊戲畫面；宣傳合成圖不能混進 screenshot 欄位。
- Steam 版不承諾掌機與橫版 UI。

## 待處理問題

| 狀態 | 發現日期 | 發現者 | 問題 | 影響 | 預計處理 |
| --- | --- | --- | --- | --- | --- |
| ~~已完成~~ | 2026-05-20 | 阿扣 → 阿扣 | `package.json` 缺少 `name`、`productName`、`version` 欄位。 | Electron 可能把 app 名稱視為 `Electron`，導致 `userData` 存檔路徑落到 `%APPDATA%\Electron\`，未來與其他 Electron app 或 debug 存檔混淆。 | 已修正，見「已處理問題」。 |
| ~~已完成~~ | 2026-05-20 | 鑀韻東 | 僅補 `package.json` metadata 後，Electron 執行期仍顯示 appName 為 `Electron`，`userData` 仍落在 `%APPDATA%\Electron\`。 | 實際 Steam build 存檔路徑仍可能混淆，阿扣前次靜態修正不足以覆蓋 Electron dev 啟動情境。 | 已在 `steam-app/main.js` 呼叫 `app.setName()`，見「已處理問題」。 |
| ~~已完成~~ | 2026-05-20 | 阿扣 → 鑀韻東 | `store_header_capsule_920x430.png`、`store_small_capsule_462x174.png`、`store_main_capsule_1232x706.png`、`store_vertical_capsule_748x896.png` 四張 Store Capsule 檔案**實際不在 `promo/steam/assets/` 目錄中**，ASSET_CHECKLIST.md 標記為「已產出」但盤點時缺失。 | 上架前缺少必要商店圖片，需重產後才能上傳 Steamworks。 | 已執行 `npm.cmd run steam:capsules` 重產，見「已處理問題」。 |
| ~~已完成~~ | 2026-05-21 | 製作人 → 鑀韻東 | 四張 Store Capsule 修補後仍額外疊上英文 `BIBI DICE` 與 `bibi-dice` 膠囊副標，遮住中文主視覺 Logo，重犯先前已刪除素材的問題。 | 素材尺寸正確但視覺不合格，若上傳會違反製作人已定下的中文 Logo 優先規則。 | 已修正 `scripts/generate-steam-capsules.js` 移除額外文字層並重產，見「已處理問題」。 |
| ~~已完成~~ | 2026-05-21 | 製作人 → 阿扣 | Library Capsule / Header 與四張 Store Capsule（共 6 張）色澤跑掉、整體偏暗（F-01/02/04~07）。 | 6 張關鍵商店圖視覺不合格，目前無法上傳。 | 已改用 D8 修正版 Steam 專用主視覺源圖、降低暗化層並重產，見「已處理問題」。 |
| ~~已完成~~ | 2026-05-21 | 製作人 → 阿扣 | Shortcut Icon `256x256` 與 App Icon `184x184` 由 favicon 縮放產生，品質不足（F-08/F-09）。 | Icon 在 Steam Library 與桌面顯示效果差。 | 已由鑀韻東重生 `favicon.png` 並重產 256×256 PNG 與 184×184 JPG，見「已處理問題」。 |
| ~~已完成~~ | 2026-05-21 | 製作人 → 阿扣 | 開發商 / 發行商名稱（A-01/A-02）列三候選未選定。 | Steamworks 建立 App 後不可改。 | 製作人選定「雷爪獅」，見「已處理問題」。 |
| ~~已完成~~ | 2026-05-21 | 製作人 → 阿扣 | A-07 未提供 itch.io URL。 | Steam 後台 Homepage URL 無法填寫。 | 製作人提供 `https://leijoa.itch.io/bibi-dice`，見「已處理問題」。 |
| ~~已完成~~ | 2026-05-21 | 製作人 → 阿扣 | C-03/04/05 未填。 | Demo 上傳流程細節未定。 | 製作人決定：C-03 先進 internal branch、C-04 製作人 SetLive、C-05 `steam-build/` 加入 .gitignore，見「已處理問題」。 |
| ~~已完成~~ | 2026-05-21 | 製作人 → 阿扣 | D-04 favicon AI 揭露答覆不明確。 | AI 揭露文字無法定稿。 | 製作人確認「是」（含 AI），同時指派鑀韻東重新生成 favicon，見「已處理問題」與新待處理項。 |
| ~~已完成~~ | 2026-05-21 | 製作人 → 鑀韻東 | 製作人不滿意現有 `favicon.png`，已指派鑀韻東重新生成。 | F-08/F-09 Shortcut Icon 與 App Icon 需以新 favicon 為來源重產；AI 揭露文字需依新 favicon 是否含 AI 而定。 | 已由鑀韻東重生暗紫霓虹骰子 `favicon.png`，並同步更新 AI 揭露文字，見「已處理問題」。 |
| 待填後台 | 2026-05-21 | 製作人 → 阿扣 → 鑀韻東 | E-10 答「是」（將收集玩家遊玩數據評估更新方向），觸發 Steam 隱私政策審查需求。 | 上架前需提供隱私政策連結，否則 Steam 商店審核可能退回。 | 2026-05-23 已轉為正式政策 `promo/steam/PRIVACY_POLICY.md` 並補入公開聯絡信箱；GitHub 公開 URL：`https://github.com/Leijoa/bibi-dice/blob/main/promo/steam/PRIVACY_POLICY.md`。Steamworks 可填此 URL；itch.io 頁面需登入後台手動加入此連結。 |

## 已處理問題

| 完成日期 | 處理者 | 問題 | 處理方式 | 驗證 |
| --- | --- | --- | --- | --- |
| 2026-05-21 | 阿扣 | 日文 locale 缺少 2 個 key（`messages.extremist_zone_note`、`messages.scale_apex_order_note`）。 | 補入日文翻譯「{0} Dゾーン x{1}」與「{0} 絶対秩序倍率 x{1}」。 | `npm.cmd run steam:i18n:verify` 通過，四語系共 601 個 key 完全對齊。 |
| 2026-05-21 | 製作人 → 阿扣 | A-01/A-02 開發商與發行商名稱三選一未定。 | 製作人選定「雷爪獅」，A-02 同 A-01。 | 已同步至 `STEAMWORKS_FIELDS_DRAFT.md` 第 1 / 第 10 區與 `STEAM_RELEASE_CHECKLIST.md` 第二區。 |
| 2026-05-21 | 製作人 → 阿扣 | A-07 itch.io URL 未提供。 | 製作人提供 `https://leijoa.itch.io/bibi-dice`。 | 已同步至 `STEAMWORKS_FIELDS_DRAFT.md` 第 1 / 第 10 區。 |
| 2026-05-21 | 製作人 → 阿扣 | C-03/C-04/C-05 SteamPipe 流程細節未定。 | 製作人決定：先進 internal branch 自測、製作人本人 SetLive、`steam-build/` 加入 `.gitignore`。 | 已同步至 `STEAMPIPE_DEPOT_DRAFT.md` 第 3 / 4 / 6 區；`.gitignore` 已加入 `steam-build/`。 |
| 2026-05-21 | 製作人 → 阿扣 | D-04 favicon AI 揭露答覆不明確。 | 製作人確認「是」（含 AI），並指派鑀韻東重新生成 favicon。 | 已同步至 `STEAMWORKS_FIELDS_DRAFT.md` 第 8 / 第 10 區；favicon 重生任務已由鑀韻東於 2026-05-21 完成。 |
| 2026-05-21 | 鑀韻東 | `favicon.png` 舊版風格不符合目前 Steam 主視覺，且 Shortcut / App Icon 品質不足。 | 使用 AI 生成暗紫霓虹骰子新版 `favicon.png`，並重產 `shortcut_icon_256x256.png` 與 `app_icon_184x184.jpg`。 | `npm.cmd run steam:assets:verify` 通過，確認 15 個必要素材尺寸正確且 `library_hero_3840x1240.png` 維持不存在。 |
| 2026-05-21 | 鑀韻東 | Store / Library Capsule 色澤偏暗，且角色手上骰子不是遊戲內八面骰。 | 參考原主視覺、遊戲內 `dice_8.webp` / `dice_1.webp` 與真實 D8 形體，使用 AI 生成 `promo/steam/source/key_art_d8_banner.png` 與 `promo/steam/source/key_art_d8_portrait.png`；修改 Store / Library 產圖腳本改用新源圖並降低暗化層，重產 F-01/02/04~07 共 6 張 Capsule。 | `node --check scripts/generate-steam-capsules.js`、`node --check scripts/generate-steam-library-assets.js`、`npm.cmd run steam:capsules`、`npm.cmd run steam:library`、`npm.cmd run steam:assets:verify` 全部通過；15 個必要素材尺寸正確，`library_hero_3840x1240.png` 維持不存在。 |
| 2026-05-20 | 阿扣 | `package.json` 缺少 `name`、`productName`、`version`，Electron userData 路徑為 `%APPDATA%\Electron\`。 | 加入 `"name": "bibi-dice"`、`"productName": "BIBI DICE 比比丟八"`、`"version": "0.1.0"`。 | 靜態確認欄位已寫入；執行期 userData 路徑須製作人實際啟動 Electron 後以 `app.getPath('userData')` 確認。 |
| 2026-05-20 | 鑀韻東 | Electron dev / Playwright 啟動時仍使用預設 appName `Electron`，導致 `userData` 路徑仍為 `%APPDATA%\Electron\`。 | `steam-app/main.js` 讀取 `package.json`，並在 app ready 前呼叫 `app.setName(productName || name || 'bibi-dice')`。 | `npm.cmd run steam:verify` 通過，輸出 appName 為 `BIBI DICE 比比丟八`，userData 為 `%APPDATA%\BIBI DICE 比比丟八\`。 |
| 2026-05-21 | 鑀韻東 | 阿扣盤點發現四張 Store Capsule 檔案缺失。 | 執行 `npm.cmd run steam:capsules` 重產 `store_header_capsule_920x430.png`、`store_small_capsule_462x174.png`、`store_main_capsule_1232x706.png`、`store_vertical_capsule_748x896.png`。 | 以 `System.Drawing` 驗證尺寸分別為 `920x430`、`462x174`、`1232x706`、`748x896`；並目視確認小膠囊標題可讀。 |
| 2026-05-21 | 鑀韻東 | Store Capsule 腳本額外疊英文，遮住中文主視覺 Logo。 | 修改 `scripts/generate-steam-capsules.js`，移除 `.title`、`.subtitle` 與對應 DOM，讓四張 Store Capsule 只使用原主視覺，不再額外疊英文標題。 | 已重跑 `npm.cmd run steam:capsules`、`npm.cmd run steam:assets:verify`，並目視確認四張修正版沒有額外英文遮住中文 Logo。 |
| 2026-05-20 | 鑀韻東 | `library_logo_1280x720.png` 使用普通系統字，風格不符合主視覺。 | 改為從 `img/home_bg.webp` 擷取主視覺美術 Logo，輸出透明 PNG。 | 已重跑 `npm.cmd run steam:library` 並確認尺寸為 `1280x720`。 |
| 2026-05-20 | 鑀韻東 | `library_hero_3840x1240.png` 與遊戲本體關聯不足，可能被誤用。 | 從產圖腳本移除 Library Hero 產出，檔案由製作人刪除後不再重生。 | 已確認重跑 `npm.cmd run steam:library` 不會產出 `library_hero_3840x1240.png`。 |

## 目前可用指令

```powershell
npm.cmd run steam:build
npm.cmd run steam:package
npm.cmd run steam:package:verify
npm.cmd run steam:app
npm.cmd run steam:app:dev
npm.cmd run steam:verify
npm.cmd run steam:capture
npm.cmd run steam:capsules
npm.cmd run steam:assets:verify
npm.cmd run steam:i18n:verify
npm.cmd run steam:library
```

注意：在 Windows PowerShell 中，優先使用 `npm.cmd`，避免 `npm.ps1` execution policy 問題。

## 下一步建議

狀態：待做

1. ~~新增 `promo/steam/STEAM_RELEASE_CHECKLIST.md`~~（已完成 2026-05-20）
2. ~~驗證 Electron build、預設視窗尺寸與 userData 路徑~~（已完成 2026-05-20）
3. ~~驗證三段解析度切換與重開後存檔可正確讀取~~（已完成 2026-05-20）
4. ~~確認 6 張截圖排序與全年齡可顯示~~（阿扣已完成 2026-05-20，見 `promo/steam/STEAM_ASSET_FINAL_AUDIT.md`）
5. 製作人依第二區完成剩餘決策：年齡分級、AI 素材揭露、素材目視確認
6. Steamworks 後台第三區，製作人登入後依序操作

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

### 2026-05-23 鑀韻東（Windows 打包）

- 狀態：已完成
- 本次做了什麼：新增 Steam Windows portable 打包流程，使用既有 Electron runtime 產出 `dist/steam-windows/BIBI-DICE.exe`；新增封裝後 build 驗證腳本；更新 `package.json` 指令 `steam:package` 與 `steam:package:verify`；同步修正 SteamPipe 文件與上架檢查表，明確 SteamPipe ContentRoot 應使用 `dist/steam-windows`。
- 發現的問題：Windows PowerShell 5 對無 BOM 腳本中的中文預設 exe 檔名解碼不穩，會造成非法路徑錯誤；已改用 ASCII 檔名 `BIBI-DICE.exe`，遊戲顯示名稱仍由 Electron app name 顯示為 `BIBI DICE 比比丟八`。Playwright `_electron.launch` 不適合直接連封裝後 exe，驗證改為檔案結構檢查 + exe 啟動煙霧測試。
- 預計但尚未執行的修改：等待製作人取得 Demo AppID / DepotID 後，建立實際 `steam-build/*.vdf` 並執行 steamcmd 上傳。
- 已完成問題：Steam Build 已從純 web / dev Electron 驗證推進到可供 SteamPipe 上傳的 Windows portable build 資料夾。
- 改了哪些檔案：`scripts/package-steam-windows.ps1`（新增）、`scripts/verify-steam-windows-build.js`（新增）、`package.json`、`promo/steam/STEAMPIPE_DEPOT_DRAFT.md`、`promo/steam/STEAM_RELEASE_CHECKLIST.md`、`SYNC.md`、`CHANGELOG.md`
- 驗證結果：`npm.cmd run steam:package:verify` 通過，確認 `dist/steam-windows/BIBI-DICE.exe`、`resources/app`、`resources/app/dist/steam-demo/index.html` 與 Electron runtime 存在，且 exe 啟動煙霧測試通過。
- 下一步：製作人等待 Steamworks / TaxIdentity 審核；通過後建立 Demo App / Depot，取得真實 AppID / DepotID，依 `STEAMPIPE_DEPOT_DRAFT.md` 上傳 `dist/steam-windows`。
- 注意事項：`dist/steam-windows` 是產物，不提交 Git；Steamworks Launch Option 請填 `BIBI-DICE.exe`。

### 2026-05-23 鑀韻東（Windows 打包修正）

- 狀態：已完成
- 本次做了什麼：修正 `BIBI-DICE.exe` 雙擊時的 Electron 主程序錯誤；封裝後 `resources/app/package.json` 會補入 `main: "steam-app/main.js"`，並將 packaged metadata 的 `productName` 改為 ASCII，以避開 Electron 42 對 packaged `package.json` 中文 `productName` 的 access violation 問題；Electron 顯示名稱改由 `steam-app/main.js` 明確設定為 `BIBI DICE 比比丟八`。
- 發現的問題：封裝後 package 缺少 `main` 時，Electron 會預設尋找 `resources/app/index.js`；補上 main 後，又發現 packaged `package.json` 含中文 `productName` 會讓此 Electron runtime 直接崩潰。
- 預計但尚未執行的修改：無。
- 已完成問題：`BIBI-DICE.exe` 可啟動並保持開啟；不再跳出 `Cannot find module ... index.js`。
- 改了哪些檔案：`scripts/package-steam-windows.ps1`、`scripts/verify-steam-windows-build.js`、`steam-app/main.js`、`SYNC.md`、`CHANGELOG.md`
- 驗證結果：`npm.cmd run steam:package:verify` 通過，確認封裝後 `packageMain` 與 `launchSmoke` 均為 true。
- 下一步：製作人可重新雙擊 `D:\unity\bibi-dice\dist\steam-windows\BIBI-DICE.exe` 測試；通過後等待 Steamworks ID 進行 SteamPipe。
- 注意事項：封裝用 `package.json` 的 `productName` 是 ASCII，但 app 執行期名稱仍是 `BIBI DICE 比比丟八`。

### 2026-05-23 鑀韻東

- 狀態：已完成
- 本次做了什麼：將隱私政策草稿轉為正式公開文件 `promo/steam/PRIVACY_POLICY.md`，補入公開聯絡信箱 `leijoalion@gmail.com`，並把 Steamworks 文件中的 Privacy Policy URL 統一指向 GitHub 公開頁面。
- 發現的問題：`scripts/publish-itch.ps1` 只能透過 butler 上傳遊戲檔案，不能修改 itch.io 專案頁描述、外部連結或新增隱私政策欄位；itch.io 頁面仍需製作人登入後台手動加入 GitHub 隱私政策 URL。
- 預計但尚未執行的修改：若製作人要求，我方可再整理 itch.io 頁面要貼的短文案。
- 已完成問題：E-10 隱私政策文件與 GitHub 公開 URL 已準備完成；Steamworks 後台仍待填 URL。
- 改了哪些檔案：`promo/steam/PRIVACY_POLICY.md`、`promo/steam/STEAM_RELEASE_CHECKLIST.md`、`promo/steam/STEAMWORKS_FIELDS_DRAFT.md`、`promo/steam/STEAMWORKS_ONBOARDING_FLOW.md`、`SYNC.md`、`CHANGELOG.md`
- 驗證結果：`npm.cmd run steam:i18n:verify` 通過，四語系各 601 keys 完全對齊；`rg` 已確認正式隱私政策文件含繁中 / 英文聯絡信箱，主要 Steam 文件均指向 `PRIVACY_POLICY.md`。
- 下一步：提交並推送至 GitHub；製作人登入 itch.io 編輯頁，加入隱私政策 URL。
- 注意事項：不要把 `.claude/settings.local.json` 或 `promo/steam/assets - 複製/` 納入提交。

### 2026-05-22 鑀韻東

- 狀態：已完成
- 本次做了什麼：新增 `promo/steam/PRIVACY_POLICY_DRAFT.md`，整理繁中與英文隱私政策草稿，說明目前 Demo 本機存檔、未來可能收集匿名 / 彙整遊玩數據、Steam 平台資料分工、資料用途、保存與刪除、第三方服務、兒童隱私與政策更新；同步更新 Steam 上架檢查表、Steamworks 欄位草稿與 Steamworks 後台流程表。
- 發現的問題：隱私政策草稿仍缺製作人的公開聯絡信箱；Steamworks 後台仍需要一個公開 URL，草稿檔本身不能直接填入後台。
- 預計但尚未執行的修改：不替製作人發布公開頁面；待製作人決定發布位置並補上聯絡信箱後，再回填 Steamworks 文件。
- 已完成問題：E-10 隱私政策「撰寫草稿」已完成；但「公開 URL」仍為待發布狀態。
- 改了哪些檔案：`promo/steam/PRIVACY_POLICY_DRAFT.md`（新增）、`promo/steam/STEAM_RELEASE_CHECKLIST.md`、`promo/steam/STEAMWORKS_FIELDS_DRAFT.md`、`promo/steam/STEAMWORKS_ONBOARDING_FLOW.md`、`SYNC.md`、`CHANGELOG.md`
- 驗證結果：文件交叉搜尋 `E-10`、`隱私政策`、`Privacy`，確認主要狀態已從「缺草稿」更新為「草稿完成，待發布 URL」。
- 下一步：製作人補公開聯絡信箱並選擇隱私政策發布位置；完成後把 URL 填入 Steamworks Privacy Policy URL 欄位。
- 注意事項：本草稿不是法律意見；若正式版加入第三方分析、雲端、成就、排行榜或當機回報，發布前需再次更新隱私政策。

### 2026-05-21 阿扣（第五次）

- 狀態：已完成
- 本次做了什麼：(1) 建立 `promo/steam/STEAMWORKS_ONBOARDING_FLOW.md`，整理 9 階段 Steamworks 後台流程含甘特圖、阻塞依賴、必死注意事項；(2) 建立 `scripts/verify-i18n.js` 自動比對四語系 key 並加入 `npm.cmd run steam:i18n:verify`；(3) 修補日文 locale 缺漏的 2 個 key。
- 發現的問題：日文 `ja.js` 缺少 `messages.extremist_zone_note` 與 `messages.scale_apex_order_note`，已即時補上。
- 預計但尚未執行的修改：無。
- 已完成問題：i18n 四語系切換驗證（檢查表第一區唯一未勾項）；日文 2 個缺失 key。
- 改了哪些檔案：`promo/steam/STEAMWORKS_ONBOARDING_FLOW.md`（新增）、`scripts/verify-i18n.js`（新增）、`js/locales/ja.js`、`package.json`、`promo/steam/STEAM_RELEASE_CHECKLIST.md`、`SYNC.md`、`CHANGELOG.md`
- 驗證結果：`npm.cmd run steam:i18n:verify` 通過，zh-tw/zh-cn/en/ja 四語系各 601 個 key 完全對齊。
- 下一步：(1) 製作人最高優先：撰寫隱私政策頁面（E-10）+ 登入 Steamworks 走階段 1~2；(2) 選擇性：Page Background 1438×810 補做、Steam Trailer 剪輯。
- 注意事項：Steamworks 流程表中標註的「30 天 App 冷卻期」是隱性阻塞，5/23 前建立 App 才能保證 6/22 前解除冷卻、7/1 順利發布 Demo。

### 2026-05-21 鑀韻東

- 狀態：已完成
- 本次做了什麼：依製作人回覆，將 Store / Library Capsule D8 修正版 6 張素材標記為「製作人已確認通過」，並準備提交同步至 GitHub。
- 發現的問題：無。
- 預計但尚未執行的修改：E-10 隱私政策頁面仍待製作人準備；Page Background 與 Trailer 仍為選擇性待做。
- 已完成問題：F-01/02/04~07 六張 Capsule 已從「待製作人最終目視」更新為「製作人確認通過」。
- 改了哪些檔案：`SYNC.md`、`promo/steam/STEAM_ASSET_FINAL_AUDIT.md`、`promo/steam/STEAM_RELEASE_CHECKLIST.md`、`CHANGELOG.md`
- 驗證結果：文件狀態已同步；提交前會再次執行 `npm.cmd run steam:assets:verify`。
- 下一步：提交並推送目前 Steam 上架素材與同步文件；接著處理 E-10 隱私政策草稿。
- 注意事項：`.claude/settings.local.json` 是本機設定，不納入提交。

### 2026-05-21 鑀韻東

- 狀態：已完成
- 本次做了什麼：依製作人提供的原主視覺、遊戲內藍色八面骰與真實 D8 參考，重生 Steam 專用 D8 主視覺源圖 `key_art_d8_banner.png` / `key_art_d8_portrait.png`；修改 Store / Library 產圖腳本改用新源圖並降低暗化層，重產 F-01/02/04~07 共 6 張 Capsule。
- 發現的問題：舊 Capsule 不只是偏暗，角色手上的骰子也偏六面黑金骰，與遊戲實際八面骰美術不一致。
- 預計但尚未執行的修改：E-10 隱私政策頁面仍待製作人準備；Page Background 與 Trailer 仍為選擇性待做。
- 已完成問題：Store / Library Capsule 色澤偏暗與角色手上骰子不真實問題已移到「已處理問題」。
- 改了哪些檔案：`promo/steam/source/key_art_d8_banner.png`、`promo/steam/source/key_art_d8_portrait.png`、`promo/steam/assets/store_header_capsule_920x430.png`、`promo/steam/assets/store_small_capsule_462x174.png`、`promo/steam/assets/store_main_capsule_1232x706.png`、`promo/steam/assets/store_vertical_capsule_748x896.png`、`promo/steam/assets/library_capsule_600x900.png`、`promo/steam/assets/library_header_capsule_920x430.png`、`scripts/generate-steam-capsules.js`、`scripts/generate-steam-library-assets.js`、`promo/steam/ASSET_CHECKLIST.md`、`promo/steam/STEAM_ASSET_FINAL_AUDIT.md`、`promo/steam/STEAM_RELEASE_CHECKLIST.md`、`promo/steam/STEAMWORKS_FIELDS_DRAFT.md`、`SYNC.md`、`CHANGELOG.md`
- 驗證結果：`node --check scripts/generate-steam-capsules.js` 通過；`node --check scripts/generate-steam-library-assets.js` 通過；`npm.cmd run steam:capsules` 通過；`npm.cmd run steam:library` 通過；`npm.cmd run steam:assets:verify` 通過，15 個必要素材尺寸正確且 `library_hero_3840x1240.png` 維持不存在。
- 下一步：請製作人目視確認 D8 修正版 6 張 Capsule 是否可上傳；若通過，下一步可處理 E-10 隱私政策頁面或選擇性 Page Background。
- 注意事項：D8 修正版主視覺源圖含 AI 生成 / 編修，Steamworks AI 揭露草稿已同步補入 revised Steam Capsule key art。

### 2026-05-21 鑀韻東

- 狀態：已完成
- 本次做了什麼：重生 `favicon.png`，將舊版藍色花體 B icon 替換為暗紫霓虹水晶骰子 icon；以新版 favicon 重產 `shortcut_icon_256x256.png` 與 `app_icon_184x184.jpg`，並同步更新素材盤點、Release checklist 與 Steamworks AI 揭露草稿。
- 發現的問題：無新增問題；本次處理的是既有 F-08/F-09 Icon 品質不足與 favicon 重生任務。
- 預計但尚未執行的修改：F-01/02/04~07 Capsule 色澤偏暗後續已由鑀韻東於 2026-05-21 修正；E-10 隱私政策頁面仍待製作人準備。
- 已完成問題：Shortcut Icon / App Icon 品質不足、`favicon.png` 重生任務共 2 項，已移到「已處理問題」。
- 改了哪些檔案：`favicon.png`、`promo/steam/assets/shortcut_icon_256x256.png`、`promo/steam/assets/app_icon_184x184.jpg`、`promo/steam/ASSET_CHECKLIST.md`、`promo/steam/STEAM_ASSET_FINAL_AUDIT.md`、`promo/steam/STEAM_RELEASE_CHECKLIST.md`、`promo/steam/STEAMWORKS_FIELDS_DRAFT.md`、`SYNC.md`、`CHANGELOG.md`
- 驗證結果：已確認 `favicon.png` 為 512×512、`shortcut_icon_256x256.png` 為 256×256、`app_icon_184x184.jpg` 為 184×184；`npm.cmd run steam:assets:verify` 通過，15 個必要 Steam 素材尺寸皆正確，`library_hero_3840x1240.png` 維持不存在。
- 下一步：修正 Store / Library Capsule 色澤偏暗問題，或由製作人先準備 E-10 隱私政策頁面。
- 注意事項：新版 favicon / Shortcut Icon / App Icon 含 AI 生成，Steamworks AI 揭露草稿已同步加入 application icon 說明。

### 2026-05-21 阿扣（第四次）

- 狀態：已完成
- 本次做了什麼：依製作人補填的 5 項決定（A-01/02 雷爪獅、A-07 itch.io URL、C-03/04/05 SteamPipe 流程、D-04 favicon 是 AI 含並指派鑀韻東重生）同步 5 份文件，並修改 `.gitignore` 加入 `steam-build/`。
- 發現的問題：D-04 衍生新任務 — 製作人指派鑀韻東重新生成 `favicon.png`，需追蹤 F-08/F-09 Icon 與 AI 揭露文字後續更新；E-10 隱私政策仍待製作人撰寫。
- 預計但尚未執行的修改：F-01/02/04~07 Capsule 色澤偏暗後續已由鑀韻東於 2026-05-21 修正；F-08/F-09 Icon 後續已由鑀韻東於 2026-05-21 完成；隱私政策頁面未建立。
- 已完成問題：A-01/02 開發商選定、A-07 URL 提供、C-03/04/05 流程定案、D-04 揭露答案明確化共 4 項，全部移到「已處理問題」。
- 改了哪些檔案：`.gitignore`、`promo/steam/STEAMWORKS_FIELDS_DRAFT.md`、`promo/steam/STEAM_RELEASE_CHECKLIST.md`、`promo/steam/STEAMPIPE_DEPOT_DRAFT.md`、`promo/steam/STEAM_ASSET_FINAL_AUDIT.md`、`SYNC.md`、`CHANGELOG.md`
- 驗證結果：5 份文件交叉核對，A-01「雷爪獅」、A-07 URL、C-03~05、D-04 在所有對應位置均一致；`.gitignore` 新增 `steam-build/` 一行。
- 下一步：(1) 鑀韻東執行 favicon 重生任務；(2) 鑀韻東或阿揪修產圖腳本解決 Capsule 色澤偏暗；(3) 製作人撰寫隱私政策頁面。
- 注意事項：A-04 商店繁中名仍為純「比比丟八」；E-08 IARC 答案 Demo 與正式版不同（送審需分別處理）。

### 2026-05-21 阿扣（第三次）

- 狀態：已完成
- 本次做了什麼：依製作人於 `STEAM_OWNER_DECISIONS.md` 填寫的決策，批量同步 4 份相關文件 — 更新 `STEAMWORKS_FIELDS_DRAFT.md` 第 1/5/8/9/10 區、`STEAM_RELEASE_CHECKLIST.md` 第二區勾選、`STEAM_ASSET_FINAL_AUDIT.md` 第二區改為製作人目視結果。
- 發現的問題：本次同步發現 7 項待釐清項目，全部寫入「待處理問題」：(1) Capsule/Library 6 張色澤偏暗 (2) Icon 兩張需重新設計 (3) A-01/A-02 開發商三選一未定 (4) A-07 itch.io URL 未填 (5) C-03/04/05 未填 (6) D-04 favicon 揭露答案不明確 (7) E-10 需準備隱私政策。
- 預計但尚未執行的修改：色澤偏暗需修改產圖腳本（屬下次任務）；Icon 重新設計屬美術工作（製作人決定）；隱私政策頁面需製作人撰寫。
- 已完成問題：B-01 售價、B-02/B-03 標籤、B-04~B-09 商店頁送審項目、C-01/C-02 排程、D-01/02/03/05/06/07 AI 揭露、E-01~E-09 IARC 大部分項目皆已同步至 STEAMWORKS_FIELDS_DRAFT.md 與 STEAM_RELEASE_CHECKLIST.md。
- 改了哪些檔案：`promo/steam/STEAMWORKS_FIELDS_DRAFT.md`、`promo/steam/STEAM_RELEASE_CHECKLIST.md`、`promo/steam/STEAM_ASSET_FINAL_AUDIT.md`、`SYNC.md`、`CHANGELOG.md`
- 驗證結果：四份文件交叉核對，已決定欄位均同步且彼此一致；7 項待釐清問題均寫入 SYNC.md 待處理區。
- 下一步：(1) 製作人選定 A-01 開發商名稱、提供 itch.io URL、補填 C-03/04/05、釐清 D-04；(2) 製作人撰寫隱私政策頁面；(3) 由其他 AI 處理產圖腳本色澤問題；(4) 製作人安排 Icon 重新設計。
- 注意事項：A-04 商店繁中名改為純「比比丟八」（捨棄中英並列），已同步至 STEAMWORKS_FIELDS_DRAFT.md 第 1 區；E-08 IARC 答案 Demo 與正式版不同，Demo 送審時答「否」，正式版送審前需重新評估。

### 2026-05-21 鑀韻東

- 狀態：已完成
- 本次做了什麼：將製作人確認的 Steam 目標排程寫入同步文件、決策清單、上架檢查表、Steamworks 欄位草稿與 SteamPipe 草案。
- 發現的問題：無新增問題。
- 預計但尚未執行的修改：尚未依剩餘決策更新 AI 生成素材揭露、IARC 問卷與素材目視確認結果。
- 已完成問題：Coming Soon / Demo 目標排程已定案。
- 改了哪些檔案：`SYNC.md`、`CHANGELOG.md`、`promo/steam/STEAM_OWNER_DECISIONS.md`、`promo/steam/STEAM_RELEASE_CHECKLIST.md`、`promo/steam/STEAMWORKS_FIELDS_DRAFT.md`、`promo/steam/STEAMPIPE_DEPOT_DRAFT.md`
- 驗證結果：確認 `2026-06-10` 到 `2026-07-01` 間隔 21 天，符合 Steam Coming Soon 至少公開 2 週要求。
- 下一步：製作人需補完 `STEAM_OWNER_DECISIONS.md` 的 D 區 AI 生成素材揭露、E 區 IARC 問卷、F 區素材目視確認。
- 注意事項：2026-06-01 前需完成商店頁素材、文案與 Demo Build，留出 2026-06-03 送審緩衝。

### 2026-05-21 鑀韻東

- 狀態：已完成
- 本次做了什麼：修正 Store Capsule 產圖腳本，移除額外疊上的英文 `BIBI DICE` 與 `bibi-dice` 膠囊副標，重產四張 Store Capsule 修正版。
- 發現的問題：先前只用 `steam:assets:verify` 驗證尺寸，沒有驗證「英文不可遮住中文 Logo」這條視覺規則，導致尺寸正確但視覺不合格。
- 預計但尚未執行的修改：仍建議製作人於 Steamworks 後台預覽四張 Store Capsule 實際顯示效果。
- 已完成問題：四張 Store Capsule 英文遮擋中文 Logo 問題已修正。
- 改了哪些檔案：`scripts/generate-steam-capsules.js`、`promo/steam/assets/store_header_capsule_920x430.png`、`promo/steam/assets/store_small_capsule_462x174.png`、`promo/steam/assets/store_main_capsule_1232x706.png`、`promo/steam/assets/store_vertical_capsule_748x896.png`、`promo/steam/STEAM_ASSET_FINAL_AUDIT.md`、`promo/steam/STEAM_RELEASE_CHECKLIST.md`、`SYNC.md`、`CHANGELOG.md`
- 驗證結果：`node --check scripts/generate-steam-capsules.js` 通過；`npm.cmd run steam:capsules` 通過；`npm.cmd run steam:assets:verify` 通過；已目視檢查四張修正版，確認沒有額外英文標題遮住中文主視覺 Logo。
- 下一步：製作人可再次目視確認四張 Store Capsule；若通過，後續再處理 Steam Owner Decisions 內的決策欄位。
- 注意事項：素材驗證腳本只能檢查尺寸與檔案存在，不能替代視覺遮擋檢查。

### 2026-05-21 阿扣（第二次）

- 狀態：已完成
- 本次做了什麼：依 `CLAUDE_STEAM_DECISIONS_TASK.md` 建立 `promo/steam/STEAM_OWNER_DECISIONS.md`，集中整理製作人必須親自決定的所有 Steam 上架欄位，分八區：建立 App 前（8 項）、商店頁送審前（9 項）、Demo 發布前（5 項）、AI 揭露（7 項）、IARC 問卷（10 項）、素材目視確認（10 項）、可延後到正式版（10 項）、決策回覆格式範例。
- 發現的問題：無新增問題。本次任務僅整理選項與待確認欄位，未替製作人決定任何答案，符合任務禁止事項。
- 預計但尚未執行的修改：無。
- 已完成問題：無。
- 改了哪些檔案：`promo/steam/STEAM_OWNER_DECISIONS.md`（新增）、`SYNC.md`、`CHANGELOG.md`
- 驗證結果：交叉核對 `STEAM_RELEASE_CHECKLIST.md`、`STEAMWORKS_FIELDS_DRAFT.md`、`STEAM_ASSET_FINAL_AUDIT.md`、`STEAMPIPE_DEPOT_DRAFT.md`、`FULL_VERSION_SCOPE.md`、`STEAM_DESKTOP_PORTRAIT_STRATEGY.md`，所有需製作人決定欄位均已涵蓋並建立同步對應表。
- 下一步：製作人依 `STEAM_OWNER_DECISIONS.md` 第 8 區建議格式回覆，AI 即可依「決定後需同步到」欄位逐一更新對應文件。
- 注意事項：本檔不提供任何決策建議，僅整理選項；製作人決定後請填入「決定」欄位再交給 AI 同步。

### 2026-05-21 鑀韻東

- 狀態：已完成
- 本次做了什麼：新增 Steam 素材完整性自動驗證腳本，將阿扣人工盤點抓到的素材缺漏風險轉成可重複執行的檢查；另建立給阿扣的製作人 Steam 決策清單任務檔。
- 發現的問題：無新增問題。
- 預計但尚未執行的修改：尚未整理製作人決策清單，已交由阿扣依 `promo/steam/CLAUDE_STEAM_DECISIONS_TASK.md` 處理。
- 已完成問題：素材存在性、尺寸與禁止誤用 Library Hero 的自動檢查已完成。
- 改了哪些檔案：`scripts/verify-steam-assets.js`、`package.json`、`promo/steam/CLAUDE_STEAM_DECISIONS_TASK.md`、`promo/steam/STEAM_ASSET_FINAL_AUDIT.md`、`promo/steam/STEAM_RELEASE_CHECKLIST.md`、`SYNC.md`、`CHANGELOG.md`
- 驗證結果：`node --check scripts/verify-steam-assets.js` 通過；`npm.cmd run steam:assets:verify` 通過，確認 15 個必要 Steam 素材存在且尺寸正確，`library_hero_3840x1240.png` 維持不存在。
- 下一步：請阿扣依 `promo/steam/CLAUDE_STEAM_DECISIONS_TASK.md` 產出 `promo/steam/STEAM_OWNER_DECISIONS.md`；我方下一步可整合 `steam:verify` 與 `steam:assets:verify` 成上架前總驗證流程。
- 注意事項：`.claude/settings.local.json` 是本機設定變更，不應納入提交。

### 2026-05-21 阿扣

- 狀態：已完成
- 本次做了什麼：依 `CLAUDE_STEAMPIPE_DRAFT_TASK.md` 建立 `promo/steam/STEAMPIPE_DEPOT_DRAFT.md`，整理 SteamPipe / Depot 上傳操作草案，分八區涵蓋前提條件、Build 來源與重建指令、Depot/Branch 命名建議、Windows 上傳流程、後台檢查項目、製作人專屬事項、可能失敗點排查、正式執行前檢查清單。
- 發現的問題：`steam-build/` 目錄目前不存在，需製作人決定建立位置與是否納入 git；VDF 中的 AppID / DepotID 屬公開資訊，但帳號密碼絕不可寫入。
- 預計但尚未執行的修改：無（任務僅限產出草案文件，不執行 steamcmd、不新增憑證假資料）。
- 已完成問題：無。
- 改了哪些檔案：`promo/steam/STEAMPIPE_DEPOT_DRAFT.md`（新增）、`SYNC.md`、`CHANGELOG.md`
- 驗證結果：草案交叉核對 `publish-steam-demo.ps1` 排除清單、`STEAM_ASSET_FINAL_AUDIT.md`、`STEAMWORKS_FIELDS_DRAFT.md`、`FULL_VERSION_SCOPE.md`，無衝突。所有 AppID / DepotID / 帳號密碼均以 `<待製作人於後台建立後填入>` 占位，無假資料。
- 下一步：製作人完成 Steamworks 後台 App 建立、取得 AppID / DepotID 後，依本草案建立 `steam-build/` 與 VDF 設定檔，即可執行 steamcmd 上傳。
- 注意事項：VDF 設定檔內 AppID / DepotID 可提交 git，但 steamcmd 帳號密碼絕不可寫進任何腳本或文件。

### 2026-05-21 鑀韻東

- 狀態：已完成
- 本次做了什麼：依阿扣的素材盤點結果重產四張缺失的 Store Capsule，驗證尺寸，更新素材盤點與上架檢查表；另建立給阿扣的 SteamPipe / Depot 上傳草案任務檔。
- 發現的問題：無新增問題；阿扣先前指出的 Store Capsule 缺口已確認並修正。
- 預計但尚未執行的修改：尚未建立 SteamPipe / Depot 上傳流程文件，已交由阿扣依 `promo/steam/CLAUDE_STEAMPIPE_DRAFT_TASK.md` 處理。
- 已完成問題：四張 Store Capsule 缺失已修正。
- 改了哪些檔案：`promo/steam/assets/store_header_capsule_920x430.png`、`promo/steam/assets/store_small_capsule_462x174.png`、`promo/steam/assets/store_main_capsule_1232x706.png`、`promo/steam/assets/store_vertical_capsule_748x896.png`、`promo/steam/CLAUDE_STEAMPIPE_DRAFT_TASK.md`、`promo/steam/STEAM_ASSET_FINAL_AUDIT.md`、`promo/steam/STEAM_RELEASE_CHECKLIST.md`、`SYNC.md`、`CHANGELOG.md`
- 驗證結果：`npm.cmd run steam:capsules` 通過；`System.Drawing` 驗證四張圖片尺寸皆符合官方規格；已目視檢查小膠囊 `store_small_capsule_462x174.png` 標題可讀。
- 下一步：請阿扣依 `promo/steam/CLAUDE_STEAMPIPE_DRAFT_TASK.md` 產出 `promo/steam/STEAMPIPE_DEPOT_DRAFT.md`；製作人仍需目視確認所有素材品質與 AI 生成素材揭露。
- 注意事項：`.claude/settings.local.json` 是本機設定變更，不應納入提交。

### 2026-05-20 阿扣（第四次）

- 狀態：已完成
- 本次做了什麼：依 `CLAUDE_ASSET_AUDIT_TASK.md` 對 `promo/steam/assets/` 進行實際檔案盤點，建立 `promo/steam/STEAM_ASSET_FINAL_AUDIT.md`，分七區整理可上傳素材、待目視確認素材、暫不製作素材、缺口素材、截圖排序建議、全年齡風險與 AI 素材揭露提醒。
- 發現的問題：**Store Capsule 四張檔案（920×430、462×174、1232×706、748×896）實際不在 `promo/steam/assets/` 目錄中**，ASSET_CHECKLIST.md 標記為「已產出」但盤點時缺失，為嚴重缺口，已寫入「待處理問題」。
- 預計但尚未執行的修改：不需修改任何程式碼，Store Capsule 需執行 `npm.cmd run steam:capsules` 重產，但此動作超出本次任務範圍（不重產圖片），留待製作人確認後執行。
- 已完成問題：無。
- 改了哪些檔案：`promo/steam/STEAM_ASSET_FINAL_AUDIT.md`（新增）、`SYNC.md`、`CHANGELOG.md`
- 驗證結果：以 `ls -la promo/steam/assets/` 盤點實際存在檔案 11 個，與 ASSET_CHECKLIST.md 對照後確認 Store Capsule 四張缺失、Library Hero 正確不存在。
- 下一步：製作人執行 `npm.cmd run steam:capsules` 重產 Store Capsule，並目視確認所有素材品質（見 STEAM_ASSET_FINAL_AUDIT.md 第二區）。
- 注意事項：截圖第 4 張（牌型倍率表彈窗）建議製作人評估是否替換為更具張力的 Boss 枷鎖截圖。

### 2026-05-20 鑀韻東

- 狀態：已完成
- 本次做了什麼：擴充 `steam:verify`，加入三段直式解析度切換驗證與 Electron 重開後 localStorage 持久化驗證；另建立給阿扣的素材盤點並行任務檔。
- 發現的問題：Playwright Electron 的 `app.evaluate()` 環境不能直接使用 `require('electron')`，因此驗證腳本改用 Playwright 的 BrowserWindow handle 操作視窗尺寸與 IPC。
- 預計但尚未執行的修改：尚未確認 6 張 Steam 截圖排序與全年齡顯示；可交由阿扣依 `promo/steam/CLAUDE_ASSET_AUDIT_TASK.md` 做文件盤點。
- 已完成問題：三段解析度切換與重開後存檔讀取已通過自動驗證。
- 改了哪些檔案：`scripts/verify-steam-electron.js`、`promo/steam/CLAUDE_ASSET_AUDIT_TASK.md`、`promo/steam/STEAM_RELEASE_CHECKLIST.md`、`SYNC.md`、`CHANGELOG.md`
- 驗證結果：`node --check scripts/verify-steam-electron.js` 通過；`npm.cmd run steam:verify` 通過，確認 small `450x800`、medium `540x960`、large `675x1200`、`steam-portrait-large`、離線本機 protocol 與 localStorage 重開保留。
- 下一步：請阿扣依 `promo/steam/CLAUDE_ASSET_AUDIT_TASK.md` 產出素材最終盤點；我方下一步可依盤點結果修正缺口或準備 SteamPipe build 上傳草案。
- 注意事項：`.claude/settings.local.json` 是本機設定變更，不應納入提交。

### 2026-05-20 阿扣（第三次）

- 狀態：已完成
- 本次做了什麼：依 `CLAUDE_STEAMWORKS_FIELDS_TASK.md` 建立 `promo/steam/STEAMWORKS_FIELDS_DRAFT.md`，整理 Steamworks 後台十個欄位區塊的填寫草稿，供製作人登入後台時對照使用。
- 發現的問題：AI 生成素材揭露無法由 AI 代判，原始美術來源（`img/home_bg.webp`、`img/itch_banner.png`）是否含 AI 生成需製作人確認。
- 預計但尚未執行的修改：無。
- 已完成問題：無。
- 改了哪些檔案：`promo/steam/STEAMWORKS_FIELDS_DRAFT.md`（新增）、`SYNC.md`、`CHANGELOG.md`
- 驗證結果：草稿內容與 `STEAM_STORE_BRIEF.md`、`FULL_VERSION_SCOPE.md`、`ASSET_CHECKLIST.md`、`STEAM_DESKTOP_PORTRAIT_STRATEGY.md` 交叉核對，無衝突或超出承諾範圍之文案。
- 下一步：製作人確認第十區各欄位（開發商名稱、售價、AI 素材揭露、Coming Soon 時機），即可準備登入 Steamworks 後台操作。
- 注意事項：年齡分級問卷須製作人依實際遊戲畫面與功能作答，草稿僅為建議參考方向。

### 2026-05-20 鑀韻東

- 狀態：已完成
- 本次做了什麼：建立給阿扣的並行任務檔，要求他只整理 Steamworks 後台欄位草稿；我方則新增 Electron 自動驗證腳本，並修正 Electron 執行期 app 名稱與 userData 路徑。
- 發現的問題：僅補 `package.json` 的 `name` / `productName` 不足以讓 Playwright Electron dev 啟動時套用正確 appName，實測仍會落到 `Electron`。
- 預計但尚未執行的修改：尚未驗證三段解析度選單切換、重開後存檔讀取、6 張截圖排序與全年齡顯示。
- 已完成問題：Electron 執行期 appName / userData 路徑已修正並通過 `steam:verify`。
- 改了哪些檔案：`package.json`、`steam-app/main.js`、`scripts/verify-steam-electron.js`、`promo/steam/CLAUDE_STEAMWORKS_FIELDS_TASK.md`、`promo/steam/STEAM_RELEASE_CHECKLIST.md`、`SYNC.md`、`CHANGELOG.md`
- 驗證結果：`node --check scripts/verify-steam-electron.js` 通過；`node --check steam-app/main.js` 通過；`npm.cmd run steam:verify` 通過，確認 `dist/steam-demo`、`bibi://app/index.html`、`540x960`、`steam-portrait`、appName 與 userData 路徑皆正確。
- 下一步：請阿扣依 `promo/steam/CLAUDE_STEAMWORKS_FIELDS_TASK.md` 產出 `promo/steam/STEAMWORKS_FIELDS_DRAFT.md`；我方下一步可做解析度切換與存檔重開驗證。
- 注意事項：`.claude/settings.local.json` 是本機設定變更，不應納入提交。

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
### 2026-05-23 鑀韻東：統一標題畫面底圖
- 做了什麼：依照製作人要求，將目前所有版本的標題畫面底圖統一改用 `promo/steam/assets/library_capsule_600x900.png` 的主視覺。
- 實作方式：新增遊戲內資產 `img/title_bg.png`，避免發佈腳本排除 `promo/` 後造成 itch.io / Steam Demo 找不到圖片。
- 改了哪些檔案：`img/title_bg.png`、`css/style.css`、`index.html`、`scripts/capture-steam-portrait-screenshots.js`、`CHANGELOG.md`、`SYNC.md`。
- 驗證：已執行 `node --check scripts/capture-steam-portrait-screenshots.js`；`npm.cmd run steam:build` 通過，確認 `dist/steam-demo/img/title_bg.png` 已被打包進 Steam Demo；已輸出 `promo/steam/screenshots/current_title_bg_540x960.png` 檢查標題畫面實際載入 `title_bg.png`。
- 下一步：請製作人重新打開 itch/dev/Steam Demo 首頁，確認主視覺裁切位置符合預期。
