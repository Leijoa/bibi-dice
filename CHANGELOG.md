### 文件：標記 Steam 商店截圖製作人目視通過 [2026/05/24]
* **`SYNC.md`**：新增 2026-05-24 製作人目視確認紀錄，6 張 Steam 商店截圖全部通過，#4 牌型倍率表已確認保留；移除前一筆工作紀錄中的「未涵蓋 Boss 枷鎖」風險描述。
* **`promo/steam/STEAM_RELEASE_CHECKLIST.md`**：第一區「6 張桌面直式截圖排序合理」與「6 張截圖適合全年齡顯示」備註更新為製作人目視確認通過，#4 不再標為待替換。
* **`promo/steam/ASSET_CHECKLIST.md`**：已產出截圖表格新增「製作人確認」欄位，6 張全部標 ✅ OK；「下一步」中的截圖檢查項目劃線標記已完成。

### 素材：重產 Steam 商店截圖最終版 [2026/05/24]
* **`promo/steam/assets/store_screenshot_01~06_*.png`**：執行 `npm.cmd run steam:capture` 重產 6 張 1920×1080 實機截圖，反映 5/23 一系列 UI 更新（全遊戲 emoji 移除、新版鎖定骰紫金發光外框、勝利花灑方向修正、新手教學定位修正、商店融合流程修正、無限塔枷鎖動畫節奏調整）。原版時間戳為 5/19，已不反映最新 UI。
* **內容對照**：#1 標題畫面（無 emoji 按鈕）、#2 戰鬥開局（含 HP、預估傷害、新鎖定骰視覺）、#3 牌型「比比丟八」八同 4,800,000 大爆發、#4 牌型倍率表彈窗（B-04 製作人決定保留）、#5 商店遺物三選一、#6 靈魂奉獻清單。
* **驗證**：`npm.cmd run steam:assets:verify` 通過（15 個必要素材尺寸正確、`library_hero_3840x1240.png` 維持不存在）；6 張目視確認無 emoji 殘留、無血腥、無成人內容、無 UI 跑版、無文字截斷、無彈窗出界。
* **`promo/steam/ASSET_CHECKLIST.md`**：更新已產出截圖區塊註明 5/24 重產與內容變更。
* **`promo/steam/STEAM_RELEASE_CHECKLIST.md`**：第一區「6 張截圖排序合理」與「全年齡顯示」兩項勾選為已完成，註明 #4 為牌型倍率表（依 B-04 決定保留）而非 Boss 枷鎖。

### 文件：整理 Steamworks 後台填寫包 [2026/05/23]
* **`promo/steam/STEAMWORKS_UPLOAD_PACKET.md`**：新增 Steamworks 後台「照表貼上」填寫包，14 區涵蓋 App 基本資訊（名稱 / 開發商 / Privacy Policy URL）、短描述四語、長描述繁中英文 BBCode、關於此遊戲 / 此 Demo、定價（US$2.99 + Demo Free）、支援語言四語、推薦標籤 19 個、AI 生成揭露文字繁中英文、IARC 問卷 10 題答案摘要（含 E-08 Demo / 正式版差異與 E-10 隱私政策連動）、所有 Steam 素材檔案路徑與尺寸（11 張）、SteamPipe Build 上傳（ContentRoot = `dist/steam-windows`、Launch Option = `BIBI-DICE.exe`）、Coming Soon 與 Demo 發布排程、後台填寫順序 22 步。
* **內容來源**：彙整自 `STEAMWORKS_FIELDS_DRAFT.md`、`STEAMPIPE_DEPOT_DRAFT.md`、`STEAM_ASSET_FINAL_AUDIT.md`、`STEAM_RELEASE_CHECKLIST.md`、`STEAM_OWNER_DECISIONS.md`、`PRIVACY_POLICY.md`，並於每節標示「⚠️ 後台動作」區別本機可備妥 vs 需登入後台手動操作的部分。

### 調整：無限塔枷鎖動畫節奏 [2026/05/23]
* **`js/main.js`**：無限塔仍保留每一層的枷鎖效果與枷鎖提示，但枷鎖封印動畫只在無限塔第 3、6、9... 層播放，降低連續爬塔時的節奏干擾；主線關卡枷鎖動畫維持原行為。
* **驗證**：`node --check js/main.js`、`npm.cmd run steam:i18n:verify`、`npm.cmd run steam:package:verify` 通過，已重新建立 `dist/steam-demo` 與 `dist/steam-windows/BIBI-DICE.exe`。

### 修正：商店後融合分解流程與鎖定骰視覺 [2026/05/23]
* **`js/main.js`**：商店購買遺物後若觸發神話遺物上限分解視窗，現在會暫停進入下一關；待玩家完成分解選擇、融合流程全部收尾後，才關閉商店並進入下一關，避免枷鎖動畫與枷鎖訊息插入分解環節。
* **`js/ui.js` / `css/style.css`**：鎖定骰子改為正式 UI 狀態，加入紫金發光外框、半透明遮罩、自製 SVG 小鎖與 `LOCK` 標籤；詛咒鎖定使用紅色變體，提升可讀性且不回復使用 emoji。
* **驗證**：`node --check js/main.js`、`node --check js/ui.js`、`npm.cmd run steam:i18n:verify`、emoji 掃描、`npm.cmd run steam:package:verify` 通過，已重建 `dist/steam-demo` 與 `dist/steam-windows/BIBI-DICE.exe`。

### 修正：勝利花灑方向與全遊戲 emoji 移除 [2026/05/23]
* **`js/ui.js`**：勝利花灑 `shootConfetti()` 改為 `angle: 180`，修正原本往右噴、沒有向上灑出的方向問題。
* **`index.html` / `js/main.js` / `js/ui.js` / `js/i18n.js` / `js/locales/*.js`**：移除遊戲 UI、教學、提示訊息、四語系文字與備援字串中的 emoji，避免視覺上產生廉價或 AI 感；同步移除空掉的按鈕圖示欄位與收集冊勾選符號。
* **`js/ui.js`**：鎖定骰子改保留純色遮罩與既有 SVG 角標；靈魂奉獻等級標記改用 ASCII `I` / `-`；歷史紀錄展開符號改用 `+` / `-`。
* **驗證**：`node --check js/ui.js`、`node --check js/main.js`、`node --check js/locales/zh-tw.js`、`npm.cmd run steam:i18n:verify`、`npm.cmd run steam:package:verify` 通過，已重建 `dist/steam-demo` 與 `dist/steam-windows/BIBI-DICE.exe`。

### 平衡：【混沌法則】枷鎖難度分類由重度改為輕度 [2026/05/23]
* **`js/data.js`**：`chaoslaw` 的 `type` 由 `'heavy'` 改為 `'light'`。原因：實作上只在 postCalc 對調 `tagA` / `tagB` 物件，因最終倍率為乘法（或 `order` 遺物下的加法），交換律使單獨存在時對傷害數值零影響；目前關卡不會同時掛兩個枷鎖，與其他 A/B 區針對型枷鎖（秩序崩壞、孤立無援）的交互不會發生，威脅程度遠低於其他重度枷鎖。

### 修正：Steam Windows 封裝 exe 啟動錯誤 [2026/05/23]
* **`scripts/package-steam-windows.ps1`**：封裝後 `resources/app/package.json` 現在會寫入 `main: "steam-app/main.js"`，修正雙擊 `BIBI-DICE.exe` 時 Electron 預設尋找 `index.js` 而跳出主程序錯誤的問題。
* **`scripts/package-steam-windows.ps1`**：封裝用 package metadata 改為 ASCII `productName: "BIBI DICE"`，避免 Electron 42 在 packaged `package.json` 含中文 `productName` 時發生 access violation。
* **`steam-app/main.js`**：Electron 執行期顯示名稱改由程式明確設定為 `BIBI DICE 比比丟八`，保留中文 app name 與 userData 路徑。
* **`scripts/verify-steam-windows-build.js`**：新增封裝後 `package.json` 的 `main` 欄位檢查，並容忍 UTF-8 BOM。
* **驗證**：`npm.cmd run steam:package:verify` 通過，確認 `BIBI-DICE.exe` 可啟動並保持開啟。

### 工具：新增 Steam Windows portable 打包流程 [2026/05/23]
* **`scripts/package-steam-windows.ps1`**：新增 Windows Steam Build 打包腳本，會先使用既有 Electron runtime 建立 `dist/steam-windows`，再放入 `resources/app/package.json`、`steam-app/` 與 `dist/steam-demo/`，並輸出 `BIBI-DICE.exe`。
* **`scripts/verify-steam-windows-build.js`**：新增封裝後 build 驗證腳本，檢查 `BIBI-DICE.exe`、`resources/app`、Steam Demo 內容與 Electron runtime，並啟動 exe 做煙霧測試。
* **`package.json`**：新增 `steam:package` 與 `steam:package:verify` 指令，可一鍵重建 Demo、打包 Windows build 並驗證。
* **`promo/steam/STEAMPIPE_DEPOT_DRAFT.md` / `promo/steam/STEAM_RELEASE_CHECKLIST.md`**：更新 SteamPipe ContentRoot 為 `dist/steam-windows`，Launch Option 為 `BIBI-DICE.exe`，避免誤把純 web 輸出 `dist/steam-demo` 上傳到 Steam。
* **驗證**：`npm.cmd run steam:package:verify` 通過，確認 `dist/steam-windows/BIBI-DICE.exe` 可啟動且不會立即崩潰。

### 文件：發布 Steam 隱私政策正式檔 [2026/05/23]
* **`promo/steam/PRIVACY_POLICY.md`**：將隱私政策草稿轉為正式公開文件，補入公開聯絡信箱 `leijoalion@gmail.com`，並移除草稿狀態與發布前待填項。
* **`promo/steam/STEAM_RELEASE_CHECKLIST.md` / `promo/steam/STEAMWORKS_FIELDS_DRAFT.md` / `promo/steam/STEAMWORKS_ONBOARDING_FLOW.md`**：統一將 Steamworks Privacy Policy URL 指向 GitHub 公開頁面 `https://github.com/Leijoa/bibi-dice/blob/main/promo/steam/PRIVACY_POLICY.md`。
* **`SYNC.md`**：更新 E-10 狀態為隱私政策已完成、待填入 Steamworks 後台；補記 itch.io 頁面仍需登入後台手動加入連結。

### 文件：新增 Steam 隱私政策草稿 [2026/05/22]
* **`promo/steam/PRIVACY_POLICY_DRAFT.md`**：新增繁中 / 英文雙語隱私政策草稿，涵蓋目前 Demo 本機存檔、未來可能收集匿名或彙整遊玩數據、Steam 平台資料分工、資料用途、保存與刪除、第三方服務、兒童隱私與政策更新。
* **`promo/steam/STEAM_RELEASE_CHECKLIST.md` / `promo/steam/STEAMWORKS_FIELDS_DRAFT.md` / `promo/steam/STEAMWORKS_ONBOARDING_FLOW.md`**：將 E-10 隱私政策狀態從缺頁面更新為草稿完成、待製作人發布公開 URL。
* **`SYNC.md`**：同步更新 E-10 待處理狀態，標記「撰寫草稿」已完成，但仍需製作人補公開聯絡信箱、發布公開頁面並回填 Steamworks Privacy Policy URL。

### 工具：新增 i18n 四語系自動驗證並修補日文缺漏 [2026/05/21]
* **`scripts/verify-i18n.js`**：新增 i18n 驗證腳本，遞迴展平四語系所有 key 並以 `zh-tw` 為基準比對，回報缺失 key、空值 key、多餘 key 與總數。
* **`package.json`**：新增 `steam:i18n:verify` 指令。
* **`js/locales/ja.js`**：補入缺漏的 2 個 key — `messages.extremist_zone_note` =「{0} Dゾーン x{1}」、`messages.scale_apex_order_note` =「{0} 絶対秩序倍率 x{1}」。
* **驗證結果**：zh-tw / zh-cn / en / ja 四語系各 601 個 key 完全對齊。
* **`promo/steam/STEAM_RELEASE_CHECKLIST.md`**：第一區 i18n 確認項勾選通過。

### 文件：新增 Steamworks 後台 9 階段流程表 [2026/05/21]
* **`promo/steam/STEAMWORKS_ONBOARDING_FLOW.md`**：新增 Steamworks 後台流程表，分 9 階段（登入前準備、帳號 / 稅務 / 銀行、付 App Fee 建立 App、填寫商店頁、上傳素材、IARC / AI 揭露 / 隱私政策、建立 Demo App、本機 SteamPipe、送審與發布），含預計耗時、阻塞點、整體甘特圖、阻塞依賴清單、必死注意事項（30 天 App 冷卻期、隱私政策、截圖實機限制等）。

### 素材：重產 Store / Library Capsule D8 修正版 [2026/05/21]
* **`promo/steam/source/key_art_d8_banner.png` / `key_art_d8_portrait.png`**：依製作人提供的原主視覺、遊戲內藍色八面骰與真實 D8 參考，生成 Steam 專用 D8 主視覺源圖，修正角色手上骰子不真實的問題。
* **`scripts/generate-steam-capsules.js` / `scripts/generate-steam-library-assets.js`**：Store / Library Capsule 改用 D8 修正版源圖，並降低過重暗化層與 Library 暗角；Library Logo 擷取仍保留原主視覺美術字來源。
* **`promo/steam/assets/`**：重產 `store_header_capsule_920x430.png`、`store_small_capsule_462x174.png`、`store_main_capsule_1232x706.png`、`store_vertical_capsule_748x896.png`、`library_capsule_600x900.png`、`library_header_capsule_920x430.png` 六張 D8 修正版素材。
* **文件同步**：更新 `SYNC.md`、`ASSET_CHECKLIST.md`、`STEAM_ASSET_FINAL_AUDIT.md`、`STEAM_RELEASE_CHECKLIST.md`、`STEAMWORKS_FIELDS_DRAFT.md`，將 F-01/02/04~07 色澤偏暗問題標記為已重產修正版，並補入 AI 揭露文字中的 Steam Capsule 修正版說明。
* **製作人確認**：2026-05-21 製作人已確認六張 D8 修正版 Store / Library Capsule 沒有問題，可作為上傳 Steamworks 的版本。
* **驗證**：`node --check scripts/generate-steam-capsules.js`、`node --check scripts/generate-steam-library-assets.js`、`npm.cmd run steam:capsules`、`npm.cmd run steam:library`、`npm.cmd run steam:assets:verify` 全部通過。

### 素材：重生 favicon 與 Steam Icon 修正版 [2026/05/21]
* **`favicon.png`**：將舊版藍色花體 B icon 替換為暗紫霓虹水晶骰子 icon，中央保留清楚的 8 字樣，更貼近 `BIBI DICE 比比丟八` 目前 Steam 主視覺。
* **`promo/steam/assets/shortcut_icon_256x256.png` / `app_icon_184x184.jpg`**：由新版 favicon 重產 256×256 Shortcut Icon 與 184×184 App Icon，修正 F-08/F-09「由舊 favicon 縮放導致品質不足」問題。
* **`promo/steam/STEAM_ASSET_FINAL_AUDIT.md` / `ASSET_CHECKLIST.md` / `STEAM_RELEASE_CHECKLIST.md` / `STEAMWORKS_FIELDS_DRAFT.md`**：同步更新 Icon 狀態與 AI 生成素材揭露文字，明確標示新版 favicon / App icon 含 AI 生成。
* **驗證**：`npm.cmd run steam:assets:verify` 通過，15 個必要 Steam 素材尺寸皆正確，`library_hero_3840x1240.png` 維持不存在。

### 文件：補填 Steam 上架第二輪製作人決策 [2026/05/21]
* **`.gitignore`**：依 C-05 加入 `steam-build/`，避免內含真實 AppID / DepotID 的 VDF 與密碼意外提交。
* **`promo/steam/STEAMWORKS_FIELDS_DRAFT.md`**：第 1 區填入 A-01/A-02 開發商「雷爪獅」與 A-07 URL `https://leijoa.itch.io/bibi-dice`；第 8 區 D-04 確認 favicon 為 AI 生成（製作人指派鑀韻東重生）；第 10 區清理已決定欄位、加入 C-03/04/05 與 D-04 結論。
* **`promo/steam/STEAM_RELEASE_CHECKLIST.md`**：Developer / Publisher 名稱勾選為已決定（雷爪獅）。
* **`promo/steam/STEAMPIPE_DEPOT_DRAFT.md`**：第 3 區加註 C-03 先進 internal branch；Step 2 加註 C-05 `steam-build/` 已加入 .gitignore；Step 4 加註 C-04 製作人本人 SetLive；第 6 區更新規範說明。
* **`promo/steam/STEAM_ASSET_FINAL_AUDIT.md`**：F-08/F-09 原先標註 favicon 重生由鑀韻東處理；後續已於同日完成重生與 Icon 重產。
* **`SYNC.md`**：4 個製作人決定項移到「已處理問題」；新增 1 項待處理（鑀韻東 favicon 重生任務）。

