# SYNC_ARCHIVE.md - AI 協作交接歷史封存

封存日期：2026-06-30
封存範圍：2026-06-08 至 2026-06-18 的工作紀錄
用途：追溯歷史，不作為目前狀態來源；現狀請讀 SYNC.md

---
### 2026-06-18 鑀韻西：Steam Cloud 第一版與成就事件打樁

- 任務：依製作人授權，與阿扣開始製作 Steam 成就與 Steam Cloud；本輪先做 Cloud 可落地的檔案化同步，以及成就事件觸發/待重試佇列，不硬猜 Steamworks native addon。
- 阿扣協作：阿扣唯讀檢查 `AGENTS.md`、`SYNC.md`、`promo/steam/STEAM_ACHIEVEMENTS_CLOUD_TECH_SPEC.md`、`steam-app/main.js`、`steam-app/preload.js`、`js/main.js`、`js/ui.js`、`scripts/verify-steam-windows-build.js`；結論是 Cloud 可先獨立推進，成就正式解鎖需先決定 Steamworks native 套件。
- 完成：`steam-app/main.js` 新增 `steam-cloud-load-profile` / `steam-cloud-save-profile` IPC，使用 `%APPDATA%/BIBI DICE 比比丟八/steam-cloud/profile-v1.json` 與 `profile-v1.backup.json`，寫入採 temp 檔後替換，並限制 JSON 讀寫大小。
- 完成：`steam-app/preload.js` 暴露 `window.steamCloud` 與 `window.steamAchievements`；成就 IPC 目前只驗證 API Name 並回傳 `steamworks_bridge_not_configured`，不假裝 Steamworks 已接好。
- 完成：`js/main.js` 啟動時會從 Cloud JSON 匯入較新的白名單 localStorage key，存檔、meta、收集冊、歷史紀錄、設定、語言、教學完成狀態與成就佇列會 debounce 匯出到 Cloud JSON。
- 完成：`js/main.js` / `js/ui.js` 接上 15 個第一版成就事件的觸發點；未接 Steamworks 前會存入 `bibbidiba_steam_achievements_v1.pending`，成功回傳後才移到 `unlocked`。
- 完成：`scripts/verify-steam-windows-build.js` 新增 packaged main/preload bridge 字串驗證。
- 驗證：`node --check js/main.js/js/ui.js/steam-app/main.js/steam-app/preload.js/scripts/verify-steam-windows-build.js`、`npm.cmd run steam:i18n:verify`、`npm.cmd run steam:package:verify` 皆通過；正式包 smoke 後已實際建立 `%APPDATA%/BIBI DICE 比比丟八/steam-cloud/profile-v1.json`。
- 注意：`git diff --check` 目前被既有 `promo/steam/STEAM_ASSET_FINAL_AUDIT.md` 第 3、4 行尾端空白擋住，非本輪改動；本輪未處理該無關文件。
- 待辦：決定 Steamworks native addon（例如 steamworks.js / greenworks 類方案）後，將 `steam-achievement-unlock` 從 pending stub 改成 `SetAchievement` + `StoreStats`；Steamworks 後台仍需建立成就 API Name 與 Auto-Cloud Root Path。

### 2026-06-18 鑀韻西：Steam 成就與 Cloud 技術設計草案

- 任務：依製作人確認，從 Steam 成就與 Steam Cloud 的技術設計文件開始，先做規劃不改遊戲程式碼。
- 製作人決策：Steam Cloud 同步全部資料，包含靈魂奉獻、收集冊、設定、歷史紀錄、最高紀錄與戰鬥中繼續遊戲存檔；Demo 存檔不補發正式版成就；第一版成就數量約 12～18 個；Cloud 採最安全可行方案；成就名稱要非常有味道。
- 新增文件：`promo/steam/STEAM_ACHIEVEMENTS_CLOUD_TECH_SPEC.md`。
- 技術方向：Cloud 第一版採 Steam Auto-Cloud + 本機 JSON 存檔檔案化；成就採 Electron main process Steamworks bridge + renderer no-op fallback。製作人指出「首次擊敗 Boss」與「首次通關 10 關」會同時觸發，已刪除 `ACH_CLEAR_MAIN_RUN`，第一版候選成就改為 15 個。
- 待辦：實作前需確認 Steamworks 後台成就 API Name、四語系成就文案、Auto-Cloud 實際 Root Path，以及是否在設定頁顯示 Steam Cloud / Steam 連線狀態。

### 2026-06-18 鑀韻西：1/2/3 睡眠批次完成狀態

- 任務：依製作人授權，與阿扣一起完整處理 1. 新手教學 polish、2. Steam 商店截圖重拍、3. Base Game SteamPipe build 上傳與 SetLive 檢查；能做的做完，不能做的記錄阻塞。
- 阿扣協作：阿扣分三線唯讀檢查 `js/main.js` / `js/ui.js` / `index.html` / `js/locales/*`、Steam 截圖腳本、Base Game VDF 與 SteamPipe 文件；建議自訂確認 modal、同點數鎖骰門檻、重骰 tooltip 延後、截圖先備份、Base Game VDF 描述升到 `1.0.0`。
- 完成：新手教學開始改成遊戲內確認 modal，取消、右上 X、開始教學皆可點；modal 使用 inline `z-index:210`，修正標題畫面攔截點擊問題。
- 完成：教學鎖骰步驟必須鎖定兩顆同點數骰才前進；鎖到不同點數會停在原步驟並顯示提示。
- 完成：重骰後教學 tooltip / pointer 會暫時隱藏，遮罩改為擋住誤點，約 520ms 後顯示下一步，避免骰子還在動畫時說明先跳出。
- 完成：四語系新增 `tutorial.confirm_*` 與 `tutorial.lock_pair_hint`，`npm.cmd run steam:i18n:verify` 顯示四語系 616 keys 完全對齊。
- 完成：Steam 商店 6 張截圖已於 2026-06-18 重拍；舊版備份於 `promo/steam/assets/backup_pre_recapture_2026-06-18/`。`npm.cmd run steam:assets:verify` 通過，抽看標題、牌型爆發、商店三張輸出正常。
- 完成：製作人已於 2026-06-18 在 Steamworks 後台圖像資產頁更新新版 6 張商店截圖，頁面顯示 `Changes saved`。
- 完成：`steam-build/app_build_4792230.vdf` 正式版 build 描述更新為 `BIBI DICE Base v1.0.0 - 2026-06-18`，`SetLive` 維持空白。
- 完成：`npm.cmd run steam:package:verify` 通過，正式版 `dist/steam-windows/BIBI-DICE.exe` 啟動 smoke 成功；`npm.cmd run steam:verify` 也通過 Demo Electron 驗證。
- 完成：製作人使用有權限帳號成功上傳 Base Game AppID `4792230` / Depot `4792231`，建立 BuildID `23800344`；Steamworks Builds 頁已顯示新組建。
- 後台完成：新版商店截圖已替換完成；Base Game default 分支已於 Steamworks 設定上線到 BuildID `23800344`，後台歷史紀錄顯示 branch `"default"` 設定完成。

### 2026-06-17 鑀韻西：教學存檔、資訊視窗與牌型區修正

- 任務：依製作人同意，修正點擊枷鎖/遺物說明停留時間與關閉按鈕、A/B/C/D 牌型區誤點問題，並一併修正新手教學後誤顯示「繼續旅程」的存檔錯誤。
- 阿扣協作：阿扣分成兩線唯讀稽核；一線檢查 `tutorialMode`、`saveGame()`、`skipTutorial()`、`endTutorial()` 與 `SAVE_KEY`，確認主風險是未來移除 `saveGame()` guard；另一線檢查 `showToast()`、`showShackleInfo()`、`showRelicInfo()` 與 `renderScore()`，指出教學 Step 1 枷鎖說明會被 `z-index:195/197` 的教學遮罩蓋住。
- 完成：`js/ui.js` 的 `showToast()` 支援 `duration`、`closable`、`zIndex`；點擊枷鎖/遺物說明改為約 10 秒、可按 X 關閉，閱讀型 toast 使用 `z-index:220`，教學遮罩中也能閱讀與關閉。
- 追加修正：製作人回報關閉 X 實際顯示在左上角；已將 close button 加上 inline `position:absolute; top:6px; right:10px; left:auto;`，避免封裝後 Tailwind 定位 class 失效或被覆蓋。
- 完成：`js/ui.js` / `js/main.js` 雙層防守 A/B/C/D 牌型區；無牌型、`???`、健忘枷鎖或沒有 matched dice 時不掛點擊行為，合法牌型點擊後 5 秒自動清除高亮。
- 完成：`js/main.js` 在 `tutorialMode` 期間不寫主存檔；完成教學與跳過教學都會 `clearSave()`，避免 `bibbidiba_save_v60` 讓標題畫面誤判可繼續遊戲。
- 完成：四語系新增 `ui.toast_close`；legacy 枷鎖標籤改用既有 `ui.dev_shackle_current`。
- 驗證：`node --check js/ui.js/js/main.js/js/locales/*.js`、`npm.cmd run steam:i18n:verify`、`npm.cmd run steam:build:full`、`npm.cmd run steam:package:verify` 通過。
- Electron smoke：教學進入/跳過/完成都不產生主存檔，教學完成後 `bibbidiba_tutorial_done=true` 且「繼續旅程」隱藏；正式新局仍會產生主存檔並在 reload 後顯示「繼續旅程」；枷鎖與遺物說明可關閉且 2.6 秒後仍存在；A/B/C/D 禁用區不可高亮、可用區高亮後 5 秒自動恢復。

### 2026-06-17 鑀韻西：拆分新手教學 Step 0 說明

- 任務：依製作人要求，將新手教學第一段中的「敵人 HP、剩餘回合數、八顆骰子」拆開說明。
- 阿扣協作：阿扣執行唯讀分析約 203 秒，確認若新增多個教學步驟會牽動 `tutorialStep < 4` 攻擊解鎖門檻；建議採用低風險方案，在同一個 Step 0 內以換行分段。
- 完成：四語系 `tutorial.step0` 改為三段說明：
  - 敵人 HP：上方紅色血條，歸零即勝利。
  - 剩餘回合數：右側數字，歸零時敵人會反攻扣血。
  - 八顆骰子：下方 8 顆骰子是武器，湊出牌型造成傷害。
- 完成：`css/style.css` 新增 `#tutorial-tooltip-text { white-space: pre-line; }`，讓 `\n` 分段在教學 tooltip 中正確呈現。
- 不碰範圍：未新增 `TUTORIAL_STEPS` 步驟，未修改教學狀態機、攻擊解鎖門檻或 `engine.js`。

### 2026-06-16 鑀韻西：新手教學可視化強化

- 任務：依製作人補充，讓新手教學加入動態箭頭/指標，並說明敵人血量、玩家血量與預估傷害等 UI。
- 阿扣協作：本輪阿扣承擔完整唯讀設計盤點，約 204 秒，分析 tutorial overlay、highlightMap、HP / enemy UI DOM、CSS tutorial 樣式與 i18n 文案；建議採低風險方案，不新增教學步驟，只擴充 Step 0 / Step 3 與新增指標。
- 完成：`index.html` 新增 `#tutorial-pointer`。
- 完成：`css/style.css` 新增 CSS 三角形指標與彈跳動畫，不使用 emoji。
- 完成：`js/ui.js` 會在有 highlight target 的教學步驟定位並顯示指標；無目標步驟自動隱藏。新增 `damage-preview` 對應到 `#final-damage-preview`。
- 完成：`js/main.js` Step 3 highlight 從 `score-preview` 改成 `damage-preview`，讓教學聚焦玩家 HP / 預估傷害區。
- 完成：四語系 `tutorial.step0` 補充敵人 HP 與剩餘回合數；`tutorial.step3` 補充玩家 HP、預估傷害與倍率疊加。
- 驗證：`node --check js/ui.js/js/main.js/js/locales/*.js`、`npm.cmd run steam:i18n:verify` 通過；Electron 教學 smoke 完整跑過 Step 0~6，確認 Step 1~5 指標顯示、Step 3 目標為 `#final-damage-preview`、教學結束後 `bibbidiba_tutorial_done=true`，無 console/page error。
- 後續可再優化：自訂開始教學 modal 取代 `window.confirm()`；Step 1 改成必須鎖定兩顆同數骰才前進；縮短重骰/商店提示等待節奏；教學結尾補枷鎖預告。

