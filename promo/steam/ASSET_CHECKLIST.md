# Steam 素材檢查表

## 目標資料夾

建議後續輸出統一放在：

```text
promo/steam/assets/
```

建議命名規則：

```text
store_header_capsule_920x430.png
store_small_capsule_462x174.png
store_main_capsule_1232x706.png
store_vertical_capsule_748x896.png
store_screenshot_01_1920x1080.png
store_screenshot_02_1920x1080.png
store_screenshot_03_1920x1080.png
store_screenshot_04_1920x1080.png
store_screenshot_05_1920x1080.png
```

## 官方必備素材

| 類型 | 尺寸 | 狀態 | 建議來源 |
| --- | --- | --- | --- |
| Header Capsule | 920 x 430 | 已產出第一版 | `img/itch_banner.png` 裁切重排 |
| Small Capsule | 462 x 174 | 已產出第一版 | 使用簡化背景與清楚 Logo |
| Main Capsule | 1232 x 706 | 已產出第一版 | `img/itch_banner.png` |
| Vertical Capsule | 748 x 896 | 已產出第一版 | `img/home_bg.webp` 直式構圖 |
| Screenshots | 至少 5 張，1920 x 1080，16:9 | 已改為桌面直式展示版 6 張 | Playwright 實際遊戲流程 + 直式桌面視窗展示 |
| Shortcut Icon | 256 x 256 `.ico` 或 `.png` | 已產出第一版 | `favicon.png` |
| App Icon | 184 x 184 `.jpg` | 已產出第一版 | `favicon.png` |
| Library Capsule | 600 x 900 | 已產出第一版 | `img/home_bg.webp` 直式構圖，保留中文主視覺 |
| Library Hero | 3840 x 1240 `.png` | 暫不產出 | 先不使用與遊戲關聯不足的素材 |
| Library Logo | 1280 寬或 720 高，透明 `.png` | 已產出第一版 | 從主視覺美術 Logo 擷取 |
| Library Header Capsule | 920 x 430 | 已產出第一版 | `img/itch_banner.png` 裁切重排，保留中文主視覺 |

## 可選素材

| 類型 | 尺寸 | 狀態 | 建議來源 |
| --- | --- | --- | --- |
| Page Background | 1438 x 810 | 缺 | `promo/.../hero-dice-1080.png` 降亮度處理 |
| Event Cover | 800 x 450 | 缺 | 正式發布公告時再做 |
| Event Header | 1920 x 622 | 缺 | 正式發布公告時再做 |

## 現有可用來源

| 檔案 | 尺寸 | 用途判斷 |
| --- | --- | --- |
| `img/itch_banner.png` | 1672 x 941 | 主視覺來源，可裁 Header / Main |
| `img/itch_banner.webp` | 1672 x 941 | 網頁用壓縮版，不建議當 Steam 原始輸出 |
| `promo/bibi-dice-cn-promo/assets/hero-dice-1080.png` | 1920 x 1080 | 可做商店截圖風格素材或頁面背景來源 |
| `promo/bibi-dice-cn-promo/assets/relic-fusion-1080.png` | 1920 x 1080 | 可做影片素材，不建議放入 Steam screenshot 欄位，因為不是實機截圖 |
| `promo/bibi-dice-cn-promo/assets/boss-shackle-1080.png` | 1920 x 1080 | 可做影片素材，不建議放入 Steam screenshot 欄位，因為不是實機截圖 |
| `promo/bibi-dice-cn-promo/renders/bibi-dice-cn-promo.mp4` | 25 秒影片 | 可改剪為 Steam trailer 草稿 |
| `favicon.png` | 待確認 | 可作 icon 來源 |

## Steam 截圖建議清單

Steam screenshot 欄位應使用實際遊戲畫面，建議捕捉：