### 文件：依製作人決策同步 Steam 上架四份文件 [2026/05/21]
* **`promo/steam/STEAMWORKS_FIELDS_DRAFT.md`**：依 `STEAM_OWNER_DECISIONS.md` 製作人填寫的決策，更新第 1 區（A-03/04/05/06/08 已定，A-01/02/07 標待釐清；商店繁中名改為純「比比丟八」）、第 5 區（核心 10 個 + 製作人新增「小遊戲」「僅滑鼠」+ 備用 7 個 = 19 個）、第 8 區（D-01/02/03 主視覺類為 AI 生成、D-05/06 部分、D-07 商店截圖否，附中英文揭露文字草稿）、第 9 區（IARC 答案，E-10 觸發隱私政策需求）、第 10 區（重整為已決定 / 待釐清兩段）。
* **`promo/steam/STEAM_RELEASE_CHECKLIST.md`**：第二區依製作人決定勾選 9 項（定價、標籤、語言、IARC 部分、AI 揭露、Library Hero、Page Background、Trailer、Coming Soon 時程）；Developer/Publisher 仍待最終選定。
* **`promo/steam/STEAM_ASSET_FINAL_AUDIT.md`**：第二區改為製作人目視結果 — F-03 Library Logo 與 F-10 截圖通過；F-01/02/04~07 共 6 張 Capsule 色澤偏暗退回；F-08/09 Icon 需重新設計。新增待處理動作說明。
* **`SYNC.md`**：新增 7 項待處理問題（色澤、Icon、A-01 三選一、itch.io URL、C-03~05、D-04 揭露、E-10 隱私政策），記錄本次同步工作。

### 文件：定案 Steam Coming Soon 與 Demo 發布排程 [2026/05/21]
* **`SYNC.md`**：新增 Steam 目標排程，明確記錄 2026-06-01 前完成素材 / 文案 / Build、2026-06-03 送審、2026-06-10 目標公開 Coming Soon、2026-07-01 目標發布 Demo。
* **`promo/steam/STEAM_OWNER_DECISIONS.md`**：填入 C-01 Coming Soon 公開日期 `2026-06-10` 與 C-02 Demo 預定發布日期 `2026-07-01`。
* **`promo/steam/STEAM_RELEASE_CHECKLIST.md`**：標記 Coming Soon 頁公開時機已決定，並更新 Build / 審核 / 發布節點。
* **`promo/steam/STEAMWORKS_FIELDS_DRAFT.md`**、**`promo/steam/STEAMPIPE_DEPOT_DRAFT.md`**：同步寫入目標排程，並註明 Coming Soon 公開至 Demo 發布間隔 21 天，符合至少 2 週要求。

### 修正：Store Capsule 移除遮擋中文 Logo 的英文疊字 [2026/05/21]
* **`scripts/generate-steam-capsules.js`**：移除額外產生的英文 `BIBI DICE` 標題與 `bibi-dice` 膠囊副標，避免重新遮住主視覺中的中文 Logo。
* **`promo/steam/assets/`**：重產 `store_header_capsule_920x430.png`、`store_small_capsule_462x174.png`、`store_main_capsule_1232x706.png`、`store_vertical_capsule_748x896.png` 四張 Store Capsule 修正版。
* **`SYNC.md` / `promo/steam/STEAM_ASSET_FINAL_AUDIT.md`**：補記此踩雷規則，明確標示 `steam:capsules` 不可再額外疊英文文字層，且素材尺寸驗證不能取代目視遮擋檢查。

### 文件：新增製作人 Steam 上架決策清單 [2026/05/21]
* **`promo/steam/STEAM_OWNER_DECISIONS.md`**：新增製作人專屬決策清單，分八區集中整理所有需製作人親自決定的 Steam 上架欄位：建立 App 前（開發商、發行商、顯示名稱、官網、App Fee）、商店頁送審前（售價、標籤、截圖第 4 張、Page Background、Trailer、系統需求、文案）、Demo 發布前（Coming Soon 日期、Demo 日期、branch 流程）、AI 生成素材揭露 7 項待確認、IARC 年齡分級問卷 10 題、素材目視確認 10 項、可延後到正式版 10 項、第 8 區提供決策回覆格式範例。每項標註「決定後需同步到」對應文件位置，避免決策後在多份文件遺漏更新。

### 工具：新增 Steam 素材完整性自動驗證 [2026/05/21]
* **`scripts/verify-steam-assets.js`**：新增 Steam 素材驗證腳本，檢查 Store Capsule、Store Screenshot、Library Asset、Shortcut Icon、App Icon 共 15 個必要素材是否存在且尺寸符合文件規格。
* **`scripts/verify-steam-assets.js`**：加入禁止素材檢查，確認 `library_hero_3840x1240.png` 不存在，避免重新混入已決定停用的 Library Hero。
* **`package.json`**：新增 `steam:assets:verify` 指令，可一鍵執行素材完整性與尺寸檢查。
* **`promo/steam/STEAM_ASSET_FINAL_AUDIT.md`**：補充素材自動驗證指令與使用時機。
* **`promo/steam/STEAM_RELEASE_CHECKLIST.md`**：標記 Steam 素材檔案完整性與尺寸自動驗證已通過。
* **`promo/steam/CLAUDE_STEAM_DECISIONS_TASK.md`**：新增阿扣並行任務指令，要求整理製作人必須親自決定的 Steam 上架欄位清單。

### 文件：新增 SteamPipe / Depot 上傳草案 [2026/05/21]
* **`promo/steam/STEAMPIPE_DEPOT_DRAFT.md`**：新增 SteamPipe / Depot 上傳操作草案，分八區：上傳前提條件、Demo Build 來源與重建指令、Depot/Branch 命名建議、Windows 上傳流程（含 `app_build_demo.vdf` 與 `depot_build_demo.vdf` 範本）、上傳後 Steamworks 後台檢查項目、製作人專屬事項（含後台與本機）、可能失敗點與排查建議（A 登入、B 上傳、C ContentRoot、D 啟動、E 審核退回）、正式執行前檢查清單。所有 AppID / DepotID / 帳號密碼均以占位符標示，無假資料。

### 素材：補齊缺失的 Steam Store Capsule [2026/05/21]
* **`promo/steam/assets/`**：執行 `npm.cmd run steam:capsules` 重產 `store_header_capsule_920x430.png`、`store_small_capsule_462x174.png`、`store_main_capsule_1232x706.png`、`store_vertical_capsule_748x896.png`，補齊阿扣素材盤點時發現的必要商店圖片缺口。
* **`promo/steam/STEAM_ASSET_FINAL_AUDIT.md`**：更新素材盤點，將 Store Capsule 四張移入可上傳素材清單，並標記缺口已修正。
* **`promo/steam/STEAM_RELEASE_CHECKLIST.md`**：標記小膠囊 Logo 可讀性檢查已通過。
* **`promo/steam/CLAUDE_STEAMPIPE_DRAFT_TASK.md`**：新增阿扣並行任務指令，要求只整理 SteamPipe / Depot 上傳草案，不執行 steamcmd、不修改程式與素材。

### 文件：新增 Steam 素材最終盤點 [2026/05/20]
* **`promo/steam/STEAM_ASSET_FINAL_AUDIT.md`**：新增素材最終盤點文件，分七區整理：可直接上傳素材（截圖 6 張、icon 2 個）、需目視確認素材（Library 三張、截圖第 4 張、icon 品質）、暫不製作素材（Library Hero、宣傳合成圖）、缺口素材（Store Capsule 四張實際缺失、建議重產）、截圖排序建議（第 4 張可評估替換為 Boss 枷鎖）、全年齡顯示風險檢查（無風險）、AI 生成素材揭露提醒（原始美術來源需製作人確認）。
* **重要發現：** `store_header_capsule_920x430.png`、`store_small_capsule_462x174.png`、`store_main_capsule_1232x706.png`、`store_vertical_capsule_748x896.png` 四張 Store Capsule 實際不在 `promo/steam/assets/` 目錄中，需執行 `npm.cmd run steam:capsules` 重產。

### 工具：擴充 Electron 解析度與存檔重開驗證 [2026/05/20]
* **`scripts/verify-steam-electron.js`**：擴充 `steam:verify`，新增 small `450x800`、medium `540x960`、large `675x1200` 三段直式解析度切換驗證，並確認 large 模式會套用 `steam-portrait-large`。
* **`scripts/verify-steam-electron.js`**：新增 Electron 重開後 localStorage 持久化驗證，使用臨時 sentinel key 寫入、關閉、重開、讀回並清除，確認 Steam 桌面殼存檔路徑可保留資料。
* **`promo/steam/STEAM_RELEASE_CHECKLIST.md`**：標記三段解析度切換、離線本機 protocol、重開後存檔讀取已通過。
* **`promo/steam/CLAUDE_ASSET_AUDIT_TASK.md`**：新增阿扣並行任務指令，要求只做 Steam 素材最終檢查與缺口文件盤點，不修改程式與圖片素材。

### 文件：新增 Steamworks 後台欄位草稿 [2026/05/20]
* **`promo/steam/STEAMWORKS_FIELDS_DRAFT.md`**：新增 Steamworks 後台欄位草稿，涵蓋：App 名稱與基本資訊、短描述（四語）、長描述（繁中與英文 BBCode）、Demo 頁面描述、推薦 Steam 標籤（核心 10 個與備用 7 個）、支援語言建議、系統需求（Windows 最低與建議規格）、AI 生成素材揭露待確認清單、IARC 年齡分級問卷待確認事項、仍需製作人決定欄位一覽，以及後台填寫順序建議。

### 修正：Electron 執行期 app 名稱與 userData 路徑 [2026/05/20]
* **`steam-app/main.js`**：新增 `app.setName()`，從 `package.json` 讀取 `productName` / `name`，確保 Electron 執行期 appName 與 userData 路徑不再落到預設 `Electron`。
* **`scripts/verify-steam-electron.js`**：新增 Electron 自動驗證腳本，檢查 `dist/steam-demo`、`bibi://` 協定、`540x960` 視窗、`steam-portrait` class、appName 與 userData 路徑。
* **`package.json`**：新增 `steam:verify` 指令，可一鍵重建 Steam Demo 並執行 Electron 基礎驗證。
* **`promo/steam/STEAM_RELEASE_CHECKLIST.md`**：新增 Electron 驗證紀錄，標記 build、離線協定、視窗尺寸、appName 與 userData 路徑已通過。
* **`promo/steam/CLAUDE_STEAMWORKS_FIELDS_TASK.md`**：新增阿扣並行任務指令，要求只整理 Steamworks 欄位草稿，避免與 Electron 驗證工作衝突。