### 2026-06-16 鑀韻西：正式版 1.0.0 身份修正與新手教學實跑

- 任務：依製作人指定先做正式版身份修正與新手教學流程檢查；Steam 截圖重拍與 Base Game SteamPipe / SetLive 先列入待辦。
- 完成：`package.json` 與 `package-lock.json` 版本號同步改為 `1.0.0`。
- 完成：`index.html` fallback、`js/i18n.js` 覆蓋表與四語系 `ui.version` 皆改為 `1.0.0`，移除標題畫面的「免費測試版 / Free Demo / 無料テスト版」顯示。
- 新手教學實跑：Electron 自動流程已從標題畫面點「新手教學」、接受確認、鎖骰、重骰、攻擊、選商店、完成教學；結束後 `bibbidiba_tutorial_done=true`，無 console/page error。
- 新手教學觀察：
  - 目前可完整通關，但開頭仍使用原生 `window.confirm()`，視覺上和遊戲 UI 不一致。
  - Step 1 文字要求鎖兩顆一樣的骰子，但程式只檢查鎖定數量 >= 2；玩家鎖錯也會前進。
  - 重骰後 `tutorialStep` 會先進入 Step 3，tooltip 要等重骰動畫收尾才切到牌型說明，短時間內會看到上一句重骰提示。
  - 攻擊後商店 tooltip 需等待商店開啟，節奏上可再縮短或補過場提示。
  - 教學完成後直接 `location.reload()` 回標題，體感略硬，可考慮淡出或 loading。
  - 教學未預告第 3 關會遇到枷鎖，第一次正式跑可能仍會困惑。
- 待辦：Steam 商店截圖重拍。現有截圖早於 2026-06-16 金框/共鳴與近期 HP/受擊視覺更新，需確認是否重拍並上傳 Steamworks。
- 待辦更新：Base Game (AppID `4792230`) SteamPipe build 已於 2026-06-18 上傳成功，BuildID `23800344`；Steamworks default 分支已指向新版正式 Build。
- 阿扣協作：本輪阿扣承擔較完整唯讀分析，約 195 秒，閱讀版本欄位、新手教學流程與待辦寫法，回報須同步 `index.html` fallback、`package-lock.json` 版本與教學節奏卡點。
- 下一步建議：優先做新手教學 polish 的最小修正（自訂確認 modal、Step 1 鎖同數判斷、重骰後 tooltip 節奏），再進行 Steam 截圖重拍。

### 2026-06-16 鑀韻西：正式版遊戲打磨第一輪完成

- 任務：接續 Steamworks 後台基本完成後，開始正式版宣傳與遊戲 polish 階段的低風險打磨。
- 完成：玩法說明「基本玩法」補上快捷鍵提示；四語系同步記錄 `Q W E R / A S D F` 或 `1~8` 鎖骰、`Ctrl` 重骰、`Space` 攻擊。
- 完成：A/B/C/D 牌型區新增高稀有牌型金色光框，以及四區皆有牌型時的共鳴外框；僅改 UI/CSS，不改 `engine.js` 戰鬥計算。
- 防洩漏確認：`amnesia` / `???` 資訊隱藏狀態不顯示金框與共鳴框，Electron smoke 顯示四區皆為 `??? x???`。
- 涉及檔案：`js/ui.js`、`css/style.css`、`js/locales/zh-tw.js`、`js/locales/zh-cn.js`、`js/locales/en.js`、`js/locales/ja.js`、`CHANGELOG.md`、`SYNC.md`。
- 驗證：`node --check js/ui.js`、`node --check js/main.js`、四語系 `node --check`、`npm.cmd run steam:i18n:verify`、`npm.cmd run steam:package:verify`、Electron smoke（快捷鍵教學、金框、四區共鳴、amnesia 隱藏）皆通過。
- 阿扣協作：`claude.exe auth status` 顯示登入正常，超短健康檢查可回覆並確認可讀 `AGENTS.md` / `SYNC.md` / `CHANGELOG.md`；較完整 diff 複核任務兩次逾時（184 秒、94 秒），本輪沒有取得可用審查報告。後續請優先把阿扣任務拆成更短的單點唯讀檢查。
- 下一步：正式版 polish 可繼續做「教學/新手首局順暢度」、「Steam 商店截圖是否需要重拍金框/共鳴效果」、「正式版發行前 2026-07-01 最終檢查」。

### 2026-06-16 製作人回報：Steamworks 後台基本設定完成

- 任務：同步 Steamworks 後台最新狀態，避免後續 AI 仍誤判 2026-06-03 / 2026-06-10 節點未確認。
- 依據：製作人提供 Steamworks 後台截圖與口頭回報。
- 後台狀態：`BIBI DICE Demo (4796530)` 已發行。
- Base Game 狀態：`BIBI DICE (4792230)` 商店頁面為「準備」，組建狀態為「準備」，發行頁狀態為「發行前」。
- 發行設定：Base Game 指定日期為 `2026-07-01 00:00 [GMT+8]`，顧客所見日期為 `2026年6月`。
- 本輪只更新文件狀態；未修改 `js/`、`css/`、`steam-app/`、素材或建置腳本。

### 2026-06-08 鑀韻西：任意專案 AI 協作流程模板導入

- 任務：把「低干預 AI 製作流程」落地成專案內可複製的文件與模板。
- 新增：`docs/ai-collaboration/README.md`。
- 新增：`docs/ai-collaboration/templates/PROJECT_CORE.md`、`TASK_BRIEF.md`、`ACCEPTANCE_CHECKLIST.md`、`DEV_LOG.md`。
- 不碰範圍：未修改 `js/engine.js`、`js/data.js`、`js/ui.js`、`css/style.css`、`index.html`、素材與建置腳本。
- 驗收方式：本次屬純文件任務，不需要 build；以 `git status` 與文件內容檢查確認只新增預期協作模板並更新紀錄。


---

---

### 2026-06-07 阿扣 / 鑀韻西（敵人倒數歸零攻擊前搖）
- 狀態：完成，待製作人實機確認手感。
- 任務：讓敵人倒數歸零造成玩家扣血時，先有敵人攻擊前搖，再在命中瞬間扣血與觸發玩家受擊特效。
- 阿扣執行：透過本機 `claude.exe -p` 限定修改 `js/ui.js`、`css/style.css`、`js/main.js`，新增 `UI.showEnemyAttackCue(onImpact)`，並把 timeout 無娃娃擋刀的扣血流程包進命中 callback。
- 修改：`js/ui.js` 新增 `showEnemyAttackCue(onImpact)`；`css/style.css` 新增 `.enemy-attack-cue`、`.enemy-attack-slash` 與對應 keyframes；`js/main.js` 只改敵人倒數歸零且無 `cons_doll` 的分支，`cons_doll` 擋刀路徑保持原本立即觸發。
- 驗證：`node --check js/ui.js`、`node --check js/main.js`、`npm.cmd run steam:i18n:verify`、`npm.cmd run steam:package:verify` 通過；已確認 `dist/steam-windows/resources/app/dist/steam-full/` 內含 `showEnemyAttackCue`、`.enemy-attack-cue`、`.enemy-attack-slash`。
- 下一步：請製作人實機讓敵人倒數歸零，確認敵人卡片前搖、紅色斜砍光痕與玩家受擊銜接是否舒服；若太弱可調高敵人卡片位移與光痕亮度，若太搶可降低 `.enemy-attack-slash` 寬度與透明度。

### 2026-06-06 阿扣（瀕死持續性畫面邊緣暗紅暈）
- 狀態：完成，待製作人實機確認視覺強度。
- 任務：HP=1 時在畫面邊緣顯示持續性暗紅暈（低血量警告），HP 回到 2+ 或 <=0 時自動移除。
- 修改：`js/ui.js` 新增 `syncLowHealthVignette(isDanger)` helper，並在 `updateHeaderUI()` 的 `.heart-hp--state-danger` toggle 之後同步呼叫；`css/style.css` 新增 `@keyframes lowHealthVignette` 與 `.low-health-vignette`（z-index 9980，呼吸式 opacity 0.30–0.62，pointer-events none）。
- 驗證：`node --check js/ui.js`、`node --check js/main.js`、`npm.cmd run steam:i18n:verify`、`npm.cmd run steam:package:verify` 通過；已確認 `dist/steam-windows/resources/app/dist/steam-full/` 內含 `syncLowHealthVignette` 與 `.low-health-vignette`。
- 注意：overlay 以 id `low-health-vignette` 唯一插入 body，用 `.hidden` 切換顯示而不重複建立；z-index 低於 `danger-vignette`（9990），不遮點擊（pointer-events none）。

### 2026-06-06 鑀韻西 / 阿扣（瀕死低血量提示補強）
- 狀態：完成，待製作人實機確認是否足夠醒目。
- 問題：製作人回報瀕死時看不出效果；阿扣檢查後確認原本 fatal 只是一秒鐘瞬間特效，`HP = 1` 後沒有持續性危險狀態。
- 修改：`js/ui.js` 的 `updateHeaderUI()` 會在 `hp > 0 && hp <= 1` 時替愛心容器套用 `.heart-hp--state-danger`，HP 回到 2 以上時自動移除；`css/style.css` 新增 `heartDangerIdle`，讓剩 1 HP 的滿心持續心跳發紅光，HP 標籤同步變亮。
- 改了哪些檔案：`js/ui.js`、`css/style.css`、`SYNC.md`、`CHANGELOG.md`。
- 驗證：`node --check js/ui.js`、`node --check js/main.js`、`npm.cmd run steam:i18n:verify`、`npm.cmd run steam:package:verify` 通過；已確認 `dist/steam-windows/resources/app/dist/steam-full/` 內含 `heart-hp--state-danger` 與 `heartDangerIdle`。
- 下一步：請製作人實機進入 1 HP 狀態，確認愛心持續心跳紅光是否足夠；若還不夠，可再加持續性的畫面邊緣暗紅暈。

