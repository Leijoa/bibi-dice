# Steamworks 後台填寫包

最後更新：2026-05-23  
撰寫者：阿扣  
適用對象：製作人雷爪獅（Steamworks 帳號審核通過後照表貼上）

---

## 0. 本檔用法

本檔把所有「**現在已可貼上**」的文字、檔案路徑與設定值集中在一處。製作人帳號審核通過、建立 App 後，**從第 1 區到第 14 區依序貼**，即可完成 95% 後台填寫。

**仍需後台手動操作的部分**會明確標示「⚠️ 後台動作」。

> 跨檔對照：本檔 = 摘要 + 貼上用值；細節留在 `STEAMWORKS_FIELDS_DRAFT.md`、`STEAMPIPE_DEPOT_DRAFT.md`、`STEAM_ASSET_FINAL_AUDIT.md`、`STEAMWORKS_ONBOARDING_FLOW.md`。

---

## 1. App 名稱與基本資訊

| Steam 後台欄位 | 直接貼上 |
| --- | --- |
| App 名稱（英文）| `BIBI DICE` |
| App 名稱（繁體中文）| `比比丟八` |
| Demo App 名稱 | `比比丟八 Demo` |
| Developer | `雷爪獅` |
| Publisher | `雷爪獅` |
| Homepage URL | `https://leijoa.itch.io/bibi-dice` |
| Privacy Policy URL | `https://github.com/Leijoa/bibi-dice/blob/main/promo/steam/PRIVACY_POLICY.md` |

⚠️ **後台動作**：先建立 Base Game App（支付 US$100 App Fee），記下 Base AppID；再「Add a Demo」取得 Demo AppID 與 Demo DepotID（後續 SteamPipe 用）。

---

## 2. 短描述（300 字元上限）

### 繁體中文

```
擲出 8 顆骰子，湊牌型、疊倍率、拿遺物，在有限回合內擊敗敵人的骰子構築 Roguelite。
```

### 簡體中文

```
掷出 8 颗骰子，凑牌型、叠倍率、拿遗物，在有限回合内击败敌人的骰子构筑 Roguelite。
```

### English

```
Roll eight dice, build scoring hands, stack multipliers, and defeat enemies in a compact dice-building roguelite.
```

### 日本語

```
８つのダイスを振り、役を揃えて倍率を積み上げ、レリックを集め、限られたターンで敵を倒すダイス構築ローグライト。
```

---

## 3. 長描述（支援 BBCode）

### 繁體中文版 — 直接貼

```
[h2]擲骰、湊牌、爆發[/h2]
每一局都從 8 顆骰子開始。在有限的重骰次數中，保留關鍵骰面、放棄風險點數，湊出牌型、推高倍率，把傷害推向失控的連鎖爆發。

[h2]遺物構築[/h2]
戰鬥後取得遺物，改變骰子、分數、傷害、資源與生存節奏。部分遺物能與指定素材融合，轉化成更稀有、更極端的流派核心。

[h2]Boss 枷鎖[/h2]
Boss 戰引入限制條件，迫使你在壓力下調整當前流派。

[h2]靈魂奉獻[/h2]
擊敗強敵可獲得靈魂，用於局外永久強化，讓每次重開都比上一次走得更遠。

[h2]無限塔[/h2]
通關主要挑戰後，進入無限塔測試構築極限，沒有盡頭。

[list]
[*] 8 顆骰子的牌型構築與倍率爆發
[*] 短局制 Roguelite，容易重開
[*] 遺物、消耗品、融合遺物帶來差異化流派
[*] Boss 枷鎖提供高壓進階挑戰
[*] 靈魂奉獻帶來跨局長線成長
[*] 無限塔供通關後繼續挑戰
[*] 支援繁體中文、簡體中文、英文、日文
[/list]
```

### English Version — 直接貼

