### 宣傳：完成 Steam 正式版四語快速節奏 Shorts [2026/06/30]
* **四語正式版**：完成英文、日文、簡中、繁中四支約 13 秒直式影片，全部改用各語系實機錄影；節奏統一為「第一秒破億傷害 → 鎖定／重擲 → 牌型效果 → 遺物構築 → 破億結算 → Steam 立即遊玩」。
* **在地化合成**：`promo/social/steam-launch-short/index.html` 新增四語文案與語系切換；`assets/gameplay/{locale}/` 各保留 6 段 1080×1920、60fps 遊戲素材，`scripts/prepare-active-locale.cjs` 負責切換目前輸出語系。
* **正式輸出**：新增 `previews/bibi_dice_steam_launch_en_1080x1920.mp4`（17,014,686 bytes）、`bibi_dice_steam_launch_ja_1080x1920.mp4`（16,097,200 bytes）、`bibi_dice_steam_launch_zh-cn_1080x1920.mp4`（15,169,875 bytes）、`bibi_dice_steam_launch_zh-tw_1080x1920.mp4`（16,418,816 bytes）。
* **輸出規格**：四支皆為 H.264、1080×1920、60fps、AAC 48kHz 雙聲道，長度 `13.034667` 秒；片尾分別使用 `PLAY NOW`、`今すぐプレイ`、`立即游玩`、`立即遊玩`。
* **片尾修正**：日文與簡中來源原本會在 CTA 後段閃白或露出主選單，已改為先保留標題粒子動態，再定格於完整主視覺；四語最終接觸表均確認 CTA 全程清楚且無轉場穿幫。
* **驗證**：HyperFrames lint 0 error／0 warning、validate 無 console error、inspect 0 layout issue；四支正式 MP4 均通過 FFmpeg 全片解碼，並以 `ffprobe` 確認影像與音訊規格。
* **範圍控制**：未修改遊戲原始碼、Steam／itch.io Build、商店頁或 YouTube；尚未上傳或發布影片。

### UI：加入正式版導購區塊（Demo / itch 版） [2026/06/30]
* **`js/locales/*.js`**：四語系新增 6 個導購文字 key（`promo_title_label/desc/btn`、`promo_win_label/desc/btn`）；`steam:i18n:verify` 通過。
* **`index.html`**：標題畫面底部加 `#promo-title-card`（小型導購卡）；通關畫面 `#end-overlay` 加 `#promo-win-card`（較醒目導購卡）；預設 `hidden`，由 JS 依版本控制顯示。
* **`css/style.css`**：新增 `.promo-card` 系列樣式。
* **`js/ui.js`**：新增 `initPromo()`（讀取 body class 決定是否顯示標題卡）、`showPromoWinCard()`、`hidePromoWinCard()`。
* **`js/main.js`**：`bootGame()` 呼叫 `UI.initPromo()`；`gameWin()` 呼叫 `UI.showPromoWinCard()`；`gameOver()` 呼叫 `UI.hidePromoWinCard()`。
* **`scripts/publish-itch.ps1`**：打包時注入 `itch-build` class，使 itch 版顯示導購。
* **`steam-app/preload.js` / `main.js`**：新增 `electronAPI.openExternal`，白名單限 `store.steampowered.com`，Steam Demo 按鈕安全開啟商店頁。
* **版本邏輯**：`steam-portrait` → 顯示（Steam Demo）；`itch-build` → 顯示（itch.io）；兩者皆無 → 隱藏（正式版 / 開發）。

### 宣傳：完成 Steam 正式版繁中快速節奏 Shorts 草稿 [2026/06/30]
* **新錄影盤點**：檢查 `promo/steam/trailer/raw-captures/` 共 23 支錄影；繁中 7 支、英文 6 支、日文 5 支、簡中 5 支，全部為 1920×1080、60fps、AAC 48kHz 雙聲道。四語皆具備高傷害、重擲、牌型演出、通關與標題畫面；繁中另有商店／遺物與挑戰失敗素材。
* **新宣傳專案**：新增 `promo/social/steam-launch-short/` HyperFrames 合成，將繁中錄影裁切為 9:16，依「172,800,000 高傷害 → 重擲 → 兩極牌型 → 商店遺物 → 破億神局 → Steam 立即遊玩」編排約 13 秒快速節奏。
* **正式版 CTA**：結尾改為 `正式版現已推出`、`立即遊玩` 與 `store.steampowered.com/app/4792230`；前 10 秒不顯示大型商業 CTA，讓玩法與傷害先吸引觀眾。
* **繁中草稿**：輸出 `promo/social/steam-launch-short/previews/bibi_dice_steam_launch_zh-tw_draft.mp4`，H.264、1080×1920、30fps、AAC 48kHz 雙聲道、長度 `13.034667` 秒、檔案大小 `6,047,992` bytes。
* **驗證**：HyperFrames lint、validate、inspect 全流程通過；保留 5 項靜態分析無法解析迴圈選擇器的 GSAP 重疊警告，以及 4 項雙行標題文字區域警告，快照與最終接觸表已確認實際畫面無重疊、無離框。最終 MP4 完整解碼無錯誤，並以 `ffprobe` 確認影像與音訊規格。
* **範圍控制**：未修改遊戲原始碼、Steam／itch.io Build、商店頁或 YouTube；既有四語 Shorts 與舊草稿均保留。

