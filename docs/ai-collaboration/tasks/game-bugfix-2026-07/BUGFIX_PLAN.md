# 遊戲程式碼全面查核：問題清單與修復計畫書

- 建立日期：2026-07-06
- 查核者：阿扣（Claude Code）
- 協作修復：阿扣 × 鑀韻西（依製作人指示共同執行）
- 狀態：**已全部完成（2026-07-06）**——Phase 1/2 由韻西實作、雙方交叉驗收；Phase 3 由韻西實作、阿扣交叉驗收通過；Phase 4 由阿扣獨立實作（韻西額度用盡，製作人核准單人作業）。全部通過 `steam:package:verify`。製作人決策：M2 完成上線、M3 非空區 ×2.0、L2 含 rarity 5、L4 採現狀。尚未 commit / push / 發布。

## 一、查核範圍與方法

- 全文細讀：`js/engine.js`、`js/data.js`、`js/main.js`、`js/ui.js`、`js/i18n.js`、`js/audio.js`、`js/diceSkin.js`、`js/platform/`（runtime / mobile-entry / energy / progress / monetization / profile-keys）、`steam-app/main.js`、`steam-app/preload.js`、`index.html`
- 交叉驗證：以 grep 確認 window 全域函式是否存在、遺物 id 是否存在於 `RELIC_DB`、以 Node 腳本比對四語系 key 與 `data.js` 全部 id（結果：全部對齊，僅 enemy_lines 陣列長度不同，屬設計內且有 fallback）
- 未執行：實機遊玩測試、Steam build 重打包（修復完成後才需要）

## 二、問題清單

編號規則：H=高、M=中、L=低。修復時請在 commit message 與 SYNC.md 引用編號。

### 高嚴重度

#### H1. 正式版作弊入口全部未鎖 IS_DEV（影響 Steam 成就與靈魂經濟）
- 位置：
  - `js/main.js:3316` — 全域 keydown 監聽作弊碼：`8989889` 秒殺敵人、`ss+8位數字` 自訂骰面，無 IS_DEV 判斷
  - `js/ui.js:2853` — 設定視窗標題連點 5 下開 dev modal，無 IS_DEV 判斷
  - `index.html:472` — dev modal 完整 HTML（秒殺、一鍵全遺物、自訂骰面、套用/移除枷鎖、扣血、改回合）隨正式版出貨
- 影響：Steam 正式版玩家可無限刷靈魂與 Steam 成就；標題畫面輸入 `8989889` 還會直接疊出商店介面（`devKillEnemy` 只擋 ATTACKING 狀態）
- 修復方案：keydown 作弊監聽、5 連點開 dev modal、`window.devApplyShackle` / `devRemoveShackle` / `devKillEnemy` / `devSetDice` / `devGetAllRelics` / `devDamagePlayer` / `devSetEnemyTurnsOne` 全部收進 `IS_DEV` 閘門（比照既有 `3345678` 的做法）。dev modal HTML 可保留（沒有入口即無法開啟），或由打包腳本移除，擇一
- 驗收：正式打包後 5 連點與作弊碼皆無反應；localhost 開發環境功能照舊

#### H2. 通關最終 Boss 拿不到靈魂與傳說掉落
- 位置：`js/main.js:2677` — `fireAttack` 擊敗第 10 關（level 9）直接呼叫 `gameWin()`，跳過 `enemyDefeated()`
- 影響：`enemyDefeated()` 內寫好的 Boss 獎勵（2 靈魂＋輪迴契約加成＋傳說遺物掉落，`js/main.js:2939-2965`）在正常遊玩永遠走不到；正常通關 = 0 靈魂，契約的靈魂加成在通關場完全無效。只有點「進入無限塔」才補走 `enemyDefeated()`
- 修復方案（需與韻西確認擇一）：
  - 方案 A（建議）：`fireAttack` 擊敗 level 9 時改走 `enemyDefeated()`，由其內部既有的 `nextStep = gameWin` 分支收尾（該分支本來就是為此寫的）
  - 方案 B：在 `gameWin()` 內補發靈魂與掉落
- 注意：方案 A 需回歸「通關→進無限塔」流程，確認不會重複發放靈魂（`btn-infinite` 目前會再呼叫一次 `enemyDefeated()`，需一併梳理）
- 驗收：正常通關獲得 2＋契約靈魂與一件傳說掉落；進無限塔不重複發放

### 中嚴重度

#### M1. 重型破壞鉗無法還原【枯萎】/【時間壓縮】效果
- 位置：`js/main.js:1970-1983` — `loadStage` 先套 wither（HP 強制 1）/ timecompress（回合 2），之後才檢查 cons_pliers 移除枷鎖；移除時 meta 已清空，還原邏輯永不執行
- 影響：玩家消耗鉗子、枷鎖顯示移除，但 HP 整關卡 1 / 回合仍為 2
- 修復方案：把 cons_pliers 檢查移到套用枷鎖效果**之前**（緊接 `assignShackleForStage` 之後）
- 驗收：持鉗進入 wither / timecompress 關卡，HP 與回合數皆為正常值