```
[h2]Roll, Build, Explode[/h2]
Each run starts with eight dice. Spend your limited rerolls wisely — hold the right faces, drop the risky ones, form scoring hands, and push your multiplier toward a chain of escalating damage.

[h2]Relic Crafting[/h2]
Pick up relics after each fight to reshape how your dice, score, damage, and resources work. Some relics can fuse with specific materials into rarer, more extreme build cores.

[h2]Boss Shackles[/h2]
Boss fights introduce restrictions that force you to adapt your build on the spot.

[h2]Soul Offering[/h2]
Defeat strong enemies to earn souls. Spend them on permanent upgrades outside of runs, so every attempt goes a little further.

[h2]Infinite Tower[/h2]
Clear the main challenge, then keep climbing. No ceiling.

[list]
[*] Eight-dice hand-building with multiplier bursts
[*] Short runs, easy to restart
[*] Relics, consumables, and fusion relics create distinct builds
[*] Boss shackles add high-pressure advanced challenges
[*] Soul offering provides long-term cross-run growth
[*] Infinite Tower for post-clear depth
[*] Supports Traditional Chinese, Simplified Chinese, English, and Japanese
[/list]
```

---

## 4. 「關於此遊戲」區塊

可直接重複使用第 3 區長描述。Steam 後台「關於此遊戲」與「長描述」在 Base Game 頁通常是同一欄位。

---

## 5. 「關於此 Demo」（Demo 頁專用）

### 繁體中文

```
這是 BIBI DICE 比比丟八 的免費試玩版，包含完整核心玩法：

[list]
[*] 完整 10 關主要挑戰流程
[*] 最終 Boss 與 Boss 枷鎖
[*] 無限塔（通關後可繼續挑戰）
[*] 遺物取得、消耗品與融合遺物
[*] 靈魂奉獻局外成長
[*] 收集冊與歷史牌局
[*] 教學與玩法說明
[*] 繁體中文、簡體中文、英文、日文
[/list]

Demo 不包含 Steam 成就或雲端存檔，此功能將於正式版加入。
```

### English

```
This is the free demo of BIBI DICE, featuring the full core experience:

[list]
[*] Complete 10-stage main challenge
[*] Final Boss with shackle mechanics
[*] Infinite Tower (available after clearing the main run)
[*] Relics, consumables, and fusion relics
[*] Soul Offering for cross-run upgrades
[*] Collection book and run history
[*] Tutorial and gameplay guide
[*] Traditional Chinese, Simplified Chinese, English, and Japanese
[/list]

Steam achievements and cloud saves are not included in the demo and will be added in the full release.
```

---

## 6. 定價與 Demo 免費設定

| 項目 | 值 | 備註 |
| --- | --- | --- |
| 正式版基準價 | `US$2.99` | Steam 後台 Pricing → 選 USD 2.99，其他區域用 Steam 自動建議 |
| Demo 售價 | `Free` | Demo App 後台直接勾「Free Demo」|
| 區域定價 | 採 Steam 建議 | 後台會自動產出各區域建議價，照接受即可 |

⚠️ **後台動作**：填價後送 Pricing Review，通常即時通過。

---

## 7. 支援語言

Steam 後台 Localization → Supported Languages 勾以下：

| 語言 | Interface | Full Audio | Subtitles |
| --- | --- | --- | --- |
| Traditional Chinese | ✅ | ☐ | ☐ |
| Simplified Chinese | ✅ | ☐ | ☐ |
| English | ✅ | ☐ | ☐ |
| Japanese | ✅ | ☐ | ☐ |

> Demo 無語音對白，Audio / Subtitles 維持不勾。  
> 介面四語已通過 `npm.cmd run steam:i18n:verify`（601 keys × 4 完全對齊）。

---

## 8. 標籤建議（共 19 個）

### 核心標籤（12 個）— 必填

| 順序 | Steam 標籤名 | 備註 |
| --- | --- | --- |
| 1 | Roguelite | 主類型 |
| 2 | Dice | 核心玩法 |
| 3 | Deckbuilding | 遺物構築 |
| 4 | Strategy | 策略深度 |
| 5 | Turn-Based | 回合制 |
| 6 | Score Attack | 倍率堆疊 |
| 7 | Replay Value | 高重玩性 |
| 8 | Singleplayer | 單人 |
| 9 | Casual | 短局 |
| 10 | Indie | 獨立 |
| 11 | Mini Game / Short | 製作人新增「小遊戲」（後台搜尋對應官方標籤）|
| 12 | Mouse only | 製作人新增「僅滑鼠」（後台搜尋對應官方標籤）|

