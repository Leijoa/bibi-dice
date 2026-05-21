# Steam 素材最終盤點

最後更新：2026-05-21  
盤點者：阿扣、鑀韻東  
盤點範圍：`promo/steam/assets/` 目錄下所有檔案

---

## 一、可直接上傳的素材清單

以下素材檔案已實際存在、尺寸符合官方規格，可在確認目視品質後上傳。

| 檔案名稱 | 尺寸 | Steam 用途 | 檔案大小 | 備註 |
| --- | --- | --- | --- | --- |
| `store_header_capsule_920x430.png` | 920×430 | Header Capsule | 845 KB | 2026-05-21 已重產 D8 修正版，移除過重暗化層 |
| `store_small_capsule_462x174.png` | 462×174 | Small Capsule | 183 KB | 2026-05-21 已重產 D8 修正版，移除額外英文疊字，中文主視覺 Logo 未被遮擋 |
| `store_main_capsule_1232x706.png` | 1232×706 | Main Capsule | 1.7 MB | 2026-05-21 已重產 D8 修正版，移除過重暗化層 |
| `store_vertical_capsule_748x896.png` | 748×896 | Vertical Capsule | 1.2 MB | 2026-05-21 已重產 D8 修正版，移除過重暗化層 |
| `library_capsule_600x900.png` | 600×900 | Library Capsule | 1013 KB | 2026-05-21 已重產 D8 修正版 |
| `library_header_capsule_920x430.png` | 920×430 | Library Header | 830 KB | 2026-05-21 已重產 D8 修正版 |
| `library_logo_1280x720.png` | 1280×720 | Library Logo | 469 KB | 透明 Logo，維持原主視覺美術字擷取 |
| `store_screenshot_01_title_1920x1080.png` | 1920×1080 | Store Screenshot #1 | 1.4 MB | 桌面直式標題畫面 |
| `store_screenshot_02_battle_start_1920x1080.png` | 1920×1080 | Store Screenshot #2 | 917 KB | 桌面直式戰鬥開局 |
| `store_screenshot_03_combo_preview_1920x1080.png` | 1920×1080 | Store Screenshot #3 | 910 KB | 桌面直式牌型與傷害預覽 |
| `store_screenshot_04_rules_table_1920x1080.png` | 1920×1080 | Store Screenshot #4 | 614 KB | 桌面直式牌型倍率表（需目視確認，見第五區）|
| `store_screenshot_05_relic_shop_1920x1080.png` | 1920×1080 | Store Screenshot #5 | 713 KB | 桌面直式商店與遺物選擇 |
| `store_screenshot_06_soul_offering_1920x1080.png` | 1920×1080 | Store Screenshot #6 | 653 KB | 桌面直式靈魂奉獻 |
| `shortcut_icon_256x256.png` | 256×256 | Shortcut Icon | 33 KB | 2026-05-21 已由 AI 重生 favicon 重產 |
| `app_icon_184x184.jpg` | 184×184 | App Icon | 8.2 KB | 2026-05-21 已由 AI 重生 favicon 重產 |

---

## 二、製作人目視確認結果（2026-05-21）

依 `STEAM_OWNER_DECISIONS.md` 第六區製作人回覆同步：

| 編號 | 檔案名稱 | 用途 | 目視結果 | 後續處理 |
| --- | --- | --- | --- | --- |
| F-01 | `library_capsule_600x900.png` | Library Capsule | ✅ 製作人確認通過 | 改用 D8 主視覺源圖，降低暗角與暗化層 |
| F-02 | `library_header_capsule_920x430.png` | Library Header | ✅ 製作人確認通過 | 同 F-01 |
| F-03 | `library_logo_1280x720.png` | Library Logo（透明） | ✅ 通過 | 可上傳 |
| F-04 | `store_header_capsule_920x430.png` | Store Header Capsule | ✅ 製作人確認通過 | 改用 D8 主視覺源圖，降低暗化層 |
| F-05 | `store_small_capsule_462x174.png` | Store Small Capsule | ✅ 製作人確認通過 | 同 F-04 |
| F-06 | `store_main_capsule_1232x706.png` | Store Main Capsule | ✅ 製作人確認通過 | 同 F-04 |
| F-07 | `store_vertical_capsule_748x896.png` | Store Vertical Capsule | ✅ 製作人確認通過 | 改用 D8 直式主視覺源圖，降低暗化層 |
| F-08 | `shortcut_icon_256x256.png` | Shortcut Icon | ✅ 已重產修正版 | 由鑀韻東以 AI 生成新 favicon，再輸出 256×256 PNG |
| F-09 | `app_icon_184x184.jpg` | App Icon | ✅ 已重產修正版 | 由鑀韻東以 AI 生成新 favicon，再輸出 184×184 JPG |
| F-10 | `store_screenshot_01~06` | Store Screenshots | ✅ 全部通過（含 #4 牌型倍率表保留）| 可上傳 |