1. 標題畫面：顯示遊戲名稱與主要入口。
2. 戰鬥中：骰子、牌型、敵人 HP、重骰操作同畫面。
3. 遺物選擇：顯示 Roguelite 構築選擇。
4. 商店與融合：顯示購買、遺物、融合提示或稀有遺物。
5. Boss 枷鎖：顯示限制條件與高壓戰鬥。
6. 無限塔或靈魂奉獻：作為第 6 張備用，顯示長線挑戰或 Meta 成長。

## 已產出截圖

| 檔案 | 尺寸 | 內容 |
| --- | --- | --- |
| `promo/steam/assets/store_screenshot_01_title_1920x1080.png` | 1920 x 1080 | 桌面直式標題畫面 |
| `promo/steam/assets/store_screenshot_02_battle_start_1920x1080.png` | 1920 x 1080 | 桌面直式戰鬥開局 |
| `promo/steam/assets/store_screenshot_03_combo_preview_1920x1080.png` | 1920 x 1080 | 桌面直式牌型與傷害預覽 |
| `promo/steam/assets/store_screenshot_04_rules_table_1920x1080.png` | 1920 x 1080 | 桌面直式牌型倍率表 |
| `promo/steam/assets/store_screenshot_05_relic_shop_1920x1080.png` | 1920 x 1080 | 桌面直式商店與遺物選擇 |
| `promo/steam/assets/store_screenshot_06_soul_offering_1920x1080.png` | 1920 x 1080 | 桌面直式靈魂奉獻 |

## 已產出 Store Capsule 草稿

| 檔案 | 尺寸 | 內容 |
| --- | --- | --- |
| `promo/steam/assets/store_header_capsule_920x430.png` | 920 x 430 | Header Capsule 第一版 |
| `promo/steam/assets/store_small_capsule_462x174.png` | 462 x 174 | Small Capsule 第一版 |
| `promo/steam/assets/store_main_capsule_1232x706.png` | 1232 x 706 | Main Capsule 第一版 |
| `promo/steam/assets/store_vertical_capsule_748x896.png` | 748 x 896 | Vertical Capsule 第一版 |

## 已產出 Library 與 Icon 草稿

| 檔案 | 尺寸 | 內容 |
| --- | --- | --- |
| `promo/steam/assets/library_capsule_600x900.png` | 600 x 900 | Library Capsule 第一版，未疊英文 Logo |
| `promo/steam/assets/library_header_capsule_920x430.png` | 920 x 430 | Library Header 第一版，未疊英文 Logo |
| `promo/steam/assets/library_logo_1280x720.png` | 1280 x 720 | 從主視覺美術字擷取的透明 Library Logo 第一版 |
| `promo/steam/assets/shortcut_icon_256x256.png` | 256 x 256 | Shortcut Icon 第一版，直接轉出 favicon |
| `promo/steam/assets/app_icon_184x184.jpg` | 184 x 184 | App Icon 第一版，直接轉出 favicon |

## 素材製作注意

- Store capsule 基礎圖只能放遊戲美術、遊戲名稱與官方副標題。
- Library Hero 暫不產出，避免誤用與遊戲本體關聯不足的宣傳圖。
- 不要在 capsule 上寫「免費 Demo」、「Wishlist Now」、「新內容」等行銷字，除非使用 Steam Artwork Override。
- Screenshot 欄位不要放宣傳合成圖、概念圖、文案圖或影片劇照。
- Demo 獨立頁面的 capsule 需要清楚辨識它是 Demo；這點要靠 Steam Demo 設定與可接受的 Demo 標識處理，正式輸出前再依 Steamworks 後台檢查。
- 至少 4 張截圖需確認適合全年齡顯示，讓 Steam 能在更多區塊展示。

## 下一步

1. 檢查 6 張桌面直式展示截圖是否適合 Steam 頁面排序。
2. 檢查小膠囊 `462 x 174` 的 Logo 可讀性。
3. 依 Steamworks 後台預覽調整 Store Capsule 與 Library Capsule 裁切。
4. 製作 Page Background 與第一篇 Steam 公告用 Event Cover。
