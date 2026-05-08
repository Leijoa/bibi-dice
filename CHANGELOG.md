
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

# 比比丟八-BIBBIDIBA [2.0版] 更新紀錄

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


### 無盡之塔 PB 追蹤修復與標題畫面音效 [2026/05/08]
* **無盡之塔最高層數 PB 追蹤修復**：修正了 `js/main.js` 中 `recordHistory` 未正確追蹤與儲存玩家在無盡之塔所達到的最高層數。現在會精確計算當前層數，並在超越歷史最高時存入 localStorage 的 `bibbidiba_pb_infinite` 鍵中。
* **歷史牌局介面更新**：更新了 `js/ui.js` 的 `renderHistoryModal`，現在會直接從 localStorage 讀取 `bibbidiba_pb_infinite` 的值，並確保在介面的「最高無限層數」區塊中以「PB: Floor {0}」的格式清楚顯示。
* **標題畫面全域點擊音效**：為 `UI.el.titleScreen` 加上全域 click 事件監聽，當玩家點擊任何按鈕（`e.target.closest('button')`）時，會主動觸發 `Audio.initAudio()`（解鎖 AudioContext）並播放 `Audio.playClickSound()`，強化遊戲初始回饋感。

### 新增
- 實裝「響應式縮放」外觀系統：現在遊戲畫面會自動縮放以適應螢幕大小與 iframe 環境，確保不會有裁切與跑版問題。
