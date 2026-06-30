# SYNC.md - AI 協作交接總表

## AI 快速交接區（任何 AI 開工前必讀）

最後更新：2026-06-30

### 2026-06-30 鑀韻西：完成 Steam 正式版四語快速節奏 Shorts
- **狀態**：四支正式影片已完成並通過品管，尚未上傳或發布 YouTube。
- **交付檔案**：
  - `promo/social/steam-launch-short/previews/bibi_dice_steam_launch_en_1080x1920.mp4`（17,014,686 bytes）
  - `promo/social/steam-launch-short/previews/bibi_dice_steam_launch_ja_1080x1920.mp4`（16,097,200 bytes）
  - `promo/social/steam-launch-short/previews/bibi_dice_steam_launch_zh-cn_1080x1920.mp4`（15,169,875 bytes）
  - `promo/social/steam-launch-short/previews/bibi_dice_steam_launch_zh-tw_1080x1920.mp4`（16,418,816 bytes）
- **影片內容**：四語皆採用對應語系實機畫面，統一節奏為「第一秒破億傷害 → 鎖定／重擲 → 牌型效果 → 遺物構築 → 破億結算 → Steam 立即遊玩」；大型 CTA 只在最後約 3 秒出現。
- **在地化**：英文 `PLAY NOW`、日文 `今すぐプレイ`、簡中 `立即游玩`、繁中 `立即遊玩`；四支片尾均顯示正式版已推出與 Steam AppID `4792230` 商店網址。
- **製作結構**：`promo/social/steam-launch-short/index.html` 為四語共用 HyperFrames 合成；`assets/gameplay/{locale}/` 各有 6 段直式素材；`variables/{locale}.json` 與 `scripts/prepare-active-locale.cjs` 用於切換文案及實機錄影。目前預設已切回 `zh-tw`。
- **片尾品管修正**：日文與簡中片尾來源原本會在後段閃白或露出主選單，已改為保留前段標題粒子動態並延長穩定主視覺；重新輸出後接觸表確認無閃白、無選單穿幫。
- **輸出規格**：四支皆為 H.264、1080×1920、60fps、AAC 48kHz 雙聲道，長度 `13.034667` 秒。
- **驗證結果**：`npm.cmd run check` 通過（lint 0 error／0 warning、validate 無 console error、inspect 0 layout issue）；四支正式 MP4 均通過 FFmpeg 全片解碼，`ffprobe` 規格正確，四語成品接觸表已逐張肉眼確認。
- **範圍控制**：未修改遊戲原始碼、Steam／itch.io Build、商店頁、YouTube 草稿或發布狀態。

### 2026-06-30 阿扣：加入正式版導購區塊（Demo / itch 版）
- **狀態**：完成，待製作人 commit + push
- **任務**：在標題畫面與通關畫面加入「查看 Steam 正式版」導購入口，僅 Demo / itch 版顯示
- **修改**：
  - `js/locales/zh-tw.js` / `en.js` / `ja.js` / `zh-cn.js`：新增 6 個導購文字 key（`promo_title_label/desc/btn`、`promo_win_label/desc/btn`）
  - `index.html`：標題畫面加 `#promo-title-card`；通關畫面 `#end-overlay` 加 `#promo-win-card`
  - `css/style.css`：新增 `.promo-card` / `.promo-card--win` / `.promo-card-btn` 樣式
  - `js/ui.js`：新增 `initPromo()`、`showPromoWinCard()`、`hidePromoWinCard()` export
  - `js/main.js`：`bootGame()` 呼叫 `UI.initPromo()`；`gameWin()` 呼叫 `UI.showPromoWinCard()`；`gameOver()` 呼叫 `UI.hidePromoWinCard()`
  - `scripts/publish-itch.ps1`：打包時注入 `itch-build` class 到 `<body>`
  - `steam-app/preload.js`：新增 `electronAPI.openExternal(url)`
  - `steam-app/main.js`：新增 `open-external-url` ipcMain handler，僅允許 `store.steampowered.com`
- **版本識別邏輯**：`<body>` 有 `steam-portrait` → Steam Demo；有 `itch-build` → itch.io；兩者都沒有 → 正式版/開發環境（不顯示）
- **驗證**：`npm.cmd run steam:i18n:verify` 通過，四語系 674 keys 完全對齊
- **注意**：Steam Demo 按鈕走 Electron `shell.openExternal`（白名單限 steampowered.com）；itch 版走 `window.open`。正式版 exe 不含 `steam-portrait` body class 故不顯示導購。打包後建議跑 `npm.cmd run steam:package:verify` 確認 exe 行為正確。
更新者：鑀韻西（Codex）

### 2026-06-30 鑀韻西：完成新錄影盤點與 Steam 正式版繁中 Shorts 草稿
- **素材盤點**：`promo/steam/trailer/raw-captures/` 共 23 支影片，全部為 1920×1080、60fps、AAC 48kHz 雙聲道。繁中 7 支、英文 6 支、日文 5 支、簡中 5 支；已建立四語接觸表並實際檢查畫面內容。
- **繁中素材確認**：具備 `172,800,000` 高傷害、重擲、兩極牌型角色演出、商店／遺物選擇、破億神局、遊戲通關、挑戰失敗與標題畫面。本輪繁中版所需鏡頭完整，沒有需要製作人補錄的畫面。
- **新合成專案**：新增 `promo/social/steam-launch-short/`，使用六段裁切後的繁中遊戲畫面與既有 BGM／擲骰／攻擊音效，總節奏為「第一秒高傷害 → 重擲 → 牌型效果 → 商店構築 → 破億神局 → 正式版 CTA」。
- **繁中草稿**：`promo/social/steam-launch-short/previews/bibi_dice_steam_launch_zh-tw_draft.mp4`；H.264、1080×1920、30fps、AAC 48kHz 雙聲道、長度 `13.034667` 秒、檔案大小 `6,047,992` bytes。
- **CTA**：最後約 3 秒顯示 `正式版現已推出`、`立即遊玩` 與 `store.steampowered.com/app/4792230`。前段只講玩法，不先露出大型廣告式 CTA。
- **驗證結果**：`npm.cmd run check` 通過，validate 無 console error、inspect 0 error；靜態檢查保留 5 項迴圈選擇器造成的 GSAP 重疊警告與 4 項雙行標題區域警告，七張時間點快照及最終接觸表確認實際畫面無遮擋、無離框。最終 MP4 以 FFmpeg 完整解碼無錯誤，`ffprobe` 規格正確。
- **阿扣協作狀態**：`claude.exe auth status` 顯示 claude.ai／Pro 已登入，但依規範使用 `--max-budget-usd 5.00` 的正式唯讀核對仍回傳 `401 Invalid authentication credentials`，request ID `req_011CcZMDT2B4Pcd3nZv5bj7H`；本輪未取得阿扣審查，由鑀韻西完成素材檢查與草稿。
- **下一步**：等待製作人確認繁中草稿節奏與字幕；確認後可輸出 60fps 高品質繁中正式檔，再依相同節奏製作英文、日文、簡中版本。
- **範圍控制**：未修改遊戲原始碼、Steam／itch.io Build、商店頁、YouTube 草稿或發布狀態；舊版四語 Shorts 與所有既有輸出均未覆蓋。

