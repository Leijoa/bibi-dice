# SYNC.md - AI 協作交接總表

## AI 快速交接區（任何 AI 開工前必讀）

最後更新：2026-07-10

### 2026-07-10 阿扣（新手教學枷鎖移後 + 絕對秩序說明改八顆）
- 狀態：完成並實機驗證，待製作人確認 commit + 打包
- 教學：枷鎖說明原在第 2 步（玩家還沒學鎖定就要懂枷鎖）→ `TUTORIAL_STEPS` 重排，枷鎖移到 index 6（攻擊前）；順序 敵人→回合→骰子→鎖定→重骰→傷害→枷鎖→攻擊→商店→完成。文字綁索引，四語系 `tutorial.step1~6` 同步輪轉。`forceDiceAfterRoll`(idx4)、`TUTORIAL_ATTACK_UNLOCK_STEP=7` 仍對齊
- 絕對秩序：說明改「八顆數字全為奇數或全為偶數」（基礎門檻 8，7/6 靠遺物【寬容】/【天秤之極】）——`data.js` + 四語 `rule_d1.desc`；牌型表範例骰改 8 顆全奇；未動 engine 判定
- 驗證：`steam:i18n:verify` 716 keys 對齊；實機啟動教學逐步核對文字/高光對齊、枷鎖在第 7/10 步、step0=敵人 step1=回合
- 注意：預覽 screenshot 此 session 逾時（環境），以 i18n 對齊＋實機 DOM 推進驗證
更新者：阿扣（Claude Code）

### 2026-07-10 阿扣（牌型表範例骰改抽象標記 字母/數字/?）
- 狀態：完成，DOM 逐一驗證，待製作人確認 commit + 打包
- 任務：範例骰秀具體數字會誤導、小標籤不直覺 → 改抽象標記讓骰子本身表達規則
- 標記法（對照 engine.js）：相同字母 x=同數、連續字母 abc=連續、數字=指定、?=任意骰；補滿 8 顆
- 修改：`js/ui.js` `RULE_EXAMPLE_DICE` 改 token 陣列 + `renderExampleDie`(三色:金指定/青任意/灰?、?淡化) + `renderRulesLegend`(頂端圖例)；四語系加 `ui.legend_same/run/fixed/wild`；`css/style.css` num 三色 + wild 淡化 + legend 樣式；保留指定/任意小標籤
- 固定牌型 ? 數嚴格對照 engine：二進位 1248+4?、質數 2357+4?、圓周率 11346+3?、斐波那契 112358+2?、自然對數 122788+2?（注意 used=[1,2,2,7,8,8] 非 271828）；絕對二進位/絕對質數/彗星/全異/兩極整盤 8
- 驗證：`steam:i18n:verify` 716 keys（+4）；DOM 核對 39 牌型 token 與 engine 一致、三色正確、圖例 4 項、?淡化 0.5
- 注意：牌型表 modal 圖多，預覽 screenshot 會 compositor 逾時，本次以 DOM 檢查驗證（單顆骰疊字視覺前版已截圖）
更新者：阿扣（Claude Code）

### 2026-07-09 阿扣（牌型表加「指定數字／任意數字」標籤）
- 狀態：完成並實機驗證，待製作人確認 commit + 打包
- 任務：玩家分不出牌型表哪些骰子是舉例、哪些是必要特定數字 → 名稱旁加標籤
- 分類：指定數字（琥珀）＝彗星/兩極/全異/斐波那契/圓周率/自然對數/二進位/絕對二進位/質數/絕對質數（骰面即答案）；其餘為任意數字（灰）
- 修改：`js/ui.js` 新增 `FIXED_NUMBER_RULE_IDS` + `renderRuleTag()`，名稱旁加標籤；四語系 locale 新增 `ui.hand_tag_fixed`/`ui.hand_tag_any`；`css/style.css` `.rule-tag` 系列
- 驗證：`steam:i18n:verify` 712 keys 對齊（+2）；531×970 實機確認 10 指定牌型標琥珀、其餘標灰、英文不破版
更新者：阿扣（Claude Code）

### 2026-07-09 阿扣（牌型表範例骰子改空白骰底＋大字數字）
- 狀態：完成並實機驗證，待製作人確認 commit + 打包
- 任務：牌型表範例骰子的骰面數字太小難讀 → 改用空白骰底 `dice_0.webp` + 疊大字數字
- 修改：`js/ui.js` `renderRuleExampleDice` 改用 dice_0 底圖 + `.rule-dice-mini__num` 疊字；`css/style.css` `.rule-dice-mini` 改相對定位容器，骰放大 28px（portrait 32px）、金色 900 粗數字 18px（portrait 20px）+ 描邊
- 驗證：531×970 開牌型表 245 顆數字皆放大清晰、1~8 正確、分組「＋」完整、最寬列無溢位
更新者：阿扣（Claude Code）

### 2026-07-09 阿扣（浮條改底部＋動態平衡不擋骰＋ABCD 角標左下＋設定 toast 卡死修復）
- 狀態：#1~#5 全部完成並實機驗證
- #1 牌型說明浮條擠壓骰子 → **找到根因**：`#board-panel > *`（ID 選擇器）強制盤面子元素 `position:relative;z-index:1`，蓋掉浮條的 absolute，使浮條佔版面流把骰子往下推。解法：`#board-panel > .hand-hint-banner { position:absolute; z-index:30 }`（`css/style.css`）。並將浮條由頂部改**盤面底部**、右緣讓開控制列
- #4 過長說明截斷 → 浮條改可換行、移除省略號；壓縮行高/padding，最長說明（絕對質數 2 行）overlap −1px 不壓骰
- #2 動態平衡每次首骰提示擋骰 → 新增 `#board-notice-banner` + `UI.showBoardNotice()`（盤面底部同位置），`js/main.js` 的 balance 提示由 `showToast`（中央擋骰）改 `showBoardNotice`；與牌型浮條互斥
- #5 ABCD 角標英文版與牌型名重疊 → `.zone-corner-label` 由左上改**左下角**
- #3 設定介面偶發「只有設定視窗不能點」→ **已定位並修復**：`showToast` 的 toast 掛在 `body`，而設定視窗（z-120）在有 `transform` 的 `#game-container` 內（獨立 stacking context），body 層 toast（z-100）反而疊在被困住的設定視窗之上；開設定時剛好有 toast 殘留就會擋住控制項。修法：`js/ui.js` toast 本體改 `pointer-events:none`（純通知），× 另設 `auto`。實機驗證 `elementFromPoint` 於 toast 中心已回傳設定視窗內容、× 仍可點
- 修改檔：`index.html`、`js/ui.js`、`js/main.js`、`css/style.css`
- 驗證：`node --check` 通過；531×970 實機量測＋四張截圖（浮條底部不壓骰、動態平衡底部不擋骰、英文 ABCD 左下不重疊、最長說明不壓骰）
- 注意：尚未打包進 exe；#2 目前只改 balance，rebel/forcedshift 等首骰提示仍為中央 toast，如要一致可比照改
更新者：阿扣（Claude Code）

### 2026-07-09 阿扣（牌型表加入範例小骰子，子牌型分組）
- 狀態：完成，待製作人確認 commit + 打包（尚未 commit、未打包進 exe）
- 任務：牌型表只有文字不夠直觀 → 說明下方加該牌型範例小骰子，且要美觀＋辨識度高
- 修改（僅表現層，未動 engine/data/main）：
  - `js/ui.js`：新增 `RULE_EXAMPLE_DICE`（39 牌型「子牌型分組」二維陣列）＋ `renderRuleExampleDice()`；複合牌型拆多組以「＋」串接對應說明結構，單牌型單組；骰面重用 `getDiceImageUrl`／`getDiceImageFilter` 隨玩家外觀變化＋輕 drop-shadow；rule-card 改 `items-start`
  - `css/style.css`：`.rule-card__dice`／`.rule-dice-group`／`.rule-dice-plus`／`.rule-dice-mini`（22px、portrait 26px）