### 宣傳：完成 Steam 商店影片英文直式草稿 [2026/06/30]
* **草稿方向**：以既有 `promo/steam/trailer/bibi_dice_demo_trailer_final_2026-06-05.mp4` 為剪輯基底，完整保留 42 秒原片節奏、音樂與玩法演出，裁切中央直式遊戲區為 YouTube Shorts 1080×1920 版面。
* **英文重點**：依序呈現 `ROLL 8 DICE / BREAK THE DAMAGE LIMIT`、`CHAIN PATTERNS / STACK MULTIPLIERS`、`CHOOSE RELICS / CHANGE YOUR BUILD`、`CLEAR 10 FLOORS / CLIMB EVEN HIGHER`，結尾補上 `WISHLIST NOW / ON STEAM`。
* **暫時遮罩**：因目前來源已燒錄繁中文字，草稿以局部模糊與紫黑壓暗處理暫時覆蓋；待製作人提供移除特效中文字的乾淨版後，四語正式版將取消遮罩，沿用相同剪輯與字幕節奏。
* **輸出與驗證**：新增 `previews/bibi_dice_steam_trailer_en_vertical_draft.mp4`；已用 `ffprobe` 確認為 H.264、1080×1920、30fps、AAC 48kHz 雙聲道、長度 `42.200` 秒，並抽查五個關鍵畫面確認玩法數字、英文重點與 Steam CTA 可讀。
* **範圍控制**：未修改遊戲原始碼、Steam／itch.io Build、商店頁或 YouTube 發布狀態；既有 12 秒四語 Shorts 與草稿均保留。

### 宣傳：完成 Steam 四語系 Shorts 正式版 [2026/06/29]
* **`promo/social/itch-overseas-short/index.html`**：將既有 12 秒直式短片改為 Steam-first 架構，新增 HyperFrames `locale` enum 變數，可用同一份動畫切換英文、日文、簡中、繁中；畫面 CTA 統一改為 Steam 願望清單，itch.io 免費 Demo 改留在社群文案作為次要導流。
* **四語素材**：新增 `assets/images/ja/`、`assets/images/zh-cn/`、`assets/images/zh-tw/`，複製 Steam 說明圖來源中的 `01_title.png`、`03_combo_preview.png`、`08_highlight_moment.png`，讓各語系短片背景 UI 與畫面文案一致。
* **貼文文案**：更新英文 `POST_COPY_EN.md`，新增 `POST_COPY_JA.md`、`POST_COPY_ZH_CN.md`、`POST_COPY_ZH_TW.md`，四語皆以 Steam 願望清單為主 CTA，並保留 itch.io 免費瀏覽器 Demo 作為次要連結；UTM 依平台與語系拆分。
* **正式輸出**：製作人已確認四支 draft 預覽無重大問題，正式輸出 `bibi_dice_steam_short_en_1080x1920.mp4`、`bibi_dice_steam_short_ja_1080x1920.mp4`、`bibi_dice_steam_short_zh-cn_1080x1920.mp4`、`bibi_dice_steam_short_zh-tw_1080x1920.mp4`；四支皆為 H.264、1080×1920、60fps、AAC，長度 `12.032` 秒。
* **驗證**：`npm.cmd run check` 通過（lint 0 error、validate 無 console error、inspect 0 warning；保留既有單檔過大警告）；四語 draft render 均成功，並抽樣輸出 contact sheet 確認文字可讀、CTA 為 Steam。正式高品質 render 完成後以 `ffprobe` 確認四支皆為 1080×1920、60fps、`12.032` 秒。阿扣 `claude.exe auth status` 顯示已登入，但正式唯讀呼叫仍回傳 `401 Invalid authentication credentials`，本輪已記錄後由 Codex 繼續執行。

### 宣傳：完成 itch.io 海外曝光直式短片 [2026/06/28]
* **`promo/social/itch-overseas-short/`**：新增 12 秒英文直式宣傳短片專案，沿用英文遊戲截圖、原 BGM、擲骰與攻擊音效，以「8 顆骰子 → 4 個倍率區 → 48 億傷害 → itch.io 免費遊玩」四段節奏呈現。
* **輸出規格**：完成 `bibi_dice_itch_overseas_short_en_1080x1920.mp4`；H.264、1080×1920、60fps，AAC 48kHz 雙聲道，實際長度 `12.032` 秒。
* **海外文案**：新增 `POST_COPY_EN.md`，提供 YouTube Shorts、Threads、X 三組英文貼文與分平台 UTM 連結。
* **驗證**：HyperFrames lint、runtime／對比驗證與 15 點畫面檢查皆為 0 錯誤、0 警告；完成四個主畫面快照與動畫地圖審查。未修改遊戲程式、建置內容或玩家存檔。