### 2026-06-30 鑀韻西：Steam 商店影片四語改版規劃與英文直式草稿
- **製作方向**：製作人認為原 Steam 商店影片的剪輯與演出更適合宣傳，後續將提供移除特效中文字的乾淨來源。四語版統一保留原片的「擲骰 → 牌型倍率 → 遺物構築 → 高傷害／高塔 → 品牌」節奏，只替換各語言重點與 Steam 願望清單 CTA。
- **草稿輸出**：已先用現有 `promo/steam/trailer/bibi_dice_demo_trailer_final_2026-06-05.mp4` 製作英文直式草稿 `promo/social/itch-overseas-short/previews/bibi_dice_steam_trailer_en_vertical_draft.mp4`，保留原音樂與完整 42 秒剪輯，中央遊戲畫面裁切為 1080×1920。
- **英文段落**：`ROLL 8 DICE / BREAK THE DAMAGE LIMIT` → `CHAIN PATTERNS / STACK MULTIPLIERS` → `CHOOSE RELICS / CHANGE YOUR BUILD` → `CLEAR 10 FLOORS / CLIMB EVEN HIGHER` → `WISHLIST NOW / ON STEAM`。
- **暫時處理**：目前繁中特效字已燒進來源，草稿只用局部模糊與壓暗遮罩展示排版方向；乾淨來源到手後會移除遮罩，再製作英文、日文、簡中、繁中四支獨立版本。
- **驗證結果**：`ffprobe` 確認草稿為 H.264、1080×1920、30fps、AAC 48kHz 雙聲道、長度 `42.200` 秒、檔案大小 `12,484,948` bytes；另抽查五個關鍵畫面，主要傷害數字、英文字幕與 Steam CTA 均可讀。
- **待確認事項**：乾淨來源若仍保留繁中遊戲 UI，四語正式版只會替換外加特效字與 CTA；若要連遊戲 UI 一併對應語系，需提供各語系來源影片。
- **範圍控制**：沒有修改遊戲原始碼、Steam／itch.io Build、商店頁、YouTube 草稿或發布狀態；既有四語 Shorts 與所有草稿均未覆蓋。

### 2026-06-29 鑀韻西：完成 Steam 四語系 Shorts 正式版
- **任務背景**：阿雷確認 YouTube 私人草稿是英文版，要求英文、日文、簡中、繁中四種語言版本分開製作與宣傳，且宣傳重點必須放在 Steam 正式版／願望清單，不是 itch.io Demo。
- **短片架構**：`promo/social/itch-overseas-short/index.html` 已新增 HyperFrames `locale` enum 變數（`en`、`ja`、`zh-cn`、`zh-tw`），同一份 12 秒動畫可切換四語畫面文字、背景截圖與 CTA。畫面主 CTA 統一為 Steam 願望清單，URL 顯示 `store.steampowered.com/app/4792230`。
- **四語素材**：新增 `promo/social/itch-overseas-short/assets/images/ja/`、`zh-cn/`、`zh-tw/`，各自包含 `01_title.png`、`03_combo_preview.png`、`08_highlight_moment.png`；來源為 `promo/steam/description/source/{locale}/` 已產出的 Steam 說明圖素材。
- **貼文文案**：`POST_COPY_EN.md` 已改為 Steam launch 版本，並新增 `POST_COPY_JA.md`、`POST_COPY_ZH_CN.md`、`POST_COPY_ZH_TW.md`。四語 YouTube Shorts / Threads / X 文案皆以 Steam 願望清單為主連結，itch.io 免費瀏覽器 Demo 為次要試玩連結，UTM 依平台與語系拆分。
- **變數檔**：新增 `promo/social/itch-overseas-short/variables/en.json`、`ja.json`、`zh-cn.json`、`zh-tw.json`，供後續正式 render 使用 `--variables-file`，避免 PowerShell 直接傳 JSON 時引號被吃掉。
- **預覽輸出**：已完成四支 draft 預覽檔：`previews/bibi_dice_steam_short_en_draft.mp4`、`previews/bibi_dice_steam_short_ja_draft.mp4`、`previews/bibi_dice_steam_short_zh-cn_draft.mp4`、`previews/bibi_dice_steam_short_zh-tw_draft.mp4`。另有四張 contact sheet：`previews/bibi_dice_steam_short_{locale}_sheet.jpg`。阿雷已看過四支預覽並確認沒有重大問題。
- **正式輸出**：已完成四支高品質 MP4：`bibi_dice_steam_short_en_1080x1920.mp4`（15,416,337 bytes）、`bibi_dice_steam_short_ja_1080x1920.mp4`（15,569,588 bytes）、`bibi_dice_steam_short_zh-cn_1080x1920.mp4`（15,330,062 bytes）、`bibi_dice_steam_short_zh-tw_1080x1920.mp4`（15,357,494 bytes）。四支皆為 1080×1920、60fps、長度 `12.032` 秒。
- **驗證結果**：在 `promo/social/itch-overseas-short` 執行 `npm.cmd run check` 通過；lint 0 error、validate 無 console error、inspect 0 warning。保留既有 `composition_file_too_large` 警告，這是單檔維護提醒，不影響輸出。四語 draft render 皆成功，contact sheet 已肉眼確認文字可讀、無豆腐字、CTA 為 Steam；正式 MP4 輸出後以 `ffprobe` 確認解析度、fps 與長度。
- **阿扣協作狀態**：`claude.exe auth status` 顯示已登入（claude.ai / pro），但正式 `claude.exe -p --no-session-persistence --permission-mode bypassPermissions --max-budget-usd 5.00` 唯讀檢查仍回傳 `401 Invalid authentication credentials`；本輪未取得阿扣審查，已依規範記錄限制並由 Codex 繼續。
- **尚未做**：尚未上傳或發布 YouTube。下一步可依語系分別上傳四支正式 MP4，填入對應 `POST_COPY_*.md` 文案，再做廣告適合度自評與發布排程。
- **範圍控制**：本輪沒有修改遊戲原始碼、Steam Build、itch.io Build、玩家存檔或 YouTube 發布狀態。

### 2026-06-28 鑀韻西：完成 itch.io 海外曝光直式短片
- **交付影片**：`promo/social/itch-overseas-short/bibi_dice_itch_overseas_short_en_1080x1920.mp4`，H.264、1080×1920、60fps、AAC 48kHz 雙聲道，長度 `12.032` 秒。
- **內容節奏**：`ROLL 8 DICE` → `STACK 4 MULTIPLIER ZONES` → `4.8 BILLION DAMAGE` → `HOW HIGH CAN YOU GO? / PLAY FREE ON ITCH.IO`。
- **素材來源**：沿用 `promo/steam/description/source/en/` 的英文直式截圖，以及既有 `bibbidiba_BGM_01.mp3`、`dice.mp3`、`attack.mp3`；素材已複製到宣傳專案，未引用線上資源。
- **貼文文案**：`promo/social/itch-overseas-short/POST_COPY_EN.md` 內含 YouTube Shorts、Threads、X 三組英文版本與各自 UTM。
- **製作檔案**：`index.html` 為可編輯 HyperFrames 來源；`frame.md` 為品牌規格；`.hyperframes/expanded-prompt.md` 與 `.hyperframes/anim-map/animation-map.json` 保留分鏡及動畫 QA 紀錄。
- **驗證結果**：lint、runtime／對比驗證、15 點 inspect 均為 0 錯誤、0 警告；快照確認四個主畫面的文字、玩法截圖與 CTA 可讀。動畫地圖標示的離框項目均為刻意的水平推進轉場，慢速項目為背景 Ken Burns，音訊 0×0 標記為正常。
- **範圍控制**：沒有修改遊戲原始碼、Steam／itch.io Build 或玩家存檔。