### 2026-06-06 阿扣 / 鑀韻西（玩家受到攻擊扣血特效 第一階段）
- 狀態：完成，待製作人實機確認手感。
- 任務：在玩家受到 thornarmor / mutualdestruction / wrath / timeout 扣血時顯示動態特效。
- 修改：
  - `js/ui.js`：新增並 export `showPlayerHit(amount, severity)` — 對 `el.playerHeartHp` 套用 `.shake-player-hp`（force reflow 保證連觸重啟）、在愛心旁浮出 `.player-damage-text`（`-N` 紅字）、向 body append vignette overlay（light / heavy / fatal 三級）；fatal 額外套用 `.heart-hp--danger` 愛心 pulse；鑀韻西補上 `el.battleArea` 的 `.player-hit-screen-shake` 與 `.player-hit-slash` 斜砍光痕。
  - `css/style.css`：新增 `@keyframes playerHitScreenShake`、`.player-hit-screen-shake`、`@keyframes shakePlayerHp`、`.shake-player-hp`、`@keyframes playerDamageFloat`、`.player-damage-text`、`@keyframes playerHitSlash`、`.player-hit-slash`、`@keyframes playerHitVignette`、`.player-hit-vignette`、`.player-heavy-hit-vignette`、`@keyframes dangerVignette`、`.danger-vignette`、`@keyframes heartDangerPulse`、`.heart-hp--danger`。
  - `js/main.js`：thornarmor 扣血後加 `UI.showPlayerHit(1, hp<=1?'fatal':'light')`；mutualdestruction 後加 `UI.showPlayerHit(recoil, hp<=1?'fatal':(recoil>=2?'heavy':'light'))`；wrath 後加 `UI.showPlayerHit(1, hp<=1?'fatal':'heavy')`；timeout 扣血後插入 `UI.updateHeaderUI` + `UI.showPlayerHit(1, hp<=1?'fatal':'light')`。
- 驗證：`node --check js/ui.js`、`node --check js/main.js`、`npm.cmd run steam:i18n:verify`、`npm.cmd run steam:package:verify` 通過；已重建 `dist/steam-windows/BIBI-DICE.exe`，並確認 `dist/steam-windows/resources/app/dist/steam-full/` 內含 `showPlayerHit` 與受擊 CSS。
- 注意：未動 engine.js / data.js / index.html / locale。下一步請製作人實機測試四種扣血情境；若覺得紅光或斜砍太強，再調整 CSS 強度。

### 2026-06-06 鑀韻西 / 阿扣（Steam 文件 Trailer 檔名統一）
- 狀態：完成。
- 阿扣執行：透過本機 `claude.exe -p` 讀取 `AGENTS.md`、`AI_COLLABORATORS.md`、`SYNC.md`、`CHANGELOG.md`、`promo/steam/README.md`、`STEAMWORKS_UPLOAD_PACKET.md`、`STEAM_RELEASE_CHECKLIST.md`、`STEAM_DEPOT_UPLOAD_NOW.md`、`ASSET_CHECKLIST.md`、`package.json`，並列出 `promo/steam/trailer/` 目錄與關鍵字矛盾。
- 確認結果：Steam Trailer 上傳文件內的 `bibi_dice_demo_trailer_review.mp4` 與 `bibi_dice_demo_trailer_gameplay_v6.mp4` 不是目前磁碟實際存在的最終檔名；實際可上傳檔為 `promo/steam/trailer/bibi_dice_demo_trailer_final_2026-06-05.mp4`。
- 驗證結果：`ffprobe` 確認最終 Trailer 為 1920x1080、60fps、約 42.15 秒、H.264 + AAC；`npm.cmd run steam:i18n:verify` 通過，四語系 607 keys 完全對齊；`npm.cmd run steam:assets:verify` 通過，16 個必要素材、0 個禁止素材。
- 改了哪些檔案：`promo/steam/README.md`、`promo/steam/STEAMWORKS_UPLOAD_PACKET.md`、`promo/steam/STEAM_RELEASE_CHECKLIST.md`、`promo/steam/ASSET_CHECKLIST.md`、`promo/steam/STEAM_DEPOT_UPLOAD_NOW.md`、`SYNC.md`、`CHANGELOG.md`。
- 下一步：製作人登入 Steamworks Demo App `4796530`，上傳 `promo/steam/trailer/bibi_dice_demo_trailer_final_2026-06-05.mp4`；`STEAM_DEPOT_UPLOAD_NOW.md` 仍列在可刪候選，等製作人確認後再刪。

### 2026-06-06 製作人確認（遊戲 UI 實機 + Trailer v6 審片）
- 狀態：完成。
- 確認項目一：實機玩一局，NEW 標籤（牌型/遺物/枷鎖/收集冊）、HP 愛心（滿心+空心）、收集冊總完成度視覺，全部通過。
- 確認項目二：Steam Trailer v6 審片通過；實際磁碟最終可上傳檔為 `promo/steam/trailer/bibi_dice_demo_trailer_final_2026-06-05.mp4`。
- 下一步：上傳 `promo/steam/trailer/bibi_dice_demo_trailer_final_2026-06-05.mp4` 至 Steamworks Demo App `4796530` 的「宣傳片 / Trailers」欄位。

### 2026-06-06 阿扣（HP 愛心前加上 "HP:" 標籤）
- 狀態：完成。
- 任務：在 HP 愛心前加上 "HP:" 文字標籤，提升辨識度。
- 修改：`js/ui.js` `updatePlayerHpUI()` 在愛心 HTML 前 prepend `<span class="heart-hp__label">${i18n.t('ui.hp')}:</span>`；`css/style.css` 新增 `.heart-hp__label` 樣式（淺紅 #fca5a5、font-weight 900、text-shadow、margin-right 4px）。
- i18n：走既有 `ui.hp` key（四語系皆為 'HP'），未新增 locale key。
- 驗證：`node --check js/ui.js`、`npm.cmd run steam:package:verify` 通過。
- 補打包：本次直接跑 `steam:package:verify`，已產出 `dist/steam-windows/BIBI-DICE.exe`（PID 25988 煙霧測試通過）。

### 2026-06-06 阿扣（商店 NEW 徽章外移、HP 空愛心）
- 狀態：完成。
- 任務：(1) 商店遺物卡片的 NEW 徽章從稀有度上方移到「整個遺物框外面」斜貼，避免擠壓稀有度；(2) HP 顯示加入空愛心 `Heart_null.png`，讓玩家能看出最大血量。
- 製作人確認：「文字」= NEW 徽章；位置 = 卡片右上角斜貼往外突出。
- 修改：
  - `js/ui.js` `renderShopItems()`：原本 `collectionNewBadge` 在 `<div class="flex flex-col items-end gap-1 shrink-0">` 的稀有度標籤之上；改為移除這個位置，外包一層 `<div class="relative">`，徽章與卡片同層 absolute 定位。
  - `js/ui.js` `updatePlayerHpUI()`：原本 `Array.from({length: hp})` 只渲染滿心；改為 `length: max(hp, maxHp)`，前 `hp` 個用 `Heart_full.png`、後 `maxHp - hp` 個用 `Heart_null.png`。
  - `css/style.css` `.new-badge--shop`：由 `position: static; align-self: flex-end` 改為 `position: absolute; top: -10px; right: -10px; rotate(8deg) scale(0.95)` + 陰影。
  - `css/style.css` 新增 `.heart-hp__icon--empty`：opacity 0.55 + 輕度灰階，與滿心做視覺區隔。
- 驗證：`node --check js/ui.js`、`npm.cmd run steam:i18n:verify`（四語系 607 keys 完全對齊）、`npm.cmd run steam:build` 通過，已重建 `dist/steam-demo`。
- **補打包**：製作人實機跑 `dist/steam-windows/BIBI-DICE.exe` 沒看到變化，是因為我只跑 `steam:build`（產純 web 內容 `dist/steam-demo`），沒有重新打包 Windows exe。後續執行 `npm.cmd run steam:package:verify` 重打包，已驗證 `dist/steam-windows/resources/app/dist/steam-full/js/ui.js` 含 `Heart_null` 與 `heart-hp__icon--empty`、`dist/steam-windows/resources/app/dist/steam-full/css/style.css` 含新版 `.new-badge--shop` 與 `.heart-hp__icon--empty`；煙霧測試通過（PID 23812 啟動並維持運作）。
- 注意：(1) 素材 `img/Heart_null.png` 已存在，無需另產；(2) `wither` 枷鎖把 maxHp 設為 1 的情境會正確只顯示 1 顆愛心；(3) 商店卡片父層仍有 `overflow-hidden`，但因徽章是放在外層 `<div class="relative">` 與卡片同級，不會被切掉；(4) 未動 Steam 素材、未動截圖。
- 下一步：請製作人實機檢查商店畫面 NEW 徽章位置與 HP 空愛心呈現是否符合預期。

### 2026-06-06 韻西：NEW 標籤遮擋修正與愛心血量
- 狀態：完成。
- 修改：`NEW` 標籤改為金色系 `.new-badge` 固定 CSS class；四區加成格改用右上外側提示，商店 NEW 移到右側稀有度欄上方，避免遮住牌型或遺物名稱。
- 血量：隱藏原本右上角文字 HP，在「預估造成傷害」左上角新增 `#player-heart-hp`，依目前 HP 顯示對應數量的愛心。
- 素材：保留製作人提供的 `img/Heart.png`，另外產生透明背景滿心 `img/Heart_full.png` 供 UI 使用。
- 驗證：`node --check js/main.js`、`node --check js/ui.js`、`npm.cmd run steam:i18n:verify`、`npm.cmd run steam:package:verify` 通過；Electron 正式版 DOM 量測確認 NEW 不重疊名稱，目視截圖確認商店 NEW、四區 NEW 與愛心 HP 顯示正常。
- 下一步建議：請阿雷實際玩一局確認愛心大小與位置是否符合手感；若血量超過 5 顆時覺得太擠，再調整為更小尺寸或分兩排。

### 2026-06-06 韻西：未收集項目的即時 NEW 提示
- 狀態：完成。
- 修改：`js/main.js` 新增 `window.isCollectionUnlocked()`、`window.getRuleCollectionId()` 與 `window.isCurrentShackleNew()`；當局枷鎖新增 `stage.shackleWasNew`，並寫入存檔。
- UI：`js/ui.js` 在四區加成格、商店遺物卡、當局枷鎖按鈕、枷鎖說明 toast 顯示 `NEW`，讓玩家更直覺知道尚未解鎖的牌型、遺物與枷鎖。
- 防誤判：牌型 `NEW` 會先轉成 RULE_DB 穩定 id；「無」與未知文字不會顯示 NEW。
- 驗證：`node --check js/main.js`、`node --check js/ui.js`、`npm.cmd run steam:i18n:verify`、`npm.cmd run steam:package:verify` 通過；Electron 正式版 smoke test 確認四區新牌型、商店新遺物、枷鎖按鈕與枷鎖訊息 NEW 正常，空白牌型區不顯示 NEW。
- 下一步建議：請阿雷開正式版玩一局，確認 NEW 標籤在小視窗中不會遮住牌型名稱、商店稀有度標籤或枷鎖名稱。

### 2026-06-06 韻西：收集冊總完成度與標題 NEW 提示
- 狀態：完成。
- 修改：`js/main.js` 新增 `getCollectionSummary()` 與標題「收集冊」按鈕未讀 `NEW` 更新；`js/ui.js` 在收集冊彈窗頂部顯示總完成度；四語系新增 `ui.collection_total_progress`。
- 修正：`js/main.js` 的收集冊統計改用 `COLLECTION_SHACKLE_DB` 別名，避免和檔案中段既有 `SHACKLE_DB` 匯入重複宣告。
- 驗證：`node --check js/main.js`、`node --check js/ui.js`、`npm.cmd run steam:i18n:verify`、`npm.cmd run steam:package:verify` 通過；Electron 正式版互動測試確認標題 `NEW`、總完成度 `2 / 133`、分頁未讀清除流程正常，沒有 page error。
- 下一步建議：請阿雷玩正式版確認收集冊頂部總完成度與 `NEW` badge 視覺是否順眼；若 OK，下一步可接「正式版內容節奏」或「Steam Deck / 手把操作檢查」。