- 文字：骰子/「＋」皆圖示，未新增 i18n key
- 驗證：`node --check` 通過；`steam:i18n:verify` 710 keys 對齊；540×960 開牌型表——39 卡共 61 組、22 個「＋」與設計吻合、骰圖載入正確；量測南瓜馬車「五同＋三同」兩組與「＋」位置正確、經典四對子 4 組 2 顆分隔、比比丟八單組 8 顆無「＋」
- 注意：截圖工具對含大量骰圖的牌型表 modal 會 compositor 逾時（環境問題非程式），本次以幾何量測＋計數驗證；mini 骰子視覺已於前一版成功截圖確認
更新者：阿扣（Claude Code）

### 2026-07-09 阿扣（ABCD 四區左上角牌型分區浮水印 + 點區牌型說明浮條）
- 狀態：完成，待製作人確認 commit + 打包（尚未 commit、未打包進 exe）
- 追加任務：玩家搞不懂 ABCD 四區是什麼 → 四區左上角加 A/B/C/D 浮水印標示
  - `js/ui.js`：`renderScore` 四個 `#zone-box-*` 各加 `<span class="zone-corner-label">A~D</span>`（純字母，不需 i18n）
  - `css/style.css`：`.zone-corner-label`——左上角絕對定位、`var(--font-number)`（Bahnschrift）、26px（md 32px）、`currentColor` 繼承區色、opacity 0.32 浮水印、pointer-events none
  - 驗證：`node --check` 通過；540×960 實機截圖確認四區左上角 A/B/C/D、Bahnschrift 字體、色彩對應、不擋牌型名與倍率
- 原任務（點 ABCD 區高光骰子時顯示牌型說明浮條）：
- 任務：製作人回報玩家點 ABCD 區看骰子高光後仍不懂「為何這幾顆發動」，要求高光同時跳出牌型說明，但不能擋到骰子
- 修改（單點、只動表現層，未動 `engine.js`/`data.js`/`main.js`）：
  - `index.html`：`#board-panel` 內新增 `#hand-hint-banner` 浮條
  - `js/ui.js`：新增 `updateHandHintBanner()`，`renderDice` 結尾呼叫；點區高光時於盤面頂部顯示「牌型名 x倍率 — 說明」，非 WAIT_ACTION／無高光／失憶枷鎖隱藏；牌型查詢重用 `RULE_DB`＋`isRuleNameMatch`
  - `css/style.css`：`.hand-hint-banner` 系列——絕對定位盤面頂部（覆蓋標題列、骰子正上方，不遮骰子）、ABCD 四色、說明單行省略號、跳出動畫
- 文字：**重用既有 `rules.<id>.name`／`.desc` 四語 key，未新增任何 i18n key**
- 驗證：`node --check js/ui.js` 通過；`steam:i18n:verify` 四語 710 keys 對齊（不變）；本機 http server 實機——A/D 區浮條正確顯示、色彩對應、不與骰子重疊、再點同區/重骰/5 秒自動皆隱藏、540×960 無溢位
- 注意：`.claude/launch.json` 為本次 preview 用的靜態伺服器設定（暫存，不建議入 commit）；UI 已改但**尚未跑 `steam:package:verify`**，未反映到製作人玩的 exe
更新者：阿扣（Claude Code）

### 2026-07-08 阿扣（全套圖片＋影片廣告產製與審查）
- 狀態：完成；成品待製作人確認後投放，未 commit
- 任務：以官方腳本（`promo/social/steam-launch-short/` frame.md 與四語 POST_COPY）與既有素材為源，並行產出全套廣告，逐件審查後分類
- 產出（`promo/ads/`，共 9 件全數通過審查，rejected/ 為空）：
  - 圖片 6 張（approved/）：直式 1080×1920、方形 1080×1080、橫式 1200×628，各繁中＋英文版；HTML 模板＋Playwright 產圖，來源檔在 `promo/ads/src/image/` 可重跑
  - 影片 3 支（approved/，各附 contact sheet）：繁中直式 1080×1920 12s、繁中方形 1080×1080 10s、英文橫式 1920×1080 15s；HyperFrames 0.7.17 專案在 `promo/ads/src/video-*/` 可改文案重 render
  - 審查紀錄：`promo/ads/REVIEW.md`（標準、逐件結果、改進建議）
- 審查修正：直式跑馬字與橫式常駐 HUD 均誤植「ROGUELIKE」，已改「ROGUELITE」重 render 並抽幀複驗
- 注意：
  - **發現上游素材互換**：steam-launch-short 的 zh-tw/02-reroll.mp4 實為簡體、zh-cn 反為繁體（已列入待處理問題）；本次繁中影片已改用正確檔，原檔未動
  - 英文版三張圖片的實機截圖為繁中 UI（沿用 Steam 商店官方截圖）；日後投英語市場建議補英文 UI 截圖
  - 未修改任何遊戲程式與既有 promo 專案
更新者：阿扣（Claude Code）

### 2026-07-08 阿扣（擬人模擬遊玩系統 Phase 2~4：五人格／生涯模擬／儀表板／A/B 對比）
- 狀態：Phase 1~4 全部完成，待製作人確認 commit
- Phase 2（五人格＋失誤模型）：
  - 新增 `sim/personas/novice.mjs`（新手：高失誤 25%、三顆同數就提早攻擊、完全相信畫面假數字）、`veteran.mjs`（老手：低取樣心算期望值＋比較雜訊±12%＋5% 失誤）、`gambler.mjs`（賭徒：四顆同數就追大牌、六種數字追彗星、商店只梭哈高稀有度）
  - `heuristics.mjs` 新增共用失誤模型 `applyMistake`（多鎖/漏鎖一顆）
  - 500 局/組結果：零升級通關率 新手 2.6%／休閒 12.2%／老手 29.2%／賭徒 44.8%／理論派 31.8%
  - **重要平衡信號：賭徒（無腦追同數大牌）> 理論派（一步期望值最佳化）**，代表現行牌型數值極度獎勵 All-in 追大牌路線，垃圾時間少、爆發才是王道；理論派是一步貪婪不是真上限，解讀報表時兩者都要看
  - 資訊枷鎖實測有效：【假象】對新手 -47.2% 通過率（假傷害數字騙到），對理論派幾乎無感（自行心算）
- Phase 3（生涯模擬 `sim/core/career.mjs`＋`sim:career` 指令）：
  - 從零帳號連打多局：局間依人格優先序購買靈魂升級、契約層數自適應（贏加輸退；賭徒永遠拉滿、新手永遠 0）、通關後依人格意願進無限塔（上限 60 層防呆）
  - `run.mjs` 重構出 `simulateRunWithState`（可跨局共用 metaData/collection、支援契約與無限塔）；Phase 1 介面 `simulateRun` 相容保留
  - 輸出 `career_progression.csv`（逐局）與 `career_summary.csv`（每條生涯摘要：全解鎖於第幾局、前10局 vs 整體通關率、無限塔最深、契約層）
- Phase 4（儀表板＋A/B）：
  - `sim/report/dashboard.mjs`：批量模式自動產出單檔 `dashboard.html`（零依賴、離線可開、深淺色自適應）：通關率總表、分關卡通過率折線圖、遺物勝率增益 Top/Bottom 10 橫條、枷鎖難度橫條、靈魂節奏表
  - `sim/compare.mjs`＋`sim:compare` 指令：比較兩份 snapshot.json（批量模式自動輸出），列出通關率／關卡／遺物／枷鎖的顯著變動；同 seed 下差異＝純數值改動效果。用法已寫在 compare.mjs 檔頭
- 生涯模式正式跑結果（8 條生涯/人格 × 上限 120 局，seed 42）：
  - 全解鎖靈魂升級所需局數中位數：賭徒 85 局（拉滿契約刷靈魂最快但整體通關率僅 20.3%）、理論派 101、老手 106；**新手與休閒 120 局內無法全解鎖**（新手整體通關率 34.9%、休閒 77.8%）——若希望一般玩家 50~80 局全解鎖，可考慮調降部分升級價格或提高靈魂收入
  - 無限塔最深：理論派 32 層、老手 31、休閒 22、賭徒 20、新手 0（不敢進塔）
