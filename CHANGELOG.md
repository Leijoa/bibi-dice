### UI：牌型表範例骰改「抽象標記」（字母/數字/?）分辨規則 [2026/07/10]
* **需求**：範例骰直接秀具體數字會誤導（讓玩家以為要湊那些數字），小標籤又不夠直覺。改用抽象標記讓骰子本身就表達規則。
* **標記法（對照 `engine.js` 判定）**：相同字母（x/y/z/w）＝相同數字（任意值）；連續字母（a/b/c…）＝連續數字（任意起點）；實際數字＝指定數字；`?`＝任意骰（不影響）。每列補滿 8 顆。
* **`js/ui.js`**：重寫 `RULE_EXAMPLE_DICE` 為 token 陣列；新增 `renderExampleDie`（依 token 上色：金＝指定數字、青＝任意字母/範例、灰＝`?`；`?` 骰半透明）與 `renderRulesLegend`（頂端圖例）。固定牌型的 `?` 數量嚴格對照 engine：二進位 `1 2 4 8`＋4×`?`、質數 `2 3 5 7`＋4、圓周率 `1 1 3 4 6`＋3、斐波那契 `1 1 2 3 5 8`＋2、自然對數 `1 2 2 7 8 8`＋2；絕對二進位/絕對質數/彗星/全異/兩極為整盤 8 顆。絕對秩序、中庸之道為規則型，以青色範例數字呈現（任意）。
* **`js/locales/*.js`**：四語系新增 `ui.legend_same`／`legend_run`／`legend_fixed`／`legend_wild`。
* **`css/style.css`**：`.rule-dice-mini__num--fixed/any/wild` 三色、`.rule-dice-mini--wild` 淡化、`.rules-legend` 圖例樣式。
* **保留**：`hand_tag_fixed`／`hand_tag_any`（指定／任意）小標籤續用為輔助。
* **驗證**：`steam:i18n:verify` 四語 716 keys 對齊（+4）；本機實機 DOM 逐一核對 39 牌型 token 與 engine.js 需求一致、三色分類正確（金/青/灰）、圖例 4 項與 `?` 淡化正確（此牌型表 modal 圖多，預覽截圖工具會 compositor 逾時，改以 DOM 檢查驗證；單顆骰疊字視覺前版已截圖確認）。

### UI：牌型表加「指定數字／任意數字」標籤 [2026/07/09]
* **需求**：牌型表中有些牌型的骰子只是舉例（任意數字），有些卻是必要的特定數字，玩家分不出來。
* **`js/ui.js`**：新增 `FIXED_NUMBER_RULE_IDS`（彗星、兩極、全異、斐波那契、圓周率、自然對數、二進位、絕對二進位、質數、絕對質數＝骰面數字即答案）與 `renderRuleTag()`，於牌型名稱旁加標籤：指定數字（琥珀）/ 任意數字（灰）。其餘牌型（A 區、B 順子、C 區、絕對秩序、中庸之道）為任意數字。
* **`js/locales/*.js`**：四語系新增 `ui.hand_tag_fixed`／`ui.hand_tag_any`（繁：指定數字／任意數字；簡：指定数字／任意数字；英：Fixed／Any；日：指定／任意）。
* **`css/style.css`**：`.rule-tag`／`.rule-tag--fixed`（琥珀）／`.rule-tag--any`（灰）膠囊標籤樣式。
* **驗證**：`steam:i18n:verify` 四語 712 keys 對齊（+2）；531×970 實機——10 個指定牌型標琥珀、其餘標灰，分類正確；英文 Fixed／Any 不破版。

### UI：牌型表範例骰子改空白骰底＋大字數字（提升可讀性）[2026/07/09]
* **需求**：牌型表範例骰子直接用骰面小圖時，骰面數字太小難讀。
* **`js/ui.js`**：`renderRuleExampleDice` 改用空白骰底圖 `dice_0.webp`，再以 `.rule-dice-mini__num` 疊上大字數字（不再依賴骰面圖內建的小數字）。
* **`css/style.css`**：`.rule-dice-mini` 改為相對定位容器（骰底圖 `.rule-dice-mini__img` + 數字 `.rule-dice-mini__num`）；骰子放大為 28px（portrait 32px）、金色數字 `var(--font-number)` 900 粗、18px（portrait 20px）、加深色描邊確保對比。
* **驗證**：本機 531×970 開牌型表——A~D 四區 245 顆範例骰數字皆放大清晰（1~8 正確、分組「＋」完整），最寬列（比比丟八 8 顆）無溢位。

### 修正：設定視窗控制項偶發不能點（toast 蓋住設定視窗）[2026/07/09]
* **根因**：`showToast` 產生的 toast 掛在 `document.body`，而各 modal（含設定視窗 z-120）位於有 `transform` 的 `#game-container` 內——transform 會建立獨立 stacking context，使設定視窗的 z-120 被「困」在 game-container 中；在 body 的 stacking context 裡，正值 z-index 的 toast（z-100）反而疊在整個 game-container（含設定視窗）之上。因此只要開設定視窗時剛好有 toast 還在（如剛戰鬥後的提示），toast 就會蓋住並攔截下方設定控制項的點擊，呈現「偶發、只有設定視窗不能點」。
* **`js/ui.js`**：`showToast` 產生的 toast 本體改 `pointer-events: none`（純通知不需接收點擊），可關閉 toast 的 × 按鈕另設 `pointer-events: auto`。toast 從此不再攔截任何下層控制項點擊，× 仍可點。
* **驗證**：本機實機——開設定視窗後產生 toast，`elementFromPoint` 於 toast 中心回傳的是設定視窗內容（非 toast），確認點擊已可穿透至設定控制項；可關閉 toast 的 × 仍在最上層可點。