### 2026-06-06 韻西（移除 Electron 外部選單列）
- 狀態：完成。
- 修改：`steam-app/main.js` 移除 Electron `Menu` 與 `createMenu()`，並在 `BrowserWindow` 啟用 `autoHideMenuBar: true`，建立視窗後呼叫 `setMenuBarVisibility(false)`。
- 目的：正式版 Windows 視窗不再顯示上方 `View` / `Window` 兩個外部選單按鈕，避免干擾遊戲畫面。
- 驗證：`node --check steam-app/main.js`、`npm.cmd run steam:package:verify` 通過；Packaged Electron 檢查確認 `menuVisible=false`、`autoHideMenuBar=true`。

### 2026-06-06 韻西 / 阿扣（收集冊完成度與 NEW 標記）
- 狀態：完成。
- 分工：阿扣透過 `claude.exe --permission-mode bypassPermissions` 直接修改收集冊 UI；韻西負責資料結構、未讀狀態流程、審查、Electron 測試與封裝驗證。
- 阿扣修改：`js/ui.js` 在收集冊三個分頁頂部顯示完成度，已解鎖且未讀的新牌型 / 遺物 / 枷鎖會顯示 `NEW` badge；四語系新增 `ui.collection_progress`。
- 韻西修改：`js/main.js` 為 collection 加入 `newItems: { hands, relics, shackles }`，`unlockCollectionItem()` 首次解鎖時會寫入未讀標記，並新增 `window.getCollectionNewItems()` / `window.clearCollectionNewItems(tab)` 給 UI 使用。
- 相容處理：載入舊存檔時會建立缺少的 `newItems`，清理非字串壞資料，遷移舊牌型名稱 key，並確保未讀項目只保留已解鎖項目。
- UI 行為：收集冊分頁按鈕會顯示未讀 `NEW`；玩家打開某個分頁時，該分頁卡片先顯示 `NEW`，渲染後清除該分頁未讀狀態，其他分頁不受影響。
- 驗證：`node --check js/main.js`、`node --check js/ui.js`、四個 locale 語法檢查、`npm.cmd run steam:i18n:verify`、`npm.cmd run steam:package:verify` 皆通過；Packaged Electron 煙霧測試確認 hands / relics / shackles 的完成度、NEW badge 與逐分頁清除流程正確。

### 2026-06-06 韻西 / 阿扣（牌型收藏 key 正規化）
- 分工：阿扣透過本機 `claude.exe` 直接改檔，負責 `RULE_DB` 穩定 id 與牌型收藏改用 id；韻西負責審查 diff、補遷移防護、驗證與封裝。
- 阿扣修改：`js/data.js` 為 39 個牌型加入 `rule_a0` 至 `rule_d10` 穩定 id；`js/main.js` 攻擊結算改用 `ruleNameToId()` 解出 id 後解鎖牌型；`js/ui.js` 收集冊牌型解鎖判斷改優先比對 `rule.id`。
- 韻西補強：`loadCollection()` 會把舊存檔中的牌型中文名稱與 `比比丟八(ビビデバ)` 別名遷移成穩定 id，去除重複項，並清掉舊版開發者全開收藏可能留下的 `null`/非字串壞資料。
- 保留相容：收集冊仍保留 `rule.name` fallback 判斷，避免極端舊資料在遷移前顯示錯誤。
- 驗證：`node --check js/data.js`、`node --check js/main.js`、`node --check js/ui.js`、`npm.cmd run steam:i18n:verify`、RULE_DB id 唯一性檢查、`npm.cmd run steam:package:verify` 全部通過；Packaged Electron 煙霧測試確認舊牌型名稱與別名會遷移為 `rule_a0`，壞值會清除。

### 2026-06-06 鑀韻西 / 阿扣（鍵盤快捷操作與收集進度盤點）
- 狀態：完成。
- 鑀韻西任務：實作正式版桌面鍵盤快捷操作骨架。
- 鑀韻西修改：`js/main.js` 新增全域 `keydown` 快捷鍵處理；`QWER` / `ASDF` 對應鎖定 8 顆骰子，數字鍵 `1` 到 `8` 也對應鎖定 8 顆骰子，`Ctrl` 觸發重骰，`Space` 觸發攻擊。
- 防誤觸：輸入框、下拉選單、內容可編輯元素、標題畫面、商店、結算畫面，以及規則 / 歷史 / 收集冊 / 設定 / 靈魂奉獻 / 教學 / 開發者 / 融合替換彈窗開啟時不觸發快捷鍵；`Space` 會避開教學中尚未解鎖攻擊的階段。
- 阿扣任務：只做「收集進度可視化」設計盤點，未修改任何檔案。
- 阿扣盤點重點：收集冊資料來源為 `RELIC_DB`、`SHACKLE_DB`、`RULE_DB`，玩家資料在 `bibbidiba_collection_v60`；收集數與完成度最適合集中於 `js/ui.js` 的 `renderCollectionModal(tab)`；`NEW` hook 建議從 `js/main.js` 的 `unlockCollectionItem(type, id)` 回傳是否首次解鎖開始。
- 待處理風險：牌型收藏目前用名稱當 key，且 `RULE_DB` 無穩定 `id`；`比比丟八(ビビデバ)` 與收集冊比對文字可能不一致。下輪實作收集進度前，需先整理牌型 key 正規化與開發者全開收藏流程。
- 驗證：`node --check js/main.js`、`npm.cmd run steam:i18n:verify`、`npm.cmd run steam:package:verify` 通過；Playwright Electron 測試確認 `Q`、數字鍵可鎖骰，`Ctrl` 可重骰，`Space` 可攻擊。

### 2026-06-06 鑀韻西（解析度調整移入遊戲內設定）
- 狀態：完成。
- 任務：依製作人指示，將 Steam / Electron 外部選單中的解析度調整移到遊戲內「設定」畫面，移除遊戲外的 Small / Medium / Large 調整項目。
- 修改：`index.html` 新增設定內「視窗大小」下拉選單，提供小 `450x800`、中 `540x960`、大 `675x1200`；`js/main.js` 將視窗大小納入 `bibbidiba_settings` 並透過 `window.steamPortrait.setWindowSize()` 套用；`steam-app/preload.js` 新增安全橋接；`steam-app/main.js` 新增 IPC 視窗尺寸處理並移除外部選單的尺寸 radio 項目。
- i18n：新增 `window_size_label`、`window_size_small`、`window_size_medium`、`window_size_large` 四語文字。
- 修正細節：Electron `ready-to-show` 不再強制覆蓋成預設中尺寸，避免遊戲內設定在載入時套用後又被主程序重設。
- 驗證：`node --check steam-app/main.js`、`node --check steam-app/preload.js`、`node --check js/main.js`、`npm.cmd run steam:i18n:verify`、`npm.cmd run steam:package:verify` 通過；Playwright Electron 自動測試確認遊戲內橋接可切到 `small`，設定內存在三個尺寸選項，外部選單已無 Small / Medium / Large。

### 2026-06-06 鑀韻西 / 阿扣（正式版分工啟動：包版切分與幻覺修復）
- 狀態：完成。
- 分工：鑀韻西負責正式版 / Demo Steam Windows 包版來源切分；阿扣負責修復「幻覺」枷鎖重骰後短暫露出真實骰面的 bug。
- 鑀韻西修改：`package.json` 新增 `steam:build:demo`、`steam:build:full`、`steam:package:demo`、`steam:package:full`、`steam:app:full`，並將 `steam:package` / `steam:package:verify` 預設切到正式版 `steam-full`；`scripts/package-steam-windows.ps1` 新增 `-WebDistDir`，可封裝指定 web dist；`steam-app/main.js` 改為依 packaged `package.json` 的 `bibiDice.steamWebDist` 或環境變數載入 web dist；`scripts/verify-steam-windows-build.js` 改為驗證目前封裝指定的 web dist。
- 阿扣修改：僅調整 `js/ui.js` 的重骰波浪動畫，讓 `illusion` 枷鎖下未鎖定骰子的動畫期間與收尾都使用 `shackleMeta.fakeNumber`，避免 `startRerollAnimation()` 直接把 `<img>` 改回真實骰面。
- 驗證：阿扣端 `node --check js/engine.js`、`node --check js/main.js`、`node --check js/ui.js`、`npm.cmd run steam:i18n:verify` 通過；鑀韻西端 `node --check scripts/verify-steam-windows-build.js`、`node --check steam-app/main.js`、`npm.cmd run steam:package:demo` + `node scripts/verify-steam-windows-build.js`、`npm.cmd run steam:package:verify` 通過。
- 目前狀態：`dist/steam-windows` 最後已重新封裝為正式版來源 `steam-full`；Demo 封裝管線仍可用但不再作為本體預設。

### 2026-06-05 鑀韻東（Steam Demo Trailer v6：移除震動並強化標語）
- 狀態：待製作人播放審片。
- 做了什麼：依製作人回饋「震動特效太多餘、說明文字不夠大不夠明顯、魄力不足」，調整 `scripts/build-steam-trailer-from-captures.ps1`。
- 實作重點：移除 v5 傷害段的畫面晃動；保留近景、閃光與完整傷害演出；段落文字改為更大的中下方宣傳標語，加入金色外光、粗黑描邊與大型底框。
- 修正細節：修正 FFmpeg `drawbox` 的 `h` / `ih` 座標誤用，避免字幕框殘留在畫面上方。
- 當時產出檔案：`promo/steam/trailer/bibi_dice_demo_trailer_gameplay_v6.mp4`；目前磁碟實際保留的最終可上傳檔為 `promo/steam/trailer/bibi_dice_demo_trailer_final_2026-06-05.mp4`。
- 當時檢查檔案：`promo/steam/trailer/gameplay_v6_check_02s.png`、`06s.png`、`11s.png`、`16s.png`、`20s.png`、`26s.png`；目前最終抽幀檢查圖為 `final_check_01.png` ～ `final_check_06.png`。
- 驗證結果：已重新輸出 1920x1080、60fps、H.264 + AAC 影片；抽幀確認上方空框已消失，破億傷害完整可見，字幕遠看更明顯。
- 歷史下一步：本段當時等待製作人確認 v6；已於 2026-06-06 審片通過，現在請上傳 `promo/steam/trailer/bibi_dice_demo_trailer_final_2026-06-05.mp4`。

### 2026-06-04 鑀韻東（Steam Demo 實機錄影版 Trailer v5）
- 狀態：待製作人播放審片。
- 做了什麼：依製作人回饋「畫面仍像斷片、傷害要完整打出去、字幕要放中間下面、需要晃動拉近閃光增加爽感」，再次強化 `scripts/build-steam-trailer-from-captures.ps1`。
- 實作重點：串接方式改為穩定 concat，避免轉場吃掉片長；破億傷害段拉近到傷害數字與面盤，加入短暫畫面晃動、金色閃光與白色閃光；段落字幕改成中下方懸浮金色字樣。
- 產出檔案：`promo/steam/trailer/bibi_dice_demo_trailer_gameplay_v5.mp4`。
- 規格：1920x1080、60fps、約 29.2 秒、H.264 + AAC；原錄影音軌未使用，沿用遊戲 BGM 與音效。
- 檢查檔案：`promo/steam/trailer/gameplay_v5_check_02s.png`、`06s.png`、`11s.png`、`16s.png`、`20s.png`、`26s.png`。
- 驗證結果：`ffprobe` 確認影片為 1920x1080 / 60fps / yuv420p / H.264；6 張抽幀已確認標題、傳說遺物、牌型連鎖、破億傷害完整打出與通關結算畫面皆存在。
- 下一步：請製作人實際播放 `bibi_dice_demo_trailer_gameplay_v5.mp4`，確認震動與閃光是否剛好、字幕是否夠醒目；若通過，再上傳 Steamworks Demo App 的宣傳片欄位。