- 驗證：`sim:verify` 10 項全過（決定性涵蓋五人格）；批量 5000 局 66 秒；生涯正式跑 253 秒完成；compare 以 500 局 vs 100 局同 seed 快照實測，統計波動正確標示
- 指令總覽：`npm.cmd run sim`（批量＋CSV＋儀表板＋快照）、`sim:career`（生涯）、`sim:compare A B`（A/B）、`sim:verify`（保真）
更新者：阿扣（Claude Code）

### 2026-07-08 阿扣（擬人模擬遊玩系統 Phase 1：sim/ 無頭模擬器＋四份平衡報表）
- 狀態：Phase 1 完成；後續 Phase 2~4 見上一條
- 任務：製作人指示規劃「最擬人的模擬遊玩」輔助平衡數值。舊的 capture-random-locale-playtest.js 是純隨機點擊（截圖用），無決策概念
- 實作（新增 `sim/` 目錄，**未動任何遊戲程式**）：
  - `sim/core/adapter.mjs`：Node 掛空殼 window 後直接 import 真引擎 `js/engine.js` 與 `js/data.js`，計分數值零複製
  - `sim/core/rules.mjs` / `battle.mjs` / `shop.mjs` / `run.mjs`：從 main.js 忠實移植回合結構、重骰／鎖定限制、全部枷鎖結算、商店三選一、融合、菁英掉落、靈魂公式（每段註記 main.js 來源行號；**main.js 戰鬥邏輯改動時需同步**）
  - `sim/personas/`：casual（休閒：留最大同數群＋10% 手滑）與 theorist（理論派：候選鎖法＋真引擎取樣期望值，平衡上限基準）；人格只看得到「畫面可見資訊」，盲眼／幻象／虛張聲勢／酒醉／假象會真實影響決策品質
  - `sim/report/`＋`sim/cli.mjs`：五份 CSV（UTF-8 BOM，Excel 直開）：難度曲線與死亡熱點、遺物強度榜、枷鎖難度實測、靈魂節奏、每局摘要
  - `package.json`：新增 `sim`、`sim:verify` 指令；`.gitignore` 新增 `sim/output/`
- 驗證：`sim:verify` 7 項全過（含 **alldamege.csv 全部 6435 組合 vs 引擎輸出零誤差**、同 seed 決定性、鐵壁／絕對屏障／同歸於盡結算劇本）；正式批量 2000 局（2 人格 × 零升級/全升級 × 500 局）48 秒跑完
- 首批發現（500 局/組，seed 42）：
  - 通關率：休閒×零升級 12.2%、理論派×零升級 31.8%、休閒×全升級 94.8%、理論派×全升級 97.8%
  - 死亡熱點：零升級集中在第 6~10 關（休閒卡第 8 關遺忘守護者、理論派卡第 9 關虛空大祭司）
  - 枷鎖：對休閒零升級最兇的是【同歸於盡】-48.8%、【反傷裝甲】-37.3% 通過率
  - 遺物：【中流砥柱】持有勝率 +41%；**神話遺物【微縮星雲】【六道輪迴】勝率增益為負**，疑似做工成本高於回報，建議製作人檢視
  - 靈魂節奏：零升級休閒玩家估計需 ~1196 局才能全解鎖局外升級（未計契約加成，Phase 3 會精算）
- 注意：製作人未回覆的兩個選項採推薦值執行（經濟報表改為靈魂節奏＋三選一選購行為，因遊戲無金錢系統；難度曲線跑零升級/全升級兩組對照），可隨時推翻重跑；`sim` 為模擬工具非遊戲內容，不影響 Steam 打包與四語系
更新者：阿扣（Claude Code）

### 2026-07-06 阿扣（製作人專用作弊測試捷徑：--bibi-dev 開發閘門）
- 狀態：完成，待製作人確認 commit 範圍
- 任務：H1 鎖定作弊入口後，製作人需要「點兩下就開作弊模式主程式」的專用捷徑
- 實作：
  - `steam-app/main.js`：新增 `DEV_CHEAT_MODE`（啟動參數 `--bibi-dev` 或環境變數 `BIBI_DICE_DEV=1`），成立時遊戲 URL 附加 `bibiDev=1`
  - `js/main.js`、`js/ui.js`：IS_DEV 增加「`bibi:` 協定且帶 `bibiDev=1`」判斷；**限定 bibi: 協定**，網頁版（itch/GH Pages）網址帶參數無效
  - `package.json`：新增 `steam:app:devcheat` 指令（Electron 直啟作弊模式）
  - 桌面捷徑：`C:\Users\Leijoa\Desktop\BIBI DICE 作弊測試模式.lnk` → `dist/steam-windows/BIBI-DICE.exe --bibi-dev`（捷徑檔在桌面、不在 repo）
- 安全邊界：Steam / 正常點 exe 不帶參數 → 作弊全關；玩家須自行讀公開原始碼並刻意帶參數啟動才能開（等同單機祕技，僅影響自己）
- 驗證：四檔語法檢查通過；`steam:package:verify` 19 項 check 全過（曾因殘留 BIBI-DICE.exe 行程失敗一次，Stop-Process 後重跑通過）；已確認打包後 exe 內含閘門
- 注意：**每次重新打包後捷徑仍然有效**（指向固定 dist 路徑）；`package.json` 的 devcheat 指令與 capacitor 相依同檔，建議留給手機版批次一起 commit
更新者：阿扣（Claude Code）

### 2026-07-06 阿扣（Phase 3 交叉驗收通過；獨立完成 Phase 4，19 項全數修復）
- 狀態：**Phase 1～4 全部完成**；尚未 commit / push / 發布，待製作人決定
- 背景：阿扣 session 上限恢復後回歸；製作人指示韻西額度用盡，Phase 3 驗收與 Phase 4 由阿扣獨立完成
- **Phase 3 交叉驗收：通過**（唯讀重驗 M2/M4/M7，並抽查 Phase 1/2）：
  - M2 弒神：`buildActiveShackleConfig` 展開完整 SHACKLE_DB 定義、data.js 改 heavy、骰面角標同步停用；引擎獨立實測 8 顆 2＋血色聖戰 totalBase 240→16
  - M4：`window.showToast` 已掛上；M7：subscribe 改呼叫 UI 模組函式並帶正確參數，`currentTab` 已提升作用域
  - 抽查 H1（IS_DEV 閘門全數到位，含 keydown 作弊、dev API、5 連點）、H2（fireAttack→enemyDefeated、無限塔直接開商店）、M1/M3/M5/M6/M8 皆與計畫一致；引擎實測 M3 空區不生效／對子×2、banality 下 D 藥水維持×1
- **Phase 4（L1~L9）由阿扣實作完成**：
  - L1：applyMatch 加 matchVal（黑洞 8 視為 1）修高亮錯位
  - L2：天譴改 `rarity >= 4`（含 rarity 5，依裁定）；並發現原精確比對會漏掉「比比丟八(ビビデバ)」，改用 `getRuleMetaByName`
  - L3：商店買空文案與契約前綴改四語 key（`ui.contract_prefix`、`ui.contract_prefix_infinite`、`messages.shop_sold_out`）
  - L4：依裁定採現狀（平庸之惡完全封鎖 D 藥水），不改碼
  - L5：移除重骰動畫開始前的 saveGame，避免「已扣次、骰面未換」半套存檔
  - L6：loadGame 回傳成敗；損毀存檔改退回標題＋清除＋`messages.save_corrupted` 提示，不再黑畫面軟鎖
  - L7：i18n.js 四語 ui 區塊重複 key 去重（保留後者覆蓋的生效值，Node 實測 11 組一致）
  - L8：Electron `bibi://` 路徑檢查補 `root + path.sep` 前綴
  - L9：runtime.js `crypto.randomUUID` 加非安全來源 fallback
  - M7 補強：語言切換時收集冊分頁按鈕文字同步刷新（`refreshCollectionModalUI`）