### 修正：牌型說明浮條改盤面底部＋動態平衡提示不擋骰＋ABCD 角標移左下 [2026/07/09]
* **根因（重要）**：`css/style.css` 的 `#board-panel > *`（ID 選擇器，優先序高於 class）強制所有盤面子元素 `position: relative; z-index:1`，使牌型說明浮條的 `position:absolute` 從未生效——浮條其實以相對定位佔據版面流，把骰子往下推擠（製作人回報的「擠壓骰子」真因）。新增 `#board-panel > .hand-hint-banner { position:absolute; z-index:30 }` 以更高優先序覆蓋。
* **`css/style.css`**：`.hand-hint-banner` 由頂部改**盤面底部**（`bottom`），右緣內縮讓開重骰／攻擊控制列（`right:64px`，md `108px`）；說明文字改可換行、移除省略號截斷（修正過長說明被截斷看不懂）；壓縮行高與 padding，使最長說明（絕對質數 2 行）仍落在骰子下方留白不重疊。
* **`index.html` / `js/ui.js`**：新增 `#board-notice-banner` 與 `showBoardNotice()`，於盤面底部同位置短暫顯示遺物觸發提示；牌型浮條與盤面提示互斥不重疊。
* **`js/main.js`**：【動態平衡】遺物提示由畫面中央 `showToast`（會擋住骰子）改為 `UI.showBoardNotice`（盤面底部、不擋骰子）。
* **`css/style.css`**：`.zone-corner-label` 由左上角改**左下角**（`bottom`），修正英文版牌型名較長時與 ABCD 角標重疊。
* **驗證**：`node --check js/ui.js js/main.js` 通過；本機 531×970 實機——量測牌型浮條短說明在骰子下方 12px 空隙、最長說明（絕對質數 2 行 49px）overlap −1px 不壓骰、不蓋控制列；動態平衡提示於底部置中不擋骰；英文版 ABCD 角標（top 832）低於牌型名（底 824）不重疊，四項截圖確認。

### UI：牌型表加入範例小骰子（子牌型分組呈現） [2026/07/09]
* **需求**：牌型表只有文字敘述不夠直觀，製作人要求在說明下方加入該牌型範例小骰子，且要美觀、辨識度高。
* **`js/ui.js`**：`renderRulesDB` 每張 `.rule-card` 於說明下方渲染範例骰子。新增 `RULE_EXAMPLE_DICE`（39 牌型各一例，資料結構為「子牌型分組」二維陣列）與 `renderRuleExampleDice()`：複合牌型（C 區）拆成多組、以「＋」串接，對應說明結構（如南瓜馬車＝五同組＋三同組、經典四對子＝4 組對子、雙四連順＝兩組四連順）；同數／順子／特殊盤面為單組。骰面重用 `getDiceImageUrl`／`getDiceImageFilter`（隨玩家骰子外觀變化）並加輕微 `drop-shadow` 立體感；rule-card 版面改 `items-start` 使 copy 欄堆疊。
* **`css/style.css`**：新增 `.rule-card__dice`（flex 換行、組間距大於骰間距）、`.rule-dice-group`（同組緊鄰）、`.rule-dice-plus`（灰色「＋」，portrait 較大）、`.rule-dice-mini`（22px，portrait 26px）。
* **驗證**：`node --check js/ui.js` 通過；`steam:i18n:verify` 四語 710 keys 對齊（未新增 key）；本機 540×960 開牌型表——39 卡共 61 組骰子、22 個「＋」（數量與分組設計完全吻合）、骰圖載入正確；量測南瓜馬車「五同組(x29–151) ＋(x159) 三同組(x177–249)」、經典四對子 4 組 2 顆＋3 個「＋」均勻分隔、比比丟八單組 8 顆無「＋」，排版與說明相符。

### UI：ABCD 四區左上角加牌型分區浮水印標示 [2026/07/09]
* **需求**：玩家搞不懂 ABCD 四個區塊各是什麼，製作人要求在四區左上角加「A/B/C/D」標示，浮水印風格（不明顯也沒關係）、字大一點、字體用遊戲風格。
* **`js/ui.js`**：`renderScore` 四個 `#zone-box-*` 各加一個 `<span class="zone-corner-label" aria-hidden="true">A~D</span>`（純字母、通用不需 i18n）。
* **`css/style.css`**：新增 `.zone-corner-label`——左上角絕對定位、`var(--font-number)`（Bahnschrift，與倍率數字同款顯示字體）、26px（≥768px 為 32px）、`color: currentColor` 繼承該區配色（藍/粉/紫/青，停用時自動變灰）、`opacity 0.32` 浮水印感、`pointer-events:none`。
* **驗證**：`node --check js/ui.js` 通過；本機實機 540×960 造盤截圖——四區左上角顯示 A/B/C/D，字體確認為 Bahnschrift、色彩對應各區、不遮擋牌型名與倍率。