### 2026-06-04 鑀韻西（登記幻覺枷鎖重骰觸發 bug）
- 狀態：待修復。
- 任務：依製作人回報，記錄枷鎖「幻覺」在重骰後第一時間沒有發動的 bug。
- 修改：僅更新 `SYNC.md` 與 `CHANGELOG.md` 的待修復紀錄，未修改遊戲邏輯。
- 後續處理：已於 2026-06-06 修復，重骰動畫期間與收尾都會套用幻覺假資訊；詳見 2026-06-06「正式版分工啟動：包版切分與幻覺修復」紀錄與「已處理問題」表格。

### 2026-06-02 鑀韻西（新增 AI 協作角色設定）
- 狀態：完成。
- 任務：依製作人指示，將 Codex 與 ChatGPT 的角色身份分開，新增「鑀韻西」作為 Codex 的協作代號。
- 修改：`SYNC.md` 的「協作稱呼」改為鑀韻東 / 韻東對應 ChatGPT，新增鑀韻西對應 Codex；新增 `AI_COLLABORATORS.md` 集中記錄 AI 協作角色設定；`CHANGELOG.md` 新增本次文件紀錄。
- 全域記憶：已寫入 `C:\Users\Leijoa\.codex\memories\ai-collaborator-roles.md`，讓其他專案也能讀到製作人指定的角色設定。
- 注意：這些稱呼只作為溝通代號，不代表固定分工；製作人會依任務安排誰接手。

### 2026-05-30 鑀韻東（重做 Steam 小宣傳圖 Logo 可讀性）
- 狀態：完成。
- 任務：依 Steamworks 小宣傳圖提醒重做 `462x174` Small Capsule，讓縮圖尺寸下 Logo 清楚可讀。
- 修改：`promo/steam/assets/store_small_capsule_462x174.png` 已替換為製作人提供的新圖並調整為 Steam 規定的 `462x174` 尺寸，構圖為左側骰子、右側大型 Logo；`scripts/generate-steam-capsules.js` 支援指定單一 capsule 產出與 suffix，並為 Small Capsule 加入獨立簡潔版版型。
- 驗證：`node --check scripts/generate-steam-capsules.js`、`npm.cmd run steam:assets:verify` 通過。
- 注意：只改 Small Capsule，未重產 Header / Main / Vertical，避免影響已上傳或已通過的其他 Steam 素材。

### 2026-06-01 鑀韻東（補齊 Steam 收藏庫主調圖）
- 狀態：完成。
- 任務：依 Steamworks「收藏庫資產守則」實際缺項，補齊 `library_hero_3840x1240.png`。
- 背景：舊決策曾因前一版 Library Hero 與遊戲關聯不足而停用；但 Steamworks 後台現在將「收藏庫主調圖」列為必填，且規則明確要求不應包含 Logo / 文字。
- 修改：`scripts/generate-steam-library-assets.js` 重新加入 Library Hero 產出，但改用 `key_art_d8_banner.png` 下半部裁切，避開 Logo 與文字；`scripts/verify-steam-assets.js` 改為驗證 16 個必要素材，將 `library_hero_3840x1240.png` 列為必填。
- 產出：`promo/steam/assets/library_hero_3840x1240.png`，尺寸 `3840x1240`，無 Logo、無遊戲名、無標語文字。
- 文件：更新 `ASSET_CHECKLIST.md`、`STEAMWORKS_UPLOAD_PACKET.md`、`STEAM_RELEASE_CHECKLIST.md`、`STEAM_ASSET_FINAL_AUDIT.md`、`CHANGELOG.md` 與本檔，移除目前決策區中「Library Hero 不做」的舊指示。
- 驗證：`node --check scripts/generate-steam-library-assets.js`、`node --check scripts/verify-steam-assets.js`、`npm.cmd run steam:assets:verify` 通過；新驗證結果為 16 個必要素材尺寸正確。
- 後台下一步：在 Steamworks 圖像資產的「收藏庫主調圖」上傳 `promo/steam/assets/library_hero_3840x1240.png`，儲存後到「發佈」頁送出素材變更。

### 2026-05-30 鑀韻東（新增桌面鍵盤快捷操作代辦）
- 狀態：完成。
- 任務：將製作人提出的鍵盤快捷操作想法納入正式版 Roadmap。
- 修改：`FULL_VERSION_ROADMAP.md` 新增桌面鍵盤快捷操作規劃，包含 `QWER` / `ASDF` 與數字鍵 `1` 到 `8` 對應鎖定八顆骰子、`Ctrl` 重骰、`Space` 攻擊。
- 注意：此功能尚未實作；完成前 Steamworks 控制器支援說明不應宣稱已支援控制器。實作時需同步教學與設定頁提示，並確認滑鼠操作仍完整可用。

### 2026-05-29 鑀韻東（整理 Steamworks 目前畫面填寫速查）
- 狀態：完成。
- 任務：依製作人附圖整理 Steamworks 商店頁管理員目前畫面應填資料。
- 修改：`promo/steam/STEAMWORKS_UPLOAD_PACKET.md` 新增 Base Game App `4792230` 的逐頁填寫速查，包含基本資訊、外部連結、發行日期提醒、支援語言、玩家人數、支援功能、類型標籤、系統需求、客服聯絡與 Demo App 不在商店頁編輯器內的說明。
- 補充：Demo 不應從「支付 Steam Direct 費」建立新正式應用程式；應從 Base Game 的「所有相關套件、可下載內容、試用版與工具」新增關聯 Demo App。
- Demo 入口：依 Steamworks 中文介面確認，路徑為「關聯的套件與 DLC」頁最上方「試玩版」區塊點「新增試玩版」。
- Demo 建立結果：`BIBI DICE Demo` 已建立，Store Item `1202328`，Package `1667225`（Developer Comp）/ `1667226`（Beta Testing）/ `1667227`（Store）。
- Demo 內容調查表：新增 `BIBI DICE Demo (4796530)` 填寫建議；目前建議只勾「卡通式暴力 / 奇幻暴力」與 AI 使用「是」，其餘成人內容、血腥、裸露、藥物、犯罪、線上互動、模擬賭博皆不勾；AI 使用揭露已補繁中、簡中、英文、日文四語。
- 說明分頁：新增「關於此遊戲」與「簡介」四語貼上內容；右側自訂圖片目前先略過。
- 圖像資產：補充「收藏庫資產」分頁只上傳 `library_capsule_600x900.png`、`library_header_capsule_920x430.png`、`library_logo_1280x720.png`；`app_icon_184x184.jpg` 與 `shortcut_icon_256x256.png` 放在此分頁會因尺寸不屬於收藏庫資產而被 Steamworks 拒收。
- Demo 收藏庫資產：依 Steamworks 試用版提示，`BIBI DICE Demo (4796530)` 目前建議不額外上傳收藏庫資產，讓 Steam 收藏庫沿用主程式資產；若審核明確要求再補。
- 注意：`2026-07-01` 原本是 Demo 發布目標，不應誤作正式版 Base Game 發售硬承諾；Base Game 顧客可見日期建議用「即將推出 / 待定 / 2026」等保守呈現。

### 2026-05-25 鑀韻東（補充正式版靈魂奉獻與 NEW 收藏提示）
- 狀態：完成。
- 任務：將製作人新增的正式版項目整理進 `FULL_VERSION_ROADMAP.md`。
- 修改：靈魂奉獻擴充方向新增「提高稀有遺物出現率」；收集進度可視化新增第一次取得未收集牌型 / 遺物時顯示 `NEW` 字樣。
- 用途：提高正式版局外成長的吸引力，並強化玩家解鎖新收藏時的即時回饋。

### 2026-05-24 鑀韻東（補充正式版收集進度與倍率特效方向）
- 狀態：完成。
- 任務：把製作人提出的正式版 UI 統計與特效想法整理進 `FULL_VERSION_ROADMAP.md`。
- 修改：新增「收集進度可視化」與「牌型倍率特效強化」兩節；規劃牌型 / 枷鎖 / 遺物表右上顯示擁有數量與全部數量、收集冊顯示完成度百分比，並規劃傳說以上牌型區金色外框與四區共鳴大框特效。
- 用途：支援全收集類成就、收集冊完成度成就與「四區共鳴」成就，同時提高戰鬥畫面辨識度與爽感。

### 2026-05-24 鑀韻東（新增正式版開發路線圖）
- 狀態：完成。
- 任務：依製作人最新決策建立正式版路線圖。
- 產出：`FULL_VERSION_ROADMAP.md`。
- 決策：正式版必做 Steam 成就、Steam Cloud、靈魂奉獻擴充、更多遺物 / 融合方向、更多敵人 / Boss / 挑戰條件與體驗優化；排行榜與每日挑戰列為高優先研究；章節制內容可考慮但不走重劇情；多人遊戲、Steam Deck Verified、模組 / 工作坊明確不做。
- 注意：`promo/steam/FULL_VERSION_SCOPE.md` 舊版仍把雲端存檔、排行榜、每日挑戰列在「暫不承諾」區，後續需要依本路線圖同步更新 Steam 文案相關文件。

### 2026-05-24 鑀韻東（修正 GitHub Pages Jekyll 解析 SteamPipe 文件失敗）
- 狀態：完成。
- 問題：GitHub Pages 內建 Jekyll build 解析 `promo/steam/STEAMPIPE_DEPOT_DRAFT.md` 時，將 `{{DEMO_APPID}}` 等 SteamPipe 占位符誤判為 Liquid 模板語法，造成 `pages build and deployment / build` 失敗。
- 修改：新增 `.nojekyll`，讓 Pages 以靜態檔方式發布；新增 `_config.yml` 排除專案文件、`promo/`、`scripts/`、`steam-app/`、`dist/`、`node_modules/` 等非網站輸出內容，降低日後文件再次觸發 Jekyll/Liquid 錯誤的風險。
- 下一步：推送後確認 GitHub Actions 的 `pages build and deployment` 是否恢復成功。

### 2026-05-24 製作人 → 阿扣（Steam 商店截圖目視通過）
- 狀態：完成。
- 任務：製作人對同日重產的 6 張 Steam 商店截圖做最終目視確認。
- 結果：6 張全部通過、可作為 Steam 商店頁正式素材：
  - #1 `store_screenshot_01_title_1920x1080.png` ✅ OK
  - #2 `store_screenshot_02_battle_start_1920x1080.png` ✅ OK
  - #3 `store_screenshot_03_combo_preview_1920x1080.png` ✅ OK
  - #4 `store_screenshot_04_rules_table_1920x1080.png` ✅ OK（製作人特別確認牌型倍率表保留，不需替換成 Boss 枷鎖）
  - #5 `store_screenshot_05_relic_shop_1920x1080.png` ✅ OK
  - #6 `store_screenshot_06_soul_offering_1920x1080.png` ✅ OK
- 更新：`SYNC.md`（移除前一筆的「未涵蓋 Boss 枷鎖風險」描述）、`promo/steam/STEAM_RELEASE_CHECKLIST.md`、`promo/steam/ASSET_CHECKLIST.md`、`CHANGELOG.md`。
- 規則：此後不再把 #4 標為風險或待替換項。
- 提交：`標記 Steam 商店截圖目視通過`。