- **驗證**：全部修改檔 `node --check` 通過；`steam:i18n:verify` 四語 710 keys（+4）完全對齊；i18n 生效值與新 key 格式化 Node 實測通過；引擎功能測試（弒神/藥水/banality）通過；`npm.cmd run steam:package:verify` 完整通過（17 項 check ＋ EXE smoke，含最終天譴修正後重跑一次）
- **注意**：本檔待處理問題已結案搬移至已處理問題；發布前建議製作人實機試玩 `dist/steam-windows/BIBI-DICE.exe`（重點：通關 Boss 拿 2 靈魂＋掉落、正式包無作弊入口、四語切換）
更新者：阿扣（Claude Code）

### 2026-07-06 鑀韻西 × 阿扣（19 項 Bug 修復進行中；Phase 3 驗收受阻）
- **製作人裁定**：M2「弒神」完成上線；M3 區域藥水採非空區 `×2.0`；L2「天譴」包含 rarity 5；【平庸之惡】完全封鎖 D 區藥水。
- **Phase 1 已完成並由韻西交叉驗收**：正式 `bibi://` 封裝不再建立作弊碼、開發者 API／按鈕 handler 或五連點入口；localhost／127.0.0.1 開發工具維持可用。最終 Boss 改走 `enemyDefeated()` 正常發放 2＋契約靈魂與傳說掉落，進入無限塔改直接開商店、不重複發獎。
- **Phase 2 已完成並由韻西交叉驗收**：修正破壞鉗套用順序、區域藥水乘算與空區判斷、血色聖戰角標／死碼、舊存檔契約 fallback、無掉落菁英靈魂。專項實測確認平庸之惡下 D 藥水最終維持 `×1`、血色聖戰 HP `2/3` 時八顆 2 皆顯示 40、全遺物後第 3 關菁英仍獲得 1 靈魂。
- **Phase 3 已實作、尚未完成阿扣交叉驗收**：弒神已改為重型枷鎖並透過共用設定組裝傳入 `suppressMythic`；骰面角標同步停用神話加成；噪音遺物提示與三種 modal 語言切換已修復。本機實測弒神八顆 2 的總基礎由 240 降為 16、角標由 30 回到 2；噪音提示與歷史／收集冊／靈魂視窗切語言皆通過且零 console error。
- **驗證**：Phase 1～3 相關檔案 `node --check`、`git diff --check`、四語 706 keys、最新 `npm.cmd run steam:package:verify` 16 項均通過。
- **確切阻塞**：阿扣啟動 Phase 3 唯讀交叉驗收時，`claude.exe` 回報 `You've hit your session limit · resets 10pm (Asia/Taipei)`，未取得有效驗收輸出。依共同規劃硬閘門，韻西已停止後續 Phase 4，不得在阿扣恢復前獨自繼續。
- **下一步**：台北時間 22:00 後重新呼叫阿扣完成 Phase 3 唯讀交叉驗收；通過後才開始 Phase 4（L1～L9、聚焦測試與最終文件收尾）。目前未 commit、未 push、未部署或發布。

### 2026-07-06 阿扣（遊戲程式碼全面查核：19 項問題與修復計畫書）
- 狀態：查核完成、**未修改任何遊戲程式**；待製作人核准後由阿扣 × 韻西共同修復
- 任務：製作人指示全面細讀程式碼找出實際 bug 與邊界破綻，按嚴重度列出
- 範圍：`js/` 全部（engine/data/main/ui/i18n/audio/diceSkin/platform 全套）、`steam-app/`、`index.html`；並以 grep 與 Node 腳本交叉驗證全域函式、遺物 id、四語系 key 對齊
- 發現：**高 2 項**（H1 正式版作弊入口全未鎖 IS_DEV 可刷靈魂/成就；H2 通關最終 Boss 直接 gameWin 跳過靈魂與傳說掉落）、**中 8 項**（破壞鉗無法還原枯萎、弒神枷鎖半成品零效果、區域藥水空區白拿 3 倍、噪音枷鎖點遺物 TypeError、血色聖戰角標引用不存在 id、舊存檔誤套最高契約、語言切換回呼呼叫不存在函式、菁英怪無掉落時不給靈魂）、**低 9 項**
- 產出：
  - `docs/ai-collaboration/tasks/game-bugfix-2026-07/BUGFIX_PLAN.md`：完整問題清單（位置、影響、修復方案、驗收條件）與四階段修復計畫、分工建議、風險注意
  - 本檔「待處理問題」新增 H1/H2、M1~M8、L1~L9 條目
- 待製作人決策：M2（弒神完成或移除）、M3（藥水 +2.0 或 x2.0）、L2（天譴是否含 rarity 5 牌型）
- 注意（給韻西）：四語系 key 與 data.js 全部 id 已驗證對齊、`.promo-card.hidden` 修正已在本機、平台層與 Electron IPC 白名單皆乾淨，免重工；修復動到 UI/邏輯後必跑 `npm.cmd run steam:package:verify` 才會反映到製作人玩的 exe
更新者：阿扣（Claude Code）

### 2026-07-05 鑀韻西 × 阿扣：完成 Firebase Email／密碼 Authentication 基礎
- **共同方案 C**：雙方先完成獨立檢查、異議交換與責任表；將任務分成「本機安全修正」與「Auth-only 遠端部署」兩階段，製作人核准後才開始修改，Phase 1 未經阿扣通過前不得部署。
- **客戶端安全修正**：驗證信、重寄驗證信與密碼重設信會依 App 語言設定 Firebase `auth.languageCode`；App 內刪除帳號改用登入後才顯示的專用密碼欄，順序固定為重新驗證、刪除 Firestore 使用者文件、刪除 Auth 使用者。訪客不再看到刪除入口，登出會清空刪除密碼。
- **Auth-as-code**：`firebase.json` 使用官方 Boolean schema，只宣告 `auth.providers.emailPassword: true`；以 Firebase CLI 15.22.4 執行 `--only auth`，新專案 `bibi-dice-mobile-leijoa` 已成功啟用 Email／密碼，未部署 Firestore 或 Hosting。
- **Console 權威狀態**：Email／密碼開啟、Email Link 關閉；帳號建立、帳號刪除與 Email 枚舉防護皆開啟；預設驗證信與密碼重設信範本存在；授權網域只有兩個 Firebase 預設網域，沒有 `localhost`；使用者清單維持 0。
- **驗證**：四語 706 keys 完全對齊、手機建置 6 項、手機測試 12/12、帳號刪除頁建置、語法與任務檔案 diff 檢查通過；320／390／430px 無頁面水平溢位，320px 實際畫面確認訪客狀態正確。
- **阿扣交叉驗收**：Phase 1 與 Phase 2 均使用 US$5 上限執行唯讀驗收；兩階段皆獨立重跑必要測試並明確回覆「交叉驗收通過」。
- **安全停點與下一步**：`mobile.config.local.json` 仍為 `enabled:false`，RevenueCat Key、帳號刪除網址仍空白，AdMob 維持測試模式。下一個獨立任務應共同規劃帳號刪除 Hosting 或其餘手機後台，完成必要服務前不得啟用正式雲端客戶端。