### UI：點 ABCD 區高光骰子時同步顯示牌型說明浮條 [2026/07/09]
* **需求**：製作人回報玩家點 ABCD 區看到骰子高光後，仍搞不懂「為什麼是這幾顆發動」，希望高光同時跳出牌型說明，但不能擋到骰子。
* **`index.html`**：於 `#board-panel` 內新增 `#hand-hint-banner` 浮條元素（預設 `hidden`、`aria-live="polite"`）。
* **`js/ui.js`**：新增 `updateHandHintBanner()`，於 `renderDice` 結尾呼叫。點某區高光時，依 `activeHighlight` 取當前發動牌型，於盤面頂部顯示「牌型名　x倍率　—　說明」；非 `WAIT_ACTION`、無高光、失憶（amnesia）枷鎖時隱藏。牌型查詢重用既有 `RULE_DB`＋`isRuleNameMatch`，文字重用既有 `rules.<id>.name`／`.desc` i18n key，**未新增任何語系 key**。
* **`css/style.css`**：新增 `.hand-hint-banner` 系列樣式——絕對定位於盤面頂部（覆蓋標題列、骰子正上方，不遮擋骰子）、ABCD 四色邊框與牌型名配色、說明過長以單行省略號截斷、跳出微動畫。
* **驗證**：`node --check js/ui.js` 通過；`steam:i18n:verify` 四語 710 keys 完全對齊（key 數不變）；本機 http 伺服器實機驗證——`devSetDice` 造盤後點 A（比比丟八 x100.0 8顆相同數字）、D（全異 x15.0 8顆數字皆不相同）浮條正確顯示且色彩對應，量測浮條底邊不與骰子重疊；再次點同區/重骰/自動 5 秒皆正確隱藏；540×960 視窗說明無溢位。
* **注意**：本次未打包，未反映到 `dist/steam-windows` exe；製作人確認後需跑 `steam:package:verify`。

### 素材：全套圖片＋影片廣告產製與審查 [2026/07/08]
* **`promo/ads/approved/`**：新增 9 件通過審查的廣告成品——圖片 6 張（直式 1080×1920／方形 1080×1080／橫式 1200×628，各繁中＋英文版）與影片 3 支（繁中直式 12s、繁中方形 10s、英文橫式 15s，各附 contact sheet）。素材源自 Steam 商店截圖、四語實機錄影、透明 Logo 與角色立繪；文案沿用官方 frame.md 節奏與 POST_COPY。
* **`promo/ads/src/`**：保留可重跑的產製原始檔（圖片 HTML 模板＋Playwright 腳本、三個 HyperFrames 0.7.17 影片專案）。
* **`promo/ads/REVIEW.md`**：審查紀錄——兩支影片初版誤植「ROGUELIKE」已修正為 ROGUELITE 重 render；並記錄上游 steam-launch-short 繁簡 gameplay 素材互換問題（詳見 SYNC.md 待處理問題）。
* **驗證**：6 張 PNG 逐張像素尺寸與目視檢查；3 支 MP4 經 ffprobe 規格驗證（H.264／30fps／AAC）與抽幀逐格審查；HyperFrames lint／validate 通過。

### 工具：擬人模擬遊玩系統 Phase 2~4（五人格／生涯模擬／儀表板／A/B） [2026/07/08]
* **`sim/personas/novice.mjs` / `veteran.mjs` / `gambler.mjs`**：補滿五人格（新手高失誤且相信假數字、老手低取樣心算、賭徒追大牌偏誤）；`heuristics.mjs` 加共用失誤模型。
* **`sim/core/career.mjs`**：生涯模擬——局間靈魂升級購買（各人格優先序）、契約自適應、無限塔；`run.mjs` 重構出可跨局共用狀態的 `simulateRunWithState`。
* **`sim/report/dashboard.mjs`**：批量模式自動產出單檔離線 `dashboard.html`（通過率折線、遺物榜、枷鎖難度、靈魂節奏）。
* **`sim/compare.mjs`**：A/B 數值對比工具，比較兩份 snapshot.json 的顯著變動。
* **`package.json`**：新增 `sim:career`、`sim:compare` 指令。
* **驗證**：`sim:verify` 10 項全過（決定性涵蓋五人格）；5000 局批量 66 秒；compare 實測正確。
* **平衡信號**：賭徒人格（All-in 追同數大牌）零升級通關率 44.8%，高於一步期望值理論派 31.8%——現行數值高度獎勵梭哈路線；【假象】枷鎖對新手 -47.2% 通過率、對理論派無感，資訊型枷鎖難度與玩家水準強相關。
* **生涯節奏（8 條生涯 × 上限 120 局）**：全解鎖局外升級中位數——賭徒 85 局／理論派 101／老手 106；新手與休閒 120 局內無法全解鎖。無限塔最深：理論派 32 層、老手 31、休閒 22。