### 2026-05-24 阿扣（Steam 商店截圖最終盤點與重產）
- 狀態：完成。
- 任務：確認 Steam store screenshot 是否反映最新版 UI；不是則重產 6 張正式版 1920×1080 實機截圖。
- 盤點：原 6 張截圖時間戳為 2026-05-19，期間 5/23 有大量 UI 變更（emoji 全移除、鎖定骰新視覺、勝利花灑方向修正、新手教學定位修正、商店融合流程修正、無限塔枷鎖動畫節奏）→ 需重產。
- 修改：執行 `npm.cmd run steam:capture` 重產 6 張（會先 `steam:build` 再用 Playwright 實機擷圖）。
- 驗證：(1) 6 張新檔時間戳 2026-05-24；(2) `npm.cmd run steam:assets:verify` 通過，15 個必要素材尺寸正確，`library_hero_3840x1240.png` 維持不存在；(3) 目視檢查 6 張 — 標題畫面（中文 Logo 清楚、按鈕無 emoji）、戰鬥開局（8 骰、HP、預估傷害 13,728）、牌型預覽（八同 4,800,000 倍率爆發）、牌型倍率表彈窗、商店遺物三選一、靈魂奉獻清單，無血腥、無成人、無跑版、無文字截斷。
- 主題對照：#1 標題、#2 戰鬥、#3 牌型預覽、#4 牌型倍率表（B-04 製作人決定保留，**2026-05-24 製作人已確認保留，不需替換**）、#5 商店遺物、#6 靈魂奉獻。
- 更新：`promo/steam/ASSET_CHECKLIST.md`、`promo/steam/STEAM_RELEASE_CHECKLIST.md`、`SYNC.md`、`CHANGELOG.md`。
- 提交：`確認 Steam 商店截圖最終版`。

### 2026-05-23 阿扣（整理 Steamworks 後台填寫包）
- 狀態：完成。
- 任務：依製作人指示整理一份「Steamworks 後台填寫包」，讓帳號審核通過後可以照表貼上。
- 產出：`promo/steam/STEAMWORKS_UPLOAD_PACKET.md`，14 區結構含：App 名稱 / 開發商 / 短描述四語 / 長描述繁中英文 / 關於此遊戲 / 關於此 Demo / 定價 / 語言 / 標籤 19 個 / AI 揭露文字繁中英文 / IARC 答案摘要 / Privacy Policy URL / 11 張素材檔案路徑 + 尺寸 / Build 上傳 ContentRoot 為 `dist/steam-windows`、Launch Option `BIBI-DICE.exe` / Coming Soon 與 Demo 排程 / 後台填寫順序 22 步。
- 盤點：交叉核對 `STEAM_RELEASE_CHECKLIST.md`、`STEAMWORKS_FIELDS_DRAFT.md`、`STEAMPIPE_DEPOT_DRAFT.md`、`STEAM_STORE_BRIEF.md`、`ASSET_CHECKLIST.md` 後確認所有可貼欄位已備齊；無發現文件與實際 Build 不一致。
- 驗證：本次僅新增文件，未動程式或 build 腳本；`git diff` 範圍限於 `promo/steam/STEAMWORKS_UPLOAD_PACKET.md`（新增）、`SYNC.md`、`CHANGELOG.md`。
- 注意：itch.io 頁面 Privacy Policy 連結仍需製作人登入 itch.io 後台手動加入；正式版送審時 E-08 需重評（含購買機制）。
- 下一步：等製作人帳號審核通過、建立 Base Game App 後，依本檔第 14 區順序填寫；Demo AppID / DepotID 取得後回填 `STEAMPIPE_DEPOT_DRAFT.md` 第 2 區。

### 2026-05-23 鑀韻東（無限塔枷鎖動畫節奏）
- 狀態：完成。
- 任務：進入無限塔後仍每層保留枷鎖效果，但降低枷鎖封印動畫頻率。
- 修改：`js/main.js` 新增 `shouldPlayShackleIntroAnimation(levelIndex)`；主線關卡枷鎖動畫照舊，無限塔只在第 3、6、9... 層播放封印動畫，其他無限塔樓層直接顯示枷鎖訊息後開始關卡。
- 驗證：`node --check js/main.js`、`npm.cmd run steam:i18n:verify`、`npm.cmd run steam:package:verify` 通過。
- 產出：已重建 `dist/steam-demo` 與 `dist/steam-windows/BIBI-DICE.exe`。
- 下一步：請製作人實機確認無限塔爬塔節奏是否比較順。

### 2026-05-23 鑀韻東（商店後融合分解流程與鎖定骰視覺）
- 狀態：完成。
- 任務：修正「商店買完東西後，遺物分解環節被下一關枷鎖動畫 / 訊息打斷」的流程問題，並補強移除 emoji 後不明顯的鎖定骰視覺。
- 修改：`js/main.js` 新增 `pendingShopAdvanceAfterFusion` 與 `finishShopAndAdvance()`；`checkRelicFusion()` 會回傳是否開啟分解視窗。商店購買若觸發分解視窗，會先隱藏商店並暫停進下一關，直到 `showFusionReplaceModal()` 回呼完成、再次確認沒有新的分解視窗後，才進入下一關並播放枷鎖流程。
- 修改：`js/ui.js` / `css/style.css` 將鎖定骰子改為紫金發光外框、半透明遮罩、自製 SVG 小鎖與 `LOCK` 標籤；詛咒鎖定使用紅色變體，避免回復 emoji。
- 驗證：`node --check js/main.js`、`node --check js/ui.js`、`npm.cmd run steam:i18n:verify`、emoji 掃描、`npm.cmd run steam:package:verify` 通過。
- 產出：已重建 `dist/steam-demo` 與 `dist/steam-windows/BIBI-DICE.exe`。第一次打包時舊 exe 被已開啟的遊戲程序佔用，已關閉舊 `BIBI-DICE.exe` 後重跑成功。
- 下一步：請製作人實機確認鎖定骰視覺是否足夠明顯，以及商店後分解流程是否不再被枷鎖演出插隊。

### 2026-05-23 鑀韻東（勝利花灑方向與全遊戲 emoji 移除）
- 狀態：完成。
- 任務：修正勝利通關時花灑方向錯誤，並移除遊戲內所有 emoji，避免 UI 呈現 AI 感。
- 修改：`js/ui.js` 的 `shootConfetti()` 改用 `angle: 180` 讓粒子向上灑出；`index.html`、`js/main.js`、`js/ui.js`、`js/i18n.js` 與四個 `js/locales/*.js` 移除 UI / 教學 / 提示 / 備援字串中的 emoji。
- 補強：移除空掉的骰子 / 攻擊按鈕圖示 span、收集冊解鎖勾選空 span；鎖定骰保留遮罩與 SVG 角標；靈魂奉獻等級標記改為 ASCII `I` / `-`；歷史紀錄展開符號改為 `+` / `-`。
- 驗證：`rg` 掃描 `index.html` 與 `js/`（排除 `js/vendor/`）未找到 emoji 字元；`node --check js/ui.js`、`node --check js/main.js`、`node --check js/locales/zh-tw.js`、`npm.cmd run steam:i18n:verify`、`npm.cmd run steam:package:verify` 通過。
- 產出：已重建 `dist/steam-demo` 與 `dist/steam-windows/BIBI-DICE.exe`。第一次打包時舊 exe 被已開啟的遊戲程序佔用，已關閉舊 `BIBI-DICE.exe` 後重跑成功。
- 下一步：請製作人實機看勝利花灑方向與整體無 emoji UI 是否符合預期。

### 2026-05-23 阿扣（【混沌法則】枷鎖難度重新分類）
- 狀態：完成。
- 任務：依製作人決定，將【混沌法則】枷鎖從重度（heavy）改為輕度（light）。
- 分析：枷鎖實作（`engine.js:46-53`）只在 postCalc 對調 `tagA` / `tagB` 物件；因最終倍率為乘法（或 `order` 遺物下的加法），交換律使**單獨存在時對傷害數值零影響**。真正威脅來自與其他 A/B 區針對型枷鎖（秩序崩壞 / 孤立無援）或槽位專屬遺物（`cons_strike_a` / `cons_fever_b` / `flicker`）的交互，但目前關卡不會雙枷鎖共存。
- 修改：`js/data.js:150` `chaoslaw.type` 由 `'heavy'` 改為 `'light'`。
- 驗證：locale 檔不需異動（描述文字未變）；i18n 結構未受影響。
- 潛在後續：`flicker` 遺物在混沌法則下永遠無法觸發（檢查 `tagA.name === '對子'`），目前不修但可考慮日後加入收集冊提示。

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

詳細角色設定另見 `AI_COLLABORATORS.md`。

- 阿雲：Google Gemini
- 阿揪：Google Jules
- 阿克：Claude
- 阿扣：Claude Code
- 鑀韻東 / 韻東：ChatGPT
- 鑀韻西：Codex；韻東（ChatGPT）的雙胞胎妹妹，專長處理複雜程式與規劃代辦事項

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
| Windows Steam Build 打包 | 已完成 | `npm.cmd run steam:package:verify` 目前預設產正式版 `steam-full`；重上 Demo 前需改用 `npm.cmd run steam:package:demo` |
| 直式桌面截圖 | 已完成第一版 | `npm.cmd run steam:capture` 可重產 |
| Store Capsule | 已完成 D8 修正版，製作人已確認通過 | `npm.cmd run steam:capsules` 可重產；不得額外疊英文遮住中文 Logo |
| Library Capsule / Header / Hero / Logo / Icon | 已完成 D8 修正版，製作人已確認多數通過 | `npm.cmd run steam:library` 可重產；Library Hero 必須是無 Logo / 無文字版，Library Logo 維持主視覺美術字擷取版 |
| 隱私政策 | 已完成，待填入 Steamworks / itch.io | 見 `promo/steam/PRIVACY_POLICY.md`；GitHub 公開 URL：`https://github.com/Leijoa/bibi-dice/blob/main/promo/steam/PRIVACY_POLICY.md`；itch.io 頁面需登入後台手動加入此連結 |
| Steam Release Checklist | 已完成第一版 | 見 `promo/steam/STEAM_RELEASE_CHECKLIST.md` |
| Steam 可上傳 Build / depot 檢查 | Demo Build 已上傳並發布到 Steam | Demo AppID `4796530`、DepotID `4796531`、最新 Demo BuildID `23496399`；Steam 商店測試頁可安裝 Demo |
| Steamworks 後台資料填寫 | 進行中 | 已確定 Coming Soon / Demo 目標排程；隱私政策已完成，itch.io 隱私政策連結仍需製作人登入後台手動加入 |

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
- `library_hero_3840x1240.png` 現在必須補齊，因 Steamworks 收藏庫資產守則將「收藏庫主調圖」列為缺項；但此圖不可包含 Logo、遊戲名、標語或任何文字。
- `library_logo_1280x720.png` 必須使用主視覺美術字風格，不可用普通系統字。
- 正確遊戲名是「比比丟八」，不是「比比丟人」。
- Store / Library 圖不要讓英文 `BIBI DICE` 遮住中文主視覺 Logo。
- `npm.cmd run steam:capsules` 產出的 Store Capsule 不可再額外疊 `BIBI DICE` 或 `bibi-dice` 文字層；只能保留原主視覺中的 Logo。
- Steam screenshot 必須使用實機遊戲畫面；宣傳合成圖不能混進 screenshot 欄位。
- Steam 版不承諾掌機與橫版 UI。

## 待處理問題