### 2026-07-04 鑀韻西 × 阿扣：完成台灣區 Firestore 基礎與新專案修復
- **共同規劃**：韻西與阿扣先對 region、Rules 型別防線與責任表取得方案 C 共識；首次 Rules dry-run 意外在舊專案建立不可改位置的 `nam5` 資料庫後，雙方重新比較接受美國區、刪除重建、新專案與 named database，明確同意方案 R，並取得製作人二次核准。
- **新 Firebase 專案**：建立 `bibi-dice-mobile-leijoa`（Display Name `BIBI DICE Mobile`，Spark／Analytics 停用），先單獨啟用 Firestore API 並確認資料庫清單為空，再用完整參數建立 `(default)`。
- **Firestore 狀態**：新資料庫位於 `asia-east1`，使用 `FIRESTORE_NATIVE`／`STANDARD`，free tier 啟用、刪除保護啟用、PITR 停用；Rules 已完成語法 dry-run 與正式部署。
- **Rules 補強**：`energySpendsByOrigin` 存在時必須是 map；`freeMythicVesselLevels` 存在時必須是 0～4 整數。Authentication 尚未啟用時，`owns(uid)` 讓所有第三方請求維持 fail-closed。
- **新 Web App 與本機設定**：建立 App ID `1:406034512445:web:ea8a80105dc7b5cbf58854`；`.firebaserc` 與被 Git 忽略的 `mobile.config.local.json` 已切到新專案，四欄與遠端 SDK config 一致，`enabled:false`、AdMob 測試模式、RevenueCat 空 Key 與帳號刪除網址空白均未改變。
- **舊專案保留**：`bibi-dice-leijoa` 與其中的 `nam5` 空資料庫完整保留，不部署 Rules、不啟用 Auth、不供 App 使用；資料庫 `createTime`／`updateTime` 均維持 `2026-07-04T10:24:38.310981Z`。前一條 Firebase Web App 紀錄保留為歷史，但已由新專案設定取代。
- **驗證**：新舊專案與新 Web App 均為 ACTIVE；新資料庫全部欄位符合核准值；匿名讀取 `users/test` 回 HTTP 403；`mobile:verify` 6 項與 `test:mobile` 12 項通過；本機設定仍被 Git 忽略且沒有 stage、commit 或 push。
- **阿扣交叉驗收**：第一次因 Claude shell 沙盒拒絕唯讀命令而退回；補齊方案 R 任務單並使用核准的唯讀權限模式後，阿扣獨立重跑 9 類驗收並明確回覆「交叉驗收通過」。
- **範圍與下一步**：未修改遊戲碼、四語系、Android／iOS、Hosting、Authentication、AdMob、RevenueCat 或 Steam；下一個獨立任務才共同規劃 Email／密碼 Authentication、枚舉防護與帳號刪除流程，手機雲端功能在此之前不得切成 `true`。

### 2026-07-04 鑀韻西 × 阿扣：首波 Threads 繁中貼文已公開
- **發布完成**：製作人自行在 Threads 帳號 `@leijoalan` 發布繁中正式上市短片，公開網址為 `https://www.threads.com/@leijoalan/post/DaXgWWhDLQZ`，發布時間約為 2026-07-04 18:17（Asia/Taipei）。
- **公開驗證**：未登入狀態可開啟貼文；主文正確顯示 `172,800,000` 傷害、鎖定／重擲／牌型／遺物玩法、正式上市與首發九折，影片附件與 Steam 商店預覽皆存在。
- **連結限制**：公開頁的 Threads 轉址只保留正式版 Steam 商店基礎網址，原文規劃的 `utm_source=threads` 等查詢參數已被平台移除；本次不誤記為可追蹤 UTM 導流。
- **首波狀態**：Threads 繁中與 YouTube Shorts 英文均已公開；接下來在各自發布後 24／72 小時回填觀看、互動與 Steam 成效，再決定第二、三波節奏。
- **共同規劃與驗收**：韻西與阿扣先核對既有繁中 MP4、文案、傷害數字、折扣期限與發布範圍，明確同意由製作人／韻西負責瀏覽器、阿扣負責文件交叉驗收；發布後阿扣唯讀核對三份紀錄並回覆「交叉驗收通過」，未發現矛盾或需立即修正事項。
- **範圍控制**：未修改遊戲程式、手機後台、Steam Build、四語影片成品或其他平台內容。

### 2026-07-04 鑀韻西 × 阿扣：完成 Firebase Web App 與本機停用接線
- **新流程執行**：韻西與阿扣先各自讀取需求與現況、提出方案、交換 `enabled` 與 Git ignore 驗收異議，最後明確同意共同計畫與責任表；製作人核准後才開始實作。
- **任務單**：新增 `docs/ai-collaboration/tasks/mobile-firebase-foundation/TASK_BRIEF.md`，記錄本輪目標、禁止範圍、驗收條件、已知限制與責任表；未重複建立 PROJECT_CORE、DEV_LOG 或獨立驗收表。
- **Firebase Web App**：在 `bibi-dice-leijoa` 建立唯一的 Web App `BIBI DICE Mobile`，App ID 為 `1:483341544303:web:f96579ff2797e42030d69a`，遠端狀態為 `ACTIVE`。
- **本機設定**：新增 `.firebaserc`，default 指向 `bibi-dice-leijoa`；建立被 Git 忽略的 `mobile.config.local.json`，Firebase `apiKey`、`authDomain`、`projectId`、`appId` 均由 `apps:sdkconfig` 取得並核對一致。
- **安全停用**：本機設定維持 `enabled: false`，AdMob 維持測試模式與官方測試 ID，RevenueCat Key 與帳號刪除網址保持空白。尚未完成 Auth／Firestore／Rules／Hosting 前，手機與 Steam 正式建置都不啟用雲端功能。
- **韻西驗證**：`apps:list`、`apps:sdkconfig`、`git check-ignore`、ignored status、一般 git status、`npm.cmd run mobile:verify` 與管理端私鑰掃描全部通過；建置輸出含正確 projectId／appId 且 `enabled=false`。
- **阿扣交叉驗收**：阿扣唯讀重跑全部 7 項驗收並明確回覆「交叉驗收通過」；確認沒有超出共同計畫，也沒有建立 Firestore／Auth 或部署 Rules／Hosting。
- **範圍控制**：未修改遊戲程式、四語系、Android／iOS 原生專案、Firestore Rules、Hosting、AdMob、RevenueCat 或任何 Steam 檔案；未執行 Git stage、commit 或 push。
- **下一步**：另立共同規劃任務後，才決定 Firestore 地區與 Authentication／Rules／Hosting 的建立順序；不得直接把 `enabled` 切成 `true`。

### 2026-07-04 鑀韻西：手機版後台設定暫停，等待新版工作流程
- **暫停狀態**：製作人要求立即停止手機版後台設定，先更新工作流程；在新版流程確認前，不得繼續建立 Web App、Firestore、Authentication、AdMob、RevenueCat、Google Play 資源，也不得部署 Rules 或 Hosting。
- **Firebase 已完成**：Firebase CLI 已完成 Google OAuth 登入；Google Cloud／Firebase 專案 `BIBI DICE` 已建立，Project ID 為 `bibi-dice-leijoa`，使用 Spark 免費方案，Google Analytics 依首發規則保持停用。
- **建立過程**：CLI 先成功建立 Google Cloud 專案，但因帳號尚未接受 Firebase 條款，`addFirebase` 回傳 `403 PERMISSION_DENIED`；製作人在 Firebase Console 接受條款後，以既有 Cloud 專案完成加入 Firebase。CLI 已再次確認專案為 `ACTIVE` 且帶有 `firebase: enabled`。
- **明確未完成**：尚未建立 Firebase Web App；尚未建立 Cloud Firestore 或選擇資料位置；尚未啟用 Email／密碼 Authentication；尚未建立 `.firebaserc` 或 `mobile.config.local.json`；尚未部署 `firestore.rules`、帳號刪除 Hosting 或任何正式 App 設定。
- **建議但未執行**：原規劃建議 Firestore 使用 `asia-east1`（台灣），但位置不可變更，因此尚未建立，留待新版工作流程重新確認。
- **阿扣核對**：依專案規範以 US$5 上限完成唯讀盤點，確認 Android 工程已到需要真實後台識別碼的邊界，Firebase 應先於 RevenueCat，AdMob 可平行；本輪未讓阿扣修改檔案。
- **續作入口**：恢復工作前先讀本條紀錄與新版工作流程，再由製作人重新核准外部資源建立順序；不可直接沿用舊流程繼續送出。