### 工具：擬人模擬遊玩系統 Phase 1（sim/ 無頭模擬器＋平衡報表） [2026/07/08]
* **`sim/core/`**：新增無頭模擬核心。adapter.mjs 直接 import 真引擎與 data.js（計分零複製）；battle.mjs / shop.mjs / run.mjs 從 main.js 忠實移植回合、重骰、鎖定限制、全部枷鎖結算、商店三選一、融合、掉落與靈魂公式（逐段註記來源行號）。
* **`sim/personas/`**：休閒（heuristic＋10% 手滑）與理論派（候選鎖法＋引擎取樣期望值）兩人格；人格僅能讀取「畫面可見資訊」，資訊干擾型枷鎖會真實影響決策品質。
* **`sim/report/` / `sim/cli.mjs`**：輸出五份 UTF-8 BOM CSV：難度曲線與死亡熱點、遺物強度榜、枷鎖難度實測、靈魂節奏、每局摘要；終端印死亡熱點與枷鎖難度摘要。
* **`sim/verify.mjs`**：保真測試——alldamege.csv 全部 6435 組合 vs 引擎零誤差、同 seed 決定性、枷鎖結算劇本（鐵壁／絕對屏障／同歸於盡）。
* **`package.json`**：新增 `sim`、`sim:verify` 指令。**`.gitignore`**：新增 `sim/output/`。
* **驗證**：`sim:verify` 7 項全過；2000 局批量（2 人格 × 2 局外帳號 × 500 局，seed 42）48 秒完成。首批發現：零升級死亡熱點集中 6~10 關、【同歸於盡】對休閒玩家 -48.8% 通過率、神話遺物【微縮星雲】【六道輪迴】勝率增益為負。
* **範圍控制**：未修改任何遊戲程式與四語系；模擬工具不影響 Steam 打包。

### 工具：製作人專用作弊測試模式（--bibi-dev） [2026/07/06]
* **`steam-app/main.js`**：新增 `DEV_CHEAT_MODE`（`--bibi-dev` 參數或 `BIBI_DICE_DEV=1`），成立時遊戲 URL 附加 `bibiDev=1`；Steam 正常啟動不受影響。
* **`js/main.js` / `js/ui.js`**：IS_DEV 增加「bibi: 協定且 `bibiDev=1`」判斷，網頁版帶參數無效。
* **`package.json`**：新增 `steam:app:devcheat` 指令。
* **桌面捷徑**：建立「BIBI DICE 作弊測試模式.lnk」指向 dist exe 帶參數，點兩下即開作弊模式（捷徑不入 repo）。
* **驗證**：語法檢查與 `steam:package:verify` 19 項 check 通過，打包後 exe 已含閘門。

### 修正：19 項 Bug 修復 Phase 3 驗收與 Phase 4 低嚴重度收尾 [2026/07/06]
* **Phase 3 交叉驗收通過（阿扣）**：弒神枷鎖（M2）引擎實測 240→16、噪音提示（M4）、語言切換回呼（M7）皆確認；同時抽查 Phase 1/2 修復與計畫一致。
* **`js/main.js`**：黑洞下牌型高亮以換算值配對（L1）；天譴改 `rarity >= 4` 並改用 getRuleMetaByName 修「比比丟八(ビビデバ)」漏判（L2）；契約敵名前綴改 i18n key（L3）；移除重骰動畫前的半套存檔（L5）；損毀存檔改退回標題並提示，不再軟鎖（L6）；語言切換時收集冊分頁標籤同步刷新（M7 補強）。
* **`js/ui.js`**：商店買空文案改 `messages.shop_sold_out`（L3）。
* **`js/i18n.js`**：四語 ui 區塊重複 key 去重，保留原生效值（L7）。
* **`js/locales/en.js` / `ja.js` / `zh-cn.js` / `zh-tw.js`**：新增 `contract_prefix`、`contract_prefix_infinite`、`shop_sold_out`、`save_corrupted` 四組 key。
* **`steam-app/main.js`**：`bibi://` 路徑檢查補路徑分隔符前綴（L8）。
* **`js/platform/runtime.js`**：`crypto.randomUUID` 非安全來源 fallback（L9）。
* **L4**：依製作人裁定採現狀（平庸之惡完全封鎖 D 區藥水），不改碼。
* **驗證**：全部修改檔 `node --check`；`steam:i18n:verify` 四語 710 keys 對齊；i18n 生效值 Node 實測 11 組一致；引擎功能測試（弒神／區域藥水／banality）通過；`steam:package:verify` 17 項 check ＋ EXE smoke 完整通過（最終修正後重跑）。

### 文件：遊戲程式碼全面查核與修復計畫書 [2026/07/06]
* **`docs/ai-collaboration/tasks/game-bugfix-2026-07/BUGFIX_PLAN.md`**：新增。阿扣全面細讀 `js/`、`steam-app/`、`index.html` 後整理出 19 項問題（高 2／中 8／低 9），含位置、影響、修復方案、驗收條件與四階段修復計畫；重點為 H1 正式版作弊入口未鎖 IS_DEV、H2 通關最終 Boss 拿不到靈魂與傳說掉落。
* **`SYNC.md`**：待處理問題新增 H1/H2、M1~M8、L1~L9 條目，頂部新增查核工作紀錄。
* **範圍控制**：本輪**未修改任何遊戲程式**；待製作人核准 M2／M3／L2 決策後，由阿扣 × 韻西依計畫書分階段修復。
* **驗證**：四語系 key 與 data.js 全部 id 以 Node 腳本比對通過；window 全域函式與遺物 id 引用以 grep 交叉驗證。