### 2026-06-28 鑀韻西：itch.io 海外曝光與搜尋資訊優化
- **分類與可發現性**：已儲存 Mouse、Keyboard、`A few minutes`、English、Japanese、Chinese (Simplified)、Chinese (Traditional)、Interactive tutorial；玩家數維持單人 `1`。
- **短介紹與標籤**：公開 meta description 更新為 `Build 8-dice hands, stack four multiplier zones, and chase absurd damage in a free browser roguelite.`；標籤為 `browser-game`、`dice`、`drm-free`、`fantasy`、`high-score`、`roguelite`、`singleplayer`、`turn-based`、`turn-based-combat`。
- **三語商店頁**：既有傷害 GIF 已移到英文首句後方；新增日文完整介紹，並保留英文與繁中內容。公開頁已讀回三語內容，GIF paragraph 緊接英文 hook。
- **外部導流**：Steam 使用 `https://store.steampowered.com/app/4792230/BIBI_DICE/?utm_source=itchio&utm_medium=web&utm_campaign=browser_demo`；另新增 YouTube `https://www.youtube.com/@LeijoaLion`、Threads `https://www.threads.com/@leijoalan`、X `https://x.com/Leijoa2588`。
- **Release Announcements**：已用 `Browser` 標籤送出英文宣傳主題，標題為 `[Free Browser Demo] Roll 8 Dice, Stack 4 Multiplier Zones, Break the Damage Counter — BIBI DICE`；內含 UTM 遊玩連結、完整摘要、功能條列、回饋問題與既有 `137,149,200` 傷害 GIF。
- **公開狀態**：英文宣傳主題已通過版主審核並公開；正式網址為 `https://itch.io/t/6546891/free-browser-demo-roll-8-dice-stack-4-multiplier-zones-break-the-damage-counter-bibi-dice`。公開頁已顯示瀏覽次數與回覆入口。
- **範圍控制**：本輪只修改 itch.io 後台中繼資料與公開頁文案，沒有修改遊戲原始碼、HTML Build、上傳檔或玩家瀏覽器進度。
- **未完成項**：原定替開發日誌 `1566826` 上傳 `promo/steam/assets/store_screenshot_01_title_1920x1080.png` 作為封面，但 Codex 內建瀏覽器不支援本機檔案上傳；未儲存任何半成品，文章內容、公開狀態與第 14 版附件均保持不變。

### 2026-06-28 鑀韻西：itch.io 同步至 Steam Demo Build 23496399
- **發佈結果**：itch.io `leijoa/bibi-dice:html` 已由第 13 版更新至第 14 版；butler Upload `#17558645`、Build `#1756725` 已上線。
- **同步範圍**：只將 `dist/itch/index.html` 的 `<body>` 補上 `steam-portrait`；其餘 44 個 runtime 檔原本就與 Steam Demo BuildID `23496399` 相同。未修改目前較新的專案原始碼、遊戲邏輯、數值、樣式或語系。
- **排除內容**：未將 Steam Demo 包內的 `.nojekyll`、`_config.yml`、`FULL_VERSION_ROADMAP.md`、`SYNC.md` 上傳到 itch.io。
- **驗證**：發佈前 SHA256 逐檔比對 45/45 通過，butler push preview 顯示 0 新增、1 修改、0 刪除；發佈後重新抓取線上第 14 版，45/45 個 runtime 檔與已安裝的 Steam Demo Build `23496399` 完全一致，線上 `<body>` 已含 `steam-portrait`。
- **開發日誌**：已公開〈現在，瀏覽器版也同步 Steam Demo 了！〉，附加第 14 版 HTML Build，並確認公開頁面完整顯示玩家導向文案；網址：`https://leijoa.itch.io/bibi-dice/devlog/1566826/-steam-demo-`。

### 2026-06-27 鑀韻西：Steam 四語系圖文說明草稿
- **需求來源**：阿雷希望 Steam 說明頁加入新手教學引導與能精確對應遊戲介面的 UI 說明圖，再接續牌型、遺物、神話演出及結算卡內容。
- **新增生成流程**：`scripts/generate-steam-description-assets.js` 依繁中、簡中、英文、日文產生 6 組共 24 張 WebP；`scripts/capture-steam-portrait-screenshots.js` 新增說明素材專用的語系、暫存目錄與 portrait-only 參數。
- **UI 導覽圖**：中央使用真實遊戲畫面，11 個編號說明皆以同色框線與連接線指向實際 UI；右上角功能按鈕為第 5 項，畫面文字使用實際的「回標題」。
- **Steamworks 狀態**：24 張圖已上傳至 Base Game AppID `4792230`。英、日、簡中、繁中「關於此遊戲」皆依 `tutorial → ui-guide → combo → relics → mythic → result` 插入 6 張在地化圖片並儲存草稿；重新載入後確認四語系各 6 張且順序正確，尚未公開發佈。

### 2026-06-26 鑀韻西：重產 alldamege.csv 完整傷害表
- **需求來源**：阿雷要求更新 `alldamege.csv`，同步剛調整的彗星與全異倍率。
- **修改 `alldamege.csv`**：用目前 `engine.calculateEngineScore()` 重新產生 6435 種非遞減骰面組合（`11111111` 至 `88888888`），欄位維持「骰子組合、基礎點數總和、發動牌型、發動牌型總倍率、最終傷害」。
- **驗證**：總行數為 6436（表頭 + 6435 組）；抽查 `12345678` 為 `彗星(x40) + 雙四連順(x22) + 全異(x15)`，總倍率 `13200`、最終傷害 `475200`；表頭使用 UTF-8 中文字串重寫，避免 PowerShell here-string 造成問號。

### 2026-06-26 鑀韻西：彗星升格神話與全異倍率下修
- **需求來源**：阿雷要求「彗星」倍率增加到 `x40` 並變成神話牌型以觸發特效，同時將「全異」改成 `x15`。
- **修改 `js/data.js`**：`rule_b0` 彗星改為 `multi: 'x40'`、`rarity: 5`；`rule_d2` 全異改為 `multi: 'x15'`。彗星升格後會自動套用已完成的神話牌型滿版立繪演出。
- **修改 `js/engine.js`**：實際結算同步改為彗星 `multi: 40.0`、全異 `multi: 15.0`。
- **驗證**：以 Node 直接呼叫 `calculateEngineScore()` 測試骰面 `[1,2,3,4,5,6,7,8]`，確認 `tagB` 為彗星 `x40`、`tagD` 為全異 `x15`，`RULE_DB.groupB[0]` 為 `rarity 5`。`node --check js\data.js`、`node --check js\engine.js`、`npm.cmd run steam:i18n:verify`、限縮 `git diff --check`、`npm.cmd run steam:verify`、`npm.cmd run steam:package:verify` 全部通過。

### 2026-06-26 鑀韻西：神話牌型滿版立繪演出
- **需求來源**：阿雷認為神話牌型效果仍太弱，希望像附圖一樣整個版面顯示神話牌型名稱、逐字出現，並滑入雷爪獅或捧夠立繪；另要求日文版 8 個數字一樣的牌型名稱統一為「ビビデバ」。
- **新增素材**：將附圖角色整理為去背版並放入 `img/characters/thunderclaw-lion-cutout.png`、`img/characters/pongo-cutout.png`；未使用的白底原圖不保留在專案內，避免包版膨脹。
- **修改 `js/ui.js`**：`showHandNamesPreview()` 的最後揭示牌型若 rarity >= 5，改觸發 `showMythicHandReveal()`；A 區／`rule_a0` 使用雷爪獅，其它神話牌型使用捧夠。牌型名稱拆成逐字 span 顯示，並保留 HTML escape。
- **修改 `css/style.css`**：新增 `mythic-hand-reveal` 系列滿版演出，包含暗化、魔力光暈、斬擊線、角色滑入、直排逐字牌型名稱與 `mythic-hand-hit` 戰鬥區域震撼效果；英文牌型會自動橫排。
- **修改 `js/locales/ja.js`**：`rules.rule_a0.name` 與 `ui.highlight_bibi_hand` 統一為「ビビデバ」。
- **驗證**：Electron 以 `RULE_DB.groupA[0]` 觸發神話 reveal，確認 `540x960` 滿版顯示雷爪獅、逐字「比比丟八」、圖片 `1087x1447` 載入且文字在畫面內；以 `RULE_DB.groupC[0]` 確認雙子星使用捧夠；切到 ja locale 後，`rule_a0` 與演出標題皆為「ビビデバ」。`node --check js\ui.js`、`node --check js\locales\ja.js`、`npm.cmd run steam:i18n:verify`、限縮 `git diff --check`、`npm.cmd run steam:verify`、`npm.cmd run steam:package:verify` 全部通過；dist stale 的白底原圖與 QA 圖已清除，正式包無 extra file 提示。