### 備用標籤（7 個）— 視情況補入

| 順序 | Steam 標籤名 |
| --- | --- |
| 13 | Card Game |
| 14 | Tabletop |
| 15 | 2D |
| 16 | Cute |
| 17 | Difficult |
| 18 | Resource Management |
| 19 | Fantasy |

⚠️ **後台動作**：Steam 後台標籤需在 Tags 頁逐個搜尋並勾選；標籤上限 20 個。

---

## 9. AI 生成素材揭露

⚠️ **後台動作**：勾選「This product was created with the help of generative AI」並貼上以下文字。

### 繁體中文（建議貼於後台主要揭露欄位）

```
本遊戲於開發過程中使用了 AI 生成工具，協助製作部分美術素材（含主視覺底圖、Steam Capsule 主視覺修正版、部分角色／環境圖與應用程式 icon）與部分 BGM / SFX。所有 AI 生成內容均經過人工挑選、修整與整合，最終呈現由人類開發者把關。商店截圖均為實機畫面自動擷取，未使用 AI 生成。
```

### English（建議併呈）

```
This game uses AI-assisted generation for some art assets (including key visual backgrounds, revised Steam Capsule key art, portions of character/environment art, and the application icon) and parts of BGM/SFX. All AI-generated content has been curated, refined, and integrated by the developer. Store screenshots are captured directly from in-game footage and contain no AI-generated images.
```

### 對照清單（後台問卷對應）

| 類型 | 答案 | 說明 |
| --- | --- | --- |
| Pre-Generated Art | **是** | Capsule、Library 圖、Logo、icon |
| Pre-Generated Audio | **部分** | 部分 BGM / SFX |
| Pre-Generated Text | 否 | 全部文字由製作人撰寫 |
| Live-Generated Content | 否 | 遊戲執行期不呼叫 AI |

---

## 10. IARC 年齡分級問卷答案

⚠️ **後台動作**：完成 IARC 問卷後，PEGI / ESRB / USK 等分級會自動套用。

| 編號 | 問題 | 本次答案（Demo 送審時用）|
| --- | --- | --- |
| E-01 | 真實賭博 / 賭場 | 否 |
| E-02 | 模擬賭博（撲克 / 骰子賭注）| 否 |
| E-03 | 血腥 / 暴力 | 否 |
| E-04 | 恐怖 / 驚嚇 | 否 |
| E-05 | 成人內容（性、裸露）| 否 |
| E-06 | 強烈語言 / 髒話 | 否 |
| E-07 | 藥物 / 毒品 | 否 |
| E-08 | 遊戲內購買 | **否（Demo 內無購買機制）** |
| E-09 | 玩家間互動 / PvP | 否 |
| E-10 | 收集個人資料 / 上傳分析 | **是**（觸發 Privacy Policy URL 需求）|

### 關鍵備註

- **E-08 將來變更**：正式版預計加入購買機制，正式版送審時 E-08 答「是」並重做問卷。Demo 階段照 Demo 內容如實回答。
- **E-10 = 是** → 必須在後台填入 Privacy Policy URL（第 1 區）。

---

## 11. Steam 素材檔案清單