### 待處理動作

1. **D8 Capsule 修正版最終目視**（F-01/02/04~07 共 6 張）：2026-05-21 已改用 `promo/steam/source/key_art_d8_banner.png` / `key_art_d8_portrait.png` 重產，並降低腳本暗化層；製作人已確認通過，可上傳
2. **Icon 重新設計**（F-08/F-09）：已於 2026-05-21 重生 `favicon.png` 並重產 256×256 PNG 與 184×184 JPG；仍建議製作人最後目視確認

---

## 三、暫不製作或不要誤用的素材

| 素材 | 原因 | 規則 |
| --- | --- | --- |
| `library_hero_3840x1240.png` | 與遊戲本體關聯不足，製作人已刪除 | **絕對不要重產**，`npm.cmd run steam:library` 已移除此輸出 |
| 宣傳合成圖（`hero-dice-1080.png`、`relic-fusion-1080.png`、`boss-shackle-1080.png`） | 這些是宣傳用合成素材，非實機截圖 | **不可放入 Steam screenshot 欄位**；可用於影片或其他宣傳材料 |
| Page Background（1438×810） | 目前缺，優先度低 | 非必要，正式上架前再評估 |
| Event Cover / Event Header | 僅在發布公告時需要 | 正式發布前再製作 |

---

## 四、缺口素材與建議優先順序

### 已修正缺口

| 素材 | 官方尺寸 | 重產指令 | 優先度 |
| --- | --- | --- | --- |
| `store_header_capsule_920x430.png` | 920×430 | `npm.cmd run steam:capsules` | ✅ 已補齊修正版 |
| `store_small_capsule_462x174.png` | 462×174 | `npm.cmd run steam:capsules` | ✅ 已補齊修正版 |
| `store_main_capsule_1232x706.png` | 1232×706 | `npm.cmd run steam:capsules` | ✅ 已補齊修正版 |
| `store_vertical_capsule_748x896.png` | 748×896 | `npm.cmd run steam:capsules` | ✅ 已補齊修正版 |

> 2026-05-21 已執行 `npm.cmd run steam:capsules` 重產四張 Store Capsule，並以 `steam:assets:verify` 驗證尺寸皆符合官方規格。修正版已移除腳本額外疊上的英文 `BIBI DICE` 與 `bibi-dice` 膠囊副標，避免遮住中文主視覺 Logo。後續又改用 D8 修正版 Steam 專用主視覺源圖，修正角色手上骰子不真實與整體偏暗問題。

### 選擇性缺口（可暫緩）

| 素材 | 官方尺寸 | 優先度 | 說明 |
| --- | --- | --- | --- |
| Page Background | 1438×810 | 🟡 低 | 非必要，但能加強商店頁視覺 |
| Steam Trailer 影片 | MP4 | 🟡 低 | 有 25 秒草稿可剪，製作人決定 |

---

## 五、Steam 截圖排序建議

目前 6 張截圖排序如下，建議評估第 4 張是否替換：