### 2026-06-26 鑀韻西：破億神局滿版高潮演出
- **需求來源**：阿雷回報「破億神局」訊息出現太快，玩家來不及看與截圖，希望改成滿版大字、有魄力地彈出並加特效。
- **修改 `js/ui.js`**：`showHighlightBurst()` 偵測到 `damage_100m` 時改走 `showEpicHighlightBurst()`；一般高光仍保留原本小橫幅，破億高光固定主標為「破億神局」，並顯示傷害數字與最多三個輔助高光標籤。
- **修改 `css/style.css`**：新增 `highlight-epic-overlay` 系列樣式與動畫，包含 5 秒停留、滿版暗化、爆光、衝擊波、放射粒子、大字彈出、傷害數字發光，以及戰鬥區域 `highlight-epic-hit` 強化效果。
- **驗證**：重建 `dist/steam-demo` 後以 Electron 觸發 `damage_100m`；`540x960` 量測 overlay 動畫 5 秒、3 秒後仍存在，標題為「破億神局」、傷害為 `234,000,000`；`450x800` 小視窗標題與傷害皆在畫面內。`node --check`、`npm.cmd run steam:i18n:verify`、限縮 `git diff --check`、`npm.cmd run steam:verify`、`npm.cmd run steam:package:verify` 全部通過；第一次正式包驗證曾提示舊 QA 圖片被複製為 extra file，已刪除 `tmp` QA 圖後重跑，第二次乾淨通過。

### 2026-06-26 鑀韻西：結算卡改為精彩時刻並完整顯示遺物
- **需求來源**：阿雷確認作弊模式多語系先保留，並要求結算卡「本局高光」改成「精彩時刻」，下方遺物不要橫向捲動，而是一次顯示所有遺物。
- **修改 `js/locales/zh-tw.js`**：將 `ui.highlight_card_eyebrow` 改為「精彩時刻」。
- **修改 `js/ui.js` / `css/style.css`**：最終持有遺物改用 `highlight-card__relic-grid`，一般視窗顯示 3 欄，窄視窗自動改 2 欄，chip 允許換行避免文字擠出。
- **修改 `index.html` / `css/style.css`**：替結算按鈕區加上 `end-actions`，並收緊結算 overlay 的標題、說明、卡片與頁腳間距，讓變高的精彩時刻卡片仍能放在畫面中。
- **驗證**：`540x960` Electron 臨時結算卡塞入 18 個遺物，量測為 3 欄 grid、無橫向溢位，截圖輸出至 `tmp/highlight-card-grid-qa.png`；`node --check`、`npm.cmd run steam:i18n:verify`、限縮 `git diff --check`、`npm.cmd run steam:verify`、`npm.cmd run steam:package:verify` 全部通過。正式包驗證前曾因舊 `BIBI-DICE.exe` 鎖檔失敗，確認路徑在 `dist/steam-windows` 後已關閉殘留行程並重跑通過。

### 2026-06-26 鑀韻西：開發者模式新增扣血與剩餘回合控制

- **任務背景**：製作人回報「破億神局」訊息消失太快，先要求新增作弊工具，方便穩定造出一血、最後回合與高傷害測試局。
- **已改 `index.html`**：開發者模式「戰鬥控制」區新增 `dev-damage-input` / `dev-damage-btn`，以及 `dev-turn-one-btn`。
- **已改 `js/main.js`**：新增 `window.devDamagePlayer(amount)`，扣自己指定 HP 但最低保留 1 HP；新增 `window.devSetEnemyTurnsOne()`，將敵人剩餘回合設為 1；兩者都會呼叫共用的 dev 分數重算 helper，確保 HP 與剩餘回合相關倍率立即反映。
- **已改 i18n**：`js/locales/en.js`、`ja.js`、`zh-cn.js`、`zh-tw.js` 新增 `ui.dev_damage_self`、`ui.dev_turn_one`、`messages.toast_dev_damage_self`、`messages.toast_dev_turn_one`。
- **驗證**：以臨時 Electron user data 實測按鈕 onclick；扣 2 HP 後 toast 顯示目前 `1/3`，敵人剩餘回合變為 1，分數重新刷新。`npm.cmd run steam:i18n:verify` 顯示四語系 `668 keys` 對齊。
- **未處理**：本段尚未調整神局高光訊息停留時間；下一步可針對 `highlight-burst-banner` 動畫時間與截圖節奏調整。

### 2026-06-26 鑀韻西：修正 D 區「兩極」有效牌型變暗

- **問題**：當盤面同時觸發 A 區「比比丟八」、C 區「雙子星」、D 區「兩極」時，D 區雖然顯示 `x60.0`，但 UI 被套用 disabled 暗色樣式。
- **原因**：`js/ui.js` 的區塊亮暗使用 `isZoneSelectable()`，而該函式依賴骰子上的 `matchedGroups[group]`；D 區「兩極」屬於特殊盤面判定，可能與 A/C 共用整盤骰子，導致 `tagD` 有效但 `matchedGroups.D` 不足以作為 UI 亮暗依據。
- **修改**：`js/ui.js` 新增/使用 `isZoneActive(tag)` 判斷顯示亮暗，只要 tag 有效就亮；`isZoneSelectable()` 保留點擊高亮用途，且 D 區有效時允許點擊。`js/main.js` 的 `window.setHighlight('D')` 也不再強制要求 `matchedGroups.D`。
- **驗證**：以臨時 Electron user data 開局後 `devSetDice('11111111')`，確認 D 區顯示「兩極 x60.0」且 class 不含 `opacity-40` / `text-slate-500`。

### 2026-06-26 鑀韻西：神局判定、結算炫耀卡與最後一擊高潮

- **任務目標**：回應「能否讓 BIBI DICE 產生 30 秒值得分享的瞬間」這條主軸，先落地三個傳播層功能：神局判定層、結算炫耀卡、最後一擊爆發演出。
- **架構決策**：不改 `engine.js` 計分公式、不改 `data.js` 數值；神局判定放在 `js/main.js` 攻擊結算周邊，屬於敘事與分享標籤，不參與遊戲規則計算。
- **已改 `js/main.js`**：新增 `player.highlights`、神局標籤建構與最佳高光記錄；攻擊結算會辨識比比丟八、四區共鳴、一血逆轉、枷鎖反殺、最後回合斬殺、百萬／破億爆發、超額擊殺、倍率怪物、神話引擎、神話牌型與 Boss 擊破，並把最佳高光寫進歷史紀錄與結算畫面。
- **已改 `js/ui.js` / `css/style.css`**：結算統計改為截圖導向的炫耀卡，顯示高光標籤、最大傷害、最高倍率、代表牌型與遺物；新增複製戰績；最後一擊傷害動畫收尾顯示高光橫幅、戰鬥區命中強化與高光傷害浮字。
- **截圖乾淨度小修**：`js/ui.js` 新增 `clearToasts()`，`js/main.js` 的 `gameOver()` / `gameWin()` 進入結算時會清掉既有 toast；`shootConfetti()` 偵測高光卡後改由卡片左右側噴彩帶，避免蓋住傷害與倍率。
- **已改 i18n**：`js/locales/en.js`、`ja.js`、`zh-cn.js`、`zh-tw.js` 新增炫耀卡、複製戰績與高光標籤文字，四語系 key 已對齊。
- **阿扣協作**：已用 `claude.exe -p --no-session-persistence --permission-mode bypassPermissions --max-budget-usd 5.00` 嘗試請阿扣唯讀複核三項實作切法，但 164 秒逾時，未取得可用回覆；本輪由 Codex 依 Ponytail 規則與既有架構完成。
- **驗證結果**：`node --check js\main.js`、`node --check js\ui.js`、四語系 `node --check`、`npm.cmd run steam:i18n:verify`、`git diff --check -- js\main.js js\ui.js css\style.css js\locales\zh-tw.js js\locales\zh-cn.js js\locales\en.js js\locales\ja.js`、`npm.cmd run steam:verify`、`npm.cmd run steam:package:verify` 皆通過。
- **畫面 QA**：使用臨時 Electron user data 造出高光通關局並截圖檢查；`540x960` 下高光卡 rect 約 `461x395`、未超出 viewport，`activeToastCount=0`，彩帶粒子沒有落在高光卡內。
- **驗證注意**：`steam:verify` 第一次失敗是本機保存 `bibbidiba_settings.windowSize=large`，腳本初始期待 `540x960`；已將本機測試設定改回 `medium` 後原腳本通過。這不是本次功能回歸。
- **下一步建議**：用實際高傷害局或開發注入局檢查炫耀卡截圖構圖與最後一擊節奏，再決定是否增加「神局回放／自動短片剪輯」或更細的社群挑戰成就。