### 營運：itch.io 海外曝光與搜尋資訊優化 [2026/06/28]
* **分類資料**：補齊滑鼠／鍵盤輸入、每局數分鐘、英文／日文／簡中／繁中與互動式教學；單人遊戲人數維持 `1`。
* **搜尋資訊**：短介紹改為海外玩家導向文案；標籤移除不準確的 `isometric`，新增 `high-score`、`turn-based-combat`、`fantasy`，公開頁共保留 9 個精準標籤。
* **商店頁內容**：既有傷害 GIF 移到英文首句後方，新增完整日文介紹並保留英文與繁中內容；未修改遊戲程式、HTML Build 或瀏覽器存檔。
* **導流連結**：新增帶 itch.io UTM 的 Steam 商店連結，以及 YouTube、Threads、X 外部連結。
* **海外社群宣傳**：itch.io `Release Announcements` 英文 Browser 主題已通過版主審核並公開，包含遊戲摘要、UTM 遊玩連結、功能重點、回饋問題與 `137,149,200` 傷害 GIF；公開網址為 `https://itch.io/t/6546891/free-browser-demo-roll-8-dice-stack-4-multiplier-zones-break-the-damage-counter-bibi-dice`。
* **驗證**：公開頁已讀回新的 meta description、9 個標籤、英／日／繁中內容、首句後方 GIF 與 4 個外部導流連結；開發日誌封面因 Codex 內建瀏覽器不支援本機檔案上傳而未變更，文章內容與附件保持原狀。

### 發佈：itch.io 同步至 Steam Demo Build 23496399 [2026/06/28]
* **itch.io `html` 頻道**：由第 13 版更新至第 14 版；butler Upload `#17558645`、Build `#1756725` 已完成處理並上線。
* **`dist/itch/index.html`**：僅替 `<body>` 補上 `steam-portrait` class；未上傳目前較新的原始碼，也未夾帶 Demo 包內的 `.nojekyll`、`_config.yml`、`FULL_VERSION_ROADMAP.md`、`SYNC.md`。
* **驗證**：發佈前逐檔 SHA256 比對與 butler push preview 均確認只有 `index.html` 需更新；發佈後重新抓取線上版本，45/45 個 runtime 檔皆與已安裝的 Steam Demo BuildID `23496399` 完全一致。
* **開發日誌**：公開發佈〈現在，瀏覽器版也同步 Steam Demo 了！〉，以玩家角度說明直式版面同步與既有瀏覽器進度保留，並附上第 14 版 HTML Build；公開網址為 `https://leijoa.itch.io/bibi-dice/devlog/1566826/-steam-demo-`。

### Steam：完成四語系圖文商店說明草稿 [2026/06/27]
* **`scripts/generate-steam-description-assets.js`**：新增 Steam 說明圖產生流程，依繁中、簡中、英文、日文輸出教學引導、UI 導覽、牌型、遺物、神話牌型與結算卡共 6 組、24 張 WebP。
* **`scripts/capture-steam-portrait-screenshots.js`**：新增截圖語系、暫存目錄與僅擷取說明素材模式，避免重產說明圖時覆寫正式商店截圖。
* **`promo/steam/description/`**：新增四語系說明圖片、來源截圖與繁中整頁預覽；UI 導覽圖以編號、框線與連接線精確標示 11 個實際介面區域。
* **Steamworks**：24 張圖片已上傳至 Base Game AppID `4792230`，英、日、簡中、繁中「關於此遊戲」皆依教學、UI 導覽、牌型、遺物、神話、結算順序插入 6 張圖片並儲存草稿；未公開發佈。

### Steam：新增首發商店高光截圖 [2026/06/26]
* **`scripts/capture-steam-portrait-screenshots.js`**：截圖流程由 6 張擴充為 9 張，新增神話牌型演出、破億神局精彩時刻與通關結算卡三種首發賣點畫面；結算卡截圖使用拍照用緊湊排版，不影響玩家實際遊戲 UI。
* **`scripts/verify-steam-assets.js`**：將 3 張新截圖納入 Steam 資產尺寸檢查。
* **`promo/steam/assets/`**：重產 `store_screenshot_01` 至 `store_screenshot_09`，新增 `store_screenshot_07_mythic_hand_1920x1080.png`、`store_screenshot_08_highlight_moment_1920x1080.png`、`store_screenshot_09_result_card_1920x1080.png`。
* **驗證**：`node --check scripts\capture-steam-portrait-screenshots.js`、`node --check scripts\verify-steam-assets.js`、`npm.cmd run steam:capture`、`npm.cmd run steam:assets:verify` 通過；Steam 資產檢查結果為 19 項必備資產、0 項禁用資產。