### 手機版：完成 Firebase Email／密碼 Authentication 基礎 [2026/07/05]
* **共同方案 C**：韻西與阿扣先完成雙方提案、異議交換與責任表，採本機安全修正通過後才進行 Auth-only 部署的兩階段硬閘門；製作人核准後執行。
* **帳號安全**：App 內刪除帳號新增登入後才顯示的專用密碼欄，先以 Firebase Credential 重新驗證，再刪除 Firestore 使用者文件與 Auth 使用者；訪客不顯示刪除入口，登出會清空欄位。
* **四語 Email**：註冊驗證信、重寄驗證信與忘記密碼三個入口會在寄信前依目前 App 語言設定 `en`、`ja`、`zh-TW` 或 `zh-CN`。
* **Firebase Auth**：`firebase.json` 新增唯一的 `auth.providers.emailPassword: true`，並以 `--only auth` 部署至 `bibi-dice-mobile-leijoa`；Email／密碼已啟用，Email Link 與其他 provider 保持關閉。
* **安全設定**：帳號建立、帳號刪除與 Email 枚舉防護皆為開啟；預設驗證／重設信範本存在；授權網域只有兩個 Firebase 預設網域，沒有新增 `localhost`；使用者清單維持 0。
* **驗證**：四語 706 keys、手機建置 6 項、手機測試 12/12、帳號刪除頁、語法與 320／390／430px 預覽全部通過；阿扣 Phase 1／Phase 2 唯讀交叉驗收皆明確通過。
* **範圍控制**：`mobile.config.local.json` 維持 `enabled:false`；未部署 Firestore／Hosting、未建立測試帳號、未修改 `engine.js`／`data.js`、未新增依賴，也未執行 Git stage、commit 或 push。

### 手機版：完成台灣區 Firestore 基礎與新 Firebase 專案修復 [2026/07/04]
* **事故與修復決策**：首次 Rules dry-run 意外在 `bibi-dice-leijoa` 建立不可改位置的 `nam5` 資料庫；韻西與阿扣重新共同規劃並經製作人二次核准，採方案 R 建立新專案 `bibi-dice-mobile-leijoa`，舊專案完整保留、不供 App 使用。
* **Firestore**：新 `(default)` 明確建立於 `asia-east1`，使用 Native／Standard、free tier、刪除保護啟用、PITR 停用；Rules 已完成 dry-run 與正式部署。
* **Rules 安全補強**：`energySpendsByOrigin` 新增 map 型別防線；`freeMythicVesselLevels` 新增可選的 0～4 整數驗證。Auth 未啟用期間所有第三方存取維持 fail-closed。
* **新 Web App**：建立 `BIBI DICE Mobile`，App ID `1:406034512445:web:ea8a80105dc7b5cbf58854`；`.firebaserc` 與被忽略的本機 SDK 四欄已切到新專案，`enabled:false`、AdMob 測試模式與 RevenueCat 空 Key 不變。
* **驗證**：新舊專案與 Web App 為 ACTIVE；新資料庫設定符合核准值；舊 `nam5` 資料庫時間戳未變；匿名讀取回 HTTP 403；`mobile:verify` 6 項、`test:mobile` 12 項全部通過。
* **阿扣交叉驗收**：第一次受 shell 沙盒阻擋而退回；改用限縮唯讀權限後獨立重跑 9 類驗收，最終明確回覆「交叉驗收通過」。
* **範圍控制**：未啟用 Authentication、未部署 Hosting、未修改遊戲碼／四語系／原生專案／Steam，也未執行 Git stage、commit 或 push。

### 宣傳：Threads 繁中首波貼文正式發布 [2026/07/04]
* **繁中 Threads**：製作人於 `@leijoalan` 公開繁中正式上市短片，網址為 `https://www.threads.com/@leijoalan/post/DaXgWWhDLQZ`。
* **公開驗證**：未登入狀態可查看貼文；`172,800,000` 傷害、玩法摘要、正式上市、首發九折、影片附件與 Steam 商店預覽均存在。
* **追蹤限制**：Threads 公開轉址移除了原訂 Steam UTM 查詢參數，只保留正式版商店基礎網址；發布紀錄已如實標註，不列為可追蹤 UTM。
* **首波完成**：Threads 繁中與 YouTube Shorts 英文皆已公開，後續依發布後 24／72 小時數據安排第二、三波。
* **共同規劃**：韻西與阿扣先完成限縮方案、異議交換與責任表共識；發布後阿扣唯讀交叉驗收三份紀錄並確認通過。本輪未修改遊戲程式、手機後台、Steam Build、文案來源或影片成品。

### 手機版：以新協作流程完成 Firebase Web App 基礎接線 [2026/07/04]
* **共同規劃**：韻西與阿扣依新硬閘門各自提案、交換異議並取得明確共識；修正為 Firebase 真實設定先接線但維持 `enabled:false`，避免後台未完成時提早啟用雲端功能。
* **任務單**：新增 `docs/ai-collaboration/tasks/mobile-firebase-foundation/TASK_BRIEF.md`，集中記錄範圍、禁止事項、驗收條件、已知限制與責任表。
* **Firebase App**：建立 `BIBI DICE Mobile` Web App，App ID 為 `1:483341544303:web:f96579ff2797e42030d69a`；新增 `.firebaserc` 指向 `bibi-dice-leijoa`。
* **本機設定**：建立被 Git 忽略的 `mobile.config.local.json`，填入由 Firebase CLI 取得的 Web SDK 四欄；維持 `enabled:false`、AdMob 測試模式、RevenueCat 空 Key 與空白帳號刪除網址。
* **驗證**：Firebase App／SDK config、Git ignore、手機 Web 建置 6 項、輸出識別碼與管理端私鑰掃描均通過；阿扣唯讀重跑 7 項條件後明確回覆交叉驗收通過。
* **範圍控制**：未建立 Firestore、Authentication、Rules、Hosting、AdMob、RevenueCat 或商店資源；未修改遊戲程式、原生專案或 Steam 檔案，也未執行 Git stage、commit 或 push。