### 2026-06-23 鑀韻西：發行前後台總檢完成，商店變更已公開發佈

- **發行資格**：Steamworks 應用程式總覽確認商店頁與遊戲組建皆「已獲准發行」，商店狀態可見，最早可發行日為 2026-06-26；Base Game 仍為 `prerelease`，指定時間為 `2026-07-01 00:00 [GMT+8]`。
- **商務設定**：正式版套件 `1665834` 定價為 `US$2.99`，首發折扣為 10%／7 天；應用程式只啟用 Windows 64 位元，套件含 Base Game AppID `4792230` 與 Depot `4792231`。
- **功能後台**：15 項成就 API Name 全數存在，每項都有已達成／未達成圖示；Steam Cloud 配額為 10 MB／10 檔，Auto-Cloud 使用 `WinAppDataRoaming` + `BIBI DICE 比比丟八\steam-cloud` + `*.json`，正式存檔與備份共約 12 KB；Steamworks 應用程式設定沒有待發佈變更。
- **商店公開發佈**：製作人授權後，已公開發佈 Steam 成就／Steam 雲端支援標示、6 張新版截圖與 Demo 關聯中繼資料。Steamworks 回報 `Successfully published!`，再次檢視差異為 `This game has not been modified.`；公開商店可見 Steam 成就、Steam 雲端與 Demo 下載入口。
- **Demo／Build**：Demo AppID `4796530` 仍為已發行且與 Base Game 關聯；`default` 與 `internal` 仍指向 Build `23853875`，本輪未修改 Build 或遊戲程式。
- **阿扣協作**：使用 `--max-budget-usd 5.00` 完成唯讀發行稽核，實際消耗約 US$0.40；指出 `STEAMWORKS_UPLOAD_PACKET.md` 的 BuildID、645 keys 與支援功能說明落後，已由鑀韻西依 Steamworks 實際後台結果同步。
- **剩餘事項**：沒有技術或後台設定 P0；2026-07-01 仍需由製作人在應用程式總覽執行正式發行。顧客可見日期目前顯示 `2026年6月`，若希望與台灣時間 7 月 1 日字面一致，發行前需決定是否調整顯示方式。

### 2026-06-23 鑀韻西：正式版 Build 23853875 驗收通過並發布至 default

- **正式包重建**：`npm.cmd run steam:i18n:verify` 通過，四語各 645 keys；`npm.cmd run steam:package:verify` 通過全部 15 項檢查，包含 `steam-full`、Steamworks native module、`steam_api64.dll`、Cloud／成就橋接與 EXE smoke。
- **SteamPipe 上傳**：正式版 AppID `4792230`／DepotID `4792231` 已由 SteamCMD 使用既有快取登入成功上傳，建立 BuildID `23853875`，描述為 `BIBI DICE Base v1.0.0 RC - 2026-06-22`。
- **Steam 用戶端驗收**：原生 Steam 已下載並啟動 `internal` Build `23853875`；三種固定視窗、續玩／Cloud 存檔、芝芝商店、收集冊、牌型表、靈魂奉獻、Steam 成就 API 與主要介面 smoke 通過，製作人完成實玩與 Cloud 同步確認並回覆通過。
- **正式分支狀態**：2026-06-23 Steamworks 已將同一 Build `23853875` 設定上線至 `default`；後台分支表與歷史紀錄皆確認成功。`default` 與私人 `internal` 目前都指向 `23853875`。
- **目前阻擋**：本輪「重建正式包 → SteamCMD 上傳 → internal 驗收 → default 發布」已完成，沒有組建發布阻擋。
- **下一步**：發行前後台核對已於 2026-06-23 完成；若遊戲程式再有修改，需建立新 Build 重走 `internal` 驗收，不可直接覆蓋 `default`。

### 2026-06-21 鑀韻西：今日收工交接與下一輪優先順序

- **今日狀態**：今天完成的介面、靈魂奉獻、收集冊、牌型表、骰子外觀與錯誤修正，已通過語法、四語 645 keys、正式 Windows 包驗證及 Electron smoke；今晚不再修改遊戲程式。
- **P0｜製作人 + AI：上傳最新 SteamPipe Build**：製作人先前確認 BuildID `23816702` 已設為 `default`，但今天後續修改尚未上傳。下一輪先將目前 `dist/steam-windows` 上傳至測試 branch，記錄新 BuildID，完整測試後再切換 `default`。
- **P1｜製作人實機驗收**：用 Steam 用戶端測試啟動、三種固定視窗大小、存檔續玩、Steam 成就、Steam Cloud、彩虹骰外觀、靈魂奉獻、商店、收集冊、牌型表、融合與枷鎖；我與阿扣可依結果立即修正。
- **P2｜平衡調整**：實玩新靈魂奉獻項目與輪迴契約，確認價格、等級效果、敵人 HP 與靈魂收益；目前先保留既有暫定價格，等製作人試玩後集中調整。
- **P3｜文件同步**：更新已落後現況的 `FULL_VERSION_ROADMAP.md`、Steam README、上傳封包與檢查表，補記最新 BuildID、四語 645 keys、成就與 Cloud 已實作／已測狀態。
- **P4｜Steam 商店素材**：待本輪 UI 確認不再變動後，重新擷取 6 張 `1920x1080` 商店截圖並上傳，避免介面仍調整時重複製作。
- **P5｜7 月 1 日發行前檢查**：核對定價、發售日期與選項、商店頁、Base Game 最新 Build、Demo 入口、15 項成就、支援功能欄位、Steam Cloud 與 Auto-Cloud Root Path。
- **後續內容（非當前阻擋）**：新遺物／融合、敵人／Boss／挑戰、無限塔變化與鍵盤快捷鍵；排行榜與每日挑戰維持研究項目，不列為首發承諾。
- **阿扣協作**：已依 `US$5.00` 上限完成唯讀盤點；結論同樣將「今天版本上傳 SteamPipe」列為最高優先，並指出發行文件與商店截圖已落後目前版本。

### 2026-06-21 鑀韻西：神話超載卡片 NEW 標籤移到框外

- 根因：`js/ui.js` 原本把 `NEW` 做成卡片內右上角斜向緞帶，但卡片為了保護圓角內容使用 `overflow-hidden`，文字會被卡片邊界裁切。
- 修正：`js/ui.js` 為每張融合選擇卡加入不裁切的 wrapper；`css/style.css` 將新合成標記改為卡片右上方的小型水平標籤，標籤底緣貼齊卡片上框，卡片本身仍保留內容裁切。
- i18n：沿用既有四語 `ui.fusion_new_item`，目前皆為 `NEW`，未新增文案或語系 key。
- 驗證：Electron `675x1200` 三欄與 `450x800` 單欄實測均確認標籤完整位於框外、可見且無水平溢位；頁面錯誤為 0。`node --check`、四語 645 keys、`npm.cmd run steam:package:verify` 均通過，正式 Windows 包已重建並完成啟動 smoke。

### 2026-06-21 鑀韻西：資訊框切換與彩虹骰辨識度修正