### 資料：重產完整傷害表 [2026/06/26]
* **`alldamege.csv`**：依目前 `engine.js` 重新產生 6435 種非遞減骰面組合，表內已同步彗星 `x40`、全異 `x15`，並保留 UTF-8 中文表頭。
* **驗證**：確認總行數為 6436（表頭 + 6435 組），`12345678` 為 `彗星(x40) + 雙四連順(x22) + 全異(x15)`，總倍率 `13200`、最終傷害 `475200`。

### 平衡：彗星升格神話與全異倍率下修 [2026/06/26]
* **`js/data.js`**：彗星由 `x30 / rarity 4` 調整為 `x40 / rarity 5`，正式升格為神話牌型並套用神話牌型滿版演出；全異由 `x18` 調整為 `x15`。
* **`js/engine.js`**：同步調整實際戰鬥結算倍率，避免牌型表與傷害計算不一致。
* **驗證**：直接呼叫 `calculateEngineScore()` 測試 1~8 盤面，確認 `tagB=彗星 x40`、`tagD=全異 x15`，且 `RULE_DB.rule_b0.rarity=5`；`node --check`、四語系 668 keys、`steam:verify`、`steam:package:verify` 通過。

### UI：神話牌型滿版立繪演出 [2026/06/26]
* **`js/ui.js`**：牌型揭示流程中，最後揭示的最高牌型若為 rarity 5，改觸發滿版 `mythic-hand-reveal`；牌型名稱逐字出現，並依規則滑入角色立繪，A 區／比比丟八使用雷爪獅，其它神話牌型使用捧夠。
* **`css/style.css`**：新增神話牌型專屬暗化、魔力光暈、斬擊線、角色滑入、直排逐字顯示與戰鬥區域震撼效果；英文牌型自動改橫排，避免字母直排。
* **`img/characters/`**：新增雷爪獅與捧夠去背立繪 `thunderclaw-lion-cutout.png`、`pongo-cutout.png`。
* **`js/locales/ja.js`**：日文版 8 顆相同牌型名稱與高光標籤統一改為「ビビデバ」。
* **驗證**：Electron 實測比比丟八會顯示雷爪獅與逐字「比比丟八」，雙子星會顯示捧夠；日文 locale 下 `rule_a0` 與演出標題皆為「ビビデバ」；`node --check`、四語系 668 keys、`steam:verify`、`steam:package:verify` 通過。

### UI：破億神局滿版高潮演出 [2026/06/26]
* **`js/ui.js`**：當高光 tags 包含 `damage_100m` 時，不再使用一般短橫幅，改觸發滿版 `highlight-epic-overlay`；主標固定顯示「破億神局」，並同步顯示本次傷害與其他高光標籤。
* **`css/style.css`**：新增 5 秒滿版高光演出，包含大字彈出、爆光、衝擊波、放射粒子與戰鬥區域強化震撼效果，讓玩家有足夠時間看清楚與截圖。
* **驗證**：Electron `540x960` 實測 overlay 動畫 5 秒且 3 秒後仍存在；`450x800` 小視窗確認標題與傷害數字皆未溢出；`node --check`、四語系 668 keys、`steam:verify`、`steam:package:verify` 通過。

### UI：調整結算精彩時刻卡片與遺物排列 [2026/06/26]
* **`js/locales/zh-tw.js`**：將結算卡左上標籤由「本局高光」改為「精彩時刻」。
* **`js/ui.js` / `css/style.css`**：將結算卡的最終持有遺物改成 2 至 3 欄自動換行顯示，移除橫向捲動，讓截圖一次看完整遺物清單。
* **`index.html` / `css/style.css`**：收緊 Game Over / 勝利結算畫面的上下空白，放寬精彩時刻卡片寬度與高度，避免遺物列表被壓扁。
* **驗證**：`540x960` Electron 實測 18 個遺物為 3 欄 grid、無橫向溢位；`node --check`、四語系 668 keys、`steam:verify`、`steam:package:verify` 通過。

### 開發者模式：新增扣血與剩餘回合控制 [2026/06/26]
* **`index.html`**：開發者模式的「戰鬥控制」區新增「扣自己 HP」數字輸入與按鈕，以及「敵人剩餘回合變 1」按鈕，方便測試一血逆轉、最後回合斬殺與破億神局等高光條件。
* **`js/main.js`**：新增 `window.devDamagePlayer(amount)` 與 `window.devSetEnemyTurnsOne()`；扣血最低保留 1 HP，兩個功能都會重算當前分數並刷新畫面，避免 HP／剩餘回合相關倍率顯示不同步。
* **`js/locales/*.js`**：新增開發者按鈕與 toast 文字，四語系 key 同步。
* **驗證**：以臨時 Electron user data 實測 dev 按鈕 onclick；扣自己 2 HP 後 toast 顯示目前 `1/3`，敵人剩餘回合成功變為 1，分數重新刷新。