### 修正：補齊 package.json Electron app 命名欄位 [2026/05/20]
* **`package.json`**：新增 `"name": "bibi-dice"`、`"productName": "BIBI DICE 比比丟八"`、`"version": "0.1.0"`，讓 Electron 以正確名稱建立 `userData` 存檔路徑，避免預設落到 `%APPDATA%\Electron\` 導致存檔路徑混淆。

### 文件：補強 AI 協作問題追蹤規則 [2026/05/20]
* **`SYNC.md`**：新增「待處理問題」與「已處理問題」區塊，要求 AI 發現問題時即使尚未修正也必須記錄，已修正問題則需註明完成日期與處理方式。
* **`SYNC.md`**：補入阿扣發現的 `package.json` 缺少 `name`、`productName`、`version` 欄位問題，標記為待處理。
* **`SYNC.md`**：更新工作後紀錄格式，新增「發現的問題」、「預計但尚未執行的修改」、「已完成問題」欄位。

### 文件：新增 Steam 上架前檢查表 [2026/05/20]
* **`promo/steam/STEAM_RELEASE_CHECKLIST.md`**：新增 Steam 上架前完整檢查表，分三區：一、現在就能補（素材確認、Build 驗證、i18n）；二、需製作人決定（定價、標籤、年齡分級、AI 素材揭露、Library Hero、Page Background、Trailer、Coming Soon 時機、開發商名稱）；三、Steamworks 後台才能做（建立 App、填寫商店頁、素材上傳、Build 上傳與送審流程）。
* **`SYNC.md`**：更新下一步建議，標記 STEAM_RELEASE_CHECKLIST.md 已完成，列出後續優先驗證項目。

### 文件：新增 AI 協作同步入口 [2026/05/20]
* **`SYNC.md`**：新增專案根目錄 AI 協作同步入口，規定所有 AI Agent 開工前需先讀 `SYNC.md`、`AGENTS.md`、`CHANGELOG.md`，並在工作後更新同步進度。
* **`SYNC.md`**：整理目前 Steam 桌面直式小遊戲方向、已完成素材與工具、下一步上架檢查表工作、禁止誤用素材與踩雷紀錄。

### 修正：Library Logo 改用主視覺美術字 [2026/05/20]
* **`scripts/generate-steam-library-assets.js`**：`library_logo_1280x720.png` 改為從 `img/home_bg.webp` 擷取既有美術 Logo，取代普通系統字產生的 Logo 草稿。
* **`promo/steam/ASSET_CHECKLIST.md`**：更新 Library Logo 來源說明，標記為主視覺美術字擷取版。

### 修正：停止產出錯誤 Steam Library Hero 並修正 Logo 字樣 [2026/05/20]
* **`scripts/generate-steam-library-assets.js`**：移除 `library_hero_3840x1240.png` 產出，避免重跑素材腳本時重新生成與遊戲關聯不足的 Hero 圖。
* **`scripts/generate-steam-library-assets.js`**：修正 `library_logo_1280x720.png` 中文字樣，由錯誤的「比比丟人」改為正確的「比比丟八」。
* **`promo/steam/ASSET_CHECKLIST.md`**：將 Library Hero 狀態改為暫不產出，並移除已產出清單中的錯誤 Hero 項目。

### 修正：移除 Steam Library 素材英文字遮擋中文主視覺 [2026/05/20]
* **`scripts/generate-steam-library-assets.js`**：Library Capsule 與 Library Header 改為保留原中文主視覺，不再額外疊上英文 `BIBI DICE`。
* **`scripts/generate-steam-library-assets.js`**：Library Logo 改為透明中文 Logo 草稿，避免在 Steam Library Details 中以英文標題遮住中文視覺。
* **`scripts/generate-steam-library-assets.js`**：Shortcut Icon 與 App Icon 改為直接由 `favicon.png` 轉尺寸，不再加額外裝飾。
* **`promo/steam/assets/`**：重產 Library 與 icon 六張素材。

### 素材：產出 Steam Library 與 App Icon 第一版 [2026/05/20]
* **`scripts/generate-steam-library-assets.js`**：新增 Steam Library 與 icon 產圖腳本，使用 Playwright 產出 Library Capsule、Library Header、Library Hero、透明 Library Logo、Shortcut Icon 與 App Icon。
* **`package.json`**：新增 `steam:library` 指令，可重跑 Steam Library 與 icon 產圖流程。
* **`promo/steam/assets/`**：新增 `library_capsule_600x900.png`、`library_header_capsule_920x430.png`、`library_hero_3840x1240.png`、`library_logo_1280x720.png`、`shortcut_icon_256x256.png`、`app_icon_184x184.jpg`。
* **`promo/steam/ASSET_CHECKLIST.md`**：更新 Library Assets 與 Icon 狀態，並補充 Library Hero 不含 Logo 或額外文字的注意事項。

### 素材：產出 Steam Store Capsule 第一版 [2026/05/19]
* **`scripts/generate-steam-capsules.js`**：新增 Steam capsule 產圖腳本，使用 Playwright 依現有主視覺產出 Header、Small、Main、Vertical 四種 store capsule。
* **`package.json`**：新增 `steam:capsules` 指令，可重跑 Steam capsule 產圖流程。
* **`promo/steam/assets/`**：新增 `store_header_capsule_920x430.png`、`store_small_capsule_462x174.png`、`store_main_capsule_1232x706.png`、`store_vertical_capsule_748x896.png`。
* **`promo/steam/ASSET_CHECKLIST.md`**：更新 Store Capsule 狀態與已產出檔案清單。

### 素材：重做 Steam 桌面直式商店截圖 [2026/05/19]
* **`scripts/capture-steam-portrait-screenshots.js`**：新增 Playwright 截圖腳本，會從實際 Steam Demo 流程擷取直式遊戲畫面，並輸出成 1920x1080 的 Steam 商店截圖展示版。
* **`scripts/capture-steam-portrait-screenshots.js`**：截圖前會清除舊橫版截圖檔名，避免 `promo/steam/assets/` 同時混入過期素材。
* **`package.json`**：新增 `steam:capture` 指令，會先重建 `dist/steam-demo`，再產出 6 張桌面直式展示截圖。
* **`promo/steam/assets/`**：更新 6 張 `store_screenshot_*_1920x1080.png`，內容改為直式桌面視窗置於 16:9 商店截圖畫布。
* **`promo/steam/ASSET_CHECKLIST.md`**：更新 screenshot 狀態與清單，標記橫版截圖已由桌面直式展示版取代。

### 工具：新增 Steam 桌面直式 App 外殼 [2026/05/19]
* **`package.json` / `package-lock.json`**：新增 `electron` 開發依賴與 `steam:build`、`steam:app`、`steam:app:dev` 指令，讓 Steam 版可用桌面視窗啟動。
* **`steam-app/main.js`**：新增 Electron 主程序，預設開啟 `540 x 960` 直式視窗，保留 `450 x 800`、`540 x 960`、`675 x 1200` 三種解析度選單，並固定 9:16 視窗比例。
* **`steam-app/preload.js`**：新增 Steam portrait 尺寸 class 橋接，讓大視窗模式可切換 `steam-portrait-large` 並觸發遊戲縮放重算。
* **`css/style.css`**：補上 Steam portrait 專用 modal 高度限制，讓牌型表等彈窗在 540x960 桌面殼中不會超出視窗。

### 方向：Steam 版改為桌面直式小遊戲 [2026/05/19]
* **`promo/steam/STEAM_DESKTOP_PORTRAIT_STRATEGY.md`**：新增 Steam 桌面直式小遊戲策略，將產品定位改為固定直式視窗、可切換直式解析度、不承諾 Steam Deck、建議售價 US$2.99 的輕量桌面小品。
* **`scripts/publish-steam-demo.ps1`**：Steam Demo 輸出改注入 `steam-portrait` class，並移除可能殘留的 `steam-layout` class，避免繼續套用橫版三欄 UI。
* **`css/style.css`**：新增 `body.steam-portrait` 桌面直式外框樣式，維持原本 450x800 遊戲容器與直式比例。
* **`js/ui.js`**：Steam portrait 模式下依 CSS 變數限制最大縮放倍率，預設對應 `540 x 960`，避免大螢幕預覽時把手機 UI 過度放大。
* **`promo/steam/STEAM_LANDSCAPE_UI_V2_LAYOUT.md`**：標記橫版 V2 草案為探索紀錄，不再作為主要實作路線。

### 文件：新增 Steam 橫版 UI V2 配置草案 [2026/05/19]
* **`promo/steam/STEAM_LANDSCAPE_UI_V2_LAYOUT.md`**：新增 V2 配置草案，整理首頁按鈕偏右、戰鬥畫面空乏、敵人血量位置不自然，以及 toast、傷害數字、牌型浮現、碎紙花等彈出物定位問題。
* **`promo/steam/STEAM_LANDSCAPE_UI_V2_LAYOUT.md`**：提出首頁下方中央操作列、上方 Enemy Stage、中央 Dice Board、右側 Battle Readout 的推薦方向，並規劃 Phase 2A 到 Phase 2D 的實作順序。

### 修復：Steam 橫版首頁與牌型表層級 [2026/05/19]
* **`index.html`**：修復 HTML 被 UTF-8 讀寫破壞後造成的標籤斷裂與首頁結構錯亂，並保留 Steam Demo 所需的本地 `css/tailwind.min.css` 與 `js/vendor/confetti-lite.js`。
* **`css/style.css`**：調整 `body.steam-layout` 首頁排版，讓標題畫面在 Steam 橫版中使用右側操作面板，並在首頁狀態隱藏戰鬥 header 與 main，避免互相覆蓋。
* **`css/style.css`**：提高牌型表 modal 層級並固定關閉按鈕尺寸，避免 Steam 橫版畫面中關閉按鈕被遮住或擠出視窗。
* **`css/style.css`**：精修 Steam 戰鬥畫面的敵人欄、骰盤、分數欄比例，讓骰子維持穩定正方形尺寸並提高右側資訊欄可讀性。

### UI：建立 Steam 橫版版型第一階段骨架 [2026/05/18]
* **`promo/steam/STEAM_LANDSCAPE_UI_SPEC.md`**：補充參考稿採用與不採用項目，明確採用 Top Bar、三欄戰鬥、中央骰盤、商店商品 grid 與底部行動列，並排除大型 SideNav、外部 CDN icon/font、AI 商品大圖與硬編碼文字。
* **`css/style.css`**：新增 `body.steam-layout` 橫版骨架，讓 Steam 版戰鬥畫面形成左側敵人資訊、中間骰盤操作、右側分數與遺物資訊的三欄布局，並加入 Steam Deck 尺寸下的緊湊版欄寬。
* **`css/style.css`**：新增 Steam 版商店橫版 overlay，顯示商品 grid 與底部操作列，並在 Steam 版重新顯示「前往下一關」按鈕。
* **`scripts/publish-steam-demo.ps1`**：Steam Demo 輸出後自動替 `index.html` 的 `<body>` 注入 `steam-layout` class，避免影響原始手機版與 itch.io 版。
* **`js/main.js`**：規則彈窗按鈕綁定新增節點存在檢查，避免 Steam 橫版驗證時因缺少關閉按鈕節點而拋出 page error。

### 文件：新增 Steam 橫版 UI 規格草案 [2026/05/18]
* **`promo/steam/STEAM_LANDSCAPE_UI_SPEC.md`**：新增 Steam 橫版 UI 規格草案，定義 PC、Steam Deck 目標解析度、戰鬥三欄布局、商店橫版化、Modal 規格、截圖重抓需求與分階段實作建議。

### 素材：產出 Steam 商店頁實機截圖 [2026/05/18]
* **`promo/steam/assets/`**：使用 Playwright 以 `1920x1080` 視窗實際載入 Steam Demo，產出 6 張 Steam 商店頁截圖，涵蓋標題畫面、戰鬥開局、牌型傷害預覽、商店遺物、Boss 枷鎖與靈魂奉獻。
* **`promo/steam/ASSET_CHECKLIST.md`**：更新 Steam screenshot 狀態與已產出檔案清單，確認 6 張截圖皆為 `1920x1080`。

### 文件：整理 Steam Demo 商店頁素材與正式版承諾範圍 [2026/05/18]
* **`promo/steam/STEAM_STORE_BRIEF.md`**：新增 Steam 商店頁文案 brief，整理產品定位、短描述、長版介紹骨架、Demo 頁面可寫內容與正式版文案邊界。
* **`promo/steam/ASSET_CHECKLIST.md`**：新增 Steam 素材檢查表，列出 store capsule、截圖、icon、library assets 的官方尺寸、目前素材來源與缺口。
* **`promo/steam/FULL_VERSION_SCOPE.md`**：新增 Demo / 正式版承諾範圍文件，明確切分 Demo 已包含內容、正式版可承諾方向與暫不承諾項目。

### 工具：新增 Playwright 瀏覽器驗證環境 [2026/05/18]
* **`.gitignore`**：解除 `package.json` 與 `package-lock.json` 的忽略規則，讓瀏覽器驗證與 Tailwind 建置工具可以被版本控管；`node_modules/` 仍維持忽略。
* **`package.json` / `package-lock.json`**：新增 `playwright`、`tailwindcss` 與 `@tailwindcss/cli` 開發工具依賴，讓 Steam Demo 可用本地瀏覽器自動化驗證，並保留 Tailwind 本地建置流程。
* **`scripts/publish-itch.ps1` / `scripts/publish-steam-demo.ps1`**：將 `package.json` 與 `package-lock.json` 排除於發佈輸出外，避免開發工具 manifest 混入玩家下載包。
* **驗證流程**：安裝 Chromium 測試核心後，已用 Playwright 載入 `dist/steam-demo/index.html`，確認標題畫面、新遊戲按鈕與語言選單正常顯示，且沒有 console error、page error 或 failed request。

### 工具：Steam Demo 離線化第一階段 [2026/05/18]
* **`index.html`**：移除 Tailwind CDN 與 canvas-confetti CDN，改載入本地 `css/tailwind.min.css` 與 `js/vendor/confetti-lite.js`，讓 Steam Demo 不依賴外部腳本。
* **`css/style.css`**：移除 Google Fonts `@import`，改用系統字型 fallback，避免離線環境發生字型請求。
* **`css/tailwind-input.css` / `css/tailwind.min.css`**：改用 Tailwind v4 本地建置流程，將 `index.html` 與 `js/**/*.js` 中使用的 utility class 編入本地 CSS。
* **`scripts/publish-steam-demo.ps1`**：新增輸出後的外部 runtime 依賴檢查，若偵測到 CDN、外部 script/link、Google Fonts 或 CSS 外部 url 會顯示警告。

### 工具：建立 itch.io 與 Steam Demo 發佈輸出結構 [2026/05/18]
* **`.gitignore`**：新增 `dist/` 忽略規則，避免發佈輸出資料夾被誤提交。
* **`scripts/publish-itch.ps1`**：將預設輸出資料夾改為 `dist/itch`，並排除 `promo/`、`dist/` 與發佈入口檔，讓 itch.io 上傳內容維持乾淨。
* **`scripts/publish-steam-demo.ps1` / `publish-steam-demo.cmd`**：新增 Steam Demo 輸出腳本，會產生 `dist/steam-demo`，保留遊戲執行必要檔案並排除開發、宣傳工程與文件檔案。

### Feat：新增中文版宣傳影片工程 [2026/05/18]
* **`promo/bibi-dice-cn-promo/index.html`**：新增 25 秒中文版宣傳影片工程，包含開場、骰子構築、遺物融合、Boss 枷鎖與 CTA 收束五段式節奏。
* **`promo/bibi-dice-cn-promo/assets/`**：新增自製宣傳素材圖與程式合成音軌，供影片工程引用。
* **`promo/bibi-dice-cn-promo/generate-audio.js`**：新增 25 秒宣傳片音軌生成腳本，可重新產出 `promo-score.wav`。
* **`promo/bibi-dice-cn-promo/README.md`**：新增影片工程說明與 HyperFrames 預覽/輸出指令。
* **`promo/bibi-dice-cn-promo/renders/bibi-dice-cn-promo.mp4`**：輸出 25 秒高品質 MP4 宣傳影片成品。

### 修復：轉換 itch.io Banner 為合法 PNG [2026/05/18]
* **`img/itch_banner.png`**：將原本僅改副檔名的 WebP 檔重新輸出為真正 PNG 格式，避免 itch.io 後台上傳時因檔案格式與副檔名不一致而拒收。

### 資產：新增 itch.io 橫式 Banner 主視覺 [2026/05/18]
* **`img/itch_banner.webp`**：新增橫式宣傳 Banner，將比比與白獅夥伴重新構圖進寬版主視覺，保留紫黑高塔、發光骰子與奇幻鎖鏈氛圍，供 itch.io 頁面橫幅使用。

### 調整：放大枷鎖封鎖動畫鏈條尺寸 [2026/05/18]
* **`css/style.css`**：放大枷鎖進場動畫的交叉鏈條與單節鏈環尺寸，增加鏈環重疊距離與中央封印大小，讓封鎖畫面更有壓迫感與魄力。

### 調整：枷鎖封鎖動畫改為鏈環式鎖鏈 [2026/05/18]
* **`js/ui.js`**：`playShackleSealAnimation()` 的兩條鎖鏈改由 9 個 `.shackle-link` 鏈環組成，替代原本單一金屬條狀 span。
* **`css/style.css`**：重寫 `.shackle-chain` 視覺，使用橢圓金屬鏈環、交錯旋轉、重疊扣合、內孔陰影與高光，讓封鎖動畫更接近實際鎖鏈。

### Feat：枷鎖關卡進場封鎖動畫 [2026/05/17]
* **`js/main.js`**：調整 `loadStage()` 的枷鎖關卡進場時序；新進入枷鎖關卡時先播放封鎖動畫，再顯示枷鎖效果 toast，toast 結束後才呼叫 `startTurn()` 開始第一擲，避免枷鎖提示與擲骰同時發生。
* **`js/ui.js`**：新增 `playShackleSealAnimation(callback)`，以一次性全畫面 overlay 呈現兩條鎖鏈交叉封鎖與中央封印衝擊，動畫結束後自動移除並銜接 callback。
* **`js/audio.js`**：新增 `playShackleSealSound()`，使用既有合成音系統播放低頻金屬封鎖音效，不新增音訊檔。
* **`css/style.css`**：新增 `.shackle-seal-overlay`、交叉鎖鏈、封印核心、暗紅閃光與對應 keyframes；動畫期間 overlay 會暫時阻擋底層點擊，避免玩家在演出中誤操作。

### Fix：精簡消耗品購買與發動 toast 訊息 [2026/05/17]
* **`js/main.js`**：重整 `window.buyItem` 的消耗品 toast 流程，消耗品選擇後統一顯示「使用成功」訊息，不再落回通用「獲得：」訊息。
* **`js/main.js`**：移除 `cons_pliers` 與幸運草類消耗品在進入戰鬥後的第二則發動 toast，避免選擇消耗品後短時間連跳兩則提示。
* **`js/ui.js`**：背包列渲染時過濾 `cons_` 內部旗標，避免下場戰鬥生效的消耗品被顯示成保留道具。
* **`js/locales/*`**：四語系新增 `messages.toast_cons_bomb` 與 `messages.toast_cons_clover`，移除不再使用的發動 toast key，並保留商店按鈕「選擇並馬上使用」語氣，符合消耗品選後立即使用的設計。

### 調整：版本標籤改為免費測試版 [2026/05/17]
* **`index.html` / `js/i18n.js` / `js/locales/*`**：將主畫面版本顯示由 2.0 版本字樣改為各語系對應的免費測試版標籤。
* **`GDD.md` / `CHANGELOG.md`**：同步更新文件中的版本標籤，避免對外顯示仍停留在 2.0 版。

### 調整：統一放大過小 UI 字級至 12px [2026/05/17]
* **`js/ui.js` / `index.html` / `css/style.css`**：將先前盤點到低於 12px 的介面文字統一調整為 12px，包含牌型說明、分數區標籤、骰子基礎點數、遺物與商店徽章、歷史紀錄與教學步驟提示等小字，提升手機與桌機閱讀性。

### 調整：正式套用新版牌型倍率與稀有度，重產傷害表 [2026/05/17]
* **`js/data.js` / `js/engine.js`**：正式套用新版整數倍率曲線，常見牌型最低以 x2 起跳，並依出現率重新分配普通、稀有、史詩、傳說、神話五階稀有度。
* **`js/engine.js`**：同步更新 A/B/C/D 四區實際結算倍率，包含比比丟八 x100、兩極 x60、二進位/質數 x3、三龍會/平胡 x10、雙三同 x11、五同/經典四對子 x12 等最終定稿數值。
* **`js/locales/*`**：更新豪華四對子與三龍會的四語系描述，使說明符合新判定：豪華四對子需至少包含一組 4 同，三龍會為兩組 3 連順加一組 2 連號。
* **`alldamege.csv`**：刪除舊版傷害表後重新產生正式版，列出 6435 種非遞減骰面組合（11111111 至 88888888）的基礎點數、發動牌型、總倍率與最終傷害。
* **`alldamege2.csv`**：移除臨時討論用傷害表，避免後續誤用未定稿資料。

### 調整：修正 C 區豪華四對子與三龍會判定 [2026/05/17]
* **`js/engine.js`**：新增 `getLuxuryFourPairsVals()`，豪華四對子現在必須至少包含一個四同，並且能組出四組對子；因此 `[4,2,2]`、`[4,4]`、`[6,2]`、`[8]` 會成立，嚴格 `[2,2,2,2]` 會保留給經典四對子。
* **`js/engine.js`**：三龍會判定由任意三組長度至少 2 的連號，改為固定 `[3,3,2]`：兩組三連順加上一組二連號，避免 `[4,4]` 類雙四連順被三龍會完全吃掉。
* **`js/engine.js`**：同倍率候選排序中將經典四對子排在雙四連順之前，確保 `11223344` 這類嚴格四對子優先顯示為經典四對子。

### 修復：商店刷新後按鈕顯示裸 key [2026/05/16]
* **`js/ui.js`**：修正 `updateShopRerollBtn()` 中刷新後 disabled 狀態誤用 `i18n.t('shop_rerolled')` 的問題，改為讀取正確的 `messages.shop_rerolled`，避免按鈕顯示 `shop_rerolled` 原始 key。

### 修復：終極封鎖中間四顆判定位置 [2026/05/16]
* **`js/main.js`**：將 `ultimatelock` 禁止鎖定的骰子索引由 `[2, 3, 4, 5]` 改為 `[1, 2, 5, 6]`，符合 4x2 盤面中玩家直覺的中間兩欄配置（`OXXO / OXXO`），不再使用原本斜向交錯的 `OOXX / XXOO` 判定。

### 修復：背包遺物加入元素自身直接事件 [2026/05/16]
* **`js/ui.js`**：背包遺物元素重新加入自身層級的 `onpointerdown`、`onpointermove`、`onpointerup` 與 `onclick`，不再完全依賴父層 `enableDragScroll()` 的 delegated listener；即使 itch.io 桌機環境只保留原生 overflow 拖曳、父層 listener 未成功處理，也能由遺物元素自身開啟說明。
* **`js/ui.js`**：新增 `_relicPressStart/_relicPressMove/_relicPressEnd/_relicPressClick` 直接事件處理器，短點擊會開啟遺物說明，拖曳位移超過 5px 則視為橫向捲動並避免誤觸。

### 工具：新增免調整執行原則的 itch.io 發佈入口 [2026/05/16]
* **`publish-itch.cmd`**：新增 Windows 批次檔包裝入口，會以 `powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts\publish-itch.ps1` 執行既有發佈腳本，避免 PowerShell 預設 Execution Policy 阻擋 `.ps1` 造成無法一鍵上傳。
* **`scripts/publish-itch.ps1` / `publish-itch.cmd`**：執行時會直接把 `%LOCALAPPDATA%\Programs\butler` 加入當前 PATH，避免新終端機或受限 shell 找不到 `butler`。

### 工具：新增 itch.io 一鍵同步上傳腳本 [2026/05/16]
* **`scripts/publish-itch.ps1`**：新增 PowerShell 發佈腳本，會將 `D:\unity\bibi-dice` 透過 `robocopy /MIR` 同步到 `D:\unity\bibi-dice_UP`，排除 `.git`、`.claude`、`node_modules`、`scripts` 與企劃／紀錄檔，再自動執行 `butler push` 上傳到 `leijoa/bibi-dice:html`。
* **使用方式**：在專案根目錄執行 `.\scripts\publish-itch.ps1` 即可完成同步與上傳；腳本會自動把 `C:\Users\Leijoa\AppData\Local\Programs\butler` 暫時加入當前 PowerShell PATH。

### 診斷：支援 itch.io 外層網址啟動遺物偵錯 [2026/05/16]
* **`js/ui.js`**：`debugRelic=1` 診斷模式現在除了讀取 iframe 內的 `window.location.search`，也會讀取 `document.referrer` 的查詢參數，讓 `https://leijoa.itch.io/bibi-dice?debugRelic=1` 能啟動遊戲 iframe 內的遺物事件診斷面板。
* **`js/ui.js`**：診斷面板初始會顯示 `debugRelic active`、iframe 實際網址與 referrer，方便確認 itch.io 上傳版本與診斷模式是否確實生效。

### 診斷：加入 itch.io 遺物點擊事件偵錯面板 [2026/05/16]
* **`js/ui.js`**：撤回 `pointerdown` 延遲觸發策略，恢復本機可用的 pointerup/click 開啟遺物說明流程，避免破壞本機瀏覽器行為。
* **`js/ui.js`**：新增 `?debugRelic=1` 診斷模式；啟用後會在畫面左下角顯示遺物列的 pointer/click 事件、事件目標與 relic id，用於判斷 itch.io 桌機 iframe 中短點擊到底是事件未觸發、目標遺失，或顯示層被遮蔽。一般網址不會顯示診斷面板。

### 修復：桌機滑鼠點擊遺物補強 [2026/05/16]
* **`js/ui.js`**：在既有 Pointer Events 遺物點擊判定外，額外加入桌機 `mousedown` / `mouseup` fallback；按下時記錄遺物與座標，放開時若位移未超過 5px 即開啟遺物說明，避免 itch.io 桌機 iframe 中 Pointer Events 點擊路徑未成功觸發。
* **`js/ui.js`**：滑鼠 fallback 會檢查與既有 pointer 開啟時間的間隔，避免同一次點擊重複跳出說明；水平或垂直位移超過門檻時維持拖曳捲動，不誤觸發說明。

### 修復：itch.io 桌機 iframe 遺物點擊目標遺失 [2026/05/16]
* **`js/ui.js`**：背包遺物元素新增 `role="button"` 與 `tabindex="0"`，並支援 Enter／Space 鍵開啟遺物說明，強化桌機瀏覽器可操作性。
* **`js/ui.js`**：`enableDragScroll()` 現在會在 `pointerdown` 記錄原始遺物目標，`pointerup` 時先查事件目標，再用 `document.elementFromPoint()` 依座標反查，最後回退至按下時目標，避免 itch.io iframe 或 pointer capture 導致 `pointerup.target` 變成父層後無法顯示遺物說明。

### 修復：桌機平台點擊遺物無法顯示說明 [2026/05/16]
* **`js/ui.js`**：移除背包遺物項目的 inline `onclick`，改由 `enableDragScroll()` 統一處理 `data-relic-id` 的 pointer/click 事件，避免 itco.io 桌機瀏覽器 iframe 環境中橫向拖曳容器攔截點擊後無法開啟遺物說明。
* **`js/ui.js`**：替橫向拖曳加入 5px 位移門檻，短距離按放會視為點擊並顯示說明，超過門檻才啟動拖曳捲動，同時阻止拖曳結束後誤觸發點擊。

### 修復：手機視窗縮放高度不一致 [2026/05/16]
* **`js/ui.js`**：調整 `initResponsiveScaling()`，改用 `#game-scaler` 的實際渲染寬高計算 450x800 固定畫布縮放比例，並新增 `visualViewport.resize` 監聽，修復 Android 手機與 Galaxy Z Fold 7 外螢幕上骰子區域被裁切或需要捲動的問題。

### 修復：非最終牌型浮字字級過小 [2026/05/16]
* **`js/ui.js`**：非最終牌型浮字現在同時套用對應稀有度 class 與 `hand-float-away`，避免只套用 away 動畫時失去稀有度字級、顏色與陰影。
* **`css/style.css`**：提高牌型浮字的 `clamp()` viewport 偏好值，讓各稀有度在手機寬度下更接近原本的大字級表現。

### 修復：牌型浮字排序與長文字溢出問題 [2026/05/16]
* **`js/ui.js`**：牌型預覽浮字排序新增同稀有度下依倍率排序，並延長浮字移除時間以配合動畫長度。
* **`css/style.css`**：替各稀有度牌型浮字加入響應式 `clamp()` 字級與最大寬度限制，並延長 `handFloatAway` 動畫，避免長牌型名稱在小螢幕溢出或消失太快。

### 修復：分數註記列支援觸控拖曳橫向滑動 [2026/05/15]
* **`js/ui.js`**：將 `enableDragScroll()` 改為 Pointer Events 實作，支援滑鼠與觸控拖曳；同時讓 `score-notes-row` 套用 `scrollable-row` 樣式，避免全域 `touch-action: none` 導致分數註記列在手機／觸控環境無法滑動。

### 修復：每次重新結算後恢復分數註記列拖曳捲動 [2026/05/15]
* **`js/ui.js`**：替 `renderScore()` 產生的分數註記列加入 `score-notes-row`，並在每次重設 `scoreDisplay.innerHTML` 後重新呼叫既有的 `enableDragScroll()`，避免牌型表／分數註記列重繪後失去滑鼠拖曳橫向捲動能力。



### Feat：攻擊按鈕音效改版，加入依稀有度分層的牌型揭示音效 [2026/05/15]
* **`js/audio.js`**（`playAttackSound`，第 222–228 行）：移除原本按下攻擊按鈕的雙段衝擊音（150Hz sawtooth + 100Hz square），改為單一輕量蓄力聲（120Hz sawtooth）。視覺衝擊感移至後續牌型揭示階段播放，避免音效在按鈕按下時就過早高潮。
* **`js/audio.js`**（新增 `playHandRevealSound`，`playAttackSound` 之後，約第 230 行）：依 `rarity` 參數播放不同層次的合成音效：Common（單一 sine）、Rare（雙音上行）、Epic（三音三角波和弦）、Legendary/Mythic（四音金屬閃光和弦），最終牌型（`isFinal=true`）額外提升音量與延音，並對 Legendary 增加第五個高頻閃光泛音。
* **`js/ui.js`**（`showHandNamesPreview`，第 902–918 行）：在每個牌型浮現元素建立前呼叫 `Audio.playHandRevealSound(rarity, isFinal)`，`isFinal` 以 `idx === zones.length - 1` 判斷；同時將原本直接引用 `idx === zones.length - 1` 的條件式改為使用 `isFinal` 變數，保持程式碼一致性。

### 修復：固定 score-display 最小高度防止 board-panel 拉伸 [2026/05/15]
* **`css/style.css`**（新增 `#score-display` 規則，`#board-panel` 之前，約第 945 行）：新增 `min-height: 140px`。ROLLING 狀態下 scoreDisplay 內容僅剩結算提示文字，高度塌縮後 flex 父容器會將空間分配給 `#board-panel` 造成拉伸；固定最小高度可確保分數區在任何內容狀態下都不會低於 140px，從根本上阻止高度變化傳播至上層容器。

### 修復：ROLLING 狀態期間保留 ABCD 區佔位高度並國際化結算提示文字 [2026/05/15]
* **`js/ui.js`**（`renderScore`，第 624–630 行）：將 ROLLING 狀態下的 scoreDisplay 由單行文字替換為「結算提示文字 + 4 欄暗色佔位格子」的複合版面。原本只有一行文字時 scoreDisplay 高度極小，骰子動畫結束後格子出現造成版面跳動；佔位格子與真實 ABCD 區高度相同，確保版面在整個 ROLLING 期間維持固定高度。
* **`js/ui.js`**（同上）：結算提示文字改由 `window.i18n.t('ui.score_calculating')` 取得，保留硬編碼繁中作為 fallback。
* **`js/locales/zh-tw.js`**（第 251 行）：`ui` 區段新增 `score_calculating: '盤面結算中...'`。
* **`js/locales/zh-cn.js`**（第 251 行）：新增 `score_calculating: '盘面结算中...'`。
* **`js/locales/en.js`**（第 251 行）：新增 `score_calculating: 'Calculating...'`。
* **`js/locales/ja.js`**（第 251 行）：新增 `score_calculating: '計算中...'`。

### 修復：移除重骰動畫的 translateY，徹底消除版面回流 [2026/05/15]
* **`css/style.css`**（`@keyframes diceRerollCombined`，第 48–59 行）：移除所有影格的 `translateY()` 函數，僅保留 `rotate()`。`translateY` 會造成元素幾何位置改變，即使父容器有 `overflow: hidden` 與 `contain: layout paint`，部分瀏覽器仍可能觸發 layout reflow 導致 board-panel 高度瞬間拉伸；純 `rotate()` 只改變視覺旋轉，不影響佔位幾何，完全杜絕此問題。同時將影格從 10 格精簡為 8 格，保留左右搖擺的節奏感。

### 修復：極端份子與天秤之極遺物說明文字國際化 [2026/05/15]
* **`js/engine.js`**（第 663 行）：將 `extremist` 遺物 D 區倍率的 globalNote 由硬編碼中文模板字串改為 `_t('messages.extremist_zone_note', ...)` 呼叫。
* **`js/engine.js`**（第 672 行）：將 `fusion_scale_apex` 遺物絕對秩序倍率的 globalNote 由硬編碼中文模板字串改為 `_t('messages.scale_apex_order_note', ...)` 呼叫。
* **`js/locales/zh-tw.js`**（第 429 行）：新增 `extremist_zone_note`（`'{0} D區 x{1}'`）與 `scale_apex_order_note`（`'{0} 絕對秩序倍率 x{1}'`）。
* **`js/locales/zh-cn.js`**（第 383 行）：新增對應簡體中文翻譯（D区、绝对秩序倍率）。
* **`js/locales/en.js`**（第 383 行）：新增對應英文翻譯（Group D、Absolute Order）。
* **`js/locales/ja.js`**（第 383 行）：新增對應日文翻譯（Dグループ、絶対秩序）。

### 修復：重骰動畫造成 board-panel 垂直拉伸跑版 [2026/05/15]
* **`js/ui.js`**（`startRerollAnimation`，第 556 行）：刪除在 setTimeout 之前同步執行的 `img.src = getDiceImageUrl(Math.ceil(Math.random() * 8))` 這一行。該行對全部 8 顆骰子同步觸發圖片重載，導致瀏覽器在動畫開始前就進行大量 layout 重算，造成版面瞬間拉伸；scramble interval 已能正確處理亂數圖片切換，無需此行。
* **`css/style.css`**（`@keyframes diceRerollCombined`，第 48–59 行）：移除所有影格中的 `scale()` 函數。`scale(1.08)` 與 `rotate()` 同時作用時會擴大元素的 axis-aligned bounding box，即使有 `overflow: hidden` 仍會觸發 layout 重算並擠壓父容器；改為純 `translateY` + `rotate` 組合，保留搖擺跳躍效果的同時完全消除尺寸變化。
* **`css/style.css`**（`#board-panel`，第 947 行）：新增 `contain: layout paint`，建立獨立的 layout containment context，使 board-panel 內部的動畫不再影響外部 DOM 樹的 layout 計算，徹底防止骰子動畫期間面板高度被重新計算。

### 優化與修復：修復重骰時的版面短暫拉伸跑版問題 [2026/05/15]
* **`css/style.css`**：新增 `#dice-container` 的 `overflow: hidden` 限制，並且將原本的兩個互相衝突的 class（`.dice-rerolling-jump` 和 `.dice-rerolling-sway`）整合成為一個共用的單一動畫類別 `.dice-rerolling` 與 `@keyframes diceRerollCombined`。
* **`js/ui.js`**：更新 `startDiceRerollAnimation`，移除舊版的交替 timeout 邏輯並只套用新的單一 `.dice-rerolling` class。

### Fix：牌型浮現文字可見度與錯開間距修正 [2026/05/15]
* **`css/style.css`**（各 `.hand-float-*` class，第 1017–1102 行）：所有稀有度加入四角黑色描邊（`-2px/-2px` 各方向 `rgba(0,0,0,0.9)`），使文字在任意背景下均清晰可讀；各稀有度調亮顏色（Common `#cbd5e1`→`#e2e8f0`、Rare `#60a5fa`→`#93c5fd`、Epic `#c084fc`→`#d8b4fe`、Legendary `#fbbf24`→`#fde68a`、Mythic `#22d3ee`→`#67e8f9`）；光暈強度同步提升。
* **`js/ui.js`**（`showHandNamesPreview`，第 892 行）：stagger 間隔由 280ms 延長至 **380ms**，避免多牌型同時重疊；元素自動移除 timeout 由 1000ms 調整為 **1050ms** 配合間隔。
* **`js/main.js`**（`window.fireAttack`，第 1524 行）：預覽完成後延遲啟動傷害動畫由 1200ms 調整為 **1600ms**（覆蓋最多 4 牌型 × 380ms + 顯示時間的最壞情況）。

### Feat：攻擊前預覽牌型名稱浮現特效（時機前移＋尺寸提升） [2026/05/15]
* **效果**：牌型名稱浮現改在攻擊動畫**開始前**出現（而非傷害步驟中），最多 4 個名稱依 280ms 錯開依序飄出，顯示在骰子區中心，傷害動畫延遲 1200ms 後才啟動；字體大幅放大（Common 2.0rem → Mythic 4.5rem），位置動態對準 `#dice-container` 中心而非固定螢幕座標。
* **`js/main.js`**（`window.fireAttack`，第 1521–1524 行）：移除舊有 `UI.playDamageStepsAnimation(steps, doAttack)` 的直接呼叫，改為先執行 `UI.showHandNamesPreview(battle.scoreResult)`，再用 `setTimeout(..., 1200)` 延遲啟動傷害動畫。
* **`js/ui.js`**（新增 `export function showHandNamesPreview` 及 `function getRarityClass`，約第 836–900 行；移除 `playDamageStepsAnimation` zone 步驟中的 `showHandNameFloat` 行）：
  * `showHandNamesPreview(scoreResult)` — 蒐集 tagA/B/C/D 中 `multi > 1.0` 且非 `'無'` 的手牌，讀取 `#dice-container` 的 `getBoundingClientRect()` 計算中心座標，以 `idx * 280ms` 錯開 `setTimeout`，建立 `div` 並以 `style.left/top` 動態定位，1000ms 後自動 `remove()`。
  * `getRarityClass(rarity)` — 將數值稀有度對映至 CSS 類別名稱（1→common … 5→mythic）。
  * `playDamageStepsAnimation` zone handler：刪除 `if (step.handName) showHandNameFloat(step.handName)` 呼叫。
* **`css/style.css`**（第 1003–1094 行）：更新 `.hand-float-base`（移除固定 `left: 50%; top: 42%`，改由 JS 設定）；各稀有度 class 字體大幅放大：Common 2.0rem、Rare 2.6rem、Epic 3.2rem、Legendary 3.8rem、Mythic 4.5rem；更新對應 `@keyframes`（調整 scale 與 glow 強度）。

### Feat：攻擊結算時顯示牌型名稱浮現特效 [2026/05/15]
* **效果**：每當 Zone A/B/C/D 倍率步驟觸發（傷害動畫播放中），畫面中央依牌型稀有度浮現對應名稱文字，並以 Common→Mythic 五段差異化的尺寸、顏色、光暈與動畫呈現。
* **`js/engine.js`**（第 731–748 行）：在 `stepCollector.push` 的各 zone 物件中補上 `handName` 欄位：取 `result.tagX.name`（非 `'無'` 時）；AB 合區傳 `null`。新增 `_hn` 輔助 arrow function 用於空值篩濾。
* **`js/ui.js`**（`playDamageStepsAnimation`，第 908 行；新增 `showHandNameFloat` 函數，第 805–833 行）：
  * 新增 `showHandNameFloat(rawName)` — 從 `RULE_DB.groupA/B/C/D` 以 `name.startsWith` 做模糊比對（處理 `'比比丟八(ビビデバ)'` 等含附加字串的情況），查出稀有度與 i18n key（格式：`rules.rule_a{idx}.name`），建立 `div.hand-float-base.hand-float-{rarity}` 並 append 至 `document.body`，動畫結束後自動移除。
  * `if (step.zone)` 區塊在 `zone-active` class 加入後、`countUpTo` 前新增 `if (step.handName) showHandNameFloat(step.handName)`。
* **`css/style.css`**（第 1003–1097 行）：新增 `.hand-float-base` 基底定位樣式（`fixed`、`z-index: 9998`）及五個稀有度 class（`hand-float-common/rare/epic/legendary/mythic`），各帶獨立 `@keyframes`：Common 簡單淡出上浮，Rare 縮放入場，Epic 光暈脈衝，Legendary 橫向抖動金色，Mythic 超大青色震撼。

### Feat：重骰波浪彈跳 + 數字亂跳動畫 [2026/05/15]
* **效果**：骰子重骰後不再即時顯示最終數字，而是播放「彈跳起跳 → 左右搖擺 → 快速亂數」三段動畫，逐一錯開揭示真實值，視覺層次更豐富。
* **`css/style.css`**（第 48–66 行）：移除舊有 `.rolling-dice-anim` 及 `@keyframes rollJiggle`（未被使用的殘留 CSS），替換為四個新定義：
  * `@keyframes diceRerollJump`：translateY + scale 跳起效果，0.15s ease-out
  * `@keyframes diceSway`：±15deg 左右旋轉搖擺，0.06s linear infinite
  * `.dice-rerolling-jump`、`.dice-rerolling-sway`：分段套用上述 keyframes
* **`js/ui.js`**（第 535–580 行）：新增 `export function startRerollAnimation(unlockedIndices, finalDice)`：
  * 先同步將所有未鎖骰子 `img.src` 設為隨機值（讓瀏覽器首幀就顯示亂數）
  * 每顆骰子以 `staggerPos × 35ms` 錯開：先加 `.dice-rerolling-jump`（150ms 後切換為 `.dice-rerolling-sway`），同時每 40ms 換一次隨機骰面圖片
  * 280ms 後清除 interval、還原正確 `img.src`、移除 CSS class
  * 模組層級維護 `_rerollAnimTimers` 陣列，重複呼叫時自動清除前次計時器
* **`js/main.js`**（`executeRoll`，第 1275–1276 行）：在現有 `renderAll()` 之後追加 `UI.startRerollAnimation(_unlockedForAnim, battle.dice)`；`_unlockedForAnim` 為排序後的未鎖索引陣列。

### Fix：補齊消耗品戰鬥激活 toast 的多語系支援 [2026/05/15]
* **問題**：`js/main.js` 中有兩處消耗品於戰鬥中激活時仍顯示硬編碼繁中文字，切換語系後無法正確呈現。
* **發現的硬編碼字串**：
  * `loadStage()` 第 934 行：`'🛠️ 重型破壞鉗發揮作用，破壞了本關的枷鎖！'`（`cons_pliers` 激活）
  * `rollDice()`/幸運葉草觸發邏輯 第 1196 行：`` `🍀 發動幸運${num}葉草！` ``（`cons_clover_3/4/5/6` 激活，含動態數字）
* **新增 i18n key**（四個 locale 的 `toast_cons_science_d` 之後，各增 2 行）：
  * `toast_cons_pliers_activate`：`zh-tw.js` 第 403 行、`zh-cn.js` 第 357 行、`en.js` 第 357 行、`ja.js` 第 357 行
  * `toast_cons_clover_activate`（含 `{0}` 參數承接葉草數字）：同上各 +1 行
* **`js/main.js`** 第 934 行改為 `i18n.t('messages.toast_cons_pliers_activate')`；第 1196 行改為 `i18n.t('messages.toast_cons_clover_activate', num)`。

### Fix：重置靈魂後同步清除存檔並隱藏「繼續」按鈕 [2026/05/15]
* **問題**：`window.resetSouls()` 退還靈魂點數後未呼叫 `window.clearSave()` 也未隱藏 `#btn-continue`，導致玩家可帶著已退款的升級繼續舊存檔，使重置形同虛設。
* **修復**：於 `js/ui.js` 的 `window.resetSouls`（第 1515–1517 行）在 `renderSoulsModal(meta)` 之後補上與 `buySoulUpgrade` 相同的兩行邏輯：`if (window.clearSave) window.clearSave()` 及取得 `#btn-continue` 元素後加上 `hidden` class。純邏輯補齊，不涉及退款計算。

### Fix：補齊消耗品購買時的多語系 toast 訊息 [2026/05/15]
* **問題**：商店購買 `cons_pliers`、`cons_doll`、`cons_fruit`、`cons_loaded_dice`、`cons_guide`、`cons_strike_a`、`cons_fever_b`、`cons_combo_c`、`cons_science_d` 等消耗品時，toast 訊息使用硬編碼文字或通用格式，切換語系後無法正確顯示。
* **四個 locale 檔案**（`zh-tw.js` 第 394–402 行、`zh-cn.js` 第 348–356 行、`en.js` 第 348–356 行、`ja.js` 第 348–356 行）：在 `toast_cons_hp` 後新增 9 個 toast key：`toast_cons_pliers`、`toast_cons_doll`、`toast_cons_fruit`、`toast_cons_loaded_dice`、`toast_cons_guide`、`toast_cons_combo_a`、`toast_cons_fever_b`、`toast_cons_combo_c`、`toast_cons_science_d`。
* **`js/main.js`**（`window.buyItem`，第 1880–1890 行）：將原本的單一 `else` 區塊（含通用 toast）替換為各消耗品獨立的 `if/else if` 鏈，每個分支先 `player.relics.push(r.id)` 再顯示對應 i18n toast；未識別的消耗品仍保留通用 fallback。
* **注意**：任務說明中 A 區藥劑 ID 標示為 `cons_combo_a`，但引擎實際使用 `cons_strike_a`（見 `main.js:1634`）；此處以 `r.id === 'cons_strike_a'` 對應 `toast_cons_combo_a` locale key，確保功能正確。

### Fix：切換分頁或最小化時自動暫停／恢復 BGM [2026/05/14]
* **問題**：使用者切換分頁或最小化瀏覽器（尤其行動裝置）時，BGM 持續播放，造成背景音效干擾。
* **修復**：於 `js/audio.js` 的 `initAudio()` 函式中，在 `audioCtx = new AudioContext()` 建立後（第 90 行）新增 `visibilitychange` 事件監聽器：頁面隱藏時呼叫現有的 `pauseBGM()`，頁面重新顯示時呼叫現有的 `playBGM()`。監聽器僅在 `audioCtx` 首次建立時註冊一次，不會重複綁定。未新增任何新函式，亦未更動其他邏輯。

### Feat：商店消耗品卡片視覺區分 [2026/05/14]
* **目標**：讓消耗品在商店中一眼可辨，避免與遺物卡片混淆。
* **`js/ui.js`**（`renderShopItems`，第 914–935 行）：
  - 新增 `isConsumable`、`cardBg`、`consumableBadgeHtml`、`selectBtnText` 四個變數。
  - 消耗品卡片背景改為暖琥珀深色漸層（`#1c1a14 → #19160e`）；稀有度邊框顏色不受影響。
  - 稀有度徽章下方新增 `🧪 消耗品` 標籤（`bg-amber-900/60 text-amber-300`）。
  - 選擇按鈕文字消耗品改為 `messages.shop_select_consumable`，遺物維持 `messages.shop_select`。
* **四個 locale 檔案**（`zh-tw.js` 第 413–414 行、`zh-cn.js` 第 367–368 行、`en.js` 第 367–368 行、`ja.js` 第 367–368 行）：在 `shop_select` 後新增 `shop_select_consumable` 與 `consumable_tag` 鍵值。

### Fix：隱藏「幻覺」枷鎖下未鎖定骰子的分數貢獻數字 [2026/05/14]
* **問題**：當枷鎖 `illusion` 啟用時，每顆未鎖定骰子左上角的分數貢獻徽章仍顯示真實數值，洩漏骰子點數，破壞幻覺效果。
* **修復**：於 `js/ui.js` 的 `renderDice` 函式中，新增 `isIllusioned` 判斷（第 491 行）——當 `shackleId === 'illusion'` 且骰子未鎖定且狀態非 IDLE/ROLLING 時，隱藏該骰子的分數貢獻徽章。鎖定骰子不受影響，計算邏輯完全未更動。

### Fix：歷史紀錄、結算統計與關卡標籤全面動態多語系化，解決牌型與敵人名稱卡在中文的問題 [2026/05/11]
* **問題**：`renderHistoryModal` 中所有靜態標籤（「關卡類型」、「最佳牌型」、「遺物」、「枷鎖」）硬編碼繁中；`stageTypeLabel` 固定輸出中文字串（如「精英」、「無限塔」）；歷史紀錄的 `r.combo` 以儲存時的語系顯示，不跟隨當前語系；結算畫面的 `highestDamageCombo` 同樣卡中文。
* **locale 新增**（4 個語系）：在 `ui` 區塊補齊 `stage_type_boss/elite/infinite/normal`、`history_stage_type`、`history_best_hand`、`history_relics`、`history_shackles` 共 8 個鍵值。
* **`js/main.js`**：`recordHistory` 的 `currentRecord` 新增 `level: stage.level` 與 `infiniteMonsterId: stage.infiniteMonsterId`，供 UI 層動態查名使用。
* **`js/ui.js`**：
  - 新增 `getLocalizedCombo(comboStr)` 輔助函式：以 RULE_DB 查找各牌型的 i18n key，支援複合 combo（` + ` 分隔）逐段翻譯後拼回；
  - `renderHistoryModal`：`resultText` 改用 `i18n.t('enemies.enemy_N')` / `i18n.t('monsters.monster_N')` 動態查名；`stageTypeLabel` 改用 `ui.stage_type_*` 鍵值；所有標籤改用 `ui.history_*` 鍵值；`r.combo` 與 PB combo 改用 `getLocalizedCombo()` 翻譯；
  - `renderEndGameStats`：`highestDamageCombo` 改用 `getLocalizedCombo()`；
  - `updateEnemyUI` layerBadgeText 已於上次任務修正，無需再改。

### Refactor：戰鬥狀態列支援物件化類型區分，實現枷鎖優先排序與視覺化變色，並徹底多語系化 [2026/05/11]
* **重構目標**：將 `js/engine.js` 的 `globalNotes` 由純字串陣列改為物件陣列 `{ text: string, type: 'relic' | 'shackle' }`，以承載類型元數據，供 UI 層排序與上色使用。
* **locale 新增**（4 個語系）：在 `messages` 區塊加入 `relic_trigger`（`[{0}] 發動: {1}` 等）與 `shackle_trigger`（`[{0}] 影響: {1}` 等）兩組格式字串，描述性遺物與枷鎖觸發說明均透過 `_t()` 動態生成，不再有硬編碼繁中文字。
* **engine.js 改動**：共轉換約 35 處 `globalNotes.push(string)` 為 `globalNotes.push({ text, type })`：
  - 枷鎖觸發注記（12 處）→ `type: 'shackle'`，文字改用 `shackle_trigger` 模板 + locale desc
  - 遺物描述性觸發（hodgepodge、fusion_samsara、sixsmooth、order、fusion_scale_apex、mediocre 等）→ `type: 'relic'`，文字改用 `relic_trigger` 模板 + locale desc
  - 遺物點數/倍率注記（已有 `relic_points_note`/`relic_multi_note`）→ 直接加上 `type: 'relic'`
* **ui.js 改動**：`renderScore` 中新增 `sortedNotes` 排序（枷鎖優先），並以 `n.text` 取代原先的字串 `n`；枷鎖注記使用紅色樣式（`text-red-300 bg-red-950/50 border-red-800/50`），遺物注記保留紫色樣式。

### Fix：將戰鬥結算狀態列（點數與倍率說明）全面多語系化 [2026/05/11]
* **問題**：`js/engine.js` 的 `calculateEngineScore` 函式中，所有遺物點數加成與倍率說明均以硬編碼繁中格式（如 `【等差數列】 +16 基礎點數`、`【破釜沉舟】 x1.50`）推送至 `globalNotes`，切換語系後狀態列仍顯示繁中文字。
* **修復**：新增 `_t` 輔助函式（`window.i18n` 的薄包裝），並在四個 locale 檔案的 `messages` 區塊加入三組格式字串：
  - `relic_points_note`：`+{0} 點數 ({1})` / `+{0} Pts ({1})` / `+{0} 点数 ({1})` / `+{0} 点 ({1})`
  - `relic_multi_note` / `shackle_multi_note`：`x{0} ({1})`（四語系格式相同）
* **涵蓋範圍**：共替換 16 處 `globalNotes.push`：4 處點數加成（`arithmetic`、`luckyseven`、`fusion_death_sequence`、`fusion_blood_crusade`）、12 處倍率說明（`fusion_nebula`、`fusion_pillar`、`pansy`、`pongo`、`highlow`、`laststand`、`allin`、`fourdeath`、`rebel`、`royalflush`、`brink`、`dragonslayer`）。帶有特殊上下文的描述性說明（散牌計算、D區倍率、枷鎖發動說明等）不在本次改動範圍內。

### Fix：將商店獲得物品與開發者模式提示全面多語系化 [2026/05/11]
* **問題**：`js/main.js` 的 `window.buyItem` 函式在購買消耗品後，以硬編碼繁中字串 `'獲得：'` 拼接 toast 訊息；`window.devGetAllRelics` 同樣硬編碼整段開發者模式通知文字，兩者均無法隨語系切換。
* **修復**：在四個 locale 檔案（`zh-tw`、`zh-cn`、`en`、`ja`）的 `messages` 區塊新增 `toast_obtained` 與 `toast_dev_get_all` 兩組翻譯鍵值，並將 `main.js` 中對應的硬編碼字串替換為 `i18n.t('messages.toast_obtained')` 與 `i18n.t('messages.toast_dev_get_all')`。

### Fix：修復購買消耗品放入背包時導致 UI 渲染崩潰與商店卡死的 Bug [2026/05/11]
* **問題根因**：`player.relics` 陣列會存放消耗品 ID（`cons_` 前綴），但 `js/ui.js` 在背包渲染、遺物資訊彈窗、歷史紀錄、結算畫面等多處，僅從 `RELIC_DB` 查表，導致消耗品回傳 `undefined`，引發 JavaScript 崩潰並使商店流程中斷。
* **修復方式**：在 `js/ui.js` 頂部引入 `CONSUMABLES_DB`，並將所有遍歷 `player.relics`（或傳入的 relics 陣列）後執行 `RELIC_DB.find` 的地方，統一加上 `|| CONSUMABLES_DB.find` 後備查詢，共修復 7 處：
  1. `renderInventory` — `sortedRelics` 排序比較函式
  2. `renderInventory` — 渲染迴圈內的 `let r` 查表
  3. `window.showRelicInfo` — 遺物資訊彈窗查表
  4. `renderHistoryModal` — PB 最高傷害遺物列表 (`highestDamageRelics`)
  5. `renderHistoryModal` — 歷史紀錄清單遺物欄位 (`r.relics`)
  6. `renderEndGameStats` — 結算畫面遺物列表

### Fix：統一全域關卡顯示格式並修復硬編碼問題 [2026/05/11]
* **語系格式統一**：將 `js/i18n.js` 中四個語系的 `ui.stage` 改為含 `{0}` 的格式字串（`zh-tw`→`'第 {0} 層'`、`zh-cn`→`'第 {0} 层'`、`en`→`'Floor {0}'`、`ja`→`'第 {0} 層'`），修復原先 `#stage-info` 頭部只顯示靜態文字（未代入關卡編號）的問題。
* **修復層級徽章硬編碼**：將 `js/ui.js` 敵人名稱區的層級徽章由硬編碼 `` `第${stage.level+1}層` `` 改為 `i18n.t('ui.stage', stage.level + 1)`，隨語系正確顯示。
* **修復 PB 硬編碼**：個人最佳紀錄無限層數顯示由硬編碼 `PB: Floor ${n}` 改為 `PB: ${i18n.t('ui.stage', n)}`，支援多語系。

### Feature：靈魂奉獻後自動清除當前單局存檔，並新增 i18n 警告提示 [2026/05/11]
* **新增機制**：玩家在靈魂奉獻視窗成功購買任何升級後，系統將立即清除 `localStorage` 中的局內存檔（`SAVE_KEY`），並隱藏首頁的「繼續旅程」按鈕，強制玩家下次以新遊戲開始。
* **存檔隔離**：僅移除局內進度存檔，靈魂總數、已解鎖天賦（`META_KEY`）、收集冊（`COLLECTION_KEY`）、歷史紀錄（`HISTORY_KEY`）一律不受影響。
* **i18n 警告提示**：靈魂奉獻彈窗頂部新增紅色警告文字（`text-xs text-red-400 font-bold`），透過 `i18n.t('ui.souls_warning')` 顯示，四個語系（`zh-tw`、`zh-cn`、`en`、`ja`）均已在 `js/i18n.js` 補齊對應翻譯。
* **實作細節**：`js/main.js` 暴露 `window.clearSave`；`js/ui.js` 的 `buySoulUpgrade` 於購買成功後呼叫 `window.clearSave()` 並隱藏 `#btn-continue`；`renderSoulsModal` 於升級列表前插入警告段落。

### Fix：修復繁體中文收集冊鎖定項目顯示原始 i18n Key 值 [2026/05/11]
* **問題**：切換至繁體中文（`zh-tw`）語系後，收集冊「牌型」、「遺物」、「枷鎖」三個分頁中，尚未解鎖項目的描述欄位會顯示原始 key 值 `ui.locked`，而非翻譯文字。
* **根本原因**：`js/i18n.js` 中 `zh-tw` 語系的 `ui` 覆寫物件缺少 `'locked'`、`'locked_relic'`、`'locked_shackle'` 三個 key（簡體中文、英文、日文均已定義）。
* **修復**：在 `js/i18n.js` 的 `zh-tw` → `ui` 區塊末尾補齊三個 key：`'locked': '未解鎖'`、`'locked_relic': '未解鎖遺物'`、`'locked_shackle': '未解鎖枷鎖'`。

### Feature：實作首頁 3 秒沉浸式開場與閃白漸顯動畫 [2026/05/10]
* **開場演出**：頁面載入後前 3 秒隱藏所有 UI，僅顯示背景插畫與呼吸動畫，製造沉浸感。3 秒後觸發 `flash-bang` 閃白特效（0.8s），同步讓主 UI（`intro-main-ui`：開始按鈕、說明文）以 `ui-fade-in` 動畫漸顯；再延遲 400ms 讓次要 UI（`intro-sub-ui`：教學、設定等按鈕與底部資訊）漸顯，形成視覺層次。
* **跳過功能**：點擊畫面任意處可立即觸發開場演出，自動清除 3 秒倒數計時。
* **HTML 結構**：`index.html` 加入 `#intro-flash`（`z-[200]` 全螢幕閃白層，置於 `#game-container` 外側以避免 transform stacking context 問題），首頁 UI 元素依顯示優先度分別標記 `intro-main-ui` / `intro-sub-ui`。
* **CSS**：`style.css` 新增 `.intro-hidden`（初始隱藏）、`.intro-fade-in` + `@keyframes ui-fade-in`（漸顯進場）、`.animate-flash` + `@keyframes flash-bang`（閃白特效）。

### Feature：調整首頁說明文位置，並強化其視覺辨識度與背景質感 [2026/05/10]
* **搬移說明文**：將 `#title-screen` 內 `<p data-i18n="ui.title_desc">` 從 `.title-enter` 容器移至 `title-divider` 分隔線正下方，讓插畫上半部完全顯露。
* **視覺強化**：說明文改以 `bg-black/60`（60% 黑底）+ `border border-purple-500/30`（紫色微亮邊）+ `rounded-xl p-4` 呈現，字體升為 `text-sm text-purple-100 font-bold`，在插畫背景下清晰可讀。
* **清除多餘空格**：移除 `.title-enter` 容器內原本為說明文保留的 `mt-4` 邊距，避免標題區留有大空白。

### Fix：移除擋圖的首頁標題文字，並將按鈕全面升級為紫水晶玻璃擬態 [2026/05/10]
* **移除文字標題**：從 `index.html` 的 `#title-screen` 中移除 `<h1>bibi-dice</h1>` 與 `<h2>比比丟八</h2>`，讓背景插畫完全顯露出來，提升沉浸感。
* **紫水晶玻璃按鈕**：將 `css/style.css` 中 `#title-screen .btn-primary` 重寫為 `rgba(122,59,245,0.25)` 半透明底 + `backdrop-filter: blur(15px) saturate(200%)`，hover 時背景透明度提升且邊框呈現紫色發光（`rgba(167,139,250,0.6)`）。`.btn-secondary` 同步改為中性半透明水晶玻璃風格。
* **Scrim 調輕**：將 `#title-screen::after` 的 `linear-gradient` 調整為頂部極輕（黑 5%）、中央透明（30%）、底部適中（65% @ 80%），讓角色與魔法陣清晰透出，不再被重疊遮蔽。

### Feature：實作首頁視覺升級與背景呼吸動畫 [2026/05/10]
* **背景插畫**：`css/style.css` 的 `#title-screen` 現在使用 `img/home_bg.webp` 作為全螢幕背景圖（`background-size: cover`），並透過 `::before` 偽元素搭配 `@keyframes title-breathing` 實現 10 秒週期的呼吸縮放（scale 1.0 → 1.05），帶來動態臨場感。
* **漸層蒙層 (Scrim)**：`::after` 偽元素疊加了原有兩組 `radial-gradient` 輝光與底部漸暗 `linear-gradient`（0% 黑 30%→中透明→底部 70% 黑），確保按鈕與文字在任何圖片內容下均清晰可讀。
* **玻璃擬態按鈕 (Glassmorphism)**：首頁的 `.btn-primary` 與 `.btn-secondary` 套用 `backdrop-filter: blur(10px)` 及帶透明度的背景色，並加入細框線 `rgba` 亮邊，hover 時主按鈕呈現增強光暈效果。
* **標題容器底板**：`.title-enter` 容器加入 `backdrop-filter: blur(4px)` 微幅毛玻璃效果，提升遊戲標題與描述文字在複雜背景下的可讀性。

### Fix：新手教學系列體驗修復 [2026/05/10]
* **攻擊按鈕無法點擊**：修正 `js/ui.js` 的 `showTutorialStep()` 中，教學步驟 4（attack-btn）時 `#game-container` 因 `transform:scale()` 建立 stacking context，導致 `#board-panel`（無 z-index）被 backdrop（z-195）遮蔽，攻擊按鈕因此無法被點擊的問題。現在高亮攻擊步驟時會暫時將 `#board-panel` 的 `z-index` 提升至 `196`，並在 `_unhighlightTutorialElement()` 中還原。
* **教學重骰限制**：`js/main.js` 的 `startTurn()` 中，`tutorialMode` 為 `true` 時強制將 `baseMaxRolls` 設為 `1`，避免玩家在教學中多次重骰。
* **商店高亮層級**：`showTutorialStep()` 高亮 `#shop-overlay` 內元素時暫時提升父層 `z-index` 至 `196`，結束後還原。
* **Tooltip 邊界限制**：`_positionTutorialTooltip()` 改用實際 `offsetWidth/offsetHeight` 取代硬編碼估值，並統一對四邊進行 clamp，確保任何螢幕下提示視窗均不溢出。

### Fix：修復新手教學提示視窗溢出畫面邊界的問題 [2026/05/10]
* **Tooltip 邊界限制**：修正 `js/ui.js` 的 `_positionTutorialTooltip()` 中，使用硬編碼尺寸估值且垂直方向（往下定位）及無目標元素時缺少邊界鎖定的問題。現在改為讀取 `tooltip.offsetWidth/offsetHeight` 取得實際渲染尺寸，並在計算結束後統一對四個方向進行 clamp，確保提示視窗在任何螢幕（包含手機直式窄螢幕）下均不會溢出可視範圍。

### Fix：修正新手教學重骰強制為 1 及商店高亮堆疊層級問題 [2026/05/10]
* **教學重骰限制**：修正 `js/main.js` 的 `startTurn()` 中，當 `tutorialMode` 為 `true` 時，`baseMaxRolls` 未被強制設為 `1` 的問題，避免玩家在教學期間可多次重骰而破壞引導流程。
* **商店高亮層級修正**：修正 `js/ui.js` 的 `showTutorialStep()` 中，位於 `#shop-overlay` 內的元素因父層 `z-index` 形成的堆疊上下文而被背景遮罩蓋住的問題。現在高亮時會暫時將 `#shop-overlay` 的 `z-index` 提升至 `196`，並在 `_unhighlightTutorialElement()` 中還原原始值。

### Fix：收集冊 D 區牌型依稀有度排序 [2026/05/09]
* **排序調整**：收集冊「牌型」頁籤的 D 區（特殊牌型）現在依稀有度由高至低排列（傳說 → 史詩 → 稀有 → 普通），視覺上更清晰。
* **不影響原始資料**：僅在 `renderCollectionModal` 渲染時對 D 區做 `.slice().sort()` 排序，不修改 `RULE_DB.groupD` 的原始陣列，其他邏輯不受影響。

### Perf：優化 FUSION_RECIPES 查找效能 [2026/05/09]
* **優化查找效能**：在 `js/data.js` 中新增了 `FUSION_MATERIAL_LOOKUP` 查找表，將原本在 `js/ui.js` 渲染介面時 O(M) 的 `FUSION_RECIPES` 陣列迴圈查找替換為 O(1) 的 Map 查找，並在介面渲染時將玩家持有的遺物轉為 Set 來加快檢索速度，有效減少不必要的 CPU 運算並避免介面卡頓。
### Fix：修復靈魂奉獻與巧手指南重骰加成無效的問題 [2026/05/08]
* **重骰次數修復**：修正了 `startTurn` 在每回合開始時未計算局外「靈魂奉獻」重骰升級以及消耗品【巧手指南】加成的問題。現在重骰次數能正確疊加。
### Feature：新增開發者模式指令與 UI 擴充 [2026/05/08]
* **開發者作弊指令**：加入鍵盤監聽功能，輸入 `8989889` 可秒殺當前敵人；輸入 `ss` + 8 位數字 (例如 `ss12345678`) 可強制設定骰面。
* **開發者面板擴充**：於開發者面板（ `#dev-modal` ）中新增「秒殺當前敵人」按鈕與「自訂骰面」輸入框。
* **行動裝置密技觸發**：在遊戲設定面板的「⚙️ 遊戲設定」標題連續點擊 5 次，可開啟開發者面板。

### Fix：修復重骰資源加成倍率無上限的問題 [2026/05/07]
* **倍率上限**：修正了玩家在擁有極多剩餘重骰次數時，「剩餘資源加成」倍率可無限疊加的問題。現在將該加成的最高倍率限制在 3.0x（即剩餘次數大於 4 次時，最高仍維持 3.0x 加成）。

### 數值調整：「絕對二進位」與「絕對質數」倍率提升 [2026/05/07]
* **倍率上調**：將 D 區牌型「絕對二進位」與「絕對質數」的最終結算倍率由原本的 x10.0 大幅提升至 x30.0。
* **原因**：此兩者牌型達成條件極為嚴苛（需特定骰子組合），為了確保高難度能獲得相應的高報酬，對其進行了數值平衡調整。

### Fix：修正攻擊時導致的凍結問題 [2026/05/07]
* **修正 ReferenceError**：修正 `js/engine.js` 內 `_collect` 函式在提早讀取 `result.globalNotes` 而導致遊戲在按下攻擊時凍結的錯誤。

### Feature：結算動畫加速與標籤閃爍特效 [2026/05/07]
* **動態加速**：傷害結算步驟現在會自動加速，隨著計算過程推進，間隔時間從 400ms 遞減至 50ms，提升爽快感。
* **倍率來源提示**：當計算到特定遺物或枷鎖效果時，對應的提示標籤會觸發彈跳放大與閃爍的特效（`.multiplier-pop`），讓玩家能更清楚感知當前發動的加成項目。

### Feature：實裝遺物稀有度權重隨機系統 [2026/05/06]
* **新增隨機權重系統**：在 `js/main.js` 實作了 `getWeightedRandomRelics` 函數，取代了過去均勻分佈的隨機選取，讓高級遺物更符合其稀有度設定。
* **商店抽取調整**：商店重新整理（`rerollShop`）時的遺物與消耗品抽取現已改用權重隨機系統（Common 50%, Rare 30%, Epic 15%, Legendary 5%）。
* **掉落機率調整**：擊敗菁英及 Boss 後（`enemyDefeated`）取得遺物的隨機掉落改用獨立權重機率（Common 20%, Rare 40%, Epic 30%, Legendary 10%），稍微提升獲得稀有物品的期望值。

### Feature：特殊牌型 D 區擴充與倍率調整 [2026/05/06]
* **新增 D 區特殊牌型**：在 `js/engine.js` 中新增「絕對二進位」、「絕對質數」、「自然對數」、「二進位」、「質數」等多種數學數列相關牌型，增加遊戲構築深度。
* **牌型敘述優化**：為 D 區數學數列牌型（包含斐波那契數列、圓周率、自然對數等）新增了充滿理科浪漫與中二風格的特殊敘述文字，提升沉浸感。
* **調整全異牌型**：將「全異」（All Unique）的基礎倍率從 x2.5 大幅提升至 x10.0，並維持其 8 顆數字皆不相同的判定。
* **圓周率判定微調**：將「圓周率」的要求從 3.1415 調整為更精確的四捨五入 3.1416（陣列需求從 `[1,1,3,4,5]` 改為 `[1,1,3,4,6]`），並同步更新 `js/data.js` 說明與中英日語系檔案的描述。

### Feature：設定介面強化 - 新增靜音開關並優化操作邏輯 [2026/05/06]
* **獨立靜音控制**：在設定面板 (`settings-modal`) 為背景音樂與音效分別新增了獨立的靜音開關（Toggle）。
* **狀態持久化**：於 `audio.js` 新增 `bgmMuted` 與 `sfxMuted` 狀態，並在 `main.js` 實作存檔與讀取邏輯（`localStorage`），確保重新整理後保留靜音設定。
* **防呆防誤觸**：移除了原先的「回標題」按鈕，避免玩家在設定時誤觸導致遊戲進度遺失，並統一改為「確認」按鈕來關閉設定面板。
* **多語系支援**：同步更新了中英日四國語系檔，新增了 `mute` 與 `btn_confirm` 翻譯。

### Feature：無限塔敵人名稱多國語系動態生成 [2026/05/06]
* **存檔擴充**：`main.js` 的 `saveGame` 與 `loadStage` 中新增 `infiniteMonsterId` 欄位（1-50），確保無盡模式下的敵人隨機 ID 可持久化存取。
* **介面更新**：`ui.js` 的 `updateEnemyUI` 現改以 `i18n.t` 讀取動態 ID (`monsters.monster_X`) 取代寫死的中文陣列替換，並根據層數動態附加在地化的菁英與 Boss 標籤。
* **語系更新**：同步擴充四國語系（`zh-tw.js`, `zh-cn.js`, `en.js`, `ja.js`），於 `ui` 節點新增 `elite_tag` 與 `boss_tag`，並於根目錄匯出 50 隻全新設計的無限塔專屬怪物名稱清單。

# 比比丟八-bibi-dice [免費測試版] 更新紀錄

### Bug Fix：血量歸零時越戰越勇遺物觸發修正 [2026/05/06]
* **Fix【越戰越勇】血量歸零誤觸發**：在 `js/main.js` 中修改了 `applyCombatShackles`（處理反傷裝甲）以及 `doAttack`（處理回合超時）兩處扣血邏輯，增加 `player.hp > 0` 判斷。防止玩家在受到致命傷 HP 歸 0 時，仍不合理地觸發並跳出【越戰越勇】加成提示。

### 結算動畫：8-bit 動態音效 [2026/05/06]
* **新增音效支援**：在 `audio.js` 實作 `playScoreStepSound` 函式，基於 Web Audio API `playTone` 發出方波聲音。
* **動態音調提升**：逐步結算過程中，音調隨著步驟疊加逐漸升高（400Hz 起始，每步增加 80Hz，上限 1200Hz），並在最後一步播放清脆高音（880Hz -> 1760Hz）營造勝利感。
* **觸發點整合**：在 `ui.js` 的 `playDamageStepsAnimation` 內匯入 `Audio` 模組並動態呼叫音效。

### Fix：修復預估傷害失準與結算參數錯位問題 [2026/05/06]
* **結算計算整合**：將【力量覺醒】(Meta升級)、【力量藥劑】(消耗品) 與【屠龍者】(遺物) 的加成計算移入 `engine.js` 的 `calculateEngineScore` 內統一處理。
* **動畫與計算同步**：上述加成現在會直接寫入 `stepCollector` 以產生對應的結算動畫，避免預估傷害與實際數字脫鉤。
* **移除冗餘參數**：修正了 `main.js` 呼叫 `calculateEngineScore` 時殘留的 `isInitialRoll` 參數佔位導致錯位的問題（現在全面透過 `env` 物件傳遞 `finalDamageUpgrade`, `damageBuffMulti`, `isEliteOrBoss` 來提供環境參數）。
* **移除冗餘邏輯**：移除了 `main.js` 在 `fireAttack` 內手動計算上述三項加成與插入 step 陣列的代碼。

### Fix：逐步結算動畫步驟與實際傷害完全同步 [2026/05/05]
* **根本原因修復**：舊 `calculateDamageSteps` 是事後手動重建步驟，與 `calculateEngineScore` 的實際計算有落差，導致動畫走完 D 區後仍有神秘跳值。
* **engine.js — `calculateEngineScore` 加入 `stepCollector` 參數**：新增可選第九參數 `stepCollector = null`，在每個倍率修改點即時埋入步驟，確保順序與計算完全一致。
* **收集點覆蓋所有遺物**：pansy、pongo、highlow、laststand、allin、fourdeath、rebel、royalflush、brink、reroll bonus、fusion_nebula、fusion_pillar。
* **additive globalMulti 正確轉換**：flicker（+3.0）、fivebless（+0.2×n）以「有效倍率 = globalMulti_after / globalMulti_before」入隊，重建時乘法結果精確吻合。
* **枷鎖 post-hook 變化自動捕捉**：記錄 `applyShacklePostHooks` 前後的 `globalMulti` 差值，shortcircuit / badluck / sealeddoor 的減益效果不再被隱藏。
* **zone 步驟使用最終值**：A/B/C/D 區步驟在 `applyShacklePostHooks` 之後推入，extremist / fusion_scale_apex / banality 等修改均已反映在 zone 倍率中，無需另設步驟也不會重複計算。
* **`order` 遺物支援**：有 `order` 遺物時推入合併步驟 `{ zone: 'AB', multiplier: tagA.multi + tagB.multi }`，與 finalMultiplier 公式一致。
* **`mediocre` 特殊處理**：觸發時清空 collector 並以單一 ×5.0 步驟取代，確保重建值恰好等於 `totalBase × 5.0 = finalScore`，zero jump。
* **Step 3 重建**：`calculateEngineScore` 回傳前，以 `running = totalBase` 跑過所有 collector 步驟（type:'multiply' 或 zone），填入精確的 `damageAfter`。
* **`calculateDamageSteps` 完全重寫**：原有 90 行手動重建邏輯全數移除，改為傳入 `collector` 呼叫 `calculateEngineScore`，函式縮減為 10 行。同時修正原有的 `isInitialRoll`/`turnsLeft` 參數錯位 bug（brink 遺物在步驟動畫中不出現的隱性問題）。
* **移除歷史遺留的 `isInitialRoll` 參數**：`calculateEngineScore` 函式簽名移除從未在函式體內使用的第六參數 `isInitialRoll`，同步清理 `main.js` 兩處呼叫點及 `calculateDamageSteps` 的呼叫，所有參數位置正確對位。

### Feat：弒神枷鎖、敵人名稱格式重構、#final-damage-preview 置中 [2026/05/05]
* **新增枷鎖「弒神」**：`data.js` SHACKLE_DB 末尾加入 `{ id: 'shackle_godslayer', difficulty: 'heavy', type: 'relic_suppress', suppressMythic: true }`；四語系補上對應翻譯（繁中「弒神」/「神話遺物無效化。」）。
* **engine.js 神話遺物壓制**：`calculateEngineScore` 與 `calculateDamageSteps` 各自在 isExploited 行後加入 `if (activeShackles.some(sh => sh.suppressMythic)) playerRelics = playerRelics.filter(id => !id.startsWith('fusion_'))`，使所有 fusion_ 遺物計算被跳過。
* **ui.js 逐步結算動畫標示**：`playDamageStepsAnimation` 開頭清除舊 `.mythic-suppressed` / `.mythic-suppress-icon`，偵測 suppressMythic 枷鎖後對所有 `data-relic-id` 開頭 `fusion_` 的遺物卡加上灰色遮罩與 🚫 圖示。
* **敵人名稱渲染改版**：`updateEnemyUI` 新增層數徽章（`第n層` / `n-m` 無限塔）與枷鎖稱號徽章（去除【】後顯示）；`enemyName` 類別補 `min-w-0` 防止 flex 溢出。
* **CSS**：新增 `.stage-layer-badge`、`.shackle-title-badge`、`.enemy-name-text`（text-overflow ellipsis）、`.mythic-suppressed`、`.mythic-suppress-icon`；`#final-damage-preview` 補上 `align-items: center; text-align: center;` 覆寫原有靠左設定。

### Feature：牌型重命名與新增 D 區特殊牌型 [2026/05/05]
* **牌型更名**：八重奏→比比丟八(ビビデバ)、大滿貫→彗星、葫蘆→南瓜馬車、中葫蘆→白馬、小葫蘆→南瓜，同步更新 `data.js`、`engine.js`、`ui.js` 及四語系 locale。
* **D 區標題**：各語系 `groupD_desc` 由「極端盤面/Extreme Board States/特殊盤面」統一改為「特殊牌型(繁/簡中)、Special Hands(英)、特殊役(日)」。
* **新增牌型 — 圓周率**：`data.js` groupD 新增 `圓周率`（desc: 3.1415, 倍率 x6.0）；`engine.js` 新增判斷：`counts[1]>=2 && counts[3]>=1 && counts[4]>=1 && counts[5]>=1`；四語系補上 `rule_d5` 翻譯（Pi / 円周率）。
* **新增牌型 — 斐波那契數列**：`data.js` groupD 新增 `斐波那契數列`（desc: 112358, 倍率 x8.0）；`engine.js` 新增判斷：`counts[1]>=2 && counts[2]>=1 && counts[3]>=1 && counts[5]>=1 && counts[8]>=1`；四語系補上 `rule_d4` 翻譯（Fibonacci / フィボナッチ数列）。

### Fix：歷史 Modal CSS 還原 Tailwind 滾動行為 [2026/05/05]
* **CSS `#history-modal > div`**：移除所有覆蓋（`max-height`、`display`、`flex-direction`、`overflow`），完全保留 Tailwind 預設。
* **CSS `#history-content`**：改為 `overflow-y: auto !important; overflow-x: hidden; flex-grow: 1; min-height: 0; padding: 0 !important;`，由此層承擔滾動。
* **CSS `.history-pb-sticky`**：新增 `position: sticky; top: 0; z-index: 10; background: #1c1b1d;`，使 PB 標頭固定在可捲動容器頂端。
* **CSS `.history-list-section`**：移除 `flex: 1; overflow-y: auto; min-height: 0`，改為純 `display: flex; flex-direction: column; gap: 8px; padding: 8px`（md: `1rem`/`0.5rem`），不再自行控制捲軸。

### Fix：歷史紀錄過濾條件放寬與存檔欄位補強 [2026/05/05]
* **`ui.js` `records.filter`**：條件放寬為 `r && typeof r === 'object' && Object.keys(r).length > 0`，不再依賴 `r.date > 0`（舊 ISO 字串格式無法通過數值比較），改由 map 內第一行 `if (!r.stageName && r.win == null) return ''` 作 fallback 排除空殼物件。
* **`ui.js` `.filter(Boolean)`**：在 `.reverse().join('')` 前插入 `.filter(Boolean)`，過濾 map 回傳的空字串，防止空白卡片渲染。
* **`main.js` `recordHistory`**：`date` 由 `new Date().toISOString()` 改為 `Date.now()`（數值時間戳），與 `new Date(r.date)` 建構子相容；`stageName` 加入 `|| '未知關卡'` fallback，確保三個必填欄位（`stageName`、`win`、`date`）永遠存在於存檔紀錄中。

### Fix：歷史 Modal Flex 布局精確修正 & 過濾條件強化 [2026/05/05]
* **CSS `#history-modal > div`**：新增 `display: flex !important; flex-direction: column !important; overflow: hidden !important;`，使外層容器成為 flex 父層，配合 `max-height: 85vh` 限高後由子元素自然分配高度。
* **CSS `#history-content`**：移除 `max-height: 85vh;`，改為 `flex: 1;`，讓內容區完整填滿外層 flex 容器剩餘空間，`overflow: hidden; min-height: 0;` 保持不變。
* **JS `records.filter`**：條件強化為 `r && typeof r === 'object' && r.date && r.date > 0 && (r.stageName || r.win === true || r.win === false)`，嚴格排除 null、非物件、date 為 0 或缺失的紀錄，並明確判斷 `win` 為 boolean 值而非 undefined。

### Fix：歷史紀錄空白項目過濾 & 遺物空白條清除 & Modal 滾動布局修正 [2026/05/05]
* **過濾無效歷史紀錄**：`renderHistory` 的 `records.map()` 前加入 `.filter(r => r && (r.stageName || r.win !== undefined) && r.date)`，防止空白或損壞資料渲染成空白卡片。
* **遺物空白條修正**：PB 區與歷史列表展開區的 `relics.map()` 在找不到 `relicDef` 時改回傳 `null`（原為空字串），並在 `.join('')` 前加入 `.filter(Boolean)`，徹底清除殘留空白 badge。
* **CSS Modal 布局修正**：`#history-content` 改為 `display:flex; flex-direction:column; max-height:85vh; overflow:hidden`，讓子元素能正確分配高度；`.history-list-section` 改用 `flex:1`（取代 `flex-grow:1`）、`gap:8px`、`padding:8px 0`，確保展開項目自然撐開父容器並觸發捲軸；`hist-det-{i}` 保持 `position:relative`（非 absolute），展開時正確推擠下方項目。

### Fix：歷史牌局展開顯示與滾動布局 [2026/05/05]
* **CSS 布局修正**：
  * `#history-modal > div` 限制 `max-height: 85vh`，避免 modal 超出螢幕。
  * `#history-content` 加入 `overflow-y: hidden; min-height: 0; padding: 0`，讓 flex 子元素能正確縮小並各自滾動（修復因缺少 `min-height:0` 導致展開內容被外層 `overflow:hidden` 截斷的根本原因）。
  * 新增 `.history-pb-sticky`（`flex-shrink:0`）與 `.history-list-section`（`overflow-y:auto; flex-grow:1; min-height:0`）兩個布局 class，實現「個人最佳紀錄固定頂部、歷史列表獨立滾動」。
* **展開詳情擴充**：展開欄改為 `position: relative`，以 Grid 2 欄排列顯示以下欄位（舊存檔缺漏欄位一律 fallback 顯示「-」）：
  * 關卡類型（一般 / 精英 / Boss / 無限塔）、最終傷害、最高倍率、觸發牌型、枷鎖名稱、持有遺物列表。
* **資料存檔擴充**（`main.js`）：`recordHistory` 新增 `stageType`、`highestMulti`、`shackle` 三個欄位；`player` 物件新增 `highestMulti` 追蹤，於每次攻擊結算時更新（與 `player.highestDamage` 同步機制）。

### 視覺：骰子背板枷鎖/BOSS 背景變色 [2026/05/05]
* **一般關卡有枷鎖**：骰子背板套用 `.board-shackled`（深紫紅放射漸層 + 3s 呼吸光暈動畫）。
* **無限塔第三關（BOSS）**：套用 `.board-shackled-boss`（暗血紅放射漸層 + 2s 快節奏呼吸動畫）。
* **無枷鎖 / 無限塔第1~2關**：移除所有變色 class，恢復預設深色背板。
* **實作**：`ui.js` 新增 `updateBoardBackground(level, shackleId)` 函式，由 `updateHeaderUI`、`updateEnemyUI`（含 DevMode 枷鎖切換）、`renderDice` 三處呼叫，確保進關與渲染時皆同步。`index.html` 骰子背板 div 加上 `id="board-panel"` 供快取取用。

### Bug Fix：健忘枷鎖 A~D 區隱藏 & 歷史牌局展開 [2026/05/05]
* **Fix【健忘】枷鎖未隱藏 A~D 區加成**：`engine.js` 新增 `isZoneMultiplierVisible(activeShackle)` 函式（amnesia 時回傳 false）。`ui.js` 的 `renderScore()` 在 A/B/C/D 四個牌型區格中加入 `isAmnesia` 判斷，生效時牌型名稱與倍率皆顯示為「???」；實際計算邏輯與逐步結算動畫（`countUpTo` 傷害數字跳動、`zone-active` 閃光）完全不受影響。
* **Fix 個人最佳紀錄遺物圖示破版**：移除對不存在之 `RELIC_DB[].icon` 與 `img/relic_placeholder.png` 的依賴，改以文字 badge（與歷史列表一致），並加入 `relicDef` 存在性檢查，缺失時回傳空字串，防止破版。
* **Fix 歷史牌局列表無法展開**：將每筆紀錄改為可獨立折疊的手風琴卡片，預設顯示結果與日期標頭，點擊後展開完整資訊（傷害、最高牌型、遺物列表）；`window._toggleHistoryEntry(idx)` 管理展開狀態，圖示同步切換 ▶/▼。舊存檔缺失欄位（`relics`、`combo`、`date`、`highestDamage`）均已加入 fallback 處理。

### 設定：逐步結算動畫開關 [2026/05/05]
* **新增「逐步結算動畫」開關**：在設定面板 SFX 音量下方新增切換開關（紫色 toggle），預設開啟，狀態存入 `localStorage` 的 `setting_stepAnimation` 鍵。
* **關閉時直接跳過**：若開關關閉，`main.js` 在呼叫 `playDamageStepsAnimation` 前直接取用 `steps` 陣列中 `final: true` 的步驟值更新 `finalScoreValue`，並立刻觸發 `doAttack`，完全省略所有動畫延遲，適合追求速度的玩家。
* **四語 i18n**：新增 `ui.setting_step_animation_label`（繁中：🎬 逐步結算動畫 / 簡中：逐步结算动画 / EN：Step Animation / JA：ステップアニメ）。

### 結算動畫：骰子點數飛行演出 [2026/05/04]
* **骰子點數總和飛行動畫**：逐步結算演出「歸零」後、「基礎點數」跳動前，新增一段飛行橋段：`#score-total-base-value` 的數字複製為浮動元素（`.dice-sum-fly`），以 CSS transition 從點數總和欄位飛向傷害數字位置，途中放大至 scale(1.4)，抵達後播放 `.dice-sum-fly--arrive` 淡出動畫（共 500ms），消失後傷害數字才開始跳動。若元素座標取不到則靜默跳過，不中斷流程。

### 枷鎖假象、紫底擊殺、逐步結算擴充 [2026/05/04]
* **假象（illusionary）枷鎖重做**：生效時主動顯示「真實傷害 × random(0.05~0.30)」的假數值（每回合開始時固定），血條預判條寬度亦依假值計算；攻擊確認後解除欺騙，顯示真實結算。透過 `_illusionaryFakeRatio` 模組變數管理，`engine.js` 新增 `setIllusionaryFakeRatio` / `clearIllusionaryFakeRatio`。
* **血條預判條擊殺紫底效果**：當預估傷害 >= 敵人當前 HP 時，`.damage-preview-bar` 套用 `.damage-preview-bar--lethal` class，背景轉為紫色並播放呼吸脈動動畫（`lethal-pulse`）；假象模式下以假值判斷，避免洩漏真實資訊。
* **逐步結算動畫擴充（A~D 牌型區）**：`calculateDamageSteps()` 改版，加入「歸零 → 基礎點數 → 遺物加乘 → A/B/C/D 區加乘（倍率 > 1.0 才播） → 最終傷害」完整步驟。各牌型區格加入 `id="zone-box-{X}"` 供動畫選取，亮起時套用青色 `.zone-active` 光暈，數字跳動採獨立 `.zone-multiply` 閃光動畫。

### 開發工具強化：Dev Mode 枷鎖編輯器 [2026/05/04]
* **Dev Mode 枷鎖編輯區塊**：在開發者模式面板內新增「🔒 枷鎖編輯」區塊，支援以下操作：
  * 顯示當前套用中的枷鎖（輕度橘色、重度紅色），並可一鍵移除。
  * 關鍵字篩選下拉選單（`<input>` 即時過濾），支援以 id 或名稱搜尋所有枷鎖。
  * 「套用枷鎖」按鈕，呼叫完整初始化流程（含 shackleMeta 生成、thalassophobia timer 等），等同正常進關效果。
  * 衝突警示：若已有枷鎖，套用時以紅字提示將覆蓋，但仍允許強制執行。
* **engine.js DEV ONLY API**：新增 `devApplyShackle(stage, shackleId)` 與 `devRemoveShackle(stage)` 兩支純函式，負責設定 `stage.activeShackle` / `shackleMeta`。
* **main.js 包裝**：`window.devApplyShackle` / `window.devRemoveShackle` 包含 timer 管理、UI 刷新與 saveGame，完整對接 engine API。
* **四語 i18n 完整支援**：新增 8 個 `ui.dev_shackle_*` 鍵值至 zh-tw、zh-cn、en、ja 四個語系檔。
* **安全限制**：所有 dev 功能僅在 dev modal（由 `triggerDevMode` 開啟）中可存取，正式玩家無法觸及。

### 視覺 UI 強化 Phase B (系統與動畫 System & Animation) [2026/05/04]
* **統一傷害可見性 API**：在 `engine.js` 中新增 `isDamageVisible`、`isEnemyHpBarPreviewVisible`、`getDisplayedEstimatedDamage` 等函式，並透過 `window.*` 暴露給 `ui.js`，移除原本散落於各處的 `bluff` 硬編碼判斷。
* **新枷鎖【煙幕】(shackle_smoke)**：輕型枷鎖，隱藏血條上的傷害預判條，但不影響中央傷害數字顯示。已加入四語翻譯。
* **新枷鎖【酒醉】(shackle_drunk)**：重型枷鎖，每 300ms 以 ±20% 隨機浮動顯示預估傷害數字，使玩家難以精準掌握輸出量。已加入四語翻譯及專屬 CSS 搖晃動畫。
* **遺物逐步結算動畫 (Balatro-style)**：攻擊時逐一點亮背包中的遺物圖示，傷害數字同步用計數動畫遞增至各遺物加成後的數值，最終觸發實際攻擊，大幅強化戰鬥爽感。

### 視覺 UI 強化 Phase A (Visual UI Polish Phase A) [2026/05/04]
* **血量預判條 (Damage Preview Bar)**：攻擊前於敵人血條右端顯示紅色閃爍預判條，直觀呈現本次預估傷害佔比。當預估傷害可擊殺敵人時，整條血條同步脈衝閃爍提示。
* **預估傷害金色高亮條件調整**：將傷害數字金色高亮的觸發條件從「倍率 > 50」改為「預估傷害 ≥ 敵人當前 HP × 50%」，更貼近實際戰況的壓迫感回饋。
* **敵人攻擊倒數視覺強化**：敵人倒數回合數字改以紅色大字搭配發光邊框呈現。倒數剩餘 1 回合時觸發脈衝縮放警示動畫，強化玩家的壓迫感體驗。

### 問題修正與體驗優化 (Fixes & UX Improvements) [2026/05/01]
* **多國語言介面修復**：修正了融合遺物上限警告介面的相關鍵值（ui.fusion_limit_title 等）未正確解析的問題；修正繁體中文語系下副標題顯示為簡體字的問題；優化語言切換機制，現在切換語言時不需重新載入頁面即可即時生效於所有開啟中的介面。並且修正了各語系下，融合遺物上限警告副標題中殘留 HTML 語法標籤（如 `<span class="text-red-400">`）的問題。
* **UI 錯誤修復**：修正 `js/ui.js` 中的一處 SyntaxError，導致頁面載入失敗的問題。
* **最高紀錄表修復**：修正歷史紀錄介面因為錯誤引用了全域變數 `window.RULE_DB` 與 `window.RELIC_DB`，以及存取陣列方法錯誤而無法開啟的 BUG。現在可以正常查看「個人最佳紀錄」了。

### 國際化 (i18n) 系統
* **多國語言支援**：全面升級支援四種語言（繁體中文、簡體中文、英文、日文）。
* **無縫切換**：新增語言選擇介面，支援即時切換介面文字而不需重新載入。

### 核心系統與玩法擴充
* **10 層關卡重製與節奏優化**：關卡總層數擴展至 10 層，並且統一所有敵人的攻擊回合限制為 3 回合，包含全新加入的後期強敵與菁英怪。
* **經濟系統改版**：更新金幣獲得邏輯。基礎金幣隨關卡層數遞增，且擊敗菁英或 Boss 時新增 15 金幣懸賞。
* **菁英獎勵機制**：擊敗菁英怪（第 3、6、9 層）後將直接獲得隨機遺物，並自動導入商店介面讓玩家整備。
* **靈魂奉獻 (Meta-progression) 系統**：新增局外永久升級。擊殺菁英或 Boss 會獲得「靈魂」，可於首頁購買初始 HP、起始金幣、商店折扣及重骰次數等升級選項。

### 遺物與卡牌機制
* **遺物融合系統 (Relic Fusion)**：加入 19 種全新的融合遺物，於商店中自動偵測組合併觸發。新遺物效果與稀有度「再生 (Rarity 5)」同步實裝。
* **牌型稀有度分級**：為所有牌型導入稀有度標籤（普通、稀有、史詩、傳說）。
* **天譴枷鎖重製**：【天譴】效果調整為「觸發傳說牌型時強制扣除 1 HP」。

### 錯誤修復 (Bug Fixes)
* **【破財消災】臭蟲修復**：修復了玩家被反傷裝甲「連殺」導致無敵狀態異常的 BUG。
* **狀態存檔修復**：修正了【絕對屏障】等枷鎖在遊戲重啟後會遺失「發動次數狀態」的 BUG，確保無敵狀態的判定正確寫入及讀取。

### 視覺與使用者體驗優化 (VFX/UI Polish)
* **遺物特效即時回饋**：背包中的遺物圖示現能根據盤面當前狀態，動態判定「觸發」或「黯淡」狀態並附加光效。
* **動態基礎點數標記**：受遺物加成的骰子現在會在右上角即時顯示當前的基礎點數標記。
* **戰鬥打擊感優化 (Hitstop)**：若單次攻擊造成敵人超過 20% 最大生命的傷害，將會觸發螢幕閃動的動態模糊與短暫的畫面停滯效果。
* **牌型共鳴光效**：結算時，根據組成牌型的不同區域（A區藍、B區綠、C區紫、D區金），對應骰子將亮起專屬顏色光環。

### 平衡性分析與模擬 (Simulation Report)
* **十萬次自動模擬**：新增 `scripts/simulate.js` 自動化對戰模擬腳本，用於評估遺物與牌型在 10 關新節奏中的強度。並產出了通關率、強弱勢遺物/牌型、以及枷鎖致死率分析報告 `V5_Simulation_Report.txt` 以供未來開發參考。

### V5 後期平衡性修訂 (Post-Simulation Balance Update)
* **敵人血量指數增長**：針對後期指數型成長的玩家火力，將第 3 關至第 10 關的敵人 HP 曲線重構（第 10 關最終 Boss 提升至 8,000,000 HP）。
* **枷鎖機制配置修正**：針對原本後期關卡缺乏枷鎖干擾的問題，已將「輕度」及「重度」枷鎖嚴格配置於所有的菁英與 Boss 戰（第 3、6、9、10 關）。
* **過強融合遺物削弱 (Nerfs)**：下修了在模擬中導致 100% 勝率的破格遺物計算公式。包含【孤傲戰神】（改為線性成長）、【泰坦之握】（改為固定加成）、【六道輪迴】與【等差死神】（係數調降）。
* **靈魂奉獻天賦擴充**：於局外天賦樹新增「初始裝備 (隨機獲得1件普通遺物)」以及「力量覺醒 (最終傷害最高 +50%)」兩項升級。

### 模擬器功能擴展 (Simulation Enhancements)
* **無天賦基準測試**：模擬器環境現已調整為「零靈魂奉獻天賦」的基準狀態，以更精準地評估遊戲的核心難度與玩家初始體驗。
* **傷害分層追蹤**：於模擬報告中新增了第 1、3、6、10 層的「平均傷害」統計數據，有助於後續針對不同時期的血量曲線進行精密微調。

### V5 血量曲線極限化與通關率調整 (Endgame Health Rebalance)
* **敵人血量極限膨脹**：為了匹配玩家破億的誇張傷害疊加，後段班敵人的血量進行了指數級暴增，第 10 層的創世神血量高達 500,000,000（五億）。這將迫使玩家專注於極限組合，並讓模擬勝率回歸至具挑戰性的 24% 基準。

### 平衡性極限檢定 (Simulation with Meta-Progression)
* **滿天賦難度實測**：模擬器重啟並載入了「靈魂奉獻全滿」的玩家狀態。在面對 5 億 HP 的終極創世神與重度枷鎖的考驗下，模擬器跑出了 79% 的極限通關率。這確認了即便玩家機體完全成型，深水區依然保有約 20% 的致死威脅（主要死因為反傷與 D 區倍率封印）。

### 無限塔機制重製與消耗品系統 (Infinite Tower Overhaul & Consumables)
* **雙重枷鎖挑戰**：無限塔的 Boss 戰（每 3 層）將強制附帶「1 個重度枷鎖 + 1 個輕度枷鎖」，極限壓榨成型玩家的生存空間。
* **回合數壓縮**：無限塔的所有戰鬥回合數由 5 回合緊縮至 **3 回合**，統一遊戲的高壓節奏。
* **新增消耗品機制**：解決了後期遺物買空後金幣無用武之地的問題。現在商店會常態販售【力量藥劑】(單局傷害 x1.5)、【潛能秘藥】(永久基礎點數 +50) 以及【生命紅藥】(回復 1 HP)，讓玩家能無極限地將金幣轉化為戰鬥力。
* **溢位防護與靈魂掉落**：加入了 JS 安全整數 (`Number.MAX_SAFE_INTEGER`) 的傷害與血量天花板，防止無窮大 Bug。無限塔中每擊敗一隻敵人即可獲得 1 個靈魂，增加後期刷首頁天賦的動力。

### 錯誤修復 (Bug Fixes)
* **商店遺物池修復**：修正了商店會直接刷出「再生」稀有度（Rarity 5，本應為融合專屬）遺物的問題，確保融合限定遺物只能透過素材合成取得。

### 更新與修正 (Update)
- 【存錢筒】: 移除戰鬥中每次重骰需扣除1枚金幣的懲罰。
- 【賞金獵人】: 1回合內秒殺敵人的額外獎勵下修為 10 金幣。
- 【幸運金幣】: 戰鬥結算獎勵金幣下修為 +10。
- 【VIP會員】: 商店折扣比例從 20% 下修至 10%。
- 【登峰造極】 (合成遺物): 修正描述與成長邏輯為「每 15 金幣，基礎點數 +3」。
- 【回收領主】 (合成遺物): 移除對戰鬥的直接增傷效果，並將刷新商店從「免費」改為「折扣 3 金幣 (最低1金幣)」，同時保留商店購物 30% 折扣。
- 【黃金守財奴】 (合成遺物): 移除免費重骰的效果，僅保留複利傷害加成。


### 歷史牌局與多國語言修復 (History PB & i18n Fixes)
* **個人最佳紀錄 (Personal Bests)**：在歷史牌局介面新增了「個人最佳紀錄」區塊，會永久記錄並顯示玩家在所有牌局中達成的「最高傷害」、「最高倍率」、「最佳牌型」、「最終持有遺物」以及「最高無限層數」。
* **多國語言介面修復**：修正了歷史牌局標題、收集冊頁籤（牌型、遺物、枷鎖）、戰鬥計分板文字（如「剩餘資源加成」）、以及部分牌型名稱在非繁體中文語系下未正確翻譯並顯示為預設中文的錯誤。

### 問題修正與體驗優化 (Fixes & UX Improvements)
* **多國語言修復**：修正首頁收集冊中「未解鎖」系列文字未正確切換的問題，並補齊了英、日、簡中等語系中遺失的「同花順」、「刷新幣」等遺物翻譯。
* **按鈕邏輯優化**：擊敗第 10 關 BOSS 後，現在會同時顯示「進入無限塔」與「回到標題畫面」按鈕，讓玩家能自由選擇結束該局。
* **五福中天邏輯重構**：修正了【五福中天】遺物錯誤地把倍率套用到「全局最終倍率」的問題。現在它會真實追蹤並累加盤面上曾擲出的「5」的次數，並將倍率正確地限定在僅對「4」和「5」的單顆骰子生效。

* **多國語言介面修復**：修正了日文語系下設定介面相關字串（如「遊戲設定」、「音樂音量」等）遺失未翻譯，導致介面顯示變數名稱的問題。
2026-05-07 - 新增17種新消耗品、調整生命紅藥稀有度至3、商店過濾最多一個幸運草系列道具、並新增各語系消耗品翻譯。


### Fix：手機版瀏覽器敵人倒數 UI 抖動修復 [2026/05/08]
* **敵人倒數動畫重構**：移除了 `.countdown-urgent` 狀態下 `@keyframes countdown-pulse` 產生的 `transform: scale` 動畫，改用強度更高的 `text-shadow`、`box-shadow` 與 `background` 脈衝發光效果替代。此修改徹底解決了部分手機瀏覽器（如 Chrome on Sony Xperia）因動畫引發的佈局重繪 (reflow) 而導致的嚴重 UI 抖動與跳動問題。

### 無盡之塔 PB 追蹤修復與標題畫面音效 [2026/05/08]
* **無盡之塔最高層數 PB 追蹤修復**：修正了 `js/main.js` 中 `recordHistory` 未正確追蹤與儲存玩家在無盡之塔所達到的最高層數。現在會精確計算當前層數，並在超越歷史最高時存入 localStorage 的 `bibbidiba_pb_infinite` 鍵中。
* **歷史牌局介面更新**：更新了 `js/ui.js` 的 `renderHistoryModal`，現在會直接從 localStorage 讀取 `bibbidiba_pb_infinite` 的值，並確保在介面的「最高無限層數」區塊中以「PB: Floor {0}」的格式清楚顯示。
* **標題畫面全域點擊音效**：為 `UI.el.titleScreen` 加上全域 click 事件監聽，當玩家點擊任何按鈕（`e.target.closest('button')`）時，會主動觸發 `Audio.initAudio()`（解鎖 AudioContext）並播放 `Audio.playClickSound()`，強化遊戲初始回饋感。

### 新增
- 實裝「響應式縮放」外觀系統：現在遊戲畫面會自動縮放以適應螢幕大小與 iframe 環境，確保不會有裁切與跑版問題。

### 牌型稀有度修正與 UI 排序統一 [2026/05/15]
* **修正 `RULE_DB` 稀有度數值**：調整了 groupC 的「白馬」、「平胡」(2→3) 與「順碰交響曲」、「雙三連順」(1→2) 以及 groupD 的「全異」(2→3)、「絕對二進位」、「絕對質數」(3→4) 的稀有度 (rarity)。
* **UI 列表遞減排序**：確保「規則說明」(`renderRulesDB`) 與「收集冊手牌」(`renderCollectionModal`、`fallback` 渲染) 等 UI 面板皆統一依照牌型稀有度進行遞減排序 (最高稀有度排在最上面)。
* **多語系映射對齊**：在進行陣列排序時，引入原始索引 `origIdx` 以正確映射 `i18n.t()` 的多語系文案，防止排序後顯示錯誤的牌型名稱與描述。

### Fix & Feature：靈魂奉獻升級重骰套用修復與開發者除錯工具 [2026/05/08]
* **Fix (Bug)**：修復 `Soul Tribute` 中購買「初始重骰次數」與持有消耗品 `【巧手指南】(cons_guide)` 未在戰鬥開始時正確套用的問題。`initNewGame` 現會正確將 `metaData.upgrades` 寫入 `player.soulUpgrades`，且 `startTurn` 內的 `baseMaxRolls` 會完整計算升級與遺物加成。
* **開發者工具 (鍵盤秘技)**：新增全域 `window` 層級的作弊代碼：
  - 輸入 `8989889` 觸發 `window.devKillEnemy()` 直接將敵人 HP 歸零並進入結算。
  - 輸入 `ss` 後接 8 位數字 (例如 `ss12345678`) 觸發 `window.devSetDice(digits)` 強制設定盤面骰子。
* **開發者面板擴充 (UI)**：於現有的「⚙️ 開發者模式」(`#dev-modal`) 中新增【戰鬥工具】區塊，提供【秒殺當前敵人】與【自訂骰面】的圖形化操作介面。
* **手機端秘技入口**：於 `#settings-modal` 的標題文字「⚙️ 遊戲設定」上實作了 5 次連續點擊 (2秒內) 的隱藏觸發器，以利手機開發環境免鍵盤開啟 `#dev-modal`。

## [2.1.2] - 2026-05-08
### UI 改進
- 優化了 `showHandNamesPreview()` 的動畫顯示，現在會根據牌型稀有度進行排序並分層顯示。最後一個（最高稀有度）牌型會保留原本的淡入淡出動畫，而其餘牌型則套用全新的向上浮動飄走動畫（`.hand-float-away`），增加視覺層次感。

### 修復
- 修復 `js/i18n.js` 中多語系物件解析錯誤的問題，透過合併展開 `ui` 物件確保開發者工具相關文字正確顯示。
- 修復開發者工具中的戰鬥控制功能 (`devKillEnemy` 與 `devSetDice`) 在 `WAIT_ACTION` 狀態下無法使用的問題。
- 修復使用開發者工具手動設定骰子時 (`devSetDice`) 未重新計算預估傷害分數的問題，現在會動態觸發引擎計分並更新 UI。
- 修復開發者模式面板（Dev Modal）中的按鈕在部分瀏覽器或載入時機下沒有反應的問題。這藉由移除 `DOMContentLoaded` 事件監聽器並直接綁定 DOM 元素的 `onclick` 事件（如 `btnDevKill`、`btnDevDice`、`inputDevDice` 與 `btnDevGetAll`）來解決。

### 修復商店於遺物池空時跳過問題 [2026/05/08]
* **Fix (Bug)**：修復在獲得所有遺物後商店會直接被跳過的問題。現在商店無論遺物池是否耗盡都會開啟，確保玩家能持續購買消耗品。

### 新增
- 商店介面左上角現在會預覽顯示「下一關」的關卡進度與層數，並新增對應的多國語系翻譯鍵 (`next_stage`)。

### 修復
- 修復了商店購買「幸運草」系列消耗品時不會生效的 Bug，現在購買後會正確存入遺物背包，並在下一次戰鬥的初始擲骰時強制鎖定指定點數，同時消耗該道具。

## [2.1.2] - 2024-05-14
### 修復 (Fixes)
- **無限塔文字**: 修正無限塔模式中擊敗 Boss/Elite 掉落遺物時，提示文字無法正確顯示在地化怪物名稱，而會顯示原始語系檔 Key 的問題。
- **枷鎖幻象**: 修復「幻象」枷鎖發動時，骰子圖片依然顯示真實數字的視覺問題。
- **音樂系統**: 解決背景音樂在載入淡入期間若被玩家手動靜音，仍會持續播放的錯誤。
- **UI 抖動**: 修復在重骰（reroll）時，骰子跳動動畫因超出邊界導致的 `#board-panel` 視覺拉伸與元素推擠問題。

### Fix：預估傷害大數字自動縮放 [2026/05/16]
* **`js/ui.js`**：新增 `setFinalScoreText()` 與位數判斷，當傷害數字達 10 位、12 位、14 位以上時自動套用縮小字級；`renderScore()`、歸零狀態與 `countUpTo()` 動畫跳數都改走同一套顯示邏輯，避免動畫中途再次超出畫面。
* **`css/style.css`**：新增 `damage-digits-long`、`damage-digits-xl`、`damage-digits-xxl` 三段 `clamp()` 字級，覆蓋原本 inline 字體大小，讓超長傷害值仍留在預覽框內。
### 新增：四語系隨機遊玩截圖壓測腳本 [2026/05/23]
* **`scripts/capture-random-locale-playtest.js`**：新增 Playwright 壓測腳本，可對 `zh-tw`、`zh-cn`、`en`、`ja` 各跑 100 場隨機流程，並從 400 場中隨機抽取 100 張 `540x960` 截圖。
* **產出**：本次截圖輸出於 `promo/steam/playtest-random-screenshots/2026-05-22T19-32-02-517Z/`，共 100 張，並附 `report.json`。
* **驗證**：腳本執行完成，總場次 400，截圖 100，errorCount 0。

### 修正：新手教學訊息框超出視窗 [2026/05/23]
* **`js/ui.js`**：修正教學訊息框定位，改用 `visualViewport` 量測可視範圍，並把遊戲容器 `scale()` 造成的座標差換算回容器內座標，避免 Steam 直式視窗中訊息框被放大後超出右側或底部。
* **`css/style.css`**：補上教學訊息框的 `box-sizing`、視窗寬高限制與內部捲動，避免長文字或較小視窗下被裁切。
* **驗證**：`node --check js/ui.js`、`node --check js/main.js` 通過；`npm.cmd run steam:build` 通過；Playwright 量測新手教學 step0-step4 於 `540x960` 視窗內皆未超出可視範圍。

### 修改：統一標題畫面底圖 [2026/05/23]
* **`img/title_bg.png`**：新增遊戲內標題畫面背景圖，來源為 `promo/steam/assets/library_capsule_600x900.png`，讓開發版、itch.io 與 Steam Demo 都能使用同一份正式主視覺。
* **`css/style.css`**：將 `#title-screen::before` 的背景圖由 `img/home_bg.webp` 改為 `img/title_bg.png`。
* **`index.html`**：將 Open Graph / Twitter 預覽圖同步改為 `img/title_bg.png`。
* **`scripts/capture-steam-portrait-screenshots.js`**：商店截圖合成背景改用 `dist/steam-demo/img/title_bg.png`，避免後續截圖仍吃舊首頁圖。
* **驗證**：`node --check scripts/capture-steam-portrait-screenshots.js` 通過；`npm.cmd run steam:build` 通過，`dist/steam-demo/img/title_bg.png` 已產生；已輸出標題確認截圖 `promo/steam/screenshots/current_title_bg_540x960.png`。
### 修正：Steam 直式版特效定位與離線字體堆疊 [2026/05/23]
* **`js/ui.js`**：新增以 `#game-container` 實際畫面矩形為基準的座標計算，讓跳出訊息與通關灑花在 Steam 桌面直式視窗中對齊遊戲畫面中心，而不是整個 Electron 視窗中心。
* **`js/main.js`**：移除敵人扣血數字的雙重位移來源，並依傷害文字長度套用較小字級，避免大數字跑出敵人欄。
* **`css/style.css` / `index.html`**：改用離線可用的繁中 UI 字體堆疊與數字字體堆疊，移除不存在的 `Space Grotesk` inline 字體設定。
* **驗證**：`node --check js/ui.js`、`node --check js/main.js`、`npm.cmd run steam:build`、`npm.cmd run steam:package:verify` 通過；Playwright 量測確認 toast 與傷害數字均在遊戲容器內且水平置中。