- 資訊框：`js/ui.js` 為遺物／枷鎖詳情 toast 新增 keyed toggle。再次點擊同一項目會關閉現有詳情；點擊不同項目會先關閉舊詳情再開新內容，避免堆疊。一般戰鬥 toast 不參與此狀態，仍可與詳情提示並存。
- 互動相容：沿用既有遺物 pointer／click 去重；按 X、10 秒逾時與第二次點擊都會清除詳情狀態。教學枷鎖 callback 只在真正開啟詳情時觸發。
- 彩虹骰：`js/diceSkin.js` 重新分配並實圖確認八色為紅、橙、金黃、藍、紫、銀白、綠、青綠；1 與 3、1 與 6 均不再近色。所有濾鏡增加對比並針對過亮／過暗色調調整亮度，強化骰面數字辨識。
- 阿扣協作：使用 `--max-budget-usd 5.00` 完成唯讀審查，確認重複框根因在 `showToast()` 無詳情狀態，並建議 keyed 單例與色相／對比實機驗證；最終配色另以 Electron 色相試片排除 CSS 高飽和夾色。
- 驗證：Electron 實際點擊遺物與枷鎖均通過開啟／再次關閉、不同項目替換、X 關閉後重開與一般 toast 並存；彩虹骰八個 filter 唯一且實圖清晰。顛倒是非覆蓋、盲眼遮罩與零頁面錯誤回歸通過；`node --check`、四語 645 keys、`npm.cmd run steam:package:verify` 均通過，正式 Windows 包已重建並完成啟動 smoke。

### 2026-06-21 鑀韻西：新增藍晶骰／彩虹晶骰外觀選擇

- 功能：設定視窗新增「骰子外觀」，可在既有藍晶骰與彩虹晶骰間切換；彩虹晶骰讓 1～8 點各自使用固定且不同的顏色，切換後立即重繪並以既有 `diceSkin` localStorage／Steam Cloud 白名單保存。
- Ponytail 實作：沿用同一組 `img/skins/default/dice_0.webp`～`dice_8.webp` 與 CSS filter，未新增圖片、套件或遊戲狀態；`js/diceSkin.js` 改為原生 ES module，由 `js/main.js`、`js/ui.js` 明確匯入，移除隱性全域載入順序。
- 枷鎖相容：「顛倒是非」的當局亂序色彩優先於玩家外觀，仍保有辨識錯亂效果；彩虹固定色只在無該枷鎖時使用。
- 防洩漏：外觀濾色依畫面實際 `imgVal` 計算。盲眼、未擲與重骰遮罩使用 `dice_0` 且不著色；幻覺使用假點數的顏色，不會透過色彩洩漏真實點數。
- i18n：繁中、簡中、英文、日文新增外觀標籤與兩個選項，四語維持 645 keys 完全對齊。
- 阿扣協作：使用 `--max-budget-usd 5.00` 完成唯讀審查，確認應以 `imgVal` 防止幻覺洩漏、沿用既有 Cloud key，並讓顛倒是非覆蓋固定外觀色。
- 驗證：Electron 功能測試通過 `450x800` 設定視窗零溢出、即時切換、重載保存、八色唯一、顛倒是非覆蓋與盲眼遮罩；頁面錯誤為 0。`node --check`、四語 645 keys、`npm.cmd run steam:verify`、`npm.cmd run steam:package:verify` 均通過，正式 Windows 包已重建並完成啟動 smoke；測試前後玩家設定已還原。

### 2026-06-21 鑀韻西：修復「顛倒是非」枷鎖沒有實際視覺效果

- 根因：關卡指派與存檔皆有正確產生 `shackleMeta.colorMap`，但骰子改用 PNG 圖片後，`js/ui.js` 仍把亂色結果寫入已不再輸出的 `innerColor`／`outerColor` 背景 class；最終 `<img>` 完全沒有消費色彩資料。
- 修復：`js/ui.js` 將既有色彩 token 依顏色家族轉成 PNG 骰子的 `hue-rotate`／飽和度／明度濾鏡，並依骰子點數取色，使同一點數在同一關固定顯示同一錯色。
- 相容性：未改 `colorMap` 存檔格式，正式流程既有 `-500/-600/-900` token 與開發工具／舊測試存檔的 `-800` token 均可解析；無枷鎖、IDLE 與 ROLLING 狀態不套用錯色。
- 阿扣協作：使用 `--max-budget-usd 5.00` 完成唯讀審查，獨立確認斷點為 PNG 模板未使用舊背景色變數，並確認濾鏡方案是最小且舊存檔相容的修復。
- 驗證：實際 `renderDice()` 測試通過正式與舊版／開發 colorMap、無枷鎖回歸；瀏覽器實戰套用顛倒是非後，8 顆骰子皆具有效濾鏡，同點數同色且畫面可明顯辨識。`node --check`、四語 642 keys、限縮 diff 與 `npm.cmd run steam:package:verify` 均通過，正式 Windows 包已重建並完成啟動 smoke。

### 2026-06-21 鑀韻西：修復南瓜馬車招式浮字誤顯示為南瓜

- 根因：`js/engine.js` 的 C 區判定與牌型區顯示皆正確產生「南瓜馬車」；問題位於 `js/ui.js` 的招式浮字翻譯查找，使用無邊界的 `startsWith()`，使「南瓜馬車」先命中正確規則後，又被較短的「南瓜」規則覆寫。
- 修復：`js/ui.js` 新增共用 `isRuleNameMatch()`，名稱只允許完全相同，或符合既有 `牌型名(...)` 後綴格式；同步套用牌型區稀有度、單一浮字與多牌型預覽四個查找點，移除對規則陣列順序的依賴。
- 影響範圍：未修改 `js/engine.js`、`js/data.js`、倍率、判定優先權或語系文案。現有規則盤點唯一前綴碰撞為「南瓜馬車／南瓜」。
- 阿扣協作：使用 `--max-budget-usd 5.00` 完成唯讀審查，獨立確認根因為 `showHandNamesPreview()` 的前綴覆寫，並建議覆蓋南瓜馬車、南瓜、多牌型及四語測試。
- 驗證：實際呼叫 `showHandNamesPreview()` 驗證繁中「南瓜馬車」、簡中「南瓜马车」、英文 `Cinderella Ride`、日文「南瓜の馬車」皆正確；真正的「南瓜」仍顯示南瓜。`node --check js/ui.js`、四語 642 keys、限縮 diff 與 `npm.cmd run steam:package:verify` 均通過，正式 Windows 包已重建並完成啟動 smoke。

### 2026-06-21 製作人決策：阿扣單次協作預算提高至 US$5.00

- 決策：阿扣（Claude Code）正式協作任務的單次預算上限由 `US$1.00` 提高為 `US$5.00`。
- 長期規則：已更新 `AGENTS.md`；後續 `claude.exe` 正式任務預設使用 `--max-budget-usd 5.00`，除非製作人另行指定。
- 歷史紀錄：本次調整前以 `US$1.00` 執行的協作仍保留原始預算與結果；新上限只套用於本決策之後的任務。
- 範圍：只調整 AI 協作安全上限，不涉及遊戲、Steam 或專案營運費用。

### 2026-06-21 鑀韻西：收集冊進度重排與牌型／加成四語修正

- 收集冊：`index.html`、`js/main.js`、`js/ui.js`、`css/style.css` 將總完成度移到「收集冊」標題旁，牌型／遺物／枷鎖各自的收集數移到分頁標籤旁；刪除內容區重複的總進度與分頁進度卡，保留既有 `NEW` 狀態。
- Ponytail 整理：移除收集冊進度卡的 HTML 產生函式、相關 CSS 與分頁按鈕的一輪無效重複渲染；未新增套件或額外狀態。
- 加成 i18n：`js/engine.js` 的力量覺醒與力量藥劑加成名稱改讀取 `souls.finalDamage.name`、`consumables.cons_power.name`，不再硬編碼繁體中文；英文力量藥劑 toast 名稱同步統一為 `Power Elixir`。
- 牌型文案：四語系 C 區複合牌型說明改用各語系正式 A／B 區術語，移除 `4同`、`3同`、`4-of-a-kind`、`quartet` 等混用寫法；日文「碰碰和」改為「対々和」，「双三同」改為「ダブルスリーカード」。中英文 C 區標題也同步改用完整正式術語。
- 阿扣協作：第一輪廣域唯讀審查使用當時上限 `US$1.00`，回報 `Exceeded USD budget (1)` 且無可用輸出；第二輪限縮審查於同一上限內完成，確認無阻斷問題，並指出英文力量藥劑名稱、兩個日文牌型名稱與分頁重複渲染，皆已修正。製作人之後另行將未來任務上限提高為 `US$5.00`。
- 驗證：`node --check`、`npm.cmd run steam:i18n:verify`（四語各 642 keys）、限縮 `git diff --check`、英文力量覺醒／力量藥劑實際結算輸出測試均通過。瀏覽器實測 `450x800` 與 `675x1200` 收集冊無水平溢位或重疊，日文 C 區 15 張牌型文案正確；`npm.cmd run steam:package:verify` 完成正式包重建與啟動 smoke。