### Bug 修正：D 區「兩極」有效牌型不再變暗 [2026/06/26]
* **`js/ui.js`**：將牌型區塊的「有效顯示」與「骰子 matchedGroups 高亮」拆開判斷；只要 D 區已有有效牌型，就不再因 `matchedGroups.D` 缺失而套用 disabled 暗色樣式。
* **`js/main.js`**：`window.setHighlight('D')` 不再強制要求骰子具備 `matchedGroups.D`，避免 D 區特殊盤面牌型被點擊保護條件擋下。
* **驗證**：以臨時 Electron user data 開新局並 `devSetDice('11111111')`，確認 A 區為「比比丟八」、C 區為「雙子星」、D 區為「兩極 x60.0」，且 D 區沒有 `opacity-40` / `text-slate-500` disabled 樣式。

### 玩法傳播：神局判定、結算炫耀卡與最後一擊高潮 [2026/06/26]
* **`js/main.js`**：新增神局判定層，於攻擊結算時辨識比比丟八、四區共鳴、一血逆轉、枷鎖反殺、最後回合斬殺、百萬／破億傷害、超額擊殺、倍率怪物、神話引擎、神話牌型與 Boss 擊破；紀錄本局最佳高光並寫入歷史紀錄。
* **`js/ui.js` / `css/style.css`**：結算畫面改為可截圖的炫耀卡，顯示本局高光標籤、最大傷害、最高倍率、代表牌型與遺物，並提供「複製戰績」按鈕；最後一擊在傷害收尾時追加高光橫幅、命中強化與高光傷害浮字。
* **截圖乾淨度**：新增 `UI.clearToasts()` 並在通關／失敗結算入口清掉舊 toast，避免擊殺訊息蓋住炫耀卡；通關彩帶改從高光卡兩側噴發，避免粒子蓋住最大傷害與倍率。
* **`js/locales/*.js`**：新增神局標籤、炫耀卡與複製戰績相關文字，四語系同步更新。
* **阿扣協作**：已依規範以 `--max-budget-usd 5.00` 嘗試請阿扣唯讀複核三項實作切法，但 `claude.exe -p` 在 164 秒逾時，未取得可用回覆；本輪由 Codex 依既有 MVC 與 Ponytail 規則完成。
* **驗證**：`node --check js\main.js js\ui.js js\locales\*.js`、`npm.cmd run steam:i18n:verify`、`git diff --check -- js\main.js js\ui.js css\style.css js\locales\zh-tw.js js\locales\zh-cn.js js\locales\en.js js\locales\ja.js`、`npm.cmd run steam:verify`、`npm.cmd run steam:package:verify` 已通過；另用臨時 Electron user data 造出高光通關局，確認 `540x960` 結算卡不溢出、無 toast 遮擋、彩帶不落在卡片內。`steam:verify` 首次因本機 `bibbidiba_settings.windowSize=large` 造成初始尺寸期待不符，將本機測試設定改回 `medium` 後通過。

### Steam：發行前後台總檢與商店變更公開 [2026/06/23]
* **發行資格**：Steamworks 確認商店頁與遊戲組建皆已獲准發行；正式套件定價 US$2.99，首發折扣 10%／7 天，指定發售時間為 `2026-07-01 00:00 [GMT+8]`。
* **成就與 Cloud**：15 項成就 API Name 及雙圖示完整；Auto-Cloud 路徑、10 MB／10 檔配額、Windows 64 位元與 Demo 關聯皆核對正確。
* **公開發佈**：經製作人授權，已公開發佈 Steam 成就／Steam 雲端商店標示、6 張新版截圖與 Demo 關聯資料；Steamworks 回報成功且待發佈差異歸零，公開商店可見兩項支援功能與 Demo 下載入口。
* **文件同步**：更新 `SYNC.md`、Steam README、發行檢查表與 `STEAMWORKS_UPLOAD_PACKET.md` 的 BuildID、645 keys、支援功能及發行狀態；未修改遊戲程式、VDF 或 Steam Build。

### Steam：正式版 Build 23853875 驗收通過並發布至 default [2026/06/23]
* **正式包**：四語 645 keys 完全對齊；`npm.cmd run steam:package:verify` 通過全部 15 項封裝檢查與 EXE smoke，確認包內為 `steam-full` 並含 Steamworks、Cloud 與成就橋接。
* **SteamPipe**：Base Game AppID `4792230`／DepotID `4792231` 上傳成功，建立 BuildID `23853875`；VDF 描述更新為 `BIBI DICE Base v1.0.0 RC - 2026-06-22`。
* **Steam 驗收**：Steam 用戶端已下載並啟動 `internal` Build `23853875`；三種視窗、續玩／Cloud 存檔、芝芝商店、收集冊、牌型表、靈魂奉獻、成就 API 與主要介面 smoke 通過，製作人實玩及 Cloud 同步確認通過。
* **分支狀態**：Steamworks 已將 Build `23853875` 設定上線至 `default`，後台分支表與歷史紀錄確認成功；`default` 與私人 `internal` 目前皆指向同一 Build。