### 手機版：建立 Firebase 專案後暫停後台設定 [2026/07/04]
* **Firebase 專案**：建立 `BIBI DICE` Firebase 專案，Project ID 為 `bibi-dice-leijoa`，維持 Spark 免費方案並停用 Google Analytics。
* **權限處理**：首次 CLI 加入 Firebase 因尚未接受條款而回傳 `403 PERMISSION_DENIED`；製作人在 Firebase Console 接受條款後完成加入，CLI 已確認專案為 `ACTIVE`。
* **停點**：未建立 Firebase Web App、Firestore、Authentication、`.firebaserc` 或 `mobile.config.local.json`，也未部署 Rules、Hosting、AdMob、RevenueCat 或商店資源。
* **工作暫停**：依製作人指示停止後續後台設定，等待新版工作流程；恢復前需重新確認外部資源建立與部署順序。
* **阿扣協作**：以 US$5 上限完成唯讀後台前置核對，未修改專案檔案。

### 宣傳：英文 YouTube Shorts 首波正式發布 [2026/07/03]
* **英文 Shorts**：公開 `120,960,000 Damage From 8 Dice?! BIBI DICE Is Out Now 🎲`，網址為 `https://youtube.com/shorts/E2X6iPzoN7E`。
* **Steam 導流**：說明使用正式版 AppID `4792230` 的英文 Shorts UTM，並把公開正式預告片 `https://youtu.be/U4BvT5RyU5M` 設為相關影片。
* **發布檢查**：影片語言、受眾與 AI 聲明已設定；廣告自評、著作權及廣告合適度檢查皆通過。
* **後續觀察**：待 24／72 小時回填影片與 Steam UTM 成效；第一波尚餘 Threads 繁中貼文。
* **範圍控制**：沒有修改遊戲程式、Steam Build 或影片成品。

### 手機版：完成 Capacitor 8 首發工程基線與跨平台服務接線 [2026/07/03]
* **原生專案**：加入 Capacitor 8、Android／iOS 專案與 `dist/mobile-web` 建置；App ID 為 `com.leijoa.bibidice`，Android min 24／target 36、iOS 15+、固定直式且 iOS 僅 iPhone。
* **平台橋接與存檔**：新增 `js/platform/` 最小介面，手機以 `profile-v2.json` 暫存寫入、備份與 rename 取代保存白名單資料；啟動先還原既有 `localStorage`，Steam／Demo 走安全 Web fallback。
* **局外同步**：新增靈魂每來源單調帳本、奉獻等級取高、收集冊聯集及最高紀錄合併；舊檔以可用靈魂加已購奉獻成本遷移，重複同步保持冪等。Steam 正式版只在提供本機 Firebase 設定時加入雲端橋接，Demo 永遠排除。
* **挑戰次數**：手機免費版上限 5 次、每小時恢復 1 次；新局最終確認與無限塔確認才扣除，教學、取消設定與續玩不扣。登入帳號使用 Firestore 交易與每帳號／每裝置消耗計數，離線重複消耗回線後歸零且不產生負數。
* **廣告與永久解鎖**：接入 AdMob 8 非個人化廣告與 UMP；結算頁自適應橫幅、次數歸零與商店刷新使用獎勵廣告，取消／失敗／無填充不發獎。RevenueCat 使用 Firebase UID、產品 `premium_unlock`、權益 `premium`；Email 驗證後才可購買，支援跨 Android／iOS 還原。
* **帳號與刪除**：完成 Firebase Email 註冊／登入／驗證信／忘記密碼／登出、App 內刪除，以及四語 Firebase Hosting 帳號刪除頁；新增 Firestore 欄位與擁有者 Rules。
* **手機 UI／生命週期**：新增四語挑戰次數、帳號、同步、購買與隱私入口；加入安全區、背景存檔、音訊暫停／恢復、Android 返回鍵 Modal 優先與離開確認、挑戰回滿通知。
* **Steam 隔離**：Steam 包版排除 `android/`、`ios/`、手機設定、測試與 Hosting；正式版可選 Firebase 局外同步，Demo 不顯示手機功能。Electron 驗證改為先明確套用 medium，並容許 Windows 9:16 大尺寸的 1px 四捨五入。
* **文件**：新增 `docs/mobile/README.md`、隱私政策草案與上架檢查表，明列 Firebase／AdMob／RevenueCat、正式圖示、Android 工具鏈、Mac／Xcode 與商店封測等外部待辦。
* **驗證**：12 個 Node 手機測試、四語 704 keys、手機 Web 建置、帳號刪除頁、Capacitor Android／iOS sync、320／390／430px 瀏覽器回歸、Steam Demo Electron、正式 Windows 包與 EXE smoke、`npm audit` 全部通過。全域 `git diff --check` 僅命中既有 Steam 素材文件兩行尾端空白。
* **阿扣協作**：先修復 2026-06-28 過期但 `auth status` 誤報正常的 OAuth 憑證；兩輪 US$5 唯讀審查均成功。第二輪指出的離線廣告補能量與跨帳號消耗污染已修正並補測試。
* **Android 工具鏈與模擬器驗收**：安裝 Android Studio 2026.1.1.10、OpenJDK 21.0.11、Android SDK 36 與 API 36 Google APIs 模擬器；Debug APK／AAB 建置成功，APK 已於 Pixel 6 AVD 驗證冷啟動、新局扣次、通知權限拒絕、戰鬥、背景原子保存、強制終止恢復、續玩不扣次及返回鍵離開確認。
* **Android 待辦界線**：AdMob 測試 App 與 UMP 初始化成功；Firebase Email、正式廣告／獎勵廣告及 RevenueCat Test Store 需後台設定後再測。Gradle 的 Kotlin plugin 重複載入與 RevenueCat Amazon SDK dex 警告未阻止建置，保留供外掛升級時追蹤。