### 2026-06-21 製作人決策：阿扣單次協作預算提高至 US$1.00

- 決策：阿扣（Claude Code）正式協作任務的單次預算上限由 `US$0.50` 提高為 `US$1.00`。
- 長期規則：已更新 `AGENTS.md`；後續 `claude.exe` 正式任務預設使用 `--max-budget-usd 1.00`，除非製作人另行指定。
- 歷史紀錄：過去以 `US$0.50` 執行並超限的審查紀錄保留不變；新上限只套用於本決策之後的任務。
- 範圍：只調整 AI 協作安全上限，不涉及遊戲、Steam 或專案營運費用。

### 2026-06-20 鑀韻西：靈魂奉獻第二階段擴充與輪迴契約重製

- 任務：依製作人確認，先完成靈魂奉獻功能，花費數值保留日後調整；同時修復項目增加後卡片內容與晶體節點跑出邊框。
- 資料集中：`js/data.js` 新增 `SOUL_UPGRADE_DB`／`SOUL_UPGRADE_BY_ID`，統一管理所有能力等級、花費與效果參數。首版花費為命運鑑選 60、遺珍感應 40／80／120、神話容器 100／150／200／250、融合羅盤 50／80／110、商店再議 80；之後只需修改這份資料表。
- 輪迴契約：沿用既有 `soulBurst` 存檔 key 以保留已購買等級，但顯示與行為改為「輪迴契約」。新局準備可在 0～解鎖等級間選擇；強度 N 套用敵人 HP `x(N+1)`、靈魂收益 `+N`，選擇存入該局存檔，不再強制使用最高等級。
- 舊存檔遷移：舊戰鬥存檔缺少契約強度時沿用原購買等級，避免續玩時 HP 突變。舊靈魂爆發達 2／5／8／10 級會繼承 1／2／3／4 級神話容器；繼承等級標記為免費，重置靈魂時不會退還未支付的花費。
- 命運鑑選：已購買初始裝備後才可購買；新局在排除封存遺物後，提供 3 件普通遺物直接選 1 件。完成所有新局設定前不清除既有繼續存檔。
- 遺珍感應：每級把普通遺物單件權重降低 3，稀有／史詩／傳說各提高 1；3 級權重由 `50/30/15/5` 變為 `41/33/18/8`，套用商店與菁英／Boss 掉落。
- 神話容器：神話持有基礎上限 2，每級 +1，完全取代輪迴契約的舊上限效果；融合超限視窗會依實際容量顯示 `3/3` 等動態數字。
- 融合羅盤：持有單一融合素材時，另一件素材在商店的單件權重依等級變為 x2／x3／x4；已分解並停用的融合配方不加權。
- 商店再議：每間商店刷新上限由 1 增為 2，按鈕顯示剩餘次數，商店中存檔／重載後保留已用次數。
- 新局 UI：`index.html`、`js/ui.js`、`css/style.css` 將輪迴契約與遺物封存整合為「新局準備」視窗，再接命運鑑選三選一；四語系同步新增與改寫 642 個對齊 key。
- 跑框修復：`.soul-upgrade-card` 設為 `flex: 0 0 auto`，避免可捲動 flex 欄在項目增加後壓縮卡片高度；`450x800` 與 `675x1200` 的十二張卡片皆無內容溢出或互相重疊。
- 阿扣協作：依規則以 `--max-budget-usd 0.50` 啟動唯讀審查，阿扣回報 `Exceeded USD budget (0.5)`，未取得可用輸出；本輪未以其他代理替代。
- 自動驗證：隔離 Playwright 已通過舊資料遷移、契約 HP／靈魂收益、命運三選一、封存排除、兩次刷新、遺珍權重、融合權重、神話容量與動態上限、免費繼承重置，以及兩種直向尺寸零跑框／瀏覽器零錯誤。`npm.cmd run steam:package:verify` 通過全部封裝檢查與啟動 smoke，測試程序已退出，正式包不含測試截圖。

### 2026-06-20 鑀韻西：靈魂奉獻新增「預兆之瞳」與「遺物封存」

- 任務：依製作人授權，完成先前討論的兩項靈魂奉獻能力；沿用現有 Vanilla JS 與 localStorage 架構，未新增套件或跨層重構。
- `預兆之瞳`：最高 1 級、暫定花費 40；商店會預告下一關枷鎖。預告只先決定枷鎖 ID，奇偶、目標數字、封印遺物等動態參數仍在進場時產生；預告會寫入戰鬥存檔，重載商店不會改變結果，進入該關後才消耗。
- `遺物封存`：最高 2 級，暫定花費 50／100。開始新局前可從已解鎖、非神話、非消耗品遺物中封存 1／2 件，封存項目不會成為初始遺物，也不會出現在該局商店；選擇會記住供下次調整。取消選擇不會清除既有繼續存檔。
- 存檔相容：`js/main.js` 加入完整 meta upgrade 預設值合併，舊 meta／戰鬥存檔缺少新欄位時會補為 `0`、`[]` 或 `null`；靈魂重置會同步清除記住的封存清單。
- UI／i18n：`index.html`、`js/ui.js`、`css/style.css` 新增封存選擇視窗與商店預兆卡；四語系同步新增能力、提示與說明文字。封存視窗在 `450x800` 為單欄、`675x1200` 為雙欄，且明確使用 `z-index:140` 避免標題畫面攔截操作。
- 阿扣協作：依規則以 `--max-budget-usd 0.50` 啟動唯讀審查，但阿扣回報 `Exceeded USD budget (0.5)`，未取得可用輸出；本輪未以其他代理冒充阿扣。
- 自動驗證：隔離 Playwright 流程已通過封存上限、取消保留舊存檔、初始遺物／商店排除、預兆跨重載固定、下一關採用同一枷鎖、`450x800`／`675x1200` 無水平溢位與瀏覽器零錯誤；測試曾隨機覆蓋 `盲眼` 與 `溺水` 預兆。`npm.cmd run steam:package:verify` 亦通過全部封裝檢查與啟動 smoke，測試程序已退出。
- 待製作人確認：花費 40、50／100 為首版平衡值，可在實玩後調整。無限塔第一次進入前沒有商店，因此第一次無限層不會顯示預兆；後續無限塔商店照常預告。

### 2026-06-20 製作人決策：阿扣單次協作預算調整

- 決策：阿扣（Claude Code）正式協作任務的單次預算上限由 `US$0.20` 提高為 `US$0.50`。
- 長期規則：已寫入 `AGENTS.md`；後續 `claude.exe` 正式任務預設使用 `--max-budget-usd 0.50`，除非製作人另行指定。
- 範圍：只調整 AI 協作安全上限，不涉及遊戲、Steam 或專案營運費用。

### 2026-06-20 鑀韻西：牌型倍率表直向版閱讀優化