#### M2. 【弒神】枷鎖（shackle_godslayer）為半成品、實際零效果
- 位置：`js/engine.js:168` 檢查 `sh.suppressMythic`，但 `js/main.js:2388-2393` 組出的 shackleConfig 只含 `{id, ...meta}`，不含 SHACKLE_DB 的 `suppressMythic`；且其 type 為 `relic_suppress`，抽選只認 light/heavy（`js/main.js:1820`），永遠不會自然出現
- 修復方案（**需製作人決策**）：
  - 方案 A：完成它——shackleConfig 合併 SHACKLE_DB 屬性（或 engine 改由 id 查表），並決定是否納入 heavy 抽選池
  - 方案 B：確定不上線——自 SHACKLE_DB 移除或明確標記為停用，避免 dev 面板套用後產生「顯示 OFF 但照樣生效」的誤導
- 驗收：依決策而定

#### M3. A/B/C/D 區藥水行為與敘述不符，空區白拿 3 倍
- 位置：`js/engine.js:720-723` — 語系寫「倍率額外 x2.0」，實作是 `multi += 2.0`，且不檢查該區是否有牌型（區為「無」時 1.0→3.0 直接進乘算；四瓶全買空盤面可白拿 81 倍）
- 修復方案（**需製作人決策數值語意**）：
  - 只在 `tag.name !== '無'` 時生效（必修）
  - 「+2.0」與「x2.0」擇一：改實作或改四語系文案（若改文案需同步 en/ja/zh-cn/zh-tw 四檔）
- 驗收：空區不再產生額外倍率；文案與實作一致

#### M4. 【噪音】枷鎖下點遺物圖示 TypeError
- 位置：`js/ui.js:551` — inline onclick 呼叫 `window.showToast(...)`，但 showToast 從未掛上 window
- 修復方案：在 ui.js 加 `window.showToast = showToast;`（或 inline 改走既有全域函式）
- 驗收：噪音枷鎖下點「????」圖示跳出干擾提示

#### M5. 【血色聖戰】骰面角標顯示錯誤（引用不存在的遺物 id）
- 位置：`js/ui.js:734-748` — 檢查不存在的 `fusion_titan` / `fusion_bloody`（正確為 `fusion_blood_crusade`），失血硬編碼 `3 - player.hp` 不看 maxHp；另 `js/engine.js:203` 的 `fusion_peak` 為死碼（遊戲無金幣系統，`env.gold` 恆為 undefined）
- 修復方案：renderDice 改用 `fusion_blood_crusade` 並比照 engine 公式（2 → 30、每失 1 HP 全骰 +10，用 `window.getMaxHp()`）；刪除 fusion_titan / fusion_bloody / fusion_peak 死碼
- 驗收：持血色聖戰時角標與 engine 結算一致

#### M6. 舊存檔續玩被強塞最高輪迴契約
- 位置：`js/main.js:1075-1078` — `contractLevel` 欄位缺失時 fallback 為 `metaData.upgrades.soulBurst`（最高解鎖契約），敵人 HP 隨之暴增
- 修復方案：fallback 改為 `0`
- 驗收：手動刪除存檔 JSON 的 contractLevel 欄位後續玩，敵人 HP 為未加成數值

#### M7. 語言切換 subscribe 回呼呼叫三個不存在的 window 函式
- 位置：`js/main.js:1152-1158` — `window.renderHistoryModal()` / `window.renderCollectionModal()` / `window.renderSoulsModal()` 從未定義；且 renderSoulsModal 需要 metaData 參數
- 影響：對應 modal 開著時切語言會 TypeError、語言切換半套（現行 UI 較難同時觸發，但屬純壞掉的程式路徑）
- 修復方案：改呼叫 UI 模組內的實際函式並帶正確參數（history 需重讀 HISTORY_KEY、souls 帶 metaData、collection 走既有 updateTabUI 邏輯），或將三者正式掛上 window
- 驗收：開啟各 modal 時切換語言，內容即時更新且無 console 錯誤

#### M8. 菁英怪在無遺物可掉時連靈魂都不給
- 位置：`js/main.js:2966-2971` — 靈魂發放寫在「有掉落」分支；`availableForShop` 為空時一般模式菁英怪 `earnedSouls = 0`
- 修復方案：else 分支補上一般模式菁英怪的 1 靈魂（＋契約加成）
- 驗收：dev 全遺物後擊敗菁英怪仍獲得靈魂