### 2026-07-03 韻西：首波英文 YouTube Shorts 已公開
- **發布完成**：英文正式上市短片已於 2026-07-03 晚間公開，標題為 `120,960,000 Damage From 8 Dice?! BIBI DICE Is Out Now 🎲`。
- **公開網址**：`https://youtube.com/shorts/E2X6iPzoN7E`。
- **導流設定**：說明已加入正式版 Steam AppID `4792230` 的英文 Shorts UTM 連結，並將公開正式預告片 `https://youtu.be/U4BvT5RyU5M` 設為 Shorts 相關影片。
- **YouTube 設定**：影片語言為英文、非兒童專屬、AI 寫實內容聲明為否；廣告自評為不含列舉內容，著作權與廣告合適度檢查皆未發現問題。
- **下一步**：完成第一波 Threads 繁中貼文；英文 Shorts 於發布後 24／72 小時回填觀看、留存、互動與 Steam UTM 成效，再安排日文、簡中版本。
- **範圍控制**：本輪未修改遊戲程式、Steam Build 或四語影片成品，只執行英文 Shorts 發布並更新紀錄。

### 2026-07-03 鑀韻西：手機版首發工程基線與 Android 模擬器驗收完成
- **程式狀態**：Capacitor 8、Android／iOS 專案、手機 Web 建置、原生檔案存檔、Firebase Auth／Firestore、AdMob／UMP、RevenueCat、挑戰次數、四語手機 UI、本機通知與生命週期接線均已完成；未修改 `js/engine.js` 或靜態戰鬥數值。
- **App 識別與平台**：主 App ID `com.leijoa.bibidice`；Android API 24～36，iOS 15+／僅 iPhone，兩邊固定直式。若後台占用，需將 Capacitor、Android、Xcode 三處一起切成 `com.leijoalion.bibidice`。
- **資料安全**：手機完整白名單存檔寫入 `profile-v2.json`，採暫存檔、舊檔備份與 rename；Firebase 只合併局外進度。靈魂使用每來源單調帳本，收集冊聯集、奉獻與最高紀錄取高，舊檔遷移與重複同步已有測試。
- **次數與收益**：免費版 5 次、每小時恢復 1；新局最終確認與無限塔確認各扣 1。廣告完成才給獎勵，商店再議規則與每店最多一支刷新廣告已接線；完整版移除廣告與次數限制，RevenueCat 權益為 `premium`。
- **帳號**：訪客可玩；同步或購買才需 Email 帳號，購買前需驗證 Email。已完成 App 內與四語網頁刪除入口、密碼重設與 Firestore Rules；Firebase Console 仍需手動開啟 enumeration protection。
- **Steam／Demo**：Steam 正式版可在存在 `mobile.config.local.json` 時打包 Firebase 局外同步；目前沒有正式設定，因此安全停用。Demo 與一般 Steam 包不含 Android／iOS、帳號刪除頁、Firebase 設定或手機 UI，正式包／EXE smoke 已通過。
- **自動驗證**：`test:mobile` 12 項、四語 704 keys、`mobile:verify`、帳號刪除頁、`cap sync`、320／390／430px 四語瀏覽器回歸、`steam:verify`、`steam:package:verify` 與 `npm audit` 通過。Windows 大視窗 675×1200 實際為 676×1200 的系統四捨五入已納入測試容差。
- **Android 工具鏈**：已安裝 Android Studio 2026.1.1.10、OpenJDK 21.0.11、Android SDK／Build Tools 36、ADB、Emulator 與 API 36 Google APIs x86_64 映像；Windows 使用者環境已寫入 `ANDROID_HOME`、`ANDROID_SDK_ROOT` 與工具路徑。
- **Android 產物**：Debug APK `android/app/build/outputs/apk/debug/app-debug.apk` 與 Debug AAB `android/app/build/outputs/bundle/debug/app-debug.aab` 均建置成功；APK 已安裝到 `BIBI_DICE_API_36` Pixel 6 AVD，套件為 `com.leijoa.bibidice`、minSdk 24、targetSdk 36。
- **Android 實測**：API 36 模擬器通過冷啟動、直式與觸控、開始新局 5/5→4/5、拒絕通知權限後進入戰鬥、背景建立 `profile-v2.json` 與備份、強制終止後顯示續玩且維持 4/5、續玩不扣次，以及戰鬥中返回鍵顯示離開確認。沒有 App 崩潰。
- **仍待後台／實機**：AdMob 測試 App 與 UMP 初始化成功；Firebase Email、正式／獎勵廣告及 RevenueCat Test Store 尚待正式設定。Android 實機仍需驗證 WebView、內購、廣告、背景回收與低記憶體；Windows 仍無法執行 Xcode／TestFlight。
- **建置警告**：AdMob 與 RevenueCat 會讓 Kotlin plugin 重複載入，RevenueCat 的 Amazon Appstore 相依套件在 APK dex 時會出現 stack-map 警告；目前未阻止 APK／AAB 建置及 API 36 啟動，升級外掛時再追蹤。
- **製作人下一步**：建立 Firebase、AdMob、RevenueCat、Apple Developer、Google Play Console；提供正式設定、聯絡 Email、隱私政策網址、1024×1024 App Icon 與啟動畫面；借 Android 實機驗收，之後租 Mac＋Xcode 26 驗證 iPhone／TestFlight。
- **文件入口**：先讀 `docs/mobile/README.md`，再依 `docs/mobile/RELEASE_CHECKLIST.md` 執行；隱私政策草案在 `docs/mobile/PRIVACY_POLICY_DRAFT_ZH_TW.md`。
- **阿扣協作**：OAuth 過期問題已透過重新登入修復，實際模型請求與兩輪 US$5 唯讀審查成功。審查發現的離線廣告獎勵被上限吃掉、跨帳號消耗計數污染已修正並補回歸；client-authoritative 單機進度可由帳號本人竄改的限制已記錄，未來若加入排行榜必須改可信伺服器。

### 2026-07-02 鑀韻西：完成 G8 電玩展報名截圖與表單資料包
- **交付資料夾**：新增 `promo/g8-2026-registration/`，內含四張可直接上傳的 PNG 與 `APPLICATION_INFO.md`。
- **指定檔名**：依主辦方文字原樣保留 `Scrrenshot` 拼字，建立 `Game Scrrenshot_LeijoaLion_2026-07-02_1.png` 至 `_4.png`。
- **截圖內容**：依序選用戰鬥與八顆骰子、牌型倍率、遺物商店、48 億傷害精彩時刻；來源為既有 Steam 商店截圖 `02`、`03`、`05`、`08`，沒有修改或重新壓縮原圖。
- **表單資料**：上市日期填 `2026-06-30`；Demo 為 `https://store.steampowered.com/app/4796530/BIBI_DICE_Demo/`；Steam 正式版為 `https://store.steampowered.com/app/4792230/BIBI_DICE/`。
- **Trailer 核對**：表單畫面中的 `https://youtu.be/nnJj7DlKvxw` 是 G-EIGHT 官方 2024 宣傳片，不是《比比丟八》影片；目前沒有公開的《比比丟八》YouTube Trailer，因此報名資料明確標示該欄留白。
- **驗證**：四張皆為 1920×1080 PNG、單檔低於 2MB，且 SHA-256 與各自來源完全相同。
- **範圍控制**：沒有修改遊戲程式、Steam Build、原始截圖或影片；尚未替製作人送出 G8 表單。