### 宣傳：完成 G8 電玩展報名資料包 [2026/07/02]
* **新資料夾**：新增 `promo/g8-2026-registration/`，集中放置 G8 報名用截圖與表單填寫資料。
* **四張截圖**：從現有 Steam 商店實機截圖選用戰鬥開始、牌型倍率、遺物商店與 48 億傷害精彩時刻，依主辦方指定原文命名為 `Game Scrrenshot_LeijoaLion_2026-07-02_1.png` 至 `_4.png`。
* **檔案規格**：四張皆為 1920×1080 PNG、單檔低於 2MB；複製後 SHA-256 與來源一致，沒有重新壓縮或修改原圖。
* **表單資料**：新增 `APPLICATION_INFO.md`，整理上市日期 `2026-06-30`、Steam Demo 與正式版連結，並列出每張上傳圖的來源與內容。
* **Trailer 核對**：確認表單畫面中的 `https://youtu.be/nnJj7DlKvxw` 是 G-EIGHT 官方 2024 宣傳片，不是《比比丟八》作品；目前沒有公開的遊戲 YouTube Trailer，因此欄位標示留白。
* **範圍控制**：沒有修改遊戲程式、Steam Build、原始截圖或影片，也沒有送出 G8 表單。

### 宣傳：完成 video-autopilot-kit 正式版設定與四語四平台發布包 [2026/07/01]
* **工具更新**：外部 `video-autopilot-kit` v0.6.0 的 `config.py` 改指向 `promo/social/steam-launch-short`；`brand.md`、`content_pipeline.md`、`your_context.md` 由 Demo AppID／18 秒舊流程更新為正式版 AppID `4792230`、13 秒四語成品與立即遊玩 CTA。
* **營運 profiles**：新增 `algorithm.md` 與 `community.md`，記錄 Steam 銷售／曝光基準、四平台帳號、首波發布測試及 24／72 小時觀察方式；沒有虛構未蒐集的 YouTube 或社群數字。
* **四語四平台文案**：新增 `promo/social/steam-launch-short/POST_COPY_EN.md`、`POST_COPY_JA.md`、`POST_COPY_ZH_CN.md`、`POST_COPY_ZH_TW.md`，每語皆含 YouTube Shorts、Threads、Instagram Reels、X，並改為正式上市／立即遊玩 CTA。
* **UTM 與發布流程**：每個平台／語系使用獨立 Steam UTM，加入 `utm_content=high_damage_v1`；新增 `PUBLISH_CHECKLIST.md`，記錄成品對照、發布波次、平台限制、公開網址與 24／72 小時成效。
* **首波建議**：先發布 Threads 繁中與 YouTube Shorts 英文，再依平台留存、Steam 可信造訪、願望清單與購買歸因安排後續語系。
* **阿扣協作**：依規範以 `--max-budget-usd 5.00` 執行限縮唯讀核對；登入狀態正常但正式呼叫回傳 `401 Invalid authentication credentials`（request ID `req_011CcbGPT8pQhLa87bjkUi5u`），本輪由鑀韻西完成設定、文案與驗證。
* **範圍控制**：沒有修改遊戲原始碼、Steam Build、商店設定或四支影片；尚未登入或發布任何社群平台。

### 文件：同步 Steam 正式上市、熱修與首日營運狀態 [2026/07/01]
* **Build 真實狀態**：`SYNC.md` 與 `promo/steam/README.md` 更新為正式版 Build `23984755`（default + internal）及 Demo Build `23985042`（default），並將 Build `23984133` 標記為已被熱修取代的歷史版本。
* **版本導購**：記錄正式版導購卡隱藏、Demo 導購顯示且可開啟正式版商店，以及 `.promo-card.hidden` 被後載入樣式覆蓋的修正根因。
* **上市營運摘要**：補記 2026-06-30 的 4 份銷售、US$9 毛營收、US$8 淨額、0 退款、34 筆未完成願望清單，以及上市前一週 22,508 次曝光、1,210 次造訪與 3.9% CTR；明確標示上市日商店流量尚未回填。
* **宣傳與同步待辦**：四語正式上市短片改列為「成品完成、尚未發布」；新增四平台文案／UTM、上市日曝光複查及 itch.io 尚未跟進 Demo Build `23985042` 的待辦。
* **範圍控制**：本次只更新交接與 Steam 主入口文件，沒有修改遊戲程式、Steam Build、商店設定或影片。