### 文件：今日收工交接與發行前優先序 [2026/06/21]
* **`SYNC.md`**：整理下一輪工作順序；先上傳今天最新 SteamPipe Build 並完成 Steam 用戶端驗收，再進行靈魂奉獻平衡、文件同步、商店截圖更新與 7 月 1 日發行前檢查。
* **版本狀態**：記錄先前 BuildID `23816702` 已設為 `default`，今天後續完成的本機正式包尚待上傳；本次僅更新交接文件，未修改遊戲程式。

### UI：神話超載 NEW 標籤移到卡片框外 [2026/06/21]
* **`js/ui.js` / `css/style.css`**：移除會被 `overflow-hidden` 裁切的右上斜向緞帶，改以卡片 wrapper 承載小型水平 `NEW` 標籤；標籤位於卡片上框之外，卡片內容與圓角裁切維持不變。
* **i18n**：沿用四語既有 `ui.fusion_new_item`，未增加新 key。
* **驗證**：Electron `675x1200` 三欄與 `450x800` 單欄均確認標籤在框外完整可見、無水平溢位且零頁面錯誤；語法、四語 645 keys、正式包重建與啟動 smoke 全部通過。

### 修正：遺物／枷鎖資訊框切換與彩虹骰對比 [2026/06/21]
* **`js/ui.js`**：遺物與枷鎖詳情改為單一 keyed toast；再次點擊同一項目會關閉，切換不同項目會替換舊框，不再堆出相同訊息。一般戰鬥提示不受影響。
* **`js/ui.js`**：按 X、逾時關閉與按鈕 toggle 都會同步清除詳情狀態；教學枷鎖事件只在詳情真正開啟時觸發。
* **`js/diceSkin.js`**：彩虹骰改為紅、橙、金黃、藍、紫、銀白、綠、青綠，拉開 1／3 與 1／6 色差；八色加入對比與亮度調整，提高骰面數字辨識。
* **阿扣協作**：`US$5.00` 唯讀審查完成，確認詳情狀態與濾鏡調整範圍；最終配色另以 Electron 試片逐段目視排除近色。
* **驗證**：Electron 實際按鈕測試通過同項關閉、不同項替換、X 後重開與一般 toast 並存；八色實圖、顛倒是非覆蓋、盲眼遮罩與零頁面錯誤回歸通過；語法、四語 645 keys、正式包重建與啟動 smoke 全部通過。

### 功能：新增可選骰子外觀 [2026/06/21]
* **`js/diceSkin.js` / `js/main.js` / `js/ui.js`**：新增藍晶骰與彩虹晶骰；彩虹晶骰讓 1～8 點各有固定色，設定切換立即生效並沿用 `diceSkin` Steam Cloud key 保存。
* **Ponytail 實作**：重用既有 WebP 骰圖與 CSS filter，未新增圖片或依賴；外觀程式改為明確 ES module 匯入，移除隱性全域載入順序。
* **枷鎖／資訊安全**：「顛倒是非」亂序色優先覆蓋玩家外觀；盲眼與重骰遮罩不著色，幻覺依假點數著色，不會由顏色洩漏真實點數。
* **`index.html` / `js/locales/*.js`**：設定視窗新增骰子外觀選單，繁中、簡中、英文、日文共 645 keys 對齊。
* **阿扣協作**：`US$5.00` 唯讀審查完成，確認最小接線方案、顛倒是非覆蓋順序與遮罩防洩漏測例。
* **驗證**：Electron 實測 `450x800` 版面、即時切換、重載保存、八色唯一、顛倒是非及盲眼均通過且零頁面錯誤；語法、四語、`steam:verify`、正式包重建與啟動 smoke 全部通過。

### 修復：「顛倒是非」枷鎖沒有實際視覺效果 [2026/06/21]
* **`js/ui.js`**：將既有 `colorMap` 轉為 PNG 骰子的色相、飽和度與明度濾鏡；同一點數固定使用同一錯色，不再寫入已失效的背景色變數。
* **相容性**：保留現有存檔格式，兼容正式關卡與開發工具曾產生的不同 Tailwind 色彩 token；其他枷鎖及無枷鎖狀態不受影響。
* **阿扣協作**：`US$5.00` 唯讀審查完成，確認 PNG 渲染未消費舊背景 class 是根因，濾鏡修復方案可維持舊存檔相容。
* **驗證**：正式／舊版 colorMap、無枷鎖回歸、瀏覽器實戰錯色畫面、語法、四語 642 keys、正式包重建與啟動 smoke 全部通過。

### 修復：南瓜馬車招式浮字誤顯示為南瓜 [2026/06/21]
* **`js/ui.js`**：牌型名稱比對改為完全相同或明確的 `牌型名(...)` 後綴，修復「南瓜馬車」被較短的「南瓜」前綴覆寫；四個相關查找點共用同一安全判斷。
* **範圍**：牌型判定、倍率、優先權、資料與語系文案均未變更。
* **阿扣協作**：`US$5.00` 唯讀審查完成，獨立確認相同根因並提供回歸案例。
* **驗證**：繁中／簡中／英文／日文南瓜馬車浮字與真正南瓜皆通過；語法、四語 642 keys、限縮 diff、正式包重建與啟動 smoke 全部通過。