| 狀態 | 發現日期 | 發現者 | 問題 | 影響 | 預計處理 |
| --- | --- | --- | --- | --- | --- |
| ~~已完成~~ | 2026-06-04 | 製作人 → 鑀韻西 | 枷鎖「幻覺」在重骰後的第一時間沒有發動。 | 玩家重骰後可能短暫看到不符合幻覺規則的盤面或提示，影響枷鎖威脅與判讀一致性。 | 2026-06-06 已修復，見「已處理問題」。 |
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
| 2026-06-06 | 阿扣 / 鑀韻西 | 枷鎖「幻覺」在重骰後第一時間沒有發動，重骰動畫收尾可能短暫露出真實骰面。 | 阿扣修正 `js/ui.js` 重骰波浪動畫，讓 `illusion` 枷鎖下未鎖定骰子的動畫期間與收尾都使用 `shackleMeta.fakeNumber`；鑀韻西審查、封裝與同步紀錄。 | `node --check js/engine.js`、`node --check js/main.js`、`node --check js/ui.js`、`npm.cmd run steam:i18n:verify` 通過；`CHANGELOG.md` 已記錄「修正：幻覺枷鎖重骰後立即套用假資訊」。 |
| 2026-05-21 | 製作人 → 阿扣 | A-01/A-02 開發商與發行商名稱三選一未定。 | 製作人選定「雷爪獅」，A-02 同 A-01。 | 已同步至 `STEAMWORKS_FIELDS_DRAFT.md` 第 1 / 第 10 區與 `STEAM_RELEASE_CHECKLIST.md` 第二區。 |
| 2026-05-21 | 製作人 → 阿扣 | A-07 itch.io URL 未提供。 | 製作人提供 `https://leijoa.itch.io/bibi-dice`。 | 已同步至 `STEAMWORKS_FIELDS_DRAFT.md` 第 1 / 第 10 區。 |
| 2026-05-21 | 製作人 → 阿扣 | C-03/C-04/C-05 SteamPipe 流程細節未定。 | 製作人決定：先進 internal branch 自測、製作人本人 SetLive、`steam-build/` 加入 `.gitignore`。 | 已同步至 `STEAMPIPE_DEPOT_DRAFT.md` 第 3 / 4 / 6 區；`.gitignore` 已加入 `steam-build/`。 |
| 2026-05-21 | 製作人 → 阿扣 | D-04 favicon AI 揭露答覆不明確。 | 製作人確認「是」（含 AI），並指派鑀韻東重新生成 favicon。 | 已同步至 `STEAMWORKS_FIELDS_DRAFT.md` 第 8 / 第 10 區；favicon 重生任務已由鑀韻東於 2026-05-21 完成。 |
| 2026-05-21 | 鑀韻東 | `favicon.png` 舊版風格不符合目前 Steam 主視覺，且 Shortcut / App Icon 品質不足。 | 使用 AI 生成暗紫霓虹骰子新版 `favicon.png`，並重產 `shortcut_icon_256x256.png` 與 `app_icon_184x184.jpg`。 | `npm.cmd run steam:assets:verify` 通過，確認 15 個必要素材尺寸正確且 `library_hero_3840x1240.png` 維持不存在。 |
| 2026-05-21 | 鑀韻東 | Store / Library Capsule 色澤偏暗，且角色手上骰子不是遊戲內八面骰。 | 參考原主視覺、遊戲內 `dice_8.webp` / `dice_1.webp` 與真實 D8 形體，使用 AI 生成 `promo/steam/source/key_art_d8_banner.png` 與 `promo/steam/source/key_art_d8_portrait.png`；修改 Store / Library 產圖腳本改用新源圖並降低暗化層，重產 F-01/02/04~07 共 6 張 Capsule。 | `node --check scripts/generate-steam-capsules.js`、`node --check scripts/generate-steam-library-assets.js`、`npm.cmd run steam:capsules`、`npm.cmd run steam:library`、`npm.cmd run steam:assets:verify` 全部通過；15 個必要素材尺寸正確，`library_hero_3840x1240.png` 維持不存在。 |
| 2026-06-01 | 鑀韻東 | Steamworks 實際將「收藏庫主調圖」列為缺項，與舊文件「Library Hero 不做」衝突。 | 重新產出 `promo/steam/assets/library_hero_3840x1240.png`，使用無 Logo / 無文字裁切版；更新產圖腳本、驗證腳本與 Steam 文件。 | `npm.cmd run steam:assets:verify` 通過，確認 16 個必要素材尺寸正確。 |
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
npm.cmd run steam:package:demo
npm.cmd run steam:package:full
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

注意：

- 在 Windows PowerShell 中，優先使用 `npm.cmd`，避免 `npm.ps1` execution policy 問題。
- `steam:package` 與 `steam:package:verify` 目前預設產正式版 `steam-full`。
- 若要重新上傳 Demo Build，請先執行 `npm.cmd run steam:package:demo`。

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
### 2026-05-23 鑀韻東：Steam 直式版特效定位與字體修正
- 狀態：已完成。
- 工作內容：修正 Steam 桌面直式視窗中跳出訊息、通關灑花與敵人扣血數字的定位，使其以 `#game-container` 實際畫面為基準，不再以整個 Electron 視窗為中心。
- 涉及檔案：`js/ui.js`、`js/main.js`、`css/style.css`、`index.html`、`CHANGELOG.md`、`SYNC.md`。
- 技術重點：`showToast()` 與 `shootConfetti()` 改用遊戲容器矩形計算座標；傷害文字移除 Tailwind translate 與 CSS animation transform 的雙重位移，並依數字長度縮小字級。
- 字體策略：不使用外部 CDN，改用 Steam 離線可用的 Windows / Electron 系統字體堆疊，繁中 UI 優先 `Microsoft JhengHei UI`，數字優先 `Bahnschrift`。
- 驗證：`node --check js/ui.js`、`node --check js/main.js`、`npm.cmd run steam:build`、`npm.cmd run steam:package:verify` 通過；Playwright 量測確認 toastInside=true、damageInside=true、toastCenterDelta=0、damageCenterDelta=0。
- 輸出：`dist/steam-demo` 與 `dist/steam-windows/BIBI-DICE.exe` 已重新產生，package smoke test 通過，沒有殘留 Electron / BIBI 程序。
- 下一步：請製作人實機開啟 Steam Windows 版快速確認視覺觀感，若 OK 再決定是否同步推 GitHub / itch.io。
### 2026-05-30 鑀韻東：Demo Depot 上傳前置完成
- 已重新執行 `npm.cmd run steam:package:verify`，並確認 `dist/steam-windows/BIBI-DICE.exe` 可啟動、內含 `resources/app/dist/steam-demo`。
- 已驗證 Steam 素材與四語系：`npm.cmd run steam:assets:verify`、`npm.cmd run steam:i18n:verify` 皆通過。
- 已安裝 SteamCMD：`D:\tools\steamcmd\steamcmd.exe`。
- 新增 `promo/steam/STEAM_DEPOT_UPLOAD_NOW.md`，整理目前可上傳前置狀態與缺少的 Demo DepotID。
- 待處理：請製作人於 Steamworks 的 Demo App `4796530` 找到或建立 Windows Depot，提供 DepotID 後再建立 VDF 並執行 SteamPipe 上傳。
### 2026-06-01 鑀韻東（Demo DepotID 確認並建立 SteamPipe VDF）
- 狀態：進行中。
- 製作人於 Steamworks `BIBI DICE Demo (4796530)` → `SteamPipe` → `管理 Depot` 找到 Demo DepotID：`4796531`，名稱為 `BIBI DICE Demo Content`。
- 已建立 `steam-build/app_build_demo.vdf` 與 `steam-build/depot_build_demo.vdf`。
- VDF 設定：AppID `4796530`、DepotID `4796531`、ContentRoot `D:\unity\bibi-dice\dist\steam-windows`、啟動檔仍依 Steamworks Launch Option 使用 `BIBI-DICE.exe`。
- `SetLive` 先保持空白，避免 SteamCMD 上傳後直接發布到分支。
- 下一步：用 SteamCMD 上傳 build，成功後記錄 BuildID，先 SetLive 到 `internal` branch 測試。
### 2026-06-01 製作人 + 鑀韻東（Demo SteamPipe Build 上傳成功）
- 狀態：完成上傳，待 internal branch 測試。
- 使用 SteamCMD 成功上傳 `BIBI DICE Demo (4796530)` 的 Depot `4796531`。
- BuildID：`23496399`。
- 上傳內容：`D:\unity\bibi-dice\dist\steam-windows`，含 `BIBI-DICE.exe` 與 Electron runtime。
- 後續處理：2026-06-02 已將 BuildID `23496399` 發布到 Steam，Steam 商店測試頁可安裝 Demo；此筆為上傳當下的歷史下一步，最新狀態以本檔頂部快速交接區為準。
### 2026-06-02 - Codex：Steam Demo Trailer 產出與下一步同步
- 目前狀態：Demo 商店頁已送審，Steam 商店測試頁可安裝 Demo；試玩版組建檢查表剩下 Trailer / 宣傳片相關項目。
- 本次完成：
  - 新增 `scripts/generate-steam-trailer-webm.js`，用 Steam 實機截圖、Logo、Header Capsule 與標題 BGM 製作 1920×1080 Demo Trailer WebM。
  - 新增 `scripts/finalize-steam-trailer.js`，使用 `@ffmpeg-installer/ffmpeg` 轉出 MP4，並抽出 `trailer_check_02s.png`、`trailer_check_09s.png`、`trailer_check_20s.png` 供目視檢查。
  - 產出 `promo/steam/trailer/bibi_dice_demo_trailer_review.mp4`，規格為 1920×1080、約 26.77 秒、H.264 + AAC；此為歷史版本，已由 `promo/steam/trailer/bibi_dice_demo_trailer_final_2026-06-05.mp4` 取代。
  - 更新 `promo/steam/STEAMWORKS_UPLOAD_PACKET.md`、`promo/steam/STEAM_RELEASE_CHECKLIST.md`、`promo/steam/ASSET_CHECKLIST.md`、`promo/steam/STEAM_DEPOT_UPLOAD_NOW.md`。
- 驗證結果：
  - `node --check scripts/generate-steam-trailer-webm.js` 通過。
  - `node --check scripts/finalize-steam-trailer.js` 通過。
  - `npm.cmd run steam:trailer:finalize` 通過，已重生 MP4 與三張檢查影格。
  - 2 秒、9 秒、20 秒影格已目視檢查，沒有黑屏或排版跑版；9 秒畫面清楚呈現 4,800,000 大傷害與稀有牌型。
- 下一步：
  - 歷史下一步：當時建議上傳 `promo/steam/trailer/bibi_dice_demo_trailer_review.mp4`；已由 2026-06-06 確認的 `promo/steam/trailer/bibi_dice_demo_trailer_final_2026-06-05.mp4` 取代。
  - 上傳後回到發行進度，檢查「試玩版組建」是否轉為完成；若完成即可提交試玩版組建審核。