### 宣傳：建立四平台四語影片工作交接 [2026/07/01]
* **交接文件**：新增 `promo/social/multiplatform-launch-handoff/README.md`、`SOURCE_INVENTORY.md`、`PUBLISHING_MATRIX.md`，集中記錄 Threads、Instagram、YouTube、X 帳號、四語成品、原始錄影、音訊、品牌素材、UTM 規則與下一步。
* **素材結論**：確認專案內已有四支通過品管的 1080×1920、60fps 四語正式短片、23 支四語實機錄影、BGM／SFX、透明 Logo、角色立繪與四語術語，不需製作人重複提供。
* **後續範圍**：下一步只需在 `promo/social/steam-launch-short/` 建立四語四平台上市文案與發布清單；不修改既有影片、遊戲原始碼或 Steam Build。
* **阿扣協作**：正式唯讀素材核對回傳 `401 Invalid authentication credentials`（request ID `req_011CcbD8fxEQomf6xaWYw7f7`），本輪由鑀韻西完成交接整理。

### Steam：Launch Update Build 23984133 已發布給玩家 [2026/06/30]
* **發布安全修正**：正式版與 Demo 原先共用 `steam-portrait` 版面 class，導購邏輯會把正式版誤判成 Demo；新增僅 Demo 使用的 `steam-demo-build` 標記，`js/ui.js` 改以 `steam-demo-build`／`itch-build` 判斷導購，正式版不再顯示連回自身的導購卡。
* **驗證防線**：`scripts/verify-steam-windows-build.js` 新增版面與版本標記檢查，正式包必須保留 `steam-portrait` 並排除 `steam-demo-build`；Demo Electron 回歸、四語 674 keys、正式 Windows 包、Steamworks native／Cloud／成就橋接及 EXE smoke 全部通過。
* **SteamPipe**：Base Game AppID `4792230`／DepotID `4792231` 上傳成功，建立 BuildID `23984133`，描述為 `BIBI DICE Launch Update - 2026-06-30`；VDF `SetLive` 維持空白，未在上傳時自動公開。
* **internal 驗收**：Build `23984133` 先發布至私人 `internal`；Steam 用戶端實際下載並啟動成功，本機 manifest 確認 `buildid`／`TargetBuildID` 皆為 `23984133`。Steam 安裝檔與本機正式包逐檔 SHA-256 相符，僅 4 個 VDF 明確排除的 `.log` 未上傳。
* **default 發布**：internal 驗收通過後，Build `23984133` 已發布至 `default`；Steamworks 分支表與歷史紀錄確認 `default`、`internal` 皆指向同一 Build。相較原玩家 Build `23933430`，公開更新下載量約 `274.6 KB`。
* **文件更正**：先前文件仍記錄 `default = 23853875`，但 Steamworks 顯示玩家在本次更新前實際已使用 2026-06-26 的 Build `23933430`；本次已按後台權威狀態修正。
* **阿扣協作**：依規範使用 `--max-budget-usd 5.00` 嘗試正式唯讀發布核對，但 API 回傳 `401 Invalid authentication credentials`（request ID `req_011CcZUkwReHuqbh2oFxF963`），本輪由鑀韻西完成驗證與發布。

### 宣傳：完成 Steam 正式版四語快速節奏 Shorts [2026/06/30]
* **四語正式版**：完成英文、日文、簡中、繁中四支約 13 秒直式影片，全部改用各語系實機錄影；節奏統一為「第一秒破億傷害 → 鎖定／重擲 → 牌型效果 → 遺物構築 → 破億結算 → Steam 立即遊玩」。
* **在地化合成**：`promo/social/steam-launch-short/index.html` 新增四語文案與語系切換；`assets/gameplay/{locale}/` 各保留 6 段 1080×1920、60fps 遊戲素材，`scripts/prepare-active-locale.cjs` 負責切換目前輸出語系。
* **正式輸出**：新增 `previews/bibi_dice_steam_launch_en_1080x1920.mp4`（17,014,686 bytes）、`bibi_dice_steam_launch_ja_1080x1920.mp4`（16,097,200 bytes）、`bibi_dice_steam_launch_zh-cn_1080x1920.mp4`（15,169,875 bytes）、`bibi_dice_steam_launch_zh-tw_1080x1920.mp4`（16,418,816 bytes）。
* **輸出規格**：四支皆為 H.264、1080×1920、60fps、AAC 48kHz 雙聲道，長度 `13.034667` 秒；片尾分別使用 `PLAY NOW`、`今すぐプレイ`、`立即游玩`、`立即遊玩`。
* **片尾修正**：日文與簡中來源原本會在 CTA 後段閃白或露出主選單，已改為先保留標題粒子動態，再定格於完整主視覺；四語最終接觸表均確認 CTA 全程清楚且無轉場穿幫。
* **驗證**：HyperFrames lint 0 error／0 warning、validate 無 console error、inspect 0 layout issue；四支正式 MP4 均通過 FFmpeg 全片解碼，並以 `ffprobe` 確認影像與音訊規格。
* **範圍控制**：未修改遊戲原始碼、Steam／itch.io Build、商店頁或 YouTube；尚未上傳或發布影片。

### 修正：英文版枷鎖 badge 文字超出紅框 [2026/07/03]
* **`js/ui.js`**：枷鎖 badge 改為外層 `overflow-visible inline-flex`（供 NEW 角標顯示）+ 內層子 span `max-w-[100px] md:max-w-none truncate`（文字正確截斷）。行動版字級由 `text-[12px]` 改為 `text-[10px]`，覆蓋所有英文枷鎖名稱而不超框。

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