所有素材已存在於 `D:\unity\bibi-dice\promo\steam\assets\`，可直接拖曳上傳。

### Store Assets（公開商店頁）

| 後台欄位 | 檔案路徑 | 尺寸 |
| --- | --- | --- |
| Header Capsule | `promo/steam/assets/store_header_capsule_920x430.png` | 920×430 |
| Small Capsule | `promo/steam/assets/store_small_capsule_462x174.png` | 462×174 |
| Main Capsule | `promo/steam/assets/store_main_capsule_1232x706.png` | 1232×706 |
| Vertical Capsule | `promo/steam/assets/store_vertical_capsule_748x896.png` | 748×896 |
| Screenshot #1 | `promo/steam/assets/store_screenshot_01_title_1920x1080.png` | 1920×1080 |
| Screenshot #2 | `promo/steam/assets/store_screenshot_02_battle_start_1920x1080.png` | 1920×1080 |
| Screenshot #3 | `promo/steam/assets/store_screenshot_03_combo_preview_1920x1080.png` | 1920×1080 |
| Screenshot #4 | `promo/steam/assets/store_screenshot_04_rules_table_1920x1080.png` | 1920×1080 |
| Screenshot #5 | `promo/steam/assets/store_screenshot_05_relic_shop_1920x1080.png` | 1920×1080 |
| Screenshot #6 | `promo/steam/assets/store_screenshot_06_soul_offering_1920x1080.png` | 1920×1080 |

### Library Assets（玩家收藏庫顯示）

| 後台欄位 | 檔案路徑 | 尺寸 |
| --- | --- | --- |
| Library Capsule | `promo/steam/assets/library_capsule_600x900.png` | 600×900 |
| Library Header Capsule | `promo/steam/assets/library_header_capsule_920x430.png` | 920×430 |
| Library Logo（透明）| `promo/steam/assets/library_logo_1280x720.png` | 1280×720 |
| Library Hero | **不上傳**（製作人決定停用，不要重產 `library_hero_3840x1240.png`）| — |

### Icon 類

| 後台欄位 | 檔案路徑 | 尺寸 |
| --- | --- | --- |
| Shortcut Icon | `promo/steam/assets/shortcut_icon_256x256.png` | 256×256 |
| App Icon | `promo/steam/assets/app_icon_184x184.jpg` | 184×184 |

### 自動驗證指令

```powershell
npm.cmd run steam:assets:verify
```

> 該指令會檢查 15 個必要素材存在 + 尺寸正確 + 確認 `library_hero_3840x1240.png` 不存在。已通過。

### 選擇性素材（製作人決定，目前未產出）

- Page Background（1438×810）— B-05 製作人決定先做、看效果再決定
- Steam Trailer 影片 — B-06 同上

---

## 12. Demo Build 上傳（SteamPipe）

### Build 來源

| 項目 | 值 |
| --- | --- |
| **SteamPipe ContentRoot** | `D:\unity\bibi-dice\dist\steam-windows`（**不是** `dist/steam-demo`，後者是純 web 內容）|
| 主執行檔 | `BIBI-DICE.exe` |
| 重建指令 | `npm.cmd run steam:package:verify`（含打包 + 自動驗證 EXE 可啟動）|
| 內含 | Electron runtime + `resources/app/steam-app/main.js` + `resources/app/dist/steam-demo/*` |

### Demo App → Installation → Launch Option

| 欄位 | 值 |
| --- | --- |
| Executable | `BIBI-DICE.exe` |
| Arguments | （留空）|
| Working Directory | （留空，預設 install dir）|
| Launch Type | `Launch (Default)` |
| OS | Windows |

### SteamPipe 流程摘要

依製作人決定（C-03 / C-04 / C-05）：

1. ⚠️ **後台動作**：先在 Demo App 取得 `{{DEMO_APPID}}` 與 `{{DEMO_DEPOTID}}`
2. **本機**：填入 `STEAMPIPE_DEPOT_DRAFT.md` 第 2 區「填空參數」（含 `{{WIN_BUILD_DIR}}` = `D:\unity\bibi-dice\dist\steam-windows`）
3. **本機**：依 `STEAMPIPE_DEPOT_DRAFT.md` 第 4 區建立 VDF 檔到 `D:\unity\bibi-dice\steam-build\`（此目錄已在 `.gitignore`）
4. **本機**：跑 `npm.cmd run steam:package:verify` 確認 build 就緒
5. **本機**：跑 steamcmd `+run_app_build` 上傳
6. ⚠️ **後台動作**：SetLive 到 `internal` branch
7. **本機**：用 Steam 客戶端切換到 `internal` branch 自測
8. ⚠️ **後台動作**：自測通過後 SetLive 到 `default`

> 詳細指令範本見 `STEAMPIPE_DEPOT_DRAFT.md` 第 4~6 區。

---

## 13. Coming Soon / Demo 發布排程

| 日期 | 目標 | 動作 |
| --- | --- | --- |
| 2026-06-01 前 | 商店頁素材、文案、Demo Build 準備完成 | 本檔即為素材文案就緒清單 |
| **2026-06-03** | 送 Steam 商店頁審核 | ⚠️ 後台動作：Submit Store Presence Review |
| **2026-06-10** | 公開 Coming Soon 頁 | ⚠️ 後台動作：審核通過後手動公開 |
| 2026-06-10 ~ 2026-06-24 | Coming Soon 公開 2 週（Steam 強制等待）| 期間可上傳 Demo Build、送 Demo 審核 |
| **2026-07-01** | 發布 Demo | ⚠️ 後台動作：Release Demo |

`2026-06-10` 至 `2026-07-01` 間隔 21 天，符合 Steam Coming Soon 公開 ≥ 2 週要求。

⚠️ **隱性阻塞**：
- Steamworks 帳號 / 稅務 / 銀行審核需 5-10 工作天
- App Fee 支付後新 App 有 30 天冷卻期才能發布

---

## 14. 後台填寫順序（建議）

依「**最小阻塞」原則排列**：

1. ✅ 完成稅務 / 銀行（**目前進行中**）
2. ⚠️ 建立 Base Game App，支付 App Fee（**5/23 前完成可避開 30 天冷卻撞 7/1**）
3. 取得 Base AppID
4. 填基本資訊（第 1 區）
5. 填短描述 4 語（第 2 區）
6. 填長描述（第 3 區）+「關於此遊戲」（第 4 區）
7. 設定語言（第 7 區）
8. 設定標籤（第 8 區）
9. 設定定價（第 6 區）
10. 系統需求（見 `STEAMWORKS_FIELDS_DRAFT.md` 第 7 區）
11. 上傳所有素材（第 11 區清單）
12. 完成 IARC 問卷（第 10 區）
13. 填 AI 生成揭露（第 9 區）
14. 填 Privacy Policy URL（第 1 區）
15. 建立 Demo App，取得 Demo AppID / DepotID
16. 填 Demo 頁描述（第 5 區）
17. **2026-06-03** 送 Base Game 商店頁審核
18. **2026-06-10** 公開 Coming Soon 頁
19. 本機完成 VDF + steamcmd 上傳 Demo Build（第 12 區）
20. 後台 SetLive 到 `internal` 自測
21. 送 Demo 審核
22. **2026-07-01** SetLive 到 `default` 並發布 Demo

---

## 附錄：本檔涵蓋範圍與相關文件

| 主題 | 本檔位置 | 詳細文件 |
| --- | --- | --- |
| 商店欄位文字 | 第 1~5 區 | `STEAMWORKS_FIELDS_DRAFT.md` |
| 定價 / 語言 / 標籤 | 第 6~8 區 | `STEAMWORKS_FIELDS_DRAFT.md` 第 5~7 區 |
| AI 揭露 / IARC | 第 9~10 區 | `STEAMWORKS_FIELDS_DRAFT.md` 第 8~9 區 |
| 素材清單 | 第 11 區 | `STEAM_ASSET_FINAL_AUDIT.md` |
| SteamPipe 上傳 | 第 12 區 | `STEAMPIPE_DEPOT_DRAFT.md` |
| 後台 9 階段流程 | 第 14 區 | `STEAMWORKS_ONBOARDING_FLOW.md` |
| 製作人決策來源 | 全檔 | `STEAM_OWNER_DECISIONS.md` |
| 隱私政策正本 | 第 1 區 URL | `PRIVACY_POLICY.md` |
| 上架前完整檢查表 | — | `STEAM_RELEASE_CHECKLIST.md` |
| Demo / 正式版承諾範圍 | — | `FULL_VERSION_SCOPE.md` |

---

## 附錄：仍待製作人決定 / 後續處理

| 項目 | 狀態 | 對策 |
| --- | --- | --- |
| Page Background（B-05）| 製作人決定先補做、看效果再決定 | 補做後再決定是否上傳；非必要 |
| Steam Trailer（B-06）| 製作人決定先剪、看效果再決定 | 剪輯後再決定是否上傳；非必要 |
| itch.io 頁面加入隱私政策連結 | 待製作人登入 itch.io 後台手動加入 | 連結同第 1 區 Privacy Policy URL |
| 正式版送審時 E-08 重評 | 待正式版有購買機制時處理 | 正式版規劃啟動時再回頭做 IARC |
| Library Hero | **不做**（已決定停用）| 不要產 `library_hero_3840x1240.png` |