| 順序 | 檔案 | 內容 | 評估 |
| --- | --- | --- | --- |
| #1 | `store_screenshot_01_title_1920x1080.png` | 標題畫面 | ✅ 適合首位，建立第一印象 |
| #2 | `store_screenshot_02_battle_start_1920x1080.png` | 戰鬥開局 | ✅ 直接展示核心玩法 |
| #3 | `store_screenshot_03_combo_preview_1920x1080.png` | 牌型與傷害預覽 | ✅ 展示倍率爆發賣點 |
| #4 | `store_screenshot_04_rules_table_1920x1080.png` | 牌型倍率表彈窗 | ⚠️ 說明性介面，建議考慮替換為 Boss 枷鎖戰鬥截圖 |
| #5 | `store_screenshot_05_relic_shop_1920x1080.png` | 商店與遺物選擇 | ✅ 展示 Roguelite 構築賣點 |
| #6 | `store_screenshot_06_soul_offering_1920x1080.png` | 靈魂奉獻 | ✅ 展示長線成長系統 |

**建議：**
- 若製作人認為第 4 張（牌型倍率表）對玩家理解遊戲有幫助，可保留。
- 若希望畫面更有張力，可考慮重新抓一張 Boss 枷鎖戰鬥截圖（`npm.cmd run steam:capture` 重抓後手動選圖替換）。
- Steam 要求至少 5 張截圖，目前有 6 張已超過最低需求。

---

## 六、全年齡顯示風險檢查

Steam 截圖中，至少 4 張需適合全年齡顯示，讓 Steam 能在更多區塊展示。

| 項目 | 判定 | 說明 |
| --- | --- | --- |
| 血腥或暴力畫面 | ✅ 無風險 | 遊戲為抽象骰子戰鬥，無血腥演出 |
| 成人內容 | ✅ 無風險 | 無相關內容 |
| 恐怖或驚嚇 | ✅ 無風險 | Boss 枷鎖為限制條件機制，非恐怖元素 |
| 強烈語言 | ✅ 無風險 | 遊戲文字無不適當詞彙（需製作人確認各語系） |
| 賭博元素爭議 | ✅ 低風險 | 骰子為策略構築機制，非真實賭博；但若截圖中有金幣或籌碼意象，需注意標示方式 |

**結論：** 目前 6 張截圖均應可通過全年齡顯示檢查，製作人目視確認後即可採用。

---

## 七、AI 生成素材揭露提醒

依 Steam 後台規定，若任何遊戲或商店素材使用 AI 工具生成，需在後台勾選揭露。

| 素材來源 | AI 生成疑慮 | 需製作人確認 |
| --- | --- | --- |
| 6 張 Store Screenshot | Playwright 自動擷取實機畫面 | 否（截圖為程式自動產出，非 AI 生成） |
| Store Capsule | 來自 `promo/steam/source/key_art_d8_banner.png`、`promo/steam/source/key_art_d8_portrait.png` | 是，D8 修正版主視覺為 AI 編修生成 |
| Library Capsule / Header | 來自 `promo/steam/source/key_art_d8_banner.png`、`promo/steam/source/key_art_d8_portrait.png` | 是，D8 修正版主視覺為 AI 編修生成 |
| Library Logo | 從主視覺美術字擷取 | **需確認主視覺美術字是否含 AI 生成** |
| Shortcut Icon / App Icon | 從 2026-05-21 重生的 `favicon.png` 轉出 | 是，favicon 來源含 AI 生成，需在 Steamworks AI 揭露中說明 |

> 若任一素材確認為 AI 生成，需在 Steamworks 後台「AI 生成內容揭露」欄位說明使用情境。

---

## 附錄：自動驗證指令

```powershell
npm.cmd run steam:assets:verify
```

此指令會檢查：

- 15 個 Steam 必要素材是否存在
- 每張素材尺寸是否符合目前文件定義
- `library_hero_3840x1240.png` 是否維持不存在，避免誤用

注意：此指令只驗證檔案存在與尺寸，無法判斷文字遮擋。Store / Library 圖仍需製作人目視確認「英文不要遮住中文主視覺 Logo」。

## 附錄：盤點執行步驟建議

1. 執行 `npm.cmd run steam:assets:verify` 確認素材檔案與尺寸
2. 目視確認所有素材品質（逐項核對第二區清單）
3. 製作人確認第 4 張截圖是否保留或替換
4. 製作人確認各素材 AI 生成狀態
5. 完成後更新 `promo/steam/STEAM_RELEASE_CHECKLIST.md` 第一區素材確認項目