### 2026-07-01 鑀韻西：完成 video-autopilot-kit 正式版設定與四語四平台發布包
- **工具設定**：外部 `video-autopilot-kit` v0.6.0 的 `config.py` 已改指向 `D:\unity\bibi-dice\promo\social\steam-launch-short`；原本的 Demo AppID `4796530`、Demo CTA、18 秒規格與「仍缺乾淨四語素材」皆已更新為正式版 AppID `4792230`、立即遊玩、13 秒四語成品與現有素材狀態。
- **工具定位**：HyperFrames `0.7.17` 仍是四語影片的來源，不把 `video-autopilot-kit` 加入遊戲或影片專案依賴；該工具只供未來 CapCut 輔助、FFmpeg 後製、規劃與交付 QA。
- **新增 profiles**：更新 `brand.md`、`content_pipeline.md`、`your_context.md`，新增 `algorithm.md`、`community.md`；已記錄 Steam 基準、四平台帳號、首波發布測試與 24／72 小時數據觀察方式，未蒐集的 YouTube／社群數字明確保留為未知。
- **四語發布文案**：在 `promo/social/steam-launch-short/` 新增 `POST_COPY_EN.md`、`POST_COPY_JA.md`、`POST_COPY_ZH_CN.md`、`POST_COPY_ZH_TW.md`，每語皆包含 YouTube Shorts、Threads、Instagram Reels、X；CTA 改為正式版已上市與立即遊玩。
- **追蹤連結**：四平台／四語使用獨立 Steam UTM，統一加入 `utm_content=high_damage_v1`；影片中各語傷害數字與文案一致，未沿用舊版 48 億或願望清單文案。
- **發布檢查表**：新增 `PUBLISH_CHECKLIST.md`，包含成品對照、發布波次、平台限制、公開網址紀錄與 24／72 小時成效欄位。第一波建議為 Threads 繁中與 YouTube Shorts 英文。
- **尚未執行**：本輪沒有登入或發布任何社群平台，也沒有修改、重剪或重新輸出四支正式影片。
- **阿扣協作**：依規範以 `--max-budget-usd 5.00` 執行限縮唯讀核對；`auth status` 顯示已登入，但正式呼叫回傳 `401 Invalid authentication credentials`，request ID `req_011CcbGPT8pQhLa87bjkUi5u`，本輪由鑀韻西完成實作與驗證。

### 2026-07-01 韻西：正式上市、熱修、Demo 導購與首日營運狀態已同步
- **正式版目前 Build**：Base Game AppID `4792230`／DepotID `4792231` 的 `default` 與私人 `internal` 皆為 Build `23984755`，描述 `BIBI DICE Launch Hotfix - 2026-06-30`。正式版不再顯示 Demo／itch.io 專用導購卡，Steam 原生安裝、啟動與隱藏狀態皆已驗證。
- **Demo 目前 Build**：Demo AppID `4796530`／DepotID `4796531` 的 `default` 為 Build `23985042`，描述 `BIBI DICE Demo Store CTA - 2026-06-30`。標題與通關導購按鈕會顯示、事件已綁定，並可安全開啟正式版 Steam 商店頁。
- **修正根因**：正式版導購卡雖帶有 `hidden`，但較晚載入的 `.promo-card { display:flex; }` 覆蓋隱藏樣式，造成正式版出現無反應按鈕；已用 `.promo-card.hidden { display:none !important; }` 恢復正確版本行為。
- **正式上市**：Steamworks 顯示遊戲已於 2026-06-30 上午 4:47 開始上架曝光，首發折扣為 10%／7 天；上架曝光回合已啟動，最長持續 30 天。
- **首日銷售**：Steam 財務報表截至 2026-06-30 顯示售出 `4` 份、Steam 毛營收 `US$9`、扣除退款／拒付／稅金後淨額 `US$8`、退款 `0`；四份銷售目前皆來自台灣。
- **願望清單**：累計新增 `42`、刪除 `6`、購買／啟用轉換 `2`，目前尚有 `34`。上市日新增 `11`、刪除 `1`、轉換 `2`，期間淨增 `8`；26 封上市通知帶來 2 次轉換，報表轉換率 `7.7%`，但 Steam 標記樣本仍不足。
- **曝光資料**：商店流量目前只回填到 2026-06-29；6/23～6/29 共 `22,508` 次曝光、`1,210` 次造訪、`868` 次計入曝光點擊的造訪，CTR `3.9%`，其中 `339` 次造訪被標記為機器人流量。上市日完整曝光尚未回填，不可用上市前流量推算首日購買轉換率。
- **外部導流**：6/17～6/30 UTM 共 `73` 次造訪、`40` 次可信造訪、`24` 次可追蹤造訪、`1` 次願望清單轉換，尚無 UTM 歸因購買；報表中的 `ig_text_post_permalink` 是目前最主要可信來源。Steam UTM 購買歸因可能延遲數日。
- **Demo 觸及**：Demo 累計免費授權 `1,062`，但實際累計不重複玩家為 `23`、遊玩時間中位數 `18` 分鐘；2026-06-30 新增 `7` 份免費授權，不能把免費授權總數直接視為實際玩家數。
- **宣傳狀態**：英、日、簡中、繁中四支正式上市短片均已完成且尚未發布；下一步仍是建立四平台／四語貼文、各平台獨立 UTM，並分批發布。
- **文件範圍**：本次只同步交接文件，沒有修改遊戲程式、Steam Build、商店設定或影片成品。

### 2026-07-01 鑀韻西：四平台四語宣傳影片工作已移交至專案內
- **交接位置**：新增 `promo/social/multiplatform-launch-handoff/`，內含總交接、素材索引與四平台發布矩陣。後續新視窗應先讀本檔頂部，再讀該目錄的 `README.md`。
- **平台帳號**：Threads `https://www.threads.com/@leijoalan`，Instagram `https://www.instagram.com/leijoalan/`，YouTube `https://www.youtube.com/@LeijoaLion`，X `https://x.com/Leijoa2588`；台灣地區以 Threads 為主力宣傳平台。
- **既有成品**：確認 `promo/social/steam-launch-short/previews/` 已有英、日、簡中、繁中四支 1080×1920、60fps、約 13.035 秒正式成品，品質與在地化均優於 Codex 文件區的外部暫製原型，不需重新索取玩法錄影、BGM、音效、Logo、角色立繪或四語術語。
- **素材盤點**：確認 `promo/steam/trailer/raw-captures/` 有 23 支四語 1920×1080、60fps 實機錄影，合計約 350.28 秒；專案另有完整 BGM／SFX、透明 Logo、兩張透明角色立繪與四語 locale。
- **下一步**：在 `promo/social/steam-launch-short/` 新增四語發布文案，每語包含 YouTube Shorts、Threads、Instagram Reels、X；將舊版願望清單 CTA 更新為正式版已上市的立即遊玩 CTA，並建立分平台／語系 UTM。既有影片、遊戲程式與 Steam Build 不需修改。
- **外部原型**：先前 Codex 文件區的 18 秒直式／橫式 HyperFrames 原型保留於原位置供研究，因素材與成品重複且畫面仍混有繁中 UI，未複製進正式專案。
- **阿扣協作**：`claude.exe auth status` 顯示已登入，但正式唯讀素材核對回傳 `401 Invalid authentication credentials`，request ID `req_011CcbD8fxEQomf6xaWYw7f7`；本輪未以其他子代理替代。