- 任務：依製作人確認，修正遊戲內牌型表在直向大視窗被排成兩欄、卡片內容過小的問題。
- 完成：`js/ui.js` 為群組、網格、卡片、名稱、說明與倍率加入專用 class；`css/style.css` 讓直向版固定單欄，放大卡片及文字，倍率使用固定右側區塊。非直向寬版仍維持雙欄。
- Ponytail 整理：刪除遊戲說明「牌型」分頁內重複的牌型 HTML 產生碼，改為呼叫 `renderRulesDB()` 後共用結果；未新增套件、資料或語系文字。
- 阿扣協作：登入狀態正常；唯讀檢查於 69.5 秒時超過 `US$0.20` 預算，未取得可用輸出，本輪未以其他代理替代阿扣。
- 視覺驗證：Electron 實測 39 張牌型卡；`450x800` 與 `675x1200` 均為單欄、所有名稱／說明／倍率無溢出；遊戲說明牌型分頁同步套用；`1200x800` 寬版維持雙欄且無溢出。
- 最終驗證：`node --check js/ui.js`、`npm.cmd run steam:i18n:verify`、限縮 `git diff --check`、`npm.cmd run steam:package:verify` 全部通過；`dist/steam-windows/BIBI-DICE.exe` 啟動 smoke 成功且測試程序已退出。
- 目前狀態：本輪介面需求完成，等待製作人在 Steam 用戶端確認實際閱讀感受。

### 2026-06-20 鑀韻西：遺物商店擴版與靈魂節點雙態化

- 任務：依製作人確認，降低遺物商店下方留白、放大並增加卡片資訊承載；靈魂奉獻移除容易混淆的第三種晶體狀態。
- 完成：`js/ui.js` 將商店卡片整理成上方名稱／稀有度、下方完整效果說明的兩層結構，不新增遺物資料或虛構分類。
- 完成：`css/style.css` 放大卡片、標題、效果文字與稀有度標籤；直向版三張卡片會共同使用主要高度。`450x800` 的三筆長描述與 `675x1200` 的三筆一般描述均無裁切、溢出或不必要捲動。
- 完成：靈魂節點只使用 `img/ui/soul_node_on.png` 與 `img/ui/soul_node_off.png`；已購買為亮、未購買為暗，移除 `soul_node_next.png`。購買能力仍由既有卡片狀態與花費按鈕呈現。
- 阿扣協作：`claude.exe auth status` 正常；唯讀稽核命令於 184 秒後逾時，未取得可用回覆，本輪未以其他代理冒充阿扣。
- 驗證：`node --check js/ui.js`、`npm.cmd run steam:i18n:verify`、限縮 `git diff --check`、`npm.cmd run steam:package:verify` 全部通過；`dist/steam-windows/BIBI-DICE.exe` 啟動 smoke 成功。
- 目前狀態：本輪需求完成，沒有未解決的程式問題；下一步為製作人在 Steam 用戶端實際操作商店與靈魂奉獻，確認視覺偏好。


---

### 開工讀取順序

1. 先讀本區，確認目前真實狀態。
2. 再讀 `AGENTS.md`，遵守繁體中文、MVC 分層、i18n 與改檔前計畫規則。
3. 再讀 `AI_COLLABORATORS.md`，確認 AI 協作稱呼與身份。
4. 再讀 `CHANGELOG.md` 最新段落，確認已完成變更。
5. 若任務與 Steam 有關，先讀 `promo/steam/README.md`，不要直接讀舊任務單或憑記憶判斷。

### 重要協作規則

- 禁止只依照 AI 自己的記憶判斷進度。
- 禁止從本檔下方很舊的歷史紀錄直接推斷目前狀態。
- 若文件互相衝突，以本區、`promo/steam/README.md`、`STEAMWORKS_UPLOAD_PACKET.md` 的最新狀態為準，並回報衝突。
- 新任務完成後，必須把「目前真實狀態」更新到本區或相關主文件，避免下一位 AI 讀到落後資訊。
- 已封存到 `promo/steam/archive/` 的文件只供追溯，不再作為任務進度來源。

### 已安裝插件與優先使用時機

後續 AI 不可只用通用回答；遇到下列任務時，應優先檢查並使用對應插件或 MCP 工具：

- **Canva**：社群圖、宣傳圖、Steam/itch.io 行銷素材、可編輯設計稿。
- **Creative Production**：行銷視覺、廣告素材、活動宣傳圖初稿。
- **Figma / Product Design**：UI 設計稿、Steam 圖像版型、設計系統、Figma 連結或設計轉程式工作。
- **HyperFrames by HeyGen**：HTML 動畫影片、Steam Trailer、短影片、社群影片、可重複渲染的影片模板。
- **Remotion**：程式化影片、發售倒數影片、更新公告影片、固定模板式 Trailer。
- **Presentations**：簡報、提案、pitch deck、企劃整理。
- **Spreadsheets / Data Analytics**：表格、數據整理、KPI、銷售/願望清單/測試回饋分析。
- **GitHub**：PR、Issue、CI、發佈流程、程式碼審查與上傳協作。
- **CodeRabbit**：PR 自動審查、風險檢查、程式碼品質回饋。
- **Linear**：任務管理、bug 追蹤、Steam 發行 checklist、阿扣/Codex 分工。
- **Sentry**：玩家端錯誤、Electron/前端例外、發行後 crash 或錯誤追蹤。
- **Notion / Google Drive / Gmail / Slack**：文件、雲端檔案、信件與團隊訊息需要搜尋、整理或撰寫時使用。

注意：上述插件不能直接補上 in-app Browser 的本機檔案上傳能力；Steamworks 檔案選擇器若仍不支援自動選檔，需由製作人手動選檔，AI 負責產生、驗證、整理正確檔案路徑。
---

### 目前真實狀態

| 項目 | 狀態 |
|---|---|
| Base Game AppID | 4792230 |
| Base Game Build | 23853875 (default + internal) |
| 發行排程 | 2026-07-01 00:00 [GMT+8] |
| Demo AppID | 4796530 |
| Demo Build | 23496399（已發行） |
| 四語系 | 668 keys 對齊（2026-06-26 驗證） |
| SteamCMD | D:\tools\steamcmd\steamcmd.exe |
| ContentRoot | D:\unity\bibi-dice\dist\steam-windows |
| itch.io html Build | 第 14 版，同步 Demo Build 23496399 |

---

### 待處理問題

| 問題 | 狀態 | 說明 |
|---|---|---|
| Steam 商店影片四語版 | 待乾淨來源 | 英文直式草稿已完成；需製作人提供無特效中文字的來源，再製英/日/簡中/繁中四支 |

### 已處理問題

| 問題 | 完成日期 | 處理方式 |
|---|---|---|
| Build 23853875 驗收通過並發布至 default | 2026-06-23 | SteamPipe 上傳，internal 驗收後 SetLive default |
| 發行前後台總檢完成 | 2026-06-23 | 阿扣唯讀稽核後同步文件 |
| D 區「兩極」有效牌型顯示變暗 | 2026-06-26 | isZoneActive() 分離判斷 |
| 南瓜馬車招式浮字誤顯示為南瓜 | 2026-06-21 | isRuleNameMatch() 完全比對 |
| 顛倒是非枷鎖沒有實際視覺效果 | 2026-06-21 | hue-rotate 濾鏡替代舊背景 class |
|幻覺枷鎖重骰後沒有立即套用假資訊 | 2026-06-06 | renderDice 收尾套用 fakeNumber |
| library_hero_3840x1240.png 規則誤判 | 2026-06-01 | 改為必要素材（Steam 守則更新） |

---

### 目前可用指令

    npm.cmd run steam:build               # 重產 dist/steam-demo（純 web）
    npm.cmd run steam:package              # 打包 Windows Steam build
    npm.cmd run steam:package:verify       # 打包 + 驗證 + smoke（UI 改後必跑）
    npm.cmd run steam:verify               # Electron 啟動驗證
    npm.cmd run steam:i18n:verify          # 四語系 key 對齊驗證
    npm.cmd run steam:assets:verify        # Steam 素材尺寸驗證（19 必要）
    npm.cmd run steam:capture              # 重產 9 張 Steam 商店截圖
    npm.cmd run steam:capsules             # 重產 Store Capsule
    npm.cmd run steam:library              # 重產 Library 素材
    npm.cmd run steam:app:dev              # Electron 直接啟動（不重打包）