### 低嚴重度

| 編號 | 問題 | 位置 | 建議 |
|---|---|---|---|
| L1 | 【黑洞】下 8 被當 1 結算，牌型高亮以值配對而錯位（純顯示） | `js/main.js:2408`、`js/engine.js:16` | applyMatch 改以骰子 id 配對，或黑洞時視覺同步顯示 1 |
| L2 | 【天譴】只認 rarity 4「傳說」，rarity 5「再生」牌型不觸發 | `js/main.js:2582` | **製作人裁定**：照字面維持或改 `>= 4` |
| L3 | i18n 硬編碼：「商店已經被你買空了！」、契約前綴 `"LV."+"層"` | `js/ui.js:1639`、`js/main.js:52-58` | 移入四語系 key |
| L4 | 【平庸之惡】postCalc 在 D 區藥水加成後執行，洗掉藥水 +2 | `js/engine.js:54-58` | 調整 hook 順序或接受現狀（影響極小） |
| L5 | executeRoll 動畫前先扣次數並存檔，375ms 內關遊戲會白扣一次重骰 | `js/main.js:2318-2325` | 動畫收尾後再存檔 |
| L6 | 存檔損毀時點「繼續旅程」黑畫面軟鎖 | `js/main.js:1118`、`1176` | loadGame 失敗時退回標題並提示 |
| L7 | i18n.js 各語系 ui 區塊有重複 key 宣告（後者覆蓋前者） | `js/i18n.js` 多處 | 清理重複，無行為變更 |
| L8 | Electron bibi:// 路徑檢查 `startsWith(root)` 未加路徑分隔符 | `steam-app/main.js:63` | 改 `startsWith(root + path.sep)`，本機低風險 |
| L9 | `crypto.randomUUID()` 於非 https 環境不存在，saveMetaData 直接拋錯 | `js/platform/runtime.js:33` | 加 fallback（僅影響 http 測試環境） |

### 已查核無問題（供韻西參考、免重工）

- 四語系 key 與 `data.js` 全部 id（relics/consumables/shackles/enemies/monsters/souls）對齊
- `.promo-card.hidden { display:none !important; }` 修正已在本機 `css/style.css`
- 平台層 `energy.mjs` / `progress.mjs` / `monetization.mjs` 邏輯、Electron IPC 白名單（成就 id 正則、openExternal 網域限制）皆乾淨

## 三、修復計畫（分階段）

原則：**單點突破**，每階段獨立 commit、獨立驗證，不跨 engine/ui/data 無差別重構。M2、M3（數值語意）、L2 需製作人先決策。

### Phase 1 — 上線風險（H1、H2）
- H1：作弊入口全鎖 IS_DEV（main.js、ui.js；index.html 不動）
- H2：通關獎勵路徑修正（建議方案 A），連同 btn-infinite 重複發放梳理
- 驗證：`npm.cmd run steam:package:verify`（**必跑**，改到 UI/邏輯後 exe 才會更新）＋ 手動通關流程

### Phase 2 — 玩家實害（M1、M3、M5、M6、M8）
- 每項獨立 commit；M3 待製作人決策「+2 或 x2」後動工（若改文案需四語系同步 ＋ `npm.cmd run steam:i18n:verify`）
- 驗證：對應驗收條件逐項手測 ＋ `steam:package:verify`

### Phase 3 — 功能修補（M2、M4、M7）
- M2 待製作人決策上線或停用
- 驗證：噪音/弒神枷鎖 dev 套用手測、modal 開啟時切語言無錯誤

### Phase 4 — 低嚴重度清理（L1~L9）
- 可批次處理，L2 待裁定；L3 涉及四語系新 key，需跑 `steam:i18n:verify`

### 分工建議（待與韻西共同規劃時確認）
- 阿扣與韻西依新版協作流程：各自提案 → 異議交換 → 責任表 → 製作人核准後動工；一方實作、另一方唯讀交叉驗收
- 建議切法：Phase 1+2 一人主修另一人驗收，Phase 3+4 對調，避免自己驗自己

## 四、風險與注意事項

- **打包**：任何 UI/邏輯修改後，製作人玩的 `dist/steam-windows/BIBI-DICE.exe` 必須跑 `npm.cmd run steam:package:verify` 才會更新；打包前確認無殘留 BIBI-DICE.exe 行程
- **存檔相容**：M6 只改 fallback，不動存檔結構；H2 不動存檔
- **成就**：H1 修復不影響已解鎖成就；H2 修復後通關會正常觸發 ACH_FIRST_BOSS（原本就有）
- **itch.io / Demo**：修復後 Demo build 與 itch 版是否同步更新，由製作人決定排程
- **不修範圍**：本計畫不動 `promo/`、手機後台設定、Firebase、Steam 商店素材