### 2026-06-30 鑀韻西：Launch Update Build 23984133 已發布至 Steam default（歷史紀錄，已由 23984755 取代）
- **狀態**：完成；Build `23984133` 曾發布至 `default` 與私人 `internal`，之後已由修正導購顯示問題的 Build `23984755` 取代。
- **發布內容**：包含目前本機正式版內容，並補上版本識別安全修正：`steam-portrait` 專注直式版面，僅 Demo 另有 `steam-demo-build`；導購只認 `steam-demo-build`／`itch-build`，正式版不會顯示「查看 Steam 正式版」自我導購。
- **建置與驗證**：四語系 674 keys 對齊；Demo Electron 三種視窗與儲存回歸通過；`npm.cmd run steam:package:verify` 通過正式包、Steamworks native、Cloud、成就、版面／版本標記與 EXE smoke；彗星 `x40 / rarity 5`、全異 `x15` 另以引擎直接計算通過。
- **SteamPipe**：帳號 `Leijoa2588` 上傳 Base Game AppID `4792230`／DepotID `4792231` 成功，BuildID `23984133`，Depot manifest `8736795010924365040`，描述 `BIBI DICE Launch Update - 2026-06-30`。
- **internal 驗收**：先發布至 `internal`，Steam 用戶端下載後 manifest 顯示 `buildid = TargetBuildID = 23984133`，遊戲從原生 Steam 啟動成功；Steam 安裝檔與本機正式包逐檔 SHA-256 相符，差異僅為 VDF 排除的 4 個 `.log`。
- **default 發布**：Steamworks 顯示原玩家版本為 Build `23933430`，本次更新到 `23984133` 的下載量約 `274.6 KB`；發布後分支表與歷史紀錄皆確認 `default`／`internal` 同步完成。
- **文件更正**：舊交接文件誤將 `23853875` 視為本次發布前的 default；實際後台權威狀態是 `23933430` 已於 2026-06-26 發布至 default，`23853875` 當時只留在 internal。
- **阿扣協作狀態**：`claude.exe auth status` 顯示已登入，但正式唯讀呼叫回傳 `401 Invalid authentication credentials`，request ID `req_011CcZUkwReHuqbh2oFxF963`；本輪由鑀韻西完成全部發布檢查。

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
| Base Game Build | 23984755（default + internal，已發行） |
| 發行狀態 | 2026-06-30 上午 4:47 已上市；10% 首發折扣／7 天 |
| Demo AppID | 4796530 |
| Demo Build | 23985042（default，已發行） |
| 版本導購 | 正式版隱藏；Demo 顯示且可開啟正式版商店 |
| 四語系 | 674 keys 對齊（2026-06-30 驗證） |
| SteamCMD | D:\tools\steamcmd\steamcmd.exe |
| ContentRoot | D:\unity\bibi-dice\dist\steam-windows |
| 首日銷售 | 4 份；毛營收 US$9、淨額 US$8、退款 0 |
| 願望清單 | 目前 34；上市日新增 11、轉換 2、淨增 8 |
| 上市前一週曝光 | 22,508 次曝光、1,210 次造訪、CTR 3.9%；上市日資料尚未回填 |
| 四語上市短片 | 四支正式成品與四語四平台文案／檢查表已完成；首波英文 YouTube Shorts 與 Threads 繁中已公開 |
| itch.io html Build | 第 14 版；仍同步舊 Demo Build 23496399，尚未跟進 23985042 |

---

### 待處理問題

| 問題 | 狀態 | 說明 |
|---|---|---|
| steam-launch-short 繁簡 gameplay 素材互換 | 待修正 | `promo/social/steam-launch-short/assets/gameplay/zh-tw/02-reroll.mp4` 實為簡體 UI、`zh-cn/02-reroll.mp4` 反為繁體，兩檔疑似互換（2026-07-08 廣告產製時發現）。已發布的四語短片 previews 若曾用錯置素材渲染可能受影響，需抽幀確認；是否重 render 待製作人決定 |
| 19 項 Bug 修復後的 SteamPipe 發布 | 待製作人決策 | Phase 1～4 已全部修復並通過 `steam:package:verify`；尚未 commit / push / 上傳 Steam。建議製作人實機試玩 `dist/steam-windows/BIBI-DICE.exe` 後再排程發布 |
| G8 電玩展報名送件 | 待製作人上傳 | 四張截圖與表單資料已整理於 `promo/g8-2026-registration/`；目前可使用公開 Trailer `https://youtu.be/U4BvT5RyU5M` |
| 四平台四語上市短片發布 | 進行中 | 第一波英文 YouTube Shorts 與 Threads 繁中已完成；待回填 24／72 小時數據後安排第二、三波 |
| 上市日曝光判讀 | 待 Steam 回填 | 商店流量目前只到 2026-06-29；待 6 月 30 日資料可用後再計算上市曝光與購買轉換 |
| itch.io 同步 | 待確認 | 線上第 14 版仍是舊 Demo Build 23496399；尚未同步目前 Demo 23985042 的正式版導購修正 |

### 已處理問題

| 問題 | 完成日期 | 處理方式 |
|---|---|---|
| 【H1】正式版作弊入口未鎖 IS_DEV | 2026-07-06 | 作弊碼監聽、dev API、5 連點入口全收進 IS_DEV 閘門（韻西實作、雙方驗收） |
| 【H2】通關最終 Boss 拿不到靈魂與傳說掉落 | 2026-07-06 | fireAttack 改走 enemyDefeated()，Boss 正常發 2＋契約靈魂與掉落；進無限塔改直接開商店不重複發獎 |
| 【M1】破壞鉗無法還原枯萎/時間壓縮 | 2026-07-06 | cons_pliers 檢查移到枷鎖效果套用之前 |
| 【M2】弒神枷鎖半成品 | 2026-07-06 | 製作人裁定完成上線：改 heavy 型別、buildActiveShackleConfig 傳入完整定義、骰面角標同步停用；引擎實測 240→16 |
| 【M3】區域藥水與敘述不符 | 2026-07-06 | 製作人裁定非空區 ×2.0；空區不再生效（引擎實測通過） |
| 【M4】噪音枷鎖點遺物 TypeError | 2026-07-06 | ui.js 補 `window.showToast = showToast` |
| 【M5】血色聖戰角標錯誤 | 2026-07-06 | 改用 fusion_blood_crusade 正確公式與 getMaxHp；刪除 fusion_titan/fusion_bloody/fusion_peak 死碼 |
| 【M6】舊存檔誤套最高契約 | 2026-07-06 | contractLevel fallback 改 0 |
| 【M7】語言切換回呼呼叫不存在函式 | 2026-07-06 | 改呼叫 UI 模組函式並帶正確參數；阿扣補強收集冊分頁標籤同步刷新 |
| 【M8】菁英怪無掉落時不給靈魂 | 2026-07-06 | else 分支補菁英 1 靈魂（＋契約加成） |
| 【L1】黑洞下牌型高亮錯位 | 2026-07-06 | applyMatch 加 matchVal 換算（8 視為 1）（阿扣） |
| 【L2】天譴不含 rarity 5 牌型 | 2026-07-06 | 製作人裁定含 rarity 5：改 `rarity >= 4` 並改用 getRuleMetaByName 比對（修正「比比丟八(ビビデバ)」精確比對漏判）（阿扣） |
| 【L3】i18n 硬編碼 | 2026-07-06 | 商店買空文案與契約前綴改四語系 key（contract_prefix/contract_prefix_infinite/shop_sold_out）（阿扣） |
| 【L4】平庸之惡洗掉 D 藥水 | 2026-07-06 | 製作人裁定完全封鎖 D 區藥水＝現行行為，不改碼（引擎實測 banality 下 D 藥水維持 ×1） |
| 【L5】重骰動畫前先扣次存檔 | 2026-07-06 | 移除動畫開始前的 saveGame，改由動畫收尾存檔（阿扣） |
| 【L6】損毀存檔黑畫面軟鎖 | 2026-07-06 | loadGame 回傳成功與否；失敗退回標題、清除存檔並顯示 save_corrupted 提示（阿扣） |
| 【L7】i18n 重複 key | 2026-07-06 | 四語 ui 區塊去重，保留原「後者覆蓋」生效值（Node 實測 11 組生效值一致）（阿扣） |
| 【L8】Electron 路徑前綴檢查 | 2026-07-06 | `startsWith(root + path.sep)` 補分隔符（阿扣） |
| 【L9】randomUUID 非安全來源拋錯 | 2026-07-06 | runtime.js 加時間戳亂數 fallback（阿扣） |
| G8 報名截圖與欄位資料未整理 | 2026-07-02 | 建立 G8 報名資料夾、四張指定檔名截圖與 APPLICATION_INFO.md |
| video-autopilot-kit 仍是 Demo／18 秒舊設定 | 2026-07-01 | 更新 config 與五份 profiles，改用正式版 AppID 4792230、13 秒四語成品與立即遊玩 CTA |
| 四語四平台上市文案與 UTM 尚未建立 | 2026-07-01 | 新增四份發布文案與 PUBLISH_CHECKLIST，依平台／語系拆分 UTM |
| 正式版誤顯示 Demo 導購且按鈕無反應 | 2026-06-30 | Build 23984755 修正 `.hidden` 樣式覆蓋並發布至 default／internal |
| Demo 缺少正式版導購 | 2026-06-30 | Build 23985042 加入 `steam-demo-build`、導購事件與驗證，發布至 Demo default |
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