### 2026-06-04 鑀韻東（Steam Demo 實機錄影版 Trailer v2）
- 狀態：已完成第一版可審片成品。
- 做了什麼：新增 `scripts/build-steam-trailer-from-captures.ps1`，改用製作人 OBS 實機錄影素材剪輯 Steam Demo Trailer，包含標題畫面、傳說遺物選擇、鎖定重骰、破億傷害與通關結算段落。
- 產出檔案：`promo/steam/trailer/bibi_dice_demo_trailer_gameplay_v2.mp4`。
- 規格：1920x1080、60fps、約 27.3 秒、H.264 + AAC；原錄影音軌未使用，改用 `bgm/bibbidiba_BGM_01.mp3` 搭配少量攻擊與骰子音效。
- 檢查檔案：`promo/steam/trailer/gameplay_v2_check_02s.png`、`06s.png`、`11s.png`、`15s.png`、`20s.png`、`25s.png`。
- 驗證結果：`ffprobe` 確認影片為 1920x1080 / 60fps / H.264 + AAC；6 張抽幀已確認有標題、傳說遺物、倍率組合、144,000,000 大傷害與通關結算畫面，字幕位於左下角且未遮住直式遊戲主畫面。
- 下一步：請製作人播放 `bibi_dice_demo_trailer_gameplay_v2.mp4` 做最終目視與聽感確認；若通過，於 Steamworks Demo App 的「上傳宣傳片」欄位上傳此檔。
### 2026-06-04 鑀韻東（Steam Demo 實機錄影版 Trailer v3）
- 狀態：待製作人目視審片。
- 做了什麼：依製作人回饋「特效不夠多、爽度不夠、畫面可拉近、說明文字不夠顯眼、段落切換不順」，強化 `scripts/build-steam-trailer-from-captures.ps1`。
- 實作重點：新增直式主畫面近景版型、傷害與骰盤特寫版型、紫色閃切轉場、金色外框、放大高對比字幕與更強的背景模糊暗角。
- 產出檔案：`promo/steam/trailer/bibi_dice_demo_trailer_gameplay_v3.mp4`。
- 規格：1920x1080、60fps、約 25.7 秒、H.264 + AAC；原錄影音軌未使用，沿用遊戲 BGM 與音效。
- 檢查檔案：`promo/steam/trailer/gameplay_v3_check_02s.png`、`06s.png`、`10s.png`、`14s.png`、`18s.png`、`23s.png`。
- 驗證結果：已成功輸出 MP4 與 6 張抽幀；抽幀確認含標題、傳說遺物、牌型連鎖、破億傷害與通關結算。`10s` 抽幀落在紫色閃切轉場中，屬預期效果。
- 下一步：請製作人播放 `bibi_dice_demo_trailer_gameplay_v3.mp4` 檢查整段節奏、字幕可讀性與爽感；若通過，再上傳 Steamworks Demo App 的宣傳片欄位。
### 2026-06-17 Codex：新手教學 10 步拆解與枷鎖互動

- 任務：依製作人要求，將新手教學從單段低風險說明升級為更詳細的多 Step 流程，並讓教學史萊姆帶有「生鏽的鎖」枷鎖，要求玩家點擊枷鎖標籤查看枷鎖資訊。
- 協作：已呼叫阿扣（Claude Code）執行唯讀複核，檢查 `js/main.js`、`js/ui.js`、`index.html`、四語系 tutorial key 與 tutorial CSS；阿扣指出攻擊解鎖門檻、枷鎖點擊回呼、overlay pointer-events 是主要風險點。
- 已改：`TUTORIAL_STEPS` 擴為 10 步，拆開敵人 HP、枷鎖、剩餘回合數、八顆骰子、鎖骰、重骰、預估傷害、攻擊、商店、完成教學。
- 已改：教學 stage 固定套用 `activeShackle: 'rusty'` 且 `shackleWasNew: false`，避免教學污染 NEW 收藏提示。
- 已改：新增 `shackle_info` waitFor 與 `window.onTutorialShackleInfo(id)`，玩家必須點擊 `active-shackle-badge` 才會從枷鎖教學前進。
- 已改：`index.html` 新增 `enemy-card` id；`js/ui.js` 新增 `active-shackle-badge`、敵人 HP / 枷鎖 / 剩餘回合高亮映射與 overlay click-through；攻擊解鎖門檻統一為 `TUTORIAL_ATTACK_UNLOCK_STEP = 7`。
- 已改：四語系 `tutorial.step0` 到 `tutorial.step9` 完整同步。
- 已驗證：`node --check js/main.js`、`node --check js/ui.js`、四語系 `node --check`、`npm.cmd run steam:i18n:verify`、`git diff --check`、Electron 10 步教學 smoke、`npm.cmd run steam:package:verify` 均已通過。
- 待辦：繼續進行正式版遊戲打磨清單中的其他項目。
### 2026-06-18 Codex：Steam 成就 native bridge 接上 steamworks.js

- 任務：承接 Steam Cloud / 成就事件佇列後續，將 `steam-achievement-unlock` 從 pending stub 接到 Steamworks native bridge。
- 套件決策：依 Ponytail 工程規則採用 `steamworks.js@0.4.0`，因它已內含 Windows `steam_api64.dll` 與 `.node` binary，且 API 直接支援 `achievement.activate()` / `stats.store()`；未採用 `steamworks-ffi-node`，避免另行管理 Steamworks SDK redistributables、Koffi 與較大的打包面。
- 阿扣協作：本輪再次嘗試 `claude.exe -p` 唯讀複核套件選型；`claude.exe auth status` 顯示已登入，但複核命令 120 秒逾時，未取得回覆。此限制已記錄，Codex 依 npm tarball、README 與現有打包腳本完成決策。
- 修改：`package.json` / `package-lock.json` 新增 `steamworks.js`；`steam-app/main.js` lazy init Steamworks 並在解鎖成就後呼叫 `stats.store()`；`scripts/package-steam-windows.ps1` 複製 `node_modules/steamworks.js` 與 `steam_api64.dll`；`scripts/verify-steam-windows-build.js` 驗證 native module、DLL 與成就 bridge。
- 不碰：`js/engine.js`、`js/data.js`、語系檔與既有成就觸發點都未修改。
- 已驗證：`node --check steam-app/main.js`、`node --check steam-app/preload.js`、`node --check scripts/verify-steam-windows-build.js`、PowerShell 腳本解析、`npm.cmd run steam:i18n:verify`、`npm.cmd run steam:package:verify` 通過；正式包含 `steamworks.js`、Win64 native `.node`、`steam_api64.dll`，`BIBI-DICE.exe` 啟動 smoke 成功。
- 實機限制：真正 Steam overlay 成就彈窗與伺服器永久解鎖仍需 Steam client、AppID `4792230` 後台成就 API Name 建好，並從 Steam 啟動正式包驗證。
- 注意：`npm.cmd audit --json` 回報 `electron -> @electron/get -> undici@7.25.0` 有 1 個 high severity advisory；本輪未跑 `npm audit fix`，避免擴大依賴改動。
## 2026-06-19 交接更新：Steam 關閉存檔與商店直式介面

- 本輪遵守 Ponytail 工程規則，只做必要改動，不新增套件，不碰 `engine.js` / `data.js` 數值邏輯。
- 已讓阿扣進行唯讀複核；阿扣建議採同步 Steam Cloud IPC、整張商店卡片可點、Steam 直式商店強制單欄、Electron 視窗禁用玩家手動 resize。本輪由 Codex 單方落檔，避免多 Agent 同檔衝突。
- 修改範圍：`steam-app/main.js`、`steam-app/preload.js`、`js/main.js`、`js/ui.js`、`css/style.css`、`scripts/verify-steam-electron.js`、`CHANGELOG.md`、`SYNC.md`。
- 驗證結果：`node --check`、`git diff --check`、`npm.cmd run steam:verify`、`npm.cmd run steam:i18n:verify`、`npm.cmd run steam:package:verify` 已通過；並以 Playwright/Electron 檢查 675x1200 商店為單欄、三張 `.shop-choice-card` 無內層大型選擇按鈕。
## 2026-06-19 交接更新：盲眼重骰遮蔽修正
- 目標：修正枷鎖「盲眼」在重骰後短暫露出實際骰面點數的 bug。
- 修改：`js/ui.js` 的 `startRerollAnimation()` 現在會讀取 `shackleMeta.blindIndices`；被盲眼選中的骰子在動畫亂數與收尾階段都維持遮蔽圖。
- 範圍：未修改 `engine.js` / `data.js`，沒有新增 i18n 顯示文字。
- 驗證：本次需跑 `node --check js/ui.js`、`npm.cmd run steam:i18n:verify`、`npm.cmd run steam:verify`、`npm.cmd run steam:package:verify`。
## 2026-06-19 交接更新：靈魂奉獻 / 商店 / 收集冊 UI 優化
- 目標：依阿雷指示完成三個介面 polish：靈魂奉獻改用圖片節點、商店改成緊湊整卡選項、收集冊改善與商店類似的卡片擁擠問題。
- 阿扣協作：已再次呼叫 `claude.exe` 做唯讀複核，但 154 秒逾時，未取得可用回覆；本次由 Codex 依既有規範完成，並已在 `CHANGELOG.md` 記錄限制。
- 修改檔案：`js/ui.js`、`css/style.css`、`CHANGELOG.md`、`SYNC.md`，新增 `img/ui/soul_node_on.png`、`img/ui/soul_node_off.png`、`img/ui/soul_node_next.png`。
- 實作重點：靈魂奉獻卡片整張可點擊，等級進度由結晶節點顯示；商店卡片移除舊大型選擇感與多餘留白，portrait 模式刷新按鈕貼近卡片；收集冊三分頁改成緊湊卡片、進度條、portrait 單欄列表。
- 驗證結果：`node --check js/ui.js`、`git diff --check -- js\ui.js css\style.css img\ui\soul_node_on.png img\ui\soul_node_off.png img\ui\soul_node_next.png`、`npm.cmd run steam:i18n:verify`、`npm.cmd run steam:build:full`、`npm.cmd run steam:package:verify` 全部通過；Playwright/Electron 截圖檢查三個介面，確認靈魂節點 20 個、商店 3 張卡無舊「選擇」文字、收集冊 portrait 為單欄。
- 下一步建議：若阿雷接受此版 UI，下一步可做一次實機 Steam client smoke，確認正式 build 內同樣顯示新版介面，再視需要重新 SteamPipe 上傳。
### 2026-06-27 阿正：收斂 Steam 結算卡截圖遺物數量
- **任務目標**：降低 `store_screenshot_09_result_card_1920x1080.png` 的遺物數量與神話遺物比例。
- **修改 `scripts/capture-steam-portrait-screenshots.js`**：使用固定測試存檔配置，通關結算時呈現 15 個遺物，其中僅 1 個神話遺物；停用測試流程中的融合觸發，避免融合替換視窗遮擋成品，並加入 15 個遺物的數量檢查。
- **產出**：重新產生 `promo/steam/assets/store_screenshot_09_result_card_1920x1080.png`；牌型表不列入本次交付調整。
- **驗證**：`node --check scripts/capture-steam-portrait-screenshots.js`、`node scripts/capture-steam-portrait-screenshots.js` 通過；1920x1080 成品目視確認結算卡完整、無遮擋。
### 2026-06-30 交接：Steam Shorts gameplay 動態版 draft
- 已完成四語 gameplay 版 YouTube Shorts draft，位置在 `promo/social/itch-overseas-short/previews/`：
  - `bibi_dice_steam_short_en_gameplay_draft.mp4`
  - `bibi_dice_steam_short_ja_gameplay_draft.mp4`
  - `bibi_dice_steam_short_zh-cn_gameplay_draft.mp4`
  - `bibi_dice_steam_short_zh-tw_gameplay_draft.mp4`
- 宣傳方向已改為「玩家一眼看懂」：前三幕依序呈現 gameplay MP4 背景（擲骰、牌型效果、高傷害），第四幕保留 Steam 願望清單 CTA。
- 新增 `scripts/capture-gameplay-clips.cjs` 重新錄製四語 gameplay 素材；新增 `scripts/prepare-active-gameplay.cjs` 供每次渲染前切換 `assets/gameplay/active/` 素材，避免 HyperFrames 動態 `<video src>` 解析時拿錯語系。
- 驗證狀態：`npm.cmd run check` 通過；四語 contact sheet 已人工檢查，語系與 gameplay 對應正確。HyperFrames 仍提示 `composition_file_too_large` warning，屬短片模板既有單檔偏長問題，未阻擋 render。
- 阿扣狀態：`claude.exe auth status` 顯示登入，但正式協作命令使用 `--max-budget-usd 5.00` 時仍回傳 `401 Invalid authentication credentials`，request_id：`req_011CcXqMkqTMfnmPxmi9XEaa`。