### 協作規則：阿扣單次預算提高至 US$5.00 [2026/06/21]
* **`AGENTS.md` / `SYNC.md`**：依製作人決策，阿扣（Claude Code）正式協作任務的 `--max-budget-usd` 預設值由 `1.00` 調整為 `5.00`；除非製作人另行指定，不得擅自提高。
* **歷史紀錄**：既有 `US$1.00` 任務與超限結果保留原始紀錄，新上限只套用於本決策之後的協作任務。

### UI／i18n：收集冊進度重排與牌型術語修正 [2026/06/21]
* **`index.html` / `js/main.js` / `js/ui.js` / `css/style.css`**：總完成度移到收集冊標題旁，三類收集進度移到分頁名稱旁；移除內容區重複進度卡與分頁無效重複渲染，保留 `NEW` 標記。
* **`js/engine.js` / `js/locales/*.js`**：力量覺醒與力量藥劑的結算標籤改用四語系名稱；統一英文 `Power Elixir` 名稱。
* **`js/locales/*.js`**：四語 C 區複合牌型條件改用各語系正式牌型術語；日文改用「対々和」「ダブルスリーカード」，中英文群組說明同步移除內部縮寫。
* **阿扣協作**：廣域審查於 `US$1.00` 超限且無輸出；限縮審查於同一上限內完成並確認無阻斷問題，提出的三項一致性／冗餘問題皆已修正。
* **驗證**：語法、四語 642 keys、限縮 diff、英文加成輸出、`450x800`／`675x1200` 收集冊與日文 15 張 C 區牌型均通過；`npm.cmd run steam:package:verify` 完成正式包重建與啟動 smoke。

### 協作規則：阿扣單次預算提高至 US$1.00 [2026/06/21]
* **`AGENTS.md` / `SYNC.md`**：依製作人決策，阿扣（Claude Code）正式協作任務的 `--max-budget-usd` 預設值由 `0.50` 調整為 `1.00`；除非製作人另行指定，不得擅自提高。
* **歷史紀錄**：既有 `US$0.50` 超限事件保留原始紀錄，新上限僅套用於 2026-06-21 之後的協作任務。

### 功能：靈魂奉獻第二階段擴充與輪迴契約重製 [2026/06/20]
* **`js/data.js`**：新增集中式靈魂能力資料表，統一管理最大等級、花費及遺珍／融合／契約／商店效果參數，方便後續直接調整平衡數值。
* **`js/main.js`**：將靈魂爆發重製為輪迴契約；已購買等級改為新局可選強度上限，強度 N 套用敵人 HP `x(N+1)` 與靈魂收益 `+N`，並保存每局選擇。
* **`js/main.js`**：舊戰鬥存檔會沿用原強度；舊靈魂爆發 2／5／8／10 級分別免費繼承神話容器 1／2／3／4 級，免費等級重置時不會退還未支付花費。
* **`js/main.js` / `js/ui.js` / `index.html`**：新增命運鑑選；已購買初始裝備時，新局可從排除封存項目後的 3 件普通遺物中選 1 件，完成選擇前不清除舊存檔。
* **`js/main.js`**：新增遺珍感應，3 級時遺物權重由 `50/30/15/5` 調整為 `41/33/18/8`，套用商店與菁英／Boss 掉落。
* **`js/main.js`**：新增融合羅盤，缺少的另一件融合素材依等級取得 x2／x3／x4 商店權重；已停用配方不加權。
* **`js/main.js` / `js/ui.js`**：新增商店再議，每間商店可刷新兩次，按鈕會顯示剩餘次數並正確保存已使用次數。
* **`js/main.js` / `js/ui.js`**：神話遺物上限完全移交神話容器，基礎上限 2、每級 +1；超限視窗依實際容量顯示動態數字。
* **`index.html` / `js/ui.js` / `css/style.css`**：新增整合式「新局準備」與命運鑑選視窗；靈魂卡片設為不可 flex 壓縮，修復項目增加後內文與晶體節點跑出邊框。
* **`js/i18n.js` / `js/locales/*.js`**：四語系同步新增五項能力、輪迴契約、新局設定、刷新次數與動態神話上限文字，共 642 個 key 對齊。
* **首版花費**：命運鑑選 60、遺珍感應 40／80／120、神話容器 100／150／200／250、融合羅盤 50／80／110、商店再議 80；製作人將於實玩後調整。
* **阿扣協作**：`US$0.50` 唯讀審查超出預算，回報 `Exceeded USD budget (0.5)`，未取得可用輸出，已依規範記錄。
* **驗證**：隔離 Playwright 已通過舊存檔遷移、契約強度、三選一、封存、商店刷新、抽選權重、融合權重、神話上限、重置退款及 `450x800`／`675x1200` 卡片零溢位；`npm.cmd run steam:package:verify` 通過全部正式包檢查與啟動 smoke，測試程序已退出且正式包不含測試產物。

### 功能：靈魂奉獻新增預兆之瞳與空白名冊 [2026/06/20]
* **`js/main.js`**：新增 `預兆之瞳` 流程；商店先決定並保存下一關枷鎖 ID，重載後維持不變，進場時採用同一枷鎖並才產生動態參數。
* **`js/main.js`**：新增 `空白名冊` 新局設定；可依等級封存 1／2 件已解鎖、非神話、非消耗品遺物，並從初始遺物與當局商店池排除。取消視窗不會刪除既有存檔。
* **`js/main.js`**：補強 meta 與戰鬥存檔遷移，舊存檔會自動補齊 `omenEye`、`blankLedger`、`sealedRelics` 與 `shackleForecast`，不需重置進度。
* **`index.html` / `js/ui.js` / `css/style.css`**：新增空白名冊選擇視窗與商店枷鎖預兆卡；直向小／大視窗分別使用單欄／雙欄，並修正標題畫面攔截視窗點擊的層級問題。
* **`js/locales/*.js`**：四語系新增兩項能力及相關視窗、預兆與遊戲說明文字，語系 key 維持對齊。
* **平衡暫定**：預兆之瞳最高 1 級、花費 40；空白名冊最高 2 級、花費 50／100。名稱採「空白名冊」以避開既有枷鎖「遺物封印」。
* **阿扣協作**：依 `US$0.50` 上限啟動唯讀審查，但阿扣回報 `Exceeded USD budget (0.5)`，未取得可用輸出；已依協作規範記錄。
* **驗證**：語法、四語系 625 keys、隔離 Playwright 完整流程與 `npm.cmd run steam:package:verify` 全部通過；已驗證封存上限、取消保留舊存檔、初始遺物／商店排除、預兆跨重載固定、下一關採用同一枷鎖、`450x800`／`675x1200` 無水平溢位與瀏覽器零錯誤，以及正式包啟動 smoke 後程序正常退出。

### 協作規則：阿扣單次預算上限調整 [2026/06/20]
* **`AGENTS.md` / `SYNC.md`**：依製作人決策，阿扣（Claude Code）正式協作任務的 `--max-budget-usd` 預設值調整為 `0.50`；除非製作人另行指定，不得擅自提高。

### UI：牌型倍率表直向版閱讀優化 [2026/06/20]
* **`js/ui.js` / `css/style.css`**：牌型表新增專用卡片結構；直向視窗固定為單欄，放大牌型名稱與條件說明，倍率改為固定右側區塊。非直向寬版仍維持雙欄。
* **`js/ui.js`**：刪除遊戲說明「牌型」分頁內重複的牌型 HTML 產生碼，改為直接呼叫並共用 `renderRulesDB()`，避免兩處版面日後不同步。
* **阿扣協作**：阿扣唯讀檢查於 69.5 秒時超過本次 `US$0.20` 預算，未取得可用回覆；依協作規範記錄後由 Codex 完成限縮修改與實測。
* **驗證**：`node --check js/ui.js`、`npm.cmd run steam:i18n:verify`、限縮 `git diff --check`、`npm.cmd run steam:package:verify` 全部通過。Electron 實測 39 張牌型卡；`450x800` 與 `675x1200` 皆為單欄且無文字溢出，遊戲說明牌型分頁同步套用，`1200x800` 非直向寬版維持雙欄且無溢出。

### UI：遺物商店資訊版面與靈魂節點雙態化 [2026/06/20]
* **`js/ui.js` / `css/style.css`**：遺物商店卡片改為「名稱與稀有度／完整效果說明」兩層結構，放大卡片、標題、說明文字與稀有度標籤；直向版三張卡片會共同使用主要高度，降低商店下方留白，且不再截斷長效果。
* **`js/ui.js` / `img/ui/`**：靈魂奉獻節點只保留亮晶體與暗晶體兩態；已購買等級使用 `soul_node_on.png`，未購買等級使用 `soul_node_off.png`，移除 `soul_node_next.png` 與相關判斷，購買能力仍由卡片外框及花費按鈕表示。
* **阿扣協作**：已啟動阿扣進行唯讀 UI 稽核，但本次於 184 秒後逾時，未取得可用回覆；依 Ponytail 規則由 Codex 完成限縮修改與實測。
* **驗證**：`node --check js/ui.js`、`npm.cmd run steam:i18n:verify`、`git diff --check`、`npm.cmd run steam:package:verify` 通過；Electron 實測 `450x800` 長描述卡片均完整顯示且無溢出，`675x1200` 商店版面填滿主要高度，靈魂 `1/2`、`3/5`、`2/10` 的亮暗節點數皆正確且無第三種圖片來源。

---

> 2026-06-19 及以前的變更紀錄已封存至 [CHANGELOG_ARCHIVE.md](CHANGELOG_ARCHIVE.md)。
